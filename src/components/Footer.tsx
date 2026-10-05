import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-outline">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-ink-muted sm:flex-row sm:justify-between">
        <p>&copy; {year} Blockerflow. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/guide" className="hover:text-ink">
            Guide
          </Link>
          <Link to="/privacy" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-ink">
            Terms &amp; Conditions
          </Link>
          <a
            href="https://khaleel.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Made by Khaleel
          </a>
        </div>
      </div>
    </footer>
  )
}
