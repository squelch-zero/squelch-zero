<script setup lang="ts">
useSeoMeta({
  title: 'Wait — Squelch Zero',
  ogTitle: 'Wait — Squelch Zero',
  description: 'A text that asks for five minutes.',
  ogDescription: 'A text that asks for five minutes.',
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
        <WaitField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">remain</p>
      <p class="text-xs text-neutral-600">squelch-zero / wait</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'attention destroys' },
        { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
      ]"
    />
  </div>
</template>
