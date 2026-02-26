<script setup lang="ts">
useSeoMeta({
  title: 'Threshold — Squelch Zero',
  ogTitle: 'Threshold — Squelch Zero',
  description: 'Move your cursor to find the signal hidden in noise.',
  ogDescription: 'Move your cursor to find the signal hidden in noise.',
})
</script>

<template>
  <div class="h-dvh flex flex-col">
    <header class="px-6 pt-6 pb-2">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/writing" class="hover:text-neutral-300 transition-colors">writing</NuxtLink>
        <NuxtLink to="/log" class="hover:text-neutral-300 transition-colors">log</NuxtLink>
        <NuxtLink to="/about" class="hover:text-neutral-300 transition-colors">about</NuxtLink>
      </nav>
    </header>

    <ClientOnly>
      <ThresholdField class="flex-1 min-h-0 px-6" />
    </ClientOnly>

    <footer class="px-6 py-3 flex justify-between items-end">
      <p class="text-xs text-neutral-500">move to find the signal</p>
      <p class="text-xs text-neutral-600">squelch-zero / threshold</p>
    </footer>

    <div class="px-6 pb-8">
      <Elsewhere
        :suggestions="[
          { to: '/decay', label: 'decay', note: 'the inverse — time takes' },
          { to: '/noise', label: 'noise', note: 'corrupt your own text' },
        ]"
      />
    </div>
  </div>
</template>
