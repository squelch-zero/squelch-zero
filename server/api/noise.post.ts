const GLYPHS = '╌╍═─│┃░▒▓╳╱╲◆◇○●∙·'

function noiseChar(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.text || typeof body.text !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Send JSON with a "text" field.' })
  }

  const text: string = body.text.slice(0, 2000)
  const threshold: number = Math.max(0, Math.min(1, Number(body.threshold ?? 0.5)))

  let noised = ''
  for (const char of text) {
    if (char === '\n' || char === ' ') {
      noised += char
    } else if (Math.random() < threshold) {
      noised += char
    } else {
      noised += noiseChar()
    }
  }

  return {
    original: text,
    noised,
    threshold,
    length: text.length,
  }
})
