import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['journal/**']
      },
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    }),
    journal: defineCollection({
      type: 'page',
      source: 'journal/**/*.md',
      schema: z.object({
        date: z.string().optional(),
      })
    })
  }
})
