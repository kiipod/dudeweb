import '@fontsource-variable/ibm-plex-sans'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/ibm-plex-mono/700.css'
import '@fontsource/inter/700.css'
import '../css/app.css'
import { createApp, createSSRApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { initializeTheme } from '@/composables/useTheme'
import { initializeInputModality } from '@/utils/inputModality'

const pages = import.meta.glob('./pages/**/*.vue')

initializeTheme()
initializeInputModality()

createInertiaApp({
    resolve: name => {
        return pages[`./pages/${name}.vue`]()
    },
    title: title => title ? `${title} - dudeweb` : 'dudeweb',
    setup({ el, App, props, plugin }) {
        const createRoot = el.hasChildNodes() ? createSSRApp : createApp

        createRoot({ render: () => h(App, props) })
            .use(plugin)
            .mount(el)
    },
})
