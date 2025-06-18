import { injectScripts } from './utils/scriptManager'
import { defineNuxtPlugin, useCookie, useRuntimeConfig, useState } from '#app'
import { watchEffect } from '#imports'

type ScriptConfig = {
  id: string
  src?: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.cookieConsent as {
    cookieName?: string
    categories: Record<string, unknown>
    scripts?: Record<string, ScriptConfig[]>
  }
  const cookieName = config.cookieName || 'cookie_consent'

  const stored = useCookie<Record<string, boolean> | null>(cookieName, {
    sameSite: 'lax',
    path: '/',
  })

  const emptyPrefs = Object.keys(config.categories).reduce((acc, key) => {
    acc[key] = null
    return acc
  }, {} as Record<string, boolean | null>)

  const state = useState('cookieConsent', () => stored.value ?? emptyPrefs)

  watchEffect(() => {
    if (Object.values(state.value).some(v => v !== null)) {
      stored.value = state.value as Record<string, boolean>
    }
  })

  if (import.meta.client) {
    for (const [category, accepted] of Object.entries(state.value)) {
      if (accepted === true) {
        const scripts = config.scripts?.[category] || []
        injectScripts(category, scripts)
      }
    }
  }
})
