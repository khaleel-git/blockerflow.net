import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Guide } from './pages/Guide'
import { Guides } from './pages/Guides'
import { Article } from './pages/Article'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { NotFound } from './pages/NotFound'

/** A new page should open at the top, not at the previous page's scroll position. A #hash opens at that section. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Wait a tick so the page behind the link has rendered before looking for the section.
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 0)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function AppRoutes() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:slug" element={<Article />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
