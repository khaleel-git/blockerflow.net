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

  it('discloses that an unreadable Gemini answer may be logged with a quoted reason', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(
      screen.getByText(/written to the server's error log/),
    ).toBeInTheDocument()
  })

  it('discloses the Firestore profile fields synced on sign-in', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(
      screen.getByText(/email, display name, and photo URL/),
    ).toBeInTheDocument()
  })

  it("discloses that the accountability partner's email is synced as part of settings", () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(screen.getByText(/accountability-partner mode and email/)).toBeInTheDocument()
  })

  it('discloses that signing out does not delete already-synced data', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(
      screen.getByText(/does not delete what was already written to Firestore/),
    ).toBeInTheDocument()
  })

  it('renders a Your choices section describing how to request data deletion', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Your choices' })).toBeInTheDocument()
  })
})
