# Шаг 4 — Публичный shell, header, footer и навигация

## Цель задачи

Перенести public shell лендинга, включая desktop navigation, mobile menu,
theme switcher, footer и корректные destinations.

## Зависимости

- Завершён шаг 3.
- Утверждены routes/anchors и `U-14`, `U-15`, `U-19`.
- Pen frames `A`, `A2`, `B`, `B2`, `C`, `D`, `D2`, `E`, `F` и board `H`.

## Конкретные действия

- [ ] Разделить текущий `AppLayout.vue` на public shell и будущий account shell.
- [ ] Сохранить `UApp` единственным верхним provider для toast/tooltip/overlay.
- [ ] Реализовать sticky/translucent header с Pen heights, borders и controls.
- [ ] Подключить desktop links к секциям `Преимущества`, `Устройства`, `Тариф`.
- [ ] Подключить login и primary CTA только к утверждённым routes.
- [ ] Реализовать mobile menu open/close по dark/light макетам.
- [ ] Обеспечить close по кнопке, `Escape`, navigation selection и outside click,
  если выбранный Nuxt UI primitive поддерживает это поведение.
- [ ] Управлять фокусом: trigger -> menu -> возврат на trigger.
- [ ] Заблокировать background interaction/scroll только для modal-like mobile
  presentation; не применять это к обычному dropdown без решения `U-20`.
- [ ] Реализовать footer groups, legal/support links и актуальный год без
  placeholder destinations.
- [ ] Добавить skip link к основному контенту.
- [ ] Проверить semantic landmarks: `header`, `nav`, `main`, `footer`.
- [ ] Удалить demo links только после появления реальных equivalents.

## Критерии готовности

- Public shell соответствует Pen на 360/390/768/1440.
- Desktop и mobile navigation полностью управляются клавиатурой.
- Ни одна ссылка не ведёт на `#`, если это не утверждённый section anchor.
- Theme control сохраняет выбранное поведение без hydration flash.
- Mobile menu корректно закрывается и возвращает фокус.

## Команды проверки

```bash
rg -n "to=\"#\"|to: '#|href=\"#\"" resources/js
npm run build
docker compose exec -T laravel.test php artisan test --filter=Landing
git diff --check
```

## Сценарии проверки

- 360 и 390 px: открыть/закрыть menu, прокрутить к каждой секции.
- 768 px: проверить tablet header и menu-open variant.
- 1440 px: проверить desktop links, login и CTA hierarchy.
- Light/dark/system: переключить тему при открытом меню.
- Keyboard-only: skip link, menu trigger, links, close, focus return.
- Reload на section anchor: header не перекрывает heading.
