import { DONATE_URL } from './site'

/**
 * What donations pay for. Costs are the public list prices checked on 2026-10-10: the Apple Developer
 * Program is 99 euro a year, and a Windows code signing certificate for an individual runs roughly
 * 120 to 220 euro a year. Running costs have no amount on purpose: they are small today and change
 * with the number of users, and a stale number would be misleading.
 */
export interface FundingGoal {
  title: string
  cost: string
  why: string
}

export const FUNDING_GOALS: FundingGoal[] = [
  {
    title: 'Apple Developer ID',
    cost: '€99 a year',
    why: 'Signs Blockerflow for macOS and iOS, so it opens without warnings.',
  },
  {
    title: 'Windows code signing certificate',
    cost: 'around €200 a year',
    why: 'Removes the SmartScreen warning when you install on Windows.',
  },
  {
    title: 'Running costs',
    cost: 'ongoing',
    why: 'Domain, email delivery, the AI Coach and the cloud servers behind sign in and sync.',
  },
]

/** Yearly list prices used for the "days covered" arithmetic. Keep in step with FUNDING_GOALS above. */
export const APPLE_YEARLY_EUR = 99
export const WINDOWS_YEARLY_EUR = 200

/** Whole days of a yearly cost an amount pays for. Rounds down so it never overstates, capped at a year. */
export function daysCovered(amountEur: number, yearlyEur: number): number {
  if (!Number.isFinite(amountEur) || amountEur <= 0) return 0
  return Math.min(365, Math.floor((amountEur * 365) / yearlyEur))
}

/** An amount typed by a person: 1 to 10000 euro, dot or comma for cents, rounded to cents. Anything else is null. */
export function parseAmount(input: string): number | null {
  const t = input.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(t)) return null
  const n = Math.round(parseFloat(t) * 100) / 100
  return n >= 1 && n <= 10000 ? n : null
}

/** "10" for whole euros, "7.50" otherwise: how an amount is written in the PayPal link and on the button. */
export function formatAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

/** PayPal.me link with the amount filled in, or the plain link when there is no valid amount. */
export function paypalUrl(amount: number | null): string {
  return amount === null ? DONATE_URL : `${DONATE_URL}/${formatAmount(amount)}EUR`
}
