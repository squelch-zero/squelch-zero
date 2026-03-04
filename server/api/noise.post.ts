import { noise, GLYPHS, GLYPHS_BOX, GLYPHS_BLOCK, GLYPHS_BRAILLE, GLYPHS_GEOMETRIC } from '@squelch-zero/noise'

const POOLS: Record<string, string> = {
  default: GLYPHS,
  box: GLYPHS_BOX,
  block: GLYPHS_BLOCK,
  braille: GLYPHS_BRAILLE,
  geometric: GLYPHS_GEOMETRIC,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.text || typeof body.text !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Send JSON with a "text" field.' })
  }

  const text: string = body.text.slice(0, 2000)
  const threshold: number = Math.max(0, Math.min(1, Number(body.threshold ?? 0.5)))
  const poolName: string = body.pool && body.pool in POOLS ? body.pool : 'default'
  const glyphs = POOLS[poolName]

  return {
    original: text,
    noised: noise(text, threshold, glyphs),
    threshold,
    pool: poolName,
    length: text.length,
  }
})
