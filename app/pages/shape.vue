<script setup lang="ts">
useSeoMeta({
  title: 'Shape — Squelch Zero',
  ogTitle: 'Shape — Squelch Zero',
  description: 'The shapes stay. The meaning leaves.',
  ogDescription: 'The shapes stay. The meaning leaves.',
})

const text = `Every letter has a shape before it has a meaning.

You learned the shapes first. The curve of a. The crossbar of t. The closed loop of o. Recognition happens faster than reading. Your eyes trace the geometry before your mind finds the word.

This text is being replaced by its own shadow. Each character, slowly, is swapped for its nearest visual neighbor — a letter from another alphabet with the same skeleton.

The shapes stay. The meaning leaves.

What remains will look like language from a distance.`

// Shape-proximate confusables: each character mapped to its visual nearest neighbor.
// Characters without a match survive unchanged.
const confusables: Record<string, string> = {
  'a': 'α', 'b': 'ḅ', 'c': 'ϲ', 'd': 'ɗ', 'e': 'ε',
  'f': 'ƒ', 'g': 'ɡ', 'h': 'ħ', 'i': 'ı', 'k': 'κ',
  'l': 'ℓ', 'm': 'ɱ', 'n': 'η', 'o': 'ο', 'p': 'ρ',
  'r': 'ɾ', 's': 'ş', 't': 'ŧ', 'u': 'υ', 'v': 'ν',
  'w': 'ω', 'x': '×', 'y': 'γ', 'z': 'ʐ',
  'E': 'Ε', 'T': 'Τ', 'W': 'Ω', 'Y': 'Υ',
  '.': '·',
}

const chars = ref<string[]>([])
const ready = ref(false)

function shuffle(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

let timer: ReturnType<typeof setTimeout>
let startDelay: ReturnType<typeof setTimeout>

onMounted(() => {
  chars.value = [...text]
  ready.value = true

  const replaceable = shuffle(
    chars.value
      .map((ch, i) => confusables[ch] ? i : -1)
      .filter(i => i !== -1)
  )

  let pos = 0
  const total = replaceable.length

  function step() {
    if (pos >= total) return
    const idx = replaceable[pos]
    chars.value[idx] = confusables[text[idx]]
    pos++

    const progress = pos / total
    const interval = 600 - 480 * progress
    timer = setTimeout(step, interval)
  }

  startDelay = setTimeout(step, 5000)
})

onUnmounted(() => {
  clearTimeout(timer)
  clearTimeout(startDelay)
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
          role="img"
          aria-label="Text about the shapes of letters. Over two minutes, each character is quietly replaced by its nearest visual neighbor from another alphabet — Greek alpha for a, epsilon for e, eta for n. The text retains its visual rhythm but becomes unreadable. The shapes stay. The meaning leaves."
          class="transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
        >
          <p class="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap">{{ chars.join('') }}</p>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">observe</p>
      <p class="text-xs text-neutral-600">squelch-zero / shape</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/source', label: 'source', note: 'another text that consumes itself' },
        { to: '/erasure', label: 'erasure', note: 'remove the words yourself' },
      ]"
    />
  </div>
</template>
