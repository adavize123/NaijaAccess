'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  LOCALES,
  LOCALE_META,
  LOCALE_COOKIE,
  type Locale,
} from '@/lib/i18n/config'

/**
 * Language selector.
 *
 * Built on a native <select> rather than a custom dropdown. A listbox built
 * from divs needs roving tabindex, arrow key handling, type-ahead and correct
 * ARIA, and gets at least one of them wrong most of the time. The native
 * control has all of that already, works with every screen reader, and on a
 * phone opens the platform picker. On a site that audits other people's
 * accessibility, using the element that already works is the only defensible
 * choice.
 *
 * Selecting a language writes a cookie and refreshes, so the server rerenders
 * with the new dictionary and the correct lang attribute on <html>.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState<Locale>(current)

  function choose(next: Locale) {
    setValue(next)

    // Path-wide so it survives navigation. A year is long enough that a
    // returning reader is not asked again. SameSite=Lax is sufficient: this
    // is a display preference, not a credential.
    document.cookie = [
      `${LOCALE_COOKIE}=${next}`,
      'path=/',
      `max-age=${60 * 60 * 24 * 365}`,
      'samesite=lax',
    ].join('; ')

    startTransition(() => router.refresh())
  }

  const meta = LOCALE_META[value]

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="locale" className="sr-only">
        Choose a language
      </label>

      <select
        id="locale"
        value={value}
        disabled={pending}
        onChange={(e) => choose(e.target.value as Locale)}
        className="min-h-[44px] cursor-pointer rounded border border-line bg-surface px-3 py-1 text-sm text-ink transition-colors duration-200 hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
      >
        {LOCALES.map((code) => {
          const m = LOCALE_META[code]
          return (
            <option key={code} value={code} lang={m.bcp47}>
              {m.native}
              {m.reviewed ? '' : ' (awaiting review)'}
            </option>
          )
        })}
      </select>

      {/* Announced when the choice changes, so a screen reader user is told
          the page has been rebuilt rather than left guessing. */}
      <span aria-live="polite" className="sr-only">
        {pending ? 'Changing language' : `Language: ${meta.english}`}
      </span>
    </div>
  )
}
