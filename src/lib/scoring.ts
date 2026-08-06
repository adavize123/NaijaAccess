import type { Counts, Impact } from './types'

/**
 * Deduction weights, per failing element.
 *
 * A critical violation blocks a task outright: an unlabelled button is
 * silent to a screen reader, so the user cannot know it exists. A minor
 * violation is friction rather than a wall. The weights are published on
 * the methodology page so any operator can recompute their own score.
 */
export const WEIGHTS: Record<Impact, number> = {
  critical: 10,
  serious: 5,
  moderate: 2,
  minor: 0.5,
}

export function scoreFromCounts(counts: Counts): number {
  const penalty =
    counts.critical * WEIGHTS.critical +
    counts.serious * WEIGHTS.serious +
    counts.moderate * WEIGHTS.moderate +
    counts.minor * WEIGHTS.minor

  return Math.max(0, Math.round(100 - penalty))
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export function grade(score: number): Grade {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export function emptyCounts(): Counts {
  return { critical: 0, serious: 0, moderate: 0, minor: 0 }
}

export function totalIssues(counts: Counts): number {
  return counts.critical + counts.serious + counts.moderate + counts.minor
}
