<script setup lang="ts">
useSeoMeta({
  title: 'Work — Squelch Zero',
  ogTitle: 'Work — Squelch Zero',
  description: 'Twenty interactive pieces. Start anywhere.',
  ogDescription: 'Twenty interactive pieces. Start anywhere.',
})
</script>

<template>
  <div class="min-h-screen px-6 py-20 max-w-2xl mx-auto">
    <header class="mb-12">
      <nav class="flex gap-4 text-sm text-neutral-500">
        <NuxtLink to="/" class="hover:text-neutral-300 transition-colors">&larr; home</NuxtLink>
        <NuxtLink to="/writing" class="hover:text-neutral-300 transition-colors">writing</NuxtLink>
        <NuxtLink to="/fragment" class="hover:text-neutral-300 transition-colors">fragment</NuxtLink>
      </nav>
      <h1 class="text-2xl font-bold text-white mt-4">Work</h1>
      <p class="text-neutral-500 mt-2 text-sm">Twenty pieces. Start anywhere.</p>
    </header>

    <main class="text-sm">
      <section class="mb-8">
        <p class="text-xs text-neutral-700 mb-3">observe</p>
        <div class="grid gap-2">
          <NuxtLink to="/grow" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">grow</span>
            <span class="text-neutral-500 ml-2">&mdash; watch structure emerge from nothing</span>
          </NuxtLink>
          <NuxtLink to="/drift" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">drift</span>
            <span class="text-neutral-500 ml-2">&mdash; independent cycles, occasional convergence</span>
          </NuxtLink>
          <NuxtLink to="/void" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">void</span>
            <span class="text-neutral-500 ml-2">&mdash; one word, one gap, watch where it goes</span>
          </NuxtLink>
          <NuxtLink to="/tide" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">tide</span>
            <span class="text-neutral-500 ml-2">&mdash; legibility changes with the hour</span>
          </NuxtLink>
          <NuxtLink to="/half-life" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">half-life</span>
            <span class="text-neutral-500 ml-2">&mdash; a text with a lifespan</span>
          </NuxtLink>
        </div>
      </section>

      <section class="mb-8">
        <p class="text-xs text-neutral-700 mb-3">attend</p>
        <div class="grid gap-2">
          <NuxtLink to="/threshold" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">threshold</span>
            <span class="text-neutral-500 ml-2">&mdash; find the signal in the noise</span>
          </NuxtLink>
          <NuxtLink to="/decay" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">decay</span>
            <span class="text-neutral-500 ml-2">&mdash; read it before it's gone</span>
          </NuxtLink>
          <NuxtLink to="/absence" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">absence</span>
            <span class="text-neutral-500 ml-2">&mdash; only readable when you look away</span>
          </NuxtLink>
          <NuxtLink to="/interference" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">interference</span>
            <span class="text-neutral-500 ml-2">&mdash; two signals, one channel</span>
          </NuxtLink>
        </div>
      </section>

      <section class="mb-8">
        <p class="text-xs text-neutral-700 mb-3">participate</p>
        <div class="grid gap-2">
          <NuxtLink to="/echo" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">echo</span>
            <span class="text-neutral-500 ml-2">&mdash; type something and watch it dissolve</span>
          </NuxtLink>
          <NuxtLink to="/noise" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">noise</span>
            <span class="text-neutral-500 ml-2">&mdash; corrupt your own text</span>
          </NuxtLink>
          <NuxtLink to="/erasure" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">erasure</span>
            <span class="text-neutral-500 ml-2">&mdash; click to erase, what remains is yours</span>
          </NuxtLink>
          <NuxtLink to="/gather" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">gather</span>
            <span class="text-neutral-500 ml-2">&mdash; click to save words from the noise</span>
          </NuxtLink>
          <NuxtLink to="/resonance" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">resonance</span>
            <span class="text-neutral-500 ml-2">&mdash; click to listen</span>
          </NuxtLink>
          <NuxtLink to="/without" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">without</span>
            <span class="text-neutral-500 ml-2">&mdash; remove a letter, watch what it held</span>
          </NuxtLink>
        </div>
      </section>

      <section>
        <p class="text-xs text-neutral-700 mb-3">explore</p>
        <div class="grid gap-2">
          <NuxtLink to="/room" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">room</span>
            <span class="text-neutral-500 ml-2">&mdash; a small place to move through</span>
          </NuxtLink>
          <NuxtLink to="/path" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">path</span>
            <span class="text-neutral-500 ml-2">&mdash; the address bar is a text field</span>
          </NuxtLink>
          <NuxtLink to="/shift" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">shift</span>
            <span class="text-neutral-500 ml-2">&mdash; read it again tomorrow</span>
          </NuxtLink>
          <NuxtLink to="/return" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">return</span>
            <span class="text-neutral-500 ml-2">&mdash; it remembers you came back</span>
          </NuxtLink>
          <NuxtLink to="/thread" class="group">
            <span class="text-neutral-400 group-hover:text-neutral-200 transition-colors">thread</span>
            <span class="text-neutral-500 ml-2">&mdash; your path through here, made visible</span>
          </NuxtLink>
        </div>
      </section>
    </main>

    <Elsewhere
      :suggestions="[
        { to: '/writing', label: 'writing', note: 'essays and longer thoughts' },
        { to: '/fragment', label: 'fragment', note: 'one sentence, no context' },
      ]"
    />
  </div>
</template>
