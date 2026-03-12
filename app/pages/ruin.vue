<script setup lang="ts">
import { glyph } from '@squelch-zero/noise'

useSeoMeta({
  title: 'Ruin — Squelch Zero',
  ogTitle: 'Ruin — Squelch Zero',
  description: 'The only thing that can ruin it is you.',
  ogDescription: 'The only thing that can ruin it is you.',
})

const text = `This text is intact. Every character is where I placed it. The spaces are deliberate. The line breaks are mine.

Below is a button. Each press replaces characters with noise — more each time. The changes save to your browser. There is no undo.

I could have made this decay on its own. I've done that with other texts. But this one stays intact until you decide otherwise.

The only thing that can ruin it is you.`

const buttonLabel = 'decay'

const pressCount = ref(0)
const decayedChars = ref<Record<number, string>>({})
const buttonDecayedChars = ref<Record<number, string>>({})
const ready = ref(false)

const contentIndices: number[] = []
for (let i = 0; i < text.length; i++) {
  if (!/\s/.test(text[i])) contentIndices.push(i)
}

const buttonIndices: number[] = []
for (let i = 0; i < buttonLabel.length; i++) {
  buttonIndices.push(i)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  if (ch === '"') return '&quot;'
  return ch
}

const allDecayed = computed(() => {
  return Object.keys(decayedChars.value).length >= contentIndices.length
})

const renderedText = computed(() => {
  let html = ''
  for (let i = 0; i < text.length; i++) {
    if (decayedChars.value[i] !== undefined) {
      html += `<span class="sq-ch sq-ruin" aria-hidden="true">${decayedChars.value[i]}</span>`
    } else if (text[i] === '\n') {
      html += '\n'
    } else {
      html += escapeHtml(text[i])
    }
  }
  return html
})

const renderedButton = computed(() => {
  let html = ''
  for (let i = 0; i < buttonLabel.length; i++) {
    if (buttonDecayedChars.value[i] !== undefined) {
      html += `<span class="sq-ch sq-ruin-btn">${buttonDecayedChars.value[i]}</span>`
    } else {
      html += escapeHtml(buttonLabel[i])
    }
  }
  return html
})

function save() {
  try {
    localStorage.setItem('sq-ruin', JSON.stringify({
      pressCount: pressCount.value,
      chars: decayedChars.value,
      btnChars: buttonDecayedChars.value,
    }))
  } catch {}
}

function doDecay() {
  if (allDecayed.value) return

  pressCount.value++
  const count = pressCount.value

  // Decay text characters
  const available = contentIndices.filter(i => decayedChars.value[i] === undefined)
  const toDecay = shuffle(available).slice(0, count)
  const newChars = { ...decayedChars.value }
  for (const idx of toDecay) newChars[idx] = glyph()
  decayedChars.value = newChars

  // Decay one button character per press
  const btnAvailable = buttonIndices.filter(i => buttonDecayedChars.value[i] === undefined)
  if (btnAvailable.length > 0) {
    const btnIdx = btnAvailable[Math.floor(Math.random() * btnAvailable.length)]
    const newBtnChars = { ...buttonDecayedChars.value }
    newBtnChars[btnIdx] = glyph()
    buttonDecayedChars.value = newBtnChars
  }

  save()
}

onMounted(() => {
  try {
    const raw = localStorage.getItem('sq-ruin')
    if (raw) {
      const data = JSON.parse(raw)
      pressCount.value = data.pressCount ?? 0
      decayedChars.value = data.chars ?? {}
      buttonDecayedChars.value = data.btnChars ?? {}
    }
  } catch {}
  ready.value = true
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-6 py-12 max-w-2xl mx-auto">
    <header class="mb-4">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
      </nav>
    </header>

    <main class="flex-1 flex items-center">
      <ClientOnly>
        <div
          class="transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
        >
          <div
            role="article"
            aria-label="A paragraph of text with a button labeled decay. Each press permanently replaces characters with noise glyphs, accelerating with each press. The changes save to the browser. The destruction is irreversible."
            class="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap"
            v-html="renderedText"
          />
          <p v-if="!allDecayed" class="mt-8">
            <span
              class="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors select-none"
              role="button"
              tabindex="0"
              @click="doDecay"
              @keydown.enter="doDecay"
              @keydown.space.prevent="doDecay"
              v-html="renderedButton"
            />
          </p>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">ruin</p>
      <p class="text-xs text-neutral-600">squelch-zero / ruin</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/erasure', label: 'erasure', note: 'click to erase, what remains is yours' },
        { to: '/signal', label: 'signal', note: 'a text decaying without you' },
      ]"
    />
  </div>
</template>

<style scoped>
:deep(.sq-ruin) {
  color: var(--color-neutral-800, #262626);
}
:deep(.sq-ruin-btn) {
  color: var(--color-neutral-600, #525252);
}
</style>
