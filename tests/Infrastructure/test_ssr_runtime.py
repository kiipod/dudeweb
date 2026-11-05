"""Real Supervisor + built SSR renderer lifecycle checks; run through Sail as sail.

No scheduler jobs run. A separate testing Laravel server is used for public
HTTP SSR/hydration only. Existing application processes and ports are untouched.
"""

import configparser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import tempfile
import threading
import time
import unittest
import urllib.request
import xmlrpc.client

from supervisor.xmlrpc import SupervisorTransport


ROOT = Path(__file__).resolve().parents[2]


def free_port():
    with socket.socket() as listener:
        listener.bind(('127.0.0.1', 0))
        return listener.getsockname()[1]


class SsrRuntimeTest(unittest.TestCase):
    def setUp(self):
        self.assertNotEqual(os.getuid(), 0, 'Run as the unprivileged Sail user')
        self.directory = tempfile.TemporaryDirectory(prefix='ssr-runtime-')
        self.root = Path(self.directory.name)
        self.port = free_port()
        self.env = dict(os.environ, INERTIA_SSR_PORT=str(self.port))
        config = configparser.RawConfigParser()
        config.read(ROOT / 'docker/app/supervisord.conf')
        self.assertEqual(config['program:inertia-ssr']['command'], '/usr/local/bin/node /app/bootstrap/ssr/ssr.js')
        self.assertLess(int(config['program:inertia-ssr']['priority']), int(config['program:php-fpm']['priority']))
        self.assertLess(int(config['program:php-fpm']['priority']), int(config['program:laravel-scheduler']['priority']))
        # Only isolate paths/binary location/port; preserve actual lifecycle policy.
        config.remove_section('program:php-fpm')
        config.remove_section('program:laravel-scheduler')
        self.socket = self.root / 'supervisor.sock'
        config['unix_http_server']['file'] = str(self.socket)
        config['supervisorctl']['serverurl'] = f'unix://{self.socket}'
        config['supervisord']['pidfile'] = str(self.root / 'supervisor.pid')
        config['supervisord']['childlogdir'] = str(self.root)
        program = config['program:inertia-ssr']
        program['command'] = f'{shutil.which("node")} {ROOT}/bootstrap/ssr/ssr.js'
        program['directory'] = str(ROOT)
        program['environment'] = f'INERTIA_SSR_PORT="{self.port}"'
        program['stdout_logfile'] = str(self.root / 'renderer.log')
        program['stderr_logfile'] = str(self.root / 'renderer.log')
        self.config_path = self.root / 'supervisord.conf'
        with self.config_path.open('w') as output:
            config.write(output)
        self.log = (self.root / 'supervisor.log').open('w')
        self.process = subprocess.Popen(['supervisord', '-c', str(self.config_path)], env=self.env, stdout=self.log, stderr=subprocess.STDOUT)
        self.http = None
        self.wait_for(lambda: self.info()['statename'] == 'RUNNING' and self.healthy())

    def tearDown(self):
        if self.http:
            # artisan serve owns a child PHP server; terminate the isolated group
            # so the HTTP listener cannot survive its Artisan parent.
            os.killpg(self.http.pid, signal.SIGTERM)
            self.http.wait(timeout=10)
            self.http_log.close()
        if self.process.poll() is None:
            self.process.terminate()
            self.process.wait(timeout=15)
        self.log.close()
        self.directory.cleanup()

    def wait_for(self, predicate, timeout=15):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                if predicate():
                    return
            except (OSError, xmlrpc.client.Error):
                pass
            time.sleep(0.05)
        self.fail('Timed out waiting for isolated SSR runtime')

    def rpc(self, method, *args):
        transport = SupervisorTransport(None, None, f'unix://{self.socket}')
        with xmlrpc.client.ServerProxy('http://127.0.0.1', transport=transport) as proxy:
            return getattr(proxy.supervisor, method)(*args)

    def info(self):
        return self.rpc('getProcessInfo', 'inertia-ssr')

    def healthy(self):
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{self.port}/health', timeout=1) as response:
                return json.load(response)['status'] == 'OK'
        except OSError:
            return False

    def check(self, *args):
        return subprocess.run(['node', 'scripts/check-ssr.mjs', *args], cwd=ROOT, env=self.env, capture_output=True, text=True, timeout=50)

    def test_health_failure_restart_and_recovery(self):
        # Node's default is all interfaces; enforce the private production bind.
        listeners = [line.split()[1] for line in Path('/proc/net/tcp').read_text().splitlines()[1:]
                     if line.split()[3] == '0A' and int(line.split()[1].split(':')[1], 16) == self.port]
        self.assertEqual(listeners, [f'0100007F:{self.port:04X}'])
        self.assertEqual(self.check().returncode, 0)
        pid = self.info()['pid']
        os.kill(pid, signal.SIGKILL)
        self.wait_for(lambda: self.info()['statename'] == 'RUNNING' and self.info()['pid'] != pid and self.healthy())
        self.assertEqual(self.check().returncode, 0)
        self.rpc('stopProcess', 'inertia-ssr', True)
        self.assertNotEqual(self.check().returncode, 0)
        self.rpc('startProcess', 'inertia-ssr', True)
        self.wait_for(self.healthy)
        self.assertEqual(self.check().returncode, 0)

    def test_container_term_stops_renderer_and_releases_listener(self):
        pid = self.info()['pid']
        self.process.terminate()
        self.assertEqual(self.process.wait(timeout=15), 0)
        self.assertFalse(self.healthy())
        self.assertFalse(Path(f'/proc/{pid}').exists())
        with socket.socket() as listener:
            listener.bind(('127.0.0.1', self.port))

    def test_smoke_rejects_client_only_html_despite_healthy_renderer(self):
        class ClientOnlyHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'<html><body><h1>Client-only fixture</h1></body></html>')

            def log_message(self, *args):
                pass

        server = ThreadingHTTPServer(('127.0.0.1', 0), ClientOnlyHandler)
        worker = threading.Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            self.assertTrue(self.healthy())
            result = self.check(f'http://127.0.0.1:{server.server_port}')
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('SSR HTML check failed for / (HTTP 200)', result.stderr)
        finally:
            server.shutdown()
            server.server_close()
            worker.join(timeout=5)

    def test_public_http_ssr_and_hydration(self):
        port = free_port()
        base = f'http://127.0.0.1:{port}'
        env = dict(self.env, APP_ENV='testing', APP_DEBUG='false', DB_DATABASE='testing', CACHE_STORE='array', SESSION_DRIVER='array', MAIL_MAILER='array', QUEUE_CONNECTION='sync', INERTIA_SSR_ENABLED='true', INERTIA_SSR_URL=f'http://127.0.0.1:{self.port}', INERTIA_SSR_THROW_ON_ERROR='true')
        self.http_log = (self.root / 'http.log').open('w')
        self.http = subprocess.Popen(['php', 'artisan', 'serve', '--host=127.0.0.1', f'--port={port}', '--no-reload'], cwd=ROOT, env=env, stdout=self.http_log, stderr=subprocess.STDOUT, start_new_session=True)
        def ready():
            with urllib.request.urlopen(base + '/login', timeout=2) as response:
                return response.status == 200
        self.wait_for(ready)
        smoke = self.check(base)
        self.assertEqual(smoke.returncode, 0, smoke.stderr)
        result = subprocess.run(['php', 'artisan', 'inertia:check-ssr'], cwd=ROOT, env=env, capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        browser_env = dict(env, PLAYWRIGHT_SSR_BASE_URL=base, PLAYWRIGHT_SSR_RENDER_URL=f'http://127.0.0.1:{self.port}/render')
        raw = self.root / 'browser.json'
        with raw.open('w') as output:
            browser = subprocess.run(['npx', 'playwright', 'test', '--project=operational-ssr', '--reporter=json', f'--output={self.root}/browser-results'], cwd=ROOT, env=browser_env, stdout=output, stderr=subprocess.PIPE, text=True, timeout=120)
        stats = json.loads(raw.read_text())['stats']
        print('Isolated HTTP SSR/hydration: ' + json.dumps(stats), flush=True)
        self.assertEqual(browser.returncode, 0, 'Browser SSR/hydration suite failed; raw HTML output kept private')
        self.assertEqual(stats['expected'], 40)
        self.assertEqual(stats['unexpected'], 0)
        self.assertEqual(stats['skipped'], 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
