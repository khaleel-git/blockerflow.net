import { VIDEOS, type VideoKey } from '../seo/videos'

interface DemoVideoProps {
  video: VideoKey
  caption?: string
  className?: string
}

/** A tap to play demo clip. Nothing downloads until the visitor presses play. */
export function DemoVideo({ video, caption, className = '' }: DemoVideoProps) {
  const info = VIDEOS[video]
  const size = info.landscape ? 'aspect-video max-w-2xl' : 'aspect-[9/16] max-w-[260px]'
  return (
    <figure className={`mx-auto w-full ${info.landscape ? 'max-w-2xl' : 'max-w-[260px]'} ${className}`}>
      <div className="rounded-[1.75rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 p-[3px] shadow-xl shadow-indigo-500/20">
        <div className={`${size} w-full overflow-hidden rounded-[calc(1.75rem-3px)] bg-ink`}>
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
