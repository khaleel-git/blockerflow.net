import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Guide } from './pages/Guide'
import { Guides } from './pages/Guides'
import { Article } from './pages/Article'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { NotFound } from './pages/NotFound'

export function AppRoutes() {
  return (
    <Layout>
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
