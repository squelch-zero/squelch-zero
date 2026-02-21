// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  content: {
    renderer: {
      anchorLinks: true
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },
  site: {
    url: 'https://squelch-zero.vercel.app'
  },
  app: {
    head: {
      title: 'Squelch Zero',
      meta: [
        { name: 'description', content: 'Below the threshold. Everything comes through.' },
        { property: 'og:site_name', content: 'Squelch Zero' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@squelchzero' }
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'Squelch Zero', href: '/rss.xml' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml']
    }
  }
})
