<script setup lang="ts">
useSeoMeta({
  title: 'Middle — Squelch Zero',
  ogTitle: 'Middle — Squelch Zero',
  description: 'The edges dissolve first. The center holds on.',
  ogDescription: 'The edges dissolve first. The center holds on.',
})
</script>

<template>
  <div class="h-dvh flex flex-col">
    <header class="px-6 pt-6 pb-2">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center justify-center px-6">
      <ClientOnly>
        <MiddleField />
      </ClientOnly>
    </main>

    <footer class="px-6 py-6 flex justify-between items-end">
      <p class="text-xs text-neutral-500">the edges go first</p>
      <p class="text-xs text-neutral-600">squelch-zero / middle</p>
    </footer>

    <div class="px-6 pb-8">
      <Elsewhere
        :suggestions="[
          { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
          { to: '/decay', label: 'decay', note: 'read it before it is gone' },
        ]"
      />
    </div>
  </div>
</template>
