/** @type {import('tailwindcss').Config} */
import ui from '@nuxt/ui/tailwind'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './nuxt.config.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [ui()],
}
