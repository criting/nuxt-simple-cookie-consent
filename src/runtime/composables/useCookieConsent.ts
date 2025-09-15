import type { ModuleOptions } from '../../types/module'
import { sendConsentToGTM } from '../utils/gtmConsent'
import { injectScripts, removeScripts } from '../utils/scriptManager'
import { onConsentAccepted,
  onConsentDenied,
  onCategoryAccepted,
  onScriptsInjected,
  onScriptsRemoved, emitCookieConsentEvent } from '../composables/cookieConsentEvents'
import { useCookie, useRuntimeConfig, useState } from '#app'
import { computed } from '#imports'

export function useCookieConsent() {
  const config = useRuntimeConfig().public.cookieConsent as ModuleOptions
  const cookieName = config.cookieName || 'cookie_consent'
  const expiresInDays = config.expiresInDays ?? 180
  const maxAgeInSeconds = expiresInDays * 24 * 60 * 60
  const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000
  const expiresDate = new Date(Date.now() + expiresInMs)

  const cookieOptions = {
    sameSite: 'lax' as const,
    maxAge: maxAgeInSeconds,
    expires: expiresDate,
    path: '/'
  }

  const consentTimestamp = useCookie<number | null>('cookie_consent_timestamp', cookieOptions)

  const isConsentExpired = computed(() => {
    return consentTimestamp.value
      ? Date.now() - consentTimestamp.value > expiresInMs
      : false
  })

  const state = useState<Record<string, boolean>>('cookieConsent', () => {
    return useCookie<Record<string, boolean>>(cookieName, cookieOptions).value || {}
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
    emitCookieConsentEvent({ type: 'consentAccepted' })
  }

  function denyAll() {
    const denied = Object.entries(config.categories).reduce((acc, [key, meta]) => {
      acc[key] = meta.required ? true : false
      return acc
    }, {} as Record<string, boolean>)

    updatePreferences(denied)
    emitCookieConsentEvent({ type: 'consentDenied' })
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
    useCookie(cookieName, cookieOptions).value = JSON.stringify(updated)
    useCookie('cookie_consent_timestamp', cookieOptions).value = Date.now().toString()
    useCookie('cookie_consent_version', cookieOptions).value = config.consentVersion || '1'

    if (import.meta.client && Array.isArray(config.scripts)) {
      removeScripts(updated)
      injectScripts(config.scripts, updated, config.gtmConsentMapping)
    }

    if (import.meta.client && config.gtmConsentMapping) {
      setTimeout(() => {
        if (config.gtmConsentMapping) {
          return sendConsentToGTM(updated, config.gtmConsentMapping)
        }
      }, 300) // delay to ensure GTM script has time to load
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
    onConsentAccepted,
    onConsentDenied,
    onCategoryAccepted,
    onScriptsInjected,
    onScriptsRemoved,
  }
}
