# Money & Finance — Expansion Roadmap

Phase H1 shipped the Finance Engine and its first five tools (compound interest, rule of 72,
inflation, savings goal, emergency fund) on top of a reusable, engine-agnostic platform layer (smart
inputs, the `InteractiveResult` contract, the experience renderer, and the concept/example
registries). Since then, ROI, CAGR, and SIP calculators have shipped on that same engine (no new
engine needed — the "Investment Engine" cluster below was absorbed into the existing `finance`
engine instead of spinning up a new one). This document records the evidence-backed plan for
growing the category further.

It is **derived from the analyzers, not guessed**. Re-run them to refresh it:

```sh
npm run research          # research/reports/ (roadmap.md, missing-engines.json, opportunities.json)
npm run intel             # dist/content-intelligence/latest/ (gaps, roadmap, ecosystem)
```

The recommendations below come straight from those outputs:

- **Content Intelligence** (`src/lib/content-intelligence/taxonomy.ts`) flags expected-but-missing tools
  inside the existing `finance` engine. `cagr-calculator`, `sip-calculator`, and `roi-calculator` have
  since shipped (all on the existing engine, no new infrastructure); current top remaining gap:
  `simple-interest-calculator`, followed by `present-value-calculator`, `dividend-yield-calculator`,
  `future-value-calculator`.
- **Research Intelligence** (`src/lib/research/taxonomy.ts` + `research/datasets/finance.json`) scores
  net-new finance tools and clusters them into the **new engines** they imply. Current top finance
  opportunities: loan + mortgage (loan engine); net worth, salary (budget engine); retirement.

## Immediate next tools (reuse the existing Finance Engine, zero new infrastructure)

These need only a new calculator file + the standard tool wiring; they reuse the same engine, widget,
inputs, and experience layer. They also close the gaps Content Intelligence reports today.

| Tool | Family | Why |
|---|---|---|
| `simple-interest-calculator` | interest | Natural sibling that completes the "interest" family |
| `present-value-calculator` | inflation | Inverse of the inflation tool; completes the family |
| `dividend-yield-calculator` | interest | Rounds out the investment-returns cluster alongside ROI/CAGR |
| `future-value-calculator` | interest | Pairs with present-value; shared time-value-of-money concept |

## Next reusable engines (each unlocks a cluster of tools)

Ordered by the research engine's scoring and cluster size. Each is a new engine that plugs into the
**same** platform layer (smart inputs, `InteractiveResult`, `ExperienceRenderer`, concepts/examples) —
the finance build proved that path, so these are incremental, not greenfield.

### 1. Loan Engine — `loan`, `mortgage`, `auto-loan`, `amortization-schedule`, `extra-payment`
- **Why users need it:** monthly-payment and mortgage calculators are evergreen, very high volume.
- **Search problems:** loan calculator, mortgage calculator, amortization schedule.
- **Unlocks:** 5-6 tools; the amortization schedule is a natural first use of the `timeline`/table experience.
- **Cluster:** complements savings/interest tools (borrowing is the mirror of investing).
- **Architecture fit:** an amortization model returning a `timeline` + `breakdown` (principal vs interest).

### 2. Retirement Engine — `retirement`, `fire`, `401k`, `annuity`
- **Why users need it:** "will I have enough to retire" is high intent and recurring.
- **Search problems:** retirement calculator, FIRE number, 401k growth.
- **Unlocks:** 4 tools; heavy reuse of compound interest + inflation + contributions.
- **Cluster:** sits on top of the interest + inflation tools, strengthening the whole category.
- **Architecture fit:** composes existing models; mostly new scenario presets + assumptions.

### 3. Salary & Budget Engine — `salary`, `hourly-to-salary`, `take-home-pay`, `budget-50-30-20`, `net-worth`
- **Why users need it:** pay conversions and budgeting are mass-market, always-on searches.
- **Search problems:** salary calculator, hourly to salary, take-home pay, net worth.
- **Unlocks:** 5 tools; the simplest engine to add (mostly arithmetic + categorization).
- **Cluster:** feeds the saving/emergency-fund tools (income drives saving capacity).
- **Architecture fit:** straightforward; net worth and budgets render naturally as `breakdown` + `comparison`.

### Later: Tax Engine
- Region-specific and higher maintenance, so sequence it after the evergreen engines above. Model as a
  data-driven bracket set so the engine stays generic and the brackets are just data.

## How expansion strengthens the category

Every tool above shares the finance concept graph (`src/lib/engines/finance/concepts.ts`) and links via
curated knowledge relationships, so each addition increases internal linking and topic authority across
the whole Money & Finance cluster rather than standing alone. Because all of them reuse the platform
input + experience layers, the marginal cost per tool stays low while the catalog scales toward the
50-100+ tool ambition for the category.
