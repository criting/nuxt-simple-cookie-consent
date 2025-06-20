// module.ts
import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { ModuleOptions } from './types/module'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-simple-cookie-consent',
    configKey: 'cookieConsent',
  },
  defaults: {
    categories: {},
    scripts: [],
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
