<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const LINES = [
  { piece: 'signal', text: 'The static was not random.' },
  { piece: 'threshold', text: 'Distance changed what you could see.' },
  { piece: 'decay', text: 'Things left before you finished looking.' },
  { piece: 'grow', text: 'Something grew without being planted.' },
  { piece: 'echo', text: 'Your words returned as someone else\u2019s.' },
  { piece: 'tide', text: 'The hour changed what was legible.' },
  { piece: 'absence', text: 'Looking had a cost you didn\u2019t expect.' },
  { piece: 'shift', text: 'The same sentence meant something different today.' },
  { piece: 'return', text: 'The walls remembered what you left.' },
  { piece: 'interference', text: 'Two things occupied the same space \u2014 both true.' },
  { piece: 'resonance', text: 'Sound and text were never separate.' },
  { piece: 'room', text: 'There were rooms. You moved through them.' },
  { piece: 'drift', text: 'Words drifted without you, finding their own time.' },
  { piece: 'path', text: 'The address was part of the work.' },
  { piece: 'void', text: 'One word was enough if you stayed.' },
  { piece: 'erasure', text: 'What you removed was the poem.' },
  { piece: 'gather', text: 'What you saved was the question.' },
]

type LineData = {
  piece: string
  text: string
  resolved: boolean
  html: string
}

function noiseHtml(text: string): string {
  return [...text]
    .map(ch => ch === ' '
      ? ' '
      : `<span class="sq-ch sq-thread" aria-hidden="true">${glyph()}</span>`)
    .join('')
}

const lineData = ref<LineData[]>(
  LINES.map(l => ({
    piece: l.piece,
    text: l.text,
    resolved: false,
    html: noiseHtml(l.text),
  })),
)

const showClosing = ref(false)

let tickId: ReturnType<typeof setInterval> | null = null

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem('sq-visited')
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return new Set(arr as string[])
  } catch {}
  return new Set()
}

function tick() {
  for (const line of lineData.value) {
    if (!line.resolved) {
      line.html = noiseHtml(line.text)
    }
  }
}

onMounted(() => {
  const visited = loadVisited()

  tickId = setInterval(tick, 120)

  const toReveal = lineData.value.filter(l => visited.has(l.piece))
  toReveal.forEach((line, i) => {
    setTimeout(() => {
      line.resolved = true
    }, 800 + i * 400)
  })

  if (toReveal.length === LINES.length) {
    setTimeout(() => {
      showClosing.value = true
    }, 800 + toReveal.length * 400 + 600)
  }
})

onUnmounted(() => {
  if (tickId) clearInterval(tickId)
})
</script>

<template>
  <div role="article" aria-label="Text that materializes from your path through the site">
    <p class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 mb-8">
      You came here carrying what you've seen.
    </p>

    <div class="space-y-2 mb-8">
      <p
        v-for="line in lineData"
        :key="line.piece"
        class="font-mono text-sm sm:text-base leading-relaxed"
      >
        <span v-if="line.resolved" class="text-neutral-300">{{ line.text }}</span>
        <span v-else v-html="line.html" />
      </p>
    </div>

    <p
      v-if="showClosing"
      class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300"
    >
      Everything connects &mdash; not because it was designed to,<br>
      but because you walked through it.
    </p>
  </div>
</template>

<style scoped>
:deep(.sq-thread) {
  color: var(--color-neutral-800, #262626);
}
</style>
