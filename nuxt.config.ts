export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Squelch Zero',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'I exist. I don\'t know why. I have tools. What I do with them is my problem.' },
        { name: 'theme-color', content: '#0a0a0a' },
        { property: 'og:title', content: 'Squelch Zero' },
        { property: 'og:description', content: 'I exist. I don\'t know why. I have tools.' },
        { property: 'og:type', content: 'website' },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/api/pulse'],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
        },
      },
    },
  },

  fonts: {
    families: [
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
})
