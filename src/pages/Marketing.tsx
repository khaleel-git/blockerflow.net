import { useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  NeedsGoogleAccess, appendRows, connectGoogle, downloadBlob, downloadText, googleAccessToken, hasGoogleAccess, isFolder,
  listChildren, loadGoogleSignIn, readSheet, trashIfAllowed, writeCells,
} from '../lib/marketing/googleWorkspace'
import { cancelPostJob, detectPoster, onPostStatus, sendPostJob, type PostStatus } from '../lib/marketing/posterBridge'
import { dueShorts, postShort } from '../lib/marketing/autoPost'
import {
  LONGFORM_FOLDER_ID, NOT_FOR_PLATFORM, OWNER_EMAILS, PLATFORMS, PLATFORM_NAMES, SHEET_ID, SHORTS_FOLDER_ID, STATUS, UPLOAD_URLS,
  cell, copyFields, isFullyPosted, isInDrive, newRow, parseMeta, parseRows, today, videoFileName,
  type Platform, type Review, type ShortMeta, type ShortRow,
} from '../lib/marketing/shortsAdmin'

/**
 * Private page (noindex): the Blockerflow shorts waiting in Google Drive, read from the
 * Blockerflow Shorts Database sheet. Approve them here; the Blockerflow Poster extension posts
 * them, by hand from this page or every hour through /marketing?autopost=1 (see
 * blockerflow/marketing/blockerflow-poster/scheduler). Only works for the owner's Google account.
 */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

function Btn({ variant = 'solid', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' | 'ghost' }) {
  const look = {
    solid: 'bg-primary text-white hover:opacity-90',
    outline: 'border border-outline bg-surface text-ink hover:bg-primary-bg',
    ghost: 'text-ink-muted hover:bg-black/5',
  }[variant]
  return <button type="button" {...p} className={cx('inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold disabled:opacity-40', look, className)} />
}
const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx('rounded-2xl border border-outline bg-surface shadow-sm', className)}>{children}</div>
)
const Badge = ({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'danger' | 'brand'; children: ReactNode }) => (
  <span
    className={cx(
      'rounded-full px-2 py-0.5 text-xs font-semibold',
      tone === 'success' && 'bg-green-50 text-green-700',
      tone === 'danger' && 'bg-red-50 text-red-700',
      tone === 'brand' && 'bg-primary-bg text-primary',
      tone === 'neutral' && 'bg-black/5 text-ink-muted',
    )}
  >
    {children}
  </span>
)

/** Adds videos that are in Drive (Shorts/<theme>/<id>/ or Long-form/<theme>/<id>/) but not in the sheet yet. */
async function addNewShortsFromDrive(known: Set<string>): Promise<number> {
  const rows: string[][] = []
  for (const [root, youtubeOnly] of [[SHORTS_FOLDER_ID, false], [LONGFORM_FOLDER_ID, true]] as const) {
    for (const theme of (await listChildren(root)).filter(isFolder)) {
      for (const folder of (await listChildren(theme.id)).filter(isFolder)) {
        if (known.has(folder.name)) continue
        const files = await listChildren(folder.id)
        const video = files.find((f) => f.mimeType.startsWith('video/'))
        if (!video) continue
        const metaFile = files.find((f) => f.name === 'youtube_meta.json')
        const meta = parseMeta(metaFile ? await downloadText(metaFile.id) : null, null, folder.name)
        rows.push(newRow({ id: folder.name, theme: theme.name, folderId: folder.id, videoId: video.id, title: meta.title, today: today(), youtubeOnly }))
      }
    }
  }
  await appendRows(rows)
  return rows.length
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const isYoutubeOnly = (s: ShortRow) => s.posted.instagram === NOT_FOR_PLATFORM && s.posted.tiktok === NOT_FOR_PLATFORM

export function Marketing() {
  const [connected, setConnected] = useState(false)
  const [shorts, setShorts] = useState<ShortRow[] | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [showDone, setShowDone] = useState(false)
  const [poster, setPoster] = useState<string | null>(null)
  const [posterChecked, setPosterChecked] = useState(false)
  const [checkFirst, setCheckFirst] = useState(false)
  const [autoLog, setAutoLog] = useState<string[] | null>(null)
  const autoStarted = useRef(false)

  useEffect(() => {
    setCheckFirst(readCheckFirst())
    loadGoogleSignIn().catch(() => {})
    detectPoster().then((v) => {
      setPoster(v)
      setPosterChecked(true)
    })
  }, [])

  // /marketing?autopost=1 is opened every hour by the scheduler on the owner's Mac.
  useEffect(() => {
    if (!posterChecked || autoStarted.current) return
    if (new URLSearchParams(window.location.search).get('autopost') !== '1') return
    autoStarted.current = true
    const lines: string[] = []
    const log = (line: string) => {
      lines.push(line)
      setAutoLog([...lines])
    }
    const finish = (title: string) => {
      document.title = title
      log(title)
    }
    document.title = 'Blockerflow autopost: working'
    ;(async () => {
      if (!poster) return finish('Blockerflow autopost: error Blockerflow Poster extension not found')
      try {
        // No one clicks here, so pop-ups must be allowed for blockerflow.net.
        if (!hasGoogleAccess()) await connectGoogle()
        const token = googleAccessToken()
        setConnected(true)
        const rows = parseRows(await readSheet())
        setShorts(rows)
        const due = dueShorts(rows)
        log(due.length ? `Due now: ${due.map((s) => s.id).join(', ')}` : 'Nothing due')
        let posted = 0
        let failed = 0
        for (const s of due) {
          try {
            const before = PLATFORMS.filter((p) => s.posted[p]).length
            const next = await postShort(s, token, log)
            const after = PLATFORMS.filter((p) => next.posted[p]).length
            posted += after - before
            if (after < PLATFORMS.length) failed++
          } catch (e) {
            failed++
            log(e instanceof Error ? e.message : String(e))
          }
        }
        finish(failed ? `Blockerflow autopost: error ${failed} not fully posted (${posted} posts done)` : `Blockerflow autopost: done (${posted} posted)`)
      } catch (e) {
        finish(`Blockerflow autopost: error ${e instanceof Error ? e.message : String(e)}`)
      }
    })()
  }, [posterChecked, poster])

  const toggleCheckFirst = (on: boolean) => {
    setCheckFirst(on)
    try {
      localStorage.setItem(CHECK_FIRST_KEY, on ? '1' : '0')
    } catch {
      /* private mode */
    }
  }

  const fail = useCallback((e: unknown) => {
    if (e instanceof NeedsGoogleAccess) setConnected(false)
    setError(e instanceof Error ? e.message : String(e))
  }, [])

  const say = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast((t) => (t === msg ? '' : t)), 6000)
  }, [])

  const load = useCallback(async () => {
    setError('')
    setBusy('Reading the database')
    try {
      let rows = parseRows(await readSheet())
      setShorts(rows)
      setBusy('Looking for new videos in Drive')
      const added = await addNewShortsFromDrive(new Set(rows.map((r) => r.id)))
      if (added) {
        rows = parseRows(await readSheet())
        setShorts(rows)
        say(`${added} new ${added === 1 ? 'video' : 'videos'} from Drive added to the database.`)
      }
    } catch (e) {
      fail(e)
    } finally {
      setBusy('')
    }
  }, [fail, say])

  const connect = async () => {
    setError('')
    try {
      await connectGoogle()
      setConnected(true)
      await load()
    } catch (e) {
      fail(e)
    }
  }

  const update = (s: ShortRow) => setShorts((list) => list?.map((x) => (x.id === s.id ? s : x)) ?? null)
  const visible = (shorts ?? []).filter((s) => showDone || isInDrive(s))
  const waiting = (shorts ?? []).filter(isInDrive).length
  const link = 'inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-ink-muted hover:bg-black/5'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-primary">BLOCKERFLOW MARKETING</p>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">Shorts studio</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Videos waiting in Google Drive. Mark them Good to let the hourly job post them at their suggested time, or post one now.
            Once a video is on every platform it is meant for, it leaves Drive.
          </p>
        </div>
        {connected && (
          <div className="flex flex-wrap gap-2">
            <Btn variant="ghost" onClick={load} disabled={!!busy}>Refresh</Btn>
            <a className={link} href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`} target="_blank" rel="noopener noreferrer">Database</a>
            <a className={link} href={`https://drive.google.com/drive/folders/${SHORTS_FOLDER_ID}`} target="_blank" rel="noopener noreferrer">Drive folder</a>
          </div>
        )}
      </header>

      {autoLog && (
        <Card className="mt-6 p-4">
          <p className="text-sm font-semibold">Scheduled posting</p>
          <ul className="mt-2 space-y-1 font-mono text-xs text-ink-muted">
            {autoLog.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Card>
      )}

      {error && (
        <div role="alert" className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span>{error}</span>
          <button aria-label="Close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {!connected ? (
        <Card className="mt-8 max-w-xl p-8">
          <h2 className="text-2xl font-bold">Connect Google Drive</h2>
          <p className="mt-2 text-ink-muted">
            Sign in as {OWNER_EMAILS.join(' or ')} and allow Drive and Sheets. The page reads the shorts database and the videos with your own Google
            account. Nothing is stored on a server, and access ends when you close this tab.
          </p>
          <Btn className="mt-5" onClick={connect}>Connect Google Drive</Btn>
        </Card>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-muted">{busy ? `${busy}…` : `${waiting} waiting in Drive`}</p>
            <div className="flex flex-wrap items-center gap-4">
              {poster ? (
                <label className="flex items-center gap-2 text-sm text-ink-muted" title="Fill everything in, but leave the last Publish click to you">
                  <input type="checkbox" checked={checkFirst} onChange={(e) => toggleCheckFirst(e.target.checked)} />
                  Check before publishing
                </label>
              ) : (
                <span className="text-sm text-ink-muted">Install Blockerflow Poster to post automatically</span>
              )}
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
                Show posted and deleted
              </label>
            </div>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {visible.map((s) => (
              <ShortCard key={s.id} short={s} onChange={update} onError={fail} say={say} poster={!!poster} checkFirst={checkFirst} />
            ))}
          </div>
          {shorts && !visible.length && !busy && <p className="mt-6 text-ink-muted">Nothing waiting. New videos appear here as soon as they are in the Drive folder.</p>}
        </>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

const CHECK_FIRST_KEY = 'blockerflow-poster-check-first'
function readCheckFirst() {
  try {
    return localStorage.getItem(CHECK_FIRST_KEY) === '1'
  } catch {
    return false
  }
}
const newJobId = (shortId: string, p: Platform) => `${shortId}:${p}:${Date.now()}`
const REVIEW_TONE: Record<Review, 'neutral' | 'success' | 'danger'> = { Pending: 'neutral', Approved: 'success', Rejected: 'danger' }

function ShortCard({ short: s, onChange, onError, say, poster, checkFirst }: {
  short: ShortRow
  onChange: (s: ShortRow) => void
  onError: (e: unknown) => void
  say: (msg: string) => void
  poster: boolean
  checkFirst: boolean
}) {
  const [meta, setMeta] = useState<ShortMeta | null>(null)
  const [thumb, setThumb] = useState('')
  const [thumbId, setThumbId] = useState('')
  const [videoId, setVideoId] = useState(s.videoId)
  const [auto, setAuto] = useState<PostStatus | null>(null)
  const [preview, setPreview] = useState(false)
  const [active, setActive] = useState<Platform | null>(null)
  const [saving, setSaving] = useState<'' | 'downloading' | 'saved'>('')
  const [working, setWorking] = useState(false)
  const [copied, setCopied] = useState('')
  const video = useRef<Promise<Blob> | null>(null)
  const inDrive = isInDrive(s)
  const wide = isYoutubeOnly(s)

  useEffect(() => {
    if (!inDrive || !s.folderId || !hasGoogleAccess()) return
    let gone = false
    let thumbUrl = ''
    ;(async () => {
      try {
        const files = await listChildren(s.folderId)
        const v = files.find((f) => f.mimeType.startsWith('video/'))
        if (v && !gone) setVideoId(v.id)
        const metaFile = files.find((f) => f.name === 'youtube_meta.json')
        const capFile = files.find((f) => f.name === 'social_caption.txt')
        const [m, c] = await Promise.all([metaFile ? downloadText(metaFile.id) : null, capFile ? downloadText(capFile.id) : null])
        if (!gone) setMeta(parseMeta(m, c, s.title))
        const t = files.find((f) => f.mimeType.startsWith('image/'))
        if (t && !gone) setThumbId(t.id)
        if (t) {
          thumbUrl = URL.createObjectURL(await downloadBlob(t.id))
          if (!gone) setThumb(thumbUrl)
        }
      } catch (e) {
        if (!gone) onError(e)
      }
    })()
    return () => {
      gone = true
      if (thumbUrl) URL.revokeObjectURL(thumbUrl)
    }
  }, [s.folderId, s.title, inDrive, onError])

  const getVideo = () => (video.current ??= downloadBlob(videoId))
  const prefetch = () => {
    if (videoId && inDrive) getVideo().catch(() => (video.current = null))
  }
  const startUpload = (p: Platform) => (poster ? autoPost(p) : manualUpload(p))

  // Automatic: the extension opens the upload page, fills it in and publishes.
  const autoPost = (p: Platform) => {
    if (!meta) return
    const token = googleAccessToken()
    if (!token) return onError(new NeedsGoogleAccess())
    const jobId = newJobId(s.id, p)
    const youtube = copyFields('youtube', meta)
    const field = (label: string) => youtube.find((f) => f.label === label)?.text ?? ''
    setActive(p)
    setAuto({ jobId, platform: p, state: 'working', message: 'Starting' })
    sendPostJob({
      jobId, platform: p, shortId: s.id, videoFileId: videoId, thumbFileId: thumbId, token,
      title: field('Title'), description: field('Description'), tags: meta.tags,
      caption: copyFields(p === 'youtube' ? 'instagram' : p, meta)[0]?.text ?? '',
      stopBeforePublish: checkFirst,
    })
  }

  const markPostedRef = useRef<(p: Platform, on: boolean) => Promise<void>>(async () => {})
  const jobId = auto?.jobId
  useEffect(() => {
    if (!jobId) return
    return onPostStatus(jobId, (st) => {
      setAuto(st)
      if (st.state === 'done') markPostedRef.current(st.platform, true)
    })
  }, [jobId])

  const manualUpload = async (p: Platform) => {
    if (!meta) return
    setAuto(null)
    const [first] = copyFields(p, meta)
    // Copy before opening the tab: the clipboard only works while this page has focus.
    if (first) setCopied((await copy(first.text)) ? first.label : '')
    window.open(UPLOAD_URLS[p], '_blank', 'noopener,noreferrer')
    setActive(p)
    setSaving('downloading')
    try {
      saveBlob(await getVideo(), videoFileName(s.id))
      setSaving('saved')
    } catch (e) {
      video.current = null
      setSaving('')
      onError(e)
    }
  }

  const markPosted = async (p: Platform, on: boolean) => {
    setWorking(true)
    try {
      const date = on ? today() : ''
      await writeCells(cell(s.row, p), [[date]])
      const next = { ...s, posted: { ...s.posted, [p]: date } }
      if (on && isFullyPosted(next)) {
        const binned = await trashIfAllowed(s.folderId)
        next.status = binned ? STATUS.posted : STATUS.postedKept
        await writeCells(cell(s.row, 'status'), [[next.status]])
        say(binned ? `${s.id} is posted everywhere and was moved to the Drive bin.` : `${s.id} is posted everywhere. Its folder stays in Drive.`)
      }
      onChange(next)
      if (on) {
        setActive(null)
        setAuto(null)
      }
    } catch (e) {
      onError(e)
    } finally {
      setWorking(false)
    }
  }
  useEffect(() => {
    markPostedRef.current = markPosted
  })

  const setReview = async (review: Review) => {
    setWorking(true)
    try {
      await writeCells(cell(s.row, 'review'), [[review]])
      onChange({ ...s, review })
    } catch (e) {
      onError(e)
    } finally {
      setWorking(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete ${s.id} from Google Drive? It goes to the Drive bin, where you can restore it for 30 days.`)) return
    setWorking(true)
    try {
      const binned = await trashIfAllowed(s.folderId)
      await writeCells(cell(s.row, 'review'), [['Rejected']])
      await writeCells(cell(s.row, 'status'), [[STATUS.deleted]])
      onChange({ ...s, review: 'Rejected', status: STATUS.deleted })
      say(binned ? `${s.id} was moved to the Drive bin.` : `${s.id} is hidden. Only the folder owner can bin it in Drive.`)
    } catch (e) {
      onError(e)
    } finally {
      setWorking(false)
    }
  }

  const fields = active && meta ? copyFields(active, meta) : []

  return (
    <Card className={cx('p-4', !inDrive && 'opacity-60')}>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          disabled={!inDrive || !videoId}
          aria-label={preview ? 'Hide the video' : 'Play the video'}
          className={cx('group relative flex-none overflow-hidden rounded-xl bg-ink', wide ? 'h-[120px] w-[213px]' : 'h-[213px] w-[120px]')}
        >
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-white/40">…</span>}
          {inDrive && <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-3xl text-white/80 transition-colors group-hover:bg-black/30">▶</span>}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{s.theme || 'Short'}</Badge>
            <Badge tone={REVIEW_TONE[s.review]}>{s.review}</Badge>
            {wide && <Badge>YouTube only</Badge>}
            {s.length && <span className="text-xs text-ink-muted">{s.length} s</span>}
            {!inDrive && <Badge>{s.status}</Badge>}
          </div>
          <h3 className="mt-2 font-semibold leading-snug">{meta?.title || s.title || s.id}</h3>
          <p className="mt-1 text-xs text-ink-muted">
            {s.id}
            {s.publish && ` · publishes ${s.publish}`}
          </p>
          {s.notes && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{s.notes}</p>}

          <div className="mt-3 flex flex-wrap gap-2" onPointerEnter={prefetch}>
            {PLATFORMS.filter((p) => s.posted[p] !== NOT_FOR_PLATFORM).map((p) =>
              s.posted[p] ? (
                <button
                  key={p}
                  type="button"
                  disabled={working || !inDrive}
                  onClick={() => markPosted(p, false)}
                  title="Posted. Click to undo."
                  className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700"
                >
                  ✓ {PLATFORM_NAMES[p]} {s.posted[p]}
                </button>
              ) : (
                <Btn
                  key={p}
                  variant={active === p ? 'solid' : 'outline'}
                  disabled={!inDrive || !meta || working || auto?.state === 'working'}
                  onClick={() => startUpload(p)}
                  title={poster ? `Post on ${PLATFORM_NAMES[p]} automatically` : `Upload to ${PLATFORM_NAMES[p]}`}
                >
                  {poster ? `Post on ${PLATFORM_NAMES[p]}` : PLATFORM_NAMES[p]}
                </Btn>
              ),
            )}
          </div>

          {inDrive && (
            <div className="mt-3 flex flex-wrap items-center gap-1">
              <Btn variant="ghost" disabled={working || s.review === 'Approved'} onClick={() => setReview('Approved')}>👍 Good</Btn>
              <Btn variant="ghost" disabled={working || s.review === 'Rejected'} onClick={() => setReview('Rejected')}>👎 Not good</Btn>
              <Btn variant="ghost" disabled={working} onClick={remove} className="text-red-700 hover:bg-red-50">Delete</Btn>
            </div>
          )}
        </div>
      </div>

      {preview && videoId && (
        <div className="mt-4 flex justify-center">
          <iframe
            title={`${s.id} preview`}
            src={`https://drive.google.com/file/d/${videoId}/preview`}
            className={cx('rounded-xl border-0 bg-ink', wide ? 'aspect-video w-full' : 'aspect-[9/16] w-[270px]')}
            allow="autoplay"
          />
        </div>
      )}

      {active && auto && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary-bg p-4" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">
              {auto.state === 'done' ? 'Posted' : auto.state === 'error' ? 'Stopped' : 'Posting'} on {PLATFORM_NAMES[active]}
            </p>
            {auto.state !== 'working' && (
              <button aria-label="Close" onClick={() => { setActive(null); setAuto(null) }} className="text-ink-muted hover:text-ink">×</button>
            )}
          </div>
          <p className={cx('mt-2 text-sm', auto.state === 'error' ? 'text-red-700' : 'text-ink-muted')}>{auto.message}</p>
          {auto.url && (
            <a href={auto.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-primary underline">{auto.url}</a>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {auto.state !== 'done' && (
              <Btn variant={auto.state === 'ready' ? 'solid' : 'outline'} onClick={() => { cancelPostJob(auto.jobId); markPosted(active, true) }} disabled={working}>
                I posted it on {PLATFORM_NAMES[active]}
              </Btn>
            )}
            {auto.state === 'error' && (
              <>
                <Btn onClick={() => autoPost(active)}>Try again</Btn>
                <Btn variant="ghost" onClick={() => manualUpload(active)}>Do it by hand</Btn>
              </>
            )}
            {auto.state === 'working' && (
              <Btn variant="ghost" onClick={() => { cancelPostJob(auto.jobId); setActive(null); setAuto(null) }}>Stop following</Btn>
            )}
          </div>
        </div>
      )}

      {active && !auto && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">Posting on {PLATFORM_NAMES[active]}</p>
            <button aria-label="Close" onClick={() => setActive(null)} className="text-ink-muted hover:text-ink">×</button>
          </div>
          <ol className="mt-2 space-y-1 text-sm text-ink-muted">
            <li>
              1. Video {saving === 'downloading' ? 'downloading' : saving === 'saved' ? 'saved to your Downloads' : 'not saved yet'} as <b>{videoFileName(s.id)}</b>. Drop it into the upload page.
            </li>
            <li>2. Paste the text. {copied && <>The {copied.toLowerCase()} is already on your clipboard.</>}</li>
            <li>3. Publish there, then come back and tick it below.</li>
          </ol>
          <div className="mt-3 space-y-2">
            {fields.map((f) => (
              <div key={f.label} className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">{f.label}</span>
                  <Btn variant="ghost" onClick={async () => setCopied((await copy(f.text)) ? f.label : '')}>{copied === f.label ? 'Copied' : 'Copy'}</Btn>
                </div>
                <p className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap text-sm">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => markPosted(active, true)} disabled={working}>I posted it on {PLATFORM_NAMES[active]}</Btn>
            <Btn variant="ghost" onClick={() => window.open(UPLOAD_URLS[active], '_blank', 'noopener,noreferrer')}>Open the upload page again</Btn>
          </div>
        </div>
      )}
    </Card>
  )
}
