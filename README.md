# NaijaAccess

Automated accessibility auditing of Nigerian digital services, with a public scorecard.

Nigeria has an estimated 25 to 35 million people living with a disability. Seeing difficulty is the most common at 8.8 percent of adults. Under the Nigerian Communications Act 2003 the Commission is responsible for ensuring their needs are taken into account in communications services, and the Consumer Code of Practice Regulations 2024 is in force. What is missing is measurement.

This project scans Nigerian banking, telecom and government websites against WCAG 2.1 AA, scores them, and publishes the result.

## Current findings

From the scan committed in `data/scan-results.json`:

| | |
|---|---|
| Services scanned | 10 of 12 (2 unreachable) |
| Average score | 44 / 100 |
| Scoring below 60 | 6 |
| Total critical failures | 70 |

Banking averages 26 out of 100. Telecom averages 88. The Commission's own site scores 0, with 17 critical and 46 serious failures.

## Running it

Requires Node 20 or later.

```bash
npm install
npx playwright install chromium

npm run scan          # scan every target, writes data/scan-results.json
npm run dev           # dashboard at http://localhost:3000
```

No database, no API keys, no cloud account. Results are plain JSON on disk, so the whole thing runs offline.

### Other commands

```bash
npm run scan:one gtbank   # rescan a single target
npm run scan:demo         # placeholder rows, before any real scan
npm run build             # production build
npm run a11y:self         # audit this dashboard against its own rules
npm run typecheck
npm run lint
```

`npm run a11y:self` needs the production server running:

```bash
npm run build && npm start    # terminal one
npm run a11y:self             # terminal two
```

It currently passes with zero violations on every page. It should stay that way. A scorecard that fails its own audit has no standing to publish anyone else's.

## How it works

```
scanner/targets.json
        |
        v
scanner/scan-web.ts        Playwright loads each site, axe-core runs
        |                  WCAG 2.0/2.1/2.2 A and AA checks
        v
data/scan-results.json     plain JSON, committed to the repo
        |
        v
src/app/                   Next.js reads the JSON at build time
```

The scanner and the dashboard are deliberately separate. The scanner writes a file; the site only reads it. A failed scan can never take the dashboard down.

## Scoring

Each failing element deducts from 100:

| Severity | Deduction | Example |
|---|---|---|
| Critical | 10 | Button with no accessible name |
| Serious | 5 | Text below minimum contrast |
| Moderate | 2 | Heading levels skipped |
| Minor | 0.5 | Redundant link text |

Grades: A from 90, B from 75, C from 60, D from 40, F below.

An unlabelled button is silent to a screen reader, so the user cannot know it exists. Redundant link text is friction. Weighting them equally would flatter a service with many small problems and punish one with a single blocking failure. The weights live in `src/lib/scoring.ts` and are published on the methodology page so anyone can recompute a score.

## What this does not measure

Automated testing detects roughly a third of the barriers a real person meets. It finds a button with no name. It cannot tell you whether the reading order makes sense, or whether somebody can finish paying a bill.

Not covered:

- Pages behind a login, so authenticated banking is likely worse than shown
- Native mobile apps
- USSD menus
- Content quality and cognitive load
- Whether a person can complete a task end to end

`data/manual-findings.json` records tasks attempted by hand by a screen reader user. That file carries the weight the scanner cannot.

## Adding a service

Add an entry to `scanner/targets.json`:

```json
{
  "slug": "example-bank",
  "name": "Example Bank",
  "sector": "banking",
  "url": "https://www.example.com"
}
```

Sector must be `banking`, `telecom` or `government`. Then `npm run scan:one example-bank`.

## Recording manual findings

Edit `data/manual-findings.json`. Delete the example entry first.

```json
{
  "slug": "gtbank",
  "task": "Find the customer service phone number",
  "completed": false,
  "notes": "Reached the footer after 40 swipes. The number is an image with no alt text, so it was never announced.",
  "environment": "TalkBack 14 / Android 13 / Chrome",
  "testedAt": "2026-08-05"
}
```

Record what happened, in the tester's words where possible. Do not add an entry for a task nobody attempted.

## Automation

`.github/workflows/scan.yml` reruns the scan daily at 03:00 UTC and commits any change. It can also be triggered manually from the Actions tab.

`.github/workflows/ci.yml` runs typecheck, lint and build on every push.

## Deploying

Any Node host works. On Vercel, import the repository and accept the defaults. The free tier covers this comfortably: the site is static, the data file is kilobytes, and the scan runs in GitHub Actions rather than on the host.

## Licence

Findings are reproducible by design. Clone the repository, rerun the scan, and check the numbers. Results that cannot be reproduced should not be trusted, including ours.
