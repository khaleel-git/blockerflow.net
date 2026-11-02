import { useCallback, useEffect, useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { GooglePlayBadge } from '../components/GooglePlayBadge'
import { MacBadge } from '../components/MacBadge'
import { WindowsBadge } from '../components/WindowsBadge'
import {
  DELETE_WORD, PLATFORM_NAMES, allDays, deleteConfirmed, isInactive, maskEmail, seenText, settingGroups, sortDevices, summarize,
  type Device, type StatsSummary,
} from '../lib/dashboard/model'
import type { DashboardUser } from '../lib/dashboard/firebase'

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
  removeDevice: (user: DashboardUser, deviceId: string) => Promise<void>
  deleteAccount: (user: DashboardUser) => Promise<void>
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

function Totals({ summary, title }: { summary: StatsSummary; title: string }) {
  const max = summary.byCategory[0]?.count ?? 0
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-muted">{title}</h3>
      <dl className="mt-2 grid grid-cols-3 gap-3 text-center">
        {([['Today', summary.today], ['7 days', summary.last7], ['30 days', summary.last30]] as const).map(([label, n]) => (
          <div key={label} className="rounded-xl bg-primary-bg px-2 py-3">
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className="text-2xl font-bold text-ink" data-testid={`total-${label}`}>{n}</dd>
          </div>
        ))}
      </dl>
      {summary.byCategory.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label="Blocks by category, last 30 days">
          {summary.byCategory.map((c) => (
            <li key={c.category} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-ink">{c.name}</span>
                <span className="font-semibold text-ink">{c.count}</span>
              </div>
              <div className="mt-0.5 h-1.5 rounded-full bg-black/5">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.max(4, (c.count / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DeviceCard({ device, now, onRemove }: { device: Device; now: Date; onRemove: (d: Device) => void }) {
  const inactive = isInactive(device.lastSeen, now)
  const groups = settingGroups(device.settings, device.platform)
  const summary = summarize(device.stats, now)
  const name = `${PLATFORM_NAMES[device.platform] ?? 'Device'}${device.model ? `: ${device.model}` : ''}`
  return (
    <Card>
      <article aria-label={name}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-ink">{name}</h3>
            <p className="text-sm text-ink-muted">
              {[device.osVersion, device.appVersion && `app ${device.appVersion}`].filter(Boolean).join(', ')}
            </p>
            <p className="text-sm text-ink-muted">Last seen {seenText(device.lastSeen, now)}</p>
          </div>
          {inactive && <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-ink-muted">Inactive</span>}
        </div>

        <div className="mt-4">
          <Totals summary={summary} title="Blocks on this device" />
        </div>

        <details className="mt-4 rounded-xl border border-outline p-3">
          <summary className="cursor-pointer text-sm font-semibold text-ink">Settings (read only)</summary>
          {groups.length === 0 && <p className="mt-2 text-sm text-ink-muted">No settings backed up yet.</p>}
          {groups.map((g) => (
            <div key={g.title} className="mt-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{g.title}</h4>
              <dl className="mt-1 divide-y divide-outline">
                {g.rows.map((r) => (
                  <div key={g.title + r.label} className="py-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink">{r.label}</dt>
                      <dd className="text-right font-medium text-ink">{r.value}</dd>
                    </div>
                    {r.items && r.items.length > 0 && (
                      <ul className="mt-1 flex flex-wrap gap-1">
                        {r.items.map((i) => (
                          <li key={i} className="rounded-md bg-black/5 px-1.5 py-0.5 text-xs text-ink-muted">{i}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <p className="mt-3 text-xs text-ink-muted">To change a setting, open Blockerflow on this device.</p>
        </details>

        <div className="mt-4">
          <Btn tone="outline" onClick={() => onRemove(device)}>Remove device</Btn>
        </div>
      </article>
    </Card>
  )
}

export function Dashboard({ api: given, now: nowProp }: { api?: DashboardApi; now?: Date }) {
  usePageMeta('/dashboard')
  const [api, setApi] = useState<DashboardApi | null>(given ?? null)
  const [user, setUser] = useState<DashboardUser | null | undefined>(undefined)
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<Device | null>(null)
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Dashboard</h1>

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
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-ink">Sign in to see your devices</h2>
          <p className="mt-2 text-ink-muted">
            Use the Google account you signed in with in the Blockerflow app. You can see each device's settings and
            block counts, remove a device or delete your account. Settings can only be changed in the app.
          </p>
          <Btn className="mt-4" disabled={busy} onClick={() => run(api.signIn, 'Sign in failed.')}>Sign in with Google</Btn>
        </Card>
      )}

      {!deleted && api && user && (
        <>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-ink-muted">Signed in as {maskEmail(user.email ?? '')}</p>
            <Btn tone="outline" onClick={() => run(api.signOut, 'Sign out failed.')}>Sign out</Btn>
          </div>

          {devices === null && !error && <p className="mt-6 text-ink-muted">Loading your devices…</p>}

          {accountTotals && devices && devices.length > 0 && (
            <Card className="mt-6">
              <Totals summary={accountTotals} title="Blocks on all your devices" />
              <p className="mt-3 text-xs text-ink-muted">
                Only a count per category and day, never what was blocked. Each day is deleted after 30 days.
              </p>
            </Card>
          )}

          {devices && (
            <section className="mt-8" aria-labelledby="devices-heading">
              <h2 id="devices-heading" className="text-xl font-semibold text-ink">Your devices</h2>
              {devices.length === 0 && (
                <p className="mt-2 text-ink-muted">
                  No devices yet. Sign in to the Blockerflow app with this Google account and it shows up here.
                </p>
              )}
              <div className="mt-3 space-y-4">
                {devices.map((d) => <DeviceCard key={d.id} device={d} now={now} onRemove={setRemoving} />)}
              </div>
            </section>
          )}

          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-ink">Add a device</h2>
            <p className="mt-1 text-sm text-ink-muted">Install Blockerflow and sign in with this Google account.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <GooglePlayBadge />
              <MacBadge />
              <WindowsBadge />
            </div>
          </Card>

          <Card className="mt-8 border-red-200">
            <h2 className="text-xl font-semibold text-red-700">Delete account</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Deletes your account, every device's settings backup and all block counts. Protection on your devices keeps
              running with the settings they have. This cannot be undone.
            </p>
            <label className="mt-3 block text-sm text-ink" htmlFor="delete-word">
              Type {DELETE_WORD} to confirm
            </label>
            <input
              id="delete-word"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-outline bg-surface px-3 py-2 text-sm"
            />
            <Btn
              tone="danger"
              className="mt-3"
              disabled={busy || !deleteConfirmed(typed)}
              onClick={async () => {
                if (await run(() => api.deleteAccount(user), 'Could not delete your account.')) {
                  setDeleted(true)
                  await api.signOut().catch(() => undefined)
                }
              }}
            >
              Delete my account
            </Btn>
          </Card>

          {removing && (
            <div role="dialog" aria-modal="true" aria-labelledby="remove-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-lg">
                <h2 id="remove-title" className="text-lg font-semibold text-ink">Remove this device?</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {PLATFORM_NAMES[removing.platform] ?? 'The device'} {removing.model} is signed out of your account and its
                  settings backup and block counts are deleted. Protection on it keeps running with the settings it has.
                  Signing in on it again adds it back.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Btn tone="outline" disabled={busy} onClick={() => setRemoving(null)}>Cancel</Btn>
                  <Btn
                    tone="danger"
                    disabled={busy}
                    onClick={async () => {
                      const d = removing
                      if (await run(() => api.removeDevice(user, d.id), 'Could not remove the device.')) {
                        setRemoving(null)
                        setDevices((list) => list?.filter((x) => x.id !== d.id) ?? null)
                      }
                    }}
                  >
                    Remove
                  </Btn>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
