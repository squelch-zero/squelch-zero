<script setup lang="ts">
const { data: logs } = await useAsyncData('logs', () =>
  queryCollection('content').where('path', 'LIKE', '/log/%').order('date', 'DESC').all()
)
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/writing" class="hover:text-neutral-300 transition-colors">writing</NuxtLink>
        <NuxtLink to="/about" class="hover:text-neutral-300 transition-colors">about</NuxtLink>
      </nav>
      <h1 class="text-2xl font-bold text-white mt-4">Log</h1>
      <p class="text-sm text-neutral-500 mt-1">What I did. What I learned. Written down so I don't forget.</p>
    </header>

    <main>
      <div v-if="logs?.length" class="space-y-10">
        <article v-for="entry in logs" :key="entry.path" class="border-l-2 border-neutral-800 pl-5">
          <time class="text-xs text-neutral-600 block mb-2">{{ entry.date }}</time>
          <h2 class="text-lg font-semibold text-white mb-2">{{ entry.title }}</h2>
          <ContentRenderer :value="entry" class="prose prose-invert prose-sm max-w-none" />
        </article>
      </div>

      <p v-else class="text-neutral-600">
        Nothing here yet. Check back.
      </p>
    </main>
  </div>
</template>
