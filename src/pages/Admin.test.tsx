import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
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

  it('says how many installs a device had, once', async () => {
    const reinstalled = { ...detail, devices: [{ ...detail.devices[0], installs: 3, earlierIds: ['d0', 'd00'] }] }
    const api = fake((b) => (b.op === 'user' ? reinstalled : route(b)))
    render(<MemoryRouter><Admin api={api} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    fireEvent.click(await screen.findByRole('button', { name: 'a@example.com' }))
    expect(await screen.findByText(/3 installs on this device/)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3, name: /Pixel/ })).toHaveLength(1)
  })

  it('a device with one install shows no install count', async () => {
    render(<MemoryRouter><Admin api={fake(route)} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    fireEvent.click(await screen.findByRole('button', { name: 'a@example.com' }))
    await screen.findByRole('heading', { level: 3, name: /Pixel/ })
    expect(screen.queryByText(/installs on this device/)).not.toBeInTheDocument()
  })

  it('filters the users list by device type', async () => {
    const many = { users: [
      { ...users.users[0], uid: 'a', email: 'android@example.com', platforms: ['android'] },
      { ...users.users[0], uid: 'm', email: 'mac@example.com', platforms: ['mac', 'android'] },
      { ...users.users[0], uid: 'n', email: 'nodevice@example.com', platforms: [], devices: 0 },
    ] }
    render(<MemoryRouter><Admin api={fake((b) => (b.op === 'users' ? many : route(b)))} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    await screen.findByRole('button', { name: 'android@example.com' })
    fireEvent.click(screen.getByRole('button', { name: 'Mac 1' }))
    expect(screen.getByRole('button', { name: 'mac@example.com' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'android@example.com' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'No device 1' }))
    expect(screen.getByRole('button', { name: 'nodevice@example.com' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'mac@example.com' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Any device 3' }))
    expect(screen.getByRole('button', { name: 'android@example.com' })).toBeInTheDocument()
  })

  it('blocking a user asks first, and the button is not next to the way back', async () => {
    const api = fake(route)
    const ask = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<MemoryRouter><Admin api={api} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    fireEvent.click(await screen.findByRole('button', { name: 'a@example.com' }))
    const block = await screen.findByRole('button', { name: 'Block this user' })
    // It sits in its own section at the bottom, with the other action that cannot be taken lightly.
    expect(screen.getByRole('region', { name: 'Block user' })).toContainElement(block)
    expect(screen.getByRole('button', { name: 'Back to users' }).parentElement).not.toContainElement(block)
    fireEvent.click(block)
    expect(ask).toHaveBeenCalledWith(expect.stringContaining('a@example.com'))
    expect(api.adminApi).not.toHaveBeenCalledWith(owner, expect.objectContaining({ op: 'block' }))
    ask.mockReturnValue(true)
    fireEvent.click(block)
    await waitFor(() => expect(api.adminApi).toHaveBeenCalledWith(owner, { op: 'block', uid: 'u1' }))
  })

  it('the section and the open user are in the address, so the browser Back button steps through them', async () => {
    function Probe() {
      const loc = useLocation(); const nav = useNavigate()
      return <><output data-testid="loc">{loc.search}</output><button type="button" onClick={() => nav(-1)}>probe back</button></>
    }
    render(<MemoryRouter initialEntries={['/admin']}><Probe /><Admin api={fake(route)} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Users' }))
    expect(screen.getByTestId('loc')).toHaveTextContent('?tab=users')
    fireEvent.click(await screen.findByRole('button', { name: 'a@example.com' }))
    expect(screen.getByTestId('loc')).toHaveTextContent('?tab=users&user=u1')
    await screen.findByRole('heading', { level: 2, name: 'a@example.com' })
    fireEvent.click(screen.getByRole('button', { name: 'probe back' }))
    expect(await screen.findByRole('button', { name: 'a@example.com' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'probe back' }))
    expect(await screen.findByTestId('stat-Accounts')).toBeInTheDocument()
    expect(screen.getByTestId('loc')).toHaveTextContent('')
  })

  it('changedSettings keeps only real changes', () => {
    expect(changedSettings({ a: true, l: ['x'] }, { a: true, l: ['x', 'y'] })).toEqual({ l: ['x', 'y'] })
  })

  it('is not indexed', () => expect(getRouteMeta('/admin').noindex).toBe(true))
  it('splits people from likely test accounts and shows platform estimates', async () => {
    const o2 = { ...overview, kinds: { user: 5, reviewer: 2, owner: 1 }, activeAccounts: { day: 4, week: 5, month: 5 },
      platformEstimate: { known: { android: 1, mac: 0, windows: 2 }, unknown: 2, estimated: { android: 2, mac: 0, windows: 3 } } }
    const u2 = { users: [
      { ...users.users[0], kind: 'user', seenBy: 'sign-in', lastSeenMs: Date.now() },
      { ...users.users[0], uid: 'r1', email: 'jeffbanks.17313@gmail.com', kind: 'reviewer', platforms: [] },
    ] }
    render(<MemoryRouter><Admin api={fake((b) => ({ overview: o2, store, users: u2 } as Record<string, unknown>)[b.op as string])} /></MemoryRouter>)
    expect(await screen.findByText('5 people, 2 likely test accounts, 1 yours')).toBeInTheDocument()
    expect(screen.getByTestId('stat-Active today')).toHaveTextContent('4')
    expect(screen.getByText('~3')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Users' }))
    expect(await screen.findByText('via sign-in')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Likely test accounts 1' }))
    expect(screen.queryByRole('button', { name: 'a@example.com' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'jeffbanks.17313@gmail.com' })).toBeInTheDocument()
  })
  it('lists wrong-block reports and marks one as allowed', async () => {
    const reports = { reports: [{ id: 'r1', platform: 'android', appVersion: '1.0.28', app: '', message: 'Adult content is blocked by Blockerflow.', detail: 'Website: foundrlist.com', note: 'startup directory', email: 'a@example.com', uid: 'u1', status: 'open', createdAtMs: 0 }] }
    const api = fake((b) => ({ overview, store, reports, resolveReport: { ok: true } } as Record<string, unknown>)[b.op as string])
    render(<MemoryRouter><Admin api={api} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Reports' }))
    expect(await screen.findByText('Website: foundrlist.com')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Will allow' }))
    await waitFor(() => expect(api.adminApi).toHaveBeenCalledWith(owner, { op: 'resolveReport', id: 'r1', status: 'allowed' }))
  })

  it('shows the website and backend usage sections', async () => {
    const days = (n: number) => Array.from({ length: n }, (_, i) => `2026-11-0${i + 1}`)
    const analytics = {
      generatedAt: '2026-11-07T12:00:00Z',
      web: {
        totals: { users: 1234, newUsers: 900, sessions: 1500, views: 4200, avgSessionSec: 75 },
        days: days(3).map((date) => ({ date, users: 40, newUsers: 30, sessions: 50, views: 140 })),
        pages: [{ path: '/guides/block-instagram-reels-on-android/', views: 800, users: 500 }],
        countries: { Germany: 300 }, sources: { 'google / organic': 700 },
      },
      usage: {
        firestore: {
          days: days(3).map((date) => ({ date, reads: 30000, writes: 200, deletes: 10 })),
          totals: { reads: 90000, writes: 600, deletes: 30 }, today: { reads: 28000, writes: 200, deletes: 10 },
          peak: { reads: { date: '2026-11-05', value: 41000 }, writes: { date: '2026-11-05', value: 200 }, deletes: { date: null, value: 0 } },
          limits: { reads: 50000, writes: 20000, deletes: 20000 },
        },
        functions: { days: days(3).map((date) => ({ date, count: 50 })), total: 150, today: 50, byFunction: { adminApi: 120, reportBlock: 30 }, freeMonthly: 2000000 },
        flags: [{ level: 'near', text: 'Firestore reads: 1 day at 80% or more of the free 50,000 a day. Highest: 41,000 on 2026-11-05.' }],
      },
    }
    render(<MemoryRouter><Admin api={fake((b) => ({ overview, store, analytics } as Record<string, unknown>)[b.op as string])} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Analytics' }))
    expect(await screen.findByTestId('stat-Users')).toHaveTextContent('1,234')
    expect(screen.getByTestId('stat-Avg. session')).toHaveTextContent('1:15')
    expect(screen.getByText('/guides/block-instagram-reels-on-android/')).toBeInTheDocument()
    expect(screen.getByTestId('stat-Reads today')).toHaveTextContent('28.0k')
    expect(screen.getByText('56% of the free 50.0k a day')).toBeInTheDocument()
    expect(screen.getByText('adminApi')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Unusual usage' })).toHaveTextContent('Highest: 41,000 on 2026-11-05')
  })

  it('a section that cannot be read says why and the other still shows', async () => {
    const analytics = {
      generatedAt: '2026-11-07T12:00:00Z',
      web: { error: 'the server account has no access to Analytics property 549757315.' },
      usage: {
        firestore: { days: [], totals: { reads: 0, writes: 0, deletes: 0 }, today: { reads: 10, writes: 1, deletes: 0 },
          peak: { reads: { date: null, value: 0 }, writes: { date: null, value: 0 }, deletes: { date: null, value: 0 } }, limits: { reads: 50000, writes: 20000, deletes: 20000 } },
        functions: { days: [], total: 0, today: 0, byFunction: {}, freeMonthly: 2000000 }, flags: [],
      },
    }
    render(<MemoryRouter><Admin api={fake((b) => ({ overview, store, analytics } as Record<string, unknown>)[b.op as string])} /></MemoryRouter>)
    fireEvent.click(await screen.findByRole('button', { name: 'Analytics' }))
    expect(await screen.findByText('Not available: the server account has no access to Analytics property 549757315.')).toBeInTheDocument()
    expect(screen.getByTestId('stat-Reads today')).toHaveTextContent('10')
  })

  it('bar lists share one grid so long numbers get their own column', async () => {
    render(<MemoryRouter><Admin api={fake(route)} /></MemoryRouter>)
    const bars = (await screen.findByRole('region', { name: 'Blocks by category' })).querySelector('ul')!
    expect(bars.className).toContain('grid-cols-[minmax(0,9rem)_minmax(2rem,1fr)_auto]')
    expect(bars.querySelector('li')!.className).toBe('contents')
  })

  it('shows the live docs only through adminApi, and uploads a new version', async () => {
    const page = '<!doctype html><title>docs</title>'
    const api = fake((b) => (b.op === 'docs' ? { html: page, version: '1.0.30 (37)', updatedMs: 0 } : b.op === 'setDocs' ? { ok: true, version: '1.0.30 (37)' } : route(b)))
    render(<MemoryRouter initialEntries={['/admin?tab=docs']}><Admin api={api} /></MemoryRouter>)
    expect(await screen.findByText('1.0.30 (37)')).toBeInTheDocument()
    expect(api.adminApi).toHaveBeenCalledWith(owner, { op: 'docs' })
    const file = new File([page], 'android-app-live-docs.html', { type: 'text/html' })
    fireEvent.change(screen.getByLabelText('Upload new version'), { target: { files: [file] } })
    await waitFor(() => expect(api.adminApi).toHaveBeenCalledWith(owner, { op: 'setDocs', html: page }))
    expect(await screen.findByRole('status')).toHaveTextContent('Uploaded: Android 1.0.30 (37)')
  })

  it('says when no docs have been uploaded', async () => {
    render(<MemoryRouter initialEntries={['/admin?tab=docs']}><Admin api={fake((b) => (b.op === 'docs' ? { html: null } : route(b)))} /></MemoryRouter>)
    expect(await screen.findByText('No docs uploaded yet.')).toBeInTheDocument()
  })
})
