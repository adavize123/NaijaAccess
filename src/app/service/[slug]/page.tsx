import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDataset, getResult, manualFor, formatDate } from '@/lib/data'
import { ScoreBadge } from '@/components/ScoreBadge'
import { SeverityPill } from '@/components/SeverityPill'
import { totalIssues } from '@/lib/scoring'

export function generateStaticParams() {
  return getDataset().results.map((r) => ({ slug: r.slug }))
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getDataset()
  const result = getResult(data, slug)
  if (!result) notFound()

  const manual = manualFor(data, slug)
  const failedTasks = manual.filter((m) => !m.completed)

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <Link href="/" className="link inline-flex min-h-[44px] items-center text-sm">
        Back to scorecard
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {result.name}
          </h1>
          <p className="mt-2 text-muted">
            <span className="capitalize">{result.sector}</span>
            {' · '}
            <a
              href={result.url}
              className="link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {result.url.replace(/^https?:\/\//, '')}
            </a>
          </p>
        </div>
        <div className="text-right">
          <ScoreBadge score={result.score} />
          <p className="mt-1 text-xs text-muted">
            Scanned {formatDate(result.scannedAt)}
          </p>
        </div>
      </div>

      {result.error && (
        <div className="card mt-8 border-accent p-6">
          <h2 className="font-semibold text-ink">Not scanned</h2>
          <p className="mt-2 text-sm text-muted">{result.error}</p>
        </div>
      )}

      {!result.error && (
        <>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Count label="Critical" value={result.counts.critical} tone="critical" />
            <Count label="Serious" value={result.counts.serious} tone="serious" />
            <Count label="Moderate" value={result.counts.moderate} tone="moderate" />
            <Count label="Minor" value={result.counts.minor} tone="minor" />
          </dl>

          <p className="mt-4 text-sm text-muted">
            {totalIssues(result.counts)} failing elements across{' '}
            {result.violations.length} distinct rules.{' '}
            {result.passCount} checks passed.
          </p>

          {manual.length > 0 && (
            <section className="mt-12" aria-labelledby="manual-heading">
              <h2
                id="manual-heading"
                className="text-xl font-semibold text-ink"
              >
                Manual screen reader testing
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Tasks attempted by hand. Automated tools cannot tell whether a
                person can complete a real task, which is why this section
                exists.
              </p>

              <ul className="mt-4 space-y-3">
                {manual.map((m, i) => (
                  <li key={i} className="card p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-ink">{m.task}</p>
                      <span
                        className={`text-sm font-semibold ${
                          m.completed ? 'text-pass' : 'text-critical'
                        }`}
                      >
                        {m.completed ? 'Completed' : 'Could not complete'}
                      </span>
                    </div>
                    {m.notes && (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {m.notes}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-xs text-muted">
                      {m.environment}
                    </p>
                  </li>
                ))}
              </ul>

              {failedTasks.length > 0 && (
                <p className="mt-4 text-sm text-ink">
                  {failedTasks.length} of {manual.length} tasks could not be
                  completed with a screen reader.
                </p>
              )}
            </section>
          )}

          <section className="mt-12" aria-labelledby="violations-heading">
            <h2
              id="violations-heading"
              className="text-xl font-semibold text-ink"
            >
              Automated findings
            </h2>

            {result.violations.length === 0 ? (
              <p className="mt-3 text-muted">
                No WCAG 2.1 AA violations detected by automated testing. This
                is not a certificate of compliance, only an absence of the
                failures a machine can see.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {result.violations.map((v) => (
                  <li key={v.ruleId} className="card p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <SeverityPill impact={v.impact} />
                      <code className="font-mono text-sm text-ink">
                        {v.ruleId}
                      </code>
                      <span className="text-sm text-muted">
                        {v.nodeCount}{' '}
                        {v.nodeCount === 1 ? 'element' : 'elements'}
                      </span>
                    </div>

                    <p className="mt-2 text-ink">{v.help}</p>

                    {v.wcagTags.length > 0 && (
                      <p className="mt-2 font-mono text-xs uppercase text-muted">
                        {v.wcagTags.join(' · ')}
                      </p>
                    )}

                    {v.sample && (
                      /* tabIndex makes the horizontally scrollable region
                         reachable by keyboard, per WCAG 2.1.1 */
                      <pre
                        tabIndex={0}
                        role="region"
                        aria-label={`Example failing element for ${v.ruleId}`}
                        className="mt-3 overflow-x-auto rounded bg-canvas p-3 font-mono text-xs text-muted"
                      >
                        <code>{v.sample}</code>
                      </pre>
                    )}

                    <a
                      href={v.helpUrl}
                      className="link mt-3 inline-flex min-h-[44px] items-center text-sm"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      How to fix this
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function Count({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'critical' | 'serious' | 'moderate' | 'minor'
}) {
  const colour = {
    critical: 'text-critical',
    serious: 'text-serious',
    moderate: 'text-moderate',
    minor: 'text-minor',
  }[tone]

  return (
    <div className="card p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`mt-1 font-mono text-2xl font-semibold ${colour}`}>
        {value}
      </dd>
    </div>
  )
}
