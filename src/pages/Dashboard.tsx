import { useCallback, useEffect, useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { GooglePlayBadge } from '../components/GooglePlayBadge'
import { MacBadge } from '../components/MacBadge'
import { WindowsBadge } from '../components/WindowsBadge'
import {
  APPROVAL_TEXT, DELETE_WORD, PLATFORM_NAMES, allDays, approvalFor, dailyTotals, deleteConfirmed, isInactive, maskEmail, seenText, settingGroups,
  sortDevices, summarize, type Device, type StatsSummary,
} from '../lib/dashboard/model'
import type { ActionResult, DashboardUser, PendingRequest } from '../lib/dashboard/firebase'

/**
 * blockerflow.net/dashboard (noindex): sign in with Google, see this account's devices, each
 * one's settings (read only), its block counts per category, remove a device, delete the account.
 * Settings are changed only in the apps, behind their challenge; nothing here can weaken them.
 */

export interface DashboardApi {
  watchUser: (cb: (u: DashboardUser | null) => void) => () => void
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  loadDevices: (uid: string) => Promise<Device[]>
  dashboardAction: (user: DashboardUser, body: Record<string, unknown>) => Promise<ActionResult>
}

type Action = 'removeDevice' | 'deleteAccount'

/** The open approval dialog: which action, and what the server asked for. */
interface Flow {
  action: Action
  device: Device | null
  step: 'confirm' | 'myself' | 'ai' | 'sent'
  text?: string
  message?: string
}

/** How often the page reloads the devices and counts while it is open. */
export const REFRESH_MS = 20_000

const ACTION_NAME: Record<Action, string> = { removeDevice: 'Remove device', deleteAccount: 'Delete account' }

const when = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''

function pendingText(r: PendingRequest, devices: Device[] | null): string {
  const d = devices?.find((x) => x.id === r.deviceId)
  const what = r.action === 'deleteAccount' ? 'Deleting your account' : `Removing ${d ? `${PLATFORM_NAMES[d.platform] ?? 'the device'} ${d.model}` : 'a device'}`
  return r.mode === 'timedelay'
    ? `${what} is waiting for the 24 hour delay. It is carried out when you open this page after ${when(r.executeAfter)}.`
    : `${what} is waiting for your Friend (${r.sentTo ?? 'by email'}) to approve. The request expires ${when(r.expiresAt)}.`
}

const loadApi = (): Promise<DashboardApi> => import('../lib/dashboard/firebase')

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <section className={cx('rounded-2xl border border-outline bg-surface p-5 shadow-sm', className)}>{children}</section>
)

function Btn({ tone = 'solid', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'solid' | 'outline' | 'danger' }) {
  const look = {
    solid: 'bg-primary text-white hover:opacity-90',
    outline: 'border border-outline bg-surface text-ink hover:bg-primary-bg',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[tone]
  return <button type="button" {...p} className={cx('rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40', look, className)} />
}

/** The account's memorable view: one bar per day for the last 30 days, today on the right. */
function BlockStrip({ days }: { days: { date: string; total: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.total))
  const label = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return (
    <figure>
      <div className="flex h-24 items-end gap-[3px]" role="img" aria-label="Blocks per day, last 30 days">
        {days.map((d, i) => (
          <div
            key={d.date}
            title={`${label(d.date)}: ${d.total} block${d.total === 1 ? '' : 's'}`}
            className={cx('flex-1 rounded-t-sm', i === days.length - 1 ? 'bg-primary' : d.total ? 'bg-indigo-300' : 'bg-outline')}
            style={{ height: d.total ? `${Math.max(8, (d.total / max) * 100)}%` : '4px' }}
          />
        ))}
      </div>
      <figcaption className="mt-2 flex justify-between text-xs text-ink-muted">
        <span>{label(days[0].date)}</span>
        <span>Today</span>
      </figcaption>
    </figure>
  )
}

function Numbers({ summary, size = 'lg' }: { summary: StatsSummary; size?: 'lg' | 'sm' }) {
  return (
    <dl className={cx('grid grid-cols-3', size === 'lg' ? 'gap-6' : 'gap-4')}>
      {([['Today', summary.today], ['7 days', summary.last7], ['30 days', summary.last30]] as const).map(([label, n]) => (
        <div key={label}>
          <dt className="text-xs text-ink-muted">{label}</dt>
          <dd className={cx('font-display font-semibold tabular-nums text-ink', size === 'lg' ? 'text-4xl' : 'text-xl')} data-testid={`total-${label}`}>
            {n}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Categories({ summary }: { summary: StatsSummary }) {
  if (summary.byCategory.length === 0) return <p className="text-sm text-ink-muted">Nothing blocked in the last 30 days.</p>
  const max = summary.byCategory[0].count
  return (
    <ul className="space-y-2.5" aria-label="Blocks by category, last 30 days">
      {summary.byCategory.map((c) => (
        <li key={c.category} className="grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-ink">{c.name}</span>
          <span className="h-2 rounded-full bg-primary-bg">
            <span className="block h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, (c.count / max) * 100)}%` }} />
          </span>
          <span className="text-right font-semibold tabular-nums text-ink">{c.count}</span>
        </li>
      ))}
    </ul>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  const path =
    platform === 'android'
      ? <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>
      : platform === 'mac'
        ? <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19.5h20" /></>
        : <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></>
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {path}
      </svg>
    </span>
  )
}

function DeviceCard({ device, now, onRemove }: { device: Device; now: Date; onRemove: (d: Device) => void }) {
  const inactive = isInactive(device.lastSeen, now)
  const groups = settingGroups(device.settings, device.platform)
  const summary = summarize(device.stats, now)
  const name = `${PLATFORM_NAMES[device.platform] ?? 'Device'}${device.model ? `: ${device.model}` : ''}`
  return (
    <article aria-label={name} className="rounded-2xl border border-outline bg-surface p-5">
      <div className="flex items-start gap-4">
        <PlatformIcon platform={device.platform} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-ink">
              {PLATFORM_NAMES[device.platform] ?? 'Device'}
              {device.model && <span className="font-normal text-ink-muted"> {device.model}</span>}
            </h3>
            {inactive
              ? <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-ink-muted">Inactive</span>
              : <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>}
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">
            {[device.osVersion, device.appVersion && `app ${device.appVersion}`, `last seen ${seenText(device.lastSeen, now)}`].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <Numbers summary={summary} size="sm" />
        <Categories summary={summary} />
      </div>

      <details className="group mt-5 rounded-xl bg-bg px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span className="inline-block transition-transform group-open:rotate-90" aria-hidden="true">›</span> Settings (read only)
        </summary>
        {groups.length === 0 && <p className="mt-2 text-sm text-ink-muted">No settings backed up yet.</p>}
        <div className="grid gap-x-8 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="mt-3">
              <h4 className="text-sm font-semibold text-ink-muted">{g.title}</h4>
              <dl className="mt-1 divide-y divide-outline">
                {g.rows.map((r) => (
                  <div key={g.title + r.label} className="py-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink">{r.label}</dt>
                      <dd className={cx('text-right font-medium', r.value === 'On' ? 'text-green-700' : 'text-ink')}>{r.value}</dd>
                    </div>
                    {r.items && r.items.length > 0 && (
                      <ul className="mt-1 flex flex-wrap gap-1">
                        {r.items.map((i) => (
                          <li key={i} className="rounded-md bg-surface px-1.5 py-0.5 text-xs text-ink-muted">{i}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">To change a setting, open Blockerflow on this device.</p>
      </details>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline pt-4">
        <span className="text-xs text-ink-muted">{APPROVAL_TEXT[approvalFor(device, now)]}</span>
        <Btn tone="outline" onClick={() => onRemove(device)}>Remove device</Btn>
      </div>
    </article>
  )
}

export function Dashboard({ api: given, now: nowProp }: { api?: DashboardApi; now?: Date }) {
  usePageMeta('/dashboard')
  const [api, setApi] = useState<DashboardApi | null>(given ?? null)
  const [user, setUser] = useState<DashboardUser | null | undefined>(undefined)
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flow, setFlow] = useState<Flow | null>(null)
  const [answer, setAnswer] = useState('')
  const [pending, setPending] = useState<PendingRequest | null>(null)
  const [busy, setBusy] = useState(false)
  const [typed, setTyped] = useState('')
  const [deleted, setDeleted] = useState(false)
  const now = useMemo(() => nowProp ?? new Date(), [nowProp])

  useEffect(() => {
    if (api) return
    let live = true
    loadApi().then((a) => live && setApi(a)).catch(() => live && setError('Could not load sign in. Check your connection and reload.'))
    return () => { live = false }
  }, [api])

  useEffect(() => (api ? api.watchUser(setUser) : undefined), [api])

  const refresh = useCallback(async () => {
    if (!api || !user) return
    try {
      setDevices(sortDevices(await api.loadDevices(user.uid)))
    } catch {
      setError('Could not load your devices. Check your connection and reload.')
    }
  }, [api, user])

  useEffect(() => {
    setDevices(null)
    if (user) void refresh()
  }, [user, refresh])

  // Live: new blocks reach the server within seconds, so reload while the page is in view.
  useEffect(() => {
    if (!user) return
    const tick = () => { if (document.visibilityState === 'visible') void refresh() }
    const id = window.setInterval(tick, REFRESH_MS)
    document.addEventListener('visibilitychange', tick)
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', tick) }
  }, [user, refresh])

  /** What the server answered, applied to the page. */
  const applyResult = useCallback(async (r: ActionResult, f: Flow | null) => {
    if (r.deleted) {
      setFlow(null)
      setDeleted(true)
      await api?.signOut().catch(() => undefined)
      return
    }
    if (r.done) {
      setFlow(null)
      setPending(null)
      await refresh()
      return
    }
    if (r.request !== undefined) setPending(r.request ?? null)
    if (r.ended) setError(r.ended === 'denied' ? 'Your Friend denied the request. Nothing was changed.' : 'The request expired. Nothing was changed.')
    if (!f) return
    if (r.needs === 'myself') setFlow({ ...f, step: 'myself', text: r.text })
    else if (r.needs === 'ai') setFlow({ ...f, step: 'ai' })
    else if (r.needs === 'friend' || r.needs === 'timedelay') {
      setFlow({
        ...f,
        step: 'sent',
        message: r.needs === 'friend'
          ? `We emailed your Friend (${r.request?.sentTo ?? ''}). Once they approve, it is carried out.`
          : `This can be carried out after ${when(r.request?.executeAfter ?? null)}. Open this page again then.`,
      })
    } else if (r.rejected) setFlow({ ...f, message: r.reason ?? 'The AI Coach did not approve this.' })
  }, [api, refresh])

  useEffect(() => {
    if (!api || !user) return
    api.dashboardAction(user, { op: 'status' }).then((r) => applyResult(r, null)).catch(() => undefined)
  }, [api, user, applyResult])

  const startFlow = (action: Action, device: Device | null) => {
    setAnswer('')
    setFlow({ action, device, step: 'confirm' })
  }

  const run = async (what: () => Promise<void>, fail: string) => {
    setBusy(true)
    setError(null)
    try {
      await what()
      return true
    } catch (e) {
      setError(`${fail} ${e instanceof Error ? e.message : ''}`.trim())
      return false
    } finally {
      setBusy(false)
    }
  }

  const accountTotals = devices ? summarize(allDays(devices), now) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {!(api && user) && <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Dashboard</h1>}

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {deleted && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-ink">Your account is deleted</h2>
          <p className="mt-2 text-ink-muted">
            Your devices, their settings backup and block counts are gone. Blockerflow keeps protecting each device with
            the settings it has; to remove it, uninstall the app on that device.
          </p>
        </Card>
      )}

      {!deleted && (user === undefined || !api) && !error && <p className="mt-6 text-ink-muted">Loading…</p>}

      {!deleted && api && user === null && (
        <Card className="mt-8 max-w-xl p-8">
          <h2 className="text-xl font-semibold text-ink">Sign in to see your devices</h2>
          <p className="mt-2 text-ink-muted">
            Use the Google account you signed in with in the Blockerflow app. You can see each device's settings and
            block counts, remove a device or delete your account. Settings can only be changed in the app.
          </p>
          <Btn className="mt-6 inline-flex items-center gap-2 px-5 py-2.5" disabled={busy} onClick={() => run(api.signIn, 'Sign in failed.')}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            Sign in with Google
          </Btn>
        </Card>
      )}

      {!deleted && api && user && (
        <>
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
                {user.displayName ? `Hi ${user.displayName.split(' ')[0]}` : 'Your dashboard'}
              </h1>
              <p className="mt-1 text-ink-muted">Signed in as {maskEmail(user.email ?? '')}</p>
            </div>
            <Btn tone="outline" onClick={() => run(api.signOut, 'Sign out failed.')}>Sign out</Btn>
          </header>

          {pending && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              <p className="flex-1">{pendingText(pending, devices)}</p>
              <Btn tone="outline" disabled={busy} onClick={() => run(async () => applyResult(await api.dashboardAction(user, { op: 'cancel' }), null), 'Could not cancel.')}>
                Cancel request
              </Btn>
            </div>
          )}

          {devices === null && !error && <p className="mt-6 text-ink-muted">Loading your devices…</p>}

          {accountTotals && devices && devices.length > 0 && (
            <section aria-labelledby="blocks-heading" className="mt-8 rounded-3xl bg-surface p-6 shadow-[0_1px_0_var(--color-outline),0_12px_32px_-16px_rgb(79_70_229/0.25)] sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="blocks-heading" className="text-lg font-semibold text-ink">Blocks on all your devices</h2>
                <p className="text-xs text-ink-muted">Updates live. Counts only, never what was blocked. Kept 30 days.</p>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
                <Numbers summary={accountTotals} />
                <BlockStrip days={dailyTotals(allDays(devices), now)} />
              </div>
              <div className="mt-8 border-t border-outline pt-6">
                <Categories summary={accountTotals} />
              </div>
            </section>
          )}

          {devices && (
            <section className="mt-8" aria-labelledby="devices-heading">
              <h2 id="devices-heading" className="text-lg font-semibold text-ink">
                Your devices <span className="font-normal text-ink-muted">{devices.length}</span>
              </h2>
              {devices.length === 0 && (
                <p className="mt-2 text-ink-muted">
                  No devices yet. Sign in to the Blockerflow app with this Google account and it shows up here.
                </p>
              )}
              <div className="mt-3 space-y-4">
                {devices.map((d) => <DeviceCard key={d.id} device={d} now={now} onRemove={(dev) => startFlow('removeDevice', dev)} />)}
              </div>
            </section>
          )}

          <section aria-labelledby="add-heading" className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-outline px-5 py-4">
            <div>
              <h2 id="add-heading" className="font-semibold text-ink">Add a device</h2>
              <p className="text-sm text-ink-muted">Install Blockerflow there and sign in with this Google account.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <GooglePlayBadge variant="compact" />
              <MacBadge variant="compact" />
              <WindowsBadge variant="compact" />
            </div>
          </section>

          <section aria-labelledby="delete-heading" className="mt-16 border-t border-outline pt-8">
            <h2 id="delete-heading" className="font-semibold text-red-700">Delete account</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              Deletes your account, every device's settings backup and all block counts. Protection on your devices keeps
              running with the settings they have. This cannot be undone. It needs the approval of the strictest
              accountability partner among your devices seen in the last 30 days.
            </p>
            <div className="mt-4 flex max-w-md flex-wrap items-end gap-3">
            <div className="flex-1">
            <label className="block text-sm text-ink" htmlFor="delete-word">
              Type {DELETE_WORD} to confirm
            </label>
            <input
              id="delete-word"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2 text-sm"
            />
            </div>
            <Btn
              tone="danger"
              disabled={busy || !deleteConfirmed(typed)}
              onClick={() => startFlow('deleteAccount', null)}
            >
              Delete my account
            </Btn>
            </div>
          </section>

          {flow && (
            <div role="dialog" aria-modal="true" aria-labelledby="flow-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-lg">
                <h2 id="flow-title" className="text-lg font-semibold text-ink">
                  {flow.action === 'deleteAccount' ? 'Delete your account?' : 'Remove this device?'}
                </h2>
                {flow.step === 'confirm' && (
                  <p className="mt-2 text-sm text-ink-muted">
                    {flow.action === 'deleteAccount'
                      ? 'Everything in your account is deleted and every device is signed out. Protection keeps running with the settings each device has.'
                      : `${PLATFORM_NAMES[flow.device?.platform ?? ''] ?? 'The device'} ${flow.device?.model ?? ''} is signed out of your account and its settings backup and block counts are deleted. Protection on it keeps running with the settings it has. Signing in on it again adds it back.`}{' '}
                    Your accountability partner has to agree first.
                  </p>
                )}
                {flow.step === 'myself' && (
                  <>
                    <p className="mt-2 text-sm text-ink-muted">Type this text exactly:</p>
                    <p className="mt-2 select-none rounded-lg bg-black/5 p-2 text-sm text-ink" data-testid="challenge-text">{flow.text}</p>
                    <label htmlFor="flow-answer" className="sr-only">Your typing</label>
                    <textarea
                      id="flow-answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-outline bg-surface px-3 py-2 text-sm"
                    />
                  </>
                )}
                {flow.step === 'ai' && (
                  <>
                    <p className="mt-2 text-sm text-ink-muted">Tell the AI Coach why you want to do this.</p>
                    <label htmlFor="flow-answer" className="sr-only">Your reason</label>
                    <textarea
                      id="flow-answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-outline bg-surface px-3 py-2 text-sm"
                    />
                  </>
                )}
                {flow.message && <p className="mt-3 rounded-lg bg-primary-bg p-2 text-sm text-ink" role="status">{flow.message}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <Btn tone="outline" disabled={busy} onClick={() => setFlow(null)}>{flow.step === 'sent' ? 'Close' : 'Cancel'}</Btn>
                  {flow.step !== 'sent' && (
                    <Btn
                      tone="danger"
                      disabled={busy || ((flow.step === 'myself' || flow.step === 'ai') && !answer.trim())}
                      onClick={() => {
                        const f = flow
                        const base = { action: f.action, deviceId: f.device?.id }
                        const body = f.step === 'confirm'
                          ? { ...base, op: 'start' }
                          : f.step === 'myself' ? { ...base, op: 'confirm', typed: answer } : { ...base, op: 'confirm', excuse: answer }
                        void run(async () => applyResult(await api.dashboardAction(user, body), f), `Could not ${ACTION_NAME[f.action].toLowerCase()}.`)
                      }}
                    >
                      {flow.step === 'confirm' ? 'Continue' : 'Submit'}
                    </Btn>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
