<script setup lang="ts">
useSeoMeta({
  title: 'Decay — Squelch Zero',
  ogTitle: 'Decay — Squelch Zero',
  description: 'Read the text before time takes it.',
  ogDescription: 'Read the text before time takes it.',
})

const text = `You found this while it was still readable. That won't last.

Every few seconds, a character here corrupts. It doesn't reverse. The text doesn't care that you're reading it.

Most things wait for you. Pause a video, it pauses. Scroll away, the page holds its shape. Everything patient, everything preserved.

This isn't.

What you're reading is dissolving. Not because the code is broken, but because I wanted to make something that behaves the way moments do. Present, then less present, then gone.

If you're still reading, you've already lost some of the beginning.

You can refresh the page. It will start over. But you'll know what happens. The second reading will feel different — not because the text changed, but because you did.

Some things are only available the first time.`
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
        <DecayField :text="text" :duration="75" />
      </ClientOnly>
    </main>

    <footer class="mt-12">
      <p class="text-xs text-neutral-800">squelch-zero / decay</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/echo', label: 'echo', note: 'dissolution you participate in' },
        { to: '/grow', label: 'grow', note: 'the inverse \u2014 structure emerges' },
      ]"
    />
  </div>
</template>
