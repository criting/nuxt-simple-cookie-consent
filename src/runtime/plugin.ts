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

type CategoryConfig = {
  label: string
  description: string
  required?: boolean
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

  const defaultPrefs = Object.entries(config.categories).reduce((acc, [key, meta]) => {
    acc[key] = (meta as CategoryConfig).required ? true : null
    return acc
  }, {} as Record<string, boolean | null>)

  const state = useState('cookieConsent', () => stored.value ?? defaultPrefs)

  watchEffect(() => {
    const current = { ...state.value }

    for (const [key, meta] of Object.entries(config.categories)) {
      const categoryMeta = meta as CategoryConfig
      if (categoryMeta.required) current[key] = true
    }

    if (Object.values(current).some(v => v !== null)) {
      stored.value = current as Record<string, boolean>
      state.value = current
    }
  })

  if (import.meta.client) {
    for (const [category, meta] of Object.entries(config.categories)) {
      const categoryMeta = meta as CategoryConfig
      const accepted = state.value[category]
      if (categoryMeta.required || accepted === true) {
        const scripts = config.scripts?.[category] || []
        injectScripts(category, scripts)
      }
    }
  }
})
