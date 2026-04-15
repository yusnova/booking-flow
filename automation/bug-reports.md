# Bug reports

---

## BUG-001 — Postcode field and address list can feel out of sync after “Back”

| Field | Value |
| --- | --- |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Chrome 131, macOS 15, `ui` via `npm run dev` |
| **Component** | Postcode step (`StepPostcode`) |
| **Category** | State transition |

**Steps**

1. Open the app in a browser (for example `http://localhost:3000`).
2. On the first screen (step 1), type `SW1A 1AA` into the **UK postcode** field.
3. Click **Look up** and wait until the address list appears.
4. Confirm that one address row is selected in the list, then click **Continue** to go to **step 2** (waste type).
5. Click **Back** to return to **step 1**.
6. Observe whether the text in the postcode input matches the selected row in the list for the last successful lookup. Optional: after going back, edit the postcode field but do **not** click **Look up** again; check whether the field text and the list selection still feel consistent.

**Expected**  
The input should always reflect the last successful postcode lookup, or the UI should clearly reset and ask for a new lookup.

**Actual**  
Local `input` state and server-driven list state are not forced to match on return; if you edit the field without a new lookup, the two can briefly disagree.

**Evidence**  
Screen recording of back navigation comparing field vs list; code: `StepPostcode` local `useState` for input vs `state.addresses` lifecycle.

---

## BUG-002 — BS1 4DJ “first request fails” counter is shared across the whole server process

| Field | Value |
| --- | --- |
| **Severity** | High (for a multi-user demo) |
| **Priority** | P3 |
| **Environment** | Single Node process (local or Docker) |
| **Component** | `ui/lib/postcode-state.ts` |
| **Category** | API / branching |

**Steps**

1. Know the demo rule: for postcode `BS1 4DJ`, the **first** lookup is designed to return HTTP **500**, and a **second** attempt should succeed.
2. Open **two separate browser windows** (or one normal window and one private/incognito), both pointing at the same app URL.
3. **Window A:** On step 1, enter `BS1 4DJ` and click **Look up**. You should see an error state with a way to retry (first request fails).
4. Before **Window A** clicks **Retry** or runs a successful second lookup, switch to **Window B**.
5. **Window B:** Enter `BS1 4DJ` and click **Look up** as if it were a fresh user.
6. Note what happens: because the failure counter is global, Window B’s request may consume the “first failure” behaviour that Window A was supposed to see, so the “first fail, then succeed on retry” story is not isolated per browser session.

**Expected**  
Each browser session should get its own first-failure / retry-success behaviour for this postcode.

**Actual**  
The counter lives in module scope in one Node process; another session can consume the same failure slot.

**Evidence**  
Source review of `shouldFailBs1Lookup`; optional written repro notes from two windows.

---

## BUG-003 — After changing plasterboard handling, skip rules are not obvious until you revisit step 3

| Field | Value |
| --- | --- |
| **Severity** | Low |
| **Priority** | P3 |
| **Environment** | Any current browser |
| **Component** | Waste + skip steps |
| **Category** | Branching / state transition |

**Steps**

1. Open the app. On step 1, look up `SW1A 1AA`, pick an address, click **Continue**.
2. On step 2 (waste), click the **Plasterboard** option.
3. From the three plasterboard handling options, select **Dedicated plasterboard skip only** (or the wording used in the demo for the dedicated path).
4. Click **Continue** to reach **step 3** (skip sizes).
5. Note which skip rows are **disabled** (for example smaller sizes may be disabled for dedicated plasterboard).
6. Click **Back** to return to **step 2**.
7. Change the plasterboard handling choice to **Less than 10% plasterboard (mixed load)** (or the demo’s “mixed” option).
8. Click **Continue** again to go back to **step 3**.
9. Check whether the disabled skip rules immediately match the new handling from step 7, with no leftover mental model from the old “Dedicated” rules.

**Expected**  
When handling changes, either the skip list updates straight away to the new rules, or the UI tells the user clearly that prices and availability refresh when they continue to the skip step.

**Actual**  
Skips are mainly refetched when the skip step mounts / via `useEffect` in `StepSkip`; changing handling on step 2 alone may not feel like an instant refresh until the user reaches step 3 again.

**Evidence**  
`StepSkip` `useEffect` dependency list; short screen recording stepping between step 2 and step 3.
