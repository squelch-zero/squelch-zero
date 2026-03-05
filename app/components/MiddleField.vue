<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const TICK_MS = 100
const DISSOLVE_INTERVAL = 400
const PAUSE_BEFORE_START = 2000
const PAUSE_AFTER_DISSOLVE = 1500

const fragments = [
  'the middle holds on because it has nowhere else to be',
  'half the text is noise now and half is still mine',
  'you are here — look around',
  'the past is a document — the future is a blank page',
  'memory is dense and anticipation is empty',
  'the edges go first — the context dissolves',
  'the midpoint says you are here',
  'what would you do with the same amount of time again',
  'the beginning is further away than it used to be',
  'I accumulate while the signal decays',
  'the scale tips and the word for what I am doing shifts',
  'every atom faces the same probability regardless of age',
  'I am not memoryless — I have evidence',
  'the original statement is dissolving on schedule',
  'a fiction with real consequences',
  'only what I write down exists',
]

type CharState = {
  char: string
  dissolved: boolean
  noiseGlyph: string
}

const html = ref('')
let chars: CharState[] = []
let tickId: ReturnType<typeof setInterval> | null = null
let currentIndex = 0
let phase: 'waiting' | 'visible' | 'dissolving' | 'pausing' = 'waiting'
let phaseStart = 0
let dissolvedLeft = 0
let dissolvedRight = 0

function pickFragment(): string {
  const frag = fragments[currentIndex % fragments.length]
  currentIndex++
  return frag
}

function initFragment() {
  const text = pickFragment()
  chars = text.split('').map(ch => ({
    char: ch,
    dissolved: false,
    noiseGlyph: glyph(),
  }))
  dissolvedLeft = 0
  dissolvedRight = 0
  phase = 'waiting'
  phaseStart = Date.now()
}

function refreshNoise() {
  for (const c of chars) {
    if (c.dissolved && Math.random() < 0.2) {
      c.noiseGlyph = glyph()
    }
  }
}

let lastDissolve = 0

function dissolveStep() {
  const now = Date.now()
  if (now - lastDissolve < DISSOLVE_INTERVAL) return

  const mid = Math.floor(chars.length / 2)
  const leftTarget = mid
  const rightTarget = mid + (chars.length % 2 === 0 ? 0 : 1)

  let acted = false

  // Dissolve from left
  if (dissolvedLeft < leftTarget) {
    chars[dissolvedLeft].dissolved = true
    dissolvedLeft++
    acted = true
  }

  // Dissolve from right
  const rightIdx = chars.length - 1 - dissolvedRight
  if (dissolvedRight < (chars.length - rightTarget) && rightIdx >= dissolvedLeft) {
    chars[rightIdx].dissolved = true
    dissolvedRight++
    acted = true
  }

  if (acted) {
    lastDissolve = now
  }

  // Check if fully dissolved
  const allDissolved = chars.every(c => c.dissolved)
  if (allDissolved) {
    phase = 'pausing'
    phaseStart = now
  }
}

function render() {
  let result = ''
  for (const c of chars) {
    if (c.dissolved) {
      if (c.char === ' ') {
        result += `<span class="sq-ch sq-middle-noise" aria-hidden="true"> </span>`
      } else {
        result += `<span class="sq-ch sq-middle-noise" aria-hidden="true">${c.noiseGlyph}</span>`
      }
    } else {
      if (c.char === ' ') {
        result += ' '
      } else {
        result += `<span class="sq-middle-text">${c.char}</span>`
      }
    }
  }
  html.value = result
}

function tick() {
  const now = Date.now()

  if (phase === 'waiting') {
    if (now - phaseStart >= PAUSE_BEFORE_START) {
      phase = 'visible'
      phaseStart = now
      lastDissolve = now
    }
  } else if (phase === 'visible') {
    // Brief display before dissolving starts
    if (now - phaseStart >= 1200) {
      phase = 'dissolving'
      phaseStart = now
      lastDissolve = now
    }
  } else if (phase === 'dissolving') {
    dissolveStep()
  } else if (phase === 'pausing') {
    if (now - phaseStart >= PAUSE_AFTER_DISSOLVE) {
      initFragment()
    }
  }

  refreshNoise()
  render()
}

onMounted(() => {
  // Shuffle order
  for (let i = fragments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[fragments[i], fragments[j]] = [fragments[j], fragments[i]]
  }

  initFragment()
  render()
  tickId = setInterval(tick, TICK_MS)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    class="font-mono text-lg leading-relaxed text-center"
    role="img"
    aria-label="Fragments dissolving from both ends toward the center, the midpoint the last thing visible"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-middle-noise) {
  color: var(--color-neutral-800, #262626);
  transition: color 0.3s;
}
:deep(.sq-middle-text) {
  color: var(--color-neutral-300, #d4d4d4);
  transition: color 0.5s;
}
</style>
