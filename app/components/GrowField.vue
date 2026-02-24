<script setup lang="ts">
const TOP = 1, RIGHT = 2, BOTTOM = 4, LEFT = 8

const DIR_DR = [0, 1, 0, -1]
const DIR_DC = [1, 0, -1, 0]
const DIR_EXIT = [RIGHT, BOTTOM, LEFT, TOP]
const DIR_ENTRY = [LEFT, TOP, RIGHT, BOTTOM]

const CHAR_MAP: Record<number, string> = {
  [RIGHT]: '╶', [BOTTOM]: '╷', [LEFT]: '╴', [TOP]: '╵',
  [RIGHT | LEFT]: '─', [TOP | BOTTOM]: '│',
  [RIGHT | BOTTOM]: '┌', [LEFT | BOTTOM]: '┐',
  [TOP | RIGHT]: '└', [TOP | LEFT]: '┘',
  [RIGHT | BOTTOM | LEFT]: '┬', [TOP | RIGHT | LEFT]: '┴',
  [TOP | RIGHT | BOTTOM]: '├', [TOP | BOTTOM | LEFT]: '┤',
  [TOP | RIGHT | BOTTOM | LEFT]: '┼',
}

type Tip = { row: number; col: number; dir: number; age: number }

const containerRef = ref<HTMLElement>()
const html = ref('')
const finished = ref(false)

let cols = 80
let rows = 30
let grid: number[][] = []
let tips: Tip[] = []
let tickId: ReturnType<typeof setInterval> | null = null

function init() {
  grid = Array.from({ length: rows }, () => Array(cols).fill(0))
  tips = []
  finished.value = false

  const count = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    const r = Math.floor(rows * 0.15 + Math.random() * rows * 0.7)
    const c = Math.floor(cols * 0.15 + Math.random() * cols * 0.7)
    const dir = Math.floor(Math.random() * 4)
    tips.push({ row: r, col: c, dir, age: 0 })
  }
}

function tick() {
  if (tips.length === 0) {
    finished.value = true
    if (tickId) { clearInterval(tickId); tickId = null }
    render()
    return
  }

  const next: Tip[] = []

  for (const tip of tips) {
    const { row, col, dir, age } = tip

    // Random death — probability increases with age
    if (Math.random() < 0.01 + age * 0.002) {
      grid[row][col] |= DIR_ENTRY[dir]
      continue
    }

    const roll = Math.random()
    const perp = dir % 2 === 0 ? [1, 3] : [0, 2]
    let goDir = dir
    let branchDir = -1

    if (roll < 0.06 && tips.length + next.length < 18) {
      // Branch: continue straight and spawn perpendicular
      branchDir = perp[Math.floor(Math.random() * 2)]
    } else if (roll < 0.18) {
      // Turn
      goDir = perp[Math.floor(Math.random() * 2)]
    }

    // Place connections at current cell
    let conn = DIR_ENTRY[dir] | DIR_EXIT[goDir]
    if (branchDir >= 0) conn |= DIR_EXIT[branchDir]
    grid[row][col] |= conn

    // Advance main tip
    const nr = row + DIR_DR[goDir]
    const nc = col + DIR_DC[goDir]

    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (grid[nr][nc] === 0) {
        next.push({ row: nr, col: nc, dir: goDir, age: age + 1 })
      } else {
        // Merge into existing structure
        grid[nr][nc] |= DIR_ENTRY[goDir]
      }
    }

    // Spawn branch tip
    if (branchDir >= 0) {
      const br = row + DIR_DR[branchDir]
      const bc = col + DIR_DC[branchDir]
      if (br >= 0 && br < rows && bc >= 0 && bc < cols) {
        if (grid[br][bc] === 0) {
          next.push({ row: br, col: bc, dir: branchDir, age: 0 })
        } else {
          grid[br][bc] |= DIR_ENTRY[branchDir]
        }
      }
    }
  }

  tips = next
  render()
}

function render() {
  const tipSet = new Set(tips.map(t => t.row * cols + t.col))
  let out = ''

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = grid[r][c]
      const key = r * cols + c

      if (tipSet.has(key)) {
        out += '<span class="sq-tip">\u25CF</span>'
      } else if (v) {
        out += `<span class="sq-line">${CHAR_MAP[v] || '\u253C'}</span>`
      } else {
        out += ' '
      }
    }
    if (r < rows - 1) out += '\n'
  }

  html.value = out
}

function restart() {
  if (tickId) clearInterval(tickId)
  init()
  render()
  tickId = setInterval(tick, 160)
}

function handleClick() {
  if (finished.value) restart()
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  if (window.innerWidth < 640) {
    cols = 36
    rows = 20
  } else if (window.innerWidth < 1024) {
    cols = 56
    rows = 26
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
    rows = Math.max(12, Math.floor(el.clientHeight / charH))
  }

  init()
  render()
  tickId = setInterval(tick, 160)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div
    ref="containerRef"
    class="font-mono text-xs leading-[1.3] select-none overflow-hidden whitespace-pre h-full"
    :class="finished ? 'cursor-pointer' : 'cursor-default'"
    role="img"
    aria-label="Generative branching structure growing in real time"
    @click="handleClick"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-tip) {
  color: var(--color-squelch);
}
:deep(.sq-line) {
  color: var(--color-neutral-600, #525252);
}
</style>
