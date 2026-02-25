<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
  duration?: number
}>()

const DURATION = props.duration ?? 75

type Char = {
  ch: string
  decayed: boolean
  decayable: boolean
}

const html = ref('')
let chars: Char[] = []
let startTime = 0
let tickId: ReturnType<typeof setInterval> | null = null

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function tick() {
  const elapsed = (Date.now() - startTime) / 1000
  const fraction = Math.min(1, (elapsed / DURATION) ** 1.8)

  const decayable = chars.filter(c => c.decayable)
  const targetDecayed = Math.floor(fraction * decayable.length)
  const currentDecayed = decayable.filter(c => c.decayed).length

  if (targetDecayed > currentDecayed) {
    const undecayed = decayable.filter(c => !c.decayed)
    const toDecay = targetDecayed - currentDecayed
    for (let i = 0; i < toDecay && undecayed.length > 0; i++) {
      const idx = Math.floor(Math.random() * undecayed.length)
      undecayed[idx].decayed = true
      undecayed.splice(idx, 1)
    }
  }

  render()
}

function render() {
  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') {
      result += '\n'
    } else if (!c.decayable) {
      result += ' '
    } else if (c.decayed) {
      result += `<span class="sq-decay sq-ch">${glyph()}</span>`
    } else {
      result += escapeHtml(c.ch)
    }
  }
  html.value = result
}

onMounted(() => {
  chars = [...props.text].map(ch => ({
    ch,
    decayed: false,
    decayable: ch !== ' ' && ch !== '\n',
  }))
  startTime = Date.now()
  render()
  tickId = setInterval(tick, 200)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Text that decays over time"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-decay) {
  color: var(--color-neutral-800, #262626);
}
</style>
