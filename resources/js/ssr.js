import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'

const pages = import.meta.glob('./pages/**/*.vue', {
    eager: true,
})

createServer((page) => createInertiaApp({
    page,

    render: renderToString,

    resolve: name => {
        return pages[`./pages/${name}.vue`]
    },

    title: title => title
        ? `${title} - dudeweb`
        : 'dudeweb',

    setup({ App, props, plugin }) {
        return createSSRApp({
            render: () => h(App, props),
        }).use(plugin)
    },
}), {
    host: '127.0.0.1',
    port: Number(process.env.INERTIA_SSR_PORT || 13714),
})
