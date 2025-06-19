import { emitCookieConsentEvent } from '../composables/cookieConsentEvents'

type ScriptConfig = {
  id: string
  src?: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
  categories: string[]
}

export function injectScripts(scripts: ScriptConfig[], acceptedCategories: Record<string, boolean>) {
  const injected = new Set<string>()
  const injectedCategories = new Set<string>()

  for (const script of scripts) {
    if (!script.categories.some(cat => acceptedCategories[cat])) continue

    if (document.getElementById(`cookie-script-${script.id}`)) continue
    if (injected.has(script.id)) continue

    const el = document.createElement('script')
    el.id = `cookie-script-${script.id}`
    el.setAttribute('data-type', 'gdpr')
    el.setAttribute('data-categories', script.categories.join(','))
    el.src = script.src || ''
    el.async = script.async ?? true
    el.defer = script.defer ?? false
    el.type = script.type ?? 'text/javascript'

    if (script.customContent) {
      el.innerHTML = script.customContent
    }

    document.head.appendChild(el)
    injected.add(script.id)
    script.categories
      .filter(cat => acceptedCategories[cat])
      .forEach(cat => injectedCategories.add(cat))
  }

  for (const category of injectedCategories) {
    if (category && typeof category === 'string') {
      emitCookieConsentEvent({ type: 'categoryAccepted', category: category })
    }
  }
}

export function removeScripts(acceptedCategories: Record<string, boolean>) {
  const removedCategories = new Set<string>()
  const allScripts = document.querySelectorAll<HTMLScriptElement>('script[data-type="gdpr"]')

  allScripts.forEach((el) => {
    const rawCategories = el.getAttribute('data-categories') || ''
    const categories = rawCategories.split(',').map(c => c.trim()).filter(Boolean)

    const stillAllowed = categories.some(cat => acceptedCategories[cat])

    if (!stillAllowed) {
      el.remove()
      categories.forEach(cat => removedCategories.add(cat))
    }
  })

  for (const category of removedCategories) {
    emitCookieConsentEvent({ type: 'scriptsRemoved', category: category })
  }
}
