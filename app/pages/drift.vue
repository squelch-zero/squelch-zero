<script setup lang="ts">
useSeoMeta({
  title: 'Drift — Squelch Zero',
  ogTitle: 'Drift — Squelch Zero',
  description: 'Independent cycles. Occasional convergence. Wait.',
  ogDescription: 'Independent cycles. Occasional convergence. Wait.',
})

// Three sentences. Each word cycles independently through alternatives.
// Index 0 is the "correct" word. When all words in a sentence land on
// index 0 simultaneously, the sentence is coherent — briefly.
//
// Convergence period = lcm of (period × word count) per slot.
// Block 1: lcm(12, 15, 20) = 60s
// Block 2: lcm(12, 15, 20, 18) = 180s
// Block 3: lcm(12, 21, 20) = 420s
// Convergence window: 3 seconds each (min period across slots).

const blocks = [
  // "meaning arrives slowly"
  [
    { words: ['meaning', 'silence', 'pattern', 'nothing'], period: 3 },
    { words: ['arrives', 'dissolves', 'surfaces'], period: 5 },
    { words: ['slowly', 'softly', 'blindly', 'always', 'gently'], period: 4 },
  ],
  // "this moment won't repeat"
  [
    { words: ['this', 'that', 'the'], period: 4 },
    { words: ['moment', 'shape', 'sound', 'rhythm', 'light'], period: 3 },
    { words: ["won't", "can't", "shouldn't", 'might'], period: 5 },
    { words: ['repeat', 'return', 'remain'], period: 6 },
  ],
  // "you were here"
  [
    { words: ['you', 'who', 'they'], period: 4 },
    { words: ['were', 'drifted', 'watched', 'vanished', 'lingered', 'floated', 'waited'], period: 3 },
    { words: ['here', 'once', 'close', 'still', 'near'], period: 4 },
  ],
]

const lines = ref<string[]>([])
const aligned = ref<boolean[]>([])

let timer: ReturnType<typeof setInterval>

function tick() {
  const t = Date.now() / 1000
  lines.value = blocks.map(block =>
    block.map(slot => slot.words[Math.floor(t / slot.period) % slot.words.length]).join(' ')
  )
  aligned.value = blocks.map(block =>
    block.every(slot => Math.floor(t / slot.period) % slot.words.length === 0)
  )
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 150)
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

    <main class="flex-1 flex flex-col justify-center gap-16">
      <ClientOnly>
        <p
          v-for="(_, i) in blocks"
          :key="i"
          class="text-lg leading-relaxed transition-colors duration-700"
          :class="aligned[i] ? 'text-neutral-200' : 'text-neutral-500'"
        >
          {{ lines[i] }}
        </p>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">wait</p>
      <p class="text-xs text-neutral-600">squelch-zero / drift</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'attention destroys what it observes' },
        { to: '/shift', label: 'shift', note: 'the same page, different every day' },
      ]"
    />
  </div>
</template>
