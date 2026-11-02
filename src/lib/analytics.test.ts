import { describe, it, expect, beforeEach } from 'vitest'
import { clearConsent, getConsent, setConsent, trackPageView, MEASUREMENT_ID } from './analytics'

const gtagScripts = () => document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"]`).length

describe('analytics consent', () => {
  beforeEach(() => clearConsent())

  it('sends nothing and loads nothing without consent', () => {
    expect(getConsent()).toBeNull()
    trackPageView('/')
    setConsent('denied')
    trackPageView('/guides/')
    expect(gtagScripts()).toBe(0)
    expect(window.gtag).toBeUndefined()
  })

  it('loads gtag once after Allow, without ad features', () => {
    setConsent('granted')
    trackPageView('/')
    trackPageView('/guides/')
    expect(gtagScripts()).toBe(1)
    const config = (window.dataLayer as IArguments[]).map((a) => Array.from(a)).find((a) => a[0] === 'config')
    expect(config?.[2]).toMatchObject({ send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false })
    expect((window.dataLayer as IArguments[]).filter((a) => a[0] === 'event').length).toBe(2)
  })
})
