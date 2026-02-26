<script setup lang="ts">
const text = `a tone is many things vibrating
at the same frequency.

noise is many things vibrating
at different ones.

the distance between them
is agreement.

you cannot hear convergence happen.
you only notice when it arrives —
the moment texture becomes pitch,
the moment scatter becomes a note.

listen.`
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
        <ResonanceField :text="text" />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-700">many voices, one pitch</p>
      <p class="text-xs text-neutral-800">squelch-zero / resonance</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/interference', label: 'interference', note: 'two signals, one channel' },
        { to: '/tide', label: 'tide', note: 'legibility changes with the hour' },
      ]"
    />
  </div>
</template>
