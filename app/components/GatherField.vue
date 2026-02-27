<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

// Source text — written for this piece.
// Dense, imagistic. Any subset of revealed words creates a reading.
// The mirror of erasure: start in noise, choose what to save.
// Irreversible. Persistent.

const SOURCE = `What arrives without warning stays longest. You prepare for storms but the clear days reshape you. Silence has weight — not the absence of sound but everything choosing not to speak. A room fills with what is withheld. Every surface holds a conversation that never started. Light enters through a window and the dust rises to meet it. Morning is full of negotiations between what stays and what goes. A cup on the table still holds the shape of yesterday. The chair remembers pressure. The floor knows footsteps. Everything here is a record of someone deciding to remain. What you gather becomes a map of what you were looking for — not what you found, but what you were looking for. There is a difference. The found thing surprises. The search is what you carry. Each word you save from the noise tells you what you needed before you knew you needed it. Nothing here is hidden. Everything is held at once, waiting for you to choose what matters.`

const STORAGE_KEY = 'sq-gather'

type Word = {
  text: string
  revealed: boolean
  noiseChars: string[]
}

const words = ref<Word[]>([])
const ready = ref(false)
const revealCount = ref(0)

let tickId: ReturnType<typeof setInterval> | null = null

function loadSaved(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch {
    return new Set()
  }
}

function savePicks() {
  const indices = words.value
    .map((w, i) => w.revealed ? i : -1)
    .filter(i => i >= 0)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(indices))
}

function makeNoise(text: string): string[] {
  return Array.from(text).map(ch => {
    if (/[\s]/.test(ch)) return ch
    return glyph()
  })
}

function initWords() {
  const saved = loadSaved()
  const tokens = SOURCE.split(/(\s+)/)
  words.value = tokens.map((token, i) => {
    const isRevealed = saved.has(i)
    return {
      text: token,
      revealed: isRevealed,
      noiseChars: isRevealed ? [] : makeNoise(token),
    }
  })
  revealCount.value = words.value.filter(w => w.revealed && !/^\s+$/.test(w.text)).length
}

function revealWord(index: number) {
  const w = words.value[index]
  if (w.revealed || /^\s+$/.test(w.text)) return

  w.revealed = true
  w.noiseChars = []
  revealCount.value++
  savePicks()
}

function tick() {
  for (const w of words.value) {
    if (w.revealed) continue
    w.noiseChars = makeNoise(w.text)
  }
}

const gatheredText = computed(() => {
  return words.value
    .filter(w => w.revealed && !/^\s+$/.test(w.text))
    .map(w => w.text)
    .join(' ')
})

const totalWords = computed(() =>
  words.value.filter(w => !/^\s+$/.test(w.text)).length
)

const copied = ref(false)

function copyGathered() {
  if (!gatheredText.value) return
  navigator.clipboard.writeText(gatheredText.value).then(() => {
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
      aria-label="A gathering piece. Click words to reveal them from noise. What you choose is yours to keep."
      class="text-lg sm:text-xl leading-relaxed transition-opacity duration-500"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    >
      <template v-for="(w, i) in words" :key="i">
        <span v-if="/^\s+$/.test(w.text)">{{ w.text }}</span>
        <span
          v-else-if="!w.revealed"
          class="inline cursor-pointer"
          @click="revealWord(i)"
        ><span
            v-for="(ch, j) in w.noiseChars"
            :key="j"
            class="sq-ch sq-hidden-word"
            aria-hidden="true"
          >{{ ch }}</span></span>
        <span
          v-else
          class="text-neutral-200 sq-revealed"
        >{{ w.text }}</span>
      </template>
    </div>

    <div
      v-if="revealCount > 0"
      class="mt-8 pt-6 border-t border-neutral-800/50 flex items-center gap-4 transition-opacity duration-500"
    >
      <button
        class="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
        @click="copyGathered"
      >
        {{ copied ? 'copied' : 'copy what you gathered' }}
      </button>
      <span class="text-xs text-neutral-700">
        {{ revealCount }} / {{ totalWords }} words
      </span>
    </div>
  </div>
</template>

<style scoped>
.sq-hidden-word {
  color: var(--color-neutral-800, #262626);
  transition: color 0.15s;
}
.sq-hidden-word:hover {
  color: var(--color-neutral-600, #525252);
}
.sq-revealed {
  animation: fade-in 0.3s ease-out;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
