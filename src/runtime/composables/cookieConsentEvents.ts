type CookieConsentEvent =
  | { type: 'consentAccepted' }
  | { type: 'consentDenied' }
  | { type: 'categoryAccepted', category: string }
  | { type: 'scriptsInjected', category: string }
  | { type: 'scriptsRemoved', category: string }

type Listener = (event: CookieConsentEvent) => void

// Pure JS global event registry
const listeners: Listener[] = []

export function emitCookieConsentEvent(event: CookieConsentEvent) {
  listeners.forEach(listener => listener(event))
}

export function onCookieConsentEvent(callback: Listener) {
  listeners.push(callback)
}

// Optional shortcut wrappers
export function onConsentAccepted(cb: () => void) {
  onCookieConsentEvent((event) => {
    if (event.type === 'consentAccepted') cb()
  })
}

export function onConsentDenied(cb: () => void) {
  onCookieConsentEvent((event) => {
    if (event.type === 'consentDenied') cb()
  })
}

export function onCategoryAccepted(cb: (category: string) => void) {
  onCookieConsentEvent((event) => {
    if (event.type === 'categoryAccepted') cb(event.category)
  })
}

export function onScriptsInjected(cb: (category: string) => void) {
  onCookieConsentEvent((event) => {
    if (event.type === 'scriptsInjected') cb(event.category)
  })
}

export function onScriptsRemoved(cb: (category: string) => void) {
  onCookieConsentEvent((event) => {
    if (event.type === 'scriptsRemoved') cb(event.category)
  })
}
