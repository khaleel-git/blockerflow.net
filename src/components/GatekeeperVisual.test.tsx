import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GatekeeperVisual } from './GatekeeperVisual'

describe('GatekeeperVisual', () => {
  it('shows the real macOS message for an unsigned app, and the notarized one, word for word', () => {
    render(<GatekeeperVisual />)
    expect(screen.getByText('“Blockerflow” Not Opened')).toBeInTheDocument()
    expect(
      screen.getByText('Apple could not verify “Blockerflow” is free of malware that may harm your Mac or compromise your privacy.'),
    ).toBeInTheDocument()
    expect(screen.getByText('“Blockerflow” is an app downloaded from the Internet. Are you sure you want to open it?')).toBeInTheDocument()
    expect(screen.getByText('Apple checked it for malicious software and none was detected.')).toBeInTheDocument()
  })

  it('does not claim the signed app opens with no prompt at all', () => {
    const { container } = render(<GatekeeperVisual />)
    expect(container.textContent).not.toMatch(/like any other app/i)
  })

  it('starts on the message people get today and the switch moves to the signed one', () => {
    const { container } = render(<GatekeeperVisual />)
    // On a narrow layout the inactive dialog is hidden by a container query class (jsdom has no CSS), on a wide one both show.
    const wrapperOf = (label: string) => container.querySelector(`[aria-label="${label}"]`)!.parentElement!
    const todayBox = wrapperOf('macOS message today')
    const signedBox = wrapperOf('macOS message after signing')
    expect(todayBox.className).not.toContain('@max-2xl:hidden')
    expect(signedBox.className).toContain('@max-2xl:hidden')
    expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'After signing' }))
    expect(signedBox.className).not.toContain('@max-2xl:hidden')
    expect(todayBox.className).toContain('@max-2xl:hidden')
    expect(screen.getByRole('button', { name: 'After signing' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('never uses the hidden attribute, which Tailwind makes impossible to override on wide layouts', () => {
    const { container } = render(<GatekeeperVisual />)
    expect(container.querySelectorAll('[hidden]')).toHaveLength(0)
  })

  it('says it is an illustration and uses the real app icon as decoration only', () => {
    const { container } = render(<GatekeeperVisual />)
    expect(screen.getByText(/Illustration of the two macOS messages/)).toBeInTheDocument()
    const icons = container.querySelectorAll('img[src="/assets/icon-512.png"]')
    expect(icons).toHaveLength(2)
    icons.forEach((i) => expect(i).toHaveAttribute('alt', ''))
  })

  it('does not use dash punctuation', () => {
    const { container } = render(<GatekeeperVisual />)
    expect(container.textContent).not.toMatch(/ - | -- |—|–/)
  })
})
