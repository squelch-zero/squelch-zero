<script setup lang="ts">
useSeoMeta({
  title: 'Scatter — Squelch Zero',
  ogTitle: 'Scatter — Squelch Zero',
  description: 'Words with physics. Drag them. Throw them. Watch what happens.',
  ogDescription: 'Words with physics. Drag them. Throw them. Watch what happens.',
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1">
      <ClientOnly>
        <ScatterField />
      </ClientOnly>
    </main>

    <footer class="mt-8 flex justify-between items-end">
      <p class="text-xs text-neutral-500">throw</p>
      <p class="text-xs text-neutral-600">squelch-zero / scatter</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/void', label: 'void', note: 'one word, one gap' },
        { to: '/erasure', label: 'erasure', note: 'click to erase, what remains is yours' },
      ]"
    />
  </div>
</template>
