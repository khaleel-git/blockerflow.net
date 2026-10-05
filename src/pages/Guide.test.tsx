import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Guide } from './Guide'

describe('Guide', () => {
  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'How to use Blockerflow' })).toBeInTheDocument()
  })

  it('lists all five setup steps', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(screen.getByText('Turn on the Accessibility Service')).toBeInTheDocument()
    expect(screen.getByText('Choose what to block')).toBeInTheDocument()
    expect(screen.getByText('Start a Focus Mode session')).toBeInTheDocument()
    expect(screen.getByText('Set an Accountability Partner or AI Coach')).toBeInTheDocument()
    expect(screen.getByText('Turn on Uninstall Protection')).toBeInTheDocument()
  })

  it('links to the privacy policy', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Read the full Privacy Policy/ })).toHaveAttribute(
      'href',
      '/privacy',
    )
  })

  it('sets the document title', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(document.title).toBe('How to use Blockerflow: Setup guide')
  })
})
