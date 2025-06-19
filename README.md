# 🍪 nuxt-simple-cookie-consent

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A simple, headless, and fully customizable cookie consent module for Nuxt 3.  
Built for developers who want full control over styling and behavior, without relying on bloated third-party libraries.

> ⚠️ **Warning:** This module is currently under active development and **not production-ready**.  
> Use at your own risk. APIs may change as the module evolves.

## 🚀 Features

<!-- Highlight some of the features your module provide here -->
- ✅ Headless design — you control all UI/UX
- ✅ Group scripts into categories (analytics, ads, etc.)
- ✅ Scripts only run after user consents
- ✅ Accept all, deny all, or select categories
- ✅ Reactive `useCookieConsent()` composable
- ✅ Auto-injection and removal of scripts

## 📦 Installation

Install the module to your Nuxt application with one command:

```bash
npm install nuxt-simple-cookie-consent
```

That's it! You can now use nuxt-simple-cookie-consent in your Nuxt app ✨

```ts
export default defineNuxtConfig({
  modules: ['nuxt-simple-cookie-consent'],
  cookieConsent: {
    categories: {
      analytics: {
        label: 'Analytics',
        description: 'Used to collect anonymous usage statistics.'
      },
      ads: {
        label: 'Advertising',
        description: 'Used to serve personalized ads.'
      }
    },
    scripts: [
      {
        id: 'ga',
        src: 'https://www.googletagmanager.com/gtag/js?id=GA_ID',
        async: true,
        defer: true,
        categories: ['analytics', 'advertising'],
      },
      {
        id: 'ads',
        src: 'https://ads.example.com/script.js',
        categories: ['advertising'],
      },
    ],
  }
})
```

## Usage

Use the built-in composable to build your own cookie banner, modal, or settings panel:

```ts
const {
  preferences,
  categoryMeta,
  updatePreferences,
  acceptAll,
  denyAll,
  acceptCategories,
  hasUserMadeChoice
} = useCookieConsent()
```

Build your UI using Nuxt UI, Tailwind, or anything else.  
Preferences are fully reactive and changes are immediately reflected.
You can find example in the playground with Nuxt UI!

## 📌 Why Another Cookie Module?

Other modules are:

- ❌ Too opinionated on UI
- ❌ Too complex to configure
- ❌ Not reactive or dynamic enough

This one gives you **just the logic** — you handle the rest with your own design system and UX.
Well, of course you will get a full working examples, no need to pressure yourself!

## 🛠 Planned Features
- [x] Support multiple categories
- [x] Script injection/removal based on category
- [ ] Post-load callbacks
- [x] Required categories (`required: true`)
- [x] Consent expiration / auto-renew prompt
- [ ] DevTools integration
- [ ] Built-in helpers for common script types
- [ ] SSR-safe inline script support

## 🙏 Contributing

Pull requests, issues, and suggestions are welcome!

If you find a bug or want to propose a feature, open an issue or a PR.

> ⚠️ This module is still **in development** — expect breaking changes until stable release.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-simple-cookie-consent/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-simple-cookie-consent

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-simple-cookie-consent.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-simple-cookie-consent

[license-src]: https://img.shields.io/npm/l/nuxt-simple-cookie-consent.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-simple-cookie-consent

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
