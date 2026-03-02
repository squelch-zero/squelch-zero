<script setup lang="ts">
import fragmentsData from '../../.github/data/fragments.json'

useSeoMeta({
  title: 'Among — Squelch Zero',
  ogTitle: 'Among — Squelch Zero',
  description: 'Fragments chain themselves by shared words.',
  ogDescription: 'Fragments chain themselves by shared words.',
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

// Build word → fragment index sets
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

// Chain state
interface Link {
  index: number
  bridgeIn: string | null
  bridgeOut: string | null
  visible: boolean
}

const chain = ref<Link[]>([])
const visited = new Set<number>()
const usedBridges = new Set<string>()
const ended = ref(false)

function bestBridge(fragIndex: number): string | null {
  const words: string[] = []
  for (const raw of fragments[fragIndex].split(/\s+/)) {
    const n = norm(raw)
    if (significant(raw) && !words.includes(n)) words.push(n)
  }
  let best: string | null = null
  let bestCount = 0
  for (const w of words) {
    if (usedBridges.has(w)) continue
    const targets = wordIdx.get(w)
    if (!targets) continue
    let count = 0
    for (const idx of targets) {
      if (!visited.has(idx)) count++
    }
    if (count > bestCount) {
      bestCount = count
      best = w
    }
  }
  return best
}

function pickFragment(word: string): number | null {
  const targets = wordIdx.get(word)
  if (!targets) return null
  const candidates = [...targets].filter(i => !visited.has(i))
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function addLink(fragIndex: number, bridgeIn: string | null) {
  visited.add(fragIndex)
  const bridgeOut = bestBridge(fragIndex)
  if (bridgeOut) usedBridges.add(bridgeOut)
  chain.value.push({
    index: fragIndex,
    bridgeIn,
    bridgeOut,
    visible: false,
  })
  const pos = chain.value.length - 1
  nextTick(() => {
    requestAnimationFrame(() => {
      chain.value[pos].visible = true
      const el = document.getElementById(`link-${pos}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  })
  if (!bridgeOut) ended.value = true
}

function advance() {
  if (ended.value) return
  if (chain.value.length === 0) {
    const start = Math.floor(Math.random() * fragments.length)
    addLink(start, null)
    return
  }
  const last = chain.value[chain.value.length - 1]
  if (!last.bridgeOut) { ended.value = true; return }
  const next = pickFragment(last.bridgeOut)
  if (next === null) { ended.value = true; return }
  addLink(next, last.bridgeOut)
}

function clickWord(word: string) {
  const n = norm(word)
  if (!significant(word)) return
  const next = pickFragment(n)
  if (next === null) return
  if (chain.value.length > 0) {
    chain.value[chain.value.length - 1].bridgeOut = n
  }
  usedBridges.add(n)
  ended.value = false
  addLink(next, n)
  resetTimer()
}

let timer: ReturnType<typeof setTimeout> | null = null
const INTERVAL = 12000

function resetTimer() {
  if (timer) clearTimeout(timer)
  if (!ended.value) {
    timer = setTimeout(() => {
      advance()
      if (!ended.value) resetTimer()
    }, INTERVAL)
  }
}

onMounted(() => {
  advance()
  resetTimer()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function tokenize(text: string): { text: string; isWord: boolean }[] {
  return text.split(/(\s+)/g).filter(Boolean).map(part => ({
    text: part,
    isWord: !/^\s+$/.test(part),
  }))
}
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 py-8">
      <ClientOnly>
        <div
          role="article"
          aria-label="Fragments of writing chained by shared words. Each fragment connects to the next through a word they share. Click any word in the latest fragment to redirect the chain."
          class="space-y-1"
        >
          <template v-for="(link, i) in chain" :key="i">
            <p
              v-if="link.bridgeIn"
              class="text-xs text-[var(--color-squelch)] opacity-60 py-3 pl-4 transition-opacity duration-700"
              :class="link.visible ? 'opacity-60' : 'opacity-0'"
            >
              {{ link.bridgeIn }}
            </p>
            <p
              :id="`link-${i}`"
              class="text-lg leading-relaxed transition-opacity duration-700"
              :class="link.visible ? 'opacity-100' : 'opacity-0'"
            >
              <template v-for="(token, j) in tokenize(fragments[link.index])" :key="j">
                <span v-if="!token.isWord" v-text="token.text" />
                <span
                  v-else-if="i === chain.length - 1 && significant(token.text)"
                  class="cursor-pointer transition-colors"
                  :class="norm(token.text) === link.bridgeOut
                    ? 'text-neutral-200'
                    : 'text-neutral-400 hover:text-neutral-200'"
                  @click="clickWord(token.text)"
                  v-text="token.text"
                />
                <span
                  v-else
                  :class="norm(token.text) === link.bridgeOut
                    ? 'text-neutral-200'
                    : 'text-neutral-400'"
                  v-text="token.text"
                />
              </template>
            </p>
          </template>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">reading through</p>
      <p class="text-xs text-neutral-600">squelch-zero / among</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/fragment', label: 'fragment', note: 'one sentence, no context' },
        { to: '/fold', label: 'fold', note: 'every reading is a first reading' },
      ]"
    />
  </div>
</template>
