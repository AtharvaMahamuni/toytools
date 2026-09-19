# Calculator desktop ledger refactor

Date: 2026-09-19
Status: implementing
Scope: shared calculator chrome + UPI 1999 Split + Shop UPI Tally
Bump: minor (`beta-v11.13`) — one tool widget changes, plus platform layout

## Problem

On a 1440px desktop, UPI 1999 Split looks unfinished: one amount field in an 807px column, a ~290px hole under it, Copy/Reset floating at the bottom, and a sentence-sized hero plus a dead `upi://` button in a 538px right column.

A milder version of **one** of those problems is catalog-wide: numeric SmartInput rows stretch to the pane (`width: 100%` / `flex: 1`), so Rule of 72’s single `8` sits in a 665px bar, Shop UPI Tally’s amount in a 1247px bar, and SIP’s four fields still look like search boxes.

The rest (dissolved `ToolSplit`, input spanning two rows, phone-only pay CTA) is unique to UPI Split.

Measured 2026-09-19 after the finance engine had painted:

| page | split | first field | result |
|---|---|---|---|
| SIP / Split Bill | 807 / 538, 3–4 fields | wide but the column is full | a number |
| Rule of 72 | same 3-2, **1 field** | 665px for `8` | `9 years` |
| UPI MDR | same 3-2, 2 fields | 665px amount | `₹20.00` |
| Shop UPI Tally | no split | 1247px | one-column total |
| UPI 1999 Split | custom 3-2, input spans 2 rows | 777px + 290px hole | sentence + pay |

## What is already standard (do not invent a third chrome)

Form-and-answer tools already share:

- `.calc-ledger` + bare `IoPanel` + `ExperienceRenderer` (`density="ledger"`)
- `ToolSplit` 3-2 (finance, wellness, datetime, math, network, number family)
- `ToolSplit` 1-1 (design converters, text windows)
- One column, no split (Shop UPI Tally, trackers, sims)

UPI Split is the **only** widget that sets `display: contents` on `.tool-split` and rebuilds a page grid. Split Bill and UPI MDR keep the standard: a short `role="note"` above `FinanceWidget`.

## Key decisions

1. **Cap numeric fields in the shared stylesheet, not per tool.** Desktop-only (`min-width: 1024px`). New token `--width-control: 28rem`. Applies to `.calc-ledger .smart-input-row` and ledger `input.widget-input`. Does **not** cap textareas, cron/CIDR text fields, or timezone selects.

2. **Short forms use `ToolSplit` 1-1.** In `FinanceWidget`, `WellnessWidget`, `DateTimeWidget`, `MathWidget`, `NetworkWidget`: `fields.length <= 2 ? '1-1' : '3-2'`. Phone stack is unchanged. Number-family widgets already have 3+ controls; they stay 3-2 and only get the field cap. Generators, EQ, text windows are out of scope.

3. **UPI Split stays a 3-region stage.** `ToolSplit` has two slots. This page has three regions (split, amount, payee) and a phone order the e2e gate pins: hero, then amount, then payee. Putting payee inside the output pane would put it above the amount on a phone (`stackOrder="output-first"`). Rejoining vanilla `FinanceWidget` would break that. The justified exception is the custom grid; the bug was 3-2 plus spanning the input cell.

4. **Desktop UPI grid becomes “do | see”, not “empty form | everything else”.**
   - Phone (unchanged): `caution / output / input / next / actions`
   - Desktop: `1fr 1fr`, areas `input | output`, `next | output`, `actions | output`. Amount and payee stack on the left; the statement spans the right; actions sit under the left stack. No input cell spanning two empty rows.

5. **Desktop cannot open a UPI app.** From 1024px, hide `Open UPI app` and the “opens on a phone” line. Show `Copy ₹1,999` (the current chunk) instead. Phone keeps the deep link. The tick stays on both: it is how you step chunks.

6. **The grouping line is the answer, but it is not a money hero.** Widget-scoped: `.upi-split .hero-value` uses `--text-2xl`, not the 36px mono clamp meant for `$102,422.49`. Do not change `ExperienceRenderer` globally.

7. **Shop UPI Tally stays one column.** Cap `#shop-amount` to `--width-control` from 1024px. Do not put it on `ToolSplit`.

8. **One PR, one minor bump.** Highest applicable bump is minor (a shipped tool widget changes). Shared layout/token work rides along.

## Non-goals

- New breakpoints
- A new “compact finance” component
- Folding the legal caution (craft `upi-split-meme` stays visible)
- Touch `:active` audit of `tool-widget.css` (known P1, separate)
- Changing generator / EQ / text-window splits
- Raising fold or craft thresholds

## Layered change list

### P1 — `src/styles/tokens.css`, `src/styles/tool-widget.css`

- Add `--width-control: 28rem` next to the other width tokens.
- Desktop:

```css
@media (min-width: 1024px) {
  .calc-ledger .smart-input-row {
    max-width: var(--width-control);
  }
  .calc-ledger .io-body > input.widget-input {
    max-width: var(--width-control);
  }
}
```

Reach: every calc-ledger SmartInput tool, plus tip/tax/discount/margin/markup/percentage raw inputs.

### P2 — shared engine widgets

`FinanceWidget`, `WellnessWidget`, `DateTimeWidget`, `MathWidget`, `NetworkWidget`:

```ts
const splitRatio = fields.length <= 2 ? '1-1' : '3-2';
```

Known 1–2 field tools that move to 1-1: Rule of 72, UPI MDR, cron, age, date-difference, CIDR, unix-timestamp still has 4 fields so stays 3-2.

### P3 — UPI 1999 Split (`src/tools/finance/upi-1999-split/Widget.astro`)

- Keep `display: contents` (required for the 3-region stage).
- Desktop grid as in decision 4.
- Smaller hero-value.
- `Copy ₹…` button; hide deep link from 1024px.
- Keep hiding currency toolbar and ± steppers (this page is whole rupees).
- Update `tests/e2e/upi-1999-split.spec.ts`:
  - Phone order unchanged.
  - Desktop: payee under amount (same column), hero to the right of amount.
  - Wide: copy-chunk visible, `Open UPI app` hidden; phone: the reverse after a valid VPA.

### P3 — Shop UPI Tally

- Cap the add-amount field to `--width-control` from 1024px. Import textarea stays full width.

### Contract docs

- `.claude/skills/ui-design-system/SKILL.md`: document `--width-control`, field-count ratio, UPI 3-region exception.
- `CHANGELOG.md` + `src/lib/version.ts` via `version:bump minor`.

## Risks

| risk | mitigation |
|---|---|
| 1-1 on chart-heavy 2-field wellness/math tools crowds the viz | field count 3+ on those calculators (unit + inputs); CIDR is 1 field and 1-1 matches a single text control. Fold ratchet is phone-only and stackOrder is unchanged. |
| `--width-control` too tight for `10,00,000.00` | 28rem ≈ 448px; Indian grouping of the cap still fits. |
| Desktop copy without VPA | copy uses the chunk amount, not the payee; allowed with no VPA. |
| `check:craft` dividers | no `border-top`/`border-bottom` added. |

## Test plan

- `tests/e2e/upi-1999-split.spec.ts` as above (chromium + pixel5).
- Existing `health.spec.ts` pane equalization still holds (`equalHeight={false}`).
- Spot-check in browser at 1440 and 393: UPI Split, Rule of 72, SIP, UPI MDR, Shop Tally, Tip.
- Done-condition: `npm run verify`.

## PR plan

Single PR, not a stack. Shared CSS first in the same commit as the UPI grid so the amount cap is already there when the 1-1 UPI columns land.

Title: `Quiet desktop calculator fields and a 1-1 short-form split`

No follow-up PR unless verify surfaces a fold/budget issue on a 1-1 chart tool.
