<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
  storageKey?: string
}>()

const RESOLVE_PER_VISIT = 0.12
const RESOLVE_DURATION = 25000
const TICK_MS = 120

const html = ref('')
let chars: { ch: string; isContent: boolean }[] = []
let resolved: boolean[] = []
let startTime = 0
let budget = 0
let spent = 0
let tickId: ReturnType<typeof setInterval> | null = null

const key = props.storageKey ?? 'sq-return'

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function load(): boolean[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length === chars.length) return arr
  } catch {}
  return []
}

function save() {
  try {
    localStorage.setItem(key, JSON.stringify(resolved))
  } catch {}
}

function render() {
  let result = ''
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    if (c.ch === '\n') {
      result += '\n'
    } else if (!c.isContent) {
      result += ' '
    } else if (resolved[i]) {
      result += escapeHtml(c.ch)
    } else {
      result += `<span class="sq-return sq-ch">${glyph()}</span>`
    }
  }
  html.value = result
}

function tick() {
  const elapsed = Date.now() - startTime
  const progress = Math.min(1, elapsed / RESOLVE_DURATION)
  const target = Math.floor(budget * (progress ** 1.4))

  const unresolved: number[] = []
  for (let i = 0; i < chars.length; i++) {
    if (chars[i].isContent && !resolved[i]) unresolved.push(i)
  }

  while (spent < target && unresolved.length > 0) {
    const pick = Math.floor(Math.random() * unresolved.length)
    resolved[unresolved[pick]] = true
    unresolved.splice(pick, 1)
    spent++
  }

  render()

  if (spent >= budget) {
    if (tickId) clearInterval(tickId)
    tickId = null
    save()
  }
}

onMounted(() => {
  chars = [...props.text].map(ch => ({
    ch,
    isContent: ch !== ' ' && ch !== '\n',
  }))

  const contentCount = chars.filter(c => c.isContent).length
  resolved = load()
  if (resolved.length === 0) {
    resolved = new Array(chars.length).fill(false)
  }

  const unresolvedCount = chars.filter((c, i) => c.isContent && !resolved[i]).length
  budget = Math.max(1, Math.ceil(contentCount * RESOLVE_PER_VISIT))
  budget = Math.min(budget, unresolvedCount)
  spent = 0
  startTime = Date.now()

  render()

  if (budget > 0) {
    tickId = setInterval(tick, TICK_MS)
  }
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
  save()
})
</script>

<template>
  <div
    class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap"
    role="article"
    aria-label="Text that reveals itself across visits"
    v-html="html"
  />
</template>

<style scoped>
:deep(.sq-return) {
  color: var(--color-neutral-800, #262626);
}
</style>
