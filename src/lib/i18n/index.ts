import { cookies } from 'next/headers'
import { en, type Dictionary } from './en'
import { ha } from './ha'
import { yo } from './yo'
import { ig } from './ig'
import { pcm } from './pcm'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_META,
  isLocale,
  type Locale,
} from './config'

export * from './config'
export type { Dictionary }

const PARTIALS: Record<Locale, Partial<Dictionary>> = { en, ha, yo, ig, pcm }

/**
 * Merge a partial translation over English, one level deep.
 *
 * Deep merge rather than a straight spread, because a language file that
 * translates only `nav` would otherwise wipe out every other section. Missing
 * keys fall through to English, which is what lets a language be filled in a
 * section at a time.
 */
function mergeOverEnglish(partial: Partial<Dictionary>): Dictionary {
  const out = {} as Record<string, unknown>

  for (const key of Object.keys(en) as (keyof Dictionary)[]) {
    const base = en[key]
    const override = partial[key]

    if (override && typeof base === 'object' && typeof override === 'object') {
      out[key] = { ...base, ...override }
    } else {
      out[key] = base
    }
  }

  return out as Dictionary
}

const CACHE = new Map<Locale, Dictionary>()

export function getDictionary(locale: Locale): Dictionary {
  const hit = CACHE.get(locale)
  if (hit) return hit

  const merged =
    locale === DEFAULT_LOCALE ? en : mergeOverEnglish(PARTIALS[locale])

  CACHE.set(locale, merged)
  return merged
}

/**
 * Read the chosen language from the cookie.
 *
 * A cookie rather than a URL prefix keeps every page a single static build.
 * With `/yo/service/gtbank` style routes the site would need one prerendered
 * copy per language per service, for translations that do not exist yet.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Locale plus its dictionary and metadata, for a page to use in one call. */
export async function getTranslation() {
  const locale = await getLocale()
  return {
    locale,
    meta: LOCALE_META[locale],
    t: getDictionary(locale),
  }
}
