import Link from 'next/link'
import { WEIGHTS } from '@/lib/scoring'
import { getDataset, formatDate } from '@/lib/data'
import { ScoreDial } from '@/components/ScoreDial'
import { ScoreCalculator } from '@/components/ScoreCalculator'
import { FixDemo } from '@/components/FixDemo'
import { FIXES } from '@/lib/fixes'
import { BrailleRule } from '@/components/Braille'

export const metadata = {
  title: 'Methodology | NaijaAccess',
  description:
    'What NaijaAccess measures, how each score is calculated, and what automated testing cannot detect.',
}

const BANDS = [
  { grade: 'A', from: 90, label: 'Few barriers found' },
  { grade: 'B', from: 75, label: 'Usable, with friction' },
  { grade: 'C', from: 60, label: 'Significant barriers' },
  { grade: 'D', from: 40, label: 'Largely unusable' },
  { grade: 'F', from: 0, label: 'Blocked' },
]

export default function Methodology() {
  const data = getDataset()

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          How this works
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          What is measured, and how the number is produced
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          A scorecard that names institutions has to show its working. Every
          weight, threshold and limitation is set out below, so any operator
          can recompute their own score and challenge it.
        </p>
      </header>

      <BrailleRule word="access" className="mt-10" />

      {/* 1. The limitation, stated before the numbers */}
      <section className="mt-12 max-w-3xl" aria-labelledby="limits">
        <h2 id="limits" className="text-2xl font-semibold text-ink">
          The limit worth stating first
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          <p>
            Automated testing detects roughly a third of the barriers a real
            person meets. It reliably finds a button with no accessible name.
            It cannot tell you whether the reading order makes sense, whether
            an error message is understandable, or whether somebody can
            actually finish paying a bill.
          </p>
          <p className="border-l-4 border-accent bg-surface p-4 text-ink">
            A score here is a floor, not a certificate. A service scoring 100
            has passed the checks a machine can run, nothing more. A service
            scoring 20 has problems so basic that no manual testing is needed
            to confirm them.
          </p>
          <p>
            This is why every service examined closely is also tested by hand
            by a screen reader user, and why those results sit alongside the
            automated ones.
          </p>
        </div>
      </section>

      {/* 2. Severity weights */}
      <section className="mt-16" aria-labelledby="weights">
        <h2 id="weights" className="text-2xl font-semibold text-ink">
          What each failure costs
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Every failing element deducts from a starting score of 100, weighted
          by how much it blocks a person. An unlabelled button is silent to a
          screen reader, so the user cannot know it exists. Redundant link
          text is friction. Weighting them equally would flatter a service
          with many small problems and punish one with a single blocking
          failure.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ['critical', 'Critical', 'Blocks the task outright', 'text-critical border-critical'],
              ['serious', 'Serious', 'Task possible but obstructed', 'text-serious border-serious'],
              ['moderate', 'Moderate', 'Confusing or slow', 'text-moderate border-moderate'],
              ['minor', 'Minor', 'Friction', 'text-minor border-minor'],
            ] as const
          ).map(([key, label, desc, cls]) => (
            <li key={key} className={`card border-l-4 p-5 ${cls.split(' ')[1]}`}>
              <p className={`font-mono text-3xl font-semibold ${cls.split(' ')[0]}`}>
                &minus;{WEIGHTS[key]}
              </p>
              <p className="mt-1 font-semibold text-ink">{label}</p>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Interactive calculator */}
      <section className="mt-16" aria-labelledby="calc">
        <h2 id="calc" className="text-2xl font-semibold text-ink">
          Try the formula
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Adjust the counts to see how a score is built. Four critical
          failures is enough to take a service below half marks on their own.
        </p>
        <div className="mt-6">
          <ScoreCalculator />
        </div>
      </section>

      {/* 4. Grade bands */}
      <section className="mt-16" aria-labelledby="bands">
        <h2 id="bands" className="text-2xl font-semibold text-ink">
          Grade bands
        </h2>
        <div className="mt-6 flex flex-wrap items-end gap-8">
          <ScoreDial score={98} label="Airtel Nigeria" />
          <ScoreDial score={44} label="Average, all services" />
          <ScoreDial score={0} label="NCC, GTBank, Access Bank" />
        </div>

        <div className="scroll-x mt-8">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">Grade bands and their meaning</caption>
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-2 font-medium">Grade</th>
                <th scope="col" className="py-2 font-medium">Score</th>
                <th scope="col" className="py-2 font-medium">Means</th>
              </tr>
            </thead>
            <tbody>
              {BANDS.map((b, i) => (
                <tr key={b.grade} className="border-b border-line last:border-0">
                  <td className="py-3 font-mono text-lg font-bold text-ink">
                    {b.grade}
                  </td>
                  <td className="py-3 font-mono text-muted">
                    {i === 0 ? '90 and above' : `${b.from} to ${BANDS[i - 1].from - 1}`}
                  </td>
                  <td className="py-3 text-muted">{b.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. What is tested */}
      <section className="mt-16 max-w-3xl" aria-labelledby="tested">
        <h2 id="tested" className="text-2xl font-semibold text-ink">
          What is tested
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          <p>
            Each service is loaded in a headless Chromium browser at 1366 by
            900 pixels. Once the page settles, axe-core runs against WCAG 2.0
            and 2.1 at levels A and AA, plus WCAG 2.2 at AA.
          </p>
          <p>
            Only the public landing page is scanned. Pages behind a login are
            not covered, which means the real picture for authenticated
            banking is likely worse than what is shown here, not better.
          </p>
        </div>
      </section>

      {/* 6. The demonstration */}
      <section className="mt-16" aria-labelledby="fixes">
        <h2 id="fixes" className="text-2xl font-semibold text-ink">
          What fixing this actually involves
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Every example below is a violation type found on Nigerian services
          in this scan, with the counts from the committed results. Switch
          between the version as found and the corrected one to see both the
          markup change and what a screen reader announces.
        </p>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink">
          Almost all of them are a single attribute.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {FIXES.map((fix) => (
            <FixDemo key={fix.rule} fix={fix} />
          ))}
        </div>
      </section>

      {/* 7. Manual testing */}
      <section className="mt-16 max-w-3xl" aria-labelledby="manual">
        <h2 id="manual" className="text-2xl font-semibold text-ink">
          Manual testing
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          <p>
            For each service examined in depth, a screen reader user attempts
            a short set of ordinary tasks: find the customer service number,
            locate the branch finder, begin an account opening. Each is
            recorded as completed or not completed. There is no partial
            credit, because from the user&rsquo;s side there is no partial
            credit either.
          </p>
          <p>
            Environment and date are recorded with every finding so results
            can be reproduced or challenged.
          </p>
        </div>
      </section>

      {/* 8. Before publication */}
      <section className="mt-16 max-w-3xl" aria-labelledby="publication">
        <h2 id="publication" className="text-2xl font-semibold text-ink">
          Before publication
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          <p>
            The purpose is repair, not exposure. Operators are notified of
            findings before results are published and given a window to
            respond. Where a service improves, the score improves with it,
            because scans run continuously rather than once.
          </p>
          <p>
            Nigerian institutions have already shown this is achievable. UBA
            published a formal commitment to WCAG 2.1 Level AA in June 2025.
            OPay supports independent account setup for blind users. Airtel
            scores 98 in this scan with no critical or serious failures. The
            gap is not technical difficulty.
          </p>
        </div>
      </section>

      {/* 9. Not covered */}
      <section className="mt-16 max-w-3xl" aria-labelledby="gaps">
        <h2 id="gaps" className="text-2xl font-semibold text-ink">
          What is not covered
        </h2>
        <ul className="mt-4 space-y-2 leading-relaxed text-muted">
          {[
            'Pages requiring authentication',
            'Native mobile applications, which need separate tooling',
            'USSD menus, which no automated tool can currently audit',
            'Content quality, plain language and cognitive load',
            'Whether a person can complete a transaction end to end',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="text-muted">
                &mdash;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 10. Reproducing */}
      <section className="mt-16 max-w-3xl" aria-labelledby="repro">
        <h2 id="repro" className="text-2xl font-semibold text-ink">
          Reproducing these results
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          <p>
            The scanner, the target list, the scoring code and the raw output
            are all in the project repository. Anyone can clone it and rerun
            the scan. Findings that cannot be reproduced should not be
            trusted, and that applies to ours.
          </p>
          {data.engine && (
            <p className="card p-4 font-mono text-sm">
              Engine: {data.engine}
              <br />
              Last run: {formatDate(data.generatedAt)}
            </p>
          )}
        </div>

        <Link href="/" className="link mt-6 inline-flex min-h-[44px] items-center">
          Back to the scorecard
        </Link>
      </section>
    </div>
  )
}
