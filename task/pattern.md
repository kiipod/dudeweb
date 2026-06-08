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
