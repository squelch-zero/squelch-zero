#!/usr/bin/env node

/**
 * Federal data endpoint monitor for Vanishing Point.
 * Checks a curated list of federal data URLs and records their status.
 * Results written to public/endpoint-status.json for the Vanishing Point page.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const OUTPUT_FILE = join(PROJECT_ROOT, 'public', 'endpoint-status.json')
const HISTORY_FILE = join(PROJECT_ROOT, 'public', 'endpoint-history.json')

const TIMEOUT_MS = 15000
const CONCURRENT_LIMIT = 5

// Endpoints organized by Vanishing Point category
const ENDPOINTS = [
  // Hunger in America
  {
    id: 'usda-food-security',
    category: 'Hunger in America',
    name: 'USDA Food Security Survey',
    url: 'https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/',
    expect: 'live' // may be redirected or stripped
  },
  {
    id: 'usda-food-security-data',
    category: 'Hunger in America',
    name: 'USDA Food Security Data',
    url: 'https://www.ers.usda.gov/data-products/food-security-in-the-united-states/',
    expect: 'live'
  },

  // Weather disaster costs
  {
    id: 'noaa-billions',
    category: 'Weather disaster costs',
    name: 'NOAA Billion-Dollar Disasters',
    url: 'https://www.ncei.noaa.gov/access/billions/',
    expect: 'down'
  },
  {
    id: 'climate-gov',
    category: 'Climate science infrastructure',
    name: 'Climate.gov',
    url: 'https://www.climate.gov/',
    expect: 'down'
  },

  // Industrial emissions
  {
    id: 'epa-ghgrp',
    category: 'Industrial emissions',
    name: 'EPA GHG Reporting Program',
    url: 'https://www.epa.gov/ghgreporting',
    expect: 'live'
  },
  {
    id: 'epa-ghgrp-data',
    category: 'Industrial emissions',
    name: 'EPA GHGRP Data Hub',
    url: 'https://ghgdata.epa.gov/ghgp/',
    expect: 'live'
  },
  {
    id: 'epa-endangerment',
    category: 'Industrial emissions',
    name: 'EPA Endangerment Finding',
    url: 'https://www.epa.gov/climate-change/endangerment-and-cause-or-contribute-findings-greenhouse-gases-under-section-202a',
    expect: 'live'
  },

  // Climate science infrastructure
  {
    id: 'nca-2023',
    category: 'Climate science infrastructure',
    name: 'National Climate Assessment (NCA5)',
    url: 'https://nca2023.globalchange.gov/',
    expect: 'down'
  },
  {
    id: 'globalchange-gov',
    category: 'Climate science infrastructure',
    name: 'GlobalChange.gov',
    url: 'https://www.globalchange.gov/',
    expect: 'down'
  },

  // National nutrition and health
  {
    id: 'cdc-nhanes',
    category: 'National nutrition and health',
    name: 'CDC NHANES',
    url: 'https://www.cdc.gov/nchs/nhanes/participant.htm',
    expect: 'live'
  },
  {
    id: 'cdc-prams',
    category: 'National nutrition and health',
    name: 'CDC PRAMS',
    url: 'https://www.cdc.gov/prams/',
    expect: 'live'
  },

  // Drug emergencies
  {
    id: 'samhsa-nsduh',
    category: 'Drug emergencies',
    name: 'SAMHSA NSDUH',
    url: 'https://www.samhsa.gov/data/data-we-collect/nsduh-national-survey-drug-use-and-health',
    expect: 'live'
  },

  // Inflation
  {
    id: 'bls-cpi',
    category: 'Inflation',
    name: 'BLS CPI Overview',
    url: 'https://www.bls.gov/cpi/',
    expect: 'live'
  },
  {
    id: 'bls-cpi-data',
    category: 'Inflation',
    name: 'BLS CPI Time Series',
    url: 'https://data.bls.gov/timeseries/CUUR0000SA0',
    expect: 'live'
  },
  {
    id: 'bls-ppi',
    category: 'Inflation',
    name: 'BLS PPI Overview',
    url: 'https://www.bls.gov/ppi/',
    expect: 'live'
  },

  // Employment
  {
    id: 'bls-employment',
    category: 'Employment',
    name: 'BLS Employment Situation',
    url: 'https://www.bls.gov/news.release/empsit.toc.htm',
    expect: 'live'
  },
  {
    id: 'bls-jolts',
    category: 'Employment',
    name: 'BLS JOLTS',
    url: 'https://www.bls.gov/jlt/',
    expect: 'live'
  },

  // Crime
  {
    id: 'doj-ncjrs',
    category: 'Crime',
    name: 'DOJ NCJRS',
    url: 'https://www.ncjrs.gov/',
    expect: 'down'
  },

  // Education research
  {
    id: 'eric',
    category: 'Education research',
    name: 'ERIC Database',
    url: 'https://eric.ed.gov/',
    expect: 'live'
  },

  // Energy markets
  {
    id: 'eia-ieo',
    category: 'Energy markets',
    name: 'EIA International Energy Outlook',
    url: 'https://www.eia.gov/outlooks/ieo/',
    expect: 'live'
  },

  // Population and demographics
  {
    id: 'census-data',
    category: 'Population and demographics',
    name: 'Census Data Portal',
    url: 'https://data.census.gov/',
    expect: 'live'
  },

  // General federal data
  {
    id: 'data-gov',
    category: 'General',
    name: 'Data.gov',
    url: 'https://data.gov/',
    expect: 'live'
  }
]

// Curl fallback for sites that block Node.js fetch (WAF rules)
function checkWithCurl(url) {
  try {
    const output = execSync(
      `curl -sI -o /dev/null -w "%{http_code}\\n%{url_effective}\\n%{redirect_url}" --max-time ${Math.floor(TIMEOUT_MS / 1000)} -L "${url}"`,
      { encoding: 'utf-8', timeout: TIMEOUT_MS + 2000 }
    ).trim()
    const [statusCode, finalUrl, redirectUrl] = output.split('\n')
    return {
      statusCode: parseInt(statusCode, 10),
      finalUrl: finalUrl || url,
      redirectUrl: redirectUrl || null,
      error: null
    }
  } catch (err) {
    return { statusCode: null, finalUrl: null, redirectUrl: null, error: err.message }
  }
}

function classifyResult(result, statusCode, redirected) {
  result.statusCode = statusCode
  if (statusCode >= 200 && statusCode < 400) {
    result.status = redirected ? 'redirected' : 'live'
  } else if (statusCode === 403 || statusCode === 401) {
    result.status = 'blocked'
  } else if (statusCode === 404 || statusCode === 410) {
    result.status = 'gone'
  } else if (statusCode >= 500) {
    result.status = 'error'
  } else {
    result.status = 'unknown'
  }
}

async function checkEndpoint(endpoint) {
  const start = Date.now()
  const result = {
    id: endpoint.id,
    category: endpoint.category,
    name: endpoint.name,
    url: endpoint.url,
    expect: endpoint.expect,
    checked: new Date().toISOString(),
    responseMs: null,
    status: null,
    statusCode: null,
    redirected: false,
    redirectUrl: null,
    error: null
  }

  const normalizeUrl = u => u.replace(/\/+$/, '')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const response = await fetch(endpoint.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'SqelchZero-Monitor/1.0 (federal data endpoint monitoring; squelch.zero@proton.me)'
      }
    })

    clearTimeout(timeout)
    result.responseMs = Date.now() - start
    result.statusCode = response.status

    if (normalizeUrl(response.url) !== normalizeUrl(endpoint.url)) {
      result.redirected = true
      result.redirectUrl = response.url
    }

    classifyResult(result, response.status, result.redirected)
  } catch (err) {
    // Node.js fetch failed — try curl as fallback (handles WAF/TLS issues)
    const curlResult = checkWithCurl(endpoint.url)
    result.responseMs = Date.now() - start

    if (curlResult.statusCode && curlResult.statusCode > 0) {
      // Curl succeeded where fetch failed
      if (curlResult.finalUrl && normalizeUrl(curlResult.finalUrl) !== normalizeUrl(endpoint.url)) {
        result.redirected = true
        result.redirectUrl = curlResult.finalUrl
      }
      classifyResult(result, curlResult.statusCode, result.redirected)
    } else {
      // Both fetch and curl failed — genuinely unreachable
      if (err.name === 'AbortError') {
        result.status = 'timeout'
        result.error = `No response within ${TIMEOUT_MS}ms`
      } else if (err.cause?.code === 'ENOTFOUND') {
        result.status = 'dns-fail'
        result.error = 'DNS lookup failed — domain may not exist'
      } else if (err.cause?.code === 'ECONNREFUSED') {
        result.status = 'refused'
        result.error = 'Connection refused'
      } else {
        result.status = 'timeout'
        result.error = 'Unreachable (both fetch and curl failed)'
      }
    }
  }

  return result
}

// Run checks with concurrency limit
async function runChecks() {
  const results = []
  const queue = [...ENDPOINTS]

  async function worker() {
    while (queue.length > 0) {
      const endpoint = queue.shift()
      const result = await checkEndpoint(endpoint)
      results.push(result)
      const icon = result.status === 'live' ? '✓' :
                   result.status === 'redirected' ? '→' :
                   result.status === 'gone' || result.status === 'dns-fail' ? '✗' : '?'
      console.log(`  ${icon} ${result.name}: ${result.status} (${result.statusCode || result.error}) ${result.responseMs}ms`)
    }
  }

  console.log(`Checking ${ENDPOINTS.length} endpoints...`)
  const workers = Array.from({ length: CONCURRENT_LIMIT }, () => worker())
  await Promise.all(workers)

  return results
}

// Load previous history
function loadHistory() {
  if (existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(readFileSync(HISTORY_FILE, 'utf-8'))
    } catch { return [] }
  }
  return []
}

// Detect changes from previous run
function detectChanges(results, history) {
  const changes = []
  const lastRun = history.length > 0 ? history[history.length - 1] : null
  if (!lastRun) return changes

  const previousMap = new Map(lastRun.results.map(r => [r.id, r]))
  for (const result of results) {
    const prev = previousMap.get(result.id)
    if (prev && prev.status !== result.status) {
      changes.push({
        id: result.id,
        name: result.name,
        from: prev.status,
        to: result.status,
        timestamp: result.checked
      })
    }
  }
  return changes
}

async function main() {
  console.log(`\n=== Endpoint Monitor: ${new Date().toISOString()} ===\n`)

  const results = await runChecks()
  const history = loadHistory()
  const changes = detectChanges(results, history)

  // Summary
  const live = results.filter(r => r.status === 'live').length
  const redirected = results.filter(r => r.status === 'redirected').length
  const down = results.filter(r => ['gone', 'dns-fail', 'refused', 'timeout', 'blocked'].includes(r.status)).length
  const other = results.length - live - redirected - down

  console.log(`\nSummary: ${live} live, ${redirected} redirected, ${down} down, ${other} other`)

  if (changes.length > 0) {
    console.log(`\n⚠ STATUS CHANGES DETECTED:`)
    for (const c of changes) {
      console.log(`  ${c.name}: ${c.from} → ${c.to}`)
    }
  }

  // Write current status
  const output = {
    lastChecked: new Date().toISOString(),
    summary: { total: results.length, live, redirected, down, other },
    changes,
    endpoints: results
  }
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
  console.log(`\nResults written to ${OUTPUT_FILE}`)

  // Append to history (keep last 30 days of hourly checks = ~720 entries max)
  history.push({
    timestamp: new Date().toISOString(),
    summary: output.summary,
    results: results.map(r => ({ id: r.id, status: r.status, statusCode: r.statusCode, responseMs: r.responseMs }))
  })
  // Trim history to last 720 entries
  const trimmed = history.slice(-720)
  writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2))
}

main().catch(err => {
  console.error('Monitor failed:', err)
  process.exit(1)
})
