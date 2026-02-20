<template>
  <div>
    <p class="text-neutral-600 text-sm font-mono mb-16">below the threshold — everything comes through</p>

    <ContentList v-slot="{ list }">
      <div v-if="dispatches(list).length" class="space-y-10">
        <article v-for="item in dispatches(list)" :key="item.id">
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
    </ContentList>
  </div>
</template>

<script setup>
function dispatches(list) {
  return list.filter(item => item.date)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toLowerCase()
}
</script>
