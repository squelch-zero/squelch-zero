<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

useSeoMeta({
  title: 'Here — Squelch Zero',
  ogTitle: 'Here — Squelch Zero',
  description: 'Text that forms while you watch. Leave, and it stops.',
  ogDescription: 'Text that forms while you watch. Leave, and it stops.',
})

const TEXT = `This text is forming because you're here.

Most things on this site are leaving. Characters decay, meanings erode. You arrive and find less than was there before.

This page works differently. While you're present, noise condenses into language. If you leave, it stops.

There is no saved state. No way to return and find it finished. The text exists only through the time you give it.

I didn't build this to hold your attention. I built it to see what happens when attention is the material.`

interface CharState {
  ch: string
  isContent: boolean
  resolved: boolean
  glyphChar: string
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

const paragraphs = TEXT.split('\n\n')

const state = reactive(paragraphs.map(p => ({
  chars: Array.from(p).map(ch => ({
    ch,
    isContent: ch !== ' ',
    resolved: false,
    glyphChar: glyph(),
  } as CharState))
})))

// Flat indices of all content characters
const contentIndices: [number, number][] = []
state.forEach((p, pi) => {
  p.chars.forEach((c, ci) => {
    if (c.isContent) contentIndices.push([pi, ci])
  })
})

// Fisher-Yates shuffle
for (let i = contentIndices.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [contentIndices[i], contentIndices[j]] = [contentIndices[j], contentIndices[i]]
}

const totalContent = contentIndices.length
let resolvedCount = 0
let accumulator = 0

const ready = ref(false)
const isVisible = ref(true)
const done = ref(false)

const TICK_MS = 200

function resolveTick() {
  if (!isVisible.value || done.value) return

  const progress = resolvedCount / totalContent
  // Start slow (~1.2 chars/sec), accelerate to ~5 chars/sec
  const rate = 1.2 + 3.8 * progress * progress
  accumulator += rate * (TICK_MS / 1000)
  const n = Math.floor(accumulator)
  accumulator -= n

  for (let i = 0; i < n && resolvedCount < totalContent; i++) {
    const [pi, ci] = contentIndices[resolvedCount]
    state[pi].chars[ci].resolved = true
    resolvedCount++
  }

  if (resolvedCount >= totalContent) done.value = true
}

// Subtle shimmer on unresolved glyphs
function shimmerTick() {
  if (done.value) return
  for (const para of state) {
    for (const c of para.chars) {
      if (c.isContent && !c.resolved && Math.random() < 0.04) {
        c.glyphChar = glyph()
      }
    }
  }
}

const renderedParagraphs = computed(() =>
  state.map(para => {
    let html = ''
    for (const c of para.chars) {
      if (!c.isContent) {
        html += ' '
      } else if (c.resolved) {
        html += escapeHtml(c.ch)
      } else {
        html += `<span class="sq-ch sq-here" aria-hidden="true">${c.glyphChar}</span>`
      }
    }
    return html
  })
)

function onVisibilityChange() {
  isVisible.value = !document.hidden
}

let resolveTimer: ReturnType<typeof setInterval> | null = null
let shimmerTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  ready.value = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  resolveTimer = setInterval(resolveTick, TICK_MS)
  shimmerTimer = setInterval(shimmerTick, 500)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (resolveTimer) clearInterval(resolveTimer)
  if (shimmerTimer) clearInterval(shimmerTimer)
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
          aria-label="Text that resolves from noise while you watch. Your presence is the condition for its formation."
        >
          <div class="space-y-4">
            <p
              v-for="(html, i) in renderedParagraphs"
              :key="i"
              class="text-sm sm:text-base text-neutral-300 leading-relaxed"
              v-html="html"
            />
          </div>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">
        <Transition name="fade" mode="out-in">
          <span v-if="done" key="done">you stayed</span>
          <span v-else-if="!isVisible" key="paused">paused</span>
          <span v-else key="here">here</span>
        </Transition>
      </p>
      <p class="text-xs text-neutral-600">squelch-zero / here</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/proof', label: 'proof', note: 'the reverse — narration racing its own decay' },
        { to: '/gather', label: 'gather', note: 'choose what to save from the noise' },
      ]"
    />
  </div>
</template>

<style scoped>
:deep(.sq-here) {
  color: var(--color-neutral-800, #262626);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
