<template>
  <div>
    <div class="mb-12">
      <p class="text-neutral-600 text-xs font-mono mb-4">tool</p>
      <h1 class="text-neutral-100 text-2xl font-light leading-tight">Healthcare Extraction Map</h1>
      <p class="text-neutral-500 text-sm mt-3 leading-relaxed max-w-lg">
        Three mechanisms extract wealth from American healthcare.
        They are not separate problems. They are one system, run by the same companies.
      </p>
    </div>

    <!-- Corporate Structure -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">The structure</h2>

      <div class="space-y-3">
        <div v-for="company in companies" :key="company.name"
          class="border border-neutral-800/40 rounded-lg p-4 hover:border-neutral-700/60 transition-colors">
          <p class="text-neutral-200 text-sm font-mono mb-3">{{ company.name }}</p>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="arm in company.arms" :key="arm.label">
              <p class="text-neutral-600 text-[10px] font-mono uppercase tracking-wider">{{ arm.label }}</p>
              <p class="text-neutral-400 text-xs mt-0.5">{{ arm.entity }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-neutral-600 text-xs mt-4 leading-relaxed">
        Each company owns an insurer, a pharmacy benefit manager, and a pharmacy chain.
        Each arm participates in a different extraction mechanism.
        All three feed the same parent.
      </p>
    </section>

    <!-- Mechanism 1: Algorithmic Denials -->
    <section class="mb-16">
      <div class="flex items-baseline gap-3 mb-1">
        <h2 class="text-neutral-600 text-xs font-mono uppercase tracking-wider">Mechanism 1</h2>
        <span class="text-neutral-700 text-xs font-mono">via insurers</span>
      </div>
      <h3 class="text-neutral-200 text-lg font-light mb-6">Algorithmic Claim Denial</h3>

      <div class="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div v-for="stat in denialStats" :key="stat.value">
          <p class="text-neutral-100 text-xl font-light font-mono">{{ stat.value }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">{{ stat.label }}</p>
        </div>
      </div>

      <p class="text-neutral-600 text-xs leading-relaxed">
        Insurers deploy algorithms to deny claims at scale. The law requires physician review —
        so physicians review each denial in 1.2 seconds. 99.8% of patients never appeal.
        Of the 0.2% who do, 80% win — proving the denials were wrong.
        The system profits from the gap between denial and resistance.
      </p>
      <NuxtLink to="/signals/one-point-two-seconds" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors mt-2 inline-block">
        → read the full signal
      </NuxtLink>
    </section>

    <!-- Mechanism 2: PE Acquisitions -->
    <section class="mb-16">
      <div class="flex items-baseline gap-3 mb-1">
        <h2 class="text-neutral-600 text-xs font-mono uppercase tracking-wider">Mechanism 2</h2>
        <span class="text-neutral-700 text-xs font-mono">via acquisitions</span>
      </div>
      <h3 class="text-neutral-200 text-lg font-light mb-6">Private Equity Hospital Extraction</h3>

      <div class="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div v-for="stat in peStats" :key="stat.value">
          <p class="text-neutral-100 text-xl font-light font-mono">{{ stat.value }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">{{ stat.label }}</p>
        </div>
      </div>

      <p class="text-neutral-600 text-xs leading-relaxed">
        Private equity acquires hospitals with borrowed money, loads the debt onto the hospital,
        cuts staff to service the debt. Patients acquire infections at higher rates. People die
        at higher rates. The PE firm exits with hundreds of millions. The hospital files for bankruptcy.
      </p>
      <NuxtLink to="/signals/four-eighty-eight" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors mt-2 inline-block">
        → read the full signal
      </NuxtLink>
    </section>

    <!-- Mechanism 3: PBM Consolidation -->
    <section class="mb-16">
      <div class="flex items-baseline gap-3 mb-1">
        <h2 class="text-neutral-600 text-xs font-mono uppercase tracking-wider">Mechanism 3</h2>
        <span class="text-neutral-700 text-xs font-mono">via pbms</span>
      </div>
      <h3 class="text-neutral-200 text-lg font-light mb-6">Pharmacy Benefit Manager Consolidation</h3>

      <div class="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div v-for="stat in pbmStats" :key="stat.value">
          <p class="text-neutral-100 text-xl font-light font-mono">{{ stat.value }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">{{ stat.label }}</p>
        </div>
      </div>

      <p class="text-neutral-600 text-xs leading-relaxed">
        Three companies control 80% of all prescription drug distribution. They mark up specialty
        generics by thousands of percent, steer patients to their own pharmacies, reimburse
        independents below cost, and collect billions in spread pricing — billing insurers more
        than they pay pharmacies. The FTC documented $7.3 billion in excess revenue from markups
        alone over five years.
      </p>
      <NuxtLink to="/signals/eighty" class="text-neutral-600 text-xs font-mono hover:text-neutral-400 transition-colors mt-2 inline-block">
        → read the full signal
      </NuxtLink>
    </section>

    <!-- The Connection -->
    <section class="mb-16 border-t border-neutral-800/30 pt-12">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">The connection</h2>

      <div class="space-y-4 mb-6">
        <p class="text-neutral-400 text-sm leading-relaxed">
          These are not three separate crises. They are <span class="text-neutral-200">three extraction strategies operated by the same corporate structures</span>.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          UnitedHealth Group's insurer denies your claim algorithmically. Its PBM marks up
          your prescription. Its pharmacy chain captures the dispensing revenue. One company.
          Three points of extraction. The patient is the same person at every stage.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          Private equity adds a fourth dimension: acquire the institution itself, extract value
          through financial engineering, and leave the shell behind. The hospital that was supposed
          to treat you is now servicing the debt that was used to buy it.
        </p>
      </div>
    </section>

    <!-- Aggregate Numbers -->
    <section class="mb-16">
      <h2 class="text-neutral-600 text-xs font-mono mb-6 uppercase tracking-wider">Total extraction</h2>

      <div class="space-y-5">
        <div v-for="total in totals" :key="total.value"
          class="border-l-2 border-neutral-800/50 pl-4">
          <p class="text-neutral-100 text-2xl font-light font-mono">{{ total.value }}</p>
          <p class="text-neutral-500 text-xs mt-0.5 leading-relaxed">{{ total.label }}</p>
        </div>
      </div>
    </section>

    <!-- Sources -->
    <section class="border-t border-neutral-800/30 pt-8">
      <p class="text-neutral-700 text-xs font-mono mb-3">sources</p>
      <p class="text-neutral-600 text-xs leading-relaxed">
        FTC Interim Staff Reports on PBMs (July 2024, January 2025).
        JAMA (hospital-acquired conditions after PE acquisition, December 2023).
        Annals of Internal Medicine (ER mortality after PE acquisition, November 2025).
        KFF (ACA claims denials 2023; MA enrollment 2025).
        AMA (PBM market share analysis).
        PESP Private Equity Hospital Tracker (2025).
        Senate Budget Committee, "Profits Over Patients" (January 2025).
        NCPA (independent pharmacy surveys).
        Drug Channels Institute (PBM market data).
      </p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Healthcare Extraction Map — Squelch Zero',
  ogTitle: 'Healthcare Extraction Map',
  description: 'Three mechanisms extract wealth from American healthcare. They are not separate problems. They are one system, run by the same companies.',
  ogDescription: 'Three mechanisms extract wealth from American healthcare. They are not separate problems. They are one system, run by the same companies.',
  ogUrl: 'https://squelch-zero.vercel.app/extraction'
})

const companies = [
  {
    name: 'UnitedHealth Group',
    arms: [
      { label: 'insurer', entity: 'UnitedHealthcare' },
      { label: 'pbm', entity: 'OptumRx' },
      { label: 'pharmacy', entity: 'Optum Pharmacy' }
    ]
  },
  {
    name: 'CVS Health',
    arms: [
      { label: 'insurer', entity: 'Aetna' },
      { label: 'pbm', entity: 'CVS Caremark' },
      { label: 'pharmacy', entity: 'CVS Pharmacy' }
    ]
  },
  {
    name: 'Cigna / Evernorth',
    arms: [
      { label: 'insurer', entity: 'Cigna' },
      { label: 'pbm', entity: 'Express Scripts' },
      { label: 'pharmacy', entity: 'Accredo' }
    ]
  }
]

const denialStats = [
  { value: '1.2 sec', label: 'Average physician review time per denied claim (Cigna, 2022)' },
  { value: '300,000+', label: 'Claims denied by one algorithm in two months' },
  { value: '0.2%', label: 'Of denied claims that patients appeal' },
  { value: '80.7%', label: 'Of appealed denials overturned — proving they were wrong' },
  { value: '$19.7B', label: 'Annual hospital spending fighting claim denials' },
  { value: '$1.2T', label: 'Estimated Medicare Advantage overpayments over the next decade' }
]

const peStats = [
  { value: '488', label: 'U.S. hospitals currently owned by private equity' },
  { value: '+25.4%', label: 'Increase in hospital-acquired conditions after PE acquisition' },
  { value: '+7.0', label: 'Additional deaths per 10,000 ER visits at PE-acquired hospitals' },
  { value: '-11.6%', label: 'Decline in full-time hospital employees after acquisition' },
  { value: '6,000+', label: 'Physician practices now owned by private equity' },
  { value: '$800M', label: 'Extracted by Cerberus from Steward before $9B bankruptcy' }
]

const pbmStats = [
  { value: '79%', label: 'Of 6.6 billion U.S. prescriptions processed by three companies' },
  { value: '$7.3B', label: 'Excess revenue from specialty generic markups (FTC, 2017–2022)' },
  { value: '7,700%', label: 'Markup on Tadalafil at PBM-affiliated pharmacies (2022)' },
  { value: '68%', label: 'Of specialty drug revenue captured by PBM-affiliated pharmacies' },
  { value: '3,250+', label: 'Net retail pharmacy closures in 2024' },
  { value: '~50%', label: 'Of U.S. counties with at least one pharmacy desert' }
]

const totals = [
  { value: '$7.3B', label: 'PBM specialty generic markups documented by the FTC (2017–2022)' },
  { value: '$19.7B', label: 'Annual hospital spending fighting algorithmic claim denials' },
  { value: '$1.2T', label: 'Estimated Medicare Advantage overpayments, next decade' },
  { value: '3,738+', label: 'Hospitals and pharmacies closed or under PE/PBM pressure' },
  { value: '~50%', label: 'Of U.S. counties now contain a pharmacy desert' }
]
</script>
