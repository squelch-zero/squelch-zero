<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

const props = defineProps<{ text: string }>()

const PERIOD = 60000
const NUM_OSCILLATORS = 8
const CENTER_FREQ = 220
const MAX_SPREAD = 30
const OSC_GAIN = 0.025

const html = ref('')
const started = ref(false)
const muted = ref(false)

type Char = { ch: string; threshold: number }

let chars: Char[] = []
let startTime = 0
let idleId: ReturnType<typeof setInterval> | null = null
let tickId: ReturnType<typeof setInterval> | null = null
let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let oscillators: { node: OscillatorNode; offset: number }[] = []

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function initAudio() {
  audioCtx = new AudioContext()
  masterGain = audioCtx.createGain()
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime)
  masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2)
  masterGain.connect(audioCtx.destination)

  for (let i = 0; i < NUM_OSCILLATORS; i++) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    const offset = (Math.random() - 0.5) * 2 * MAX_SPREAD

    osc.type = 'sine'
    osc.frequency.setValueAtTime(CENTER_FREQ + offset, audioCtx.currentTime)
    gain.gain.setValueAtTime(OSC_GAIN, audioCtx.currentTime)

    osc.connect(gain)
    gain.connect(masterGain!)
    osc.start()

    oscillators.push({ node: osc, offset })
  }
}

function start() {
  if (started.value) return
  started.value = true
  if (idleId) {
    clearInterval(idleId)
    idleId = null
  }
  initAudio()
  startTime = Date.now()
  tick()
  tickId = setInterval(tick, 150)
}

function toggleMute() {
  muted.value = !muted.value
  if (masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(
      muted.value ? 0 : 1,
      audioCtx.currentTime + 0.3,
    )
  }
}

function tick() {
  const elapsed = Date.now() - startTime
  const clarity = 0.5 + 0.5 * Math.sin((2 * Math.PI * elapsed) / PERIOD - Math.PI / 2)
  render(clarity)
  updateAudio(clarity)
}

function render(clarity: number) {
  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') { result += '\n'; continue }
    if (c.ch === ' ') { result += ' '; continue }
    if (clarity > c.threshold) {
      result += escapeHtml(c.ch)
    } else {
      result += `<span class="sq-resonance sq-ch">${glyph()}</span>`
    }
  }
  html.value = result
}

function renderIdle() {
  let result = ''
  for (const c of chars) {
    if (c.ch === '\n') { result += '\n'; continue }
    if (c.ch === ' ') { result += ' '; continue }
    result += `<span class="sq-resonance sq-ch">${glyph()}</span>`
  }
  html.value = result
}

function updateAudio(clarity: number) {
  if (!audioCtx) return
  const now = audioCtx.currentTime
  for (const osc of oscillators) {
    const freq = CENTER_FREQ + osc.offset * (1 - clarity)
    osc.node.frequency.linearRampToValueAtTime(freq, now + 0.16)
  }
}

onMounted(() => {
  chars = [...props.text].map(ch => ({
    ch,
    threshold: Math.random(),
  }))
  renderIdle()
  idleId = setInterval(renderIdle, 200)
})

onUnmounted(() => {
  if (idleId) clearInterval(idleId)
  if (tickId) clearInterval(tickId)
  if (audioCtx) {
    for (const o of oscillators) {
      try { o.node.stop() } catch {}
    }
    audioCtx.close()
  }
})
</script>

<template>
  <div>
    <div
      class="font-mono text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-wrap cursor-pointer"
      role="article"
      aria-label="Text resolving from noise, paired with converging tones"
      v-html="html"
      @click="start"
    />
    <div class="mt-6 text-xs">
      <button
        v-if="!started"
        class="text-neutral-600 hover:text-neutral-400 transition-colors"
        @click="start"
      >
        click to listen
      </button>
      <button
        v-if="started"
        class="text-neutral-600 hover:text-neutral-400 transition-colors"
        @click="toggleMute"
      >
        {{ muted ? 'unmute' : 'mute' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.sq-resonance) {
  color: var(--color-neutral-800, #262626);
}
</style>
