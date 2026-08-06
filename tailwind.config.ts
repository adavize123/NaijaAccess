import type { Config } from 'tailwindcss'

/**
 * Palette is defined with CSS variables so light and dark mode share one
 * set of token names. Every foreground/background pair below was chosen to
 * clear WCAG AA contrast (4.5:1 for body text) in both modes.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        critical: 'rgb(var(--critical) / <alpha-value>)',
        serious: 'rgb(var(--serious) / <alpha-value>)',
        moderate: 'rgb(var(--moderate) / <alpha-value>)',
        minor: 'rgb(var(--minor) / <alpha-value>)',
        pass: 'rgb(var(--pass) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Fira Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}

export default config
