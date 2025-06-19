export interface CookieConsentCategory {
  label: string
  description?: string
  required?: boolean
}

export interface CookieScript {
  id: string
  src: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
  customHTML?: string
  categories: string[]
}
