<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const gridRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const html = ref('')
const inputText = ref('')

type Cell = {
  ch: string
  state: 'empty' | 'signal' | 'decaying' | 'noise'
  decayAt: number
  decayDuration: number
}

let cols = 60
let rows = 20
let grid: Cell[] = []
let tickId: ReturnType<typeof setInterval> | null = null

function initGrid() {
  grid = Array.from({ length: cols * rows }, () => ({
    ch: ' ',
    state: 'empty' as const,
    decayAt: 0,
    decayDuration: 0,
  }))
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function submit() {
  const text = inputText.value
  if (!text.trim()) return
  inputText.value = ''

  const total = cols * rows
  const start = Math.floor(Math.random() * Math.max(1, total - text.length))
  const now = Date.now()

  let pos = start
  for (let i = 0; i < text.length && pos < total; i++) {
    const ch = text[i]
    if (ch === ' ') {
      pos++
      continue
    }
    grid[pos] = {
      ch,
      state: 'signal',
      decayAt: now + 1500 + Math.random() * 2500,
      decayDuration: 8000 + Math.random() * 7000,
    }
    pos++
  }

  inputRef.value?.focus()
}

function tick() {
  const now = Date.now()

  for (const cell of grid) {
    if (cell.state === 'signal' && now >= cell.decayAt) {
      cell.state = 'decaying'
    }
    if (cell.state === 'decaying') {
      const elapsed = now - cell.decayAt
      if (elapsed >= cell.decayDuration) {
        cell.ch = glyph()
        cell.state = 'noise'
      }
    }
  }

  render()
}

function render() {
  const now = Date.now()
  let result = ''

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r * cols + c]
      if (cell.state === 'empty') {
        result += ' '
      } else if (cell.state === 'signal') {
        result += `<span class="sq-signal">${escapeHtml(cell.ch)}</span>`
      } else if (cell.state === 'decaying') {
        const elapsed = now - cell.decayAt
        const progress = Math.min(1, elapsed / cell.decayDuration)
        if (Math.random() < progress ** 1.5) {
          result += `<span class="sq-noise sq-ch">${glyph()}</span>`
        } else {
          result += `<span class="sq-signal">${escapeHtml(cell.ch)}</span>`
        }
      } else {
        result += `<span class="sq-noise sq-ch">${escapeHtml(cell.ch)}</span>`
      }
    }
    if (r < rows - 1) result += '\n'
  }

  html.value = result
}

onMounted(() => {
  const el = gridRef.value
  if (!el) return

  if (window.innerWidth < 640) {
    cols = 30
  } else if (window.innerWidth < 1024) {
    cols = 45
  }

  const probe = document.createElement('span')
  probe.style.fontFamily = 'var(--font-mono)'
  probe.style.fontSize = '12px'
  probe.style.lineHeight = '1.3'
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.whiteSpace = 'pre'
  probe.textContent = 'X'
  el.appendChild(probe)
  const charH = probe.getBoundingClientRect().height
  el.removeChild(probe)

  if (charH > 0) {
    rows = Math.max(8, Math.floor(el.clientHeight / charH))
  }

  initGrid()
  render()
  tickId = setInterval(tick, 150)

  inputRef.value?.focus()
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      ref="gridRef"
      class="flex-1 min-h-0 font-mono text-xs leading-[1.3] select-none overflow-hidden whitespace-pre"
      role="img"
      aria-label="Echo field — your words dissolve into noise"
      v-html="html"
    />
    <form @submit.prevent="submit" class="flex items-center gap-2 pt-3">
      <span class="text-neutral-600 text-sm font-mono">&gt;</span>
      <input
        ref="inputRef"
        v-model="inputText"
        type="text"
        placeholder="say something"
        class="flex-1 bg-transparent border-none outline-none text-sm font-mono text-neutral-300 placeholder-neutral-700 p-0"
        autocomplete="off"
        spellcheck="false"
      />
    </form>
  </div>
</template>

<style scoped>
:deep(.sq-signal) {
  color: var(--color-squelch);
}
:deep(.sq-noise) {
  color: var(--color-neutral-800, #262626);
}
</style>
