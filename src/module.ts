// module.ts
import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'

export interface CookieConsentCategory {
  label: string
  description?: string
}

export interface CookieScript {
  id: string
  src: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
}

export interface ModuleOptions {
  categories: Record<string, CookieConsentCategory>
  scripts: Record<string, CookieScript[]>
  cookieName?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'simple-cookie-consent',
    configKey: 'cookieConsent',
  },
  defaults: {
    categories: {},
    scripts: {},
    cookieName: 'cookie_consent',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.cookieConsent = {
      ...options,
      cookieName: options.cookieName ?? 'cookie_consent',
    }

    addImportsDir(resolver.resolve('runtime/composables'))
    addPlugin(resolver.resolve('runtime/plugin'))
  },
})
