/**
 * Language configuration.
 *
 * A note on why four of these five are marked incomplete.
 *
 * Machine translation of an accessibility site would be self-defeating. This
 * project's argument is that Nigerian services fail people by not attending to
 * detail, and shipping Yoruba that reads as foreign to Yoruba speakers would be
 * the same failure in a different form. Each language is therefore marked
 * `reviewed: false` until a first-language speaker has checked it, and the
 * interface says so plainly rather than pretending otherwise.
 *
 * Until then, missing keys fall back to English rather than showing a blank or
 * a raw key.
 */

export const LOCALES = ['en', 'ha', 'yo', 'ig', 'pcm'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export type LocaleMeta = {
  code: Locale
  /** Name in the language itself, which is what a speaker looks for. */
  native: string
  /** Name in English, for the accessible label. */
  english: string
  /** BCP 47 tag for the lang attribute. Wrong pronunciation without it. */
  bcp47: string
  /** Has a first-language speaker checked this? */
  reviewed: boolean
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    native: 'English',
    english: 'English',
    bcp47: 'en-NG',
    reviewed: true,
  },
  ha: {
    code: 'ha',
    native: 'Hausa',
    english: 'Hausa',
    bcp47: 'ha-NG',
    reviewed: false,
  },
  yo: {
    code: 'yo',
    native: 'Yorùbá',
    english: 'Yoruba',
    bcp47: 'yo-NG',
    reviewed: false,
  },
  ig: {
    code: 'ig',
    native: 'Igbo',
    english: 'Igbo',
    bcp47: 'ig-NG',
    reviewed: false,
  },
  pcm: {
    code: 'pcm',
    native: 'Naijá',
    english: 'Nigerian Pidgin',
    bcp47: 'pcm-NG',
    reviewed: false,
  },
}

export const LOCALE_COOKIE = 'naijaaccess_locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
