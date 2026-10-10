import type { Article } from '../seo/articles'

/** The download link of a guide, with what the file is under it. `bare` drops the note for the closing block. */
export function DownloadButton({
  download,
  bare = false,
  className = '',
}: {
  download: NonNullable<Article['download']>
  bare?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <a
        href={download.href}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3.5 font-display text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {download.label}
      </a>
      {!bare && <p className="mt-3 text-sm text-ink-muted">{download.note}</p>}
    </div>
  )
}
