# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Reference Documents

Always consult these files when making changes or evaluating work:

- [README.md](README.md) — project purpose and goals (metric↔imperial conversion, fraction rounding)
- [REQUIREMENTS.csv](REQUIREMENTS.csv) — the authoritative requirements specification; every row is a testable requirement
- [CONTRIBUTING.md](CONTRIBUTING.md) — setup, local dev, build, and deployment instructions

## Core Philosophy

- **No data duplication** — a value should have one source of truth; derive or convert, never store the same data twice.
- **Follow React and JS community best practices** — the authoritative sources are [react.dev](https://react.dev) (official React docs), the [Airbnb JavaScript/React Style Guide](https://github.com/airbnb/javascript) (the project's own TODOs already reference this), and TC39 for language-level decisions. When in doubt, defer to these.

## Commands

```bash
npm start          # Start local dev server (auto-refresh)
npm test           # Run tests (Vitest/React Testing Library)
npm run build      # Production build to /dist
npm run deploy     # Manually build + deploy to GitHub Pages (tests not gated)
```

To run a single test file:

```bash
npx vitest run App.test
```

## Testing Against Requirements (Pre-Deploy Checklist)

Before every deploy, read [REQUIREMENTS.csv](REQUIREMENTS.csv) and verify that a test exists and passes for each row. Reference the requirement number in the test description (e.g. `it('[Req 2] rounds 0.4375 inches to 7/16"', ...)`). Add tests for any row without coverage before deploying.

## Architecture

This is a single-component React app (Vite + React) with no routing or external state management. Everything lives in [src/App.jsx](src/App.jsx).

**Conversion logic (pure functions at top of App.js):**

- `mm2in`, `in2mm`, `ft2in`, `in2ft` — unit conversions
- `nearest(inches, divisor)` — core logic: converts a decimal inch value to a fraction string (e.g. `3 7/16"` or `2' 3 1/8"`) rounded to the nearest `1/divisor`
- `round2divisor`, `findGcd` — helpers for rounding and fraction reduction

**State shape:** Each of the three inputs (mm, inches, feet) is an object `{ input, output, error }`. A shared `divisor` state controls rounding precision.

**Input flow:** Any of the three input fields (`onChangeMM`, `onChangeIN`, `onChangeFT`) triggers conversion of all three fields simultaneously via `validateMeasurement` → conversion functions → `nearest`.

Expression evaluation uses `Function('"use strict"; return (' + str + ')')()` with an allowlist regex guard — no external math library.

**Deployment:** Automated via [.github/workflows/test-and-deploy.yml](.github/workflows/test-and-deploy.yml) — pushing to `main` runs tests then deploys to the `gh-pages` branch. The `homepage` field in `package.json` must stay set to `https://brio50.github.io/divisor`.

## Aesthetic Principles

- **50/50 input/output split** — each row uses CSS grid `minmax(0, 1fr) auto minmax(min-content, 1fr)`: input and output share equal space by default; output column expands only when content requires it.
- **Right-align output** — output spans use `justifyContent: 'flex-end'` so values align along the right edge.
- **No layout shift** — the rounding error badge is always rendered; use `visibility: hidden` (not conditional rendering) when there is no error, so the layout stays stable.
- **MM has no rounding error badge** — MM is the raw decimal input; the rounding concept only applies to the fractional inch/feet outputs.
- **Consistent label styling** — all field group labels use the same `form-label` class and spacing; don't vary font weight or size between sections.
- **Container width consistency** — avoid Bootstrap `.row` on containers that must match sibling widths; `.row` applies negative horizontal margins that make it wider than block siblings.
- **Placeholder text** — use woodworker-relevant examples: `e.g. 18` (mm), `e.g. 3/4` (in), `e.g. 96/12` (ft) relating to a sheet of plywood.
