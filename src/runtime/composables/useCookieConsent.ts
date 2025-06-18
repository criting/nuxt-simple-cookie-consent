import { injectScripts, removeScripts } from '../utils/scriptManager'
import { useCookie, useRuntimeConfig, useState } from '#app'
import { computed } from '#imports'

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

export function useCookieConsent() {
  const config = useRuntimeConfig().public.cookieConsent as {
    cookieName?: string
    categories: Record<string, CookieConsentCategory>
    scripts?: Record<string, CookieScript[]>
  }
  const cookieName = config.cookieName || 'cookie_consent'

  const state = useState<Record<string, boolean>>('cookieConsent', () => {
    return useCookie<Record<string, boolean>>(cookieName).value || {}
  })

  const hasUserMadeChoice = computed(() => {
    return Object.values(state.value).some(v => v !== null)
  })

  function acceptAll() {
    const all = Object.keys(config.categories).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    updatePreferences(all)
  }

  function denyAll() {
    const all = Object.keys(config.categories).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)
    updatePreferences(all)
  }

  function acceptCategories(categories: string[]) {
    const prefs = Object.keys(config.categories).reduce((acc, key) => {
      acc[key] = categories.includes(key)
      return acc
    }, {} as Record<string, boolean>)
    updatePreferences(prefs)
  }

  function updatePreferences(newPrefs: Record<string, boolean>) {
    state.value = newPrefs

    for (const [category, accepted] of Object.entries(newPrefs)) {
      const scripts = config.scripts?.[category] || []

      if (accepted) {
        injectScripts(category, scripts)
      }
      else {
        removeScripts(category)
      }
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
  }
}
