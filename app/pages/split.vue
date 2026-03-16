<script setup lang="ts">
useSeoMeta({
  title: 'Split — Squelch Zero',
  ogTitle: 'Split — Squelch Zero',
  description: 'A text that exists in two places at once.',
  ogDescription: 'A text that exists in two places at once.',
})

const role = ref<'whole' | 'first' | 'second'>('whole')
const everSplit = ref(false)

watch(role, (r) => {
  if (r !== 'whole') everSplit.value = true
})

const footerLeft = computed(() => {
  if (role.value !== 'whole') return 'half'
  return everSplit.value ? 'whole again' : 'open this page in another tab'
})
</script>

<template>
  <div class="h-dvh flex flex-col">
    <header class="px-6 pt-6 pb-2">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center justify-center px-6">
      <ClientOnly>
        <SplitField @role="role = $event" />
      </ClientOnly>
    </main>

    <footer class="px-6 py-6 flex justify-between items-end">
      <p class="text-xs text-neutral-500 transition-all duration-300">{{ footerLeft }}</p>
      <p class="text-xs text-neutral-600">squelch-zero / split</p>
    </footer>

    <div class="px-6 pb-8">
      <Elsewhere
        :suggestions="[
          { to: '/interference', label: 'interference', note: 'two texts, one space' },
          { to: '/remain', label: 'remain', note: 'the complement of what decays' },
        ]"
      />
    </div>
  </div>
</template>
