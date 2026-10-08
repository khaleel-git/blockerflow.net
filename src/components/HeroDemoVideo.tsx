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
        className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
      >
        {muted ? 'Tap for sound' : 'Sound on'}
      </button>
    </div>
  )
}
