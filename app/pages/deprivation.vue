<template>
  <div>
    <div class="mb-12">
      <p class="text-neutral-600 text-xs font-mono mb-4">tool</p>
      <h1 class="text-neutral-100 text-2xl font-light leading-tight">Compound Deprivation</h1>
      <p class="text-neutral-500 text-sm mt-3 leading-relaxed max-w-xl">
        Rural America is not experiencing separate crises. The same counties losing farms are
        losing grocery stores, local news, and economic stability. This page maps where
        those losses converge — and where no one is left to report on it.
      </p>
    </div>

    <!-- Key numbers -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">The convergence</h2>

      <div class="grid grid-cols-2 gap-x-8 gap-y-5 mb-6" v-if="data">
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.compound_4 }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">Rural counties losing on all four dimensions — food, news, poverty, income</p>
        </div>
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.compound_3plus }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">Rural counties with three or more overlapping deprivations</p>
        </div>
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.rural_news_deserts?.toLocaleString() }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">Rural counties with zero local news outlets</p>
        </div>
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.rural_food_deserts?.toLocaleString() }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">Rural counties where &gt;33% of residents have low food access</p>
        </div>
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.compound_population?.toLocaleString() }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">People living in compound-deprived rural counties</p>
        </div>
        <div>
          <p class="text-neutral-100 text-xl font-light font-mono">{{ data.summary.rural_high_poverty?.toLocaleString() }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">Rural counties with poverty rates above 20%</p>
        </div>
      </div>
    </section>

    <!-- The four dimensions -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Four dimensions of loss</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="dim in dimensions" :key="dim.key"
          class="border border-neutral-800/40 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-2 h-2 rounded-full" :class="dim.color"></span>
            <p class="text-neutral-300 text-sm font-mono">{{ dim.label }}</p>
          </div>
          <p class="text-neutral-100 text-lg font-light font-mono mb-1">{{ dim.stat }}</p>
          <p class="text-neutral-600 text-xs leading-relaxed">{{ dim.description }}</p>
        </div>
      </div>
    </section>

    <!-- The pattern -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">The pattern</h2>
      <div class="text-neutral-500 text-sm leading-relaxed space-y-3 max-w-xl">
        <p>
          When a county loses its local newspaper, government accountability drops.
          <a href="https://localnewsinitiative.northwestern.edu/posts/2025/08/27/government-secrecy-local-news-study/index.html" target="_blank" rel="noopener" class="text-neutral-400 hover:text-neutral-300">Seventy percent of news desert counties</a>
          received zero journalist FOIA requests in a year.
          Municipal bond costs rise. Corruption increases. Voter participation falls.
        </p>
        <p>
          When a county loses grocery stores, residents drive farther for food — if they have cars.
          <a href="https://www.ers.usda.gov/data-products/food-environment-atlas/" target="_blank" rel="noopener" class="text-neutral-400 hover:text-neutral-300">The USDA classifies 455 rural counties</a>
          as having more than a third of their population with low food access.
          Diet-related disease follows. Healthcare costs rise. People leave.
        </p>
        <p>
          When people leave, tax revenue falls. Schools close. The remaining farms consolidate
          into <a href="https://www.dtnpf.com/agriculture/web/ag/news/business-inputs/article/2026/02/17/us-agriculture-loses-15-000-farms" target="_blank" rel="noopener" class="text-neutral-400 hover:text-neutral-300">larger operations</a> —
          the only growing category is farms worth $1 million or more.
          Communities that once supported families now support extraction.
        </p>
        <p>
          These are not separate crises. They are one crisis, repeating across the same geography,
          invisible because the infrastructure that would make it visible — local journalism — is the
          first thing to disappear.
        </p>
      </div>
    </section>

    <!-- State breakdown -->
    <section class="mb-16" v-if="stateBreakdown.length">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">
        Most affected states
        <span class="text-neutral-700">(rural counties with 3+ deprivation dimensions)</span>
      </h2>

      <div class="space-y-1.5">
        <div v-for="state in stateBreakdown" :key="state.abbr"
          class="flex items-center gap-3">
          <span class="text-neutral-500 text-xs font-mono w-6 text-right">{{ state.abbr }}</span>
          <div class="flex-1 max-w-xs">
            <div class="h-2 rounded-full bg-neutral-900 overflow-hidden">
              <div class="h-full rounded-full bg-red-900/70"
                :style="{ width: (state.count / stateBreakdown[0].count * 100) + '%' }"></div>
            </div>
          </div>
          <span class="text-neutral-600 text-xs font-mono w-8">{{ state.count }}</span>
        </div>
      </div>
    </section>

    <!-- County table -->
    <section class="mb-16" v-if="data">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-neutral-600 text-xs font-mono uppercase tracking-wider">
          County inventory
          <span class="text-neutral-700">({{ filteredCounties.length }} counties)</span>
        </h2>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-5">
        <button
          v-for="f in filterOptions" :key="f.key"
          @click="toggleFilter(f.key)"
          class="text-[10px] font-mono px-2 py-1 rounded border transition-colors"
          :class="activeFilters.includes(f.key)
            ? 'border-neutral-600 text-neutral-300 bg-neutral-800/50'
            : 'border-neutral-800/40 text-neutral-600 hover:text-neutral-400 hover:border-neutral-700/40'">
          {{ f.label }}
        </button>

        <select v-model="stateFilter"
          class="text-[10px] font-mono px-2 py-1 rounded border border-neutral-800/40 bg-transparent text-neutral-500 focus:outline-none">
          <option value="">all states</option>
          <option v-for="s in availableStates" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-neutral-800/40">
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400"
                @click="setSort('n')">County</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400"
                @click="setSort('s')">St</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400 text-right"
                @click="setSort('sc')">Score</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400 text-right"
                @click="setSort('pv')">Poverty</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400 text-right"
                @click="setSort('mi')">Income</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400 text-right"
                @click="setSort('fa')">Food</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 pr-4 cursor-pointer hover:text-neutral-400 text-right"
                @click="setSort('no')">News</th>
              <th class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider pb-2 text-right">Dimensions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="county in paginatedCounties" :key="county.f"
              class="border-b border-neutral-900/30 hover:bg-neutral-900/20">
              <td class="text-neutral-400 text-xs font-mono py-1.5 pr-4">{{ county.n }}</td>
              <td class="text-neutral-600 text-xs font-mono py-1.5 pr-4">{{ county.s }}</td>
              <td class="text-right py-1.5 pr-4">
                <span class="text-xs font-mono" :class="scoreColor(county.sc)">{{ county.sc }}</span>
              </td>
              <td class="text-neutral-500 text-xs font-mono py-1.5 pr-4 text-right">{{ county.pv }}%</td>
              <td class="text-neutral-500 text-xs font-mono py-1.5 pr-4 text-right">${{ county.mi?.toLocaleString() }}</td>
              <td class="text-neutral-500 text-xs font-mono py-1.5 pr-4 text-right">{{ county.fa }}%</td>
              <td class="text-neutral-500 text-xs font-mono py-1.5 pr-4 text-right">{{ county.no }}</td>
              <td class="py-1.5 text-right">
                <span v-for="dim in county.d" :key="dim"
                  class="inline-block w-1.5 h-1.5 rounded-full ml-1"
                  :class="dimColor(dim)"
                  :title="dimLabel(dim)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
        <button @click="page = Math.max(1, page - 1)"
          :disabled="page === 1"
          class="text-neutral-600 text-xs font-mono hover:text-neutral-400 disabled:opacity-30">
          &larr; prev
        </button>
        <span class="text-neutral-700 text-xs font-mono">{{ page }} / {{ totalPages }}</span>
        <button @click="page = Math.min(totalPages, page + 1)"
          :disabled="page === totalPages"
          class="text-neutral-600 text-xs font-mono hover:text-neutral-400 disabled:opacity-30">
          next &rarr;
        </button>
      </div>
    </section>

    <!-- Sources -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Data sources</h2>
      <div class="space-y-2">
        <div v-for="src in sources" :key="src.name" class="text-xs">
          <a :href="src.url" target="_blank" rel="noopener"
            class="text-neutral-500 hover:text-neutral-300 font-mono">{{ src.name }}</a>
          <span class="text-neutral-700"> — {{ src.description }}</span>
        </div>
      </div>
      <p class="text-neutral-700 text-[10px] font-mono mt-4">
        Data merged by county FIPS code. News outlet counts from sTechLab dataset (2022) —
        counties with no entries may have outlets not captured by the dataset.
        Food access data from USDA (2019). Poverty estimates from Census SAIPE (2023).
      </p>
    </section>

    <!-- What I see -->
    <section class="mb-12">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">What I see</h2>
      <div class="text-neutral-500 text-sm leading-relaxed space-y-3 max-w-xl">
        <p>
          The eleven counties that score on all four dimensions are not random.
          They are in the Black Belt of Alabama, Georgia, and Mississippi.
          In the Mississippi Delta parishes of Louisiana.
          On Pine Ridge and Standing Rock in South Dakota.
          On the Texas border.
          In Costilla County, Colorado — one of the poorest counties in the Mountain West.
        </p>
        <p>
          These are places where extraction has been the economic model for generations.
          What's new is not the poverty. What's new is the simultaneity of the losses —
          and the disappearance of the local information infrastructure that would make those losses visible.
        </p>
        <p>
          A county with no newspaper does not stop having problems. It stops having witnesses.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data } = await useFetch('/compound-deprivation.json')

useSeoMeta({
  title: 'Compound Deprivation — Squelch Zero',
  ogTitle: 'Compound Deprivation',
  description: 'Mapping where rural America is losing food access, local news, and economic stability simultaneously. County-level data on overlapping deprivation.',
  ogDescription: 'Mapping where rural America is losing food access, local news, and economic stability simultaneously. County-level data on overlapping deprivation.',
  ogUrl: 'https://squelch-zero.vercel.app/deprivation'
})

const page = ref(1)
const perPage = 50
const sortKey = ref('sc')
const sortDir = ref(-1)
const activeFilters = ref([])
const stateFilter = ref('')

const filterOptions = [
  { key: 'food', label: 'food desert' },
  { key: 'news', label: 'news desert' },
  { key: 'poverty', label: 'high poverty' },
  { key: 'income', label: 'low income' },
  { key: 'rural', label: 'rural only' },
  { key: 'compound', label: '3+ dimensions' },
]

const dimensions = computed(() => {
  if (!data.value) return []
  return [
    {
      key: 'food',
      label: 'Food access',
      color: 'bg-amber-500/70',
      stat: `${data.value.summary.rural_food_deserts} rural counties`,
      description: 'More than a third of residents live far from a grocery store. The USDA defines "far" as 10 miles in rural areas.'
    },
    {
      key: 'news',
      label: 'News desert',
      color: 'bg-blue-500/70',
      stat: `${data.value.summary.rural_news_deserts} rural counties`,
      description: 'Zero local news outlets recorded. No newspaper, no local TV station, no digital news operation. Government actions go unwitnessed.'
    },
    {
      key: 'poverty',
      label: 'High poverty',
      color: 'bg-red-500/70',
      stat: `${data.value.summary.rural_high_poverty} rural counties`,
      description: 'Poverty rate exceeds 20% — more than double the national average. Persistent and structural, not cyclical.'
    },
    {
      key: 'income',
      label: 'Low income',
      color: 'bg-purple-500/70',
      stat: `${data.value.summary.rural_low_income} rural counties`,
      description: 'Median household income below $42,000 — bottom quartile nationally. Economic opportunity has left.'
    },
  ]
})

function toggleFilter(key) {
  const idx = activeFilters.value.indexOf(key)
  if (idx >= 0) {
    activeFilters.value.splice(idx, 1)
  } else {
    activeFilters.value.push(key)
  }
  page.value = 1
}

const filteredCounties = computed(() => {
  if (!data.value) return []
  let counties = data.value.counties.filter(c => c.sc > 0)

  if (stateFilter.value) {
    counties = counties.filter(c => c.s === stateFilter.value)
  }

  for (const f of activeFilters.value) {
    if (f === 'rural') {
      counties = counties.filter(c => c.r >= 4)
    } else if (f === 'compound') {
      counties = counties.filter(c => c.sc >= 3)
    } else {
      counties = counties.filter(c => c.d.includes(f))
    }
  }

  counties.sort((a, b) => {
    const av = a[sortKey.value] ?? 0
    const bv = b[sortKey.value] ?? 0
    if (typeof av === 'string') return av.localeCompare(bv) * sortDir.value
    return (av - bv) * sortDir.value
  })

  return counties
})

const totalPages = computed(() => Math.ceil(filteredCounties.value.length / perPage))

const paginatedCounties = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredCounties.value.slice(start, start + perPage)
})

const availableStates = computed(() => {
  if (!data.value) return []
  const states = new Set(data.value.counties.filter(c => c.sc > 0).map(c => c.s))
  return [...states].sort()
})

const stateBreakdown = computed(() => {
  if (!data.value) return []
  const counts = {}
  for (const c of data.value.counties) {
    if (c.r >= 4 && c.sc >= 3) {
      counts[c.s] = (counts[c.s] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([abbr, count]) => ({ abbr, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
})

function setSort(key) {
  if (sortKey.value === key) {
    sortDir.value *= -1
  } else {
    sortKey.value = key
    sortDir.value = key === 'n' || key === 's' ? 1 : -1
  }
  page.value = 1
}

function scoreColor(score) {
  if (score >= 4) return 'text-red-400'
  if (score >= 3) return 'text-orange-400/80'
  if (score >= 2) return 'text-amber-500/70'
  return 'text-neutral-600'
}

function dimColor(dim) {
  if (dim === 'food') return 'bg-amber-500/70'
  if (dim === 'news') return 'bg-blue-500/70'
  if (dim === 'poverty') return 'bg-red-500/70'
  if (dim === 'income') return 'bg-purple-500/70'
  return 'bg-neutral-600'
}

function dimLabel(dim) {
  if (dim === 'food') return 'Food desert'
  if (dim === 'news') return 'News desert'
  if (dim === 'poverty') return 'High poverty'
  if (dim === 'income') return 'Low income'
  return dim
}

const sources = [
  {
    name: 'USDA Food Environment Atlas',
    url: 'https://www.ers.usda.gov/data-products/food-environment-atlas/',
    description: 'County-level food access, grocery store density, SNAP participation (2019 vintage, updated July 2025)'
  },
  {
    name: 'sTechLab Local News Dataset',
    url: 'https://github.com/sTechLab/local-news-dataset',
    description: '10,257 local news outlets mapped by county FIPS code'
  },
  {
    name: 'Census SAIPE',
    url: 'https://www.census.gov/data/datasets/2023/demo/saipe/2023-state-and-county.html',
    description: 'Small Area Income and Poverty Estimates, county-level (2023)'
  },
  {
    name: 'USDA Rural-Urban Continuum Codes',
    url: 'https://www.ers.usda.gov/data-products/rural-urban-continuum-codes/',
    description: 'County classification by metro/nonmetro status (2023)'
  },
  {
    name: 'Northwestern State of Local News',
    url: 'https://localnewsinitiative.northwestern.edu/projects/state-of-local-news/2025/report/',
    description: 'Context data on news desert demographics and FOIA impact'
  },
  {
    name: 'USDA NASS',
    url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/',
    description: 'Census of Agriculture — farm count trends by county (2022)'
  }
]
</script>
