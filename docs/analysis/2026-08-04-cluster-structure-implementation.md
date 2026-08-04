# Acting on the cluster ranking analysis: groups, slugs, and a wellness fan-out

**Date:** 2026-08-04
**Trigger:** `2026-08-03-text-cluster-ranking-factors.md` identified three factors behind the
text cluster's ranking and ranked the follow-ups by cost. This records what was actually built,
what it cost, and the numbers to diff against next time.

**Constraint carried through all of it:** no previously live URL was allowed to break.

## Baselines

| | before | after |
|---|---|---|
| registry tools | 114 | 119 |
| built pages | 248 | 258 |
| tool groups | 9 | 13 |
| ungrouped tools | 55 | 34 |
| homepage directory links | 75 | 58 |
| unit tests | 1,959 | 2,007 |
| e2e tests | 655 | 670 |
| worst tool page (gzip) | 51.0 KB | 54.6 KB |
| wellness page JS (gzip) | 24.1 KB | 13.1 KB |

## 1. Tool groups on four engine-sharing clusters

Four clusters already shared an engine and a pattern but had no group, so their pages linked only
the three siblings `RelatedTools` derives. Declaring the group renders `GroupSwitcher` instead,
which links every member to every sibling.

| group | members | net sibling links per member |
|---|---|---|
| `body-metrics` ("Health Calculator") | 11 | +7, minus 1 homepage |
| `growth-calculators` | 6 | +2, minus 1 homepage |
| `everyday-calculators` | 6 | +2, minus 1 homepage |
| `health-trackers` | 3 | +1, minus 1 homepage |

`scientific-calculator` was deliberately left out of `everyday-calculators`: it is a different
experience, not a one-answer calculator, and the group is meant to read as one workspace.

**URL effect: none.** The sitemap, web manifests and `dist/indexnow-urls.json` are all derived from
slugs, and no slug moved. The homepage directory shrank from 75 links to 58 because each group
collapses to one entry, which is the known and accepted cost.

**What it cost that was not predicted.** The pill row is about 56px of vertical space above the
tool. On a 1280x720 desktop viewport that pushed the last 15 to 35px of chart below the fold on the
three tallest health calculators. The switcher margin was tightened from `--space-6` to `--space-5`,
and `tests/e2e/health.spec.ts` now pins what the rule was protecting: the hero answer and the start
of the chart above the fold, rather than the entire chart. Shrinking the pills further was rejected
because they are already 36px, under the 48px touch-target minimum.

## 2. Simulation slugs renamed to search intent

Factor 1 of the analysis is that the text cluster wins by putting one page against one exact query.
The physics and applied-math tools were slugged after what they are rather than what people type,
so all fourteen were renamed to calculator or solver intent, along with their display titles and
SEO titles. `shm-spring-simulator` was the clearest case: it led with an abbreviation nobody
searches.

**Every retired URL still works.** Each one now builds a noindex stub that meta-refreshes to the new
page and declares it canonical, so the old address hands over its link equity instead of falling
through to GitHub Pages' noindex `404.html`. The redirect route became a rest param
(`src/pages/tool/[...oldPath].astro`, replacing the hardcoded `developer/[slug].astro`) because a
slug rename keeps its segment, and a per-segment stub route would have collided with the generated
tool route for that segment.

The page content is unchanged: the interactive simulation is still what loads, and the body prose
still describes it as one. Only the name and the address changed.

## 3. Wellness variant fan-out

Five tools, all on the existing `wellness` engine, taken from the top of `npm run research:next`
rather than from intuition: `bmr-calculator` (86.1 tier), `calorie-deficit-calculator`,
`protein-intake-calculator`, `one-rep-max-calculator`, `running-pace-calculator`. All five joined
`body-metrics`, taking it to eleven members.

This is the text cluster's playbook applied literally. `bmr-calculator` overlaps `tdee-calculator`
heavily, which is the point: "bmr calculator" is its own high-volume query and deserves its own
page, exactly as `character-counter` deserves one beside `word-counter`.

**URL effect: purely additive.** Five new slugs enter the sitemap and IndexNow; nothing existing
moved.

### The structural problem it exposed

Adding five calculators pushed every wellness page's JS from 23.x to 24.1 KB gzipped, over the 24 KB
tool budget, and it broke eleven pages at once rather than five. The cause was not the new content:
`src/lib/runtime/engines/wellness.ts` imported the calculator registry, which holds every
calculator, so the engine chunk carried all of them and each new tool made every existing page on
that engine heavier.

The fix was per-calculator code splitting (`src/lib/engines/wellness/lazy.ts`). A page declares its
one calculator on the widget's `data-wellness` attribute, the runtime imports only that chunk, and
`scripts/check-budget.ts` follows the attribute the same way it already follows
`data-simulation-id`. Wellness page JS fell from 24.1 KB to 13.1 KB gzipped, an 11 KB saving per
page, and further fan-out on this engine is now close to free.

Two smaller things came out of it. `src/lib/runtime/index.ts` was not awaiting `attach()`, so an
async attach would never have completed before `TT.ready` flipped; the type already allowed
`Promise<void>`, so this was a latent bug rather than a new constraint. And the answer now paints
one round trip later, which the health e2e measurements had been silently relying on; they now wait
for the drawn chart instead of assuming the runtime won the race.

## What was not done

Search Console data. Every claim in the source analysis rests on internal link counts and query
shape, which are proxies. `npm run check:indexing` would tell us which of these pages Google has
actually indexed, but it needs `GSC_SITE_URL` and `GSC_SA_KEY_JSON`. Until that runs, the effect of
all three changes is a hypothesis with a good mechanism behind it, not a measured result. Re-run the
inbound-link crawl and the indexing report in four to six weeks and diff against the baselines above.
