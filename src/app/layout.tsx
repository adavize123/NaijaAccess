import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'NaijaAccess | Nigerian Digital Accessibility Scorecard',
  description:
    'Automated WCAG 2.1 AA testing of Nigerian banking, telecom and government services, paired with manual screen reader testing.',
}

const NAV = [
  { href: '/', label: 'Scorecard' },
  { href: '/methodology', label: 'Methodology' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="skip-link"
        >
          Skip to main content
        </a>

        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-ink">
                NaijaAccess
              </span>
              <span className="text-sm text-muted">Accessibility Scorecard</span>
            </Link>
            <nav aria-label="Main">
              <ul className="flex items-center gap-2 text-sm">
                {NAV.map((item) => (
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
          </div>
        </header>

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
                methodology
              </Link>{' '}
              for what is measured and what is not.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
