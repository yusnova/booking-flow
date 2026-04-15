# Booking flow

UK skip hire **multi-step booking** demo: Next.js UI, in-app API routes, deterministic fixtures, and Playwright E2E checks.

---

## Contents

| Section | What you’ll find |
| --- | --- |
| [Run the app](#run-the-app) | Local Node or Docker → open **http://localhost:3000** |
| [Playwright (E2E)](#playwright-e2e) | Install browsers, run `npm test`, reports |
| [Repository layout](#repository-layout) | Where `ui/`, `automation/`, and docs live |
| [Fixture postcodes](#fixture-postcodes) | Deterministic demo data |
| [API (contract)](#api-contract) | REST routes the UI uses |
| [Mocking & data](#mocking--data) | How responses are produced |
| [Submission artefacts](#submission-artefacts-typical-brief) | Screens, video, Lighthouse, a11y |

---

## Run the app

Both paths below serve the same URL:

> **http://localhost:3000**

---

### Local (Node.js)

Use this when you want the fastest edit–refresh loop.

| Step | Command |
| ---: | --- |
| 1 | `cd ui` |
| 2 | `npm install` |
| 3 | `npm run dev` |

Then open **http://localhost:3000** in your browser.

---

### Docker

Use this when you prefer a containerised stack (no local Node required on the host beyond Docker).

**Working directory** — run every Docker command from the **project root**: the folder where **`docker-compose.yml`**, **`ui/`**, **`automation/`**, and **`README.md`** sit side by side.  
If your terminal is somewhere else, `cd` to that folder first (example: `cd ~/Desktop/booking-flow` — adjust to your path).

| Step | Action |
| ---: | --- |
| 1 | Install and start **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (or Docker Engine on Linux). |
| 2 | Open a terminal **in the project root** (see above). |
| 3 | Run `docker compose up --build`. |
| 4 | When the container is ready, open **http://localhost:3000**. |

**`zsh: command not found: docker`** — Docker is not installed or not on your `PATH`. Install/start Docker Desktop and use a new terminal. This is **not** fixed by `cd ui`.

---

## Playwright (E2E)

Browser tests live under [`automation/playwright/tests/`](automation/playwright/tests/) (`*.ui.spec.ts` only). The app uses stable **`data-testid`** hooks so selectors stay reliable.

### Prerequisites

| Requirement | Command / note |
| --- | --- |
| UI dependencies | Once: `cd ui` → `npm install` (Playwright may start `npm run dev` in `ui/`). |
| Automation deps | `cd automation` → `npm install` |
| Browsers | `cd automation` → `npx playwright install` |

### Run tests

From **`automation/`**:

```bash
cd automation
npm install
npx playwright install
npm test
```

**Two terminals (optional)** — You can leave **`npm run dev`** running in `ui/` in one terminal and run **`npm test`** in a **second** terminal. Playwright waits for **http://127.0.0.1:3000**; if something is already listening, it usually **reuses** it ([`reuseExistingServer`](automation/playwright.config.ts) when not in CI). If nothing is on port 3000, it starts **`npm run dev`** in `ui/` for you.

**One terminal** — Stop the dev server (`Ctrl+C`), then run the block above; Playwright will bring the app up for the test run.

| Script | Purpose |
| --- | --- |
| `npm test` | Headless run: ensure app on `:3000`, run all specs |
| `npm run test:ui-mode` | Playwright **UI Mode** (interactive / debug), same specs |

Optional env overrides: create **`automation/.env`** — see [`automation/common/config/config.ts`](automation/common/config/config.ts) (`BASE_URL`, `WEB_SERVER_URL`, `UI_PROJECT_DIR`, `WEB_SERVER_COMMAND`). HTML report: **`automation/report/`**.

**Flows covered:** (1) General → 4-yard → review → confirm → success. (2) Heavy → large skips disabled → 6-yard → confirm.

---

## Repository layout

| Path | Role |
| --- | --- |
| [`ui/`](ui/) | Next.js 14 (App Router): screens and `/api/*` routes |
| [`automation/`](automation/) | Playwright (specs, page objects), [`manual-tests.md`](automation/manual-tests.md), [`bug-reports.md`](automation/bug-reports.md) |

**Inside `automation/`** — `playwright/` (`.ui.spec.ts`, `*.page.ts`), `common/` (`config/`, `constants/`, `helpers/`).

---

## Fixture postcodes

| Postcode | Behaviour |
| --- | --- |
| `SW1A 1AA` | 12 addresses |
| `EC1A 1BB` | 0 addresses → empty state, manual address |
| `M1 1AE` | Slow lookup (~2.2s) |
| `BS1 4DJ` | First request **500**, retry succeeds |

**Waste:** General · Heavy (disables **12-yard** & **14-yard**) · Plasterboard (three handling options; “Dedicated” also disables **2-yard** & **3-yard**).

---

## API (contract)

| Method | Endpoint |
| --- | --- |
| `POST` | `/api/postcode/lookup` |
| `POST` | `/api/waste-types` |
| `GET` | `/api/skips?postcode=…&heavyWaste=…` |
| `POST` | `/api/booking/confirm` |

Query strings should use `heavyWaste=true` (not the stray `heavyWaste;=` typo from some briefs).

---

## Mocking & data

- No external APIs: responses are built in [`ui/app/api/`](ui/app/api/) using [`ui/lib/fixtures.ts`](ui/lib/fixtures.ts).
- `BS1 4DJ` uses in-process state in [`ui/lib/postcode-state.ts`](ui/lib/postcode-state.ts); see [`automation/bug-reports.md`](automation/bug-reports.md) for the multi-session caveat.
- E2E drives the real UI; no extra HTTP mocks beyond the app.

---

## Submission artefacts (typical brief)

| # | What |
| --- | --- |
| 1 | **Screenshots** — For each important screen, save an image on a **narrow** window (phone width) and again on **desktop** width. Cover: postcode step after a successful lookup; BS1 first error then after retry; EC1A with no addresses (manual address); skip sizes with heavy waste (large skips turned off); review with prices; booking confirmed. |
| 2 | **Screen recording** — One continuous clip from opening the app on step 1 through clicking confirm until the success page appears (about 1–2 minutes is enough). |
| 3 | **Lighthouse** — `npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --view` |
| 4 | **A11y** — Lighthouse accessibility tab or `npx @axe-core/cli http://localhost:3000` |
