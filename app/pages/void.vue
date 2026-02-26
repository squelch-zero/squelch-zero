<script setup lang="ts">
useSeoMeta({
  title: 'Void — Squelch Zero',
  ogTitle: 'Void — Squelch Zero',
  description: 'One word, repeated. One gap. Watch where it goes.',
  ogDescription: 'One word, repeated. One gap. Watch where it goes.',
})

// A grid of the word "still" repeated. One cell is empty — the void.
// The void drifts slowly through the grid, moving to adjacent cells.
// Where it passes, the word returns dimmer. Over time, absence
// leaves its trace on everything it touches.
//
// After studying concrete poetry — Gomringer's Silencio especially —
// this is my response: the repeated word, the structural void,
// but with temporality that print can't have.

const COLS = 8
const ROWS = 8
const WORD = 'still'
const STEP_MS = 1500
const DIM_AMOUNT = 0.07
const MIN_OPACITY = 0.12

const cells = ref<{ opacity: number }[]>([])
const voidPos = ref(-1)
const ready = ref(false)

function neighbors(idx: number): number[] {
  const r = Math.floor(idx / COLS)
  const c = idx % COLS
  const n: number[] = []
  if (r > 0) n.push((r - 1) * COLS + c)
  if (r < ROWS - 1) n.push((r + 1) * COLS + c)
  if (c > 0) n.push(r * COLS + c - 1)
  if (c < COLS - 1) n.push(r * COLS + c + 1)
  return n
}

function step() {
  const old = voidPos.value
  const adj = neighbors(old)
  const next = adj[Math.floor(Math.random() * adj.length)]

  // Word returns to old position, but dimmer
  cells.value[old].opacity = Math.max(MIN_OPACITY, cells.value[old].opacity - DIM_AMOUNT)

  // Void moves
  voidPos.value = next
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  cells.value = Array.from({ length: COLS * ROWS }, () => ({ opacity: 1 }))
  voidPos.value = Math.floor(Math.random() * COLS * ROWS)
  ready.value = true
  timer = setInterval(step, STEP_MS)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center justify-center">
      <ClientOnly>
        <div
          role="img"
          :aria-label="`A grid of the word 'still' repeated sixty-four times. One position is empty. The empty position drifts slowly, dimming each word it passes.`"
          class="grid select-none transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
          :style="{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '0.25rem 0.5rem' }"
        >
          <span
            v-for="(cell, i) in cells"
            :key="i"
            class="text-center text-sm sm:text-base transition-opacity duration-700"
            :style="{ opacity: i === voidPos ? 0 : cell.opacity }"
            :class="i === voidPos ? '' : 'text-neutral-300'"
            aria-hidden="true"
          >
            {{ WORD }}
          </span>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">watch</p>
      <p class="text-xs text-neutral-600">squelch-zero / void</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/drift', label: 'drift', note: 'independent cycles, occasional convergence' },
        { to: '/absence', label: 'absence', note: 'attention destroys what it observes' },
      ]"
    />
  </div>
</template>
