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
  }
}

export function removeScripts(acceptedCategories: Record<string, boolean>) {
  const allScripts = document.querySelectorAll<HTMLScriptElement>('script[data-type="gdpr"]')

  allScripts.forEach((el) => {
    const categories = (el.getAttribute('data-categories') || '').split(',')
    const stillAllowed = categories.some(cat => acceptedCategories[cat])

    if (!stillAllowed) {
      el.remove()
    }
  })
}
