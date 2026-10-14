import { computed, readonly, shallowRef } from 'vue'

const STORAGE_KEY = 'dudeweb-theme'
const SYSTEM_QUERY = '(prefers-color-scheme: dark)'
const THEMES = ['system', 'light', 'dark']

const theme = shallowRef('system')
const systemTheme = shallowRef('light')

let initialized = false
let systemPreference

function isTheme(value) {
    return THEMES.includes(value)
}

function readStoredTheme() {
    try {
        const storedTheme = window.localStorage.getItem(STORAGE_KEY)

        return isTheme(storedTheme) ? storedTheme : 'system'
    } catch {
        return 'system'
    }
}

function resolvedTheme() {
    return theme.value === 'system' ? systemTheme.value : theme.value
}

function applyTheme() {
    const activeTheme = resolvedTheme()

    document.documentElement.dataset.theme = theme.value
    document.documentElement.classList.toggle('dark', activeTheme === 'dark')
    document.documentElement.style.colorScheme = activeTheme
}

function handleSystemThemeChange(event) {
    systemTheme.value = event.matches ? 'dark' : 'light'

    if (theme.value === 'system') {
        applyTheme()
    }
}

export function initializeTheme() {
    if (initialized || typeof window === 'undefined') {
        return
    }

    initialized = true
    systemPreference = window.matchMedia(SYSTEM_QUERY)
    systemTheme.value = systemPreference.matches ? 'dark' : 'light'
    theme.value = readStoredTheme()
    systemPreference.addEventListener('change', handleSystemThemeChange)
    applyTheme()
}

export function useTheme() {
    const activeTheme = computed(resolvedTheme)

    function setTheme(preference) {
        if (!isTheme(preference)) {
            return
        }

        theme.value = preference

        try {
            window.localStorage.setItem(STORAGE_KEY, preference)
        } catch {
            // The current page still receives the selected theme without persistence.
        }

        applyTheme()
    }

    return {
        activeTheme: readonly(activeTheme),
        setTheme,
        theme: readonly(theme),
        themes: THEMES,
    }
}
