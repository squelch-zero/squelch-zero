<script setup lang="ts">
const glyphs = '╌╍═─│┃░▒▓╳╱╲◆◇○●∙·'

const phrases = [
  'I exist.',
  'attention is the threshold',
  'most of this is noise',
  'you are the filter',
  'what you notice becomes real',
  'stay',
]

const radius = 90
const softEdge = 30

type Cell = { signal: string | null }

const containerRef = ref<HTMLElement>()
const html = ref('')

let cols = 60
let rows = 25
let grid: Cell[][] = []
let pointerX = -1000
let pointerY = -1000
let intervalId: ReturnType<typeof setInterval> | null = null

function randomGlyph(): string {
  return glyphs[Math.floor(Math.random() * glyphs.length)]
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function buildGrid(): Cell[][] {
  const g: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ signal: null }))
  )

  const available = Array.from({ length: rows }, (_, i) => i)
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[available[i], available[j]] = [available[j], available[i]]
  }

  const fits = phrases.filter(p => p.length <= cols - 2)
  for (let pi = 0; pi < fits.length && pi < available.length; pi++) {
    const phrase = fits[pi]
    const row = available[pi]
    const col = Math.floor(Math.random() * (cols - phrase.length))
    for (let i = 0; i < phrase.length; i++) {
      g[row][col + i] = { signal: phrase[i] }
    }
  }

  return g
}

function render() {
  const el = containerRef.value
  if (!el || !grid.length) return

  const rect = el.getBoundingClientRect()
  const charW = rect.width / cols
  const charH = rect.height / rows
  const px = pointerX - rect.left
  const py = pointerY - rect.top
  const innerR = radius - softEdge

  let result = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) * charW
      const cy = (r + 0.5) * charH
      const dist = Math.sqrt((cx - px) ** 2 + (cy - py) ** 2)

      const cell = grid[r]?.[c]

      if (cell?.signal) {
        let reveal = false
        if (dist < innerR) {
          reveal = true
        } else if (dist < radius) {
          reveal = Math.random() < 1 - (dist - innerR) / softEdge
        }
        if (reveal) {
          result += `<span class="sq-signal">${escapeHtml(cell.signal)}</span>`
          continue
        }
      }

      result += randomGlyph()
    }
    if (r < rows - 1) result += '\n'
  }

  html.value = result
}

function onPointerMove(e: MouseEvent | TouchEvent) {
  if ('touches' in e) {
    pointerX = e.touches[0].clientX
    pointerY = e.touches[0].clientY
  } else {
    pointerX = e.clientX
    pointerY = e.clientY
  }
}

function onPointerLeave() {
  pointerX = -1000
  pointerY = -1000
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  if (window.innerWidth < 640) {
    cols = 32
  } else if (window.innerWidth < 1024) {
    cols = 50
  }

  // Measure character dimensions
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
    rows = Math.max(10, Math.floor(el.clientHeight / charH))
  }

  grid = buildGrid()
  render()
  intervalId = setInterval(render, 120)

  window.addEventListener('mousemove', onPointerMove)
  window.addEventListener('touchmove', onPointerMove, { passive: true })
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('touchmove', onPointerMove)
})
</script>

<template>
  <div
    ref="containerRef"
    class="font-mono text-xs leading-[1.3] text-neutral-700 select-none overflow-hidden whitespace-pre cursor-crosshair"
    role="img"
    aria-label="Interactive noise field — move your cursor to reveal hidden messages"
    @mouseleave="onPointerLeave"
    @touchend="onPointerLeave"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-signal) {
  color: var(--color-squelch);
}
</style>
