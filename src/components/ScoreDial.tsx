import { grade } from '@/lib/scoring'

const TONE = {
  pass: 'text-pass',
  moderate: 'text-moderate',
  serious: 'text-serious',
  critical: 'text-critical',
} as const

function toneFor(score: number) {
  if (score >= 75) return TONE.pass
  if (score >= 60) return TONE.moderate
  if (score >= 40) return TONE.serious
  return TONE.critical
}

/**
 * Circular score gauge. The arc is drawn with stroke-dasharray so no
 * JavaScript is needed, and the number is repeated as text so the value
 * never depends on reading the shape or the colour.
 */
export function ScoreDial({
  score,
  size = 132,
  label,
}: {
  score: number
  size?: number
  label?: string
}) {
  const stroke = 10
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circumference
  const letter = grade(score)
  const tone = toneFor(score)

  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-line"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            className={`${tone} transition-[stroke-dasharray] duration-700 ease-out`}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-3xl font-semibold ${tone}`}>
            {score}
          </span>
          <span className="font-mono text-xs text-muted">grade {letter}</span>
        </div>
      </div>
      {label && (
        <figcaption className="text-sm text-muted">{label}</figcaption>
      )}
      <span className="sr-only">
        Score {score} out of 100, grade {letter}
      </span>
    </figure>
  )
}
