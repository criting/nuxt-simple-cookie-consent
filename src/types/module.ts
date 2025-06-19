import type { CookieConsentCategory, CookieScript } from './cookies'
import type { GTMConsentField } from './gtm'

export interface ModuleOptions {
  categories: Record<string, CookieConsentCategory>
  scripts: CookieScript[]
  cookieName?: string
  expiresInDays?: number
  consentVersion?: string
  gtmConsentMapping?: Record<string, GTMConsentField>
}
