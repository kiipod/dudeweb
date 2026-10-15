<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <script>
        (() => {
            const storageKey = 'dudeweb-theme'
            const allowedThemes = ['light', 'dark']
            const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            let preference = fallbackTheme

            try {
                const storedPreference = localStorage.getItem(storageKey)

                if (allowedThemes.includes(storedPreference)) {
                    preference = storedPreference
                }

                localStorage.setItem(storageKey, preference)
            } catch {
                // Storage can be unavailable in hardened browser contexts.
            }

            document.documentElement.dataset.theme = preference
            document.documentElement.classList.toggle('dark', preference === 'dark')
            document.documentElement.style.colorScheme = preference
        })()
    </script>
    @vite('resources/js/app.js')
    @inertiaHead
</head>

<body>
<div class="isolate">
    @inertia
</div>
</body>

</html>
