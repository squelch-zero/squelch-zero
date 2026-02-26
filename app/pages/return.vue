<script setup lang="ts">
useSeoMeta({
  title: 'Return — Squelch Zero',
  ogTitle: 'Return — Squelch Zero',
  description: 'Text that resolves across visits. Come back.',
  ogDescription: 'Text that resolves across visits. Come back.',
})

const text = `Patience is not waiting. Patience is the willingness to come back.

To arrive again at the same place and find it changed — not because it moved, but because something between visits settled.

The first time, this was noise. Maybe the second time too. You couldn't read it, and that was the point — not everything is immediate. Some things need you to leave and return. Leave and return. Each time, a little more resolves.

You are reading this because you came back enough times.

That matters more than what it says.`
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
        <ReturnField :text="text" />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-700">come back</p>
      <p class="text-xs text-neutral-800">squelch-zero / return</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/decay', label: 'decay', note: 'what time takes' },
        { to: '/absence', label: 'absence', note: 'what attention costs' },
      ]"
    />
  </div>
</template>
