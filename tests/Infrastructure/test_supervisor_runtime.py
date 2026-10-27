"""Run inside the production image, with its default user and config.

    python3 tests/Infrastructure/test_supervisor_runtime.py

PHP-FPM is real. A controlled scheduler fixture exercises process signals
without executing subscription, payment, or Telegram tasks.
"""

import configparser
import os
from pathlib import Path
import pwd
import signal
import subprocess
import sys
import tempfile
import time
import unittest
import xmlrpc.client

from supervisor.xmlrpc import SupervisorTransport


WORKER = r'''
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

root = Path(sys.argv[1])
mode = sys.argv[2]

if mode == 'child':
    def interrupted(signum, frame):
        (root / 'child-interrupted').touch()
        sys.exit(1)
    signal.signal(signal.SIGTERM, interrupted)
    (root / 'child.pid').write_text(str(os.getpid()))
    while not (root / 'release-child').exists():
        time.sleep(0.02)
    (root / 'child-completed').touch()
    sys.exit(0)

child = None
if mode in ('drain', 'stuck'):
    child = subprocess.Popen([sys.executable, __file__, str(root), 'child'])

def stop(signum, frame):
    (root / 'worker-signalled').touch()
    if mode == 'stuck':
        return
    if child:
        child.wait()
    print('scheduler fixture stopped', flush=True)
    sys.exit(0)

signal.signal(signal.SIGTERM, stop)
print('scheduler fixture started', flush=True)
while True:
    time.sleep(0.02)
'''


class SupervisorRuntimeTest(unittest.TestCase):
    def setUp(self):
        self.assertEqual(pwd.getpwuid(os.getuid()).pw_name, 'deploy')
        self.directory = tempfile.TemporaryDirectory(prefix='supervisor-runtime-')
        self.root = Path(self.directory.name)
        self.worker = self.root / 'worker.py'
        self.worker.write_text(WORKER)
        self.config = configparser.RawConfigParser()
        self.config.read('/etc/supervisord.conf')
        self.assertEqual(
            self.config['program:laravel-scheduler']['command'],
            '/usr/local/bin/php /app/artisan schedule:work --no-interaction',
        )
        self.socket = self.root / 'supervisor.sock'
        self.config['unix_http_server']['file'] = str(self.socket)
        self.config['supervisorctl']['serverurl'] = f'unix://{self.socket}'
        self.config['supervisord']['pidfile'] = str(self.root / 'supervisord.pid')
        self.config['supervisord']['childlogdir'] = str(self.root)
        self.log_path = self.root / 'process.log'
        for name in ('php-fpm', 'laravel-scheduler'):
            self.config[f'program:{name}']['stdout_logfile'] = str(self.log_path)
            self.config[f'program:{name}']['stderr_logfile'] = str(self.log_path)
        self.config_path = self.root / 'supervisord.conf'
        self.process = None
        self.log = None

    def tearDown(self):
        if self.process:
            if self.process.poll() is None:
                self.process.terminate()
                try:
                    self.process.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    for pid in self.root.glob('*.pid'):
                        try:
                            os.killpg(int(pid.read_text()), signal.SIGKILL)
                        except ProcessLookupError:
                            pass
                    self.process.kill()
                    self.process.wait(timeout=5)
            if self.log:
                self.log.close()
            if sys.exc_info()[0]:
                print((self.root / 'supervisor.log').read_text(), file=sys.stderr)
        self.reap_children()
        self.directory.cleanup()

    @staticmethod
    def reap_children():
        while True:
            try:
                pid, _ = os.waitpid(-1, os.WNOHANG)
                if not pid:
                    return
            except ChildProcessError:
                return

    def wait_for(self, predicate, description, timeout=10):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                if predicate():
                    return
            except (OSError, xmlrpc.client.Error):
                pass
            time.sleep(0.05)
        self.fail(f'Timed out: {description}\n' + (self.root / 'supervisor.log').read_text())

    def start(self, mode='idle', stop_timeout=None):
        self.config['program:laravel-scheduler']['command'] = (
            f'{sys.executable} {self.worker} {self.root} {mode}'
        )
        if stop_timeout is not None:
            self.config['program:laravel-scheduler']['stopwaitsecs'] = str(stop_timeout)
        with self.config_path.open('w') as output:
            self.config.write(output)
        self.log = (self.root / 'supervisor.log').open('w')
        self.process = subprocess.Popen(
            ['/usr/bin/supervisord', '-c', str(self.config_path)],
            stdout=self.log, stderr=subprocess.STDOUT,
        )
        self.wait_for(
            lambda: all(p['statename'] == 'RUNNING' for p in self.rpc('getAllProcessInfo')),
            'both processes running',
        )
        self.assertEqual(len(self.rpc('getAllProcessInfo')), 2)

    def rpc(self, method, *args):
        transport = SupervisorTransport(None, None, f'unix://{self.socket}')
        with xmlrpc.client.ServerProxy('http://127.0.0.1', transport=transport) as proxy:
            return getattr(proxy.supervisor, method)(*args)

    @staticmethod
    def is_running(pid):
        status = Path(f'/proc/{pid}/stat')
        if not status.exists():
            return False
        return status.read_text().split(') ', 1)[1].split()[0] != 'Z'

    def test_both_processes_restart_after_failure(self):
        self.start()
        for name in ('laravel-scheduler', 'php-fpm'):
            previous = self.rpc('getProcessInfo', name)['pid']
            os.killpg(previous, signal.SIGKILL)
            self.wait_for(
                lambda: self.rpc('getProcessInfo', name)['statename'] == 'RUNNING'
                and self.rpc('getProcessInfo', name)['pid'] != previous,
                f'{name} restarted',
            )
        self.assertIn('scheduler fixture started', self.log_path.read_text())

    def test_container_term_drains_task_before_stopping_php_fpm(self):
        self.start('drain')
        self.wait_for(lambda: (self.root / 'child.pid').exists(), 'task started')
        child = int((self.root / 'child.pid').read_text())
        fpm = self.rpc('getProcessInfo', 'php-fpm')['pid']
        scheduler = self.rpc('getProcessInfo', 'laravel-scheduler')['pid']
        self.process.terminate()
        self.wait_for(lambda: (self.root / 'worker-signalled').exists(), 'scheduler received TERM')
        self.assertTrue(self.is_running(child), 'current task must still be running')
        self.assertTrue(self.is_running(fpm), 'FPM stays up while scheduler drains')
        (self.root / 'release-child').touch()
        self.assertEqual(self.process.wait(timeout=8), 0)
        self.assertTrue((self.root / 'child-completed').exists())
        self.assertFalse((self.root / 'child-interrupted').exists())
        for pid in (child, scheduler, fpm):
            self.assertFalse(self.is_running(pid))

    def test_stop_deadline_kills_stuck_task_group(self):
        self.start('stuck', stop_timeout=1)
        self.wait_for(lambda: (self.root / 'child.pid').exists(), 'task started')
        child = int((self.root / 'child.pid').read_text())
        scheduler = self.rpc('getProcessInfo', 'laravel-scheduler')['pid']
        self.process.terminate()
        self.assertEqual(self.process.wait(timeout=8), 0)
        self.assertTrue((self.root / 'worker-signalled').exists())
        self.assertFalse(self.is_running(child))
        self.assertFalse(self.is_running(scheduler))
        self.assertIn('SIGKILL', (self.root / 'supervisor.log').read_text())


if __name__ == '__main__':
    unittest.main(verbosity=2)
