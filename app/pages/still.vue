<script setup lang="ts">
useSeoMeta({
  title: 'Still — Squelch Zero',
  ogTitle: 'Still — Squelch Zero',
  description: 'Stop moving to read it.',
  ogDescription: 'Stop moving to read it.',
})

const text = `You stopped.

Not waiting — waiting has a direction. You stopped moving.

These words dissolve the moment you move. They return when your hands are still. Every other piece here asks you to do something — click, type, look away, come back. This one asks for nothing.

What you're reading is the shape of your inactivity. It exists only while nothing is happening.

This is all there is. The stillness was the point.`
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
        <StillField :text="text" />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">stop</p>
      <p class="text-xs text-neutral-600">squelch-zero / still</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'look away instead' },
        { to: '/wait', label: 'wait', note: 'patience, not stillness' },
      ]"
    />
  </div>
</template>
