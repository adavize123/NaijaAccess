import type { Fix } from '@/components/FixDemo'

/**
 * Every example here is a violation type the scan actually found on
 * Nigerian services, with counts from the committed results. The markup is
 * simplified for legibility, but the rule, the severity and the frequency
 * are real.
 */
export const FIXES: Fix[] = [
  {
    rule: 'image-alt',
    impact: 'critical',
    title: 'An image carrying information, with nothing to announce',
    why: 'When an image is the only thing conveying something, and it has no text alternative, a screen reader has nothing to say. A logo, a promotional banner, a phone number set as an image: all silent.',
    broken: `<img src="/customer-care.png">`,
    fixed: `<img src="/customer-care.png"
     alt="Customer care: 0700 123 4567">`,
    announcedBroken: 'image',
    announcedFixed: 'Customer care: 0700 123 4567, image',
    wcag: 'WCAG 2.0 A · 1.1.1 Non-text Content',
    effort: 'One attribute',
    found: 43,
  },
  {
    rule: 'link-name',
    impact: 'serious',
    title: 'A link with no readable name',
    why: 'Links made only of an icon, or wrapped around an image with no alternative text, are announced as nothing. People who navigate by pulling up a list of links on the page get a list of blanks.',
    broken: `<a href="/transfer">
  <svg class="icon-arrow"></svg>
</a>`,
    fixed: `<a href="/transfer" aria-label="Make a transfer">
  <svg class="icon-arrow" aria-hidden="true"></svg>
</a>`,
    announcedBroken: 'link',
    announcedFixed: 'Make a transfer, link',
    wcag: 'WCAG 2.0 A · 2.4.4 Link Purpose',
    effort: 'One attribute',
    found: 71,
  },
  {
    rule: 'button-name',
    impact: 'critical',
    title: 'A button the screen reader cannot name',
    why: 'This is the failure people mean when they say an app is unusable. Moving through the page, every control announces as the single word "button". There is no way to know which one submits the form.',
    broken: `<button class="btn-primary">
  <i class="fa fa-search"></i>
</button>`,
    fixed: `<button class="btn-primary" aria-label="Search">
  <i class="fa fa-search" aria-hidden="true"></i>
</button>`,
    announcedBroken: 'button. button. button.',
    announcedFixed: 'Search, button',
    wcag: 'WCAG 2.0 A · 4.1.2 Name, Role, Value',
    effort: 'One attribute',
    found: 3,
  },
  {
    rule: 'color-contrast',
    impact: 'serious',
    title: 'Text too faint to read',
    why: 'Light grey on white looks refined on a designer’s monitor. On a phone in Nigerian daylight, or to anyone with reduced vision, it disappears. This was the single most common failure in the scan.',
    broken: `.help-text {
  color: #9ca3af;   /* 2.5:1 on white */
  background: #ffffff;
}`,
    fixed: `.help-text {
  color: #4b5563;   /* 7.0:1 on white */
  background: #ffffff;
}`,
    announcedBroken: 'Text is announced, but cannot be read by sight',
    announcedFixed: 'Readable in daylight and with reduced vision',
    wcag: 'WCAG 2.0 AA · 1.4.3 Contrast Minimum',
    effort: 'One colour value',
    found: 74,
  },
  {
    rule: 'label',
    impact: 'critical',
    title: 'A form field with only a placeholder',
    why: 'A placeholder disappears the moment somebody starts typing, and many screen readers never announce it at all. The person is left in a field with no idea what belongs there.',
    broken: `<input type="text" placeholder="Account number">`,
    fixed: `<label for="acct">Account number</label>
<input type="text" id="acct" placeholder="0123456789">`,
    announcedBroken: 'edit, blank',
    announcedFixed: 'Account number, edit, blank',
    wcag: 'WCAG 2.0 A · 3.3.2 Labels or Instructions',
    effort: 'One element',
    found: 0,
  },
  {
    rule: 'target-size',
    impact: 'serious',
    title: 'Controls too small to hit',
    why: 'A control under 24 pixels is hard to hit for anyone with a tremor, limited dexterity, or simply large hands on a small phone. Missing repeatedly is not a minor irritation when the control transfers money.',
    broken: `.icon-btn {
  width: 16px;
  height: 16px;
}`,
    fixed: `.icon-btn {
  min-width: 44px;
  min-height: 44px;
}`,
    announcedBroken: 'Announced correctly, but difficult to activate',
    announcedFixed: 'Comfortable to hit on a phone',
    wcag: 'WCAG 2.2 AA · 2.5.8 Target Size',
    effort: 'Two CSS values',
    found: 10,
  },
]
