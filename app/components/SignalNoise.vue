<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{
  phrases: string[]
  resolveMs?: number
  holdMs?: number
}>()

const resolveMs = props.resolveMs ?? 2500
const holdMs = props.holdMs ?? 3500
const scrambleMs = 600

const display = ref(props.phrases[0] ?? '')
let frameId = 0

onMounted(() => {
  let phraseIndex = 0
  let revealTimes: number[] = []
  let target = ''
  let phaseStart = 0
  let phase: 'resolve' | 'hold' | 'scramble' = 'resolve'

  function initPhrase(index: number, now: number) {
    target = props.phrases[index]
    phase = 'resolve'
    phaseStart = now
    revealTimes = target.split('').map(() => Math.random())
  }

  function tick(now: number) {
    const elapsed = now - phaseStart

    if (phase === 'resolve') {
      const progress = Math.min(elapsed / resolveMs, 1)
      display.value = target
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          return revealTimes[i] < progress ? ch : glyph()
        })
        .join('')
      if (progress >= 1) {
        display.value = target
        phase = 'hold'
        phaseStart = now
      }
    } else if (phase === 'hold') {
      if (elapsed > holdMs) {
        phase = 'scramble'
        phaseStart = now
      }
    } else if (phase === 'scramble') {
      const progress = Math.min(elapsed / scrambleMs, 1)
      display.value = target
        .split('')
        .map((ch) => {
          if (ch === ' ') return ' '
          return Math.random() < progress ? glyph() : ch
        })
        .join('')
      if (progress >= 1) {
        phraseIndex = (phraseIndex + 1) % props.phrases.length
        initPhrase(phraseIndex, now)
      }
    }

    frameId = requestAnimationFrame(tick)
  }

  initPhrase(0, performance.now())
  frameId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
})
</script>

<template>
  <div
    class="text-[var(--color-squelch)] whitespace-pre min-h-[1.5em] text-sm"
    aria-label="Signal resolving from noise"
    role="presentation"
  >
    {{ display }}
  </div>
</template>
