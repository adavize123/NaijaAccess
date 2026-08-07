/**
 * English strings. This file is the reference for every other language.
 *
 * When adding a key, add it here first. The Dictionary type is derived from
 * this object, so any other language file missing a key will fail typecheck
 * rather than failing silently in the browser.
 */
export const en = {
  meta: {
    title: 'NaijaAccess',
    tagline: 'Accessibility Scorecard',
    description:
      'Automated accessibility testing of Nigerian banking, telecom and government websites, measured against WCAG 2.1 AA and published in full.',
  },

  nav: {
    scorecard: 'Scorecard',
    methodology: 'Methodology',
    skipToContent: 'Skip to main content',
    language: 'Language',
    chooseLanguage: 'Choose a language',
    /** Shown beside languages awaiting first-language review. */
    awaitingReview: 'awaiting review',
    reviewNotice:
      'This language is not yet reviewed by a first-language speaker. Text shown in English has not been translated.',
  },

  home: {
    title: 'Nigerian Digital Accessibility Scorecard',
    intro:
      'Almost 12 percent of Nigerians aged 15 and over have some level of disability, and difficulty seeing is the most common at 8.8 percent. This scorecard measures whether the banking, telecom and government services they depend on can actually be used with a screen reader.',
    sourceNote: 'Prevalence from the',
    sourceName: '2018 Nigeria Demographic and Health Survey',
    sourceTail:
      ', analysed with the Washington Group Short Set across 67,663 household members.',

    statServices: 'Services audited',
    statAverage: 'Average score',
    statFailing: 'Scoring below 60',
    statCritical: 'Critical failures',

    sectorTitle: 'Average by sector',
    sectorNote: 'Telecom operators already meet a standard the rest do not.',

    tableTitle: 'All services',
    lastScan: 'Last scan',

    colService: 'Service',
    colSector: 'Sector',
    colCritical: 'Critical',
    colSerious: 'Serious',
    colScore: 'Score',
    unreachable: 'unreachable',
    noData: 'no data',
    tableCaption: 'Accessibility scores by service, lowest first',

    whyTitle: 'Why an unlabelled button is an economic problem',
    whyFairnessTitle: 'Fairness',
    whyFairnessBody:
      'A blind customer pays the same account charges and the same tariffs as everyone else, for a service they cannot fully use. That is a consumer protection question, and consumer protection is squarely within the Commission’s remit.',
    whyTalentTitle: 'Talent',
    whyTalentBody:
      'Of roughly 7 million Nigerian children with a disability, UNESCO estimates about 6.69 million are out of school. Those who do qualify then meet application portals they cannot complete. The barrier is rarely ability.',
    whyParticipationTitle: 'Participation',
    whyParticipationBody:
      'If you cannot use a banking app you cannot run a business. If you cannot finish an online form you cannot register one. Each inaccessible service removes another way to take part in the economy.',
    whyClose:
      'Accessibility is usually discussed as a cost. It is more accurately a question of how much of the working population a service is built to exclude.',

    askTitle: 'What this is for',
    askBody:
      'Under the Nigerian Communications Act 2003, the Commission is responsible for ensuring that the needs of people with disabilities are taken into account in the provision of communications services. The Consumer Code of Practice Regulations 2024 is in force. The legal instruments exist. What is missing is measurement.',
    askClose:
      'This scorecard runs continuously, so compliance can be observed rather than asserted. Attaching accessibility reporting to the Consumer Code would need no new legislation and no new budget.',
  },

  service: {
    backToScorecard: 'Back to the scorecard',
    scannedOn: 'Scanned on',
    notScanned: 'This service could not be reached during the last scan.',
    violationsTitle: 'What is failing',
    violationsNone: 'No violations were detected by the automated scan.',
    affectedElements: 'affected elements',
    affectedElement: 'affected element',
    sampleMarkup: 'Sample of the failing markup',
    howToFix: 'How to fix this',
    manualTitle: 'Manual testing',
    manualIntro:
      'Tasks attempted by hand by a screen reader user. Automated testing detects roughly a third of real barriers, so these findings carry the weight the scanner cannot.',
    manualPending:
      'Manual testing for this service has not yet been carried out.',
    taskCompleted: 'Completed',
    taskFailed: 'Could not complete',
  },

  severity: {
    critical: 'Critical',
    serious: 'Serious',
    moderate: 'Moderate',
    minor: 'Minor',
  },

  sector: {
    banking: 'Banking',
    telecom: 'Telecom',
    government: 'Government',
  },

  footer: {
    sourceCode: 'Source code',
    scannedWith: 'Scanned with axe-core against WCAG 2.1 AA.',
    methodPublished: 'Method and raw results published in full.',
  },
} as const

/** Every other language file must match this shape. */
export type Dictionary = typeof en
