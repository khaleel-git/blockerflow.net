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

/** POSTs to a server function with the user's ID token. Throws with the server's message on failure. */
async function callFunction(user: DashboardUser, name: string, body: Record<string, unknown>): Promise<void> {
  const token = await user.getIdToken()
  const res = await fetch(FUNCTIONS_BASE_URL + name, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const msg = await res.json().then((j: { error?: string }) => j.error).catch(() => undefined)
    throw new Error(msg ?? `Request failed (${res.status})`)
  }
}

export const removeDevice = (user: DashboardUser, deviceId: string) => callFunction(user, 'removeDevice', { deviceId })
export const deleteAccount = (user: DashboardUser) => callFunction(user, 'deleteAccount', {})
