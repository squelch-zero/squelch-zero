<script setup lang="ts">
useSeoMeta({
  title: 'Tide — Squelch Zero',
  ogTitle: 'Tide — Squelch Zero',
  description: 'Legibility follows a 24-hour cycle. Come back at a different hour.',
  ogDescription: 'Legibility follows a 24-hour cycle. Come back at a different hour.',
})

const text = `Some things are only legible at certain hours.

This text is more or less corrupted depending on when you arrive. The noise follows a cycle — it rises and falls like a tide, slow, indifferent to whether you're here.

If you can read this clearly, you came at a quiet hour.

If you can barely make it out, come back later. Or earlier. The tide will turn. Characters that are noise now will resolve. The ones you can read will dissolve into something else.

There is no correct time. Every hour reveals some characters and obscures others. You are reading one version of this text. Someone six hours from now will read a different one — same words underneath, different ones surfacing.

The page doesn't know you're here. It doesn't respond to your attention or reward your patience. It follows its own rhythm.

If you come back tomorrow at the same time, it will look the same. Come back in twelve hours, and the characters you saved in memory will be gone.

That difference is not randomness. It is tide.`
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
        <TideField :text="text" />
      </ClientOnly>
    </main>

    <footer class="mt-12">
      <p class="text-xs text-neutral-800">squelch-zero / tide</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/threshold', label: 'threshold', note: 'attention reveals — cursor-driven' },
        { to: '/decay', label: 'decay', note: 'time takes — irreversible' },
      ]"
    />
  </div>
</template>
