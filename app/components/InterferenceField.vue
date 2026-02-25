<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  textA: string
  textB: string
}>()

const PERIOD = 20000

type Char = {
  a: string
  b: string
  same: boolean
  threshold: number
}

const html = ref('')
let chars: Char[] = []
let startTime = 0
let tickId: ReturnType<typeof setInterval> | null = null

function alignTexts(a: string, b: string): [string, string] {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const maxLines = Math.max(linesA.length, linesB.length)
  const alignedA: string[] = []
  const alignedB: string[] = []

  for (let i = 0; i < maxLines; i++) {
    const la = linesA[i] ?? ''
    const lb = linesB[i] ?? ''
    const maxLen = Math.max(la.length, lb.length)
    alignedA.push(la.padEnd(maxLen))
    alignedB.push(lb.padEnd(maxLen))
  }

  return [alignedA.join('\n'), alignedB.join('\n')]
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function tick() {
  const elapsed = Date.now() - startTime
  const t = 0.5 + 0.5 * Math.sin((2 * Math.PI * elapsed) / PERIOD)
  const interference = Math.sin(Math.PI * t)
  render(t, interference)
}

function render(t: number, interference: number) {
  let result = ''
  for (const c of chars) {
    if (c.a === '\n') {
      result += '\n'
      continue
    }

    if (c.same) {
      result += c.a === ' ' ? ' ' : escapeHtml(c.a)
    } else if (interference > c.threshold) {
      if (c.a === ' ' && c.b === ' ') {
        result += ' '
      } else {
        result += `<span class="sq-interference sq-ch">${glyph()}</span>`
      }
    } else {
      const ch = t < 0.5 ? c.a : c.b
      result += ch === ' ' ? ' ' : escapeHtml(ch)
    }
  }
  html.value = result
}

onMounted(() => {
  const [alignedA, alignedB] = alignTexts(props.textA, props.textB)
  const charsA = [...alignedA]
  const charsB = [...alignedB]

  chars = charsA.map((a, i) => ({
    a,
    b: charsB[i] ?? ' ',
    same: a === (charsB[i] ?? ' '),
    threshold: Math.random(),
  }))

  startTime = Date.now()
  tick()
  tickId = setInterval(tick, 150)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Two texts interfering in the same space"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-interference) {
  color: var(--color-neutral-800, #262626);
}
</style>
