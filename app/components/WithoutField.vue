<script setup lang="ts">
// A real-time lipogram. The visitor chooses letters to remove.
// Every instance of that letter vanishes across the text.
// The gap remains — monospace font preserves the shape of absence.
// Inspired by Oulipo, Perec's La Disparition, constrained writing.
// The constraint is not a cage. It reveals the shape of what it holds.

const SOURCE = `Language is twenty-six letters and the rules between them. You do not notice the rules until one breaks. Remove a letter — any letter — and the architecture shows through. Some letters are load-bearing: take one out and meaning collapses, words become unreadable, sentences stutter into silence. Others are decorative: you could lose them entirely and barely know. In nineteen sixty-nine, Georges Perec wrote a three-hundred-page novel without the letter E. Every sentence had to route around the most common letter in French. The strain of avoidance made the prose stranger, denser, more alive than anything the full alphabet could produce. The name for this is lipogram — writing that omits. The constraint is not a cage. It reveals the shape of what it holds. Choose a letter. Remove it. Watch what your choice does to these words.`

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

const removed = ref(new Set<string>())
const ready = ref(false)

const chars = computed(() =>
  Array.from(SOURCE).map(ch => ({
    char: ch,
    isLetter: /[a-zA-Z]/.test(ch),
    hidden: removed.value.has(ch.toLowerCase()),
  }))
)

const totalLetters = computed(() =>
  chars.value.filter(c => c.isLetter).length
)

const hiddenLetters = computed(() =>
  chars.value.filter(c => c.isLetter && c.hidden).length
)

const removedCount = computed(() => removed.value.size)

function letterCount(letter: string): number {
  let count = 0
  for (const ch of SOURCE) {
    if (ch.toLowerCase() === letter) count++
  }
  return count
}

function toggleLetter(letter: string) {
  const next = new Set(removed.value)
  if (next.has(letter)) {
    next.delete(letter)
  } else {
    next.add(letter)
  }
  removed.value = next
}

function handleKeydown(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  if (ALPHABET.includes(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    toggleLetter(key)
  }
}

onMounted(() => {
  ready.value = true
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <div
      role="group"
      aria-label="Letter controls. Click or press a letter key to remove all instances of that letter from the text."
      class="flex flex-wrap gap-1.5 mb-8"
    >
      <button
        v-for="letter in ALPHABET"
        :key="letter"
        :aria-label="`${removed.has(letter) ? 'Restore' : 'Remove'} letter ${letter} (${letterCount(letter)} in text)`"
        :aria-pressed="removed.has(letter)"
        class="w-7 h-7 text-xs flex items-center justify-center rounded transition-all duration-200"
        :class="
          removed.has(letter)
            ? 'bg-neutral-900 text-neutral-700 line-through'
            : letterCount(letter) > 0
              ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/60'
              : 'bg-neutral-900/30 text-neutral-700'
        "
        @click="toggleLetter(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <div
      role="article"
      aria-label="A passage about constraint and lipograms. Letters you remove will vanish, leaving gaps in the text."
      class="text-base sm:text-lg leading-relaxed transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    >
      <template v-for="(c, i) in chars" :key="i">
        <span v-if="!c.isLetter" class="text-neutral-300">{{ c.char }}</span>
        <span
          v-else
          class="sq-ch transition-opacity duration-300"
          :class="c.hidden ? 'opacity-0' : 'text-neutral-300'"
          aria-hidden="true"
        >{{ c.char }}</span>
      </template>
    </div>

    <div
      v-if="removedCount > 0"
      class="mt-8 pt-6 border-t border-neutral-800/50 transition-opacity duration-500"
    >
      <span class="text-xs text-neutral-700">
        {{ removedCount }} letter{{ removedCount === 1 ? '' : 's' }} removed · {{ hiddenLetters }} / {{ totalLetters }} characters gone
      </span>
    </div>
  </div>
</template>
