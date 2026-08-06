import type { Impact } from '@/lib/types'

const STYLES: Record<Impact, string> = {
  critical: 'border-critical text-critical',
  serious: 'border-serious text-serious',
  moderate: 'border-moderate text-moderate',
  minor: 'border-minor text-minor',
}

export function SeverityPill({ impact }: { impact: Impact }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${STYLES[impact]}`}
    >
      {impact}
    </span>
  )
}
