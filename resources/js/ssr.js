import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import ui from '@nuxt/ui/vue-plugin'

const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })

createServer((page) => createInertiaApp({
    page,
    render: renderToString,

    resolve: name => pages[`./Pages/${name}.vue`],

    title: title => title
        ? `${title} - dudeweb`
        : 'dudeweb',

    setup({ app, props, plugin }) {
        return createSSRApp({
            render: () => h(app, props),
        })
            .use(plugin)
            .use(ui)
    },
}))
