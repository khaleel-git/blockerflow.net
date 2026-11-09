/**
 * The dashboard's pure logic (design: blockerflow repo,
 * docs/superpowers/specs/2026-11-02-per-device-sync-and-dashboard-design.md). Everything here is
 * read only: the dashboard never writes settings. Removing a device and deleting the account go
 * through the server (removeDevice, deleteAccount).
 */

export type Platform = 'android' | 'mac' | 'windows'

export interface StatsDay {
  date: string // yyyy-MM-dd
  total: number
  counts: Record<string, number>
}

export interface Device {
  id: string
  platform: Platform | string
  model: string
  osVersion: string
  appVersion: string
  firstSeen: Date | null
  lastSeen: Date | null
  settings: Record<string, unknown>
  stats: StatsDay[]
  /** How many installs (records) this device had; set by mergeInstalls. */
  installs?: number
}

export const PLATFORM_NAMES: Record<string, string> = { android: 'Android', mac: 'Mac', windows: 'Windows' }

export const INACTIVE_AFTER_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

/** Most recently seen first; never seen last. */
export function sortDevices(devices: Device[]): Device[] {
  return [...devices].sort((a, b) => (b.lastSeen?.getTime() ?? 0) - (a.lastSeen?.getTime() ?? 0))
}

/**
 * One device per platform and model: each reinstall (or data clear) makes a new record. The newest
 * record is the device (its id, version, settings, last seen); first seen is the earliest; every
 * install's days are kept, so the counts add up. A record without a model is never merged.
 * Same rule as the admin page and Remove device (backend lib/admin.js mergeInstalls).
 */
export function mergeInstalls(devices: Device[]): Device[] {
  const groups = new Map<string, Device[]>()
  for (const d of devices) {
    const model = d.model.trim().toLowerCase()
    const key = model ? `${d.platform}|${model}` : `id|${d.id}`
    groups.set(key, [...(groups.get(key) ?? []), d])
  }
  const seen = (d: Device) => (d.lastSeen ?? d.firstSeen)?.getTime() ?? 0
  return [...groups.values()].map((group) => {
    const newest = [...group].sort((x, y) => seen(y) - seen(x))[0]
    const firsts = group.map((d) => d.firstSeen).filter((d): d is Date => d !== null)
    return {
      ...newest,
      firstSeen: firsts.length ? new Date(Math.min(...firsts.map((d) => d.getTime()))) : newest.firstSeen,
      stats: group.flatMap((d) => d.stats),
      installs: group.length,
    }
  })
}

export function isInactive(lastSeen: Date | null, now: Date): boolean {
  return !lastSeen || now.getTime() - lastSeen.getTime() > INACTIVE_AFTER_DAYS * DAY_MS
}

/** "khaleel.eu@gmail.com" -> "k•••@gmail.com". */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 1) return email ? '•••' : ''
  return `${email[0]}•••${email.slice(at)}`
}

/** "today", "yesterday", "3 days ago", or the date. */
export function seenText(d: Date | null, now: Date): string {
  if (!d) return 'never'
  const days = Math.floor((startOfDay(now).getTime() - startOfDay(d).getTime()) / DAY_MS)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const CATEGORY_NAMES: Record<string, string> = {
  adult: 'Adult content',
  piracy: 'Piracy sites',
  image_search: 'Image and video search',
  blocklist_app: 'Blocked apps',
  blocklist_site: 'Blocked sites',
  focus_mode: 'Focus Mode',
  new_app: 'New apps',
  reels_instagram: 'Instagram Reels',
  reels_facebook: 'Facebook Reels',
  shorts_youtube: 'YouTube Shorts',
  videos_snapchat: 'Snapchat videos',
  videos_x: 'X videos',
  search_instagram: 'Instagram search',
  search_snapchat: 'Snapchat search',
  whatsapp_channels: 'WhatsApp channels',
  telegram_channels: 'Telegram channels',
  settings_protection: 'Settings protection',
  unsupported_browser: 'Unsupported browsers',
  other: 'Other',
}

export interface StatsSummary {
  today: number
  last7: number
  last30: number
  /** Last 30 days per category, largest first. */
  byCategory: { category: string; name: string; count: number }[]
}

/** Sums of the days in the window that ends today (today counts as day 1). */
export function summarize(days: StatsDay[], now: Date): StatsSummary {
  const today = isoDay(now)
  const from7 = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6))
  const from30 = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29))
  let t = 0, s7 = 0, s30 = 0
  const cats: Record<string, number> = {}
  for (const d of days) {
    if (d.date > today || d.date < from30) continue
    s30 += d.total
    if (d.date >= from7) s7 += d.total
    if (d.date === today) t += d.total
    for (const [k, v] of Object.entries(d.counts)) cats[k] = (cats[k] ?? 0) + v
  }
  const byCategory = Object.entries(cats)
    .filter(([, v]) => v > 0)
    .map(([category, count]) => ({ category, name: CATEGORY_NAMES[category] ?? CATEGORY_NAMES.other, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  return { today: t, last7: s7, last30: s30, byCategory }
}

/** Every device's days together, for the account total. */
export function allDays(devices: Device[]): StatsDay[] {
  return devices.flatMap((d) => d.stats)
}

// ---- read only settings ----

export interface SettingRow {
  label: string
  value: string
  /** The entries of a list setting, shown folded. */
  items?: string[]
}

export interface SettingGroup {
  title: string
  rows: SettingRow[]
}

const PARTNER_NAMES: Record<string, string> = {
  myself: 'Myself (typing challenge)',
  friend: 'Friend',
  timedelay: 'Time Delay (24 hours)',
  ai: 'AI coach',
  ai_pro: 'AI coach',
}

const SWITCHES: [string, string][] = [
  ['block_adult_content', 'Block adult content'],
  ['block_image_video_search', 'Block image and video search'],
  ['block_known_piracy_sites', 'Block piracy sites'],
  ['block_insta_reels', 'Block Instagram Reels'],
  ['block_insta_search', 'Block Instagram search'],
  ['block_fb_reels', 'Block Facebook Reels'],
  ['block_youtube_shorts', 'Block YouTube Shorts'],
  ['block_snap_videos', 'Block Snapchat videos'],
  ['block_snap_search', 'Block Snapchat search'],
  ['block_x_videos', 'Block X videos'],
  ['block_whatsapp_channels', 'Block WhatsApp channels'],
  ['block_telegram_channels', 'Block Telegram channels'],
  ['block_unsupported_browsers', 'Block unsupported browsers'],
  ['block_newly_installed_apps', 'Block newly installed apps'],
  ['uninstall_protection', 'Uninstall protection'],
  ['protect_focus_mode', 'Protect Focus Mode'],
]

const LISTS: [string, string, string][] = [
  ['blocklist', 'Blocked sites', 'site'],
  ['whitelist', 'Always allowed sites', 'site'],
  ['blocked_apps', 'Blocked apps', 'app'],
  ['blocked_apps_mac', 'Blocked apps', 'app'],
  ['blocked_apps_windows', 'Blocked apps', 'app'],
  ['focus_mode_extra_blocklist', 'Focus Mode also blocks', 'site'],
  ['focus_mode_allowlist', 'Focus Mode allows', 'site'],
]

function strings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').sort((a, b) => a.localeCompare(b)) : []
}

/**
 * A device's settings as text, grouped. Only keys this platform uses are shown (its own blocked
 * apps list), unknown keys are left out, and the Friend email is masked.
 */
export function settingGroups(settings: Record<string, unknown>, platform: string): SettingGroup[] {
  const groups: SettingGroup[] = []

  const mode = typeof settings.partner_mode_string === 'string' ? settings.partner_mode_string.toLowerCase() : ''
  const partner: SettingRow[] = []
  if (mode) partner.push({ label: 'Accountability', value: PARTNER_NAMES[mode] ?? mode })
  if ((mode === 'friend') && typeof settings.partner_email === 'string' && settings.partner_email) {
    partner.push({ label: 'Friend', value: maskEmail(settings.partner_email) })
  }
  if (partner.length) groups.push({ title: 'Accountability', rows: partner })

  const switches = SWITCHES.filter(([k]) => typeof settings[k] === 'boolean').map(([k, label]) => ({
    label,
    value: settings[k] ? 'On' : 'Off',
  }))
  if (switches.length) groups.push({ title: 'Blocking', rows: switches })

  const ownApps = platform === 'mac' ? 'blocked_apps_mac' : platform === 'windows' ? 'blocked_apps_windows' : 'blocked_apps'
  const lists = LISTS.filter(([k]) => k in settings && (!k.startsWith('blocked_apps') || k === ownApps)).map(([k, label, noun]) => {
    const items = strings(settings[k])
    return { label, value: items.length === 0 ? 'None' : `${items.length} ${noun}${items.length === 1 ? '' : 's'}`, items }
  })
  if (lists.length) groups.push({ title: 'Lists', rows: lists })

  const screen: SettingRow[] = []
  if (typeof settings.blocked_message === 'string') screen.push({ label: 'Block screen message', value: settings.blocked_message || 'None' })
  if (typeof settings.blocked_countdown === 'number') screen.push({ label: 'Close button delay', value: `${settings.blocked_countdown} s` })
  if (typeof settings.redirect_url === 'string' && settings.redirect_url) screen.push({ label: 'Redirect to', value: settings.redirect_url })
  if (screen.length) groups.push({ title: 'Block screen', rows: screen })

  return groups
}

// ---- delete account ----

export const DELETE_WORD = 'DELETE'

export function deleteConfirmed(typed: string): boolean {
  return typed.trim() === DELETE_WORD
}

// ---- partner approval for Remove device and Delete account ----

export type ApprovalMode = 'none' | 'myself' | 'ai' | 'timedelay' | 'friend'

export const APPROVAL_TEXT: Record<ApprovalMode, string> = {
  none: 'No approval needed (not seen for 30 days)',
  myself: 'Needs your typing challenge',
  ai: 'Needs the AI Coach',
  timedelay: 'Needs a 24 hour wait',
  friend: "Needs your Friend's approval",
}

/** What removing this device needs, as the server decides it (for display only). */
export function approvalFor(device: Device, now: Date): ApprovalMode {
  if (isInactive(device.lastSeen, now)) return 'none'
  const s = device.settings
  const mode = typeof s.partner_mode_string === 'string' ? s.partner_mode_string.toLowerCase() : ''
  if (mode === 'friend') return typeof s.partner_email === 'string' && s.partner_email.includes('@') ? 'friend' : 'timedelay'
  if (mode === 'timedelay') return 'timedelay'
  if (mode === 'ai' || mode === 'ai_pro') return 'ai'
  return 'myself'
}

/** One total per day for the last `n` days, oldest first, today last (missing days are 0). */
export function dailyTotals(days: StatsDay[], now: Date, n = 30): { date: string; total: number }[] {
  const byDate = new Map<string, number>()
  for (const d of days) byDate.set(d.date, (byDate.get(d.date) ?? 0) + d.total)
  const out: { date: string; total: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const date = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))
    out.push({ date, total: byDate.get(date) ?? 0 })
  }
  return out
}
