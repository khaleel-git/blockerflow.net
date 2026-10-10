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
