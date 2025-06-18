type ScriptConfig = {
  id: string
  src?: string
  async?: boolean
  defer?: boolean
  type?: string
  customContent?: string
}

export function injectScripts(category: string, scripts: ScriptConfig[]) {
  // First, remove existing GDPR scripts
  const scriptsToRemove = document.querySelectorAll<HTMLScriptElement>(`script[data-type="gdpr"]`)
  scriptsToRemove.forEach((el) => {
    el.remove()
  })

  queueMicrotask(() => {
    for (const script of scripts) {
      const el = document.createElement('script')
      el.id = `cookie-script-${script.id}`
      el.setAttribute('data-type', 'gdpr')
      el.setAttribute('data-category', category)
      el.src = script.src || ''
      el.async = script.async ?? true
      el.defer = script.defer ?? false
      el.type = script.type ?? 'text/javascript'

      if (script.customContent) {
        el.innerHTML = script.customContent
      }

      document.head.appendChild(el)
    }
  })
}

export function removeScripts(category: string) {
  const scripts = document.querySelectorAll<HTMLScriptElement>(`script[data-category="${category}"]`)

  scripts.forEach((el) => {
    el.remove()
  })
}
