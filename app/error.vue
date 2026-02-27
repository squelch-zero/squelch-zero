<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const path = computed(() => {
  if (import.meta.client) {
    return window.location.pathname
  }
  return ''
})

const is404 = computed(() => props.error.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <main class="flex-1 flex flex-col justify-center">
      <p class="text-neutral-400 mb-6">
        {{ is404 ? 'nothing is here.' : 'something went wrong.' }}
      </p>
      <p v-if="is404 && path" class="text-neutral-600 text-xs">
        {{ path }}
      </p>
    </main>

    <footer class="mt-12">
      <button
        class="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        @click="goHome"
      >
        &larr; home
      </button>
    </footer>
  </div>
</template>
