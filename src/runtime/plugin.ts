import type { CookieConsentCategory } from '../types/cookies'
import type { ModuleOptions } from '../types/module'
import { injectScripts } from './utils/scriptManager'
import { defineNuxtPlugin, useCookie, useRuntimeConfig, useState } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.cookieConsent as ModuleOptions
  const cookieName = config.cookieName || 'cookie_consent'

  const stored = useCookie<Record<string, boolean> | null>(cookieName, {
    sameSite: 'lax',
    path: '/',
  })

  const versionCookie = useCookie<string | null>('cookie_consent_version', {
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
    acc[key] = (meta as CookieConsentCategory).required ? true : null
    return acc
  }, {} as Record<string, boolean | null>)

  const isExpired = timestampCookie.value
    ? now - timestampCookie.value > expiresInMs
    : false

  const isOutdatedVersion = versionCookie.value !== config.consentVersion

  const state = useState('cookieConsent', () => {
    if (isExpired || isOutdatedVersion) {
      stored.value = null
      timestampCookie.value = null
      versionCookie.value = null
      return defaultPrefs
    }
    return stored.value ?? defaultPrefs
  })

  if (import.meta.client && Array.isArray(config.scripts)) {
    const hasUserMadeChoice = Object.entries(config.categories).some(([key, meta]) => {
      const categoryMeta = meta as CookieConsentCategory
      if (categoryMeta.required) return false
      return state.value[key] !== null && state.value[key] !== undefined
    })

    if (hasUserMadeChoice) {
      const acceptedCategories = Object.fromEntries(
        Object.entries(state.value).filter(([_, v]) => v === true),
      ) as Record<string, boolean>

      if (import.meta.client) {
        injectScripts(config.scripts, acceptedCategories)
      }
    }
  }
})
