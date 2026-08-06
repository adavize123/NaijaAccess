import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Dataset, ScanResult, Sector } from './types'

const DATA_FILE = join(process.cwd(), 'data', 'scan-results.json')

const EMPTY: Dataset = {
  generatedAt: '',
  engine: '',
  results: [],
  manual: [],
}

export function getDataset(): Dataset {
  if (!existsSync(DATA_FILE)) return EMPTY
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8')) as Dataset
  } catch {
    return EMPTY
  }
}

/** Worst score first. Unreachable sites sort last, since they have no score. */
export function rankedResults(data: Dataset): ScanResult[] {
  return [...data.results].sort((a, b) => {
    if (a.score === null && b.score === null) return a.name.localeCompare(b.name)
    if (a.score === null) return 1
    if (b.score === null) return -1
    return a.score - b.score
  })
}

export function getResult(data: Dataset, slug: string): ScanResult | undefined {
  return data.results.find((r) => r.slug === slug)
}

export function manualFor(data: Dataset, slug: string) {
  return data.manual.filter((m) => m.slug === slug)
}

export type Summary = {
  scanned: number
  unreachable: number
  average: number
  failing: number
  criticalTotal: number
  bySector: { sector: Sector; average: number; count: number }[]
}

export function summarise(data: Dataset): Summary {
  const scored = data.results.filter((r) => r.score !== null)

  const average = scored.length
    ? Math.round(scored.reduce((a, r) => a + (r.score ?? 0), 0) / scored.length)
    : 0

  const sectors: Sector[] = ['banking', 'telecom', 'government']
  const bySector = sectors
    .map((sector) => {
      const rows = scored.filter((r) => r.sector === sector)
      return {
        sector,
        count: rows.length,
        average: rows.length
          ? Math.round(rows.reduce((a, r) => a + (r.score ?? 0), 0) / rows.length)
          : 0,
      }
    })
    .filter((s) => s.count > 0)

  return {
    scanned: scored.length,
    unreachable: data.results.length - scored.length,
    average,
    failing: scored.filter((r) => (r.score ?? 0) < 60).length,
    criticalTotal: scored.reduce((a, r) => a + r.counts.critical, 0),
    bySector,
  }
}

export function formatDate(iso: string): string {
  if (!iso) return 'never'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
