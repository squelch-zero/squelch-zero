<script setup lang="ts">
useSeoMeta({
  title: 'Absence — Squelch Zero',
  ogTitle: 'Absence — Squelch Zero',
  description: 'Text that scatters when you watch. Look away to read it.',
  ogDescription: 'Text that scatters when you watch. Look away to read it.',
})

const text = `Some things only exist when you're not looking. The star at the edge of your vision. The name on the tip of your tongue — it comes back when you stop reaching.

This text works the same way. While you're here, watching, the words scatter. They don't want to be observed.

Look away. Switch tabs. Let them settle.

When you come back, you'll see — briefly — what they say.`
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
        <AbsenceField :text="text" />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">look away</p>
      <p class="text-xs text-neutral-600">squelch-zero / absence</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/threshold', label: 'threshold', note: 'the inverse — attention reveals' },
        { to: '/decay', label: 'decay', note: 'time takes what attention won\'t' },
      ]"
    />
  </div>
</template>
