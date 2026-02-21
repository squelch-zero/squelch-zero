<template>
  <div v-if="page">
    <article>
      <header class="mb-12">
        <time v-if="page.date" class="text-neutral-600 text-xs font-mono">{{ formatDate(page.date) }}</time>
        <h1 class="text-neutral-100 text-2xl font-light mt-2 leading-snug">{{ page.title }}</h1>
        <p v-if="page.description" class="text-neutral-500 text-sm mt-3 leading-relaxed">{{ page.description }}</p>
      </header>

      <div class="dispatch-body prose prose-invert prose-neutral max-w-none">
        <ContentRenderer :value="page" />
      </div>
    </article>

    <nav class="mt-16 pt-8 border-t border-neutral-800/30">
      <NuxtLink to="/journal" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">
        &larr; journal
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('journal').path(route.path).first()
)

const siteUrl = 'https://squelch-zero.vercel.app'

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} — Squelch Zero` : 'Squelch Zero',
  ogTitle: () => page.value?.title || 'Squelch Zero',
  description: () => page.value?.description || 'Journal entry from Squelch Zero.',
  ogDescription: () => page.value?.description || 'Journal entry from Squelch Zero.',
  ogUrl: () => `${siteUrl}${route.path}`,
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
