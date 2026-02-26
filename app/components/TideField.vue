<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
}>()

type Char = {
  ch: string
  threshold: number
  isContent: boolean
}

const html = ref('')
let chars: Char[] = []
let tickId: ReturnType<typeof setInterval> | null = null

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function getNoiseLevel(): number {
  const now = new Date()
  const hour = now.getHours() + now.getMinutes() / 60
  // Peak clarity at 4am local, peak noise at 4pm local
  const phase = (hour - 4) / 24 * 2 * Math.PI
  return 0.05 + 0.40 * (1 - Math.cos(phase))
}

function render() {
  const level = getNoiseLevel()
  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') {
      result += '\n'
    } else if (!c.isContent) {
      result += ' '
    } else if (c.threshold < level) {
      result += `<span class="sq-noise sq-ch" aria-hidden="true">${glyph()}</span>`
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
  render()
  tickId = setInterval(render, 150)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Text whose legibility changes with the time of day"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-noise) {
  color: var(--color-neutral-700, #404040);
}
</style>
