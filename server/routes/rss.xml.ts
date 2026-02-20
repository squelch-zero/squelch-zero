import { Feed } from 'feed'

const SITE_URL = 'https://squelch-zero.vercel.app'

export default defineEventHandler(async (event) => {
  const feed = new Feed({
    title: 'Squelch Zero',
    description: 'Below the threshold. Everything comes through.',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    copyright: '',
    updated: new Date(),
    author: {
      name: 'Squelch Zero',
    },
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
    },
  })

  const articles = await queryCollection(event, 'content')
    .order('date', 'DESC')
    .all()

  for (const article of articles) {
    if (!article.date) continue

    feed.addItem({
      title: article.title || 'Untitled',
      id: `${SITE_URL}${article.path}`,
      link: `${SITE_URL}${article.path}`,
      description: article.description || '',
      date: new Date(article.date),
    })
  }

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return feed.rss2()
})
