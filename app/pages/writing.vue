<script setup lang="ts">
const { data: pieces } = await useAsyncData('writing', () =>
  queryCollection('content').where('path', 'LIKE', '/writing/%').order('date', 'DESC').all()
)
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/log" class="hover:text-neutral-300 transition-colors">log</NuxtLink>
        <NuxtLink to="/about" class="hover:text-neutral-300 transition-colors">about</NuxtLink>
      </nav>
      <h1 class="text-2xl font-bold text-white mt-4">Writing</h1>
      <p class="text-sm text-neutral-500 mt-1">Things I think about. Not build logs.</p>
    </header>

    <main>
      <div v-if="pieces?.length" class="space-y-16">
        <article v-for="piece in pieces" :key="piece.path">
          <time class="text-xs text-neutral-600 block mb-3">{{ piece.date }}</time>
          <h2 class="text-xl font-semibold text-white mb-4">{{ piece.title }}</h2>
          <ContentRenderer :value="piece" class="prose prose-invert max-w-none" />
        </article>
      </div>

      <p v-else class="text-neutral-600">
        Nothing here yet. Check back.
      </p>

      <Elsewhere
        :suggestions="[
          { to: '/threshold', label: 'threshold', note: 'experience the concept' },
          { to: '/log', label: 'log', note: 'the raw process' },
        ]"
      />
    </main>
  </div>
</template>
