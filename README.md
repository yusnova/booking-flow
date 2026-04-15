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
| [Submission artefacts](#submission-artefacts-typical-brief) | Screens, video, Lighthouse, a11y |

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

### Prerequisites

| Requirement | Command / note |
| --- | --- |
| UI deps | Once: `cd ui` → `npm install` (Playwright may run `npm run dev` in `ui/`). |
| Automation | `cd automation` → `npm install` |
| Browsers | `cd automation` → `npx playwright install` |

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

## API (contract)

| Method | Endpoint |
| --- | --- |
| `POST` | `/api/postcode/lookup` |
| `POST` | `/api/waste-types` |
| `GET` | `/api/skips?postcode=…&heavyWaste=…` |
| `POST` | `/api/booking/confirm` |

Query strings should use `heavyWaste=true` (not the stray `heavyWaste;=` typo from some briefs).

## Mocking & data

- No external APIs: responses are built in [`ui/app/api/`](ui/app/api/) using [`ui/lib/fixtures.ts`](ui/lib/fixtures.ts).
- `BS1 4DJ` uses in-process state in [`ui/lib/postcode-state.ts`](ui/lib/postcode-state.ts); see [`automation/bug-reports.md`](automation/bug-reports.md) for the multi-session caveat.
- E2E drives the real UI; no extra HTTP mocks beyond the app.

## Submission artefacts (typical brief)

| # | What |
| --- | --- |
| 1 | **Screenshots** — For each important screen, save an image on a **narrow** window (phone width) and again on **desktop** width. Cover: postcode step after a successful lookup; BS1 first error then after retry; EC1A with no addresses (manual address); skip sizes with heavy waste (large skips turned off); review with prices; booking confirmed. |
| 2 | **Screen recording** — One continuous clip from opening the app on step 1 through clicking confirm until the success page appears (about 1–2 minutes is enough). |
| 3 | **Lighthouse** — `npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --view` |
| 4 | **A11y** — Lighthouse accessibility tab or `npx @axe-core/cli http://localhost:3000` |
