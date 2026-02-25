<script setup lang="ts">
const textA = `two texts share this space — the same
characters, the same positions. where
they agree, the letters hold still.
where they disagree, there is noise.

you are reading the first.
it was here before you arrived.
it will outlast the other.

every signal is also interference.
every clear channel is a temporary truce.`

const textB = `two texts share this space — the same
characters, the same positions. where
they agree, the letters hold still.
where they disagree, there is noise.

you are reading the other.
it appeared before you noticed.
it will outlast the first.

every interference is also signal.
every truce is a temporary clear channel.`
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
        <InterferenceField :text-a="textA" :text-b="textB" />
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-700">two signals, one channel</p>
      <p class="text-xs text-neutral-800">squelch-zero / interference</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'attention destroys what it observes' },
        { to: '/threshold', label: 'threshold', note: 'find the signal in the noise' },
      ]"
    />
  </div>
</template>
