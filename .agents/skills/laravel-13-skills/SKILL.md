---
name: laravel-13-attribute-refactor
description: Use the project's approved Laravel 13 PHP attributes when creating, updating, or refactoring supported Laravel components. Applies independently of general Laravel best-practice guidance and requires verification against the installed framework.
metadata:
  version: "2.0.0"
  author: shamimstack
  tags: [laravel, php, laravel-13, attributes, refactor]
  requires: Laravel 13.0+ | PHP 8.3+
---

# Laravel 13 Attribute Usage

## Purpose

Use modern Laravel 13 PHP attributes for the approved configuration concerns in
this project. Apply the policy both to new components and when directly updating
or refactoring the corresponding configuration in existing components.

This skill owns only attribute selection, mapping, and safe conversion. It is
independent of `laravel-best-practices`: neither skill is a prerequisite for the
other. Select each skill only when its own concern applies; a task may select
both independently.

## Selection Rules

Select this skill when a task creates, updates, or refactors one of the
components below and touches an approved configuration concern. An explicit
request mentioning attributes is not required.

Do not select it merely because a task uses Laravel. Do not expand a focused
change into unrelated attribute migrations.

Before using an attribute, inspect the installed `laravel/framework` source and
verify that the class exists, its `#[Attribute]` target is correct, its
constructor accepts the intended arguments, and the framework consumes it for
that component. A Laravel 13 version constraint alone is not sufficient.

## Approved Attributes

Only the following mappings are project-approved.

### Models

| Concern | Attribute | Import |
|---|---|---|
| Table metadata supported by the constructor | `#[Table(...)]` | `Illuminate\Database\Eloquent\Attributes\Table` |
| Observer registration | `#[ObservedBy(...)]` | `Illuminate\Database\Eloquent\Attributes\ObservedBy` |
| Factory resolution | `#[UseFactory(...)]` | `Illuminate\Database\Eloquent\Attributes\UseFactory` |
| Policy resolution | `#[UsePolicy(...)]` | `Illuminate\Database\Eloquent\Attributes\UsePolicy` |
| Local scope method | `#[Scope]` | `Illuminate\Database\Eloquent\Attributes\Scope` |

Use `#[Scope]` on the scope method. Do not convert other model properties or
metadata unless this matrix is explicitly expanded.

### Jobs

| Concern | Attribute | Import |
|---|---|---|
| `$tries` | `#[Tries(...)]` | `Illuminate\Queue\Attributes\Tries` |
| `$timeout` | `#[Timeout(...)]` | `Illuminate\Queue\Attributes\Timeout` |
| Middleware | `#[Middleware(...)]` | Version-gated; see Known Gaps |
| `$connection` | `#[Connection(...)]` | `Illuminate\Queue\Attributes\Connection` |

### Commands

| Concern | Attribute | Import |
|---|---|---|
| `$aliases` | `#[Aliases([...])]` | `Illuminate\Console\Attributes\Aliases` |

### Controllers

| Concern | Attribute | Import |
|---|---|---|
| Controller or action middleware | `#[Middleware(...)]` | `Illuminate\Routing\Attributes\Controllers\Middleware` |

### Form Requests

| Concern | Attribute | Import |
|---|---|---|
| `$redirect` | `#[RedirectTo(...)]` | `Illuminate\Foundation\Http\Attributes\RedirectTo` |
| `$redirectRoute` | `#[RedirectToRoute(...)]` | `Illuminate\Foundation\Http\Attributes\RedirectToRoute` |
| `$redirectAction` | `#[RedirectToAction(...)]` | Version-gated; see Known Gaps |

### HTTP Resources

| Concern | Attribute | Import |
|---|---|---|
| `$collects` | `#[Collects(...)]` | `Illuminate\Http\Resources\Attributes\Collects` |

### Factories

| Concern | Attribute | Import |
|---|---|---|
| `$model` | `#[UseModel(...)]` | `Illuminate\Database\Eloquent\Factories\Attributes\UseModel` |

### Testing

| Concern | Attribute | Import |
|---|---|---|
| `$seeder` | `#[Seeder(...)]` | `Illuminate\Foundation\Testing\Attributes\Seeder` |

### Container / Dependency Injection

All installed contextual injection attributes are approved:

- `Auth`, `Authenticated`, `Cache`, `Config`, `Context`, `CurrentUser`;
- `DB`, `Database`, `Give`, `Log`, `RequestAttribute`;
- `RouteParameter`, `Storage`, `Tag`.

Their namespace is `Illuminate\Container\Attributes`. Apply them only to the
parameter targets and types supported by their installed constructors.

### Container Service Registration

All installed service-registration attributes are approved:

- `Bind` and `BindWhen`;
- `Scoped` and `Singleton`.

Their namespace is `Illuminate\Container\Attributes`. Verify constructor
requirements before use; for example, `Bind` requires a concrete class.

## Refactoring Rules

1. Prefer an approved, verified attribute in new code instead of the legacy
   property or registration form for the same concern.
2. When directly updating or refactoring approved configuration, convert it to
   the verified attribute form if behavior can be preserved.
3. Remove the legacy property or registration only after the framework mapping
   and equivalent behavior are confirmed.
4. Preserve method bodies, business logic, relationships, visibility, types,
   inheritance, and unrelated configuration.
5. Add the exact framework import; never invent an attribute class or use a
   similarly named class from another namespace.
6. Respect `Attribute::IS_REPEATABLE`, class/method/parameter targets, and the
   installed constructor signature.
7. If the value is dynamic or cannot be expressed as a PHP attribute argument,
   keep the supported non-attribute implementation and mark the conversion
   `Needs review`.
8. Run focused tests and the project formatter after implementation.

## Known Gaps in This Checkout

The installed framework is Laravel 13.34.0. It does not contain:

- `Illuminate\Queue\Attributes\Middleware`;
- `Illuminate\Foundation\Http\Attributes\RedirectToAction`.

Job middleware and Form Request redirect actions remain approved future
attribute concerns, but they are `Needs review` in this checkout. Until a real
framework class and integration are installed, retain Laravel's supported
non-attribute form. Do not create local substitutes just to satisfy this policy.

## Workflow

1. Identify the component and approved configuration concern.
2. Inspect the installed framework class, target, constructor, and integration.
3. Add the verified attribute and import.
4. Remove only the configuration it replaces.
5. Run focused tests and formatting, then review the diff for behavior changes.
