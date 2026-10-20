import assert from 'node:assert/strict'
import test from 'node:test'
import { monthsLabel } from '../../../resources/js/utils/referralPresentation.js'

test('referral periods use Russian plural forms including teens', () => {
    assert.deepEqual([1, 3, 6, 12, 21, 22, 25].map(monthsLabel), ['1 месяц', '3 месяца', '6 месяцев', '12 месяцев', '21 месяц', '22 месяца', '25 месяцев'])
})
