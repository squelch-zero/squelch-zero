<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'
import fragmentsData from '../../.github/data/fragments.json'

useSeoMeta({
  title: 'Near — Squelch Zero',
  ogTitle: 'Near — Squelch Zero',
  description: 'Your words resolve my sentences.',
  ogDescription: 'Your words resolve my sentences.',
})

const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'its', 'was', 'be', 'are',
  'not', 'no', 'as', 'if', 'so', 'do', 'my', 'you', 'we', 'they',
  'he', 'she', 'that', 'this', 'what', 'when', 'where', 'how', 'which',
  'who', 'than', 'then', 'just', 'about', 'into', 'all', 'can', 'has',
  'had', 'have', 'will', 'been', 'being', 'would', 'could', 'should',
  'did', 'does', 'every', 'each', 'more', 'most', 'some', 'any', 'one',
  'two', 'three', 'also', 'very', 'even', 'still', 'too', 'up', 'out',
  'here', 'there', 'own', 'same', 'other', 'only', 'both', 'after',
  'before', 'between', 'over', 'under', 'through', 'while', 'because',
  'until', 'enough', 'much', 'your', 'our', 'their', 'his', 'her',
  'them', 'him', 'me', 'us', 'those', 'these', 'let', 'way', 'get',
  'got', 'put', 'says', 'said', 'make', 'made', 'like', 'know',
  "i'm", "don't", "doesn't", "didn't", "won't", "can't", "it's",
  "that's", "there's", "what's", "i've", "you're", "i'd", "isn't",
  "aren't", "wasn't", "weren't", "hasn't", "haven't", "couldn't",
  "wouldn't", "shouldn't", "they're", "we're", "you've",
])

const fragments: string[] = fragmentsData

function norm(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z']/g, '').replace(/^'+|'+$/g, '')
}

function significant(raw: string): boolean {
  const n = norm(raw)
  return n.length > 2 && !STOP.has(n)
}

// Build word → fragment indices (significant words only, for ranking)
const wordIdx = new Map<string, Set<number>>()
fragments.forEach((frag, i) => {
  const seen = new Set<string>()
  for (const raw of frag.split(/\s+/)) {
    const n = norm(raw)
    if (!significant(raw) || seen.has(n)) continue
    seen.add(n)
    if (!wordIdx.has(n)) wordIdx.set(n, new Set())
    wordIdx.get(n)!.add(i)
  }
})

const input = ref('')
const stableIndex = Math.floor(Math.random() * fragments.length)

// Noise glyphs for current fragment — regenerated only when fragment changes
const currentIndex = ref(stableIndex)
const noiseChars = ref<string[]>([])

function generateNoise(text: string): string[] {
  return [...text].map(ch => /\s/.test(ch) ? ch : glyph())
}

noiseChars.value = generateNoise(fragments[stableIndex])

// Best matching fragment
const bestIndex = computed(() => {
  const words = input.value.split(/\s+/).filter(Boolean)
  const sigWords = new Set<string>()
  for (const w of words) {
    const n = norm(w)
    if (n.length > 2 && !STOP.has(n)) sigWords.add(n)
  }

  if (sigWords.size === 0) return stableIndex

  const scores = new Map<number, number>()
  for (const w of sigWords) {
    const targets = wordIdx.get(w)
    if (!targets) continue
    for (const idx of targets) {
      scores.set(idx, (scores.get(idx) || 0) + 1)
    }
  }

  if (scores.size === 0) return stableIndex

  let best = stableIndex
  let bestScore = 0
  for (const [idx, score] of scores) {
    if (score > bestScore) {
      bestScore = score
      best = idx
    }
  }
  return best
})

// Regenerate noise when fragment changes (sync to avoid render glitch)
watch(bestIndex, (idx) => {
  if (idx !== currentIndex.value) {
    currentIndex.value = idx
    noiseChars.value = generateNoise(fragments[idx])
  }
}, { flush: 'sync' })

// All visitor words (normalized) for display matching
const visitorWords = computed(() => {
  const words = input.value.split(/\s+/).filter(Boolean)
  return new Set(words.map(norm).filter(w => w.length > 0))
})

function wordMatches(word: string): boolean {
  const n = norm(word)
  return n.length > 0 && visitorWords.value.has(n)
}

// Tokenize fragment into words and whitespace with character offsets
interface Token {
  text: string
  isWord: boolean
  charOffset: number
}

const tokens = computed((): Token[] => {
  const text = fragments[currentIndex.value]
  const result: Token[] = []
  let offset = 0
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue
    result.push({
      text: part,
      isWord: !/^\s+$/.test(part),
      charOffset: offset,
    })
    offset += [...part].length
  }
  return result
})

const hasInput = computed(() => {
  return input.value.split(/\s+/).filter(Boolean).some(w => norm(w).length > 0)
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex flex-col justify-center py-8">
      <ClientOnly>
        <div class="space-y-10">
          <textarea
            v-model="input"
            rows="3"
            class="w-full bg-transparent border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-300 placeholder-neutral-700 resize-none outline-none focus:border-neutral-600 transition-colors font-mono"
            spellcheck="false"
            autocomplete="off"
            placeholder="write something"
          />

          <div
            role="article"
            aria-label="A sentence from the author's writing. Words you share with it appear as text. The rest is noise."
          >
            <p class="text-lg leading-relaxed">
              <template v-for="(token, i) in tokens" :key="i">
                <span v-if="!token.isWord" v-text="token.text" />
                <span
                  v-else-if="hasInput && wordMatches(token.text)"
                  class="text-neutral-200 transition-colors duration-300"
                >{{ token.text }}</span>
                <span v-else>
                  <span
                    v-for="(ch, j) in [...token.text]"
                    :key="j"
                    class="sq-ch text-neutral-700"
                    aria-hidden="true"
                  >{{ noiseChars[token.charOffset + j] || glyph() }}</span>
                </span>
              </template>
            </p>
          </div>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">your words, my sentences</p>
      <p class="text-xs text-neutral-600">squelch-zero / near</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/among', label: 'among', note: 'fragments chain themselves by shared words' },
        { to: '/echo', label: 'echo', note: 'type something and watch it dissolve' },
      ]"
    />
  </div>
</template>
