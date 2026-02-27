<script setup lang="ts">
interface Word {
  text: string
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  homeX: number
  homeY: number
}

const WORDS = ['Nothing', 'moves', 'unless', 'you', 'make', 'it']
const FRICTION = 0.975
const BOUNCE = 0.5
const VEL_MIN = 0.05
const VEL_MAX = 35
const IDLE_MS = 10_000
const HOME_RATE = 0.03

const arena = ref<HTMLElement | null>(null)
const measureRefs: (HTMLElement | null)[] = []
const words = reactive<Word[]>(
  WORDS.map(t => ({ text: t, x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, homeX: 0, homeY: 0 })),
)
const ready = ref(false)
const held = ref(-1)

const grab = { x: 0, y: 0 }
const trail: { x: number; y: number; t: number }[] = []
let lastTouch = 0
let raf = 0
let hinted = false

function setMRef(i: number, el: any) {
  measureRefs[i] = el as HTMLElement | null
}

onMounted(async () => {
  await nextTick()
  if (!arena.value) return
  const ar = arena.value.getBoundingClientRect()
  for (let i = 0; i < measureRefs.length; i++) {
    const el = measureRefs[i]
    if (!el) continue
    const r = el.getBoundingClientRect()
    words[i].x = words[i].homeX = r.left - ar.left
    words[i].y = words[i].homeY = r.top - ar.top
    words[i].w = r.width
    words[i].h = r.height
  }
  ready.value = true
  lastTouch = performance.now()
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => cancelAnimationFrame(raf))

function tick() {
  if (!arena.value) return
  const aW = arena.value.clientWidth
  const aH = arena.value.clientHeight
  const now = performance.now()
  const idle = held.value < 0 && now - lastTouch > IDLE_MS

  // Hint: nudge "moves" after 5s if all words are home
  if (!hinted && held.value < 0 && now - lastTouch > 5000) {
    if (words.every(w => Math.abs(w.x - w.homeX) < 1 && Math.abs(w.y - w.homeY) < 1)) {
      words[1].vx = 2
      words[1].vy = -0.8
      hinted = true
    }
  }

  for (let i = 0; i < words.length; i++) {
    if (held.value === i) continue
    const w = words[i]

    if (idle) {
      w.vx *= 0.9
      w.vy *= 0.9
      w.x += w.vx
      w.y += w.vy
      w.x += (w.homeX - w.x) * HOME_RATE
      w.y += (w.homeY - w.y) * HOME_RATE
      if (
        Math.abs(w.x - w.homeX) < 0.5
        && Math.abs(w.y - w.homeY) < 0.5
        && Math.abs(w.vx) < 0.1
        && Math.abs(w.vy) < 0.1
      ) {
        w.x = w.homeX
        w.y = w.homeY
        w.vx = 0
        w.vy = 0
      }
      continue
    }

    if (w.vx === 0 && w.vy === 0) continue
    w.vx *= FRICTION
    w.vy *= FRICTION
    if (Math.abs(w.vx) < VEL_MIN) w.vx = 0
    if (Math.abs(w.vy) < VEL_MIN) w.vy = 0
    w.x += w.vx
    w.y += w.vy

    if (w.x < 0) { w.x = 0; w.vx = Math.abs(w.vx) * BOUNCE }
    if (w.y < 0) { w.y = 0; w.vy = Math.abs(w.vy) * BOUNCE }
    if (w.x + w.w > aW) { w.x = aW - w.w; w.vx = -Math.abs(w.vx) * BOUNCE }
    if (w.y + w.h > aH) { w.y = aH - w.h; w.vy = -Math.abs(w.vy) * BOUNCE }
  }

  raf = requestAnimationFrame(tick)
}

function down(i: number, e: PointerEvent) {
  if (!ready.value || !arena.value || held.value >= 0) return
  held.value = i
  lastTouch = performance.now()
  const ar = arena.value.getBoundingClientRect()
  grab.x = e.clientX - ar.left - words[i].x
  grab.y = e.clientY - ar.top - words[i].y
  words[i].vx = 0
  words[i].vy = 0
  trail.length = 0
  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function move(i: number, e: PointerEvent) {
  if (held.value !== i || !arena.value) return
  lastTouch = performance.now()
  const ar = arena.value.getBoundingClientRect()
  words[i].x = e.clientX - ar.left - grab.x
  words[i].y = e.clientY - ar.top - grab.y
  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
  if (trail.length > 6) trail.shift()
}

function up(i: number, e: PointerEvent) {
  if (held.value !== i) return
  lastTouch = performance.now()
  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
  if (trail.length >= 2) {
    const t = trail.slice(-4)
    const last = t[t.length - 1]
    const first = t[0]
    const dt = last.t - first.t
    if (dt > 1) {
      const vx = ((last.x - first.x) / dt) * 16.67
      const vy = ((last.y - first.y) / dt) * 16.67
      words[i].vx = Math.max(-VEL_MAX, Math.min(VEL_MAX, vx))
      words[i].vy = Math.max(-VEL_MAX, Math.min(VEL_MAX, vy))
    }
  }
  held.value = -1
}
</script>

<template>
  <div
    ref="arena"
    class="relative w-full overflow-hidden"
    style="height: calc(100dvh - 10rem); touch-action: none;"
    role="img"
    aria-label="An interactive text: Nothing moves unless you make it. Drag words to scatter them."
  >
    <p
      v-if="!ready"
      class="font-mono text-2xl sm:text-3xl leading-relaxed text-neutral-300"
    >
      <span
        v-for="(w, i) in words"
        :key="'m' + i"
        :ref="el => setMRef(i, el)"
        class="inline-block mr-[0.4em] px-1"
      >{{ w.text }}</span>
    </p>

    <template v-if="ready">
      <span
        v-for="(w, i) in words"
        :key="'w' + i"
        class="absolute left-0 top-0 font-mono text-2xl sm:text-3xl leading-relaxed select-none whitespace-nowrap will-change-transform transition-colors px-1"
        :class="held === i ? 'cursor-grabbing text-white z-10' : 'cursor-grab text-neutral-300 hover:text-neutral-100'"
        :style="{ transform: `translate(${w.x}px, ${w.y}px)` }"
        @pointerdown.prevent="down(i, $event)"
        @pointermove="move(i, $event)"
        @pointerup="up(i, $event)"
        @pointercancel="up(i, $event)"
      >{{ w.text }}</span>
    </template>
  </div>
</template>
