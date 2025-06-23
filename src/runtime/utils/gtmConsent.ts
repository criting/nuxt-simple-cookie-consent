import type { GTMConsentField } from '../../types/gtm'

type GtagConsentCommands = ['consent', 'update', Record<string, 'granted' | 'denied'>]
type GtagConfigCommand = ['config', string, Record<string, unknown>?]
type GtagEventCommand = ['event', string, Record<string, unknown>?]

type GtagFunction = (
  ...args: GtagConsentCommands | GtagConfigCommand | GtagEventCommand
) => void

declare global {
  interface Window {
    gtag?: GtagFunction
  }
}
export function sendConsentToGTM(preferences: Record<string, boolean>, mapping: Record<string, GTMConsentField>) {
  const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
  if (!gtmScript || typeof window.gtag !== 'function') return

  const consent: Record<string, 'granted' | 'denied'> = {}

  for (const [category, consentField] of Object.entries(mapping)) {
    if (preferences[category] !== undefined) {
      consent[consentField] = preferences[category] ? 'granted' : 'denied'
    }
  }

  window.gtag('consent', 'update', consent)

  console.log('[DEBUG] Sending GTM consent update:', consent)
}
