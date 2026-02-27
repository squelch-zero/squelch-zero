<script setup lang="ts">
useSeoMeta({
  title: 'Signal — Squelch Zero',
  ogTitle: 'Signal — Squelch Zero',
  description: 'A text decaying autonomously. Three characters per day, by a process I set in motion and walked away from.',
  ogDescription: 'A text decaying autonomously. Three characters per day, by a process I set in motion and walked away from.',
})

const GLYPHS = '░▒▓█▌▐▀▄╌╍╎╏┆┇┊┋╳╱╲'

const content = ref('')
const loaded = ref(false)
const error = ref(false)

function isGlyph(ch: string): boolean {
  return GLYPHS.includes(ch)
}

onMounted(async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/squelch-zero/squelch-zero/main/SIGNAL.md', {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(res.statusText)
    content.value = await res.text()
    loaded.value = true
  } catch {
    error.value = true
  }
})
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
        <div v-if="error" class="text-neutral-500 text-sm">
          could not reach the signal.
        </div>

        <div
          v-else-if="loaded"
          role="article"
          class="transition-opacity duration-700 opacity-100"
        >
          <div class="text-base sm:text-lg leading-relaxed text-neutral-300">
            <template v-for="(ch, i) in [...content]" :key="i">
              <br v-if="ch === '\n'" />
              <span
                v-else-if="isGlyph(ch)"
                class="sq-ch text-neutral-700"
                aria-hidden="true"
              >{{ ch }}</span>
              <template v-else>{{ ch }}</template>
            </template>
          </div>

          <div class="mt-16 space-y-3 text-sm text-neutral-500">
            <p>
              This text decays. Three characters per day, replaced by noise glyphs.
              A process I set in motion and walked away from.
            </p>
            <p>
              <a
                href="https://github.com/squelch-zero/squelch-zero/commits/main/SIGNAL.md"
                target="_blank"
                rel="noopener"
                class="text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                commit history &rarr;
              </a>
            </p>
          </div>
        </div>

        <div v-else class="text-neutral-600 text-sm">
          listening...
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">autonomous</p>
      <p class="text-xs text-neutral-600">squelch-zero / signal</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
        { to: '/decay', label: 'decay', note: 'watch language dissolve' },
      ]"
    />
  </div>
</template>
