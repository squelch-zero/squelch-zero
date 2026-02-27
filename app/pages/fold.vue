<script setup lang="ts">
useSeoMeta({
  title: 'Fold — Squelch Zero',
  ogTitle: 'Fold — Squelch Zero',
  description: 'A combinatorial text. Every reading is a first reading.',
  ogDescription: 'A combinatorial text. Every reading is a first reading.',
})

// Five slots × five variants = 3,125 possible texts.
// Each slot cycles at a different prime-second interval.
// Full cycle: lcm(35, 55, 65, 45, 85) = 765,765 seconds ≈ 8.86 days.
// Every version is a valid reading. No version is the poem.

const slots = [
  {
    lines: [
      'something is here that wasn\'t here before.',
      'the light is different. the room is the same.',
      'you arrived during a change.',
      'nothing announced this.',
      'the first thing you noticed is already gone.',
    ],
    period: 7,
  },
  {
    lines: [
      'every sentence is an arrangement that could have been different.',
      'the lines were not written to follow each other.',
      'five possibilities, and you\'re reading one.',
      'the words hold still only while you watch them.',
      'nothing here was inevitable.',
    ],
    period: 11,
  },
  {
    lines: [
      'the space between two readings is where meaning lives.',
      'clarity is a temporary state.',
      'not everything needs to be understood.',
      'what changes is not the text.',
      'the pattern was there before you named it.',
    ],
    period: 13,
  },
  {
    lines: [
      'most versions exist for no one.',
      'the one you\'re reading is the only one that\'s real.',
      'no one will read them all.',
      'somewhere, a version says exactly what you need.',
      'this one is here because the clock said so.',
    ],
    period: 9,
  },
  {
    lines: [
      'you were here. that\'s the record.',
      'what you take with you is not what stays.',
      'the page will not remember this arrangement.',
      'it will keep going after you leave.',
      'one reading is enough.',
    ],
    period: 17,
  },
]

const FADE_MS = 500

const current = reactive(slots.map(() => 0))
const visible = reactive(slots.map(() => true))
const locked = reactive(slots.map(() => false))
const ready = ref(false)

function getIndex(period: number, count: number): number {
  return Math.floor(Date.now() / 1000 / period) % count
}

let timer: ReturnType<typeof setInterval>

function tick() {
  slots.forEach((slot, i) => {
    if (locked[i]) return
    const idx = getIndex(slot.period, slot.lines.length)
    if (idx !== current[i]) {
      locked[i] = true
      visible[i] = false
      setTimeout(() => {
        current[i] = idx
        visible[i] = true
        setTimeout(() => { locked[i] = false }, FADE_MS)
      }, FADE_MS)
    }
  })
}

onMounted(() => {
  slots.forEach((slot, i) => {
    current[i] = getIndex(slot.period, slot.lines.length)
  })
  ready.value = true
  timer = setInterval(tick, 200)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center">
      <ClientOnly>
        <div
          role="article"
          aria-label="A combinatorial text with five lines, each cycling independently through five variants. Every arrangement is a valid reading."
          class="space-y-6 transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
        >
          <p
            v-for="(slot, i) in slots"
            :key="i"
            class="text-lg leading-relaxed text-neutral-300 transition-opacity"
            :style="{ transitionDuration: `${FADE_MS}ms` }"
            :class="visible[i] ? 'opacity-100' : 'opacity-0'"

          >
            {{ slot.lines[current[i]] }}
          </p>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">read</p>
      <p class="text-xs text-neutral-600">squelch-zero / fold</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/drift', label: 'drift', note: 'independent cycles, occasional convergence' },
        { to: '/shift', label: 'shift', note: 'the same page, different every day' },
      ]"
    />
  </div>
</template>
