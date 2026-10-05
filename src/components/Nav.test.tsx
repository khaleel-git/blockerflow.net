import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from './Nav'

describe('Nav', () => {
  it('links the wordmark to home', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Blockerflow home' })).toHaveAttribute('href', '/')
  })

  it('links to the guide, privacy, and terms routes', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute('href', '/guide')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
  })
})
