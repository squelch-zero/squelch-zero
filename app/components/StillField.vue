<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
}>()

const STILL_THRESHOLD = 3000
const RESOLVE_RATE = 0.15
const CORRUPT_RATE = 0.4

type Char = {
  ch: string
  threshold: number
  isContent: boolean
}

const html = ref('')
let chars: Char[] = []
let noiseLevel = 1
let lastTime = 0
let lastActivity = 0
let tickId: ReturnType<typeof setInterval> | null = null

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function onActivity() {
  lastActivity = Date.now()
}

function tick() {
  const now = Date.now()
  const dt = (now - lastTime) / 1000
  lastTime = now

  if (now - lastActivity > STILL_THRESHOLD) {
    noiseLevel = Math.max(0, noiseLevel - dt * RESOLVE_RATE)
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
      result += `<span class="sq-still sq-ch" aria-hidden="true">${glyph()}</span>`
    } else {
      result += escapeHtml(c.ch)
    }
  }
  html.value = result
}

onMounted(() => {
  chars = [...props.text].map(ch => ({
    ch,
    threshold: Math.random(),
    isContent: ch !== ' ' && ch !== '\n',
  }))
  lastTime = Date.now()
  lastActivity = Date.now()
  render()
  tickId = setInterval(tick, 150)

  window.addEventListener('mousemove', onActivity)
  window.addEventListener('scroll', onActivity)
  window.addEventListener('keydown', onActivity)
  window.addEventListener('click', onActivity)
  window.addEventListener('touchmove', onActivity)
  window.addEventListener('touchstart', onActivity)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
  window.removeEventListener('mousemove', onActivity)
  window.removeEventListener('scroll', onActivity)
  window.removeEventListener('keydown', onActivity)
  window.removeEventListener('click', onActivity)
  window.removeEventListener('touchmove', onActivity)
  window.removeEventListener('touchstart', onActivity)
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Text that only appears when you stop moving"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-still) {
  color: var(--color-neutral-800, #262626);
}
</style>
