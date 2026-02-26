<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

// Source text — written for this piece.
// Dense enough to contain many possible poems.
// The visitor erases words into noise glyphs.
// What remains is theirs.

const SOURCE = `Every word carries more than its meaning. Inside each sentence, smaller sentences wait, patient as seeds in concrete. You learn this by subtraction — by taking away until what remains surprises you. A text is not a line from beginning to end. It is a field. Walk through it in any direction and you cross paths you never laid down. The noise between words is also language, only quieter. When you erase, you are not destroying. You are listening for what was always underneath, the poem the prose did not know it was carrying. Silence is not the absence of language but its other shape. Your hand hovering over a word — that hesitation is the poem already beginning. Not every word deserves to survive your attention. Choose. What you keep will be what you meant all along, even though you are only finding it now. The page does not care what you take. It holds what you leave.`

type Word = {
  text: string
  erased: boolean
  noiseChars: string[]
}

const words = ref<Word[]>([])
const ready = ref(false)
const eraseCount = ref(0)

let tickId: ReturnType<typeof setInterval> | null = null

function initWords() {
  words.value = SOURCE.split(/(\s+)/).map(token => ({
    text: token,
    erased: false,
    noiseChars: [],
  }))
}

function eraseWord(index: number) {
  const w = words.value[index]
  if (w.erased || /^\s+$/.test(w.text)) return

  // Convert each character to a noise glyph
  w.noiseChars = Array.from(w.text).map(ch => {
    // Preserve punctuation attached to words (em dash, comma, period)
    if (/[\s]/.test(ch)) return ch
    return glyph()
  })
  w.erased = true
  eraseCount.value++
}

function tick() {
  // Continuously refresh noise glyphs so erased words shimmer
  for (const w of words.value) {
    if (!w.erased) continue
    w.noiseChars = Array.from(w.text).map(ch => {
      if (/[\s]/.test(ch)) return ch
      return glyph()
    })
  }
}

const remainingText = computed(() => {
  return words.value
    .filter(w => !w.erased && !/^\s+$/.test(w.text))
    .map(w => w.text)
    .join(' ')
})

const totalWords = computed(() =>
  words.value.filter(w => !/^\s+$/.test(w.text)).length
)

const copied = ref(false)

function copyPoem() {
  if (!remainingText.value) return
  navigator.clipboard.writeText(remainingText.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

onMounted(() => {
  initWords()
  ready.value = true
  tickId = setInterval(tick, 120)
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div>
    <div
      role="article"
      aria-label="An erasure piece. Click any word to transform it into noise. What remains is your poem."
      class="text-lg sm:text-xl leading-relaxed transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    >
      <template v-for="(w, i) in words" :key="i">
        <span v-if="/^\s+$/.test(w.text)">{{ w.text }}</span>
        <span
          v-else-if="w.erased"
          class="inline"
        ><span
            v-for="(ch, j) in w.noiseChars"
            :key="j"
            class="sq-ch sq-noise"
            aria-hidden="true"
          >{{ ch }}</span></span>
        <span
          v-else
          class="cursor-pointer text-neutral-300 hover:text-neutral-100 transition-colors rounded-sm"
          :class="eraseCount > 0 ? '' : 'hover:bg-neutral-800/50'"
          @click="eraseWord(i)"
        >{{ w.text }}</span>
      </template>
    </div>

    <div
      v-if="eraseCount > 0"
      class="mt-8 pt-6 border-t border-neutral-800/50 flex items-center gap-4 transition-opacity duration-500"
    >
      <button
        class="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
        @click="copyPoem"
      >
        {{ copied ? 'copied' : 'copy what remains' }}
      </button>
      <span class="text-xs text-neutral-700">
        {{ totalWords - eraseCount }} / {{ totalWords }} words
      </span>
    </div>
  </div>
</template>

<style scoped>
.sq-noise {
  color: var(--color-neutral-800, #262626);
}
</style>
