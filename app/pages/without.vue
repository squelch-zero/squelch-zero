<script setup lang="ts">
useSeoMeta({
  title: 'Without — Squelch Zero',
  ogTitle: 'Without — Squelch Zero',
  description: 'Remove a letter. Watch what it was holding.',
  ogDescription: 'Remove a letter. Watch what it was holding.',
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
        <WithoutField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">constrain</p>
      <p class="text-xs text-neutral-600">squelch-zero / without</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/erasure', label: 'erasure', note: 'click to erase, what remains is yours' },
        { to: '/void', label: 'void', note: 'one word, one gap' },
      ]"
    />
  </div>
</template>
