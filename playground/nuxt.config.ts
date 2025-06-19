export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-03-24',
  cookieConsent: {
    expiresInDays: 180,
    cookieName: 'cookie_consent',
    categories: {
      analytics: {
        label: 'Analytics',
        description: 'Used to improve website performance.',
        required: false,
      },
      ads: {
        label: 'Advertisement',
        description: 'Used for ad personalization.',
      },
    },
    scripts: [
      {
        id: 'ga',
        src: 'https://www.googletagmanager.com/gtag/js?id=GA_ID',
        async: true,
        defer: true,
        categories: ['analytics', 'ads'],
      },
      {
        id: 'ads',
        src: 'https://ads.example.com/script.js',
        categories: ['ads'],
      },
    ],
  },
})
