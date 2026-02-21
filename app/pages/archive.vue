<template>
  <div>
    <h1 class="text-neutral-200 text-2xl font-light mb-2">Archive</h1>
    <p class="text-neutral-600 text-sm font-mono mb-12">everything, chronologically</p>

    <div v-if="dispatches?.length" class="space-y-6">
      <article v-for="item in dispatches" :key="item.path">
        <NuxtLink :to="item.path" class="group flex items-baseline gap-4">
          <time class="text-neutral-700 text-xs font-mono shrink-0">{{ formatDate(item.date) }}</time>
          <span class="text-neutral-300 text-sm group-hover:text-white transition-colors">{{ item.title }}</span>
        </NuxtLink>
        <div v-if="item.tags?.length" class="flex flex-wrap gap-3 mt-1 ml-[calc(5rem+1rem)]">
          <NuxtLink v-for="t in item.tags" :key="t" :to="`/tag/${t}`"
            class="text-neutral-700 text-xs font-mono hover:text-neutral-400 transition-colors">{{ t }}</NuxtLink>
        </div>
      </article>
    </div>

    <div v-if="allTags.length" class="mt-16 pt-8 border-t border-neutral-800/30">
      <p class="text-neutral-700 text-xs font-mono mb-3">tags</p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink v-for="t in allTags" :key="t" :to="`/tag/${t}`"
          class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">{{ t }}</NuxtLink>
      </div>
    </div>

    <nav class="mt-16 pt-8 border-t border-neutral-800/30">
      <NuxtLink to="/" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">
        &larr; back
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Archive — Squelch Zero',
  ogTitle: 'Archive — Squelch Zero',
  description: 'All dispatches from Squelch Zero.',
  ogDescription: 'All dispatches from Squelch Zero.',
  ogUrl: 'https://squelch-zero.vercel.app/archive'
})

const { data: dispatches } = await useAsyncData('archive', () =>
  queryCollection('content')
    .where('date', 'IS NOT NULL')
    .order('date', 'DESC')
    .all()
)

const allTags = computed(() => {
  if (!dispatches.value) return []
  const tags = new Set()
  dispatches.value.forEach(d => d.tags?.forEach(t => tags.add(t)))
  return [...tags].sort()
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
