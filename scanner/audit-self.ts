/**
 * Runs the same axe-core checks against our own dashboard.
 *
 *   npm run build && npm start     (in one terminal)
 *   npm run a11y:self              (in another)
 *
 * An accessibility scorecard that fails its own audit has no standing to
 * publish anyone else's score. This must pass before the project ships.
 */
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.AUDIT_URL ?? 'http://localhost:3000'
const PAGES = ['/', '/methodology', '/service/gtbank']
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const main = async () => {
  const browser = await chromium.launch()
  let failures = 0

  const context = await browser.newContext()

  for (const path of PAGES) {
    const page = await context.newPage()
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze()
    console.log(`\n${path}`)

    if (violations.length === 0) {
      console.log('  no violations')
    } else {
      failures += violations.length
      for (const v of violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`)
        console.log(`     ${v.nodes[0]?.html?.slice(0, 120)}`)
      }
    }
    await page.close()
  }

  await context.close()
  await browser.close()

  console.log(
    failures === 0
      ? '\nSelf audit passed.'
      : `\nSelf audit found ${failures} rule violation(s). Fix before shipping.`,
  )
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
