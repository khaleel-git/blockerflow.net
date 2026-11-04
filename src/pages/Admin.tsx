import { useCallback, useEffect, useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { CATEGORY_NAMES, PLATFORM_NAMES, seenText } from '../lib/dashboard/model'
import type { DashboardUser } from '../lib/dashboard/firebase'

/**
 * blockerflow.net/admin (noindex, not linked): the owner's view of every account. Every number
 * and every change goes through adminApi, which checks the admin email on the server; this page
 * holds no data of its own. Design: blockerflow repo docs/superpowers/specs/2026-11-02-admin-dashboard-design.md.
 */

export interface AdminApi {
  watchUser: (cb: (u: DashboardUser | null) => void) => () => void
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  adminApi: <T>(user: DashboardUser, body: Record<string, unknown>) => Promise<T>
}

interface Overview {
  accounts: number
  blocked: number
  accountsByPlatform: Record<string, number>
  devicesByPlatform: Record<string, number>
  activeDevices: { day: number; week: number; month: number }
  versions: Record<string, Record<string, number>>
  partnerModes: Record<string, number>
  signups: { date: string; count: number }[]
  blocks: { days: Record<string, number>; categories: Record<string, number> }
  /** Newer server: people vs store reviewers vs the owner's own accounts. */
  kinds?: { user: number; reviewer: number; owner: number }
  activeAccounts?: { day: number; week: number; month: number }
  platformEstimate?: { known: Record<string, number>; unknown: number; estimated: Record<string, number> }
  peopleSignups?: { date: string; count: number }[]
}
interface UserRow {
  uid: string; email: string; name: string; disabled: boolean; createdMs: number; lastSignInMs: number | null
  platforms: string[]; devices: number; lastSeenMs: number | null
  seenBy?: 'device' | 'settings' | 'sign-in' | null; kind?: 'user' | 'reviewer' | 'owner'; synced?: boolean
}
interface AdminDevice {
  id: string; platform: string; model: string; osVersion: string; appVersion: string; firstSeenMs: number | null; lastSeenMs: number | null
  settings: Record<string, unknown>; adminOverride: { id: string; atMs: number | null } | null
  stats: { date: string; total: number; counts: Record<string, number> }[]
}
interface UserDetail {
  uid: string; email: string; name: string; disabled: boolean; createdMs: number; lastSignInMs: number | null
  partnerConfirmed: boolean; devices: AdminDevice[]
  log: { action: string; keys: string[]; deviceId: string | null; atMs: number | null; actor: string }[]
}
interface Store {
  play: { connected: boolean; error?: string; days?: { date: string; installs: number; uninstalls: number; active: number }[]; activeDevices?: number; totalUserInstalls?: number; asOf?: string | null }
  mac: { connected: boolean; total: number; releases: { tag: string; downloads: number }[] }
  microsoft: { connected: boolean; error?: string }
}

/** Partner Center's acquisitions (installs) report for Blockerflow (Store ID 9MSPSNKXFG4W). */
export const PARTNER_CENTER_INSIGHTS = 'https://partner.microsoft.com/dashboard/insights/analytics/acquisitions'

const loadApi = (): Promise<AdminApi> => import('../lib/dashboard/firebase')
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const fmtDate = (ms: number | null) => (ms ? new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'never')

function Btn({ tone = 'solid', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'solid' | 'outline' | 'danger' }) {
  const look = {
    solid: 'bg-primary text-white hover:opacity-90',
    outline: 'border border-outline bg-surface text-ink hover:bg-primary-bg',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[tone]
  return <button type="button" {...p} className={cx('rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40', look, className)} />
}
const PLATFORM_COLORS: Record<string, string> = { android: '#16A34A', windows: '#0284C7', mac: '#64748B', none: '#CBD5E1' }

const Panel = ({ title, hint, children, className }: { title: string; hint?: string; children: ReactNode; className?: string }) => (
  <section className={cx('rounded-2xl border border-outline bg-surface p-5 shadow-sm', className)} aria-label={title}>
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
    <div className="mt-4">{children}</div>
  </section>
)
const Big = ({ label, value }: { label: string; value: number | string }) => (
  <div>
    <dt className="text-xs text-ink-muted">{label}</dt>
    <dd className="font-display text-3xl font-semibold tabular-nums text-ink" data-testid={`stat-${label}`}>{value}</dd>
  </div>
)

/** One headline number on a card with a coloured top edge. */
const Kpi = ({ label, value, sub, color = 'var(--color-primary)' }: { label: string; value: number | string; sub?: string; color?: string }) => (
  <div className="relative overflow-hidden rounded-2xl border border-outline bg-surface p-5 shadow-sm">
    <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} aria-hidden="true" />
    <dl>
      <Big label={label} value={value} />
    </dl>
    {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
  </div>
)

const PlatformDot = ({ p }: { p: string }) => (
  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: PLATFORM_COLORS[p] ?? '#94A3B8' }} aria-hidden="true" />
)

/** Horizontal bars for a few named numbers. */
function Bars({ data, names = {}, colors = {} }: { data: Record<string, number>; names?: Record<string, string>; colors?: Record<string, string> }) {
  const rows = Object.entries(data).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  if (rows.length === 0) return <p className="text-sm text-ink-muted">Nothing yet.</p>
  const max = rows[0][1]
  return (
    <ul className="space-y-2">
      {rows.map(([k, v]) => (
        <li key={k} className="grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-ink">{names[k] ?? k}</span>
          <span className="h-2.5 rounded-full bg-primary-bg"><span className="block h-2.5 rounded-full bg-primary" style={{ width: `${Math.max(4, (v / max) * 100)}%`, background: colors[k] }} /></span>
          <span className="text-right font-semibold tabular-nums">{v}</span>
        </li>
      ))}
    </ul>
  )
}

/** One column per day, today last. */
function DayColumns({ days, label }: { days: { date: string; value: number }[]; label: string }) {
  const max = Math.max(1, ...days.map((d) => d.value))
  return (
    <figure>
      <div className="flex h-28 items-end gap-[3px]" role="img" aria-label={label}>
        {days.map((d, i) => (
          <div key={d.date} title={`${d.date}: ${d.value}`}
            className={cx('flex-1 rounded-t-sm', i === days.length - 1 ? 'bg-primary' : d.value ? 'bg-indigo-300' : 'bg-outline')}
            style={{ height: d.value ? `${Math.max(8, (d.value / max) * 100)}%` : '4px' }} />
        ))}
      </div>
      {days.length > 0 && (
        <figcaption className="mt-1 flex justify-between text-xs text-ink-muted"><span>{days[0].date}</span><span>{days[days.length - 1].date}</span></figcaption>
      )}
    </figure>
  )
}

const last30 = (byDate: Record<string, number>) => {
  const out: { date: string; value: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    out.push({ date: d, value: byDate[d] ?? 0 })
  }
  return out
}

function OverviewTab({ o, store }: { o: Overview; store: Store | null }) {
  const active = o.activeAccounts ?? o.activeDevices
  const k = o.kinds
  const est = o.platformEstimate
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="Accounts" value={o.accounts} sub={k ? `${k.user} people, ${k.reviewer} store reviewers, ${k.owner} yours` : undefined} />
        <Kpi label="Active today" value={active.day} color="#16A34A" sub={o.activeAccounts ? 'people, any app version' : 'devices'} />
        <Kpi label="Active 7 days" value={active.week} color="#0284C7" sub={o.activeAccounts ? 'people' : 'devices'} />
        <Kpi label="Active 30 days" value={active.month} color="#7C3AED" sub={o.activeAccounts ? 'people' : 'devices'} />
        <Kpi label="Blocked" value={o.blocked} color="#D97706" sub="accounts that cannot sign in" />
      </div>

      <InstallsPanel o={o} store={store} />

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Sign-ups, last 30 days" hint={o.peopleSignups ? 'people only' : undefined}>
          <DayColumns label="Sign-ups per day" days={(o.peopleSignups ?? o.signups).map((s) => ({ date: s.date, value: s.count }))} />
        </Panel>
        <Panel title="Blocks, all users, last 30 days" hint="from new app versions">
          <DayColumns label="Blocks per day" days={last30(o.blocks.days)} />
        </Panel>
        <Panel title="Devices with a device record" hint="new app versions only">
          <Bars data={o.devicesByPlatform} names={PLATFORM_NAMES} colors={PLATFORM_COLORS} />
          {est && <p className="mt-3 text-xs text-ink-muted">{est.unknown} people still run an older version that sends no device record.</p>}
        </Panel>
        <Panel title="Blocks by category"><Bars data={o.blocks.categories} names={CATEGORY_NAMES} /></Panel>
        <Panel title="Accountability partner"><Bars data={o.partnerModes} names={{ friend: 'Friend', timedelay: 'Time Delay', ai: 'AI Coach', myself: 'Myself' }} /></Panel>
        <Panel title="App versions in use">
          <div className="space-y-4">
            {(['android', 'mac', 'windows'] as const).map((p) => (
              <div key={p}>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><PlatformDot p={p} />{PLATFORM_NAMES[p]}</p>
                <Bars data={o.versions[p] ?? {}} colors={Object.fromEntries(Object.keys(o.versions[p] ?? {}).map((v) => [v, PLATFORM_COLORS[p]]))} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      {store && <StoreTab store={store} />}
      <p className="text-xs leading-relaxed text-ink-muted">
        How this is counted: store reviewers are accounts named like firstnamelastname.12345@gmail.com, the shape Google Play and Microsoft
        Store reviewers sign in with. Active means the account was seen by a device record, a settings sync or a sign-in token refresh.
        Platform estimates spread people on older app versions in the same ratio as people already on new versions.
      </p>
    </div>
  )
}

/** Installs per platform: real store numbers where we have them, estimates from accounts otherwise. */
function InstallsPanel({ o, store }: { o: Overview; store: Store | null }) {
  const est = o.platformEstimate
  const card = (p: string, title: string, main: ReactNode, lines: string[], extra?: ReactNode) => (
    <div className="rounded-xl border border-outline p-4" style={{ borderTop: `4px solid ${PLATFORM_COLORS[p]}` }}>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink"><PlatformDot p={p} />{title}</p>
      <div className="mt-2">{main}</div>
      <ul className="mt-2 space-y-0.5 text-xs text-ink-muted">{lines.map((l) => <li key={l}>{l}</li>)}</ul>
      {extra}
    </div>
  )
  const n = (v: number | string, unit: string) => <p><span className="font-display text-3xl font-semibold tabular-nums text-ink">{v}</span> <span className="text-sm text-ink-muted">{unit}</span></p>
  const play = store?.play
  return (
    <Panel title="Installs by platform" hint="store numbers where available, otherwise estimates">
      <div className="grid gap-4 md:grid-cols-3">
        {card('android', 'Android',
          play?.connected ? n(play.activeDevices ?? 0, 'active installs') : n(est ? `~${est.estimated.android}` : o.accountsByPlatform.android, 'accounts (estimate)'),
          [
            est ? `${est.known.android} people on 1.0.27 or newer` : '',
            play?.connected ? `${play.totalUserInstalls ?? 0} installs in total (Play)` : 'Play reports: waiting for access (up to 24 hours after the invite)',
          ].filter(Boolean))}
        {card('windows', 'Windows',
          n(est ? `~${est.estimated.windows}` : o.accountsByPlatform.windows, 'accounts (estimate)'),
          [
            est ? `${est.known.windows} people on 1.0.4 or newer` : '',
            'Store installs are higher: not everyone signs in',
          ].filter(Boolean),
          <a href={PARTNER_CENTER_INSIGHTS} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Exact installs in Partner Center</a>)}
        {card('mac', 'Mac',
          n(store ? store.mac.total : 'n/a', 'downloads (GitHub)'),
          [est ? `${est.known.mac} people on 1.2.2 or newer` : '', `${o.devicesByPlatform.mac ?? 0} Mac devices with a record`].filter(Boolean))}
      </div>
    </Panel>
  )
}

function StoreTab({ store }: { store: Store }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Panel title="Google Play" hint={store.play.connected ? `as of ${store.play.asOf ?? 'n/a'}` : undefined}>
        {store.play.connected ? (
          <>
            <dl className="grid grid-cols-2 gap-4">
              <Big label="Active installs" value={store.play.activeDevices ?? 0} />
              <Big label="Total installs" value={store.play.totalUserInstalls ?? 0} />
            </dl>
            <div className="mt-4"><DayColumns label="Play installs per day" days={(store.play.days ?? []).slice(-30).map((d) => ({ date: d.date, value: d.installs }))} /></div>
            <p className="mt-2 text-xs text-ink-muted">Google updates these reports about once a day.</p>
          </>
        ) : <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">Play reports are not readable yet. The server account was invited on 4 Nov 2026; Google can take up to 24 hours to give it access.</p>}
      </Panel>
      <Panel title="Mac downloads (GitHub)">
        <dl><Big label="Mac downloads" value={store.mac.total} /></dl>
        <ul className="mt-3 space-y-1 text-sm">
          {store.mac.releases.map((r) => <li key={r.tag} className="flex justify-between border-b border-outline pb-1 last:border-0"><span className="text-ink-muted">{r.tag}</span><span className="tabular-nums">{r.downloads}</span></li>)}
        </ul>
      </Panel>
      <Panel title="Microsoft Store">
        <p className="text-sm text-ink-muted">
          Microsoft only shares Store numbers through a paid business directory, so they are not loaded here. Partner Center shows them.
        </p>
        <a href={PARTNER_CENTER_INSIGHTS} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-xl border border-outline px-4 py-2 text-sm font-semibold text-ink hover:bg-primary-bg">
          Open Partner Center statistics
        </a>
      </Panel>
    </div>
  )
}

const BOOL_LABELS: [string, string][] = [
  ['block_adult_content', 'Block adult content'], ['block_image_video_search', 'Block image and video search'],
  ['block_known_piracy_sites', 'Block piracy sites'], ['block_insta_reels', 'Block Instagram Reels'],
  ['block_insta_search', 'Block Instagram search'], ['block_fb_reels', 'Block Facebook Reels'],
  ['block_youtube_shorts', 'Block YouTube Shorts'], ['block_snap_videos', 'Block Snapchat videos'],
  ['block_snap_search', 'Block Snapchat search'], ['block_x_videos', 'Block X videos'],
  ['block_whatsapp_channels', 'Block WhatsApp channels'], ['block_telegram_channels', 'Block Telegram channels'],
  ['block_unsupported_browsers', 'Block unsupported browsers'], ['block_newly_installed_apps', 'Block newly installed apps'],
  ['uninstall_protection', 'Uninstall protection'], ['protect_focus_mode', 'Protect Focus Mode'],
]
const LIST_LABELS: [string, string][] = [
  ['blocklist', 'Blocked sites'], ['whitelist', 'Always allowed sites'], ['blocked_apps', 'Blocked apps (Android)'],
  ['blocked_apps_mac', 'Blocked apps (Mac)'], ['blocked_apps_windows', 'Blocked apps (Windows)'],
]

/** Only what was changed, in the server's types. */
export function changedSettings(original: Record<string, unknown>, edited: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(edited)) {
    if (JSON.stringify(v) !== JSON.stringify(original[k])) out[k] = v
  }
  return out
}

function DeviceEditor({ device, onSave, busy }: { device: AdminDevice; onSave: (changes: Record<string, unknown>) => void; busy: boolean }) {
  const [edit, setEdit] = useState<Record<string, unknown>>(device.settings)
  useEffect(() => setEdit(device.settings), [device.settings])
  const changes = changedSettings(device.settings, edit)
  const set = (k: string, v: unknown) => setEdit((e) => ({ ...e, [k]: v }))
  const list = (k: string) => (Array.isArray(edit[k]) ? (edit[k] as string[]).join('\n') : '')
  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-ink">Accountability partner
          <select className="mt-1 w-full rounded-lg border border-outline bg-surface px-2 py-1.5" value={String(edit.partner_mode_string ?? 'myself').toLowerCase()}
            onChange={(e) => set('partner_mode_string', e.target.value)}>
            <option value="myself">Myself</option><option value="friend">Friend</option><option value="timedelay">Time Delay</option><option value="ai">AI Coach</option>
          </select>
        </label>
        <label className="text-sm text-ink">Friend email
          <input className="mt-1 w-full rounded-lg border border-outline bg-surface px-2 py-1.5" value={String(edit.partner_email ?? '')} onChange={(e) => set('partner_email', e.target.value)} />
        </label>
      </div>
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {BOOL_LABELS.filter(([k]) => k in edit).map(([k, label]) => (
          <label key={k} className="flex items-center justify-between gap-3 py-1 text-sm text-ink">
            {label}
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" checked={edit[k] === true} onChange={(e) => set(k, e.target.checked)} />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {LIST_LABELS.filter(([k]) => k in edit).map(([k, label]) => (
          <label key={k} className="text-sm text-ink">{label} (one per line)
            <textarea rows={3} className="mt-1 w-full rounded-lg border border-outline bg-surface px-2 py-1.5 font-mono text-xs" value={list(k)}
              onChange={(e) => set(k, e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline pt-3">
        <span className="text-xs text-ink-muted">
          {Object.keys(changes).length ? `Changed: ${Object.keys(changes).join(', ')}. The user is emailed.` : 'No changes.'}
        </span>
        <Btn disabled={busy || Object.keys(changes).length === 0} onClick={() => onSave(changes)}>Save changes</Btn>
      </div>
    </div>
  )
}

function UserPage({ api, user, uid, onBack }: { api: AdminApi; user: DashboardUser; uid: string; onBack: () => void }) {
  const [u, setU] = useState<UserDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const load = useCallback(async () => setU(await api.adminApi<UserDetail>(user, { op: 'user', uid })), [api, user, uid])
  useEffect(() => { load().catch((e) => setMsg(String(e.message ?? e))) }, [load])
  const act = async (body: Record<string, unknown>, done: string) => {
    setBusy(true); setMsg(null)
    try { await api.adminApi(user, { ...body, uid }); setMsg(done); if (body.op !== 'deleteUser') await load() } catch (e) { setMsg(`Failed: ${(e as Error).message}`) } finally { setBusy(false) }
  }
  if (!u) return <p className="mt-6 text-ink-muted">{msg ?? 'Loading…'}</p>
  return (
    <div className="mt-6 space-y-4">
      <Btn tone="outline" onClick={onBack}>Back to users</Btn>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink">{u.email || u.uid}</h2>
          <p className="text-sm text-ink-muted">
            {u.name && `${u.name}, `}joined {fmtDate(u.createdMs)}, last sign-in {fmtDate(u.lastSignInMs)}, Friend confirmed: {u.partnerConfirmed ? 'yes' : 'no'}
          </p>
        </div>
        <div className="flex gap-2">
          {u.disabled
            ? <Btn tone="outline" disabled={busy} onClick={() => act({ op: 'unblock' }, 'Unblocked.')}>Unblock</Btn>
            : <Btn tone="outline" disabled={busy} onClick={() => act({ op: 'block' }, 'Blocked: sign-in disabled.')}>Block</Btn>}
        </div>
      </header>
      {u.disabled && <p className="rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-900">Blocked: this account cannot sign in.</p>}
      {msg && <p role="status" className="rounded-xl bg-primary-bg px-4 py-2 text-sm text-ink">{msg}</p>}
      {u.devices.length === 0 && <p className="text-ink-muted">No devices.</p>}
      {u.devices.map((d) => (
        <section key={d.id} className="rounded-2xl border border-outline bg-surface p-5" aria-label={`${PLATFORM_NAMES[d.platform] ?? d.platform} ${d.model}`}>
          <h3 className="text-lg font-semibold text-ink">{PLATFORM_NAMES[d.platform] ?? d.platform} <span className="font-normal text-ink-muted">{d.model}</span></h3>
          <p className="text-sm text-ink-muted">
            {d.osVersion}, app {d.appVersion}, last seen {seenText(d.lastSeenMs ? new Date(d.lastSeenMs) : null, new Date())},
            blocks in 30 days: {d.stats.reduce((n, s) => n + s.total, 0)}
            {d.adminOverride && `, last support change ${fmtDate(d.adminOverride.atMs)}`}
          </p>
          <DeviceEditor device={d} busy={busy}
            onSave={(changes) => { if (window.confirm(`Change ${Object.keys(changes).length} setting(s) on this device? The user is emailed.`)) void act({ op: 'setSettings', deviceId: d.id, settings: changes }, 'Saved. The app applies it on its next sync.') }} />
        </section>
      ))}
      <Panel title="Admin log">
        {u.log.length === 0 ? <p className="text-sm text-ink-muted">No admin actions yet.</p> : (
          <ul className="space-y-1 text-sm">
            {u.log.map((l, i) => <li key={i}>{fmtDate(l.atMs)}: {l.action}{l.keys.length ? ` (${l.keys.join(', ')})` : ''} by {l.actor}</li>)}
          </ul>
        )}
      </Panel>
      <section className="border-t border-outline pt-5" aria-label="Delete user">
        <h3 className="font-semibold text-red-700">Delete this user</h3>
        <p className="mt-1 text-sm text-ink-muted">Deletes the account, every device record and all block counts. Cannot be undone.</p>
        <div className="mt-3 flex max-w-md items-end gap-3">
          <label className="flex-1 text-sm text-ink">Type the email to confirm
            <input className="mt-1 w-full rounded-lg border border-outline bg-surface px-2 py-1.5" value={typed} onChange={(e) => setTyped(e.target.value)} />
          </label>
          <Btn tone="danger" disabled={busy || typed.trim() !== u.email} onClick={() => act({ op: 'deleteUser' }, 'Deleted.').then(onBack)}>Delete user</Btn>
        </div>
      </section>
    </div>
  )
}

const KIND_LABELS = { user: 'People', reviewer: 'Store reviewers', owner: 'Yours' } as const
const SEEN_BY: Record<string, string> = { device: 'device record', settings: 'settings sync', 'sign-in': 'sign-in' }

function UsersTab({ api, user, onOpen }: { api: AdminApi; user: DashboardUser; onOpen: (uid: string) => void }) {
  const [rows, setRows] = useState<UserRow[] | null>(null)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'all' | 'user' | 'reviewer' | 'owner'>('all')
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { api.adminApi<{ users: UserRow[] }>(user, { op: 'users' }).then((r) => setRows(r.users)).catch((e) => setErr(String(e.message))) }, [api, user])
  const count = (k: string) => (rows ?? []).filter((r) => (r.kind ?? 'user') === k).length
  const shown = useMemo(() => (rows ?? [])
    .filter((r) => kind === 'all' || (r.kind ?? 'user') === kind)
    .filter((r) => !q || r.email.toLowerCase().includes(q.toLowerCase()) || r.uid.includes(q)), [rows, q, kind])
  if (err) return <p role="alert" className="mt-4 text-red-700">{err}</p>
  if (!rows) return <p className="mt-4 text-ink-muted">Loading users…</p>
  const now = new Date()
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show accounts">
          {(['all', 'user', 'reviewer', 'owner'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
              className={cx('rounded-full border px-3 py-1 text-sm', kind === k ? 'border-ink bg-ink text-white' : 'border-outline bg-surface text-ink-muted hover:bg-primary-bg')}>
              {k === 'all' ? `All ${rows.length}` : `${KIND_LABELS[k]} ${count(k)}`}
            </button>
          ))}
        </div>
        <label className="block w-full max-w-xs text-sm text-ink">Search by email
          <input className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-outline bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-outline bg-bg text-xs uppercase tracking-wide text-ink-muted">
            <tr><th className="px-4 py-3 font-medium">Account</th><th className="px-4 py-3 font-medium">Platforms</th><th className="px-4 py-3 font-medium">Devices</th><th className="px-4 py-3 font-medium">Last seen</th><th className="px-4 py-3 font-medium">Joined</th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.uid} className={cx('border-b border-outline last:border-0 hover:bg-primary-bg', r.kind === 'reviewer' && 'opacity-60')}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-bg text-xs font-semibold uppercase text-primary" aria-hidden="true">{(r.email || '?').slice(0, 1)}</span>
                    <div className="min-w-0">
                      <button type="button" className="truncate text-left font-medium text-ink hover:text-primary hover:underline" onClick={() => onOpen(r.uid)}>{r.email || r.uid}</button>
                      <div className="flex gap-1.5">
                        {r.kind === 'reviewer' && <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-600">Store reviewer</span>}
                        {r.kind === 'owner' && <span className="rounded-full bg-primary-bg px-2 text-xs text-primary">Yours</span>}
                        {r.disabled && <span className="rounded-full bg-amber-50 px-2 text-xs text-amber-900">Blocked</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  {r.platforms.length ? (
                    <div className="flex flex-wrap gap-1.5">{r.platforms.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-outline px-2 py-0.5 text-xs"><PlatformDot p={p} />{PLATFORM_NAMES[p] ?? p}</span>
                    ))}</div>
                  ) : <span className="text-xs text-ink-muted">{r.lastSeenMs ? 'older app' : 'none'}</span>}
                </td>
                <td className="px-4 py-2.5 tabular-nums">{r.devices}</td>
                <td className="px-4 py-2.5">
                  <span>{seenText(r.lastSeenMs ? new Date(r.lastSeenMs) : null, now)}</span>
                  {r.seenBy && <span className="block text-xs text-ink-muted">via {SEEN_BY[r.seenBy]}</span>}
                </td>
                <td className="px-4 py-2.5 text-ink-muted">{fmtDate(r.createdMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-muted">{shown.length} of {rows.length} accounts. Store reviewers are named like firstnamelastname.12345@gmail.com.</p>
    </div>
  )
}

export function Admin({ api: given }: { api?: AdminApi }) {
  usePageMeta('/admin')
  const [api, setApi] = useState<AdminApi | null>(given ?? null)
  const [user, setUser] = useState<DashboardUser | null | undefined>(undefined)
  const [tab, setTab] = useState<'overview' | 'users'>('overview')
  const [overview, setOverview] = useState<Overview | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openUid, setOpenUid] = useState<string | null>(null)

  useEffect(() => { if (!api) loadApi().then(setApi).catch(() => setError('Could not load sign in.')) }, [api])
  useEffect(() => (api ? api.watchUser(setUser) : undefined), [api])
  useEffect(() => {
    if (!api || !user) return
    setError(null)
    api.adminApi<Overview>(user, { op: 'overview' }).then(setOverview).catch((e) => setError(String(e.message)))
    api.adminApi<Store>(user, { op: 'store' }).then(setStore).catch(() => undefined)
  }, [api, user])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Admin</h1>
        {api && user && <Btn tone="outline" onClick={() => api.signOut()}>Sign out</Btn>}
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error === 'Not an admin' ? 'This account is not an admin.' : error}</p>}
      {api && user === null && (
        <div className="mt-6"><Btn onClick={() => api.signIn().catch(() => setError('Sign in failed.'))}>Sign in with Google</Btn></div>
      )}
      {api && user && !error && (
        <>
          <nav className="mt-6 flex gap-2" aria-label="Admin sections">
            {(['overview', 'users'] as const).map((t) => (
              <button key={t} type="button" onClick={() => { setTab(t); setOpenUid(null) }}
                className={cx('rounded-full px-4 py-1.5 text-sm font-semibold', tab === t ? 'bg-ink text-white' : 'text-ink-muted hover:bg-primary-bg')}>
                {t === 'overview' ? 'Overview' : 'Users'}
              </button>
            ))}
          </nav>
          {tab === 'overview' && (overview ? <div className="mt-6"><OverviewTab o={overview} store={store} /></div> : <p className="mt-6 text-ink-muted">Loading…</p>)}
          {tab === 'users' && (openUid
            ? <UserPage api={api} user={user} uid={openUid} onBack={() => setOpenUid(null)} />
            : <UsersTab api={api} user={user} onOpen={setOpenUid} />)}
        </>
      )}
    </div>
  )
}
