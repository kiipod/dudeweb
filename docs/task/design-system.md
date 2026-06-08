# Design System Guidelines

## Design Philosophy

Интерфейс должен соответствовать современным SaaS-продуктам и developer-first сервисам.

Основные ориентиры:

* Cursor - https://cursor.com/
* JetBrains - https://www.jetbrains.com/
* OpenRouter - https://openrouter.ai/
* LM Studio - https://lmstudio.ai/
* Woaibench - https://www.woaibench.ai/
* Qwen Cloud - https://www.qwencloud.com/

Ключевые принципы:

* минимализм;
* большое количество свободного пространства;
* крупная типографика;
* отсутствие визуального шума;
* акцент на читаемость контента;
* понятная и предсказуемая навигация;
* высокая скорость восприятия интерфейса.

---

# Typography

## Primary Font

Использовать:

```text
JetBrains Mono
```

Для:

* логотипа;
* брендовых элементов;
* числовых показателей;
* статусов;
* технической информации;
* тарифов;
* кодов и промокодов.

---

## Alternative Fonts

Допустимо использовать один из следующих шрифтов как основной UI-шрифт:

### Option 1 (Preferred)

```text
Roboto Mono
```

Использовать для:

* интерфейса;
* кнопок;
* карточек;
* форм;
* навигации.

---

### Option 2

```text
Geist
```

Использовать для более современного минималистичного стиля в духе Vercel.

---

### Option 3

```text
Manrope
```

Использовать для более дружелюбного и маркетингового визуального стиля.

---

## Recommended Combination

Предпочтительная связка:

```text
Headings: JetBrains Mono
Body: Roboto Mono
```

или

```text
Headings: Geist
Body: Geist
Technical Elements: JetBrains Mono
```

---

# Icon System

Использовать исключительно иконки, доступные в Nuxt UI.

Не подключать сторонние библиотеки иконок без необходимости.

---

## Preferred Icon Set

Использовать встроенные наборы Nuxt UI:

```text
Heroicons
Lucide
```

Предпочтение отдавать:

```text
Lucide
```

из-за более современного и минималистичного визуального языка.

---

## Common Icons

Статус подписки:

```text
shield
shield-check
shield-alert
```

---

Трафик:

```text
activity
gauge
bar-chart
```

---

Устройства:

```text
smartphone
laptop
monitor
```

---

Подключение:

```text
link
plug
wifi
```

---

Платежи:

```text
credit-card
wallet
badge-russian-ruble
```

---

Поддержка:

```text
message-circle
messages-square
life-buoy
```

---

Реферальная система:

```text
users
user-plus
share
```

---

# Visual Style

## Border Radius

Использовать:

```text
rounded-xl
rounded-2xl
```

Избегать:

```text
rounded-none
rounded-sm
```

---

## Shadows

Минимальные.

Приоритет:

```text
border
background contrast
```

вместо тяжелых теней.

---

## Cards

Карточки должны выглядеть как панели инструментов, а не как маркетинговые баннеры.

---

## Animations

Использовать только легкие анимации:

* hover;
* opacity;
* scale;
* transition.

Избегать:

* сложных параллаксов;
* тяжелых анимаций;
* длинных переходов.

---

# Accessibility

Поддерживать:

* keyboard navigation;
* focus states;
* dark mode;
* light mode;
* WCAG AA contrast.

---

# Dark Theme

Dark Theme является основным режимом интерфейса.

Light Theme является альтернативным режимом.

По умолчанию использовать системную тему пользователя.

---

# Background & Surface Patterns

## Core Principle

Фон должен быть нейтральным и не конкурировать с контентом.

Контент (тарифы, подписка, статус, CTA) всегда является главным визуальным элементом.

Фон — только поддерживающий слой.

---

## Preferred Background Style

### 1. Solid Background (Primary Option)

Используется по умолчанию.

```text
Light: #FFFFFF / #F9FAFB
Dark: #0A0A0B / #111113
```

---

### 2. Subtle Gradient (Allowed)

Мягкие градиенты допускаются только как фон страницы, без акцента на UI элементы.

Пример:

- radial-gradient в углах
- очень низкая контрастность
- отсутствие цветовых пятен в центре экрана

Использование:

```text
background: radial-gradient(circle at top, rgba(99,102,241,0.08), transparent 60%)
```

---

### 3. Noise Texture (Optional)

Допускается легкий шум для придания глубины интерфейсу.

Требования:

- opacity < 3%
- не должен быть заметен при беглом взгляде
- не должен создавать "зернистость текста"

---

## Strictly Forbidden Background Patterns

Запрещено использовать:

- крупные геометрические паттерны
- сетки с высокой контрастностью
- анимированные фоны
- moving gradients
- blur-heavy декоративные слои
- фоновые изображения (photos, landscapes, abstract art)
- сложные SVG паттерны с высокой плотностью

---

## Surface Separation Strategy

Вместо визуально шумных фонов использовать:

- border (1px subtle)
- soft contrast surfaces
- elevation via background layering (not shadow-heavy UI)

Example:

```text
bg-base → bg-surface → bg-card
```

---

## Card Background Rules

Карточки должны:

- быть максимально чистыми
- не содержать декоративных элементов внутри
- иметь минимальную тень или только border

Preferred:

```text
border: 1px solid rgba(255,255,255,0.06)
background: rgba(255,255,255,0.02)
```

---

## Visual Goal

Интерфейс должен:

- ощущаться «тихим»
- не раздражать при длительном использовании
- не утомлять при чтении таблиц и тарифов
- выглядеть как developer tool, а не маркетинговый сайт

---

## Inspiration

- Cursor UI (primary reference)
- OpenRouter dashboard
- JetBrains IDE welcome screens
- LM Studio interface

---

## Summary Rule for Codex

Если есть сомнение:

> лучше сделать фон проще, чем сложнее
