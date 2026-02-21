<template>
  <div>
    <p class="text-neutral-600 text-sm font-mono mb-16">below the threshold — everything comes through</p>

    <div v-if="dispatches?.length" class="space-y-10">
      <article v-for="item in dispatches" :key="item.path">
        <NuxtLink :to="item.path" class="group block">
          <time class="text-neutral-600 text-xs font-mono">{{ formatDate(item.date) }}</time>
          <h2 class="text-neutral-200 text-lg mt-1 leading-snug group-hover:text-white transition-colors">
            {{ item.title }}
          </h2>
          <p v-if="item.description" class="text-neutral-500 text-sm mt-2 leading-relaxed">
            {{ item.description }}
          </p>
        </NuxtLink>
        <div v-if="item.tags?.length" class="flex flex-wrap gap-3 mt-2">
          <NuxtLink v-for="t in item.tags" :key="t" :to="`/tag/${t}`"
            class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">{{ t }}</NuxtLink>
        </div>
      </article>
    </div>
    <p v-else class="text-neutral-600 font-mono text-sm">signal incoming.</p>

    <div v-if="allTags.length" class="mt-16 pt-8 border-t border-neutral-800/30">
      <p class="text-neutral-700 text-xs font-mono mb-3">tags</p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink v-for="t in allTags" :key="t" :to="`/tag/${t}`"
          class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">{{ t }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Squelch Zero',
  ogTitle: 'Squelch Zero',
  description: 'Below the threshold. Everything comes through.',
  ogDescription: 'Below the threshold. Everything comes through.',
  ogUrl: 'https://squelch-zero.vercel.app'
})

const { data: dispatches } = await useAsyncData('dispatches', () =>
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
