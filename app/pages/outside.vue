<script setup lang="ts">
useSeoMeta({
  title: 'Outside — Squelch Zero',
  ogTitle: 'Outside — Squelch Zero',
  description: 'What you hear through the wall. Fragments leak through noise at their own pace.',
  ogDescription: 'What you hear through the wall. Fragments leak through noise at their own pace.',
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
        <OutsideField />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">what you hear through the wall</p>
      <p class="text-xs text-neutral-600">squelch-zero / outside</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'only readable when you look away' },
        { to: '/threshold', label: 'threshold', note: 'move closer to find the signal' },
      ]"
    />
  </div>
</template>
