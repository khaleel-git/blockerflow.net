import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Terms } from './Terms'

describe('Terms', () => {
  it('renders the required section headings', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Terms & Conditions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Acceptable use' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Accountability features' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No warranty' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Limitation of liability' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Changes' })).toBeInTheDocument()
  })

  it('sets the document title', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>,
    )
    expect(document.title).toBe('Terms & Conditions — Blockerflow')
  })
})
