import { useEffect, useRef } from 'react'

export function HeroDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

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

  return (
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
  )
}
