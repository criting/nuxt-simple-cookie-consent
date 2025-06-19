import { injectScripts } from './utils/scriptManager'
import { defineNuxtPlugin, useCookie, useRuntimeConfig, useState } from '#app'

type ScriptConfig = {
  id: string
  src?: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
  categories: string[]
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
    expiresInDays?: number
  }
  const cookieName = config.cookieName || 'cookie_consent'

  const stored = useCookie<Record<string, boolean> | null>(cookieName, {
    sameSite: 'lax',
    path: '/',
  })

  const timestampCookie = useCookie<number | null>('cookie_consent_timestamp', {
    sameSite: 'lax',
    path: '/',
  })

  const expiresInMs = (config.expiresInDays ?? 180) * 24 * 60 * 60 * 1000
  const now = Date.now()

  const defaultPrefs = Object.entries(config.categories).reduce((acc, [key, meta]) => {
    acc[key] = (meta as CategoryConfig).required ? true : null
    return acc
  }, {} as Record<string, boolean | null>)

  const isExpired = timestampCookie.value
    ? now - timestampCookie.value > expiresInMs
    : false

  const state = useState('cookieConsent', () => {
    if (isExpired) {
      return defaultPrefs
    }
    return stored.value ?? defaultPrefs
  })

  if (import.meta.client && Array.isArray(config.scripts)) {
    const hasUserMadeChoice = Object.entries(config.categories).some(([key, meta]) => {
      const categoryMeta = meta as CategoryConfig
      if (categoryMeta.required) return false
      return state.value[key] !== null && state.value[key] !== undefined
    })

    if (hasUserMadeChoice) {
      const acceptedCategories = Object.fromEntries(
        Object.entries(state.value).filter(([_, v]) => v === true),
      ) as Record<string, boolean>

      injectScripts(config.scripts, acceptedCategories)
    }
  }
})
