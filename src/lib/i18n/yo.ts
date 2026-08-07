import type { Dictionary } from './en'

/**
 * Yoruba. AWAITING FIRST-LANGUAGE REVIEW.
 *
 * This file is deliberately empty.
 *
 * The submission states that we will not ship machine translation, and text
 * produced without a Yoruba speaker checking it is machine translation
 * whatever tool produced it. Until a first-language speaker fills this in,
 * every string falls back to English and the language selector says so.
 *
 * To contribute: copy a key from en.ts, translate it, and add your name to
 * TRANSLATORS.md. Partial files are fine. Missing keys fall back to English,
 * so nothing breaks if only part is done.
 *
 * The `Partial<Dictionary>` type means any key you add is checked against the
 * English original, so a typo in a key name fails the build rather than
 * silently showing English.
 */
export const yo: Partial<Dictionary> = {}
