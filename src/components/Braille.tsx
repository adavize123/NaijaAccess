/**
 * Braille rendered as a visual motif.
 *
 * This is decoration, not an accessibility feature. Braille on a screen
 * cannot be felt, so these cells are hidden from assistive technology and
 * the meaning is always carried by real text elsewhere. Presenting a
 * printed dot pattern as though it served blind users would be the same
 * kind of gesture this project exists to measure.
 *
 * Unicode Braille patterns (U+2800 onward) are used rather than drawn dots,
 * so the motif scales with font size and needs no images.
 */

/** Grade 1 (uncontracted) Braille, letters and space only. */
const CELLS: Record<string, string> = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓',
  i: '⠊', j: '⠚', k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏',
  q: '⠟', r: '⠗', s: '⠎', t: '⠞', u: '⠥', v: '⠧', w: '⠺', x: '⠭',
  y: '⠽', z: '⠵', ' ': '⠀',
}

export function toBraille(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => CELLS[ch] ?? '')
    .join('')
}

/**
 * A word set in Braille cells, paired with a thin rule. Used as a section
 * divider. Hidden from screen readers because it conveys nothing they can
 * use.
 */
export function BrailleRule({
  word,
  className = '',
}: {
  word: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      {/* Full-strength brand colour rather than a tint. A faded motif fails
          contrast, and this tool has no business shipping a decoration it
          would flag on somebody else's site. */}
      <span className="select-none font-mono text-xl leading-none text-brand">
        {toBraille(word)}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

/**
 * Braille cells shown beneath a number or short label, as a small visual
 * accent. Always paired with the real value in text.
 */
export function BrailleAccent({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`select-none font-mono leading-none text-muted ${className}`}
    >
      {toBraille(text)}
    </span>
  )
}
