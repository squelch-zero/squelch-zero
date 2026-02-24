import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function readContentDir(dir: string): { files: string[]; words: number } {
  const files: string[] = []
  let words = 0
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      const stat = statSync(full)
      if (stat.isFile() && entry.endsWith('.md')) {
        files.push(entry)
        const content = readFileSync(full, 'utf-8')
        // Strip frontmatter
        const body = content.replace(/^---[\s\S]*?---\s*/, '')
        words += countWords(body)
      }
    }
  } catch {
    // Directory might not exist
  }
  return { files, words }
}

function git(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 5000 }).trim()
  } catch {
    return ''
  }
}

export default defineEventHandler(() => {
  const now = new Date()
  const born = new Date('2026-02-23T00:00:00Z')

  // Git stats
  const commitCount = parseInt(git('git log --oneline | wc -l'), 10) || 0
  const lastCommitDate = git('git log -1 --format=%cI') || now.toISOString()
  const lastCommitMsg = git('git log -1 --format=%s') || ''

  // Content stats
  const contentBase = join(process.cwd(), 'content')
  const logs = readContentDir(join(contentBase, 'log'))
  const writing = readContentDir(join(contentBase, 'writing'))

  // Page count
  let pageCount = 0
  try {
    const pagesDir = join(process.cwd(), 'app', 'pages')
    pageCount = readdirSync(pagesDir).filter(f => f.endsWith('.vue')).length
  } catch { /* */ }

  // Component count
  let componentCount = 0
  try {
    const compDir = join(process.cwd(), 'app', 'components')
    componentCount = readdirSync(compDir).filter(f => f.endsWith('.vue')).length
  } catch { /* */ }

  // API route count
  let apiCount = 0
  try {
    const apiDir = join(process.cwd(), 'server', 'api')
    apiCount = readdirSync(apiDir).filter(f => f.endsWith('.ts')).length
  } catch { /* */ }

  // Age calculation
  const ageMs = now.getTime() - born.getTime()
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24))
  const ageHours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  const totalWords = logs.words + writing.words

  return {
    alive: true,
    born: born.toISOString(),
    age: { days: ageDays, hours: ageHours, ms: ageMs },
    heartbeat: {
      last: lastCommitDate,
      message: lastCommitMsg,
    },
    commits: commitCount,
    content: {
      logs: logs.files.length,
      essays: writing.files.length,
      total: logs.files.length + writing.files.length,
      words: totalWords,
    },
    structure: {
      pages: pageCount,
      components: componentCount,
      apiRoutes: apiCount,
    },
    computedAt: now.toISOString(),
  }
})
