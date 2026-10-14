<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <script>
        (() => {
            const storageKey = 'dudeweb-theme'
            const allowedThemes = ['system', 'light', 'dark']
            let preference = 'system'

            try {
                const storedPreference = localStorage.getItem(storageKey)

                if (allowedThemes.includes(storedPreference)) {
                    preference = storedPreference
                }
            } catch {
                // Storage can be unavailable in hardened browser contexts.
            }

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const resolvedTheme = preference === 'system'
                ? (prefersDark ? 'dark' : 'light')
                : preference

            document.documentElement.dataset.theme = preference
            document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
            document.documentElement.style.colorScheme = resolvedTheme
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
