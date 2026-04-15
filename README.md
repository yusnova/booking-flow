# Booking flow

**This README covers:** running the app locally or with Docker → running browser (E2E) tests → where code and test data live → which API routes exist → submission artefacts.

---

## Quick start

**Run locally**

```bash
cd ui
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

**Run with Docker**

From the **repository root** (the folder that contains [`docker-compose.yml`](docker-compose.yml) — **not** inside `ui/` or `automation/`). If your shell is somewhere else, `cd` there first, then:

```bash
docker compose up --build
```

→ same URL as local dev: [http://localhost:3000](http://localhost:3000).

**If you see `command not found: docker`:** install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or Docker Engine for Linux, then open a new terminal so the `docker` command is on your `PATH`. That message is not fixed by `cd ui`.

### First time — app, then tests (two terminals is OK)

1. **Install UI dependencies** (needed once; Playwright’s dev server also runs commands inside `ui/`):

   ```bash
   cd ui
   npm install
   ```

2. **Run the app and open it in a browser** (pick one):

   - **Local:** in a terminal, `npm run dev` from `ui/`, then open [http://localhost:3000](http://localhost:3000).  
   - **Docker:** from the repo root, `docker compose up --build`, same URL.

3. **Run Playwright** — use a **second terminal** (new tab or window) so you do not have to stop the dev server in the first one:

   ```bash
   cd automation
   npm install
   npx playwright install
   npm test
   ```

   **What happens:** Playwright tries to ensure something is listening on `http://127.0.0.1:3000`. If your first terminal still has `npm run dev` running, it will usually **reuse** that process instead of starting another (see `reuseExistingServer` in [`automation/playwright.config.ts`](automation/playwright.config.ts)). If nothing is on port 3000, Playwright starts `npm run dev` in `ui/` for you.

   **Alternative:** stop the dev server (`Ctrl+C` in the first terminal), then run step 3 in one terminal only — Playwright will start the app again for the test run.

---

## Repository layout

| Path | Role |
| --- | --- |
| [`ui/`](ui/) | Next.js 14 (App Router): screens and `/api/*` routes |
| [`automation/`](automation/) | Playwright (specs, page objects), manual test pack, sample bug reports |

**Inside `automation/`** — `playwright/` (`.ui.spec.ts`, `*.page.ts`), `common/` (`config/`, `constants/`, `helpers/`), [`manual-tests.md`](automation/manual-tests.md), [`bug-reports.md`](automation/bug-reports.md).

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

## Playwright

Every file under `playwright/tests` is a **browser E2E** test (only `*.ui.spec.ts`). The UI exposes stable **`data-testid`** attributes so tests do not depend on fragile CSS text.

**Where to run commands:** from the `automation/` folder. It is normal to keep **`npm run dev`** running in one terminal and run **`npm test`** in **another** terminal at the same time.

```bash
cd automation
npm install
npx playwright install
npm test
```

Playwright’s `webServer` setting waits for `http://127.0.0.1:3000`; locally it may start Next in `ui/` or attach to an already-running dev server (see note in **First time** above).

| Script | What it does |
| --- | --- |
| `npm test` | Headless run: starts or reuses the app (see config), then runs all specs |
| `npm run test:ui-mode` | Playwright **UI Mode** (interactive runner / debugger), same specs |

Optional overrides in `automation/.env`: `BASE_URL`, `WEB_SERVER_URL`, `UI_PROJECT_DIR`, `WEB_SERVER_COMMAND` — see [`automation/common/config/config.ts`](automation/common/config/config.ts). After a run, open the HTML report under **`automation/report/`**.

**Automated flows:** (1) General waste → 4-yard → review → confirm → success. (2) Heavy waste → large skips disabled → 6-yard → confirm.

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
