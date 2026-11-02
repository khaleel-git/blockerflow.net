import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Admin, changedSettings, type AdminApi } from './Admin'
import type { DashboardUser } from '../lib/dashboard/firebase'
import { getRouteMeta } from '../seo/routes'

const owner: DashboardUser = { uid: 'o', email: 'khaleel.eu@gmail.com', displayName: 'K', getIdToken: async () => 't' }
const overview = {
  accounts: 3, blocked: 1, accountsByPlatform: { android: 2, mac: 1, windows: 0, none: 0 }, devicesByPlatform: { android: 2, mac: 1, windows: 0 },
  activeDevices: { day: 2, week: 3, month: 3 }, versions: { android: { '1.0.27': 2 }, mac: { '1.2.3': 1 }, windows: {} },
  partnerModes: { friend: 1, myself: 2 }, signups: [{ date: '2026-11-02', count: 1 }], blocks: { days: {}, categories: { adult: 4 } },
}
const store = { play: { connected: true, activeDevices: 9, totalUserInstalls: 12, days: [], asOf: '2026-10-29' }, mac: { connected: true, total: 5, releases: [{ tag: 'mac-v1.2.3', downloads: 5 }] }, microsoft: { connected: false, error: 'Partner Center is not connected yet.' } }
const users = { users: [{ uid: 'u1', email: 'a@example.com', name: 'A', disabled: false, createdMs: 0, lastSignInMs: null, platforms: ['android'], devices: 1, lastSeenMs: null }] }
const detail = {
  uid: 'u1', email: 'a@example.com', name: 'A', disabled: false, createdMs: 0, lastSignInMs: null, partnerConfirmed: false, log: [],
  devices: [{ id: 'd1', platform: 'android', model: 'Pixel', osVersion: 'Android 16', appVersion: '1.0.27', firstSeenMs: null, lastSeenMs: null, adminOverride: null, stats: [], settings: { block_adult_content: true, partner_mode_string: 'friend', partner_email: 'f@example.com' } }],
}

function fake(reply: (b: Record<string, unknown>) => unknown) {
  const api: AdminApi = {
    watchUser: (cb) => { cb(owner); return () => {} },
    signIn: async () => {}, signOut: async () => {},
    adminApi: vi.fn(async (_u, b: Record<string, unknown>) => { const r = reply(b); if (r instanceof Error) throw r; return r as never }) as AdminApi['adminApi'],
  }
  return api
}
const route = (b: Record<string, unknown>) => ({ overview, store, users, user: detail, setSettings: { ok: true } } as Record<string, unknown>)[b.op as string]

describe('Admin', () => {
  it('shows the overview numbers and store numbers', async () => {
    render(<MemoryRouter><Admin api={fake(route)} /></MemoryRouter>)
    expect(await screen.findByTestId('stat-Accounts')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-Active installs')).toHaveTextContent('9')
    expect(screen.getByTestId('stat-Mac downloads')).toHaveTextContent('5')
    expect(screen.getByRole('link', { name: 'Open Partner Center statistics' })).toHaveAttribute('href', expect.stringContaining('partner.microsoft.com'))
  })

  it('says so when the account is not an admin', async () => {
    render(<MemoryRouter><Admin api={fake(() => new Error('Not an admin'))} /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toHaveTextContent('This account is not an admin.')
  })

  it('changes a user setting: only the changed key goes to the server', async () => {
    const api = fake(route)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<MemoryRouter><Admin api={api} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    fireEvent.click(await screen.findByRole('button', { name: 'a@example.com' }))
    fireEvent.click(await screen.findByLabelText('Block adult content'))
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(api.adminApi).toHaveBeenCalledWith(owner, { op: 'setSettings', deviceId: 'd1', settings: { block_adult_content: false }, uid: 'u1' }))
  })

  it('changedSettings keeps only real changes', () => {
    expect(changedSettings({ a: true, l: ['x'] }, { a: true, l: ['x', 'y'] })).toEqual({ l: ['x', 'y'] })
  })

  it('is not indexed', () => expect(getRouteMeta('/admin').noindex).toBe(true))
})
