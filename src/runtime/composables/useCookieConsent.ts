import type { CookieConsentCategory, CookieScript } from '../../types/cookies'
import { injectScripts, removeScripts } from '../utils/scriptManager'
import { useCookie, useRuntimeConfig, useState } from '#app'
import { computed } from '#imports'

export function useCookieConsent() {
  const config = useRuntimeConfig().public.cookieConsent as {
    cookieName?: string
    categories: Record<string, CookieConsentCategory>
    scripts?: CookieScript[]
    expiresInDays?: number
  }
  const cookieName = config.cookieName || 'cookie_consent'

  const consentTimestamp = useCookie<number | null>('cookie_consent_timestamp')
  const expiresInMs = (config.expiresInDays ?? 180) * 24 * 60 * 60 * 1000

  const isConsentExpired = computed(() => {
    return consentTimestamp.value
      ? Date.now() - consentTimestamp.value > expiresInMs
      : false
  })

  const state = useState<Record<string, boolean>>('cookieConsent', () => {
    return useCookie<Record<string, boolean>>(cookieName).value || {}
  })

  const hasUserMadeChoice = computed(() => {
    return Object.entries(config.categories).some(([key, meta]) => {
      if (meta.required) return false
      return state.value[key] !== null && state.value[key] !== undefined
    })
  })

  function acceptAll() {
    const all = Object.keys(config.categories).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    updatePreferences(all)
  }

  function denyAll() {
    const denied = Object.entries(config.categories).reduce((acc, [key, meta]) => {
      acc[key] = meta.required ? true : false
      return acc
    }, {} as Record<string, boolean>)

    updatePreferences(denied)
  }

  function acceptCategories(categories: string[]) {
    const prefs = Object.keys(config.categories).reduce((acc, key) => {
      acc[key] = categories.includes(key)
      return acc
    }, {} as Record<string, boolean>)
    updatePreferences(prefs)
  }

  function updatePreferences(newPrefs: Record<string, boolean>) {
    const updated: Record<string, boolean> = {}

    for (const [key, meta] of Object.entries(config.categories)) {
      const isRequired = meta.required === true
      const userValue = newPrefs[key]

      updated[key] = isRequired ? true : !!userValue
    }

    state.value = updated
    useCookie(cookieName).value = JSON.stringify(updated)
    useCookie('cookie_consent_timestamp').value = Date.now().toString()

    if (import.meta.client && Array.isArray(config.scripts)) {
      removeScripts(updated)
      injectScripts(config.scripts, updated)
    }
  }

  function resetPreferences() {
    denyAll()
  }

  return {
    preferences: state,
    categories: Object.keys(config.categories),
    categoryMeta: config.categories,
    scripts: config.scripts,
    acceptAll,
    denyAll,
    acceptCategories,
    updatePreferences,
    resetPreferences,
    hasUserMadeChoice,
    consentTimestamp,
    isConsentExpired,
  }
}
