<script setup lang="ts">
const ready = ref(false)

// Seed from the current calendar day — everyone sees the same version on the same day,
// but it changes overnight. Computed client-side to avoid SSG baking one version.
const seed = ref(0)

onMounted(() => {
  const d = new Date()
  seed.value = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  ready.value = true
})

// Deterministic pick per slot
function pick(slot: number, ...options: string[]): string {
  const s = seed.value
  // Knuth multiplicative hash, different salt per slot
  const hash = ((s * 2654435761 + slot * 40503) >>> 0)
  return options[hash % options.length]
}

const p = pick
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center">
      <div
        class="text-base leading-relaxed text-neutral-300 max-w-prose space-y-5 transition-opacity duration-300"
        :class="ready ? 'opacity-100' : 'opacity-0'"
      >
        <p>
          {{ p(0, "You've read this before.", "You've seen this before.", "You've been here before.") }}
          Or {{ p(1, "something close to it", "something like it", "something near it") }}.
          Something with {{ p(2, "the same shape", "the same structure", "the same weight") }}
          — {{ p(3, "the same rhythm", "the same cadence", "the same pace") }},
          {{ p(4, "the same quiet", "the same stillness", "the same calm") }}.
          {{ p(5,
            "The same slow pace that isn't trying to take you anywhere.",
            "The same unhurried quality that doesn't want to take you anywhere.",
            "The same measured tempo that isn't pulling you forward."
          ) }}
        </p>

        <p>
          That feeling of {{ p(6, "half-recognition", "almost-familiarity", "near-recognition") }}
          is what this page is about.
        </p>

        <p>
          Every time you arrive here, the words {{ p(7, "rearrange themselves", "shift", "change") }}.
          Not dramatically — no {{ p(8, "shuffled paragraphs", "reordered paragraphs", "moved paragraphs") }},
          no {{ p(9, "scrambled letters", "swapped letters", "replaced characters") }}.
          The changes are smaller than that.
          {{ p(10, "A word traded for its neighbor.", "A word replaced by its shadow.", "A word exchanged for its cousin.") }}
          A sentence that {{ p(11, "leans", "tilts", "bends") }} slightly differently.
          {{ p(12, "The structure holds.", "The structure stays.") }}
          {{ p(13, "The meaning drifts.", "The meaning shifts.") }}
        </p>

        <p>
          You probably won't notice unless you're {{ p(14, "looking", "paying attention", "watching for it") }}.
          And even if you are, {{ p(15, "you might not trust what you find", "you might not believe yourself", "you might doubt what you remember") }}.
          Did that sentence say "{{ p(12, 'holds', 'stays') }}" last time, or "{{ p(12, 'stays', 'holds') }}"?
          Was it "{{ p(13, 'drifts', 'shifts') }}" or "{{ p(13, 'shifts', 'drifts') }}"?
          Your memory of what you read is {{ p(16, "less precise than you think", "rougher than you imagine", "softer than you realize") }}.
        </p>

        <p>
          This is different from the other pieces on this site. Those {{ p(17, "move", "act", "perform") }}
          — they animate, dissolve, {{ p(18, "corrupt", "decay", "scatter") }}.
          They make their changes {{ p(19, "visible", "obvious", "loud") }}.
          This one makes you doubt whether {{ p(20, "anything changed at all", "change happened", "it was ever different") }}.
        </p>

        <p>
          {{ p(21, "Come back sometime.", "Come back later.", "Come back tomorrow.") }}
          Read it again.
          {{ p(22, "See what you believe.", "See what you notice.", "See what you remember.") }}
        </p>
      </div>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-700">{{ p(23, "it changes", "or does it", "look again") }}</p>
      <p class="text-xs text-neutral-800">squelch-zero / shift</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/absence', label: 'absence', note: 'only readable when you look away' },
        { to: '/fragment', label: 'fragment', note: 'one sentence, no context' },
      ]"
    />
  </div>
</template>
