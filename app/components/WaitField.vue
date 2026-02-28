<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

// Text that resolves over five minutes of sustained presence.
// No interaction. No click, no scroll, no cursor.
// Just staying. The only input is time willingly spent.
// If you leave for more than thirty seconds, it resets.

const SOURCE = `What you are reading was here the whole time.

Nothing you did made it appear except staying. No click. No scroll. No performance of attention. Just minutes of remaining on a page that looked like nothing.

Everything else you see today will ask for less.`

const DURATION = 300 // seconds — five minutes
const RESET_THRESHOLD = 30_000 // ms — leave for 30s and it resets

type Char = {
  ch: string
  threshold: number
  isContent: boolean
}

const html = ref('')
const progress = ref(0)
const ready = ref(false)
const complete = ref(false)

let chars: Char[] = []
let elapsed = 0
let lastTick = 0
let hiddenAt = 0
let tickId: ReturnType<typeof setInterval> | null = null

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function render() {
  const p = Math.min(1, elapsed / DURATION)
  progress.value = p
  complete.value = p >= 1

  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') {
      result += '\n'
      continue
    }
    if (!c.isContent) {
      result += ' '
      continue
    }

    if (c.threshold < p) {
      result += `<span class="sq-signal">${escapeHtml(c.ch)}</span>`
    } else {
      result += `<span class="sq-ch sq-wait" aria-hidden="true">${glyph()}</span>`
    }
  }
  html.value = result
}

function tick() {
  if (document.hidden) return

  const now = Date.now()
  const dt = (now - lastTick) / 1000
  lastTick = now

  if (elapsed < DURATION) {
    elapsed = Math.min(DURATION, elapsed + dt)
    render()
  }
}

function onVisibilityChange() {
  if (document.hidden) {
    hiddenAt = Date.now()
  } else {
    const gone = Date.now() - hiddenAt
    if (gone > RESET_THRESHOLD) {
      elapsed = 0
    }
    lastTick = Date.now()
    render()
  }
}

onMounted(() => {
  chars = [...SOURCE].map(ch => ({
    ch,
    threshold: Math.random(),
    isContent: ch !== ' ' && ch !== '\n',
  }))

  lastTick = Date.now()
  render()
  ready.value = true
  tickId = setInterval(tick, 200)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

const minutes = computed(() => Math.floor(elapsed / 60))
const seconds = computed(() => Math.floor(elapsed % 60))
const timeDisplay = computed(() => {
  const m = minutes.value
  const s = seconds.value
  return `${m}:${s.toString().padStart(2, '0')}`
})
</script>

<template>
  <div>
    <div
      class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
      role="article"
      aria-label="Text that reveals itself over five minutes of sustained presence"
      v-html="html"
    />
    <div
      class="mt-8 pt-4 border-t border-neutral-800/30 transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    >
      <span class="text-xs text-neutral-700">
        {{ timeDisplay }} / 5:00
      </span>
    </div>
  </div>
</template>

<style scoped>
:deep(.sq-wait) {
  color: var(--color-neutral-800, #262626);
}
:deep(.sq-signal) {
  color: var(--color-neutral-300, #d4d4d4);
}
</style>
