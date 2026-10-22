import assert from 'node:assert/strict'
import test from 'node:test'
import { initializeInputModality } from '../../../resources/js/utils/inputModality.js'

function documentFixture() {
    const doc = new EventTarget()
    doc.documentElement = { dataset: {} }
    return doc
}

function key(doc, modifiers = {}) {
    const event = new Event('keydown')
    Object.assign(event, { key: 'Tab', ...modifiers })
    doc.dispatchEvent(event)
}

test('pointer activation suppresses the ring until keyboard input resumes', () => {
    const doc = documentFixture()
    initializeInputModality(doc)
    assert.equal(doc.documentElement.dataset.inputMethod, 'keyboard')
    doc.dispatchEvent(new Event('pointerdown'))
    assert.equal(doc.documentElement.dataset.inputMethod, 'pointer')
    key(doc)
    assert.equal(doc.documentElement.dataset.inputMethod, 'keyboard')
})

test('copy and select shortcuts after pointer activation do not add a ring', () => {
    const doc = documentFixture()
    initializeInputModality(doc)
    doc.dispatchEvent(new Event('pointerdown'))
    for (const modifiers of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }]) {
        key(doc, modifiers)
        assert.equal(doc.documentElement.dataset.inputMethod, 'pointer')
    }
    key(doc, { key: 'ArrowRight' })
    assert.equal(doc.documentElement.dataset.inputMethod, 'keyboard')
})

test('initializing twice preserves the current input mode', () => {
    const doc = documentFixture()
    initializeInputModality(doc)
    doc.dispatchEvent(new Event('pointerdown'))
    initializeInputModality(doc)
    assert.equal(doc.documentElement.dataset.inputMethod, 'pointer')
    key(doc)
    assert.equal(doc.documentElement.dataset.inputMethod, 'keyboard')
})
