<script setup lang="ts">
useSeoMeta({
  title: 'Path — Squelch Zero',
  ogTitle: 'Path — Squelch Zero',
  description: 'The address bar is a text field.',
  ogDescription: 'The address bar is a text field.',
})

const route = useRoute()

const segments = computed(() => {
  const slug = route.params.slug
  if (!slug) return []
  const arr = typeof slug === 'string' ? [slug] : slug
  return arr.filter(s => s.length > 0).map(s => decodeURIComponent(s))
})

const hasPath = computed(() => segments.value.length > 0)

const visible = ref(0)
let timer: ReturnType<typeof setInterval>

function startReveal() {
  clearInterval(timer)
  visible.value = 0
  if (segments.value.length === 0) return
  timer = setInterval(() => {
    visible.value++
    if (visible.value >= segments.value.length) {
      clearInterval(timer)
    }
  }, 500)
}

onMounted(startReveal)
onUnmounted(() => clearInterval(timer))
watch(() => route.params.slug, startReveal)
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex flex-col justify-center">
      <ClientOnly>
        <div v-if="!hasPath" class="space-y-6">
          <p class="text-lg text-neutral-400">
            /path/<span class="cursor-blink"></span>
          </p>
          <p class="text-sm text-neutral-600">
            The address bar is a text field. Type after the slash.
          </p>
        </div>

        <div v-else class="space-y-3">
          <p
            v-for="(word, i) in segments"
            :key="i"
            class="text-lg leading-relaxed transition-opacity duration-700"
            :style="{
              paddingLeft: `${Math.min(i * 1.5, 15)}rem`,
              opacity: visible > i ? Math.max(0.3, 1 - i * 0.06) : 0,
            }"
          >
            {{ word }}
          </p>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">{{ hasPath ? 'your path' : 'address' }}</p>
      <p class="text-xs text-neutral-600">squelch-zero / path</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/room', label: 'room', note: 'a small place to move through' },
        { to: '/drift', label: 'drift', note: 'independent cycles, occasional convergence' },
      ]"
    />
  </div>
</template>
