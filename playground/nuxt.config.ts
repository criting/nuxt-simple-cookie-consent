export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-03-24',
  cookieConsent: {
    cookieName: 'cookie_consent',
    categories: {
      analytics: {
        label: 'Analytics',
        description: 'Used to improve website performance.',
        required: true,
      },
      ads: {
        label: 'Advertisement',
        description: 'Used for ad personalization.',
      },
    },
    scripts: {
      analytics: [
        {
          id: 'ga',
          src: 'https://www.googletagmanager.com/gtag/js?id=GA_ID',
        },
      ],
      ads: [
        {
          id: 'ads',
          src: 'https://ads.example.com/script.js',
        },
      ],
    },
  },
})
