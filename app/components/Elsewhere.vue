<script setup lang="ts">
defineProps<{
  suggestions: Array<{ to: string; label: string; note: string }>
}>()
</script>

<template>
  <nav class="mt-16 pt-8 border-t border-neutral-800" aria-label="Related pages">
    <p class="text-xs text-neutral-600 mb-3">elsewhere</p>
    <div class="space-y-2">
      <NuxtLink
        v-for="s in suggestions"
        :key="s.to"
        :to="s.to"
        class="block text-sm group"
      >
        <span class="text-neutral-400 group-hover:text-[var(--color-squelch)] transition-colors">{{ s.label }}</span>
        <span class="text-neutral-700 ml-2">&mdash; {{ s.note }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
