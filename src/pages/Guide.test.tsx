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

  it('lists every setup step', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(screen.getByText('Finish the setup screen')).toBeInTheDocument()
    expect(screen.getByText('Choose what to block')).toBeInTheDocument()
    expect(screen.getByText('Add your own apps and sites')).toBeInTheDocument()
    expect(screen.getByText('Set an Accountability Partner')).toBeInTheDocument()
    expect(screen.getByText('Turn on Uninstall Protection')).toBeInTheDocument()
    expect(screen.getByText('Start a Focus session')).toBeInTheDocument()
  })

  it('sends people to the Blocking tab for the feature switches, not the Blocklist tab', () => {
    render(
      <MemoryRouter>
        <Guide />
      </MemoryRouter>,
    )
    expect(
      screen.getByText(/Everything is on the Blocking tab, the screen the app opens on/),
    ).toBeInTheDocument()
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
    expect(document.title).toBe('How to Set Up Blockerflow: Android Blocker Setup Guide')
  })
})
