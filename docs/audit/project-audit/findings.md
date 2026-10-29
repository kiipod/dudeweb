# Project Audit — Findings

## Summary

Обновлять после каждого диагностического этапа.

| Priority | Open | In Progress | Fixed | Verified | Blocked |
|---|---:|---:|---:|---:|---:|
| P0 | 0 | 0 | 0 | 0 | 0 |
| P1 | 0 | 0 | 0 | 0 | 0 |
| P2 | 1 | 0 | 0 | 0 | 1 |
| P3 | 1 | 0 | 0 | 0 | 0 |

Значения пересчитывать по реальным записям.

## Findings Register

| ID | Priority | Area | Location | Summary | Status |
|---|---|---|---|---|---|
| PEN-001 | P2 | Pen Design / Audit environment | Pen MCP | Источник дизайна недоступен из-за лимита тарифа | BLOCKED |
| FE-001 | P2 | Frontend | ProfileTelegram.vue:31 | Refresh Telegram не показывает локальную transport-ошибку | OPEN |
| FE-002 | P3 | Frontend / Contracts | Account/Profile.vue:12; Account/Subscription.vue:11 | Неиспользуемые обязательные props | OPEN |

Подробная запись PEN-001 находится в разделе Detailed Findings этого реестра.
Тематический отчёт: [`pen-design.md`](pen-design.md).

PEN-001: по информации пользователя, сброс лимита Pen MCP — 1 ноября 2026 года.
После 1 ноября вернуться к этапу 02 и связанным задачам; BLOCKED сохраняется
до повторной проверки доступа и чтения макетов.

Не добавлять демонстрационные дефекты как реальные.

## Detailed Findings

### PEN-001 — Pen MCP заблокирован лимитом тарифа

**Priority:** P2

**Area:** Pen Design / Audit environment

**Status:** BLOCKED

**Location:** `.agents/plans/project-audit/02-pen-design-audit.md`, раздел «Подключение Pen».

**Related report:** `docs/audit/project-audit/pen-design.md`.

#### Description / Evidence

2026-10-29 вызов `pencil.get_app_state({})` вернул `isError: true`, MCP
`-32603`: лимит использования текущего плана исчерпан, design tools заблокированы.
Ни список экранов, ни токены, ни состояния прочитать не удалось.

#### Expected behavior

Pen MCP предоставляет read-only доступ к актуальному согласованному макету.

#### Actual behavior

Доступ заблокирован сервисом. Соответствие интерфейса не проверено.

#### Impact

Заблокирована основная проверка этапа 02. P2 отражает ограничение аудита;
пользовательский дефект или production-инцидент не установлен.

#### Proposed solution

По информации пользователя от 2026-10-29, лимит сбросится **1 ноября 2026 года**.
После 1 ноября вернуться к PEN-001, этапу 02 и связанным задачам, зависящим
от Pen. Повторно проверить доступ; до подтверждения сохранять BLOCKED.

Восстановить доступ к Pen MCP в рамках доступного тарифа/периода и повторить
чтение источника. Не обходить лимит и не изменять `.pen` напрямую.

#### Verification steps

1. Повторить `get_app_state` после восстановления доступа.
2. Прочитать актуальный список экранов, токены и состояния через Pen MCP.
3. Выполнить сравнение по этапу 02 и приложить актуальные доказательства.

#### Resolution

Не устранено. Исправлений реализации нет. Первичная фиксация блокировки:
коммит `87ebd5c`; перенос записи в единый реестр не снимает BLOCKED.

### FE-001 — Refresh Telegram не обрабатывает transport errors локально

**Priority:** P2

**Area:** Frontend / Error handling

**Status:** OPEN

**Location:** `resources/js/components/profile/ProfileTelegram.vue:28`, особенно `:31`.

**Related report:** `docs/audit/project-audit/frontend.md`.

#### Description

Ручная проверка привязки и refresh при возвращении в окно вызывают
`router.reload` только с `onFinish`. Нет локальных onNetworkError/onHttpException;
показанный InlineAlert читает errors mutation-формы, а не ошибки этого reload.

#### Evidence

`evidence/frontend-probe.mjs` воспроизводит на реальном UI bundle с синтетическим
pending Telegram и транспортом. В `frontend-probe.json`: HTTP 503 — inlineAlerts
пуст, появляется один служебный dialog; network abort — inlineAlerts пуст,
pageerror `Network error (http://127.0.0.1/account/profile)`.
Кнопка после запроса снова enabled, но пользователю не сообщается локально,
что статус не удалось обновить. Проверены также синтетические 401/403.

#### Expected behavior

Ошибка проверки привязки отображается в контексте Telegram с понятным retry;
необработанная transport-ошибка не выходит в pageerror, ложного success нет.

#### Actual behavior

HTTP ошибка отдаётся default exception UI Inertia; network ошибка остаётся
необработанной без сообщения в секции. Старое pending состояние сохраняется.

#### Impact

При нестабильной сети или недоступном сервере пользователь не понимает,
почему Telegram-статус не изменился. P2: локальный recoverable UX-дефект,
потеря данных и нарушение авторизации не установлены.

#### Proposed solution

Добавить локальную обработку ошибок refresh, cleanup/cancellation и retry
с сохранением partial reload, deduplication и focus-triggered обновления.
Рассмотреть feature composable; не менять бизнес-процесс привязки.

#### Verification steps

1. В pending/ready/applying выполнить refresh при network abort, 503, 401, 403.
2. Проверить локальное сообщение, отсутствие unhandled pageerror и ложного success.
3. Успешно повторить запрос; проверить focus event, deduplication и уход со страницы.

#### Resolution

Исправлений нет. OPEN; диагностическое воспроизведение не означает VERIFIED.

### FE-002 — Обязательные props без потребителя

**Priority:** P3

**Area:** Frontend / Contracts

**Status:** OPEN

**Location:** `resources/js/pages/Account/Profile.vue:12`, `resources/js/pages/Account/Subscription.vue:11`.

**Related report:** `docs/audit/project-audit/frontend.md`.

#### Description / Evidence

Profile объявляет required Object `themePreference`, но не читает и не передаёт
его дочерним компонентам; тема управляется `useTheme` через ProfileTheme/layout.
Subscription объявляет required String `serviceState`, но не использует его;
видимые состояния формируются из subscription/catalogue. Поиск по текущим SFC
подтверждает только declaration каждого prop внутри соответствующей страницы.

#### Expected behavior

Обязательные props отражают фактические зависимости страницы; намеренно
зарезервированные contracts явно документированы.

#### Actual behavior

Страница требует данные, от которых её текущие rendering/behavior не зависят.
Обоснование резервирования в компоненте отсутствует.

#### Impact

P3: избыточная связанность server/page/fixtures и вводящий в заблуждение contract.
Пользовательская поломка темы или подписки этим finding не утверждается.

#### Proposed solution

Согласовать contract: удалить неиспользуемую обязательность/prop или обосновать
и реализовать необходимое использование. При удалении проверить server props
и fixtures отдельно; не создавать второй store темы и не смешивать с redesign.

#### Verification steps

Проверить использование обоих contracts, frontend unit/SSR и browser Profile/
Subscription в двух темах, включая loading/error и history navigation.

#### Resolution

Изменений реализации нет; OPEN.

## Шаблон новой записи

Для каждой обнаруженной проблемы использовать шаблон:

### [ID] — [Название]

**Priority:** P0 / P1 / P2 / P3

**Area:** Security / Frontend / Backend / ...

**Status:** OPEN

**Location:** `path/to/file:line`

**Related report:** `docs/audit/...`

#### Description

Описание проблемы.

#### Evidence

Подтверждение проблемы.

#### Expected behavior

Ожидаемое поведение.

#### Actual behavior

Фактическое поведение.

#### Impact

Последствия и условия возникновения.

#### Proposed solution

Рекомендуемое исправление.

#### Verification steps

Как проверить исправление.

#### Resolution

Заполняется после исправления:

- изменённые файлы;
- commit;
- результат проверки;
- оставшиеся ограничения.

## Remediation Order

Список согласованных проблем для исправления.

Не заполнять предположениями до завершения аудита.

## Accepted Risks

Риски, явно принятые пользователем.

## Blocked Findings

Проблемы, исправление или проверка которых невозможны
в текущем окружении.
