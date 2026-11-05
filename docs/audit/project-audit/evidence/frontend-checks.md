# Frontend verification protocol — 2026-10-29

Все runtime-команды выполнены внутри Sail. БД не мигрировалась/не очищалась;
аккаунты и внешние provider responses заменены browser fixtures.

| Команда (после `./vendor/bin/sail`) | Результат |
|---|---|
| `node --test tests/Unit/Frontend/*.test.js` | exit 0; 103/103 |
| `npm run test:e2e -- --project=chromium-desktop --project=chromium-mobile --project=interactive-states --project=responsive-accessibility --project=touch-dismiss` | exit 0; 320/320; 3.1m |
| `npm run build:client` | exit 0; 4.02s |
| `npm run test:e2e -- --project=account-dashboard --project=subscription-payment --project=account-connection --project=account-referral --project=account-support --project=account-profile --project=styled-select` | exit 0; 494/494; 3.4m |
| `artisan inertia:check-ssr` (до временного renderer) | exit 1; server not running |
| `npm run build:ssr` | exit 0; 492ms |
| `node bootstrap/ssr/ssr.js` | временный renderer, port 13714; остановлен после проверки |
| `exec -T -e PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1 laravel.test npm run test:e2e -- --project=operational-ssr --reporter=list --output=/tmp/frontend-audit-ssr-results` | exit 1; 32 passed / 8 failed; 16.1s |
| `artisan config:show inertia` | `ssr.enabled=false`, URL `http://127.0.0.1:13714` |
| `node docs/audit/project-audit/evidence/frontend-probe.mjs` | результаты рядом, `frontend-probe.json` |

8 operational failures: четыре реальные публичные страницы в light/dark,
assertion отсутствия SSR marker `data-server-rendered="true"`. Основной HTTP
endpoint в CSR режиме; fixture hydration проверена напрямую через renderer.
Конфигурация не изменялась. Это ограничение проверки, а не восемь установленных
дефектов frontend. Live SSR acceptance остаётся непроверенной.

Generated SSR files предварительно сохранены в `/tmp/frontend-audit-ssr-backup/`,
затем восстановлены; `git diff --exit-code -- bootstrap/ssr` прошёл.
Основной HTML-report последнего набора находится в ignored `playwright-report/`;
это временный артефакт и будет перезаписан будущими запусками.
Полные HTTP/trace дампы в документацию не копировались.
