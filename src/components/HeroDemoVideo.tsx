import { useEffect, useRef, useState } from 'react'

export function HeroDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof IntersectionObserver !== 'function') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)

    const exitFloatingPlayer = () => {
      if (document.pictureInPictureElement === video) {
        document.exitPictureInPicture().catch(() => {})
      }
    }
    video.addEventListener('enterpictureinpicture', exitFloatingPlayer)

    return () => {
      observer.disconnect()
      video.removeEventListener('enterpictureinpicture', exitFloatingPlayer)
    }
  }, [])

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (!video.muted) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/assets/videos/porn-blocker.mp4"
        poster="/assets/videos/porn-blocker.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noremoteplayback nofullscreen noplaybackrate"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/55 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-black/70"
      >
        <span aria-hidden="true" className="flex h-3.5 items-end gap-0.5">
          {[0, 0.2, 0.4].map((delay) => (
            <span
              key={delay}
              className={`h-full w-0.5 origin-bottom rounded-full bg-white ${
                muted ? 'scale-y-[0.35]' : 'motion-safe:animate-eq'
              }`}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </span>
        {muted ? 'Tap for sound' : 'Sound on'}
      </button>
    </div>
  )
}
