import { useEffect, useRef, useState } from 'react'

export function HeroDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

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

    const syncFullscreen = () => setFullscreen(document.fullscreenElement === frameRef.current)
    document.addEventListener('fullscreenchange', syncFullscreen)

    return () => {
      observer.disconnect()
      video.removeEventListener('enterpictureinpicture', exitFloatingPlayer)
      document.removeEventListener('fullscreenchange', syncFullscreen)
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

  // The whole frame goes full screen, not the bare video, so the sound and exit buttons stay on
  // top of it. iPhone Safari can only do that for a video element, so it falls back to its own player.
  const toggleFullscreen = () => {
    const frame = frameRef.current
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!frame || !video) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else if (typeof frame.requestFullscreen === 'function') {
      frame.requestFullscreen().catch(() => {})
    } else {
      video.webkitEnterFullscreen?.()
    }
  }

  return (
    <div ref={frameRef} className="hero-video relative h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/assets/videos/hero-demo.mp4"
        poster="/assets/videos/hero-demo.jpg"
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
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? 'Exit full screen' : 'Watch full screen'}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-black/70"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {fullscreen ? (
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          ) : (
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          )}
        </svg>
      </button>
    </div>
  )
}
