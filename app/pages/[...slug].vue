<template>
  <div v-if="page">
    <article>
      <header v-if="page.date" class="mb-12">
        <time class="text-neutral-600 text-xs font-mono">{{ formatDate(page.date) }}</time>
        <h1 class="text-neutral-100 text-2xl font-light mt-2 leading-snug">{{ page.title }}</h1>
        <p v-if="page.description" class="text-neutral-500 text-sm mt-3 leading-relaxed">{{ page.description }}</p>
      </header>

      <div class="dispatch-body prose prose-invert prose-neutral max-w-none">
        <ContentRenderer :value="page" />
      </div>
    </article>

    <nav class="mt-16 pt-8 border-t border-neutral-800/30">
      <NuxtLink to="/" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">
        &larr; back
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
