/**
 * Scans each target with axe-core in a headless browser and writes the
 * results to data/scan-results.json.
 *
 *   npm run scan              scan every target
 *   npm run scan:one gtbank   scan a single target by slug
 *
 * Results are written as plain JSON so the dashboard needs no database
 * and the whole project runs offline on localhost.
 */
import { chromium, type Browser } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emptyCounts, scoreFromCounts } from '../src/lib/scoring'
import type { Counts, Dataset, Impact, ScanResult, Target, Violation } from '../src/lib/types'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const DATA_DIR = join(ROOT, 'data')
const OUT = join(DATA_DIR, 'scan-results.json')

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Nigerian sites are often slow and some reject obvious automation.
const NAV_TIMEOUT = 45_000
const SETTLE_MS = 3_000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

function loadTargets(): Target[] {
  const raw = readFileSync(join(HERE, 'targets.json'), 'utf8')
  return (JSON.parse(raw) as { targets: Target[] }).targets
}

async function scanTarget(browser: Browser, target: Target): Promise<ScanResult> {
  const base = {
    slug: target.slug,
    name: target.name,
    sector: target.sector,
    url: target.url,
    scannedAt: new Date().toISOString(),
  }

  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1366, height: 900 },
  })
  const page = await context.newPage()

  try {
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT })
    await page.waitForTimeout(SETTLE_MS)

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    const counts: Counts = emptyCounts()
    const violations: Violation[] = []

    for (const v of results.violations) {
      const impact = (v.impact ?? 'minor') as Impact
      counts[impact] += v.nodes.length
      violations.push({
        ruleId: v.id,
        impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodeCount: v.nodes.length,
        wcagTags: v.tags.filter((t) => t.startsWith('wcag')),
        sample: v.nodes[0]?.html?.slice(0, 180),
      })
    }

    // Worst first, so the detail page leads with what actually blocks people.
    const order: Impact[] = ['critical', 'serious', 'moderate', 'minor']
    violations.sort(
      (a, b) =>
        order.indexOf(a.impact) - order.indexOf(b.impact) || b.nodeCount - a.nodeCount,
    )

    return {
      ...base,
      score: scoreFromCounts(counts),
      counts,
      violations,
      passCount: results.passes.length,
    }
  } catch (err) {
    // One unreachable site must never abort the run.
    return {
      ...base,
      score: null,
      counts: emptyCounts(),
      violations: [],
      passCount: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  } finally {
    await context.close()
  }
}

function loadManual(): Dataset['manual'] {
  const path = join(DATA_DIR, 'manual-findings.json')
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf8')).findings ?? []
}

async function main() {
  const onlyFlag = process.argv.indexOf('--only')
  const only = onlyFlag > -1 ? process.argv[onlyFlag + 1] : null

  const targets = loadTargets().filter((t) => !only || t.slug === only)
  if (targets.length === 0) {
    console.error(only ? `No target with slug "${only}"` : 'No targets configured')
    process.exit(1)
  }

  console.log(`Scanning ${targets.length} target(s) against WCAG 2.1 AA\n`)

  const browser = await chromium.launch()
  const results: ScanResult[] = []

  for (const target of targets) {
    process.stdout.write(`  ${target.name.padEnd(42)}`)
    const result = await scanTarget(browser, target)
    results.push(result)

    if (result.error) {
      console.log('unreachable')
    } else {
      const { critical, serious } = result.counts
      console.log(
        `score ${String(result.score).padStart(3)}   ` +
          `critical ${String(critical).padStart(3)}   serious ${String(serious).padStart(3)}`,
      )
    }
  }

  await browser.close()

  mkdirSync(DATA_DIR, { recursive: true })

  // A partial run should not wipe earlier results for untouched targets.
  let merged = results
  if (only && existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, 'utf8')) as Dataset
    merged = [...prev.results.filter((r) => r.slug !== only), ...results]
  }

  const dataset: Dataset = {
    generatedAt: new Date().toISOString(),
    engine: 'axe-core 4.10 via @axe-core/playwright',
    results: merged,
    manual: loadManual(),
  }

  writeFileSync(OUT, JSON.stringify(dataset, null, 2))

  const scored = merged.filter((r) => r.score !== null)
  const avg = scored.length
    ? Math.round(scored.reduce((a, r) => a + (r.score ?? 0), 0) / scored.length)
    : 0

  console.log(`\nWrote ${merged.length} result(s) to data/scan-results.json`)
  console.log(`Average score: ${avg}`)
  if (merged.length !== scored.length) {
    console.log(`Unreachable: ${merged.length - scored.length}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
