import { describe, it, expect } from 'vitest'
import { APPLE_YEARLY_EUR, WINDOWS_YEARLY_EUR, daysCovered, parseAmount, paypalUrl } from './funding'

describe('daysCovered', () => {
  it('turns an amount into whole days of a yearly cost, rounding down so it never overstates', () => {
    expect(daysCovered(10, APPLE_YEARLY_EUR)).toBe(36) // 10 / 99 * 365 = 36.87
    expect(daysCovered(10, WINDOWS_YEARLY_EUR)).toBe(18) // 10 / 200 * 365 = 18.25
    expect(daysCovered(3, APPLE_YEARLY_EUR)).toBe(11)
  })
  it('caps at a full year', () => {
    expect(daysCovered(99, APPLE_YEARLY_EUR)).toBe(365)
    expect(daysCovered(500, APPLE_YEARLY_EUR)).toBe(365)
  })
  it('is zero for no, negative or broken amounts', () => {
    expect(daysCovered(0, APPLE_YEARLY_EUR)).toBe(0)
    expect(daysCovered(-5, APPLE_YEARLY_EUR)).toBe(0)
    expect(daysCovered(NaN, APPLE_YEARLY_EUR)).toBe(0)
  })
})

describe('parseAmount', () => {
  it('accepts whole numbers and decimals with a dot or a comma', () => {
    expect(parseAmount('7')).toBe(7)
    expect(parseAmount('7.5')).toBe(7.5)
    expect(parseAmount('7,5')).toBe(7.5)
    expect(parseAmount(' 12 ')).toBe(12)
  })
  it('rounds to cents', () => {
    expect(parseAmount('2.999')).toBe(3)
  })
  it('rejects empty, text, below 1 euro and absurdly large amounts', () => {
    for (const bad of ['', 'abc', '0', '0.5', '-3', '10001', '1e3', '5 euro']) expect(parseAmount(bad), bad).toBeNull()
  })
})

describe('paypalUrl', () => {
  it('prefills the amount in euro on the PayPal.me link', () => {
    expect(paypalUrl(10)).toBe('https://www.paypal.com/paypalme/Khaleeleu/10EUR')
    expect(paypalUrl(7.5)).toBe('https://www.paypal.com/paypalme/Khaleeleu/7.50EUR')
  })
  it('falls back to the plain link when there is no valid amount', () => {
    expect(paypalUrl(null)).toBe('https://www.paypal.com/paypalme/Khaleeleu')
  })
})
