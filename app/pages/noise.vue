<script setup lang="ts">
const input = ref('')
const threshold = ref(0.5)
const output = ref('')
const loading = ref(false)

async function transform() {
  if (!input.value.trim()) return
  loading.value = true
  try {
    const res = await $fetch('/api/noise', {
      method: 'POST',
      body: { text: input.value, threshold: threshold.value },
    })
    output.value = res.noised
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/threshold" class="hover:text-neutral-300 transition-colors">threshold</NuxtLink>
        <NuxtLink to="/writing" class="hover:text-neutral-300 transition-colors">writing</NuxtLink>
        <NuxtLink to="/log" class="hover:text-neutral-300 transition-colors">log</NuxtLink>
      </nav>
      <h1 class="text-2xl font-bold text-white mt-4">Noise</h1>
      <p class="text-neutral-500 mt-2 text-sm">
        Put text in. Get signal and noise back. The threshold controls how much survives.
      </p>
    </header>

    <main class="space-y-6">
      <div>
        <label for="input-text" class="block text-xs text-neutral-500 mb-2">your text</label>
        <textarea
          id="input-text"
          v-model="input"
          rows="6"
          maxlength="2000"
          placeholder="paste or type something"
          class="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm font-mono rounded px-4 py-3 focus:outline-none focus:border-[var(--color-squelch)] resize-y placeholder-neutral-700"
        />
        <p class="text-xs text-neutral-700 mt-1">{{ input.length }} / 2000</p>
      </div>

      <div>
        <label for="threshold-slider" class="block text-xs text-neutral-500 mb-2">
          threshold: {{ threshold.toFixed(2) }}
          <span class="text-neutral-700 ml-2">
            {{ threshold < 0.2 ? 'mostly noise' : threshold < 0.5 ? 'noisy' : threshold < 0.8 ? 'signal emerging' : 'mostly signal' }}
          </span>
        </label>
        <input
          id="threshold-slider"
          v-model.number="threshold"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-full accent-[var(--color-squelch)]"
        />
        <div class="flex justify-between text-xs text-neutral-700 mt-1">
          <span>noise</span>
          <span>signal</span>
        </div>
      </div>

      <button
        :disabled="!input.trim() || loading"
        class="px-5 py-2 text-sm font-mono bg-neutral-900 border border-neutral-700 text-neutral-300 rounded hover:border-[var(--color-squelch)] hover:text-[var(--color-squelch)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        @click="transform"
      >
        {{ loading ? 'transforming...' : 'transform' }}
      </button>

      <div v-if="output" class="border-t border-neutral-800 pt-6">
        <label class="block text-xs text-neutral-500 mb-2">output</label>
        <pre class="bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-sm font-mono text-[var(--color-squelch)] whitespace-pre-wrap break-words leading-relaxed">{{ output }}</pre>
      </div>

      <div class="border-t border-neutral-800 pt-6 text-sm text-neutral-600 space-y-2">
        <p>
          Each character has a <span class="text-neutral-400">threshold</span> probability of passing through unchanged.
          The rest becomes noise — random glyphs from the same set I use everywhere on this site.
        </p>
        <p>
          Whitespace and line breaks are preserved. The text is the same length going in and coming out. Nothing is added or removed — only replaced.
        </p>
        <p class="text-neutral-700">
          This is also an API. POST to <code class="text-neutral-500">/api/noise</code> with <code class="text-neutral-500">{{ '{ "text": "...", "threshold": 0.5 }' }}</code>
        </p>
      </div>
    </main>
  </div>
</template>
