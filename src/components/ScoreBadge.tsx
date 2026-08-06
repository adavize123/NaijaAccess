import { grade } from '@/lib/scoring'

/**
 * Score plus letter grade. The letter matters: colour alone must never be
 * the only way to read a value, and a grade is legible to anyone with a
 * colour vision difference or a monochrome display.
 */
export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-flex items-center gap-2 font-mono text-sm text-muted">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not scanned</span>
        <span className="text-xs uppercase tracking-wide">no data</span>
      </span>
    )
  }

  const letter = grade(score)
  const tone =
    score >= 75
      ? 'text-pass'
      : score >= 60
        ? 'text-moderate'
        : score >= 40
          ? 'text-serious'
          : 'text-critical'

  return (
    <span className={`inline-flex items-baseline gap-2 font-mono ${tone}`}>
      <span className="text-lg font-semibold tabular-nums">{score}</span>
      <span
        className="rounded border border-current px-1.5 py-0.5 text-xs font-bold"
        aria-hidden="true"
      >
        {letter}
      </span>
      <span className="sr-only">out of 100, grade {letter}</span>
    </span>
  )
}
