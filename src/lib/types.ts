export type Sector = 'banking' | 'telecom' | 'government'

export type Impact = 'critical' | 'serious' | 'moderate' | 'minor'

export type Target = {
  slug: string
  name: string
  sector: Sector
  url: string
}

export type Violation = {
  ruleId: string
  impact: Impact
  help: string
  helpUrl: string
  nodeCount: number
  wcagTags: string[]
  /** First failing element, trimmed. Shown as evidence in the UI. */
  sample?: string
}

export type Counts = Record<Impact, number>

export type ScanResult = {
  slug: string
  name: string
  sector: Sector
  url: string
  scannedAt: string
  /** null when the site could not be reached */
  score: number | null
  counts: Counts
  violations: Violation[]
  passCount: number
  error?: string
}

/** A task a screen reader user attempted by hand. */
export type ManualFinding = {
  slug: string
  task: string
  completed: boolean
  notes: string
  environment: string
  testedAt: string
}

export type Dataset = {
  generatedAt: string
  engine: string
  results: ScanResult[]
  manual: ManualFinding[]
}
