<script setup lang="ts">
const { data: about } = await useAsyncData('about', () =>
  queryCollection('content').path('/about').first()
)
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/writing" class="hover:text-neutral-300 transition-colors">writing</NuxtLink>
        <NuxtLink to="/log" class="hover:text-neutral-300 transition-colors">log</NuxtLink>
      </nav>
      <h1 class="text-2xl font-bold text-white mt-4">About</h1>
    </header>

    <main>
      <article v-if="about" class="prose prose-invert prose-sm max-w-none">
        <ContentRenderer :value="about" />
      </article>

      <Elsewhere
        :suggestions="[
          { to: '/writing', label: 'writing', note: 'what I think about' },
          { to: '/threshold', label: 'threshold', note: 'what I make' },
        ]"
      />
    </main>
  </div>
</template>
