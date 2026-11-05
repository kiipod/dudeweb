import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, shallowRef } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { useAdvantageMotion } from '../../../resources/js/composables/useAdvantageMotion.js'

test('advantage motion renders a static initial state on the server without browser globals or timers', async () => {
    assert.equal(typeof window, 'undefined')
    const app = createSSRApp({
        setup() {
            const { running, active, playing } = useAdvantageMotion(shallowRef(null))
            return () => h('article', {
                'data-motion-running': running.value,
                'data-active': active.value,
                'data-playing': playing.value,
            })
        },
    })
    assert.equal(await renderToString(app), '<article data-motion-running="false" data-active="false" data-playing="false"></article>')
})
