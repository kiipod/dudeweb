// Document-scoped for the lifetime of the Inertia app, including Teleports.
// No stored preference: each visit starts with a visible keyboard focus.
export function initializeInputModality(doc = document) {
    const root = doc.documentElement
    if (root.dataset.inputMethod) return

    root.dataset.inputMethod = 'keyboard'
    doc.addEventListener('pointerdown', () => { root.dataset.inputMethod = 'pointer' }, true)
    doc.addEventListener('keydown', event => {
        // Copy/select shortcuts after a pointer click should keep the pointer
        // presentation; Tab/arrow navigation restores the keyboard indicator.
        if (!event.metaKey && !event.altKey && !event.ctrlKey) root.dataset.inputMethod = 'keyboard'
    }, true)
}
