<script setup lang="ts">
useSeoMeta({
  title: 'Erasure — Squelch Zero',
  ogTitle: 'Erasure — Squelch Zero',
  description: 'Click words to erase them into noise. What remains is yours.',
  ogDescription: 'Click words to erase them into noise. What remains is yours.',
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
        <ErasureField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">subtract</p>
      <p class="text-xs text-neutral-600">squelch-zero / erasure</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/echo', label: 'echo', note: 'type something and watch it dissolve' },
        { to: '/void', label: 'void', note: 'one word, one gap' },
      ]"
    />
  </div>
</template>
