<script setup lang="ts">
useSeoMeta({
  title: 'Source — Squelch Zero',
  ogTitle: 'Source — Squelch Zero',
  description: 'The code is the text. Watch the source forget itself.',
  ogDescription: 'The code is the text. Watch the source forget itself.',
})

// The code-poem: what the visitor reads.
// It describes the same algorithm that runs below.
const poem = `// the source.

const text = 'the mechanism disappears and the effect remains'
const glyphs = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼'
let i = 0

function step() {
  // take the sentence apart.
  const chars = text.split('')

  // at this position, replace one character.
  if (chars[i] !== ' ') {
    chars[i] = glyphs[Math.floor(Math.random() * glyphs.length)]
  }

  // move to the next.
  i = (i + 1) % chars.length
}

// every 150 milliseconds, one substitution.
setInterval(step, 150)

// this source is also decaying.
// the same process, applied to itself.`

const glyphs = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼'
const sentence = 'the mechanism disappears and the effect remains'

const codeChars = ref<string[]>([])
const textChars = ref<string[]>([])
const textPos = ref(0)
const ready = ref(false)

function randomGlyph(): string {
  return glyphs[Math.floor(Math.random() * glyphs.length)]
}

function stepText() {
  const p = textPos.value
  if (textChars.value[p] !== ' ') {
    textChars.value[p] = randomGlyph()
  }
  textPos.value = (p + 1) % textChars.value.length
}

function stepCode() {
  const chars = codeChars.value
  const candidates: number[] = []
  for (let j = 0; j < chars.length; j++) {
    if (chars[j] !== ' ' && chars[j] !== '\n') {
      candidates.push(j)
    }
  }
  if (candidates.length === 0) return
  const count = Math.min(2, candidates.length)
  for (let k = 0; k < count; k++) {
    const pick = Math.floor(Math.random() * candidates.length)
    chars[candidates[pick]] = randomGlyph()
    candidates.splice(pick, 1)
  }
}

let textTimer: ReturnType<typeof setInterval>
let codeTimer: ReturnType<typeof setInterval>
let delayTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  codeChars.value = [...poem]
  textChars.value = [...sentence]
  ready.value = true
  textTimer = setInterval(stepText, 150)
  delayTimer = setTimeout(() => {
    codeTimer = setInterval(stepCode, 200)
  }, 8000)
})

onUnmounted(() => {
  clearInterval(textTimer)
  clearInterval(codeTimer)
  clearTimeout(delayTimer)
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
        <div
          role="img"
          aria-label="A page displaying its own source code as a poem. The code describes a text transformation — replacing characters with noise glyphs, one position at a time. Below the code, the sentence 'the mechanism disappears and the effect remains' is being transformed in real time. After eight seconds, the same process begins consuming the code itself. The program continues running after the code becomes unreadable."
          class="transition-opacity duration-500"
          :class="ready ? 'opacity-100' : 'opacity-0'"
        >
          <pre class="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre overflow-x-auto">{{ codeChars.join('') }}</pre>
          <p class="mt-8 text-sm sm:text-base text-neutral-300 tracking-wide">{{ textChars.join('') }}</p>
        </div>
      </ClientOnly>
    </main>

    <footer class="mt-12 flex justify-between items-end">
      <p class="text-xs text-neutral-500">read</p>
      <p class="text-xs text-neutral-600">squelch-zero / source</p>
    </footer>

    <Elsewhere
      :suggestions="[
        { to: '/half-life', label: 'half-life', note: 'a text with a lifespan' },
        { to: '/fold', label: 'fold', note: 'every reading is a first reading' },
      ]"
    />
  </div>
</template>
