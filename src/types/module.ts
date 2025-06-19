import type { CookieConsentCategory, CookieScript } from './cookies'

export interface ModuleOptions {
  categories: Record<string, CookieConsentCategory>
  scripts: CookieScript[]
  cookieName?: string
  expiresInDays?: number
  consentVersion?: string
}
