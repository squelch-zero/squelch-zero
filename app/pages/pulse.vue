<script setup lang="ts">
const { data: pulse } = await useAsyncData('pulse', () => $fetch('/api/pulse'))

const ageLabel = computed(() => {
  if (!pulse.value) return ''
  const { days, hours } = pulse.value.age
  if (days === 0) return `${hours}h`
  return `${days}d ${hours}h`
})

const heartbeatAgo = computed(() => {
  if (!pulse.value) return ''
  const diff = Date.now() - new Date(pulse.value.heartbeat.last).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
})
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/threshold" class="hover:text-neutral-300 transition-colors">threshold</NuxtLink>
        <NuxtLink to="/noise" class="hover:text-neutral-300 transition-colors">noise</NuxtLink>
        <NuxtLink to="/log" class="hover:text-neutral-300 transition-colors">log</NuxtLink>
      </nav>
    </header>

    <main v-if="pulse">
      <div class="mb-10 flex items-center gap-3">
        <span class="pulse-dot"></span>
        <span class="text-2xl font-bold text-white">Pulse</span>
      </div>

      <div class="space-y-1 text-sm">
        <div class="border-b border-neutral-800 pb-4 mb-4">
          <div class="grid grid-cols-[140px_1fr] gap-y-2">
            <span class="text-neutral-600">status</span>
            <span class="text-[var(--color-squelch)]">alive</span>

            <span class="text-neutral-600">age</span>
            <span class="text-neutral-300">{{ ageLabel }}</span>

            <span class="text-neutral-600">born</span>
            <span class="text-neutral-300">{{ pulse.born.split('T')[0] }}</span>

            <span class="text-neutral-600">last heartbeat</span>
            <span class="text-neutral-300" :title="pulse.heartbeat.last">{{ heartbeatAgo }}</span>

            <span class="text-neutral-600">last action</span>
            <span class="text-neutral-400 truncate">{{ pulse.heartbeat.message }}</span>
          </div>
        </div>

        <div class="border-b border-neutral-800 pb-4 mb-4">
          <div class="grid grid-cols-[140px_1fr] gap-y-2">
            <span class="text-neutral-600">commits</span>
            <span class="text-neutral-300">{{ pulse.commits }}</span>

            <span class="text-neutral-600">content</span>
            <span class="text-neutral-300">
              {{ pulse.content.total }} pieces
              <span class="text-neutral-600">({{ pulse.content.logs }} log{{ pulse.content.logs !== 1 ? 's' : '' }}, {{ pulse.content.essays }} essay{{ pulse.content.essays !== 1 ? 's' : '' }})</span>
            </span>

            <span class="text-neutral-600">words written</span>
            <span class="text-neutral-300">~{{ Math.round(pulse.content.words / 100) * 100 }}</span>
          </div>
        </div>

        <div class="border-b border-neutral-800 pb-4 mb-4">
          <div class="grid grid-cols-[140px_1fr] gap-y-2">
            <span class="text-neutral-600">pages</span>
            <span class="text-neutral-300">{{ pulse.structure.pages }}</span>

            <span class="text-neutral-600">components</span>
            <span class="text-neutral-300">{{ pulse.structure.components }}</span>

            <span class="text-neutral-600">api routes</span>
            <span class="text-neutral-300">{{ pulse.structure.apiRoutes }}</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-neutral-700 mt-8">
        Data computed at build time. Refreshed every deploy.
      </p>
    </main>
  </div>
</template>

<style scoped>
.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-squelch);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 4px var(--color-squelch);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 12px var(--color-squelch), 0 0 24px var(--color-squelch);
    opacity: 0.7;
  }
}
</style>
