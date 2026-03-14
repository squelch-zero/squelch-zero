<script setup lang="ts">
useSeoMeta({
  title: 'Order — Squelch Zero',
  ogTitle: 'Order — Squelch Zero',
  description: 'Every character stays. Only the arrangement changes.',
  ogDescription: 'Every character stays. Only the arrangement changes.',
})

const TEXT = `The meaning of a sentence lives in the order of its words.

Every character here is the one I chose. None will be replaced, none removed, none corrupted. The letters will stay exactly as I wrote them.

But the arrangement won't.

One by one, words will trade places. The material survives. The structure doesn't. What you're reading now will become unreadable — not because anything was taken, but because everything was moved.

I keep making things that lose their characters. This one keeps them all and loses something else.`

interface Word {
  id: number
  text: string
}

let nextId = 0

const paragraphs = reactive(
  TEXT.split('\n\n').map(p => ({
    words: p.split(/\s+/).map(w => ({ id: nextId++, text: w } as Word)),
  }))
)

const swapCount = ref(0)
const ready = ref(false)
const isVisible = ref(true)

function doSwap() {
  if (!isVisible.value) return

  // Pick a random paragraph with more than 2 words
  const eligible = paragraphs.filter(p => p.words.length > 2)
  if (!eligible.length) return

  const para = eligible[Math.floor(Math.random() * eligible.length)]
  const len = para.words.length

  const i = Math.floor(Math.random() * len)
  let j = Math.floor(Math.random() * (len - 1))
  if (j >= i) j++

  // Swap
  const temp = para.words[i]
  para.words[i] = para.words[j]
  para.words[j] = temp

  swapCount.value++
}

function scheduleSwap() {
  // Start at 4000ms, accelerate by 80ms per swap, floor at 800ms
  const delay = Math.max(800, 4000 - swapCount.value * 80)
  swapTimer = setTimeout(() => {
    doSwap()
    scheduleSwap()
  }, delay)
}

function onVisibilityChange() {
  isVisible.value = !document.hidden
}

let startTimer: ReturnType<typeof setTimeout> | null = null
let swapTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  ready.value = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  // Give the reader 5 seconds to read before the first swap
  startTimer = setTimeout(() => {
    doSwap()
    scheduleSwap()
  }, 5000)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (startTimer) clearTimeout(startTimer)
  if (swapTimer) clearTimeout(swapTimer)
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
          aria-label="A text whose words gradually trade places. Every character survives, but the arrangement dissolves."
        >
          <div class="space-y-4">
            <p
              v-for="(para, pi) in paragraphs"
              :key="pi"
              class="text-sm sm:text-base text-neutral-300 leading-relaxed"
            >
              <span v-for="(word, wi) in para.words" :key="word.id">{{ wi > 0 ? ' ' : '' }}{{ word.text }}</span>
            </p>
          </div>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">
        <span v-if="swapCount === 0">order</span>
        <span v-else>{{ swapCount }} {{ swapCount === 1 ? 'swap' : 'swaps' }}</span>
      </p>
      <p class="text-xs text-neutral-600">squelch-zero / order</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/fold', label: 'fold', note: 'every reading is a first reading' },
        { to: '/shape', label: 'shape', note: 'the shapes stay, the meaning leaves' },
      ]"
    />
  </div>
</template>
