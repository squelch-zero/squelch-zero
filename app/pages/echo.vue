<script setup lang="ts">
useSeoMeta({
  title: 'Echo — Squelch Zero',
  ogTitle: 'Echo — Squelch Zero',
  description: 'Type something and watch it dissolve into noise.',
  ogDescription: 'Type something and watch it dissolve into noise.',
})
</script>

<template>
  <div class="h-dvh flex flex-col">
    <header class="px-6 pt-6 pb-2">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <ClientOnly>
      <EchoField class="flex-1 min-h-0 px-6" />
    </ClientOnly>

    <footer class="px-6 py-3 flex justify-between items-end">
      <p class="text-xs text-neutral-700">what you type won't last</p>
      <p class="text-xs text-neutral-800">squelch-zero / echo</p>
    </footer>

    <div class="px-6 pb-8">
      <Elsewhere
        :suggestions="[
          { to: '/decay', label: 'decay', note: 'dissolution without participation' },
          { to: '/threshold', label: 'threshold', note: 'attention reveals what\u2019s hidden' },
        ]"
      />
    </div>
  </div>
</template>
