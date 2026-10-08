import { VIDEOS, type VideoKey } from '../seo/videos'

interface DemoVideoProps {
  video: VideoKey
  caption?: string
  className?: string
}

/** A tap to play demo clip. Nothing downloads until the visitor presses play. */
export function DemoVideo({ video, caption, className = '' }: DemoVideoProps) {
  const info = VIDEOS[video]
  const aspect = info.aspect ?? (info.landscape ? '16 / 9' : '9 / 16')
  return (
    <figure className={`mx-auto w-full ${info.landscape ? 'max-w-2xl' : 'max-w-[260px]'} ${className}`}>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div className="w-full bg-ink" style={{ aspectRatio: aspect }}>
          <video
            className="h-full w-full object-cover"
            src={info.src}
            poster={info.poster}
            controls
            playsInline
            preload="none"
            aria-label={info.name}
          />
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>}
    </figure>
  )
}
