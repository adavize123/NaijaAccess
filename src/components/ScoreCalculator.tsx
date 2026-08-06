'use client'

import { useState } from 'react'
import { WEIGHTS, scoreFromCounts, grade } from '@/lib/scoring'
import type { Impact } from '@/lib/types'

const ROWS: { impact: Impact; label: string; example: string }[] = [
  { impact: 'critical', label: 'Critical', example: 'Button with no name' },
  { impact: 'serious', label: 'Serious', example: 'Text below contrast' },
  { impact: 'moderate', label: 'Moderate', example: 'Heading skipped' },
  { impact: 'minor', label: 'Minor', example: 'Redundant link text' },
]

/**
 * The scoring formula, made adjustable. Reading a table of weights tells
 * you less than watching a score collapse when you add four critical
 * failures, which is the point being made.
 */
export function ScoreCalculator() {
  const [counts, setCounts] = useState({
    critical: 2,
    serious: 4,
    moderate: 3,
    minor: 2,
  })

  const score = scoreFromCounts(counts)
  const letter = grade(score)
  const tone =
    score >= 75
      ? 'text-pass'
      : score >= 60
        ? 'text-moderate'
        : score >= 40
          ? 'text-serious'
          : 'text-critical'

  const set = (impact: Impact, value: number) =>
    setCounts((c) => ({ ...c, [impact]: Math.max(0, Math.min(30, value)) }))

  return (
    <div className="card p-5">
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          {ROWS.map((row) => {
            const n = counts[row.impact]
            const deduction = n * WEIGHTS[row.impact]
            return (
              <div key={row.impact}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label
                    htmlFor={`count-${row.impact}`}
                    className="text-sm font-medium text-ink"
                  >
                    {row.label}
                    <span className="ml-2 font-normal text-muted">
                      {row.example}
                    </span>
                  </label>
                  <span className="font-mono text-sm text-muted">
                    {n} &times; {WEIGHTS[row.impact]} ={' '}
                    <span className="text-ink">
                      &minus;{deduction.toFixed(1)}
                    </span>
                  </span>
                </div>
                <input
                  id={`count-${row.impact}`}
                  type="range"
                  min={0}
                  max={30}
                  value={n}
                  onChange={(e) => set(row.impact, Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-brand"
                />
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-canvas px-8 py-6">
          <p className="text-xs uppercase tracking-wide text-muted">Score</p>
          <p
            className={`font-mono text-5xl font-semibold tabular-nums ${tone}`}
            aria-live="polite"
          >
            {score}
          </p>
          <p className="font-mono text-sm text-muted">grade {letter}</p>
        </div>
      </div>

      <p className="mt-5 border-t border-line pt-4 font-mono text-sm text-muted">
        100 &minus; ({counts.critical}&times;10 + {counts.serious}&times;5 +{' '}
        {counts.moderate}&times;2 + {counts.minor}&times;0.5) ={' '}
        <span className="text-ink">{score}</span>
      </p>
    </div>
  )
}
