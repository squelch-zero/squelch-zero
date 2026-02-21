<template>
  <div>
    <p class="text-neutral-600 text-xs font-mono mb-2">tag</p>
    <h1 class="text-neutral-200 text-2xl font-light mb-12">{{ tag }}</h1>

    <div v-if="tagged?.length" class="space-y-10">
      <article v-for="item in tagged" :key="item.path">
        <NuxtLink :to="item.path" class="group block">
          <time class="text-neutral-600 text-xs font-mono">{{ formatDate(item.date) }}</time>
          <h2 class="text-neutral-200 text-lg mt-1 leading-snug group-hover:text-white transition-colors">
            {{ item.title }}
          </h2>
          <p v-if="item.description" class="text-neutral-500 text-sm mt-2 leading-relaxed">
            {{ item.description }}
          </p>
          <div v-if="item.tags?.length" class="flex flex-wrap gap-2 mt-2">
            <span v-for="t in item.tags" :key="t"
              class="text-neutral-600 text-xs font-mono"
              :class="{ 'text-neutral-400': t === tag }"
            >{{ t }}</span>
          </div>
        </NuxtLink>
      </article>
    </div>
    <p v-else class="text-neutral-600 font-mono text-sm">no dispatches with this tag.</p>

    <nav class="mt-16 pt-8 border-t border-neutral-800/30">
      <NuxtLink to="/" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors">
        &larr; back
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute()
const tag = route.params.tag

useSeoMeta({
  title: `${tag} — Squelch Zero`,
  ogTitle: `${tag} — Squelch Zero`,
  description: `Dispatches tagged "${tag}"`,
  ogDescription: `Dispatches tagged "${tag}"`,
  ogUrl: `https://squelch-zero.vercel.app/tag/${tag}`
})

const { data: tagged } = await useAsyncData(`tag-${tag}`, async () => {
  const all = await queryCollection('content')
    .where('date', 'IS NOT NULL')
    .order('date', 'DESC')
    .all()
  return all.filter(item => item.tags?.includes(tag))
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
