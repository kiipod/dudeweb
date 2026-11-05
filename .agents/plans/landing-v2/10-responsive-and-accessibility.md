# Шаг 10 — Responsive and Accessibility

## Цель

Проверить Landing V2 на мобильных устройствах,
планшетах и desktop.

Исправить выявленные responsive и accessibility issues.

## Viewports

Проверить:

- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px
- 1920px

Также проверить промежуточные ширины.

## Responsive

- [ ] Нет горизонтального overflow.
- [ ] Контейнеры корректно масштабируются.
- [ ] Типографика адаптируется.
- [ ] Изображения не искажаются.
- [ ] Карточки не выходят за экран.
- [ ] Меню доступно.
- [ ] CTA доступны.
- [ ] Footer корректен.
- [ ] News block корректен.
- [ ] Анимации не ломают layout.

## Accessibility

- [ ] Семантическая структура HTML.
- [ ] Правильная иерархия заголовков.
- [ ] Alt для содержательных изображений.
- [ ] Labels для полей.
- [ ] Видимый keyboard focus.
- [ ] Корректные button/link semantics.
- [ ] Контрастность текста.
- [ ] Keyboard navigation.
- [ ] Reduced motion.
- [ ] Доступность мобильного меню.

## Browser Testing

Если доступен браузер:

- [ ] Проверить desktop.
- [ ] Проверить mobile emulation.
- [ ] Проверить touch interactions.
- [ ] Проверить console.
- [ ] Проверить network errors.

Если browser automation недоступна,
зафиксировать непроверенные сценарии.

## Проверка

- [ ] Все предусмотренные viewport проверены.
- [ ] Responsive issues исправлены.
- [ ] Accessibility issues исправлены.
- [ ] Визуальные регрессии отсутствуют.
- [ ] Существующая главная страница не затронута.

## Commit

fix: improve landing v2 responsive accessibility
