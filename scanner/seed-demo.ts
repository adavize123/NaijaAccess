/**
 * Writes a placeholder dataset so the dashboard renders before the first
 * real scan. Every score is zero and the UI flags the data as unverified.
 *
 *   npm run scan:demo
 *
 * Run `npm run scan` to replace this with measured results. Never submit
 * or present placeholder numbers.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emptyCounts } from '../src/lib/scoring'
import type { Dataset, ScanResult, Target } from '../src/lib/types'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(HERE, '..', 'data')

const targets = (
  JSON.parse(readFileSync(join(HERE, 'targets.json'), 'utf8')) as { targets: Target[] }
).targets

const results: ScanResult[] = targets.map((t) => ({
  slug: t.slug,
  name: t.name,
  sector: t.sector,
  url: t.url,
  scannedAt: new Date().toISOString(),
  score: null,
  counts: emptyCounts(),
  violations: [],
  passCount: 0,
  error: 'Not yet scanned. Run: npm run scan',
}))

const dataset: Dataset = {
  generatedAt: new Date().toISOString(),
  engine: 'placeholder - no scan has run',
  results,
  manual: [],
}

mkdirSync(DATA_DIR, { recursive: true })
writeFileSync(join(DATA_DIR, 'scan-results.json'), JSON.stringify(dataset, null, 2))

console.log(`Seeded ${results.length} placeholder targets.`)
console.log('Run "npm run scan" to collect real measurements.')
