## Manuel Test Cases

### MT-01

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that a successful `SW1A 1AA` postcode lookup returns a full address list (at least 12 rows), selects the first row by default, shows a plausible first line (e.g. 10 Downing Street), enables **Continue**, and does **not** show the client validation error reserved for invalid-format postcodes. |
| **Preconditions** | **State:** Open `/` with hard refresh; no prior booking session. **Data:** Step 1; postcode field empty. **Browser:** Desktop Chrome or Firefox (current stable). |
| **Steps** | 1) Open the app root URL. 2) Click into **UK postcode**. 3) Type `SW1A 1AA` (any reasonable casing). 4) Click **Look up**. 5) Wait until loading text disappears or list/error appears. 6) Scroll the address list if it is taller than the viewport. 7) Count distinct selectable address rows. |
| **Expected result** | At least **12** address rows; the **first** row is selected by default; first line reads like **10 Downing Street**; **Continue** is enabled. **Do not** see the client validation error **Enter a valid UK postcode (e.g. SW1A 1AA).** — that message is only for invalid-format postcodes, not for this successful lookup. |

### MT-02

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that input which fails the UK postcode pattern is rejected in the UI before a successful address load: the standard validation message appears, no address list is shown as a success, and **Continue** stays blocked until a valid postcode journey exists. |
| **Preconditions** | **State:** Step 1. **Product:** Input fails UK postcode pattern before the API runs. |
| **Steps** | 1) Enter `NOTAPOST` (or another string that fails UK pattern). 2) Click **Look up**. 3) Observe error text and whether any address list renders. 4) Observe **Continue** state. |
| **Expected result** | The UI shows **Enter a valid UK postcode (e.g. SW1A 1AA).** (client-side validation before the API). **No** address list from a successful lookup; **Continue** stays disabled until a valid postcode + address path is completed. |

### MT-03

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify behaviour when the user types a valid postcode with extra leading, trailing, or double spaces: the UI applies validation and messaging per the current demo rules (see Expected result). |
| **Preconditions** | **State:** Step 1. **Intent:** Extra spaces around an otherwise valid postcode. **Network:** Normal. |
| **Steps** | 1) Enter leading/trailing and double spaces, e.g. ` sw1a  1aa `. 2) Click **Look up**. |
| **Expected result** | The UI shows **Enter a valid UK postcode (e.g. SW1A 1AA).** (client-side validation before the API). **No** address list from a successful lookup; **Continue** stays disabled until a valid postcode + address path is completed. |

### MT-04

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that changing the selected address from the default row (e.g. to **1 Parliament Street** or **11 Downing Street**) and pressing **Continue** loads step 2 and shows waste types **General**, **Heavy**, and **Plasterboard**. |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` lookup succeeded; address list visible; default row selected. **Intent:** Change selection before **Continue**. |
| **Steps** | 1) Select a different address from the list using the radio — e.g. **1 Parliament Street** or **11 Downing Street** (any row other than the default **10 Downing Street**). 2) Confirm only one radio is selected. 3) Click **Continue**. |
| **Expected result** | Step 2 loads with waste types (**General**, **Heavy**, **Plasterboard**). |

### MT-05

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that the user cannot proceed to step 2 by pressing **Continue** without running **Look up** first for the current postcode value—**Continue** must stay disabled or have no effect. |
| **Preconditions** | **State:** Step 1; valid postcode typed in the field; lookup **not** yet run for that value. |
| **Steps** | 1) Type a valid postcode e.g. `SW1A 1AA`. 2) **Do not** click **Look up**. 3) Try **Continue**. |
| **Expected result** | **Continue** is **disabled** (or click has no effect); user cannot skip the lookup step. |

### MT-06

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that after an empty-result lookup (`EC1A 1BB`) with manual address mode, an empty manual textarea does not allow **Continue** until the minimum manual-address length rule is satisfied. |
| **Preconditions** | **State:** Step 1; ready for lookup. **Fixture:** `EC1A 1BB` (zero addresses). **Intent:** After lookup you will use manual address mode and an empty textarea. |
| **Steps** | 1) Lookup `EC1A 1BB`. 2) Enable manual address if not auto-enabled. 3) Clear the manual textarea completely. 4) Attempt **Continue**. |
| **Expected result** | **Continue** disabled until manual text exceeds minimum length rule. |

### MT-07

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that manual address text trimmed to **5 or fewer** characters keeps **Continue** disabled, and that **more than 5** characters enables **Continue**, matching the demo length rule. |
| **Preconditions** | **State:** Step 1 after empty-result lookup for `EC1A 1BB`; manual mode on; manual textarea visible. **Fixture:** `EC1A 1BB`. |
| **Steps** | 1) Type only `abc` (3 characters) in the manual address box. 2) Try **Continue** — it should stay disabled. 3) Add more characters until the trimmed text is **more than 5 characters** (e.g. six or more characters total). 4) Try **Continue** again. |
| **Expected result** | **Continue** stays disabled while trimmed length is **5 or fewer** characters; once trimmed length is **greater than 5**, **Continue** enables. |

### MT-08

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that the first `BS1 4DJ` lookup in the demo returns HTTP **500**, surfaces an error state, and does **not** present a successful address list. |
| **Preconditions** | **State:** Step 1. **Fixture:** `BS1 4DJ` (demo: first lookup returns HTTP 500). **Tool:** Network tab optional. |
| **Steps** | 1) Enter `BS1 4DJ`. 2) Click **Look up** **once**. 3) Read UI message and HTTP status in Network. 4) Do **not** retry yet. |
| **Expected result** | HTTP **500** (or surfaced as service error); user sees **error** state; address list not shown as success. |

### MT-09

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that after the first `BS1 4DJ` failure, a retry or second lookup in the same session returns HTTP **200** with a non-empty address list so the user can continue. |
| **Preconditions** | **State:** Step 1; `BS1 4DJ` entered; first lookup failed; error/retry UI visible; same browser session; server not restarted. |
| **Steps** | 1) Click **Retry lookup** (or **Look up** again per UI). 2) Wait for completion. |
| **Expected result** | Second attempt returns **200** with a **non-empty** address list; user can proceed. |

### MT-10

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that calling `GET /api/skips` without a normalised postcode (missing or empty query) returns **400** and a JSON error indicating postcode is required or invalid. |
| **Preconditions** | **Tool:** REST client, Postman, Insomnia, or similar (not the booking UI). **Product:** Call the running app’s base URL (e.g. `http://localhost:3000`). |
| **Steps** | 1) Open your client and set the request method to **GET**. 2) Enter the URL for the skips endpoint with **no** postcode or an empty value — e.g. `http://localhost:3000/api/skips` or `http://localhost:3000/api/skips?postcode=` (trailing `=` with nothing after it). 3) Send the request (no auth headers required for this demo). 4) Note the **HTTP status code** in the response. 5) Open the **response body** (JSON) and read the error message shape. |
| **Expected result** | **400** with JSON error indicating missing/invalid postcode. |

### MT-11

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that `POST /api/booking/confirm` with an empty JSON body `{}` returns **400** and lists missing required booking fields (e.g. skip size, postcode) per the API implementation. |
| **Preconditions** | **Tool:** REST client, Postman, Insomnia, or similar; set **Content-Type: `application/json`**. **Product:** Same base URL as the app. |
| **Steps** | 1) Create a **POST** request to `http://localhost:3000/api/booking/confirm` (adjust host/port if your app runs elsewhere). 2) In **Headers**, add `Content-Type: application/json`. 3) In **Body**, choose **raw** / **JSON** and enter an empty object: `{}`. 4) Send the request. 5) Inspect the **status code** and **response body** — note which required fields the API reports as missing. |
| **Expected result** | **400**; body mentions missing required field(s) (e.g. `skipSize` / `postcode` per implementation). |

### MT-12

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that from step 1 with a selected address, **Continue** moves the user to step 2, shows waste-type choices, and updates the progress indicator to step 2. |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` looked up; an address selected; still on step 1. |
| **Steps** | 1) Click **Continue**. 2) Observe step header / dots. 3) Confirm waste cards visible. |
| **Expected result** | Step **2** visible; progress indicator highlights step 2; postcode step UI hidden or inactive. |

### MT-13

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that **Back** from step 2 returns to step 1 with the previous postcode and address selection still present. |
| **Preconditions** | **State:** Step 2; waste screen visible. |
| **Steps** | 1) Click **Back**. 2) Observe step indicator. 3) Check postcode field and address list still present. |
| **Expected result** | Returns to step **1**; prior postcode and address selection **retained** (unless product spec says otherwise). |

### MT-14

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that choosing **Plasterboard** without selecting a handling option keeps **Continue** disabled so the user cannot reach the skip step until a handling option is chosen. |
| **Preconditions** | **State:** Step 2; **Plasterboard** selected; no handling radio chosen. |
| **Steps** | 1) Click **Plasterboard** tile. 2) Leave the three handling radios unset. 3) Observe the **Continue** control — do not select a handling option yet. |
| **Expected result** | **Continue** stays **disabled** (or otherwise cannot submit step 2); user remains on waste step **2** and cannot open step **3** (skips) until a plasterboard handling option is selected. |

### MT-15

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that when the waste-types API request is blocked or fails, **Continue** on step 2 shows a clear user-visible error rather than failing silently. |
| **Preconditions** | **State:** Step 2. **Tool:** DevTools request blocking or offline for `/api/waste-types` only. |
| **Steps** | 1) Pick any waste path. 2) Click **Continue** while POST is blocked or fails. 3) Read UI feedback. |
| **Expected result** | User-visible error (not silent failure); still on step 2 or clear recoverable state. |

### MT-16

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that for **Heavy** waste the **12-yard** skip row is **disabled**, cannot be selected by click or keyboard, and shows an appropriate disabled reason. |
| **Preconditions** | **State:** Step 3; **Heavy** waste; skip list loaded. |
| **Steps** | 1) Locate **12-yard** row. 2) Try to click its radio. 3) Try keyboard activation if applicable. |
| **Expected result** | Radio **disabled**; selection does not move to 12-yard; helper/disabled text visible. |

### MT-17

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that double-clicking or spamming **Confirm booking** results in only one completed booking and one booking reference (no duplicate submissions). |
| **Preconditions** | **State:** Step 4; valid review; **Confirm booking** enabled. |
| **Steps** | 1) Double-click **Confirm booking** quickly (or mash click). 2) Count success screens or duplicate IDs if shown. |
| **Expected result** | Only **one** booking completes; button shows busy/disabled during submit; single **BK-** reference. |

### MT-18

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that `M1 1AE` lookup shows a loading state and that the user waits at least ~2 seconds before the list or final error appears (artificial delay fixture). |
| **Preconditions** | **State:** Step 1. **Fixture:** `M1 1AE` (artificial delay). **Tool:** Stopwatch optional. |
| **Steps** | 1) Enter `M1 1AE`. 2) Click **Look up**. 3) Time from click until list or final error appears. |
| **Expected result** | Loading indicator visible; total wait **≥ ~2s** before result; eventually list or error resolves. |

### MT-19

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that `EC1A 1BB` shows zero addresses with helpful empty-state copy and clear guidance toward entering an address manually. |
| **Preconditions** | **State:** Step 1. **Fixture:** `EC1A 1BB` (empty-result copy). |
| **Steps** | 1) Lookup `EC1A 1BB`. 2) Read empty-state messaging. 3) Read guidance for manual address. |
| **Expected result** | **Zero** addresses; empathetic copy; manual path obvious; user understands next action. |

### MT-20

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that **Back** from step 3 to step 2 leaves **Heavy** waste selected if that was the prior choice (no silent reset to General). |
| **Preconditions** | **State:** Step 3; **Heavy** waste selected on step 2. |
| **Steps** | 1) Click **Back** from skips. 2) On step 2, observe which waste tile is highlighted. |
| **Expected result** | **Heavy** still selected; no silent reset to General. |

### MT-21

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that **Back** from the review step to step 3 preserves the previously selected skip size (e.g. **6-yard**). |
| **Preconditions** | **State:** Step 4 review; skip size selected on step 3 (e.g. **6-yard**). |
| **Steps** | 1) Click **Back** from review. 2) On step 3, check selected skip. |
| **Expected result** | Previously selected skip size **still** selected. |

### MT-22

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that **Review booking** stays disabled until the user selects an enabled skip size when step 3 is shown without a valid skip choice. |
| **Preconditions** | **State:** Step 3; no enabled skip selected (fresh session or UI path that allows this). **Product:** If pre-selection exists, use a path where no valid skip is chosen. |
| **Steps** | 1) Reach step 3 without selecting any enabled skip (if possible). 2) Look at **Review booking** button. |
| **Expected result** | **Review booking** **disabled** until a valid skip is chosen. |

### MT-23

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that with **General** waste all eight skip sizes are enabled and none are incorrectly disabled for that profile. |
| **Preconditions** | **State:** App running; you will reach step 3 with **General** waste via the steps below (includes `SW1A 1AA` postcode flow). |
| **Steps** | 1) **Step 1:** Look up `SW1A 1AA`, pick any address, click **Continue**. 2) **Step 2:** Choose **General** waste, click **Continue**. 3) **Step 3:** Open each skip size row and inspect enabled/disabled state. |
| **Expected result** | All eight sizes **enabled** for general (no false disabled for this profile). |

### MT-24

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that with **Heavy** waste the **12-yard** and **14-yard** rows are disabled with visible reasons while at least one smaller skip remains enabled. |
| **Preconditions** | **State:** Step 3; **Heavy** waste. |
| **Steps** | 1) Find **12-yard** and **14-yard** rows. 2) Read disabled reason text. 3) Pick an enabled size and continue. |
| **Expected result** | Both rows **disabled** with visible reason; at least one smaller skip remains **enabled**. |

### MT-25

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that **Plasterboard** with **Less than 10% mixed** handling does **not** apply the dedicated-only disables on small skips: **2-yard** and **3-yard** stay available. |
| **Preconditions** | **State:** App running; you will reach step 3 with **Plasterboard** + **mixed** handling via the steps below. |
| **Steps** | 1) **Step 1:** Complete postcode + address (e.g. `SW1A 1AA`), click **Continue**. 2) **Step 2:** Select **Plasterboard**, choose **Less than 10% plasterboard (mixed load)**, click **Continue**. 3) **Step 3:** Inspect each skip row. |
| **Expected result** | heavyWaste is false on this path, so 12-yard and 14-yard are not disabled by the heavy rule. The dedicated rule (which disables 2-yard and 3-yard) applies only when handling is Dedicated plasterboard skip only — with mixed, those two sizes remain enabled; all eight sizes should be selectable (no row wrongly disabled for mixed plasterboard). |

### MT-26

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that **Plasterboard** with **dedicated** handling disables **2-yard** and **3-yard** while larger sizes remain selectable. |
| **Preconditions** | **State:** Step 2; **Plasterboard** + **Dedicated** handling. |
| **Steps** | 1) Continue to step 3. 2) Check **2-yard** and **3-yard** rows. |
| **Expected result** | **2-yard** and **3-yard** **disabled**; larger sizes available for selection. |

### MT-27

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that skip, permit, VAT, and **Total** in the price breakdown add up consistently with the **Total** line within UI rounding. |
| **Preconditions** | **State:** Step 4; valid skip price shown. |
| **Steps** | 1) Expand/read **Price breakdown** block. 2) Manually add skip + permit + VAT in a calculator. 3) Compare to **Total** line. |
| **Expected result** | Subcomponents show **£**; arithmetic matches **Total** within rounding shown in UI. |

### MT-28

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that script-like input does not execute in the browser: invalid postcode paste is rejected safely; manual address paste is shown literally on review. |
| **Preconditions** | **State:** App running; part A from step 1; part B requires manual-address path (e.g. `EC1A 1BB` empty list). |
| **Steps** | 1) **Step 1 — UK postcode field:** Paste `<script>alert(1)</script>` into **UK postcode**, click **Look up**. Confirm **no** JavaScript alert fires; the app treats input as an invalid postcode (e.g. **Enter a valid UK postcode (e.g. SW1A 1AA).**). 2) **Manual address:** Look up `EC1A 1BB` (or enable manual address), paste `<script>alert(1)</script>` into the **manual address** textarea, add enough characters if required, **Continue** through waste/skip to **Review**. 3) On review, observe how the address line renders and whether any alert runs. |
| **Expected result** | After step 1: **no** alert; validation/error for bad postcode, no successful lookup. After step 2–3: snippet appears as **plain text** on the review summary; **no** script execution / alert. |

### MT-29

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that pasting a very long string into the **manual address** textarea (after `EC1A 1BB` lookup) keeps the UI scrollable and usable and does not freeze or corrupt the confirm flow. |
| **Preconditions** | **State:** Step 1; you will use postcode `EC1A 1BB` and the manual-address textarea only. |
| **Steps** | 1) **Step 1:** In **UK postcode**, enter `EC1A 1BB`, click **Look up**. 2) When the manual-address path is shown, click into the **manual address** textarea (the large text field for typing the address). 3) Paste a very long string (~4000+ characters) into that textarea only. 4) Scroll the page and the step panel so all controls remain reachable. 5) Click **Continue** as enabled and proceed; if the flow allows confirmation, complete through **Confirm** / success. |
| **Expected result** | Layout remains usable (scroll); app does not freeze; validation or confirm behaves predictably. |

### MT-30

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that after a failed lookup with **Retry** visible, the user can move focus to **Retry** with **Tab** and activate it with **Enter** without using the mouse. |
| **Preconditions** | **State:** Step 1; lookup failed; **Retry** control visible (e.g. after `BS1 4DJ` first failure). |
| **Steps** | 1) Press **Tab** repeatedly from postcode field until focus reaches **Retry**. 2) Activate with **Enter**. |
| **Expected result** | Retry reachable **without mouse**; second attempt runs. |

### MT-31

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that **Start new booking** from the success screen resets the flow to step 1 and clears postcode, address, waste, and skip state. |
| **Preconditions** | **State:** Success screen after booking; booking id shown. |
| **Steps** | 1) Click **Start new booking**. 2) Inspect step 1 fields and selections. |
| **Expected result** | Back to step **1**; postcode/address/waste/skip cleared or reset to initial demo state. |

### MT-32

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that the step indicator dots always match the current step when moving forward with **Continue** and backward with **Back**. |
| **Preconditions** | **State:** Mid-flow from step 1 through confirmation/success. |
| **Steps** | 1) After each **Continue**, note which step dot is highlighted. 2) On **Back**, note dot regression. |
| **Expected result** | Highlighted dot always matches **current** step number on screen. |

### MT-33

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that malformed JSON sent to `POST /api/booking/confirm` returns **400** (invalid JSON) and does not hang with **500**. |
| **Preconditions** | **Tool:** REST client. |
| **Steps** | 1) `POST /api/booking/confirm` with body `{{{` or truncated JSON. 2) Read status. |
| **Expected result** | **400** invalid JSON (or clear server error), not **500** hang. |

### MT-34

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that the normalisation demo control sets **4-yard** when applying a fuzzy label such as `"4 yard"` and does not error. |
| **Preconditions** | **State:** Step 3; **General** waste; **4-yard** enabled. |
| **Steps** | 1) Scroll to normalisation demo control. 2) Click control that applies `"4 yard"` → `4-yard` selection. 3) Confirm radio state. |
| **Expected result** | **4-yard** becomes selected when enabled; no error. |

### MT-35

| Field | Content |
| --- | --- |
| **Category** | Edge |
| **Description** | Verify that toggling **Enter address manually** updates list vs manual mode, clears or restores selection per rules, and keeps **Continue** enablement consistent. |
| **Preconditions** | **State:** Step 1; `SW1A 1AA` lookup succeeded; address list visible. |
| **Steps** | 1) Toggle **Enter address manually** on: textarea appears, list selection clears per spec. 2) Toggle off: list selection restored if spec says so. 3) Repeat once. |
| **Expected result** | No orphaned selection; **Continue** enable/disable matches rules after each toggle. |

### MT-36

| Field | Content |
| --- | --- |
| **Category** | Negative |
| **Description** | Verify that **Look up** with an empty postcode field shows validation feedback and does not show a fake successful lookup. |
| **Preconditions** | **State:** Step 1; postcode field empty. |
| **Steps** | 1) Clear postcode completely. 2) Click **Look up**. |
| **Expected result** | Validation message; no pretend success. |

### MT-37

| Field | Content |
| --- | --- |
| **Category** | Positive |
| **Description** | Verify that `POST /api/waste-types` with a valid contract body returns **200** and `{ "ok": true }`. |
| **Preconditions** | **Tool:** REST client (Postman, Insomnia, Thunder Client, or `curl`); running app base URL (e.g. `http://localhost:3000`). |
| **Steps** | 1) Open your REST client and create a **POST** request to `{baseUrl}/api/waste-types` (replace `{baseUrl}` with your app origin). 2) Set header **`Content-Type: application/json`**. 3) In the **body** tab, choose **raw** → **JSON** and paste exactly: `{ "heavyWaste": false, "plasterboard": false, "plasterboardOption": null }` — nothing else in the body. 4) **Send** the request. 5) Read the **HTTP status** in the response panel and the **response body** text. |
| **Expected result** | **`{ "ok": true }`** and **200**. |

### MT-38

| Field | Content |
| --- | --- |
| **Category** | API failure |
| **Description** | Verify that `GET /api/skips` with `postcode=SW1A1AA` and `heavyWaste=true` returns **200**, eight skip objects, each with `size`, `price`, and `disabled`. |
| **Preconditions** | **Tool:** Browser address bar, or `curl`; running app base URL. Query string must include both `postcode` and `heavyWaste` (values as below). |
| **Steps** | 1) **Browser:** In the address bar, open `{baseUrl}/api/skips?postcode=SW1A1AA&heavyWaste=true` (no space in `SW1A1AA`; `&heavyWaste=true` is the second parameter). **Or terminal:** `curl -sS "{baseUrl}/api/skips?postcode=SW1A1AA&heavyWaste=true"` with your real base URL. 2) Confirm the response is JSON (not an HTML error page). 3) In the JSON, locate the **`skips`** array. 4) Count array elements and open each object to check field names. |
| **Expected result** | **200**; `skips` array length **8**; each item has `size`, `price`, `disabled`. |

### MT-39

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that if the user clicks **General** then **Heavy** on step 2 before **Continue**, step 3 skip rules follow **Heavy** (last click), not **General**. |
| **Preconditions** | **State:** Step 2; waste choice not yet committed with **Continue**. |
| **Steps** | 1) Click **General**. 2) Click **Heavy** without continuing yet. 3) Click **Continue**. 4) On step 3, verify large skips disabled. |
| **Expected result** | Step 3 rules match **last** selected waste (**Heavy**), not the first click. |

### MT-40

| Field | Content |
| --- | --- |
| **Category** | State transition |
| **Description** | Verify that switching plasterboard handling from **Dedicated** to **Mixed** before **Continue** applies **Mixed** skip-disable rules on step 3, not dedicated-only rules. |
| **Preconditions** | **State:** Step 2; **Plasterboard** path; handling option may change before **Continue**. |
| **Steps** | 1) Select **Dedicated** then switch to **Mixed** (still on step 2). 2) Click **Continue**. 3) On step 3, compare disabled rows to what dedicated-only would show (memory or separate run). |
| **Expected result** | Skip list reflects **Mixed** rules after continue; dedicated-only disables do not apply to the mixed selection. |
