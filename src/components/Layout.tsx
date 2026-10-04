import type { ReactNode } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
