import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('renders Home at /', () => {
    renderAt('/')
    expect(screen.getByText('Get it on Google Play')).toBeInTheDocument()
  })

  it('renders Guide at /guide', () => {
    renderAt('/guide')
    expect(screen.getByRole('heading', { name: 'How to use Blockerflow' })).toBeInTheDocument()
  })

  it('renders Privacy at /privacy', () => {
    renderAt('/privacy')
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
  })

  it('renders Terms at /terms', () => {
    renderAt('/terms')
    expect(screen.getByRole('heading', { name: 'Terms & Conditions' })).toBeInTheDocument()
  })

  it('renders NotFound for an unmatched path instead of a blank page', () => {
    renderAt('/this-page-does-not-exist')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows the nav and footer on every route, including unmatched ones', () => {
    renderAt('/this-page-does-not-exist')
    expect(screen.getByRole('link', { name: 'Blockerflow home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Made by Khaleel' })).toBeInTheDocument()
  })
})
