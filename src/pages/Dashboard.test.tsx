import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard, type DashboardApi } from './Dashboard'
import { isInactive, maskEmail, settingGroups, sortDevices, summarize, type Device } from '../lib/dashboard/model'
import type { DashboardUser } from '../lib/dashboard/firebase'
import { getRouteMeta } from '../seo/routes'

const NOW = new Date(2026, 10, 2, 12, 0, 0) // 2 Nov 2026
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000)

const user: DashboardUser = { uid: 'u1', email: 'khaleel.eu@gmail.com', displayName: 'K', getIdToken: async () => 'tok' }

function device(p: Partial<Device>): Device {
  return {
    id: 'd', platform: 'android', model: 'Xiaomi 23117RA68G', osVersion: 'Android 16', appVersion: '1.0.27',
    firstSeen: daysAgo(40), lastSeen: daysAgo(0), settings: {}, stats: [], ...p,
  }
}

const phone = device({
  id: 'phone',
  lastSeen: daysAgo(0),
  settings: {
    partner_mode_string: 'friend', partner_email: 'friend@example.com', block_adult_content: true, block_youtube_shorts: false,
    blocklist: ['b.example', 'a.example'], blocked_apps: ['com.x'], blocked_apps_mac: ['Steam'], blocked_countdown: 5,
  },
  stats: [
    { date: '2026-11-02', total: 3, counts: { adult: 2, shorts_youtube: 1 } },
    { date: '2026-10-30', total: 4, counts: { adult: 4 } },
    { date: '2026-10-10', total: 10, counts: { focus_mode: 10 } },
    { date: '2026-09-01', total: 99, counts: { adult: 99 } },
  ],
})
const oldMac = device({ id: 'mac', platform: 'mac', model: 'MacBook Air', osVersion: 'macOS 26.1', appVersion: '1.2.2', lastSeen: daysAgo(45), stats: [] })

function fakeApi(signedIn: boolean, devices: Device[] = [phone, oldMac]) {
  const api: DashboardApi = {
    watchUser: (cb) => { cb(signedIn ? user : null); return () => {} },
    signIn: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    loadDevices: vi.fn(async () => devices),
    removeDevice: vi.fn(async () => {}),
    deleteAccount: vi.fn(async () => {}),
  }
  return api
}

const renderPage = (api: DashboardApi) =>
  render(<MemoryRouter><Dashboard api={api} now={NOW} /></MemoryRouter>)

describe('dashboard model', () => {
  it('masks the email', () => {
    expect(maskEmail('khaleel.eu@gmail.com')).toBe('k•••@gmail.com')
    expect(maskEmail('')).toBe('')
  })

  it('sorts by last seen and marks devices unseen for 30 days as inactive', () => {
    expect(sortDevices([oldMac, phone]).map((d) => d.id)).toEqual(['phone', 'mac'])
    expect(isInactive(daysAgo(31), NOW)).toBe(true)
    expect(isInactive(daysAgo(29), NOW)).toBe(false)
    expect(isInactive(null, NOW)).toBe(true)
  })

  it('sums today, 7 and 30 days and per category', () => {
    const s = summarize(phone.stats, NOW)
    expect([s.today, s.last7, s.last30]).toEqual([3, 7, 17])
    expect(s.byCategory.map((c) => [c.category, c.count])).toEqual([['focus_mode', 10], ['adult', 6], ['shorts_youtube', 1]])
  })

  it('shows settings as text, its own platform list only, the Friend email masked', () => {
    const groups = settingGroups(phone.settings, 'android')
    const rows = groups.flatMap((g) => g.rows)
    expect(rows.find((r) => r.label === 'Friend')?.value).toBe('f•••@example.com')
    expect(rows.find((r) => r.label === 'Block adult content')?.value).toBe('On')
    expect(rows.find((r) => r.label === 'Blocked sites')).toMatchObject({ value: '2 sites', items: ['a.example', 'b.example'] })
    expect(rows.filter((r) => r.label === 'Blocked apps')).toHaveLength(1)
    expect(rows.find((r) => r.label === 'Blocked apps')?.items).toEqual(['com.x'])
  })
})

describe('Dashboard', () => {
  it('asks a signed out visitor to sign in', async () => {
    const api = fakeApi(false)
    renderPage(api)
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in with Google' }))
    expect(api.signIn).toHaveBeenCalled()
    expect(api.loadDevices).not.toHaveBeenCalled()
  })

  it('lists the devices newest first with the inactive label and masked email', async () => {
    renderPage(fakeApi(true, [oldMac, phone]))
    const cards = await screen.findAllByRole('article')
    expect(cards.map((c) => c.getAttribute('aria-label'))).toEqual(['Android: Xiaomi 23117RA68G', 'Mac: MacBook Air'])
    expect(within(cards[1]).getByText('Inactive')).toBeInTheDocument()
    expect(within(cards[0]).queryByText('Inactive')).toBeNull()
    expect(screen.getByText('Signed in as k•••@gmail.com')).toBeInTheDocument()
  })

  it('shows the settings read only: no inputs or switches inside a device', async () => {
    renderPage(fakeApi(true))
    const card = (await screen.findAllByRole('article'))[0]
    expect(within(card).getByText('Settings (read only)')).toBeInTheDocument()
    expect(within(card).getByText('Block adult content')).toBeInTheDocument()
    expect(card.querySelectorAll('input, select, textarea, [role="switch"], [role="checkbox"]')).toHaveLength(0)
  })

  it('shows the account totals', async () => {
    renderPage(fakeApi(true))
    await screen.findAllByRole('article')
    expect(screen.getAllByTestId('total-Today')[0]).toHaveTextContent('3')
    expect(screen.getAllByTestId('total-30 days')[0]).toHaveTextContent('17')
  })

  it('removes a device through removeDevice after confirming', async () => {
    const api = fakeApi(true)
    renderPage(api)
    const card = (await screen.findAllByRole('article'))[1]
    fireEvent.click(within(card).getByRole('button', { name: 'Remove device' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Remove' }))
    await waitFor(() => expect(api.removeDevice).toHaveBeenCalledWith(user, 'mac'))
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
  })

  it('deletes the account only after DELETE is typed', async () => {
    const api = fakeApi(true)
    renderPage(api)
    await screen.findAllByRole('article')
    const button = screen.getByRole('button', { name: 'Delete my account' })
    expect(button).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Type DELETE to confirm'), { target: { value: 'delete' } })
    expect(button).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Type DELETE to confirm'), { target: { value: 'DELETE' } })
    fireEvent.click(button)
    await waitFor(() => expect(api.deleteAccount).toHaveBeenCalledWith(user))
    expect(await screen.findByText('Your account is deleted')).toBeInTheDocument()
  })

  it('shows a server error instead of pretending', async () => {
    const api = fakeApi(true)
    api.removeDevice = vi.fn(async () => { throw new Error('Device not found') })
    renderPage(api)
    fireEvent.click(within((await screen.findAllByRole('article'))[0]).getByRole('button', { name: 'Remove device' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remove' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not remove the device. Device not found')
  })

  it('noSettingsWrites: the dashboard code has no Firestore write call', () => {
    const files = ['src/pages/Dashboard.tsx', 'src/lib/dashboard/firebase.ts', 'src/lib/dashboard/model.ts']
    for (const f of files) {
      const src = readFileSync(f, 'utf8')
      for (const w of ['setDoc', 'updateDoc', 'addDoc', 'deleteDoc', 'writeBatch', 'runTransaction']) {
        expect(src.includes(w), `${f} uses ${w}`).toBe(false)
      }
    }
  })

  it('is not indexed', async () => {
    renderPage(fakeApi(false))
    await screen.findByRole('button', { name: 'Sign in with Google' })
    expect(document.title).toBe('Dashboard — Blockerflow')
    // The prerendered head carries the robots tag and the sitemap leaves the page out.
    expect(getRouteMeta('/dashboard').noindex).toBe(true)
  })
})
