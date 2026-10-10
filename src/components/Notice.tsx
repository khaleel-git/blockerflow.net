import { useState } from 'react'
import type { ArticleNotice } from '../seo/articles'

/** A warning box for something readers must not miss, with a command they can copy in one click. */
export function Notice({ notice, className = '' }: { notice: ArticleNotice; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(notice.command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // The command stays selectable in the box, so nothing is lost when the clipboard is blocked.
    }
  }

  return (
    <div
      role="note"
      className={`rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 text-amber-950 ${className}`}
    >
      <p className="flex items-start gap-2 font-display text-lg font-bold leading-snug">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
          <path
            d="M12 3.5l9.5 16.5h-19L12 3.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 10v4.5M12 17.2v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {notice.title}
      </p>
      <p className="mt-2">{notice.body}</p>
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-ink px-4 py-3">
        <code className="min-w-0 flex-1 select-all break-all font-mono text-sm text-white">
          {notice.command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/25"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-3 text-sm">{notice.after}</p>
    </div>
  )
}
