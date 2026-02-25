<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
}>()

const CORRUPT_RATE = 0.12
const RESOLVE_RATE = 0.06
const GRACE_MS = 1500

type Char = {
  ch: string
  threshold: number
  isContent: boolean
}

const html = ref('')
let chars: Char[] = []
let noiseLevel = 1
let lastTime = 0
let graceUntil = 0
let tickId: ReturnType<typeof setInterval> | null = null

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function tick() {
  const now = Date.now()
  const dt = (now - lastTime) / 1000
  lastTime = now

  if (document.hidden) {
    noiseLevel = Math.max(0, noiseLevel - dt * RESOLVE_RATE)
  } else if (now < graceUntil) {
    // grace period — text stays as it is
  } else {
    noiseLevel = Math.min(1, noiseLevel + dt * CORRUPT_RATE)
  }

  render()
}

function render() {
  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') {
      result += '\n'
    } else if (!c.isContent) {
      result += ' '
    } else if (c.threshold < noiseLevel) {
      result += `<span class="sq-absence">${glyph()}</span>`
    } else {
      result += escapeHtml(c.ch)
    }
  }
  html.value = result
}

function onVisibilityChange() {
  if (!document.hidden) {
    graceUntil = Date.now() + GRACE_MS
    lastTime = Date.now()
  }
}

onMounted(() => {
  chars = [...props.text].map(ch => ({
    ch,
    threshold: Math.random(),
    isContent: ch !== ' ' && ch !== '\n',
  }))
  lastTime = Date.now()
  render()
  tickId = setInterval(tick, 150)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Text that resolves when you look away"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-absence) {
  color: var(--color-neutral-800, #262626);
}
</style>
