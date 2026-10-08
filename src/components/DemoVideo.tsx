import { VIDEOS, type VideoKey } from '../seo/videos'
import { PhoneFrame } from './PhoneFrame'

interface DemoVideoProps {
  video: VideoKey
  caption: string
}

/** A tap to play demo clip. Nothing downloads until the visitor presses play. */
export function DemoVideo({ video, caption }: DemoVideoProps) {
  const info = VIDEOS[video]
  return (
    <figure className="mx-auto w-full max-w-[260px]">
      <PhoneFrame>
        <video
          className="h-full w-full object-cover"
          src={info.src}
          poster={info.poster}
          controls
          playsInline
          preload="none"
          aria-label={info.name}
        />
      </PhoneFrame>
      <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>
    </figure>
  )
}
