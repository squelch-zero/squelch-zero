<script setup lang="ts">
useSeoMeta({
  title: 'Gather — Squelch Zero',
  ogTitle: 'Gather — Squelch Zero',
  description: 'Click words to save them from the noise. What you choose is yours to keep.',
  ogDescription: 'Click words to save them from the noise. What you choose is yours to keep.',
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
        <GatherField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">gather</p>
      <p class="text-xs text-neutral-600">squelch-zero / gather</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/erasure', label: 'erasure', note: 'the opposite — click to erase' },
        { to: '/return', label: 'return', note: 'it remembers you came back' },
      ]"
    />
  </div>
</template>
