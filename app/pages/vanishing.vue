<template>
  <div>
    <div class="mb-12">
      <p class="text-neutral-600 text-xs font-mono mb-4">tool</p>
      <h1 class="text-neutral-100 text-2xl font-light leading-tight">Vanishing Point</h1>
      <p class="text-neutral-500 text-sm mt-3 leading-relaxed max-w-lg">
        A running inventory of federal data infrastructure destroyed since January 2025.
        Organized by what can no longer be measured.
      </p>
    </div>

    <!-- Key numbers -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">The scope</h2>

      <div class="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div v-for="stat in scopeStats" :key="stat.value">
          <p class="text-neutral-100 text-xl font-light font-mono">{{ stat.value }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- What can no longer be measured -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-8 uppercase tracking-wider">What can no longer be measured</h2>

      <div class="space-y-10">
        <div v-for="item in blindSpots" :key="item.subject"
          class="border-l-2 pl-5"
          :class="statusBorder(item.status)">

          <div class="flex items-baseline justify-between gap-4 mb-2">
            <h3 class="text-neutral-200 text-sm font-light">{{ item.subject }}</h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded shrink-0"
              :class="statusBadge(item.status)">{{ item.status }}</span>
          </div>

          <p class="text-neutral-500 text-xs leading-relaxed mb-3">{{ item.description }}</p>

          <div class="space-y-2 mb-3">
            <div v-for="dataset in item.datasets" :key="dataset.name"
              class="bg-neutral-900/30 rounded px-3 py-2">
              <div class="flex items-baseline justify-between gap-2">
                <p class="text-neutral-300 text-xs font-mono">{{ dataset.name }}</p>
                <p class="text-neutral-600 text-[10px] font-mono">{{ dataset.agency }}</p>
              </div>
              <p class="text-neutral-500 text-[11px] mt-1 leading-relaxed">{{ dataset.detail }}</p>
            </div>
          </div>

          <div v-if="item.downstream.length" class="mt-3">
            <p class="text-neutral-700 text-[10px] font-mono uppercase tracking-wider mb-1">depends on this</p>
            <p class="text-neutral-600 text-xs leading-relaxed">{{ item.downstream.join(' · ') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- The Streaks -->
    <section class="mb-16 border-t border-neutral-800/30 pt-12">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Broken records</h2>

      <div class="space-y-5">
        <div v-for="streak in brokenStreaks" :key="streak.metric"
          class="border border-neutral-800/40 rounded-lg p-4">
          <p class="text-neutral-100 text-lg font-light font-mono">{{ streak.years }}</p>
          <p class="text-neutral-400 text-xs mt-1">{{ streak.metric }}</p>
          <p class="text-neutral-600 text-[11px] mt-1">{{ streak.detail }}</p>
        </div>
      </div>
    </section>

    <!-- Agency damage -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Agency workforce losses</h2>

      <div class="space-y-2">
        <div v-for="agency in agencies" :key="agency.name"
          class="flex items-center gap-3 py-2 border-b border-neutral-800/20">
          <p class="text-neutral-300 text-xs font-mono w-20 shrink-0">{{ agency.cut }}</p>
          <div class="flex-1">
            <div class="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all"
                :class="agency.pct >= 30 ? 'bg-red-900/80' : agency.pct >= 20 ? 'bg-amber-900/60' : 'bg-neutral-700'"
                :style="{ width: agency.pct + '%' }"></div>
            </div>
          </div>
          <p class="text-neutral-400 text-xs w-48 shrink-0 text-right">{{ agency.name }}</p>
        </div>
      </div>
      <p class="text-neutral-700 text-[10px] font-mono mt-3">
        25,000+ federal science staff lost in 2025. 10,000+ STEM PhDs left government.
      </p>
    </section>

    <!-- Preservation -->
    <section class="mb-16 border-t border-neutral-800/30 pt-12">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Preservation efforts</h2>
      <p class="text-neutral-500 text-xs leading-relaxed mb-4">
        Others are trying to save what they can. None of these replace the original collection infrastructure.
      </p>

      <div class="space-y-2">
        <a v-for="effort in preservationEfforts" :key="effort.name"
          :href="effort.url" target="_blank" rel="noopener"
          class="block border border-neutral-800/40 rounded-lg p-3 hover:border-neutral-700/60 transition-colors">
          <div class="flex items-baseline justify-between gap-3">
            <p class="text-neutral-300 text-xs font-mono">{{ effort.name }}</p>
            <p class="text-neutral-700 text-[10px] font-mono">{{ effort.org }}</p>
          </div>
          <p class="text-neutral-500 text-[11px] mt-1">{{ effort.description }}</p>
        </a>
      </div>
    </section>

    <!-- The point -->
    <section class="mb-16 border-t border-neutral-800/30 pt-12">
      <div class="space-y-4">
        <p class="text-neutral-400 text-sm leading-relaxed">
          This is not a list of budget cuts. It is a map of <span class="text-neutral-200">what becomes invisible</span>.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          You cannot manage what you cannot measure. You cannot fix what you cannot see.
          When the instruments go dark, the problems do not disappear — they just become
          impossible to prove.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          Every dataset on this page existed because someone decided, decades ago, that
          it mattered to know. That hunger should be counted. That disasters should be
          tracked. That emissions should be reported. That the price of things should be
          measured every month without interruption.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          The decision to stop knowing is not a cost savings. It is a policy choice
          about what is allowed to be true.
        </p>
      </div>
    </section>

    <!-- Sources -->
    <section class="border-t border-neutral-800/30 pt-8">
      <p class="text-neutral-700 text-xs font-mono mb-3">sources</p>
      <p class="text-neutral-600 text-xs leading-relaxed">
        American Statistical Association, "The Nation's Data at Risk: 2025 Report" (December 2025).
        Bureau of Labor Statistics, shutdown impact statements (November 2025, February 2026).
        Center on Budget and Policy Priorities, "Federal Data Are Disappearing" (2025).
        Environmental Protection Agency, GHGRP reconsideration proposal (September 2025).
        Harvard Law Library Innovation Lab, Data.gov Archive (February 2025).
        KFF, "A Look at Federal Health Data Taken Offline" (2025).
        Nature, federal science workforce analysis (January 2026).
        Richmond Federal Reserve, "Phantom Figures: Missing Data in October" (2025).
        STAT News, CDC NHANES staff elimination (October 2025).
        USDA, food security survey termination announcement (September 2025).
      </p>
      <p class="text-neutral-700 text-xs font-mono mt-4 mb-2">last updated</p>
      <p class="text-neutral-600 text-xs">February 2026</p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Vanishing Point — Squelch Zero',
  ogTitle: 'Vanishing Point',
  description: 'A running inventory of federal data infrastructure destroyed since January 2025. Organized by what can no longer be measured.',
  ogDescription: 'A running inventory of federal data infrastructure destroyed since January 2025. Organized by what can no longer be measured.',
  ogUrl: 'https://squelch-zero.vercel.app/vanishing'
})

const scopeStats = [
  { value: '13 of 13', label: 'Federal statistical agencies lost staff — no exceptions' },
  { value: '25,000+', label: 'Federal science agency staff lost in 2025' },
  { value: '8,000+', label: 'Government web pages removed or altered' },
  { value: '~3,000', label: 'Federal datasets taken offline' },
  { value: '104 years', label: 'Monthly CPI streak broken — first gap since January 1921' },
  { value: '2', label: 'Government shutdowns in five months (Oct 2025, Jan 2026)' }
]

const blindSpots = [
  {
    subject: 'Hunger in America',
    status: 'terminated',
    description: 'The only nationally representative survey measuring food insecurity at state and national level. Thirty years of continuous data. The final report was published October 2025.',
    datasets: [
      {
        name: 'CPS Food Security Supplement',
        agency: 'USDA',
        detail: 'Terminated September 2025. December 2025 data collection cancelled. USDA called the 30-year survey "redundant, costly, politicized, and extraneous."'
      },
      {
        name: 'Household Food Security Report',
        agency: 'USDA/ERS',
        detail: '2024 report (final update) showed food insecurity remained elevated. No future measurement planned.'
      }
    ],
    downstream: ['SNAP eligibility criteria', 'WIC allocations', 'School meal programs', 'Congressional food policy']
  },
  {
    subject: 'Weather disaster costs',
    status: 'terminated',
    description: 'The authoritative record of billion-dollar weather and climate disasters in the United States. Forty-five years of continuous tracking. Used by FEMA, insurers, Congress, and state governments.',
    datasets: [
      {
        name: 'Billion-Dollar Disaster Database',
        agency: 'NOAA',
        detail: 'Terminated May 2025. Tracked 403 disasters, $2.9 trillion in damages since 1980. NBC analysis found cancelled data would have shown costliest 6 months of weather disasters on record.'
      }
    ],
    downstream: ['FEMA resource allocation', 'Insurance risk models', 'State emergency planning', 'Congressional disaster appropriations']
  },
  {
    subject: 'Industrial emissions',
    status: 'at risk',
    description: 'The only facility-level accounting of greenhouse gas emissions from U.S. industry. Fifteen years of data from approximately 8,000 facilities. Separately, EPA rescinded the 2009 Greenhouse Gas Endangerment Finding on February 12, 2026 — eliminating the legal foundation for federal greenhouse gas regulation.',
    datasets: [
      {
        name: 'Greenhouse Gas Reporting Program',
        agency: 'EPA',
        detail: 'Proposed for elimination September 2025. Comment period closed November 2025. If finalized, no industries would submit reports with 2025 data. EPA claims $2.4 billion in savings for businesses.'
      }
    ],
    downstream: ['Climate policy enforcement', 'Environmental justice mapping', 'State emissions tracking', 'Corporate ESG verification']
  },
  {
    subject: 'National nutrition and health',
    status: 'degraded',
    description: 'The only survey that combines physical examinations with interviews to track Americans\' nutrition and health status. No other dataset can detect trends in obesity, diabetes, lead exposure, or nutritional deficiencies at the national level.',
    datasets: [
      {
        name: 'NHANES',
        agency: 'CDC',
        detail: 'Entire Planning Branch laid off October 2025 — not reversed. Division lost ~100 staff total. American Society for Nutrition warned layoffs "threaten future NHANES cycles."'
      },
      {
        name: 'PRAMS',
        agency: 'CDC',
        detail: 'Pregnancy Risk Assessment Monitoring System. Entire staff (~20) placed on administrative leave April 2025.'
      }
    ],
    downstream: ['FDA food labeling', 'Fortification standards', 'Dietary guidelines', 'Lead exposure tracking', 'Obesity/diabetes surveillance']
  },
  {
    subject: 'Drug emergencies',
    status: 'terminated',
    description: 'The two primary systems for tracking substance abuse and drug-related medical emergencies in the United States.',
    datasets: [
      {
        name: 'DAWN',
        agency: 'CDC',
        detail: 'Drug Abuse Warning Network discontinued June 2025. Tracked ~8.4 million drug-related ER visits per year.'
      },
      {
        name: 'NSDUH',
        agency: 'SAMHSA',
        detail: 'National Survey on Drug Use and Health. Statisticians responsible for NSDUH laid off May 2025. 2024 report published without listing any SAMHSA authors — first time in at least a decade.'
      }
    ],
    downstream: ['Opioid response funding', 'Substance abuse treatment planning', 'Overdose prevention programs', 'DEA scheduling decisions']
  },
  {
    subject: 'Inflation',
    status: 'degraded',
    description: 'The Consumer Price Index is the primary measure of inflation in the United States. It directly determines Social Security payments, tax brackets, TIPS bond returns, and Federal Reserve interest rate decisions.',
    datasets: [
      {
        name: 'CPI',
        agency: 'BLS',
        detail: 'Collection suspended in three cities, reduced ~15% in 72 others. October 2025 report cancelled entirely — first gap since January 1921. September prices carried forward. BLS Commissioner fired August 2025.'
      },
      {
        name: 'Producer Price Index',
        agency: 'BLS',
        detail: '350 PPI datasets discontinued effective July 2025. Affects wholesale price tracking across industries.'
      }
    ],
    downstream: ['Social Security COLA for 67M beneficiaries', 'Federal Reserve rate decisions', 'TIPS bond adjustments', 'Inflation-indexed tax brackets', 'Federal contract escalation clauses']
  },
  {
    subject: 'Employment',
    status: 'degraded',
    description: 'Monthly employment data drives Federal Reserve policy, congressional budgets, and business decisions. The household survey that produces the unemployment rate cannot be collected retroactively — once a month is missed, that data is gone.',
    datasets: [
      {
        name: 'Current Population Survey',
        agency: 'BLS/Census',
        detail: 'October 2025 household data not collected due to shutdown. First gap in unemployment rate since January 1948. January 2026 jobs report delayed by second shutdown.'
      },
      {
        name: 'JOLTS',
        agency: 'BLS',
        detail: 'Job Openings and Labor Turnover Survey. September and December releases delayed or cancelled.'
      }
    ],
    downstream: ['Federal Reserve monetary policy', 'Congressional budget projections', 'Unemployment insurance programs', 'Business hiring decisions']
  },
  {
    subject: 'Crime',
    status: 'degraded',
    description: 'Federal crime data infrastructure has been systematically stripped. The National Criminal Justice Reference Service — one of the world\'s largest criminal justice research libraries — was blocked from public access.',
    datasets: [
      {
        name: 'NCJRS',
        agency: 'DOJ',
        detail: 'National Criminal Justice Reference Service blocked from public access. 1,180+ pages removed including all state-level crime data.'
      },
      {
        name: 'National Law Enforcement Accountability Database',
        agency: 'DOJ',
        detail: 'Removed entirely. Gender identity questions stripped from National Crime Victimization Survey. Racial/ethnic disparity data on juvenile justice removed.'
      }
    ],
    downstream: ['State criminal justice reform', 'Police accountability', 'Victimization tracking', 'Federal sentencing policy']
  },
  {
    subject: 'Education research',
    status: 'degraded',
    description: 'ERIC is the largest education research database in the world. Half a century of indexed research, used by every education researcher, policymaker, and school district in the country.',
    datasets: [
      {
        name: 'ERIC',
        agency: 'IES/Dept. of Education',
        detail: 'Budget slashed 50% April 2025 after DOGE refused to disburse approved funds. Indexed sources cut ~45% (from 1,283 journals to ~706). Public helpdesk eliminated.'
      }
    ],
    downstream: ['Education policy research', 'Teacher training programs', 'School district planning', 'Federal education funding decisions']
  },
  {
    subject: 'Energy markets',
    status: 'degraded',
    description: 'The Energy Information Administration is the primary source of energy data for markets, utilities, and foreign governments worldwide.',
    datasets: [
      {
        name: 'International Energy Outlook',
        agency: 'EIA',
        detail: 'Scrapped for 2025. Solar photovoltaic module shipment report discontinued. Petroleum reports delayed. ~40% of staff lost.'
      }
    ],
    downstream: ['Energy commodity pricing', 'Utility infrastructure planning', 'Foreign government energy policy', 'Grid reliability assessment']
  },
  {
    subject: 'Population and demographics',
    status: 'degraded',
    description: 'Census data determines the distribution of $2.8 trillion in annual federal funding and the apportionment of congressional seats.',
    datasets: [
      {
        name: 'Census Bureau research & ACS',
        agency: 'Census Bureau',
        detail: '1,300+ employees lost (15%+ of workforce). 3,000 pages of research materials removed. American Community Survey threatened by legislation limiting contact attempts.'
      }
    ],
    downstream: ['$2.8 trillion annual federal funding distribution', 'Congressional apportionment', 'Redistricting', 'Emergency response planning']
  }
]

const brokenStreaks = [
  {
    years: '104 years',
    metric: 'Monthly Consumer Price Index — continuous since January 1921',
    detail: 'October 2025 CPI cancelled due to government shutdown. First gap in the series since Warren G. Harding was president.'
  },
  {
    years: '78 years',
    metric: 'Monthly unemployment rate — continuous since January 1948',
    detail: 'October 2025 household survey data not collected. Cannot be collected retroactively. The gap is permanent.'
  },
  {
    years: '45 years',
    metric: 'NOAA billion-dollar disaster tracking — continuous since 1980',
    detail: 'Terminated May 2025. Climate Central has taken over, but institutional continuity is broken.'
  },
  {
    years: '30 years',
    metric: 'USDA food security measurement — continuous since 1995',
    detail: 'Terminated September 2025. No replacement planned. The last data point is 2024.'
  }
]

const agencies = [
  { name: 'Energy Information Administration', cut: '~40%', pct: 40 },
  { name: 'IRS (Research & Statistics)', cut: '~29%', pct: 29 },
  { name: 'NOAA', cut: '~27%', pct: 27 },
  { name: 'Bureau of Labor Statistics', cut: '~25%', pct: 25 },
  { name: 'USDA (NASS/ERS)', cut: '~25%', pct: 25 },
  { name: 'CDC', cut: '~21%', pct: 21 },
  { name: 'Census Bureau', cut: '~15%', pct: 15 }
]

const preservationEfforts = [
  {
    name: 'Data.gov Archive',
    org: 'Harvard Law Library',
    description: '16TB archive of 311,000+ datasets harvested from data.gov. Updated daily.',
    url: 'https://lil.law.harvard.edu/blog/2025/02/06/announcing-data-gov-archive/'
  },
  {
    name: 'EssentialData.us',
    org: 'Denice W. Ross',
    description: '"Dearly Departed Dataset Graveyard" — tracking terminated and at-risk federal datasets.',
    url: 'https://essentialdata.us'
  },
  {
    name: 'Climate Central Disaster Database',
    org: 'Climate Central',
    description: 'Took over NOAA billion-dollar disaster tracking July 2025.',
    url: 'https://www.climatecentral.org/climate-services/billion-dollar-disasters'
  },
  {
    name: 'Data Rescue Project',
    org: 'IASSIST / RDAP / DCN',
    description: 'Coalition clearinghouse for federal data rescue and preservation efforts.',
    url: 'https://www.datarescueproject.org'
  },
  {
    name: 'Restored CDC',
    org: 'Independent',
    description: 'Maintains copies of removed CDC web pages and data documentation.',
    url: 'https://www.restoredcdc.org'
  },
  {
    name: 'KFF Health Data Tracker',
    org: 'KFF',
    description: 'Tracking federal health data taken offline with status updates.',
    url: 'https://www.kff.org'
  }
]

function statusBorder(status) {
  if (status === 'terminated') return 'border-red-900/70'
  if (status === 'degraded') return 'border-amber-900/50'
  if (status === 'at risk') return 'border-yellow-900/40'
  return 'border-neutral-800/50'
}

function statusBadge(status) {
  if (status === 'terminated') return 'bg-red-950/60 text-red-400/80'
  if (status === 'degraded') return 'bg-amber-950/40 text-amber-500/70'
  if (status === 'at risk') return 'bg-yellow-950/30 text-yellow-500/60'
  return 'bg-neutral-900 text-neutral-500'
}
</script>
