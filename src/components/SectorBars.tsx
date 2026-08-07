import type { Sector } from '@/lib/types'

const LABEL: Record<Sector, string> = {
  banking: 'Banking',
  telecom: 'Telecom',
  government: 'Government',
}

/**
 * Sector averages as horizontal bars. Three numbers in cards read as three
 * numbers; side by side, the gap between telecom and everything else is
 * the point being made. Values are repeated as text so the chart never
 * carries meaning on its own.
 */
export function SectorBars({
  data,
}: {
  data: { sector: Sector; average: number; count: number }[]
}) {
  return (
    <ul className="space-y-4">
      {data.map((s) => {
        const tone =
          s.average >= 75
            ? 'bg-pass'
            : s.average >= 60
              ? 'bg-moderate'
              : s.average >= 40
                ? 'bg-serious'
                : 'bg-critical'

        return (
          <li key={s.sector}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium text-ink">{LABEL[s.sector]}</span>
              <span className="font-mono text-sm text-muted">
                <span className="text-lg font-semibold text-ink">
                  {s.average}
                </span>
                /100 · {s.count}{' '}
                {s.count === 1 ? 'service' : 'services'}
              </span>
            </div>
            <div
              className="mt-2 h-3 w-full overflow-hidden rounded-full bg-line"
              role="img"
              aria-label={`${LABEL[s.sector]}: ${s.average} out of 100`}
            >
              <div
                className={`h-full rounded-full ${tone}`}
                style={{ width: `${Math.max(1, s.average)}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
