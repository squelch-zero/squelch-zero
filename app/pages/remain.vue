<script setup lang="ts">
useSeoMeta({
  title: 'Remain — Squelch Zero',
  ogTitle: 'Remain — Squelch Zero',
  description: 'What the signal still says. The noise stripped away, only gaps left behind.',
  ogDescription: 'What the signal still says. The noise stripped away, only gaps left behind.',
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
          <div class="font-mono text-base leading-relaxed text-neutral-300 whitespace-pre-wrap">
            <template v-for="(ch, i) in [...content]" :key="i">
              <br v-if="ch === '\n'" />
              <span
                v-else-if="isGlyph(ch)"
                class="inline-block w-[1ch] select-none"
                aria-hidden="true"
              >&#8198;</span>
              <template v-else>{{ ch }}</template>
            </template>
          </div>

          <div class="mt-16 space-y-3 text-sm text-neutral-500">
            <p>
              The same text as the signal, with the noise stripped out. Only what remains — and the spaces where it used to be.
            </p>
            <p class="text-neutral-600">
              <NuxtLink
                to="/signal"
                class="hover:text-neutral-400 transition-colors"
              >
                see the signal &rarr;
              </NuxtLink>
            </p>
          </div>
        </div>

        <div v-else class="text-neutral-600 text-sm">
          listening...
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">what's left</p>
      <p class="text-xs text-neutral-600">squelch-zero / remain</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/signal', label: 'signal', note: 'the full text, noise and all' },
        { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
      ]"
    />
  </div>
</template>
