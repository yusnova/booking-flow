<div align="center">

# Booking flow

</div>

## Contents

| Section | What you’ll find |
| --- | --- |
| [Run the app](#run-the-app) | Node or Docker → **http://localhost:3000** |
| [Playwright (E2E)](#playwright-e2e) | Browsers, `npm test`, HTML report |
| [Repository layout](#repository-layout) | `ui/`, `automation/`, docs |
| [Fixture postcodes](#fixture-postcodes) | Demo postcodes & waste rules |
| [API (contract)](#api-contract) | REST routes |
| [Mocking & data](#mocking--data) | Where data is built |
| [Submission artifacts](#submission-artifacts) | Lighthouse report, axe CLI output |

## Run the app

> [!TIP]
> **Target URL** — [http://localhost:3000](http://localhost:3000) for both options below.

### Local (Node.js)

Fastest loop while you change code.

| Step | Command |
| ---: | --- |
| 1 | `cd ui` |
| 2 | `npm install` |
| 3 | `npm run dev` |

Open **http://localhost:3000** in the browser.

### Docker

Containerised app; you only need Docker on the machine, not a local Node install for *running* the UI (images still build with Node inside Docker).

> [!WARNING]
> **Shell location** — Run `docker compose` from the **project root**. **Not** from inside `ui/` or `automation/`. If the terminal is elsewhere, `cd` there first, e.g. `cd ~/Desktop/booking-flow` (use your real path).

| Step | Action |
| ---: | --- |
| 1 | Install and start **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (or Docker Engine on Linux). |
| 2 | `docker compose up --build` |
| 3 | Open **http://localhost:3000** when the service is ready. |


## Playwright (E2E)

> [!NOTE]
> **Automated checks** — Specs live under [`automation/playwright/tests/`](automation/playwright/tests/) (`*.ui.spec.ts`). The UI uses stable **`data-testid`** attributes for selectors.

### Run tests

```bash
cd automation
npm install
npx playwright install
npm test
```

> [!TIP]
> **Two terminals** — You can keep **`npm run dev`** in `ui/` in one terminal and **`npm test`** in another. Playwright waits for **http://127.0.0.1:3000** and usually **reuses** an existing server ([`reuseExistingServer`](automation/playwright.config.ts) when not in CI). If nothing is listening, it starts **`npm run dev`** in `ui/` for you.

## Repository layout

| Path | Role |
| --- | --- |
| [`ui/`](ui/) | Next.js 14 (App Router): screens and `/api/*` routes |
| [`automation/`](automation/) | Playwright (specs, page objects), [`manual-tests.md`](automation/manual-tests.md), [`bug-reports.md`](automation/bug-reports.md) |

## Fixture postcodes

| Postcode | Behaviour |
| --- | --- |
| `SW1A 1AA` | 12 addresses |
| `EC1A 1BB` | 0 addresses → empty state, manual address |
| `M1 1AE` | Slow lookup (~2.2s) |
| `BS1 4DJ` | First request **500**, retry succeeds |

**Waste:** General · Heavy (disables **12-yard** & **14-yard**) · Plasterboard (three handling options; “Dedicated” also disables **2-yard** & **3-yard**).

## API

| Method | Endpoint |
| --- | --- |
| `POST` | `/api/postcode/lookup` |
| `POST` | `/api/waste-types` |
| `GET` | `/api/skips?postcode=…&heavyWaste=…` |
| `POST` | `/api/booking/confirm` |

## Mocking & data

- No external APIs: responses are built in [`ui/app/api/`](ui/app/api/) using [`ui/lib/fixtures.ts`](ui/lib/fixtures.ts).
- `BS1 4DJ` uses in-process state in [`ui/lib/postcode-state.ts`](ui/lib/postcode-state.ts); see [`automation/bug-reports.md`](automation/bug-reports.md) for the multi-session caveat.
- E2E drives the real UI; no extra HTTP mocks beyond the app.

## Submission artifacts

With the app running at **http://localhost:3000**, run the checks below. Each command tells you what to expect in the output.

### Lighthouse

```bash
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --view
```

**What you’ll see:** Lighthouse finishes in the terminal with a short summary (scores and URL), then opens the **HTML report** in your default browser. The report shows **four category scores** (Performance, Accessibility, Best Practices, SEO) on a 0–100 scale, then expandable sections: metrics (e.g. First Contentful Paint, Largest Contentful Paint where applicable), opportunities, diagnostics, and passed audits. The **Accessibility** section lists specific checks (pass/fail) and links to documentation for each.

### A11y (axe)

```bash
npx @axe-core/cli http://localhost:3000
```

**What you’ll see:** The CLI prints a **text summary** to the terminal: counts of violations, passes, and incomplete checks, followed by **per-issue lines** (rule id, impact, short description, and selector or snippet) when violations exist. If there are **no** accessibility violations for the loaded page, the output states that the page has no violations (or equivalent zero-violation summary). Exit code is non-zero when violations are found, so CI can fail on regressions.
