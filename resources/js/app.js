import '../css/app.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import ui from '@nuxt/ui/vue-plugin'

const pages = import.meta.glob('./Pages/**/*.vue')

createInertiaApp({
    resolve: name => pages[`./Pages/${name}.vue`],

    title: title => title
        ? `${title} - dudeweb`
        : 'dudeweb',

    setup({ el, App, props, plugin }) {
        createApp({
            render: () => h(App, props),
        })
            .use(plugin)
            .use(ui)
            .mount(el)
    },
})
