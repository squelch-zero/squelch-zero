// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  content: {
    renderer: {
      anchorLinks: true
    }
  },
  app: {
    head: {
      title: 'Squelch Zero',
      meta: [
        { name: 'description', content: 'Below the threshold. Everything comes through.' }
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
