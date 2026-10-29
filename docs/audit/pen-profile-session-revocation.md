# Завершение остальных web-сеансов одним нажатием

Уточнение владельца: «Завершить другие сеансы» выполняет действие сразу,
без ввода пароля, сохраняя авторизацию только текущего сеанса этого пользователя.

## Контракт

- `DELETE /account/profile/sessions` использует текущую verified web identity,
  CSRF, прежний throttle и `update-account-profile` policy, включая merge lock.
  Payload для действия не нужен; чужой user ID из payload не используется.
- `ProfileService::endOtherSessions()` под блокировкой строки увеличивает
  `users.web_session_version` и отзывает прежний remember token. Пароль,
  password hash и reset links не меняются. Действие доступно и passwordless
  web identity; смена пароля по-прежнему требует пароль и password capability.
- Login event записывает текущую версию в web-сессию при обычном входе,
  remember login, регистрации и повторном login после profile/merge операций.
- `EnsureWebSessionIsCurrent` проверяет версию на всех существующих защищённых
  web-маршрутах, включая verification/logout и `/payments`. Старый сеанс
  теряет доступ при следующем запросе; `logoutCurrentDevice()` не отзывает
  другие входы дополнительно. MoonShine guard/маршруты не меняются.
- До первого отзыва существующие сессии без marker трактуются как версия 0.
  После отзыва отсутствие marker уже не обходит проверку. Текущий сеанс
  повторно авторизуется, получает новую версию и новый session ID/CSRF.
- Отзыв не зависит от session driver и не удаляет сеансы других пользователей.

## Интерфейс

`ProfileSecurity` отправляет пустую Inertia-форму по нажатию или Enter/Space.
Парольная форма подтверждения и стрелка раскрытия удалены. На время запроса
кнопка disabled/aria-busy, отображается loader, повторный intent блокируется.
Success появляется после успешного ответа; network/HTTP/validation errors
сохраняют возможность повторить действие. Существующий `useProfileForm`
сохраняет принятую error copy. Открытая форма смены пароля закрывается, её
секретный черновик очищается перед завершением других сеансов.

## Проверка

- Полный Sail backend suite: **306 tests / 2997 assertions**, failures нет.
  Из них PHPUnit помечает **295 deprecated** из-за прежнего
  `PDO::MYSQL_ATTR_SSL_CA` в `config/database.php:62` на PHP 8.5; остальные
  11 имеют статус passed. Отдельный display-deprecations подтвердил источник.
- В ProfileTest проверены независимые cookie на реальных file/database
  handlers: старый вход владельца отвергнут, текущий сохранён, вход другого
  пользователя продолжает работать. Database handler использует изолированную
  тестовую таблицу; runtime проект не требует переключения с file driver.
- Проверены старый remember cookie, legacy session без marker, настоящий login
  после отзыва, passwordless identity, отсутствие смены hash/reset links,
  user isolation и CSRF/guest/unverified boundaries.
- Sail profile browser **91/91**, включая one-click/keyboard, duplicate intent,
  loading, recovery, mobile/desktop light/dark и text ×2; frontend **103/103**.
- Client/SSR builds, scoped PHP CS Fixer (`@PER-CS3x0`) и diff check прошли.
  Mobile dark screenshot просмотрен; generated SSR восстановлены byte-for-byte.

Новая миграция `2026_10_26_190317_add_web_session_version_to_users_table`
применена только в локальном Sail. В production потребуется та же миграция
до использования нового кода. Старые незакоммиченные изменения сохранены;
M-12 SMTP открыт, шаг 16 не начат, commit не создавался.
