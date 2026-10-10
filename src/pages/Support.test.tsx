import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Support } from './Support'

function renderPage() {
  return render(
    <MemoryRouter>
      <Support />
    </MemoryRouter>,
  )
}

describe('Support page', () => {
  it('says the app is free and lists what donations pay for with the real prices', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Keep Blockerflow free.' })).toBeInTheDocument()
    expect(screen.getByText('Apple Developer ID')).toBeInTheDocument()
    expect(screen.getByText('€99 a year')).toBeInTheDocument()
    expect(screen.getByText('around €200 a year')).toBeInTheDocument()
    expect(screen.getByText('Running costs')).toBeInTheDocument()
  })

  it('starts at 10 euro: 36 days of Apple signing, 18 of Windows, a prefilled PayPal link', () => {
    renderPage()
    expect(screen.getByRole('radio', { name: '€10' })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent(/36 days of Apple Developer ID signing/)
    expect(screen.getByRole('status')).toHaveTextContent(/18 days of Windows code signing/)
    const pay = screen.getByRole('link', { name: 'Donate €10 via PayPal' })
    expect(pay).toHaveAttribute('href', 'https://www.paypal.com/paypalme/Khaleeleu/10EUR')
    expect(pay).toHaveAttribute('target', '_blank')
    expect(pay).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('updates the days, the strip and the PayPal link when another amount is chosen', () => {
    const { container } = renderPage()
    fireEvent.click(screen.getByRole('radio', { name: '€25' }))
    expect(screen.getByRole('status')).toHaveTextContent(/92 days of Apple Developer ID signing/)
    expect(screen.getByRole('link', { name: 'Donate €25 via PayPal' })).toHaveAttribute(
      'href',
      'https://www.paypal.com/paypalme/Khaleeleu/25EUR',
    )
    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(92)
    expect(container.querySelectorAll('[data-day]')).toHaveLength(365)
  })

  it('takes a custom amount, and unchecks the presets while it is valid', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Another amount in euro'), { target: { value: '7,5' } })
    expect(screen.queryByRole('radio', { checked: true })).toBeNull()
    expect(screen.getByRole('link', { name: 'Donate €7.50 via PayPal' })).toHaveAttribute(
      'href',
      'https://www.paypal.com/paypalme/Khaleeleu/7.50EUR',
    )
  })

  it('falls back to the plain PayPal link for an invalid custom amount and says what is wrong', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Another amount in euro'), { target: { value: 'abc' } })
    expect(screen.getByRole('link', { name: 'Donate via PayPal' })).toHaveAttribute(
      'href',
      'https://www.paypal.com/paypalme/Khaleeleu',
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an amount from 1 to 10000 euro.')
  })

  it('has free ways to help, with working links', () => {
    renderPage()
    const help = screen.getByRole('region', { name: 'Ways to help for free' })
    expect(within(help).getByRole('link', { name: /Review it on Google Play/ })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow',
    )
    expect(within(help).getByRole('link', { name: /hello@khaleel.eu/ })).toHaveAttribute(
      'href',
      'mailto:hello@khaleel.eu',
    )
  })

  it('does not use dash punctuation in its copy', () => {
    const { container } = renderPage()
    expect(container.textContent).not.toMatch(/ - | -- |—|–/)
  })
})
