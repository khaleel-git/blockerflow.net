import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Privacy } from './Privacy'

describe('Privacy', () => {
  it('renders the required section headings', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'On-device processing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What leaves your device' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Coach' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Accountability Partner' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cloud settings sync' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Permissions' })).toBeInTheDocument()
  })

  it('sets the document title', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(document.title).toBe('Privacy Policy — Blockerflow')
  })
})
