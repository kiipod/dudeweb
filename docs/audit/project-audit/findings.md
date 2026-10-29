# Project Audit — Findings

## Summary

Обновлять после каждого диагностического этапа.

| Priority | Open | In Progress | Fixed | Verified | Blocked |
|---|---:|---:|---:|---:|---:|
| P0 | 0 | 0 | 0 | 0 | 0 |
| P1 | 0 | 0 | 0 | 0 | 0 |
| P2 | 0 | 0 | 0 | 0 | 1 |
| P3 | 0 | 0 | 0 | 0 | 0 |

Значения пересчитывать по реальным записям.

## Findings Register

| ID | Priority | Area | Location | Summary | Status |
|---|---|---|---|---|---|
| PEN-001 | P2 | Pen Design / Audit environment | Pen MCP | Источник дизайна недоступен из-за лимита тарифа | BLOCKED |

Подробная запись PEN-001 по прямому указанию пользователя:
[`../project-audot/findings.md`](../project-audot/findings.md).
Тематический отчёт: [`pen-design.md`](pen-design.md).

PEN-001: по информации пользователя, сброс лимита Pen MCP — 1 ноября 2026 года.
После 1 ноября вернуться к этапу 02 и связанным задачам; BLOCKED сохраняется
до повторной проверки доступа и чтения макетов.

Не добавлять демонстрационные дефекты как реальные.

## Detailed Findings

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
