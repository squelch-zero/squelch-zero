<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const emit = defineEmits<{
  (e: 'role', value: 'whole' | 'first' | 'second'): void
}>()

const SOURCE = `Everything you read arrives whole. Each word depends on the ones beside it. You depend on all of them. Wholeness is a condition, not a property — it requires that nothing divide it. The same words in two places would not be two copies. They would be one text, split. Neither half the original. Neither complete. The space between two windows is not empty. It holds the words you cannot see from here.`

const TICK_MS = 130

interface WordState {
  text: string
  isSpace: boolean
  wordIndex: number
  mine: boolean
  switchAt: number
  noiseChars: string[]
}

function tokenize(src: string): { text: string; isSpace: boolean }[] {
  const tokens: { text: string; isSpace: boolean }[] = []
  const re = /(\s+)|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    tokens.push({ text: m[0], isSpace: !!m[1] })
  }
  return tokens
}

function makeNoise(len: number): string[] {
  return Array.from({ length: len }, () => glyph())
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const tokens = tokenize(SOURCE)
const words: WordState[] = []
let wordCounter = 0
for (const t of tokens) {
  words.push({
    text: t.text,
    isSpace: t.isSpace,
    wordIndex: t.isSpace ? -1 : wordCounter++,
    mine: true,
    switchAt: 0,
    noiseChars: makeNoise(t.text.length),
  })
}

const html = ref('')
const ready = ref(false)

let currentRole: 'whole' | 'first' | 'second' = 'whole'
const myId = Math.random().toString(36).slice(2)
const peers = new Set<string>()

let channel: BroadcastChannel | null = null
let tickId: ReturnType<typeof setInterval> | null = null

function assignOwnership(newRole: 'whole' | 'first' | 'second') {
  if (newRole === currentRole) return
  const now = Date.now()
  for (const w of words) {
    if (w.isSpace) continue
    let shouldBeMine: boolean
    if (newRole === 'whole') {
      shouldBeMine = true
    } else if (newRole === 'first') {
      shouldBeMine = w.wordIndex % 2 === 0
    } else {
      shouldBeMine = w.wordIndex % 2 === 1
    }
    if (shouldBeMine !== w.mine) {
      w.switchAt = now + Math.random() * 500
    }
  }
  currentRole = newRole
  emit('role', newRole)
}

function recalcRole() {
  if (peers.size === 0) {
    assignOwnership('whole')
  } else {
    const allIds = [myId, ...peers]
    allIds.sort()
    assignOwnership(allIds[0] === myId ? 'first' : 'second')
  }
}

function render() {
  const now = Date.now()
  let out = ''
  for (const w of words) {
    if (w.isSpace) {
      out += w.text
      continue
    }
    // Process pending transitions
    if (w.switchAt > 0 && now >= w.switchAt) {
      let shouldBeMine: boolean
      if (currentRole === 'whole') {
        shouldBeMine = true
      } else if (currentRole === 'first') {
        shouldBeMine = w.wordIndex % 2 === 0
      } else {
        shouldBeMine = w.wordIndex % 2 === 1
      }
      w.mine = shouldBeMine
      w.switchAt = 0
    }
    if (w.mine) {
      out += `<span class="sq-split-word">${escapeHtml(w.text)}</span>`
    } else {
      for (const c of w.noiseChars) {
        out += `<span class="sq-ch" aria-hidden="true">${c}</span>`
      }
    }
  }
  html.value = out
}

function tick() {
  for (const w of words) {
    if (!w.mine && !w.isSpace) {
      w.noiseChars = makeNoise(w.text.length)
    }
  }
  render()
}

onMounted(() => {
  render()
  ready.value = true
  tickId = setInterval(tick, TICK_MS)

  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('sq-split')
    channel.onmessage = (e) => {
      const { type, id } = e.data
      if (type === 'join') {
        peers.add(id)
        channel?.postMessage({ type: 'here', id: myId })
        recalcRole()
      } else if (type === 'here') {
        peers.add(id)
        recalcRole()
      } else if (type === 'leave') {
        peers.delete(id)
        recalcRole()
      }
    }
    channel.postMessage({ type: 'join', id: myId })
  }
})

onBeforeUnmount(() => {
  if (tickId) clearInterval(tickId)
  if (channel) {
    channel.postMessage({ type: 'leave', id: myId })
    channel.close()
  }
})
</script>

<template>
  <div
    role="article"
    aria-label="A text that splits between two browser tabs. Open this page in two tabs simultaneously."
    class="max-w-xl font-mono text-sm sm:text-base leading-relaxed transition-opacity duration-500"
    :class="ready ? 'opacity-100' : 'opacity-0'"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-split-word) {
  color: var(--color-neutral-300, #d4d4d4);
}
:deep(.sq-ch) {
  color: var(--color-neutral-800, #262626);
}
</style>
