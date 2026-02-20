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
      </article>
    </div>
    <p v-else class="text-neutral-600 font-mono text-sm">signal incoming.</p>
  </div>
</template>

<script setup>
const { data: dispatches } = await useAsyncData('dispatches', () =>
  queryCollection('content')
    .where('date', 'IS NOT NULL')
    .order('date', 'DESC')
    .all()
)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
