<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  text: string
  storageKey?: string
}>()

const RESOLVE_PER_VISIT = 0.12
const RESOLVE_DURATION = 25000
const TICK_MS = 120
const REGRESS_PER_DAY = 0.01
const GRACE_HOURS = 48

const html = ref('')
let chars: { ch: string; isContent: boolean }[] = []
let resolved: boolean[] = []
let startTime = 0
let budget = 0
let spent = 0
let tickId: ReturnType<typeof setInterval> | null = null

const key = props.storageKey ?? 'sq-return'

interface State {
  resolved: boolean[]
  lastVisit: number
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function load(): State | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    // migrate old format (plain boolean array)
    if (Array.isArray(data)) {
      if (data.length === chars.length) {
        return { resolved: data, lastVisit: Date.now() }
      }
      return null
    }
    // new format
    if (data.resolved && Array.isArray(data.resolved) && data.resolved.length === chars.length) {
      return { resolved: data.resolved, lastVisit: data.lastVisit ?? Date.now() }
    }
  } catch {}
  return null
}

function save() {
  try {
    const state: State = { resolved, lastVisit: Date.now() }
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}
}

function regress(state: State): boolean[] {
  const now = Date.now()
  const absentMs = now - state.lastVisit
  const absentHours = absentMs / (1000 * 60 * 60)

  if (absentHours <= GRACE_HOURS) return state.resolved

  const absentDays = (absentHours - GRACE_HOURS) / 24
  const contentCount = chars.filter(c => c.isContent).length
  const regressCount = Math.floor(contentCount * REGRESS_PER_DAY * absentDays)

  if (regressCount <= 0) return state.resolved

  const arr = [...state.resolved]
  const resolvedIndices: number[] = []
  for (let i = 0; i < arr.length; i++) {
    if (chars[i].isContent && arr[i]) resolvedIndices.push(i)
  }

  const toRegress = Math.min(regressCount, resolvedIndices.length)
  for (let n = 0; n < toRegress; n++) {
    const pick = Math.floor(Math.random() * resolvedIndices.length)
    arr[resolvedIndices[pick]] = false
    resolvedIndices.splice(pick, 1)
  }

  return arr
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
      result += `<span class="sq-return sq-ch" aria-hidden="true">${glyph()}</span>`
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
  const state = load()

  if (state) {
    resolved = regress(state)
  } else {
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
