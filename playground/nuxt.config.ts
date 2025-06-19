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
    consentVersion: '1.0.0',
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
        id: 'ga2',
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
      {
        id: 'ga',
        src: 'https://www.googletagmanager.com/gtag/js?id=GA_ID',
        customContent: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_ID');
        `,
        categories: ['analytics'],
      },
      {
        id: 'facebook',
        customHTML: `
            <iframe src="https://www.facebook.com/tr?id=FB_PIXEL_ID&ev=PageView&noscript=1"
                    height="1" width="1" style="display:none"></iframe>
          `,
        categories: ['ads'],
        src: '',
      },
    ],
  },
})
