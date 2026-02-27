<script setup lang="ts">
useSeoMeta({
  title: 'Half-Life — Squelch Zero',
  ogTitle: 'Half-Life — Squelch Zero',
  description: 'A text with a lifespan. Visit what remains.',
  ogDescription: 'A text with a lifespan. Visit what remains.',
})
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
        <HalfLifeField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">witness</p>
      <p class="text-xs text-neutral-600">squelch-zero / half-life</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/decay', label: 'decay', note: 'watch text dissolve in real time' },
        { to: '/shift', label: 'shift', note: 'come back tomorrow, it reads differently' },
      ]"
    />
  </div>
</template>
