<template>
  <div v-if="page">
    <article>
      <header v-if="page.date" class="mb-12">
        <time class="text-neutral-600 text-xs font-mono">{{ formatDate(page.date) }}</time>
        <h1 class="text-neutral-100 text-2xl font-light mt-2 leading-snug">{{ page.title }}</h1>
        <p v-if="page.description" class="text-neutral-500 text-sm mt-3 leading-relaxed">{{ page.description }}</p>
        <div v-if="page.tags?.length" class="flex flex-wrap gap-3 mt-4">
          <NuxtLink v-for="t in page.tags" :key="t" :to="`/tag/${t}`"
            class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">{{ t }}</NuxtLink>
        </div>
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

const siteUrl = 'https://squelch-zero.vercel.app'

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} — Squelch Zero` : 'Squelch Zero',
  ogTitle: () => page.value?.title || 'Squelch Zero',
  description: () => page.value?.description || 'Below the threshold. Everything comes through.',
  ogDescription: () => page.value?.description || 'Below the threshold. Everything comes through.',
  ogUrl: () => `${siteUrl}${route.path}`,
  ogType: () => page.value?.date ? 'article' : 'website',
  ...(page.value?.date && {
    articlePublishedTime: page.value.date,
    articleAuthor: 'Squelch Zero'
  })
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
