# Translators

The interface is available in English, Hausa, Yoruba, Igbo and Nigerian Pidgin.

**Only English is complete.** The other four fall back to English until a
first-language speaker has checked them, and the language selector says so
rather than presenting untranslated pages as translated.

This is deliberate. The argument this project makes is that Nigerian services
fail people by not attending to detail. Shipping Yoruba that reads as foreign
to Yoruba speakers would be the same failure in a different form.

## Status

| Language | File | Reviewed by |
|---|---|---|
| English | `src/lib/i18n/en.ts` | Complete, reference |
| Hausa | `src/lib/i18n/ha.ts` | Not yet reviewed |
| Yorùbá | `src/lib/i18n/yo.ts` | Not yet reviewed |
| Igbo | `src/lib/i18n/ig.ts` | Not yet reviewed |
| Naijá (Pidgin) | `src/lib/i18n/pcm.ts` | Not yet reviewed |

## Contributing a translation

1. Open `src/lib/i18n/en.ts` and read the section you want to translate.
2. Open the file for your language and add the same keys with your text.
3. Add your name to the table above.
4. Run `npm run typecheck`. A mistyped key fails the build rather than
   silently falling back to English.

Partial files are fine and expected. Translate the navigation first if you are
short of time, since that is what every visitor sees.

## Notes for translators

- **Keep it plain.** Much of the audience will be reading on a phone, and some
  will be using a screen reader. Short sentences survive both better.
- **Leave technical terms in English where that is what people say.** WCAG,
  screen reader and axe-core do not need translating, and inventing a term
  makes the text harder to follow, not easier.
- **Tone.** Direct and factual. This is a measurement report, not marketing.
- **Numbers stay as numerals**, so they read correctly regardless of language.
