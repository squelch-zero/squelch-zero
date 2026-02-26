<script setup lang="ts">
useSeoMeta({
  title: 'Room — Squelch Zero',
  ogTitle: 'Room — Squelch Zero',
  description: 'A small place. Move through it.',
  ogDescription: 'A small place. Move through it.',
})

interface Room {
  description: string
  details?: { label: string; text: string }[]
  exits: { label: string; to: string }[]
}

const rooms: Record<string, Room> = {
  entrance: {
    description: 'A small room. The walls are close enough to touch. A door ahead stands open. Light comes from somewhere you can\'t place.',
    exits: [
      { label: 'through the door', to: 'hallway' },
    ],
  },
  hallway: {
    description: 'A long corridor. The ceiling is higher than you expected. Your footsteps make no sound. Doors on the left and right. The corridor continues ahead.',
    exits: [
      { label: 'left', to: 'glass' },
      { label: 'right', to: 'dark' },
      { label: 'ahead', to: 'large' },
      { label: 'back', to: 'entrance' },
    ],
  },
  glass: {
    description: 'One wall is glass, floor to ceiling. Beyond it: a garden, overgrown. Something is blooming close to the glass — heavy petals, pressing against it.',
    details: [
      { label: 'the garden', text: 'The plants are thick and tangled. There\'s no path. Nothing was planted in rows. It grew this way on its own.' },
    ],
    exits: [
      { label: 'back to the corridor', to: 'hallway' },
    ],
  },
  dark: {
    description: 'Very little light. You can feel the room is large by the way the air moves. The floor is smooth and warm underfoot.',
    exits: [
      { label: 'further in', to: 'deep' },
      { label: 'back to the corridor', to: 'hallway' },
    ],
  },
  deep: {
    description: 'You can\'t see the walls. The warmth of the floor is stronger here. Somewhere, water is dripping — not rhythmically, just occasionally. You wait for each drop without meaning to.',
    details: [
      { label: 'the dripping', text: 'You can\'t find the source. It sounds close, then far. The drops are warm when one lands on the back of your hand.' },
    ],
    exits: [
      { label: 'back toward the light', to: 'dark' },
    ],
  },
  large: {
    description: 'A high-ceilinged room, mostly empty. In the center: a table. On the table: a small object. A staircase spirals upward in the far corner.',
    details: [
      { label: 'the object', text: 'A stone, worn smooth. Warm. It fits your hand perfectly, like it was waiting for someone with exactly your grip. You set it back down.' },
    ],
    exits: [
      { label: 'up the stairs', to: 'stairs' },
      { label: 'back to the corridor', to: 'hallway' },
    ],
  },
  stairs: {
    description: 'Spiral stairs, narrow. The walls are rough stone — the first texture that isn\'t smooth. It\'s cooler here. The stairs go up.',
    exits: [
      { label: 'up', to: 'roof' },
      { label: 'down', to: 'large' },
    ],
  },
  roof: {
    description: 'Open sky. The building below you is smaller than it felt from inside. You can see a long way in every direction. There\'s nothing remarkable out there — just distance. Wind, faintly.',
    details: [
      { label: 'the distance', text: 'Flat ground in every direction. No roads, no other buildings. The horizon is sharp and clean. You could walk toward it but you\'d never reach it.' },
    ],
    exits: [
      { label: 'back down', to: 'stairs' },
    ],
  },
}

const current = ref('entrance')
const transitioning = ref(false)
const revealed = ref<Set<string>>(new Set())

const room = computed(() => rooms[current.value])

function go(target: string) {
  if (transitioning.value) return
  transitioning.value = true
  revealed.value = new Set()
  setTimeout(() => {
    current.value = target
    transitioning.value = false
  }, 300)
}

function reveal(label: string) {
  revealed.value = new Set([...revealed.value, label])
}
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center">
      <div
        class="max-w-prose transition-opacity duration-300"
        :class="transitioning ? 'opacity-0' : 'opacity-100'"
      >
        <p class="text-base leading-relaxed text-neutral-300 mb-6">
          {{ room.description }}
        </p>

        <div v-if="room.details" class="mb-6 space-y-3">
          <template v-for="detail in room.details" :key="detail.label">
            <button
              v-if="!revealed.has(detail.label)"
              class="text-sm text-neutral-600 hover:text-neutral-400 transition-colors block"
              @click="reveal(detail.label)"
            >
              look at {{ detail.label }}
            </button>
            <p
              v-else
              class="text-sm text-neutral-500 leading-relaxed"
            >
              {{ detail.text }}
            </p>
          </template>
        </div>

        <nav class="space-y-2">
          <button
            v-for="exit in room.exits"
            :key="exit.to"
            class="text-sm text-neutral-500 hover:text-neutral-200 transition-colors block"
            @click="go(exit.to)"
          >
            {{ exit.label }} &rarr;
          </button>
        </nav>
      </div>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-700">a place</p>
      <p class="text-xs text-neutral-800">squelch-zero / room</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/shift', label: 'shift', note: 'the same page, different every day' },
        { to: '/fragment', label: 'fragment', note: 'one sentence, no context' },
      ]"
    />
  </div>
</template>
