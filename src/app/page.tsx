import Link from 'next/link'
import { getDataset, rankedResults, summarise, formatDate } from '@/lib/data'
import { ScoreBadge } from '@/components/ScoreBadge'
import type { Sector } from '@/lib/types'

const SECTOR_LABEL: Record<Sector, string> = {
  banking: 'Banking',
  telecom: 'Telecom',
  government: 'Government',
}

export default function Home() {
  const data = getDataset()
  const rows = rankedResults(data)
  const stats = summarise(data)
  const hasData = stats.scanned > 0

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Nigerian Digital Accessibility Scorecard
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Almost 12 percent of Nigerians aged 15 and over have some level of
          disability, and difficulty seeing is the most common at 8.8 percent.
          This scorecard measures whether the banking, telecom and government
          services they depend on can actually be used with a screen reader.
        </p>
        <p className="mt-3 text-sm text-muted">
          Prevalence from the{' '}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12659292/"
            className="link"
            rel="noopener noreferrer"
            target="_blank"
          >
            2018 Nigeria Demographic and Health Survey
          </a>
          , analysed with the Washington Group Short Set across 67,663
          household members.
        </p>
      </div>

      {!hasData && (
        <div className="card mt-8 border-accent p-6">
          <h2 className="font-semibold text-ink">No scan data yet</h2>
          <p className="mt-2 text-sm text-muted">
            Run <code className="font-mono text-ink">npm run scan</code> to
            collect measurements, then reload this page. Placeholder numbers
            are never shown here, because a scorecard is only worth something
            if every figure on it was measured.
          </p>
        </div>
      )}

      {hasData && (
        <>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Services audited" value={stats.scanned} />
            <Stat label="Average score" value={stats.average} suffix="/100" />
            <Stat
              label="Scoring below 60"
              value={stats.failing}
              tone={stats.failing > 0 ? 'bad' : undefined}
            />
            <Stat
              label="Critical failures"
              value={stats.criticalTotal}
              tone={stats.criticalTotal > 0 ? 'bad' : undefined}
            />
          </dl>

          {stats.bySector.length > 1 && (
            <section className="mt-10" aria-labelledby="sector-heading">
              <h2
                id="sector-heading"
                className="text-sm font-semibold uppercase tracking-wide text-muted"
              >
                Average by sector
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {stats.bySector.map((s) => (
                  <div key={s.sector} className="card p-4">
                    <p className="text-sm text-muted">
                      {SECTOR_LABEL[s.sector]}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-semibold text-ink">
                      {s.average}
                      <span className="text-base font-normal text-muted">
                        /100
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {s.count} {s.count === 1 ? 'service' : 'services'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="mt-12 min-w-0" aria-labelledby="table-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="table-heading" className="text-xl font-semibold text-ink">
            All services
          </h2>
          {data.generatedAt && (
            <p className="text-sm text-muted">
              Last scan {formatDate(data.generatedAt)}
            </p>
          )}
        </div>

        {/* The table keeps a min-width so its columns stay legible, so this
            wrapper scrolls instead of letting the page widen. The negative
            margin and matching padding let the scroll area run to the screen
            edge on a phone, which reads better than a scrollbar inset inside
            the page gutter. tabIndex keeps the region keyboard reachable,
            per WCAG 2.1.1. */}
        <div
          className="scroll-x mt-4"
          tabIndex={0}
          role="region"
          aria-label="Accessibility scores table"
        >
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Accessibility scores for Nigerian digital services, lowest score
              first
            </caption>
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">
                  Service
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  Sector
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-medium">
                  Critical
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-medium">
                  Serious
                </th>
                <th scope="col" className="py-3 text-right font-medium">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No targets configured.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.slug}
                  className="border-b border-line transition-colors duration-200 last:border-0 hover:bg-surface"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/service/${r.slug}`}
                      className="inline-flex min-h-[44px] cursor-pointer items-center font-medium text-ink underline-offset-4 hover:underline"
                    >
                      {r.name}
                    </Link>
                    {r.error && (
                      <span className="ml-2 text-xs text-muted">
                        (unreachable)
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {SECTOR_LABEL[r.sector]}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-critical">
                    {r.score === null ? '—' : r.counts.critical}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-serious">
                    {r.score === null ? '—' : r.counts.serious}
                  </td>
                  <td className="py-3 text-right">
                    <ScoreBadge score={r.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card mt-12 p-6" aria-labelledby="ask-heading">
        <h2 id="ask-heading" className="text-lg font-semibold text-ink">
          What this is for
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Under the Nigerian Communications Act 2003, the Commission is
          responsible for ensuring that the needs of people with disabilities
          are taken into account in the provision of communications services.
          The Consumer Code of Practice Regulations 2024 is in force. What is
          missing is measurement. This scorecard is built so that compliance
          can be observed continuously rather than asserted once.
        </p>
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  suffix,
  tone,
}: {
  label: string
  value: number
  suffix?: string
  tone?: 'bad'
}) {
  return (
    <div className="card p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={`mt-1 font-mono text-3xl font-semibold ${
          tone === 'bad' ? 'text-critical' : 'text-ink'
        }`}
      >
        {value}
        {suffix && (
          <span className="text-base font-normal text-muted">{suffix}</span>
        )}
      </dd>
    </div>
  )
}
