interface AppScreenshotProps {
  src: string
  alt: string
  caption?: string
  className?: string
}

/** A still of the app, used where no demo clip shows the screen a guide is about. */
export function AppScreenshot({ src, alt, caption, className = '' }: AppScreenshotProps) {
  return (
    <figure className={`mx-auto w-full max-w-[260px] ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-outline bg-surface shadow-lg">
        <img src={src} alt={alt} className="block w-full" loading="lazy" decoding="async" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
