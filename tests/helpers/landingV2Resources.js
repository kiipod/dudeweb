// Test-only instrumentation: retain handles so detached targets cannot hide missing cleanup.
export function trackLandingV2Resources() {
    const listeners = []
    const observers = []
    const frames = new Set()
    const add = EventTarget.prototype.addEventListener
    const remove = EventTarget.prototype.removeEventListener
    const capture = options => typeof options === 'boolean' ? options : Boolean(options?.capture)
    const globalTarget = target => target === window || target === document || target instanceof MediaQueryList

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (!listener || !globalTarget(this) || options?.signal?.aborted) return add.call(this, type, listener, options)
        let record = listeners.find(record => record.target === this && record.type === type && record.listener === listener && record.capture === capture(options))
        if (!record) {
            record = { target: this, type, listener, capture: capture(options), wrapped: listener }
            const forget = () => {
                const index = listeners.indexOf(record)
                if (index >= 0) listeners.splice(index, 1)
            }
            if (options?.once) {
                record.wrapped = function (event) {
                    forget()
                    if (typeof listener === 'function') listener.call(this, event)
                    else listener.handleEvent(event)
                }
            }
            if (options?.signal) add.call(options.signal, 'abort', forget, { once: true })
            listeners.push(record)
        }
        return add.call(this, type, record.wrapped, options)
    }
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
        const index = listeners.findIndex(record => record.target === this && record.type === type && record.listener === listener && record.capture === capture(options))
        const wrapped = index >= 0 ? listeners[index].wrapped : listener
        if (index >= 0) listeners.splice(index, 1)
        return remove.call(this, type, wrapped, options)
    }

    for (const name of ['IntersectionObserver', 'ResizeObserver', 'MutationObserver']) {
        const Native = window[name]
        window[name] = class extends Native {
            constructor(...args) {
                super(...args)
                this.record = { type: name, targets: new Set() }
                observers.push(this.record)
            }
            observe(target, options) {
                this.record.targets.add(target)
                return super.observe(target, options)
            }
            unobserve(target) {
                this.record.targets.delete(target)
                return super.unobserve(target)
            }
            disconnect() {
                this.record.targets.clear()
                return super.disconnect()
            }
        }
    }

    const requestFrame = window.requestAnimationFrame.bind(window)
    const cancelFrame = window.cancelAnimationFrame.bind(window)
    window.requestAnimationFrame = callback => {
        const id = requestFrame(timestamp => {
            frames.delete(id)
            callback(timestamp)
        })
        frames.add(id)
        return id
    }
    window.cancelAnimationFrame = id => {
        frames.delete(id)
        cancelFrame(id)
    }

    window.__v2ResourceTracker = {
        identity: Math.random(),
        stats: () => ({
            frames: frames.size,
            v2Observers: observers.filter(record => [...record.targets].some(target => target instanceof Element && (target.matches('[data-landing-v2]') || target.closest('[data-landing-v2]')))).length,
            listeners: {
                window: listeners.filter(record => record.target === window).length,
                document: listeners.filter(record => record.target === document).length,
                media: listeners.filter(record => record.target instanceof MediaQueryList).length,
                events: listeners.map(record => `${record.target === window ? 'window' : record.target === document ? 'document' : 'media'}:${record.type}:${record.capture}`).sort(),
            },
        }),
    }
}
