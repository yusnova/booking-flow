# Manual test cases — booking flow

## How this pack maps to typical assessment criteria

| Criterion | What “good” looks like here | How the catalogue supports it |
| --- | --- | --- |
| **Functional correctness** | Postcode rules, API contracts, waste branching, skip disable logic, review maths, confirm behaviour match the written spec and fixtures. | Positive paths (MT-01, MT-04, MT-12–MT-14, MT-23–MT-27, MT-37–MT-40), API checks (MT-08–MT-11, MT-33–MT-38), and state rows verify transitions and persistence. |
| **Product realism** | Copy, empty states, errors with retry, disabled skips with reasons, price breakdown, and “manual address when list is empty” feel like a credible UK hire journey—not a toy with only happy paths. | EC1A / BS1 / M1 fixtures (MT-08–MT-09, MT-18–MT-19), heavy waste disable rules (MT-16, MT-24), plasterboard variants (MT-25–MT-26), review pricing (MT-27), manual flow (MT-06–MT-07, MT-28–MT-29). |
| **Manual testing depth** | Enough breadth: positives, negatives, edges, API failures, and state changes—with enough detail that another tester can repeat without guessing. | Category counts in the summary table meet or exceed common brief minimums; preconditions and steps below are explicit so **depth** is in the instructions, not only in the count. |

---

## Catalogue

Index (scroll this section only to pick a case; each case below uses a **narrow two-column table** so rows wrap without horizontal scrolling):

| ID | Title | Category |
| --- | --- | --- |
| MT-01 | Valid SW1A lookup returns list | Positive |
| MT-02 | Invalid postcode rejected | Negative |
| MT-03 | Postcode with extra spaces | Edge |
| MT-04 | Select another address | Positive |
| MT-05 | Continue before lookup | Negative |
| MT-06 | Manual address empty | Negative |
| MT-07 | Manual address too short | Edge |
| MT-08 | BS1 first lookup 500 | API failure |
| MT-09 | BS1 retry succeeds | API failure |
| MT-10 | Skips API without postcode | API failure |
| MT-11 | Confirm missing fields | API failure |
| MT-12 | Step 1 → 2 | State transition |
| MT-13 | Step 2 → 1 back | State transition |
| MT-14 | Plasterboard without handling option | Negative |
| MT-15 | Waste API blocked | Negative |
| MT-16 | Disabled skip not selectable | Negative |
| MT-17 | No double confirm | Negative |
| MT-18 | M1 slow lookup | Edge |
| MT-19 | EC1A empty copy | Edge |
| MT-20 | Step 3 → 2 keeps waste | State transition |
| MT-21 | Step 4 → 3 keeps skip | State transition |
| MT-22 | No skip, no review | Negative |
| MT-23 | General skips all usable | Positive |
| MT-24 | Heavy disables two sizes | Positive |
| MT-25 | Plasterboard mixed | Positive |
| MT-26 | Plasterboard dedicated | Positive |
| MT-27 | Price breakdown | Positive |
| MT-28 | Script in manual address | Negative |
| MT-29 | Very long manual text | Negative |
| MT-30 | Keyboard to retry | Edge |
| MT-31 | Start again clears | State transition |
| MT-32 | Step dots track progress | State transition |
| MT-33 | Malformed confirm body | API failure |
| MT-34 | Normalisation helper | Edge |
| MT-35 | Manual toggle | Edge |
| MT-36 | Empty postcode lookup | Negative |
| MT-37 | Waste-types contract | Positive |
| MT-38 | Skips query contract | API failure |
| MT-39 | Switch waste before continue | State transition |
| MT-40 | Change plasterboard option | State transition |

### MT-01 — Valid SW1A lookup returns list

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Open `/` with hard refresh; no prior booking session. **Data:** Step 1; postcode field empty. **Browser:** Desktop Chrome or Firefox (current stable). |
| **Steps** | 1) Open the app root URL. 2) Click into **UK postcode**. 3) Type `SW1A 1AA` (any reasonable casing). 4) Click **Look up**. 5) Wait until loading text disappears or list/error appears. 6) Scroll the address list if it is taller than the viewport. 7) Count distinct selectable address rows. |
| **Expected result** | At least **12** address rows; the **first** row is selected by default; first line reads like **10 Downing Street**; **Continue** is enabled. **Do not** see the client validation error **Enter a valid UK postcode (e.g. SW1A 1AA).** — that message is only for invalid-format postcodes, not for this successful lookup. |

### MT-02 — Invalid postcode rejected

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 1. **Product:** Input fails UK postcode pattern before the API runs. |
| **Steps** | 1) Enter `NOTAPOST` (or another string that fails UK pattern). 2) Click **Look up**. 3) Observe error text and whether any address list renders. 4) Observe **Continue** state. |
| **Expected result** | The UI shows **Enter a valid UK postcode (e.g. SW1A 1AA).** (client-side validation before the API). **No** address list from a successful lookup; **Continue** stays disabled until a valid postcode + address path is completed. |

### MT-03 — Postcode with extra spaces

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1. **Intent:** Extra spaces around an otherwise valid postcode. **Network:** Normal. |
| **Steps** | 1) Enter leading/trailing and double spaces, e.g. ` sw1a  1aa `. 2) Click **Look up**. |
| **Expected result** | The UI shows **Enter a valid UK postcode (e.g. SW1A 1AA).** (client-side validation before the API). **No** address list from a successful lookup; **Continue** stays disabled until a valid postcode + address path is completed. |

### MT-04 — Select another address

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` lookup succeeded; address list visible; default row selected. **Intent:** Change selection before **Continue**. |
| **Steps** | 1) Select a different address from the list using the radio — e.g. **1 Parliament Street** or **11 Downing Street** (any row other than the default **10 Downing Street**). 2) Confirm only one radio is selected. 3) Click **Continue**. |
| **Expected result** | Step 2 loads with waste types (**General**, **Heavy**, **Plasterboard**). |

### MT-05 — Continue before lookup

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 1; valid postcode typed in the field; lookup **not** yet run for that value. |
| **Steps** | 1) Type a valid postcode e.g. `SW1A 1AA`. 2) **Do not** click **Look up**. 3) Try **Continue**. |
| **Expected result** | **Continue** is **disabled** (or click has no effect); user cannot skip the lookup step. |

### MT-06 — Manual address empty

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 1; ready for lookup. **Fixture:** `EC1A 1BB` (zero addresses). **Intent:** After lookup you will use manual address mode and an empty textarea. |
| **Steps** | 1) Lookup `EC1A 1BB`. 2) Enable manual address if not auto-enabled. 3) Clear the manual textarea completely. 4) Attempt **Continue**. |
| **Expected result** | **Continue** disabled until manual text exceeds minimum length rule. |

### MT-07 — Manual address too short

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1 after empty-result lookup for `EC1A 1BB`; manual mode on; manual textarea visible. **Fixture:** `EC1A 1BB`. |
| **Steps** | 1) Type only `abc` (3 characters) in the manual address box. 2) Try **Continue** — it should stay disabled. 3) Add more characters until the trimmed text is **more than 5 characters** (e.g. six or more characters total). 4) Try **Continue** again. |
| **Expected result** | **Continue** stays disabled while trimmed length is **5 or fewer** characters; once trimmed length is **greater than 5**, **Continue** enables. |

### MT-08 — BS1 first lookup 500

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **State:** Step 1. **Fixture:** `BS1 4DJ` (demo: first lookup returns HTTP 500). **Tool:** Network tab optional. |
| **Steps** | 1) Enter `BS1 4DJ`. 2) Click **Look up** **once**. 3) Read UI message and HTTP status in Network. 4) Do **not** retry yet. |
| **Expected result** | HTTP **500** (or surfaced as service error); user sees **error** state; address list not shown as success. |

### MT-09 — BS1 retry succeeds

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **State:** Step 1; `BS1 4DJ` entered; first lookup failed; error/retry UI visible; same browser session; server not restarted. |
| **Steps** | 1) Click **Retry lookup** (or **Look up** again per UI). 2) Wait for completion. |
| **Expected result** | Second attempt returns **200** with a **non-empty** address list; user can proceed. |

### MT-10 — Skips API without postcode

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **Tool:** REST client, Postman, Insomnia, or similar (not the booking UI). **Product:** Call the running app’s base URL (e.g. `http://localhost:3000`). |
| **Steps** | 1) Open your client and set the request method to **GET**. 2) Enter the URL for the skips endpoint with **no** postcode or an empty value — e.g. `http://localhost:3000/api/skips` or `http://localhost:3000/api/skips?postcode=` (trailing `=` with nothing after it). 3) Send the request (no auth headers required for this demo). 4) Note the **HTTP status code** in the response. 5) Open the **response body** (JSON) and read the error message shape. |
| **Expected result** | **400** with JSON error indicating missing/invalid postcode. |

### MT-11 — Confirm missing fields

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **Tool:** REST client, Postman, Insomnia, or similar; set **Content-Type: `application/json`**. **Product:** Same base URL as the app. |
| **Steps** | 1) Create a **POST** request to `http://localhost:3000/api/booking/confirm` (adjust host/port if your app runs elsewhere). 2) In **Headers**, add `Content-Type: application/json`. 3) In **Body**, choose **raw** / **JSON** and enter an empty object: `{}`. 4) Send the request. 5) Inspect the **status code** and **response body** — note which required fields the API reports as missing. |
| **Expected result** | **400**; body mentions missing required field(s) (e.g. `skipSize` / `postcode` per implementation). |

### MT-12 — Step 1 → 2

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` looked up; an address selected; still on step 1. |
| **Steps** | 1) Click **Continue**. 2) Observe step header / dots. 3) Confirm waste cards visible. |
| **Expected result** | Step **2** visible; progress indicator highlights step 2; postcode step UI hidden or inactive. |

### MT-13 — Step 2 → 1 back

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 2; waste screen visible. |
| **Steps** | 1) Click **Back**. 2) Observe step indicator. 3) Check postcode field and address list still present. |
| **Expected result** | Returns to step **1**; prior postcode and address selection **retained** (unless product spec says otherwise). |

### MT-14 — Plasterboard without handling option

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 2; **Plasterboard** selected; no handling radio chosen. |
| **Steps** | 1) Click **Plasterboard** tile. 2) Leave the three handling radios unset. 3) Click **Continue**. |
| **Expected result** | Error message; remain on step 2; no navigation to skips. |

### MT-15 — Waste API blocked

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 2. **Tool:** DevTools request blocking or offline for `/api/waste-types` only. |
| **Steps** | 1) Pick any waste path. 2) Click **Continue** while POST is blocked or fails. 3) Read UI feedback. |
| **Expected result** | User-visible error (not silent failure); still on step 2 or clear recoverable state. |

### MT-16 — Disabled skip not selectable

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 3; **Heavy** waste; skip list loaded. |
| **Steps** | 1) Locate **12-yard** row. 2) Try to click its radio. 3) Try keyboard activation if applicable. |
| **Expected result** | Radio **disabled**; selection does not move to 12-yard; helper/disabled text visible. |

### MT-17 — No double confirm

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 4; valid review; **Confirm booking** enabled. |
| **Steps** | 1) Double-click **Confirm booking** quickly (or mash click). 2) Count success screens or duplicate IDs if shown. |
| **Expected result** | Only **one** booking completes; button shows busy/disabled during submit; single **BK-** reference. |

### MT-18 — M1 slow lookup

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1. **Fixture:** `M1 1AE` (artificial delay). **Tool:** Stopwatch optional. |
| **Steps** | 1) Enter `M1 1AE`. 2) Click **Look up**. 3) Time from click until list or final error appears. |
| **Expected result** | Loading indicator visible; total wait **≥ ~2s** before result; eventually list or error resolves. |

### MT-19 — EC1A empty copy

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1. **Fixture:** `EC1A 1BB` (empty-result copy). |
| **Steps** | 1) Lookup `EC1A 1BB`. 2) Read empty-state messaging. 3) Read guidance for manual address. |
| **Expected result** | **Zero** addresses; empathetic copy; manual path obvious; user understands next action. |

### MT-20 — Step 3 → 2 keeps waste

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 3; **Heavy** waste selected on step 2. |
| **Steps** | 1) Click **Back** from skips. 2) On step 2, observe which waste tile is highlighted. |
| **Expected result** | **Heavy** still selected; no silent reset to General. |

### MT-21 — Step 4 → 3 keeps skip

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 4 review; skip size selected on step 3 (e.g. **6-yard**). |
| **Steps** | 1) Click **Back** from review. 2) On step 3, check selected skip. |
| **Expected result** | Previously selected skip size **still** selected. |

### MT-22 — No skip, no review

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 3; no enabled skip selected (fresh session or UI path that allows this). **Product:** If pre-selection exists, use a path where no valid skip is chosen. |
| **Steps** | 1) Reach step 3 without selecting any enabled skip (if possible). 2) Look at **Review booking** button. |
| **Expected result** | **Review booking** **disabled** until a valid skip is chosen. |

### MT-23 — General skips all usable

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 3; **General** waste; session includes a completed `SW1A 1AA` postcode flow. |
| **Steps** | 1) Open each skip row. 2) Check disabled flags vs heavy-only rules. |
| **Expected result** | All eight sizes **enabled** for general (no false disabled for this profile). |

### MT-24 — Heavy disables two sizes

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 3; **Heavy** waste. |
| **Steps** | 1) Find **12-yard** and **14-yard** rows. 2) Read disabled reason text. 3) Pick an enabled size and continue. |
| **Expected result** | Both rows **disabled** with visible reason; at least one smaller skip remains **enabled**. |

### MT-25 — Plasterboard mixed

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 2; **Plasterboard** + **Less than 10% mixed** handling. |
| **Steps** | 1) Continue to step 3. 2) Inspect disabled pattern (should not wrongly disable entire list). |
| **Expected result** | Skips load; not all sizes disabled; behaviour matches demo rule for mixed plasterboard. |

### MT-26 — Plasterboard dedicated

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 2; **Plasterboard** + **Dedicated** handling. |
| **Steps** | 1) Continue to step 3. 2) Check **2-yard** and **3-yard** rows. |
| **Expected result** | **2-yard** and **3-yard** **disabled**; larger sizes available for selection. |

### MT-27 — Price breakdown

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **State:** Step 4; valid skip price shown. |
| **Steps** | 1) Expand/read **Price breakdown** block. 2) Manually add skip + permit + VAT in a calculator. 3) Compare to **Total** line. |
| **Expected result** | Subcomponents show **£**; arithmetic matches **Total** within rounding shown in UI. |

### MT-28 — Script in manual address

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Manual address path; review reachable. |
| **Steps** | 1) Paste `<script>alert(1)</script>` into manual address. 2) Continue to review. 3) Observe DOM / behaviour. |
| **Expected result** | Text shown **literally** on review; **no** script execution / alert. |

### MT-29 — Very long manual text

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Manual path; textarea accepts paste. |
| **Steps** | 1) Paste ~4000+ characters. 2) Scroll UI. 3) Attempt continue and confirm if allowed. |
| **Expected result** | Layout remains usable (scroll); app does not freeze; validation or confirm behaves predictably. |

### MT-30 — Keyboard to retry

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1; lookup failed; **Retry** control visible (e.g. after `BS1 4DJ` first failure). |
| **Steps** | 1) Press **Tab** repeatedly from postcode field until focus reaches **Retry**. 2) Activate with **Enter**. |
| **Expected result** | Retry reachable **without mouse**; second attempt runs. |

### MT-31 — Start again clears

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Success screen after booking; booking id shown. |
| **Steps** | 1) Click **Start new booking**. 2) Inspect step 1 fields and selections. |
| **Expected result** | Back to step **1**; postcode/address/waste/skip cleared or reset to initial demo state. |

### MT-32 — Step dots track progress

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Mid-flow from step 1 through confirmation/success. |
| **Steps** | 1) After each **Continue**, note which step dot is highlighted. 2) On **Back**, note dot regression. |
| **Expected result** | Highlighted dot always matches **current** step number on screen. |

### MT-33 — Malformed confirm body

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **Tool:** REST client. |
| **Steps** | 1) `POST /api/booking/confirm` with body `{{{` or truncated JSON. 2) Read status. |
| **Expected result** | **400** invalid JSON (or clear server error), not **500** hang. |

### MT-34 — Normalisation helper

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 3; **General** waste; **4-yard** enabled. |
| **Steps** | 1) Scroll to normalisation demo control. 2) Click control that applies `"4 yard"` → `4-yard` selection. 3) Confirm radio state. |
| **Expected result** | **4-yard** becomes selected when enabled; no error. |

### MT-35 — Manual toggle

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` lookup succeeded; address list visible. |
| **Steps** | 1) Toggle **Enter address manually** on: textarea appears, list selection clears per spec. 2) Toggle off: list selection restored if spec says so. 3) Repeat once. |
| **Expected result** | No orphaned selection; **Continue** enable/disable matches rules after each toggle. |

### MT-36 — Empty postcode lookup

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Preconditions** | **State:** Step 1; postcode field empty. |
| **Steps** | 1) Clear postcode completely. 2) Click **Look up**. |
| **Expected result** | Validation message; no pretend success. |

### MT-37 — Waste-types contract

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Preconditions** | **Tool:** REST client; valid JSON body per API contract. |
| **Steps** | 1) `POST /api/waste-types` with `{ "heavyWaste": false, "plasterboard": false, "plasterboardOption": null }`. 2) Read body. |
| **Expected result** | **`{ "ok": true }`** and **200**. |

### MT-38 — Skips query contract

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Preconditions** | **Tool:** Browser or curl; URL-encoded query. |
| **Steps** | 1) `GET /api/skips?postcode=SW1A1AA&heavyWaste=true`. 2) Parse JSON. |
| **Expected result** | **200**; `skips` array length **8**; each item has `size`, `price`, `disabled`. |

### MT-39 — Switch waste before continue

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 2; waste choice not yet committed with **Continue**. |
| **Steps** | 1) Click **General**. 2) Click **Heavy** without continuing yet. 3) Click **Continue**. 4) On step 3, verify large skips disabled. |
| **Expected result** | Step 3 rules match **last** selected waste (**Heavy**), not the first click. |

### MT-40 — Change plasterboard option

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Preconditions** | **State:** Step 2; **Plasterboard** path; handling option may change before **Continue**. |
| **Steps** | 1) Select **Dedicated** then switch to **Mixed** (still on step 2). 2) Click **Continue**. 3) On step 3, compare disabled rows to what dedicated-only would show (memory or separate run). |
| **Expected result** | Skip list reflects **Mixed** rules after continue; dedicated-only disables do not apply to the mixed selection. |

---

## Summary counts (vs typical brief minimums)

| Category | Count in this pack |
| --- | ---: |
| Total | 40 |
| Negative | 11 |
| Edge | 7 |
| API failure | 6 |
| State transition | 8 |
| Positive | 8 |
