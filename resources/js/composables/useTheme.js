import { readonly, shallowRef } from 'vue'

const STORAGE_KEY = 'dudeweb-theme'
const SYSTEM_QUERY = '(prefers-color-scheme: dark)'
const THEMES = ['light', 'dark']

const theme = shallowRef('light')

let initialized = false

function isTheme(value) {
    return THEMES.includes(value)
}

function readStoredTheme(fallbackTheme) {
    try {
        const storedTheme = window.localStorage.getItem(STORAGE_KEY)

        return isTheme(storedTheme) ? storedTheme : fallbackTheme
    } catch {
        return fallbackTheme
    }
}

function persistTheme(preference) {
    try {
        window.localStorage.setItem(STORAGE_KEY, preference)
    } catch {
        // The current page still receives the selected theme without persistence.
    }
}

function applyTheme() {
    document.documentElement.dataset.theme = theme.value
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.style.colorScheme = theme.value
}

export function initializeTheme() {
    if (initialized || typeof window === 'undefined') {
        return
    }

    initialized = true
    const fallbackTheme = window.matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light'

    theme.value = readStoredTheme(fallbackTheme)
    persistTheme(theme.value)
    applyTheme()
}

export function useTheme() {
    function setTheme(preference) {
        if (!isTheme(preference)) {
            return
        }

        theme.value = preference
        persistTheme(preference)
        applyTheme()
    }

    return {
        activeTheme: readonly(theme),
        setTheme,
        theme: readonly(theme),
        themes: THEMES,
    }
}
