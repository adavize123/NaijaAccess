'use client'

import { useId, useState } from 'react'

export type Fix = {
  rule: string
  impact: 'critical' | 'serious'
  title: string
  /** Why it matters, in one sentence, no jargon. */
  why: string
  broken: string
  fixed: string
  /** What a screen reader says in each case. */
  announcedBroken: string
  announcedFixed: string
  wcag: string
  effort: string
  /** How many failing elements of this kind the scan found. */
  found: number
}

/**
 * Before and after for one real violation type, with the screen reader
 * output shown for each. The point of this component is to make the size
 * of the fix visible: almost every one of these is a single attribute.
 */
export function FixDemo({ fix }: { fix: Fix }) {
  const [showFixed, setShowFixed] = useState(false)
  const panelId = useId()

  return (
    <article className="card overflow-hidden">
      <header className="border-b border-line p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
              fix.impact === 'critical'
                ? 'border-critical text-critical'
                : 'border-serious text-serious'
            }`}
          >
            {fix.impact}
          </span>
          <code className="font-mono text-sm text-ink">{fix.rule}</code>
          <span className="text-sm text-muted">
            {fix.found} found in this scan
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-ink">{fix.title}</h3>
        <p className="mt-1 text-muted">{fix.why}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-canvas px-5 py-3">
        <div
          role="group"
          aria-label="Show broken or fixed version"
          className="inline-flex overflow-hidden rounded border border-line"
        >
          <button
            type="button"
            onClick={() => setShowFixed(false)}
            aria-pressed={!showFixed}
            aria-controls={panelId}
            className={`min-h-[44px] cursor-pointer px-4 text-sm font-medium transition-colors duration-200 ${
              !showFixed
                ? 'bg-critical text-white'
                : 'text-muted hover:text-ink'
            }`}
          >
            As found
          </button>
          <button
            type="button"
            onClick={() => setShowFixed(true)}
            aria-pressed={showFixed}
            aria-controls={panelId}
            className={`min-h-[44px] cursor-pointer px-4 text-sm font-medium transition-colors duration-200 ${
              showFixed ? 'bg-pass text-white' : 'text-muted hover:text-ink'
            }`}
          >
            Fixed
          </button>
        </div>
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">{fix.effort}</span> to fix
        </p>
      </div>

      <div id={panelId} className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Markup
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label={`Markup, ${showFixed ? 'fixed' : 'as found'}`}
          className="scroll-x mt-2 rounded bg-canvas p-3"
        >
          <code className="font-mono text-xs leading-relaxed text-ink">
            {showFixed ? fix.fixed : fix.broken}
          </code>
        </pre>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">
          What a screen reader announces
        </p>
        <p
          className={`mt-2 rounded border-l-4 bg-canvas p-3 font-mono text-sm ${
            showFixed
              ? 'border-pass text-ink'
              : 'border-critical text-critical'
          }`}
        >
          {showFixed ? fix.announcedFixed : fix.announcedBroken}
        </p>

        <p className="mt-4 font-mono text-xs uppercase text-muted">
          {fix.wcag}
        </p>
      </div>
    </article>
  )
}
