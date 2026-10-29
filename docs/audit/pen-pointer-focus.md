# Шаг 15 — контур только для клавиатурного фокуса

Правка владельца 2026-10-22: убрать дополнительную обводку, появляющуюся
от клика/тапа по полю подключения, платформам и остальным controls.
Выбраны vue-best-practices и tailwind-best-practices. Pen, backend,
dependencies и текущие состояния selected/error/disabled не менялись.

## Причина и реализация

Platform/period labels использовали `focus-within`, который включается и при
pointer focus. Для текстовых inputs браузер также может считать pointer focus
состоянием `:focus-visible`, поэтому одной замены на native pseudo-class
недостаточно для запрошенного поведения.

`initializeInputModality` устанавливается один раз при клиентском старте
Inertia. Capture listeners на document поддерживают `data-input-method`
на html: pointerdown — `pointer`, keyboard input — `keyboard`. Ctrl/Meta/Alt
shortcuts не добавляют контур после pointer activation; обычные Tab/стрелки
возвращают клавиатурную индикацию. В localStorage ничего не сохраняется.
Document scope охватывает и Teleport overlays, без отдельных listeners
на каждой странице. Повторная инициализация сохраняет текущее состояние.

В CSS-first foundation добавлен `keyboard-focus` variant. Он сочетает
последний способ ввода с `:focus-visible` на control или его descendant radio.
Все 74 прежних focus class sequences в 47 Vue-файлах используют это правило:
default `outline-none`, keyboard outline 2px/solid и существующий theme focus
color/offset. BaseField меняет focus border также только при keyboard mode.
Глобального CSS reset с `!important`, inline overrides и новых цветов нет.
Pattern `@custom-variant` проверен по
[официальной документации Tailwind](https://tailwindcss.com/docs/hover-focus-and-other-states#registering-a-custom-variant).
Local Tailwind docs snapshot не инициализировался.

Native focus, выделение полного URL, clipboard и selected border/fill
платформ/периодов/тем сохраняются. Правка касается дополнительного контура,
а не текстового выделения или индикации выбранного значения.

## Проверки

Добавлены три frontend unit cases: pointer → keyboard, shortcuts и повторная
инициализация. Общий frontend suite **84/84**; client/SSR build проходит.

`pointer-focus` содержит 86 cases: все 16 page compositions × две темы ×
390/1440, 16 touch contexts и шесть реально открытых public/More/promo overlays.
Native mouse/touch activation проверяет отсутствие painted outline, затем
Tab — восстановление видимого фокуса с contrast >=3:1. Радио labels сохраняют
native selection. В generic presentation обходе click capture блокирует
навигации/submit/logout после native pointerdown; действие кнопок отдельно
проверяется `interactive-states`. Поля и радио получают обычный click/tap.
Disabled controls исключены из интерактивного обхода.

Smoke **10/10** прошёл. В расширенном прогоне обнаружена ошибка нового
обхода: он пытался нажать disabled periods и ожидал enabled до timeout.
Исправлен selector labels; production disabled semantics не менялись.
Остановленный прогон не объявляется итоговым результатом.

Окончательный pointer/touch набор — **86/86 за 1.4 минуты**, без skipped/flaky.
Report: `storage/app/pen-step15/pointer-focus/pointer-report/index.html`.
Чистый повтор controls/interaction — **192/192 за 3.6 минуты**: 96 control
presentation, 34 URL/manual-copy и 62 interactive-state cases. Итог двух
завершённых прогонов — **278 expected, 0 skipped/flaky/unexpected**.
Report: `storage/app/pen-step15/pointer-focus/controls-report/index.html`;
JSON обоих прогонов и `verification-summary.json` — в той же review folder.
Frontend **84/84**, production client/SSR build и `git diff --check` проходят.
Generated SSR восстановлены byte-for-byte до исходного состояния рабочего
дерева. Полный suite и Laravel tests в этой frontend-правке не повторялись.

Physical/AT/device и operational SSR не объявляются повторно проверенными;
прежняя owner provenance M-01…M-11 сохраняется отдельно. M-12 SMTP остаётся
открытым; шаг 16 не начинается, commit не создаётся.
