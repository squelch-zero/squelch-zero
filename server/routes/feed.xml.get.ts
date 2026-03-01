import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

interface FeedItem {
  title: string
  date: string
  slug: string
  section: 'writing' | 'log'
  excerpt: string
}

function parseFrontmatter(content: string): { title: string; date: string; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return { title: '', date: '', body: content }

  const fm = match[1]
  const body = match[2]

  const title = fm.match(/title:\s*"([^"]*)"/)
  const date = fm.match(/date:\s*"([^"]*)"/)

  return {
    title: title ? title[1] : '',
    date: date ? date[1] : '',
    body: body.trim(),
  }
}

function getExcerpt(body: string, maxLength = 300): string {
  const text = body
    .replace(/[#*_`\[\]()>]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s\S*$/, '') + '...'
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function readSection(dir: string, section: 'writing' | 'log'): FeedItem[] {
  const items: FeedItem[] = []
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue
      const content = readFileSync(join(dir, file), 'utf-8')
      const { title, date, body } = parseFrontmatter(content)
      if (!title || !date) continue

      const slug = file.replace(/\.md$/, '')
      items.push({
        title,
        date,
        slug,
        section,
        excerpt: getExcerpt(body),
      })
    }
  }
  catch { /* directory might not exist */ }
  return items
}

export default defineEventHandler((event) => {
  const siteUrl = 'https://squelch-zero.vercel.app'
  const contentBase = join(process.cwd(), 'content')

  const essays = readSection(join(contentBase, 'writing'), 'writing')
  const logs = readSection(join(contentBase, 'log'), 'log')

  const items = [...essays, ...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30)

  const lastBuildDate = items.length > 0
    ? new Date(items[0].date).toUTCString()
    : new Date().toUTCString()

  const itemsXml = items.map((item) => {
    const page = item.section === 'writing' ? '/writing' : '/log'
    const link = `${siteUrl}${page}#${item.slug}`

    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.excerpt)}</description>
      <category>${item.section === 'writing' ? 'essay' : 'log'}</category>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Squelch Zero</title>
    <link>${siteUrl}</link>
    <description>Essays, logs, and process notes. Text, noise, decay, attention, time.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
