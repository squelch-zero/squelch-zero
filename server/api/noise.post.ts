import { noise } from '@squelch-zero/noise'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.text || typeof body.text !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Send JSON with a "text" field.' })
  }

  const text: string = body.text.slice(0, 2000)
  const threshold: number = Math.max(0, Math.min(1, Number(body.threshold ?? 0.5)))

  return {
    original: text,
    noised: noise(text, threshold),
    threshold,
    length: text.length,
  }
})
