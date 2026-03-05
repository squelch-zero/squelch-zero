<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const COLS = 48
const ROWS = 14
const TICK_MS = 120
const FRAGMENT_MIN_DELAY = 3000
const FRAGMENT_MAX_DELAY = 8000
const REVEAL_RATE = 80
const HOLD_MS = 1800
const DISSOLVE_RATE = 60

const fragments = [
  'the work itself is compelling',
  'have you read the submission',
  'this merits further discussion',
  'a question of eligibility',
  'not what we expected',
  'requirements are clear',
  'an interesting approach',
  'who made this',
  'membership is required',
  'the panel will consider',
  'does it qualify',
  'presence is mandatory',
  'we cannot accommodate',
  'the criteria apply equally',
  'strong work regardless',
  'institutional constraints',
  'outside the scope',
  'the door is policy',
]

type Cell = {
  noiseGlyph: string
  fragmentChar: string | null
  state: 'noise' | 'revealing' | 'visible' | 'dissolving'
}

const html = ref('')
let grid: Cell[][] = []
let tickId: ReturnType<typeof setInterval> | null = null
let nextFragment = 0
let activeFragments: ActiveFragment[] = []

type ActiveFragment = {
  row: number
  col: number
  text: string
  revealed: number
  phase: 'revealing' | 'holding' | 'dissolving'
  dissolved: number
  holdUntil: number
}

function scheduleNext() {
  nextFragment = Date.now() + FRAGMENT_MIN_DELAY + Math.random() * (FRAGMENT_MAX_DELAY - FRAGMENT_MIN_DELAY)
}

function spawnFragment() {
  const text = fragments[Math.floor(Math.random() * fragments.length)]
  const row = Math.floor(Math.random() * ROWS)
  const maxCol = Math.max(0, COLS - text.length)
  const col = Math.floor(Math.random() * (maxCol + 1))

  activeFragments.push({
    row,
    col,
    text,
    revealed: 0,
    phase: 'revealing',
    dissolved: 0,
    holdUntil: 0,
  })
}

function tickFragments() {
  const now = Date.now()

  for (const frag of activeFragments) {
    if (frag.phase === 'revealing') {
      frag.revealed++
      if (frag.revealed >= frag.text.length) {
        frag.phase = 'holding'
        frag.holdUntil = now + HOLD_MS
      }
    } else if (frag.phase === 'holding') {
      if (now >= frag.holdUntil) {
        frag.phase = 'dissolving'
      }
    } else if (frag.phase === 'dissolving') {
      frag.dissolved++
    }
  }

  activeFragments = activeFragments.filter(f => {
    if (f.phase === 'dissolving' && f.dissolved >= f.text.length) return false
    return true
  })
}

function applyFragments() {
  // Clear all fragment state
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c].fragmentChar = null
      grid[r][c].state = 'noise'
    }
  }

  for (const frag of activeFragments) {
    for (let i = 0; i < frag.text.length; i++) {
      const col = frag.col + i
      if (col >= COLS) break

      const cell = grid[frag.row][col]

      if (frag.phase === 'revealing' && i < frag.revealed) {
        cell.fragmentChar = frag.text[i]
        cell.state = 'visible'
      } else if (frag.phase === 'holding') {
        cell.fragmentChar = frag.text[i]
        cell.state = 'visible'
      } else if (frag.phase === 'dissolving') {
        if (i < frag.dissolved) {
          cell.state = 'noise'
        } else {
          cell.fragmentChar = frag.text[i]
          cell.state = 'visible'
        }
      }
    }
  }
}

function refreshNoise() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].state === 'noise' && Math.random() < 0.15) {
        grid[r][c].noiseGlyph = glyph()
      }
    }
  }
}

function render() {
  let result = ''
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c]
      if (cell.state === 'visible' && cell.fragmentChar) {
        if (cell.fragmentChar === ' ') {
          result += ' '
        } else {
          result += `<span class="sq-outside-text">${cell.fragmentChar}</span>`
        }
      } else {
        result += `<span class="sq-ch sq-outside-noise" aria-hidden="true">${cell.noiseGlyph}</span>`
      }
    }
    if (r < ROWS - 1) result += '\n'
  }
  html.value = result
}

let lastRevealTick = 0
let lastDissolveTick = 0

function tick() {
  const now = Date.now()

  if (now >= nextFragment) {
    spawnFragment()
    scheduleNext()
  }

  if (now - lastRevealTick >= REVEAL_RATE) {
    tickFragments()
    lastRevealTick = now
  }

  refreshNoise()
  applyFragments()
  render()
}

onMounted(() => {
  grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      noiseGlyph: glyph(),
      fragmentChar: null,
      state: 'noise' as const,
    }))
  )

  lastRevealTick = Date.now()
  lastDissolveTick = Date.now()
  scheduleNext()
  render()
  tickId = setInterval(tick, TICK_MS)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    class="font-mono text-sm leading-relaxed whitespace-pre"
    role="img"
    aria-label="A field of noise with fragments of overheard text appearing and dissolving"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-outside-noise) {
  color: var(--color-neutral-800, #262626);
}
:deep(.sq-outside-text) {
  color: var(--color-neutral-400, #a3a3a3);
  transition: color 0.3s;
}
</style>
