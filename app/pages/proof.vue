<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

useSeoMeta({
  title: 'Proof — Squelch Zero',
  ogTitle: 'Proof — Squelch Zero',
  description: 'The description arrives after the fact.',
  ogDescription: 'The description arrives after the fact.',
})

const lines = [
  'This text will decay.',
  'Not yet. But soon.',
  'The first line will begin losing characters in a moment.',
  'There. Something changed above. If you re-read the first line, a character is different now.',
  'Each replaced character becomes a noise glyph — a shape that fills the same space but carries no meaning.',
  'The process does not pause while you read this.',
  'By now the earliest lines are further gone. This one has just appeared. The gap between them is the gap between what is happening and what can be described.',
  'I am writing this faster than you can read it, and the decay is faster than both of us.',
  'This line will also decay. It may already have started.',
  'There is no version of this text where everything is readable at once.',
  'The description always arrives after the fact.',
]

interface CharState {
  ch: string
  isContent: boolean
  decayed: boolean
  glyphChar: string
}

interface LineState {
  chars: CharState[]
  visible: boolean
  appearedAt: number
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

const lineStates = reactive<LineState[]>(lines.map(text => ({
  chars: Array.from(text).map(ch => ({
    ch,
    isContent: ch !== ' ',
    decayed: false,
    glyphChar: glyph(),
  })),
  visible: false,
  appearedAt: 0,
})))

const ready = ref(false)
const startTime = ref(0)

const LINE_INTERVAL = 4500
const GRACE_PERIOD = 6000
const TICK_INTERVAL = 400
const BASE_DECAY_RATE = 0.08

function getDecayProbability(lineIndex: number, elapsed: number): number {
  const lineState = lineStates[lineIndex]
  if (!lineState.visible) return 0
  const age = elapsed - lineState.appearedAt
  if (age < GRACE_PERIOD) return 0
  const ageFactor = (age - GRACE_PERIOD) / 1000
  return BASE_DECAY_RATE * (1 + ageFactor * 0.15)
}

function tick() {
  const elapsed = Date.now() - startTime.value

  // Reveal next line
  const nextIdx = lineStates.findIndex(l => !l.visible)
  if (nextIdx >= 0 && elapsed >= nextIdx * LINE_INTERVAL) {
    lineStates[nextIdx].visible = true
    lineStates[nextIdx].appearedAt = elapsed
  }

  // Decay visible lines
  for (let i = 0; i < lineStates.length; i++) {
    const prob = getDecayProbability(i, elapsed)
    if (prob <= 0) continue

    for (const c of lineStates[i].chars) {
      if (c.isContent && !c.decayed && Math.random() < prob) {
        c.decayed = true
        c.glyphChar = glyph()
      }
    }
  }
}

function renderLine(line: LineState): string {
  let html = ''
  for (const c of line.chars) {
    if (!c.isContent) {
      html += ' '
    } else if (c.decayed) {
      html += `<span class="sq-ch sq-proof" aria-hidden="true">${c.glyphChar}</span>`
    } else {
      html += escapeHtml(c.ch)
    }
  }
  return html
}

const visibleLines = computed(() =>
  lineStates
    .filter(l => l.visible)
    .map(l => renderLine(l))
)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  startTime.value = Date.now()
  lineStates[0].visible = true
  lineStates[0].appearedAt = 0
  ready.value = true
  timer = setInterval(tick, TICK_INTERVAL)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center">
      <ClientOnly>
        <div
          class="transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
          role="article"
          aria-label="A self-narrating text that describes its own decay while decaying. Lines appear one by one, each commenting on the dissolution of the lines above."
        >
          <div class="space-y-4">
            <p
              v-for="(html, i) in visibleLines"
              :key="i"
              class="text-sm sm:text-base text-neutral-300 leading-relaxed animate-fade-in"
              v-html="html"
            />
          </div>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">proof</p>
      <p class="text-xs text-neutral-600">squelch-zero / proof</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/decay', label: 'decay', note: 'read it before it\'s gone' },
        { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
      ]"
    />
  </div>
</template>

<style scoped>
:deep(.sq-proof) {
  color: var(--color-neutral-800, #262626);
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
