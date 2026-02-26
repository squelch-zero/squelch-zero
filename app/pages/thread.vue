<script setup lang="ts">
useSeoMeta({
  title: 'Thread — Squelch Zero',
  ogTitle: 'Thread — Squelch Zero',
  description: 'Your path through the site becomes visible here.',
  ogDescription: 'Your path through the site becomes visible here.',
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
        <ThreadField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">what you carry</p>
      <p class="text-xs text-neutral-600">squelch-zero / thread</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/return', label: 'return', note: 'it remembers you came back' },
        { to: '/erasure', label: 'erasure', note: 'click to erase, what remains is yours' },
      ]"
    />
  </div>
</template>
