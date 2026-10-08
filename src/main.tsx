import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production pages are prerendered, so hydrate them. The dev server serves an empty root.
if (root.firstElementChild) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
