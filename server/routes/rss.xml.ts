import { Feed } from 'feed'
import MarkdownIt from 'markdown-it'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SITE_URL = 'https://squelch-zero.vercel.app'
const md = new MarkdownIt({ html: true, linkify: true })

function getArticleHtml(articlePath: string): string {
  try {
    const filePath = join(process.cwd(), 'content', `${articlePath.slice(1)}.md`)
    const raw = readFileSync(filePath, 'utf-8')
    const body = raw.replace(/^---[\s\S]*?---\n/, '')
    return md.render(body)
  } catch {
    return ''
  }
}

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
      content: getArticleHtml(article.path),
      date: new Date(article.date),
    })
  }

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return feed.rss2()
})
