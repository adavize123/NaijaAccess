import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { getTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export const metadata: Metadata = {
  title: 'NaijaAccess | Nigerian Digital Accessibility Scorecard',
  description:
    'Automated WCAG 2.1 AA testing of Nigerian banking, telecom and government services, paired with manual screen reader testing.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale, meta, t } = await getTranslation()

  const nav = [
    { href: '/', label: t.nav.scorecard },
    { href: '/methodology', label: t.nav.methodology },
  ]

  return (
    // The lang attribute is not decoration. A screen reader pronounces Yoruba
    // with English rules unless the document declares otherwise, and getting
    // this wrong is itself a WCAG failure (3.1.1) that several of the services
    // in this scorecard commit.
    <html lang={meta.bcp47}>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main" className="skip-link">
          {t.nav.skipToContent}
        </a>

        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-ink">
                {t.meta.title}
              </span>
              <span className="text-sm text-muted">{t.meta.tagline}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <nav aria-label="Main">
                <ul className="flex items-center gap-2 text-sm">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-[44px] cursor-pointer items-center rounded px-3 text-muted transition-colors duration-200 hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <LanguageSwitcher current={locale} />
            </div>
          </div>
        </header>

        {/* Shown only while a language is unreviewed. Saying so is the point:
            claiming five working languages when four are English would be the
            kind of unchecked detail this project exists to measure. */}
        {!meta.reviewed && (
          <div
            role="status"
            className="border-b border-line bg-canvas px-6 py-2 text-center text-sm text-muted"
          >
            <span lang="en-NG">{t.nav.reviewNotice}</span>
          </div>
        )}

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-line bg-surface">
          <div className="mx-auto max-w-content px-6 py-8 text-sm text-muted">
            <p className="max-w-2xl">
              Automated testing detects roughly a third of accessibility
              failures. Scores here are a floor, not a certificate of
              compliance. See the{' '}
              <Link href="/methodology" className="link">
                {t.nav.methodology.toLowerCase()}
              </Link>{' '}
              for what is measured and what is not.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
