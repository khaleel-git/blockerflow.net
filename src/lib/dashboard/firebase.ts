import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth'
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite'
import type { Device, StatsDay } from './model'

/**
 * Firebase for the dashboard: Google sign in, reads of the signed in user's own devices and
 * stats (the Firestore rules allow only the owner), and the two server functions. This file has
 * no Firestore write call on purpose: the dashboard is read only (see Dashboard.test.tsx).
 * Loaded only by the dashboard page, so no other page carries the SDK.
 */

const env = import.meta.env
export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCDiVXRHZ2LaLPLmx7xAykb8WNJ684p6VI',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? 'blockerflow-34d42.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? 'blockerflow-34d42',
}
export const FUNCTIONS_BASE_URL = env.VITE_FUNCTIONS_BASE_URL ?? 'https://us-central1-blockerflow-34d42.cloudfunctions.net/'

function app(): FirebaseApp {
  return getApps()[0] ?? initializeApp(FIREBASE_CONFIG)
}

export type DashboardUser = Pick<User, 'uid' | 'email' | 'displayName'> & { getIdToken: () => Promise<string> }

export function watchUser(cb: (u: DashboardUser | null) => void): () => void {
  return onAuthStateChanged(getAuth(app()), cb)
}

export async function signIn(): Promise<void> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  await signInWithPopup(getAuth(app()), provider)
}

export async function signOut(): Promise<void> {
  await fbSignOut(getAuth(app()))
}

type Ts = { toDate?: () => Date } | null | undefined
const date = (v: unknown): Date | null => ((v as Ts)?.toDate ? (v as { toDate: () => Date }).toDate() : null)
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

export async function loadDevices(uid: string): Promise<Device[]> {
  const db = getFirestore(app())
  const snap = await getDocs(collection(db, 'users', uid, 'devices'))
  return Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data()
      const statsSnap = await getDocs(collection(db, 'users', uid, 'devices', d.id, 'stats'))
      const stats: StatsDay[] = statsSnap.docs.map((s) => {
        const v = s.data()
        const counts: Record<string, number> = {}
        for (const [k, n] of Object.entries((v.counts ?? {}) as Record<string, unknown>)) if (typeof n === 'number') counts[k] = n
        return { date: s.id, total: typeof v.total === 'number' ? v.total : 0, counts }
      })
      return {
        id: d.id,
        platform: str(data.platform),
        model: str(data.model),
        osVersion: str(data.osVersion),
        appVersion: str(data.appVersion),
        firstSeen: date(data.firstSeen),
        lastSeen: date(data.lastSeen),
        settings: (data.settings ?? {}) as Record<string, unknown>,
        stats,
      }
    }),
  )
}

export interface PendingRequest {
  action: 'removeDevice' | 'deleteAccount'
  deviceId: string | null
  mode: 'timedelay' | 'friend'
  status: string
  executeAfter: number | null
  expiresAt: number | null
  sentTo: string | null
}

/** The answer of dashboardAction (see backend/functions/index.js). */
export interface ActionResult {
  done?: boolean
  removed?: boolean
  deleted?: boolean
  needs?: 'myself' | 'ai' | 'timedelay' | 'friend'
  text?: string
  rejected?: boolean
  reason?: string | null
  request?: PendingRequest | null
  ended?: 'expired' | 'denied'
}

/**
 * Remove device and Delete account, behind the accountability partner: the server decides what
 * approval is needed and carries the action out. Throws with the server's message on failure.
 */
export async function dashboardAction(user: DashboardUser, body: Record<string, unknown>): Promise<ActionResult> {
  const token = await user.getIdToken()
  const res = await fetch(FUNCTIONS_BASE_URL + 'dashboardAction', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await res.json().catch(() => ({}))) as ActionResult & { error?: string }
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`)
  return json
}
