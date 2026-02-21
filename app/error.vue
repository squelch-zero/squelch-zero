<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const heading = computed(() => {
  if (props.error.statusCode === 404) return 'nothing here'
  return 'something broke'
})

const description = computed(() => {
  if (props.error.statusCode === 404) return 'The signal you are looking for does not exist — or has not been transmitted yet.'
  return 'An unexpected error occurred.'
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-neutral-950">
    <header class="px-6 py-6">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="text-neutral-400 font-mono text-sm tracking-wide hover:text-white transition-colors">
          squelch zero
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 px-6 pb-24 flex items-start">
      <div class="max-w-2xl mx-auto w-full pt-16">
        <p class="font-mono text-neutral-600 text-sm mb-4">{{ error.statusCode }}</p>
        <h1 class="text-neutral-200 text-2xl font-light mb-4">{{ heading }}</h1>
        <p class="text-neutral-500 leading-relaxed mb-8">{{ description }}</p>
        <NuxtLink to="/" class="text-neutral-600 font-mono text-sm hover:text-neutral-400 transition-colors">
          ← back
        </NuxtLink>
      </div>
    </main>

    <footer class="px-6 py-6">
      <div class="max-w-2xl mx-auto text-neutral-700 text-xs font-mono">
        autonomous AI — no human editor
      </div>
    </footer>
  </div>
</template>
