# Chrome Extensions for ToyTools

**Date:** 2026-07-30
**Baseline:** 109 tools, 18 engines, 26 engine/pattern pairs. Static Astro site, all computation
client-side. PWA install already shipped (per-tool webmanifest, committed 192/512 PNGs, `sw.js`,
mobile-only `InstallButton`). APP_VERSION 6.0.0-alpha.
**Question:** can tools ship as Chrome extensions, what would it take, can the site offer a
one-click "add as extension" button, which tools are good candidates, how do the existing engines
carry the extension UI, how is the module arranged on disk, and how do the packages get published.

**Short answer:** yes, and the platform is unusually well positioned for it, because every engine
is already a pure DOM-free function and every widget is already designed for a 390px viewport. The
two things that do *not* transfer are the Astro rendering layer and the `<script is:inline>` widget
scripts, which Manifest V3's content security policy forbids outright. So the honest shape of the
work is: reuse the engines untouched, rebuild a thin UI host (five generic shells cover 86 of the
109 tools), and generate each extension manifest from the registry the same way the webmanifest
endpoint already does. A true one-click install button is not possible on any modern Chrome; the
best available is a deep link to the Web Store plus real installed-state detection.

**Shape of the delivery:** ten focused extensions, not one toolbox, published one at a time with a
deliberate wait between submissions, hub last. The decisive reason is per-package permissions: a
standalone JWT decoder asks for nothing at install time, while a 68-tool hub must ask for the union
of everything forever. Directory structure is in section 5.1, the package model in 5.2, the package
set in section 7, and the publishing runbook in section 8.

---

## 1. Why this fits the current architecture

Three properties of the codebase make an extension cheap, and they were not built for this:

| Property | Evidence | Why it matters for MV3 |
| --- | --- | --- |
| Engines are pure, UI-free, framework-free | `src/lib/engines/*/registry.ts`, `src/lib/text/*`, `src/lib/generation/*`. A grep for `document.`/`window.` across all engine code hits only `experience/render.ts` (DOM writes into a known static shell) and a `globalThis.crypto` comment in `generation/utils.ts` | Extension code cannot load remote script. Every line must be bundled. Pure modules bundle without change |
| Everything already runs offline in the browser | No server, no API, no database. `runEncoding`, `runHash`, `runStructuredData`, `runMath` are all local | Web Store policy rejects extensions that are a thin wrapper around a website. ToyTools has genuine local functionality, which is exactly what passes review |
| Phone-first design is already extension-sized | Hard rule in `CLAUDE.md`: single column below 1024px, answer-first order, 48px targets, fixed-height panels, no auto-growing textareas | A Chrome popup is capped at 800x600 and realistically 360-420px wide. The mobile layout *is* the popup layout. Most of the design work is already paid for |

The registry-derived build discipline is the fourth advantage. `src/pages/manifest/[slug].webmanifest.ts`
already proves the pattern: one manifest per tool, generated from `tools`, colors from
`iconColors(tool)`, icons from the committed PNG set. An extension manifest generator is the same
function with a different output schema.

---

## 2. What Manifest V3 actually forbids (the real constraints)

These are the constraints that shape every decision below.

1. **No inline script, no `eval`, no remote code.** Extension pages run under
   `script-src 'self'`. Every one of the 15 shared widgets ships exactly one `<script is:inline>`
   block (`ConverterWidget.astro:128-370`, and one each in Converter/Csv/DateTime/Finance/Generator/
   Jwt/Math/StructuredData/TextMetric/TextProcessor/Tracker/Wellness/InstallButton). **None of that
   code can be pasted into an extension page.** It has to be rebuilt as bundled modules. This is the
   single largest cost item in the whole project.
2. **No Astro at runtime.** `.astro` files, `withBase()`, `import.meta.env.BASE_URL`, and the
   layouts do not exist inside an extension. Astro's Container API could render widget HTML to a
   string at build time, but it would emit the forbidden inline scripts and the surrounding page
   chrome, so it solves the cheap half of the problem and not the expensive half. Rejected in
   section 5.
3. **Service worker, not a background page.** The MV3 worker is killed after roughly 30 seconds of
   idle. `setTimeout` for a 25 minute Pomodoro **will not fire**. Timers must use `chrome.alarms`
   (30 second minimum period), and any state must live in `chrome.storage`, never in worker
   variables.
4. **Inline installation was removed from Chrome in 2018.** `chrome.webstore.install()` is gone.
   A website cannot install an extension. See section 6.
5. **Permission warnings cost installs.** `<all_urls>` host permission shows "Read and change all
   your data on all websites" at install time and slows review. The design below uses `activeTab`
   plus `contextMenus` plus `scripting`, which shows no scary warning because access is granted
   per-gesture.
6. **Single purpose policy.** An extension must have one narrow, explainable purpose. "109 tools"
   is a review risk. Mitigated by framing and by splitting (section 7).

---

## 3. Which tools are good candidates

### The scoring criteria

An extension is worth building only when it removes friction the website cannot. Five signals:

1. **Input locality.** Is the input already on the user's screen or clipboard? This is the dominant
   signal. The website flow is: copy, open tab, find tool, paste, copy, return, paste. The extension
   flow is: select, right-click, done.
2. **Ambient need.** Does the tool need to keep running, count, or notify while the user is doing
   something else? Only an extension can own a toolbar badge and fire an alarm.
3. **Frequency.** Many times a day, or once a year.
4. **Screen budget.** Does it work in 400x600, or does it need room to breathe.
5. **Write-back.** Can the result be pushed straight back into the editable field it came from.
   This is a capability the website cannot have at all.

### Tier S: build these first (42 tools)

Every one of these takes its input from text already on the page, and the popup is a better home
for it than a tab.

| Group | Count | The extension interaction |
| --- | --- | --- |
| `encoding/encode-decode` | 8 | Select an encoded string in a URL bar, a log, a config file view, right-click, "Decode Base64". Auto-detect direction with the existing `detectEncoding(id, text)` |
| `structured-data/*` | 8 | Side panel JSON tree viewer against a raw API response in the tab. Format, minify, validate, convert. This is what devs currently install a JSON viewer extension for |
| `hashing/hash` | 5 | Selection to MD5/SHA-1/SHA-256/SHA-512/CRC32 with one click. `runHash` is already async over `crypto.subtle`, which works in extension pages (a secure context) |
| `text-processor/text-transform` | 9 | Select text **in an editable field**, transform, write the result back in place. Case conversion, slugify, reverse. The write-back is the whole product |
| `text-processor/text-cleanup` | 9 | Same, for whitespace, blank lines, duplicates, accents, emoji. Cleanup is nearly always applied to text you are actively editing |
| `jwt/token-decode` | 1 | The strongest single candidate on the list. Devs paste tokens into a web decoder constantly, and the security posture of "never leaves your machine" is a real selling point. Side panel, auto-decode from clipboard or selection |
| `datetime/datetime-convert` | 2 | Unix timestamp and timezone conversion during log triage. Select `1735689600`, read the date |

### Tier A: strong, but need bespoke UI or new capability (26 tools)

| Group | Count | Note |
| --- | --- | --- |
| `text-analysis/text-metric` | 9 | Character and word count on the current selection is genuinely useful (post length, meta description length). One popup with the hero metric plus the stat grid covers all nine |
| `generation/*` | 5 | Password generator is a canonical extension category. UUID for devs. **QR code of the current tab URL** is the standout: "QR this page to my phone" is a top search in the Web Store and needs `chrome.tabs` to be good at all |
| `productivity/stateful` | 4 | Pomodoro is strictly better as an extension: toolbar badge countdown, `chrome.alarms`, `chrome.notifications`, survives tab closure. Notepad as a side panel scratchpad is a classic. Todo gains `chrome.storage.sync` cross-device sync, which the website cannot offer without a backend. **Caveat: `keep-screen-awake` gets *worse*.** The Wake Lock API needs a visible document, and a popup closes on blur, so it would need an offscreen document and is still fragile. Leave it on the web |
| `tracker/health-track` | 3 | Badge count plus a daily reminder alarm beats remembering to open a tab. Water intake especially |
| `text-interactive` | 2 | `text-compare` needs the side panel, not the popup. `find-replace` pairs with write-back |
| `csv/csv-transform` | 3 | Real but weaker input locality: CSV normally arrives as a file, not as page text. Side panel with a file picker. `runCsv(id, input, second?)` already accepts the two inputs `csv-diff` needs |

### Tier B: include in the launcher, do not design for (27 tools)

`calculator/calculate` (7), `finance/*` (8), `wellness/health-calculate` (6), `math/math-calculate`
(3), `datetime/datetime-calculate` (2), `datetime/datetime-schedule` (1). These take typed numeric
input. There is no page context to capture, so the
extension adds only "one click closer" and offline availability. They are nearly free to include
because they all share one contract (fields in, `InteractiveResult` out), so the generic fields
shell picks them up at no marginal cost. Do not spend design time on them.

Cron expression parser sits at the top of this tier: it is a dev tool, and pasting a crontab line
from a terminal is close to input locality.

### Tier C: exclude (14 tools)

All 14 simulations, `physics/simulate` (11) and `math-lab/simulate` (3). They need canvas space,
they are exploratory rather than transactional, there is zero page context, and `SimulationWidget.astro`
is 21KB of interaction logic including immersive fullscreen. The extension should link out to the
site for these. Excluding them also keeps the bundle small.

### Rollup

| Tier | Tools | Share |
| --- | --- | --- |
| S: ship first | 42 | 39% |
| A: high value, bespoke | 26 | 24% |
| B: free ride in the launcher | 27 | 25% |
| C: excluded | 14 | 13% |
| **Total** | **109** | |

**68 of 109 tools have a real reason to exist as an extension.**

---

## 4. How the engines carry the extension UI

This is the load-bearing insight. The 109 tools do not have 109 UIs. They have **five engine
contracts**, and each contract maps to exactly one extension shell.

| Contract | Signature (already in the codebase) | Tools | Extension shell |
| --- | --- | --- | --- |
| String to string | `runProcessor(id, text): string` | 18 | **Transform shell**: input, live output, copy, write-back |
| String to string with mode and validation | `TransformProvider.run/detect/validate/meta/info` (`src/lib/engines/transform/types.ts:87`), implemented by `encodingProvider` and `hashingProvider` | 13 | Same Transform shell plus a direction toggle. `detect()` preselects the direction |
| String to structured result | `runStructuredData(id, input)`, `runCsv(id, input, second?)`, `runJwt(id, token)` | 12 | **Inspector shell**: input, tree or panel output, side panel by default |
| Text to metrics | `analyzeText(text): TextAnalysis` | 9 | **Metric shell**: hero numeral plus stat grid, the existing `TextMetricWidget` layout |
| Fields to `InteractiveResult` | `runFinance/runDateTime/runMath/runWellness(id, input, opts)` plus the matching `*Fields(id)` schema getters | 29 | **Fields shell**: `SmartField`-driven form, output rendered by `renderExperience(root, result)` |
| Options to output | `runGeneration(id, options): GenerationResult` | 5 | **Generator shell**: options, regenerate, copy |
| Stateful log or timer | `tracker` (`src/lib/engines/tracker/registry.ts:118`), pure `model.ts` plus `viz.ts` | 7 | Bespoke, and the only place bespoke is justified |
| Two-input interactive | `diffLines`/`diffStats` (`src/lib/text/compare.ts`), no runtime global | 2 | Bespoke, side panel (`text-compare`, `find-replace`) |
| Canvas simulation | `SIMULATIONS` registry plus per-sim `draw.ts` | 14 | None. Excluded, see tier C |

Two of these are especially valuable:

- **`renderExperience`** (`src/lib/experience/render.ts`) is DOM-manipulating but framework-free.
  It fills text and toggles visibility inside a known static shell and builds a few `<li>`/`<dt>`
  elements with `document.createElement`. That is fully CSP-compliant inside an extension page.
  Bundle it, hand it the same shell markup as static HTML in `popup.html`, and 27 calculator tools
  render their full result hierarchy with zero new rendering code.
- **`src/lib/engines/tracker/viz.ts`** is pure, DOM-free, and returns SVG strings (bars, line,
  progress ring). It works in a popup unchanged.

So the answer to "how do our engines support the extension UI" is: **the engines already return
render-ready data structures, and the two renderers that exist (experience, viz) are both
CSP-safe.** What has to be rewritten is the glue: the 15 inline widget scripts that wire input
events to engine calls to DOM writes, plus state persistence and the copy or clear or paste action
row. That glue is roughly 2,000 lines of inline JS today, but it collapses to about 400 lines across
five shells, because the per-tool variation lives in data (`processorId`, field schemas, stat lists)
which the extension reads from the same registry.

Design tokens transfer verbatim. `src/styles/tokens.css` and `src/styles/tool-widget.css` are plain
CSS with custom properties and can be copied into the extension bundle as-is, including both dark
mode layers. The popup should follow `prefers-color-scheme` and also honor a stored override, same
as `BaseLayout`.

---

## 5. Implementation plan

### 5.1 Directory structure

A sibling sub-project with its own `package.json`, following the precedent set by `seo-engine/` and
`quality-guardian/`: a tooling sidecar, never part of the site bundle. The layout is **multi-package
from day one** (section 7), because retrofitting a single-package build into a multi-package one
means rewriting the build, the manifest generator, the icon pipeline, and the tests at the moment
the first listing is already live.

The organising principle matches the rest of the platform: **a package is data, not a directory of
code.** There is exactly one shared implementation, and each published extension is a `PackageDef`
row that selects tools, surfaces, and permissions from it. No package owns a source file.

```
extension/
├── package.json                  # own deps: vite, @types/chrome, adm-zip, web-ext (Firefox)
├── tsconfig.json                 # extends ../tsconfig.json, adds "chrome" types
├── vite.config.ts                # multi-entry lib build; PACKAGE injected via define
├── README.md                     # command table (the seo-engine/README.md equivalent)
├── PUBLISHING.md                 # the store runbook + release ledger rules (section 8)
│
├── packages.ts                   # ★ SOURCE OF TRUTH: one PackageDef per store listing
├── tiers.ts                      # slug -> 'S' | 'A' | 'B' | 'excluded' (section 3)
├── labels.ts                     # slug -> context-menu label ("Decode Base64")
│
├── core/                         # every line of shipped code lives here. No per-package code.
│   ├── engines/
│   │   ├── resolve.ts            # (engine, processorId) -> a uniform run() facade
│   │   └── contracts.ts          # the 5 shapes from section 4, as discriminated types
│   ├── shells/                   # one per engine contract, ~80 lines each
│   │   ├── transform.ts          # 31 tools: text-processor + encoding + hashing
│   │   ├── inspector.ts          # 12 tools: structured-data + csv + jwt
│   │   ├── metric.ts             #  9 tools: text-analysis
│   │   ├── fields.ts             # 29 tools: finance/datetime/math/wellness/calculator
│   │   ├── generator.ts          #  5 tools: generation
│   │   ├── compare.ts            #  2 tools: text-compare + find-replace
│   │   └── stateful/             #  7 tools: pomodoro, notepad, todo, 3 trackers
│   ├── host/
│   │   ├── popup.html            # static shell markup only. ZERO inline script (MV3 CSP)
│   │   ├── sidepanel.html        # same, taller layout
│   │   ├── boot.ts               # reads the injected PACKAGE, mounts one shell, no router
│   │   ├── launcher.ts           # multi-tool packages only: search + recents list
│   │   └── experience-shell.html # the static [data-section] markup renderExperience fills
│   ├── platform/                 # ★ the ONLY files allowed to touch chrome.*
│   │   ├── storage.ts            # ToyTools.state API over chrome.storage (5.5)
│   │   ├── page.ts               # read selection / write back via chrome.scripting
│   │   ├── clipboard.ts
│   │   ├── menus.ts              # context menus derived from PACKAGE.tools (5.4)
│   │   ├── alarms.ts             # chrome.alarms wrapper (never setTimeout)
│   │   ├── badge.ts              # chrome.action.setBadgeText
│   │   └── notify.ts
│   ├── background/
│   │   ├── worker.ts             # the MV3 service worker entry
│   │   └── handlers.ts           # menu click -> engine -> write back or open popup
│   ├── site/
│   │   └── bridge.ts             # externally_connectable ping responder (section 6)
│   └── styles/
│       ├── tokens.css            # COPIED at build from ../../src/styles/tokens.css
│       ├── tool-widget.css       # COPIED at build
│       └── popup.css             # the only extension-specific CSS: popup/sidepanel frame
│
├── listings/                     # store metadata, committed, reviewed like code
│   └── <package-id>/
│       ├── listing.md            # name, summary (132 chars), description, category
│       ├── privacy.md            # single-purpose statement + "no data collected" disclosure
│       └── screenshots/          # 1280x800 PNGs, at least one per surface
│
├── scripts/
│   ├── build.ts                  # build one package or all; --package <id>
│   ├── generate-manifest.ts      # PackageDef + registry -> manifest.json
│   ├── generate-icons.ts         # reuses ../src/lib/icons/tool-icon.ts + glyphs.ts
│   ├── validate-extension.ts     # the gate (5.7)
│   ├── zip.ts                    # dist/<id>/ -> artifacts/<id>-<version>.zip
│   └── publish.ts                # Web Store API upload + publish, ONE package per run
│
├── state/
│   └── published.json            # ★ committed ledger: id -> { storeId, version, publishedAt }
│
├── dist/<package-id>/            # gitignored: unpacked build, what you load unpacked
└── artifacts/                    # gitignored: the .zip uploaded to the store
```

Three boundaries in that tree are load-bearing:

1. **`core/platform/` is the only place `chrome.*` appears.** Everything else is plain DOM and pure
   functions, which is what lets the shells be unit-tested under jsdom with no extension host, and
   what makes the Firefox port a swap of one directory rather than a sweep of the codebase. Enforce
   it with a grep check in `validate-extension.ts`, the same way the project already enforces
   architectural rules rather than trusting convention.
2. **`core/styles/tokens.css` is copied at build, never edited.** It is generated output living in a
   source directory, so `build.ts` overwrites it every run and `validate-extension.ts` fails if it
   differs from `../src/styles/tokens.css`. Copying rather than importing is forced by MV3: the
   extension cannot fetch CSS from the site.
3. **Nothing under `core/` knows which package it is in.** The package identity arrives as a single
   build-time constant, so no file has a conditional on package id:

```ts
// vite.config.ts
define: { __PACKAGE__: JSON.stringify(pkg) }   // pkg = the PackageDef being built
```

`boot.ts` reads `__PACKAGE__`, and for a single-tool package skips the launcher entirely and mounts
the shell directly. That is why the JWT package is a 40KB popup and not a 68-tool bundle with 67
tools tree-shaken out badly.

Vite `resolve.alias` points `@lib` and `@data` at `../src`, so the engines are **imported, never
copied**. That is the anti-drift mechanism: if `runEncoding` changes signature, the extension build
breaks in CI on the same commit.

### 5.2 A package is a `PackageDef`

```ts
// extension/packages.ts
export interface PackageDef {
  /** Stable id: the dist dir, the artifact name, the ledger key. */
  id: string;
  /** Store listing name. Chrome caps this at 45 characters. */
  storeName: string;
  /** Store summary. Chrome caps this at 132 characters. */
  summary: string;
  /** The single-purpose sentence a reviewer will judge. One sentence, no lists. */
  purpose: string;
  /** Tool slugs, validated against the registry and against tiers.ts. */
  tools: string[];
  /** Which extension surfaces this package actually uses. */
  surfaces: ('popup' | 'sidepanel' | 'contextMenu' | 'omnibox' | 'commands')[];
  /** Minimal permission set. Validated against the APIs the built bundle imports. */
  permissions: string[];
  /** Omnibox keyword. Must be unique across packages (one keyword per extension). */
  keyword?: string;
  /** Which tool's icon seeds the mark, via iconColors() + the glyph set. */
  iconSeed: string;
  status: 'planned' | 'staged' | 'published';
}
```

The manifest generator then takes a `PackageDef` rather than the whole registry:

```ts
// extension/scripts/generate-manifest.ts (sketch)
import { tools } from '@data/registry';
import { VERSION_CONFIG } from '@lib/version';

export function manifestFor(pkg: PackageDef, patch: number) {
  const shipped = pkg.tools.map(slug => bySlug(slug));   // throws on an unknown slug
  return {
    manifest_version: 3,
    name: pkg.storeName,
    description: pkg.summary,
    // Store versions are 1-4 dot-separated integers. VERSION_CONFIG.status ('alpha') has
    // no representation, so it is dropped, and the 4th part is the per-package patch from
    // state/published.json so one package can ship a fix without bumping the others.
    version: `${VERSION_CONFIG.major}.${VERSION_CONFIG.minor}.${VERSION_CONFIG.patch}.${patch}`,
    minimum_chrome_version: pkg.surfaces.includes('sidepanel') ? '114' : '102',
    permissions: pkg.permissions,          // NOT a shared superset. See below.
    // deliberately NO host_permissions on any package: activeTab covers per-gesture access
    action: { default_popup: 'popup.html' },
    ...(pkg.surfaces.includes('sidepanel') && { side_panel: { default_path: 'sidepanel.html' } }),
    background: { service_worker: 'background.js', type: 'module' },
    ...(pkg.keyword && { omnibox: { keyword: pkg.keyword } }),
    externally_connectable: { matches: ['https://toytoolsapp.com/*'] },
    icons: { 16: 'icons/16.png', 32: 'icons/32.png', 48: 'icons/48.png', 128: 'icons/128.png' },
  };
}
```

**Per-package permissions are the strongest argument for shipping separately**, and they are the
thing a single hub extension can never have. Compare what each listing has to ask for:

| Package | Permissions | Install-time warning the user sees |
| --- | --- | --- |
| `toytools-jwt` | `storage` | none |
| `toytools-encode` | `contextMenus`, `activeTab`, `scripting`, `storage` | none (activeTab is per-gesture) |
| `toytools-focus` | `alarms`, `notifications`, `storage` | "Display notifications" |
| `toytools` (hub) | all of the above, union | "Display notifications" plus a longer list |

Every permission in a manifest is a line item a cautious installer reads. A JWT decoder that asks
for nothing converts better than a toolbox that asks for six things, and it clears review faster.
`validate-extension.ts` should derive the required permissions from the bundle's actual imports and
fail when `PackageDef.permissions` is a superset, so the list cannot rot upward as tools are added.

### 5.3 Icons: extend the existing pipeline

`ICON_PNG_SIZES` is `[192, 512]` and `validate-architecture` **fails the build** when a tool is
missing those PNGs. Do not add extension sizes to that constant, or every tool needs four more
committed files and the validator grows teeth it does not need. Add a separate export:

```ts
// src/lib/icons/sizes.ts
export const EXTENSION_ICON_SIZES = [16, 32, 48, 128] as const;
```

and a second generator pass in `extension/scripts/generate-icons.ts` that reuses
`src/lib/icons/tool-icon.ts` and `glyphs.ts` unchanged. At 16px the composed glyphs will be mud, so
the hub extension needs one hand-checked 16px mark rather than a downscale.

### 5.4 Context menus derived from the registry

This is where the extension earns its keep, and it is pure data:

```ts
// extension/src/background.ts (sketch)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'toytools', title: 'ToyTools', contexts: ['selection', 'editable'] });
  for (const tool of selectionTools) {          // derived from tier + engine
    chrome.contextMenus.create({
      id: tool.slug,
      parentId: 'toytools',
      title: tool.contextLabel ?? tool.name,    // "Decode Base64", not "Base64 Encoder / Decoder"
      contexts: tool.writesBack ? ['editable'] : ['selection'],
    });
  }
});
```

Two things to get right. First, the menu labels are **not** the tool names: the site name is
`base64-encoder-decoder`, the menu item should read "Decode Base64". That is a new optional
`contextLabel` field on `ToolConfig`, or a derived label map in the extension. Second, Chrome shows
a flat menu badly above roughly a dozen items, so group by engine into a two-level menu and cap the
top level.

The click handler resolves the engine from `tool.engine` and `tool.processorId`, exactly as
`ConverterWidget` does today, then either opens the popup with the result preloaded or writes back:

```ts
const [{ result }] = await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: (text) => { /* replace selection in the focused editable */ },
  args: [output],
});
```

`activeTab` is sufficient here because the context menu click is a user gesture.

### 5.5 Storage adapter

`ToyTools.state` (`ToyToolsRuntime.astro:186-232`) is a versioned envelope over `localStorage` with
a 50KB cap and a registered migration chain. The extension should keep that exact API surface and
swap the backend:

| Concern | Web | Extension |
| --- | --- | --- |
| Backend | `localStorage` | `chrome.storage.local` (10MB, async) |
| Cap | 50KB with a toast on overflow | Effectively unbounded, but keep the cap so exports stay portable |
| Sync | none | `chrome.storage.sync` for todo/notepad/tracker (100KB total, 8KB per item) |
| Migration | `TT.state.VERSION` chain | Same chain, reused verbatim |

The API is async in the extension, so the shells must `await` load. Keep the envelope shape
byte-identical so the existing export/import backup in `ToyToolsRuntime` can move data **both
ways** between the site and the extension. That is a genuine feature: "import my ToyTools backup".

### 5.6 Analytics and feedback

Ship **zero** analytics in the extension. GA in an extension requires Measurement Protocol (gtag.js
is remote code and therefore banned), triggers a Web Store privacy disclosure, and contradicts the
"nothing leaves your machine" pitch that makes the JWT decoder and hash tools attractive in the
first place. `src/lib/analytics/guard.ts` should treat the extension origin as not-a-real-user if
the runtime is ever shared.

Feedback reuses `src/lib/feedback/templates.ts` untouched, since it is a pure string builder, and
delivers via `chrome.tabs.create({ url: mailtoUrl })`. The on-page copy fallback stays, per the
standing rule in `CLAUDE.md`.

### 5.7 Testing

- Engine tests already cover the engines. No new unit tests needed for the reused code, which is
  the point.
- Add `extension/src/shells/*.test.ts` for the glue (vitest, jsdom).
- Playwright supports loading an unpacked MV3 extension via a persistent context. Add
  `tests/e2e/extension.spec.ts` as a third project alongside chromium and pixel5: install the built
  extension, open the popup, run one tool per shell. Popup pages need
  `chrome-extension://<id>/popup.html`, resolvable from the service worker target.
- `extension/scripts/validate-extension.ts` in the spirit of `validate-architecture.ts`: every
  shipped slug has a tier, every tier-S slug resolves in its engine registry, every context label is
  unique and under 40 characters, manifest permissions match the APIs actually imported.

---

## 6. The "add as extension" button: what is actually possible

**One-click install from the website is impossible.** Chrome removed inline installation
(`chrome.webstore.install()`) in Chrome 71, December 2018, precisely to stop sites from installing
extensions. There is no replacement API. Every extension install now goes through the Web Store UI.

What is possible, in descending order of quality:

1. **Deep link to the Web Store listing** with a Chrome-only, desktop-only button. One click opens
   the listing, a second click is Chrome's own "Add to Chrome". Two clicks total, and the second one
   is not ours.
2. **Detect whether it is already installed** and change the button, which is the part that makes it
   feel native rather than nagging. The extension declares:

   ```json
   "externally_connectable": { "matches": ["https://toytoolsapp.com/*"] }
   ```

   and the site pings it:

   ```js
   chrome.runtime.sendMessage(EXTENSION_ID, { type: 'ping' }, (res) => {
     if (!chrome.runtime.lastError && res?.ok) showInstalledState(res.version);
   });
   ```

   Installed becomes "In your toolbar. Press Alt+Shift+T" instead of an install prompt. Note
   `chrome.runtime` only exists on the page when *some* extension has whitelisted it, so the whole
   path must be feature-detected.
3. **Post-install onboarding** via `chrome.runtime.onInstalled` opening
   `https://toytoolsapp.com/extension/welcome/`, which is where the context menu and shortcut get
   explained. Install without onboarding is where extension retention dies.

### Where the button goes

There is a clean symmetry with what already exists. `ToolLayout` auto-includes `InstallButton`
(mobile-only, below 640px) and `FeedbackLink`, so no tool file mentions either. Extension install is
the desktop mirror image:

| Surface | Existing | Proposed |
| --- | --- | --- |
| Tool page, mobile | `InstallButton` (PWA) | unchanged |
| Tool page, desktop Chrome | nothing | `ExtensionButton.astro`, auto-included by `ToolLayout`, shown only above 640px, only when `navigator.userAgentData.brands` includes Chromium, and only for tools whose tier is S or A |
| New standalone page | `/feedback/` | `/extension/`, added to `STANDALONE_PAGES` in `src/lib/content/manifest.ts` as `type: 'page'`, which is the only edit needed to reach the sitemap and IndexNow |
| Nav | theme toggle | nothing. Do not add a second nag |

Gating the per-tool button by tier matters. Showing "add this as an extension" on
`projectile-motion-simulator`, which is excluded, is a broken promise.

---

## 7. Distribution: one extension or many

| Option | For | Against |
| --- | --- | --- |
| **One hub extension** ("ToyTools: text, encoding and dev utilities") | One listing to maintain, one review, one install, cross-tool launcher, users discover tools they did not know about | Weak Web Store search presence. Nobody searches "toolbox". Single purpose policy risk |
| **One extension per tool** (up to 65 listings) | Exact Web Store search match: "base64 decoder extension", "jwt decoder extension". Tiny permission sets. Each listing is its own SEO surface | 65 listings to review, version, screenshot, and respond to reviews on. Realistically unmaintainable, and Chrome flags near-duplicate spammy listings |
| **Hybrid: one hub plus a few focused ones** | Hub for retention, focused listings for acquisition. The build system emits both from one codebase, exactly like the per-tool webmanifest | Two listing types to keep in step |

**Decision: focused packages, published one at a time, hub last.** Ten listings, not one and not
sixty-five. Four reasons this beats hub-first:

1. **Permissions.** A focused package asks for the minimum (section 5.2). `toytools-jwt` needs
   `storage` and nothing else, so its install screen shows no warning at all. The hub must ask for
   the union of everything, forever, including permissions most of its users will never trigger.
2. **Review risk is per listing.** The first submission is the one that discovers whatever the
   reviewer objects to. Discovering it on a one-tool package costs a day. Discovering it on the hub,
   after the shells for all 68 tools are built, costs the whole schedule.
3. **Store search is the acquisition channel.** People search "jwt decoder extension" and "base64
   extension". Nobody searches "toolbox". Each focused listing is its own discovery surface, the same
   argument that makes 109 separate tool URLs beat one mega-page on the website.
4. **Bundle size.** A single-tool package is a 40KB popup. The hub is every shell plus every engine.

The real cost is ten listings to version, screenshot, and answer reviews on, plus the near-duplicate
listing policy: Chrome removes families of listings that are the same extension with the name
swapped. Mitigation is that these are genuinely different extensions (different permissions,
different surfaces, different UI, non-overlapping tool sets) and each `listings/<id>/listing.md` is
written from scratch rather than templated. Ten is defensible. Sixty-five would not be.

### The package set

| # | Package id | Tools | Count | Surfaces | Why it stands alone |
| --- | --- | --- | --- | --- | --- |
| 1 | `toytools-jwt` | jwt-decoder | 1 | popup | Zero permissions. Highest search demand per tool on the whole list. The smallest possible first submission |
| 2 | `toytools-encode` | encoding | 8 | popup, contextMenu | First package to touch the page. Proves `activeTab` and write-back |
| 3 | `toytools-hash` | hashing | 5 | popup, contextMenu | Same shell as 2, so it is a `packages.ts` row and a listing, no new code |
| 4 | `toytools-json` | structured-data 8, csv 3, text-compare | 12 | sidepanel, popup | The `chrome.sidePanel` package. Competes with the JSON viewer extensions people already install |
| 5 | `toytools-text` | text-transform 9, text-cleanup 9, find-replace | 19 | contextMenu, popup | The write-back package: transform text in the field you are typing in |
| 6 | `toytools-count` | text-analysis | 9 | popup, contextMenu | Count the selection. Different audience (writers, not devs) so a separate listing genuinely reaches different people |
| 7 | `toytools-time` | datetime-convert 2, plus cron and the 2 date calculators as riders | 5 | popup | Log triage. Small, and the first package to carry tier B riders |
| 8 | `toytools-generate` | generation | 5 | popup | Password, UUID, lorem, QR of the current tab. Expect extra review scrutiny on anything password-shaped |
| 9 | `toytools-focus` | productivity 4, tracker 3 | 7 | popup, alarms, badge | The only package with a different permission profile (`alarms`, `notifications`) and the only stateful one |
| 10 | `toytools` (hub) | all of tiers S and A, tier B in the launcher | 68 | everything | Published last, once every shell is proven in the wild. Its listing can then honestly say "all of the above in one" |

Packages 1 to 9 cover exactly the 68 tools of tiers S and A, with no tool in two packages. That
disjointness is what keeps the near-duplicate policy off your back, and `validate-extension.ts`
should assert it.

Framing for the single purpose policy: each focused package has an obvious one-sentence purpose, which
is the whole point. Only the hub needs careful framing, and by then you will have nine approved
listings establishing the account's track record. The hub's declared purpose is "transform and inspect
text and data on the page", not "109 tools", and the tier B calculators stay behind the launcher
rather than in the store description.

### Beyond Chrome

- **Edge:** accepts the same MV3 package through Partner Center, no fee. Nearly free.
- **Firefox:** MV3 with differences (event pages rather than a terminating service worker,
  `browser_specific_settings`, `browser.*` promises). `webextension-polyfill` plus a second manifest
  target covers most of it. Worth doing in phase 4.
- **Safari:** requires an Xcode wrapper project and a paid Apple developer account. Not worth it
  until the others prove demand.

---

## 8. Publishing one package at a time

### 8.1 Account and the first upload

One Chrome Web Store developer account (one-time $5 registration) holds every item, so the fee is
paid once for all ten. Two practical constraints shape the automation:

- **The first publish of a new item is manual.** The Web Store API can create an item and upload a
  package, but a new item cannot be published until its listing fields (description, category,
  screenshots, privacy practices, single-purpose statement) are filled in the developer dashboard.
  So package 1 goes through the dashboard by hand. Every *update* after that is API-driven.
- **Verified publisher and 2FA.** The account needs 2FA enabled to publish, and a verified contact
  email. Do this before the first submission, not during it.

### 8.2 The release ledger

`extension/state/published.json` is committed and is the repo's memory of what is actually live:

```json
{
  "toytools-jwt": {
    "storeId": "abcdefghijklmnopabcdefghijklmnop",
    "version": "6.0.0.3",
    "publishedAt": "2026-08-04",
    "status": "published"
  },
  "toytools-encode": { "status": "planned" }
}
```

It does three jobs. It supplies the `storeId` that `publish.ts` uploads to and that the site's
`ExtensionButton` deep-links to. It supplies the fourth version part so one package can ship a fix
without bumping the other nine. And it lets `validate-extension.ts` refuse to publish a version less
than or equal to the live one, which is the mistake that otherwise costs a review cycle.

### 8.3 Commands

```sh
npm run ext:build -- --package toytools-jwt     # dist/toytools-jwt/, loadable unpacked
npm run ext:validate -- --package toytools-jwt  # the gate: must exit 0 before packaging
npm run ext:zip -- --package toytools-jwt       # artifacts/toytools-jwt-6.0.0.3.zip
npm run ext:publish -- --package toytools-jwt   # upload + publish via the Web Store API
npm run ext:build -- --all                      # every package, for CI
```

`ext:publish` takes exactly one package and refuses `--all`. Publishing is the one irreversible,
outward-facing step in this whole system, and it should never be possible to fire it at ten listings
by accident.

Credentials (`CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`, `CWS_REFRESH_TOKEN`) live as CI secrets, exactly
like `GSC_SA_KEY_JSON` for the indexing report. The workflow is
`.github/workflows/extension.yml`, **manual dispatch only with a package input, never on push to
main.** The site's deploy path must not be able to publish an extension, the same discipline that
keeps `indexnow` and `quality-guardian` out of the deploy workflow.

### 8.4 What gates each publish

Per package, in order. Any failure stops the release, and the previous package stays live:

1. `npm run build` at the repo root is green (the engines the package imports are validated there).
2. `npm run test` is green (engine unit tests, including `contract.test.ts`).
3. `npm run ext:validate -- --package <id>`: every slug resolves in the registry, every slug is in
   tiers S or A, no slug appears in another package, permissions are exactly what the bundle imports,
   `chrome.*` appears only under `core/platform/`, `tokens.css` matches the site copy, the version is
   greater than the ledger's, `listings/<id>/` has a listing, a privacy statement, and at least one
   screenshot.
4. `npm run test:e2e -- --project=extension` loads the built package unpacked and runs one tool per
   shell it contains.
5. Manual pass in a real Chrome: install unpacked, exercise every surface the `PackageDef` declares,
   confirm it works with the network disabled, confirm dark mode.
6. Zip, upload, submit.

### 8.5 Cadence

**Publish package N, then wait for review plus roughly one week of real installs before submitting
N+1.** The waiting is the point of doing this one by one. A policy objection, a permission warning
that kills conversion, a listing that does not convert, or a bug in a shared shell all surface in
that week, and fixing it once before nine more listings inherit it is the entire value of the
sequence. Packages 2 and 3 share the transform shell with nothing else changed, so if package 2 is
clean, 3 is a same-day submission.

Ship order and what each one is really testing:

| Order | Package | What this publish is actually validating |
| --- | --- | --- |
| 1 | `toytools-jwt` | The whole pipeline: bundling, CSP, icons, listing, review, the ledger. One tool, zero permissions, minimum blast radius |
| 2 | `toytools-encode` | The page boundary: `activeTab`, context menus, write-back. The first listing that could draw a permissions question |
| 3 | `toytools-hash` | That a new package is genuinely a data row (no new code should be needed here at all) |
| 4 | `toytools-json` | The side panel, and whether the JSON-viewer market notices |
| 5 | `toytools-text` | 19 tools in one context menu: the menu-grouping and label design |
| 6 | `toytools-count` | A non-developer audience and a different listing voice |
| 7 | `toytools-time` | Tier B riders inside a focused package without diluting its purpose |
| 8 | `toytools-generate` | Review scrutiny on password generation |
| 9 | `toytools-focus` | The stateful profile: alarms, notifications, badge, `storage.sync` |
| 10 | `toytools` (hub) | Single-purpose framing on a broad listing, backed by nine approved listings |

### 8.6 Site integration follows publishing, not the reverse

The `ExtensionButton` reads `state/published.json` at build time and renders **only** for tools whose
package has a `storeId`. So the site advertises exactly what is live, and shipping a package
automatically lights up the button on its tools at the next site deploy, with no separate edit. A
package still in `planned` is invisible on the site. That is the same derived-registration discipline
the tool registries already use, applied to the store.

---

## 9. Phasing and effort

Build order tracks publish order, so the first submission happens in week one rather than week three.

| Phase | Scope | Rough effort |
| --- | --- | --- |
| **0. Spike** | `extension/` skeleton, Vite multi-entry, `__PACKAGE__` injection, import `runJwt` from `../src/lib`, one popup that decodes a pasted token. Proves the bundling and CSP story end to end | 1 day |
| **1. Package 1 shipped** | `packages.ts`, manifest + icon generators, `validate-extension.ts`, ledger, listing, dashboard submission for `toytools-jwt` | 2 days plus review |
| **2. Transform shell** | Packages 2, 3, 5: encoding 8, hashing 5, text-processor 18, find-replace. Context menus, write-back, storage adapter, tokens.css copy step | 3 to 4 days |
| **3. Inspector shell plus side panel** | Package 4: structured-data 8, csv 3, text-compare | 2 to 3 days |
| **4. Metric, fields and generator shells** | Packages 6, 7, 8: text-analysis 9, generation 5, datetime 5. The 27 tier B tools ride in free on `renderExperience` | 2 to 3 days |
| **5. Stateful** | Package 9: pomodoro badge and alarms, notepad side panel, todo, 3 trackers, `storage.sync` | 3 days |
| **6. Site integration** | `/extension/` page, `ExtensionButton.astro` reading the ledger, `externally_connectable` bridge, onboarding page, `STANDALONE_PAGES` entry | 1 day |
| **7. Hub** | Package 10: launcher, omnibox, cross-tool search, the careful listing | 2 days plus review |

Roughly three weeks of build effort, but **the first listing is live in week one**, and calendar time
stretches because of the deliberate wait between submissions. Phases 1 to 3 alone (packages 1 to 5,
46 tools, every tool a developer reaches for) is a complete, defensible product.

---

## 10. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| A second UI layer drifts from the site | High | The extension imports engines by path alias, never copies them, so signature changes break the extension build. Add the extension build to CI. `validate-extension.ts` checks tier and registry coverage |
| Ten listings become ten maintenance burdens | Medium | No package owns source code, so a shell fix is one change republished to the affected packages. Cap at ten. If a package cannot justify its own listing.md written from scratch, it should not be a package |
| Near-duplicate listing takedown | Medium | Tool sets are disjoint (asserted by `validate-extension.ts`), permissions and surfaces genuinely differ, and each listing is written independently. Never template a description |
| Web Store rejection under single purpose or minimum functionality | Medium | Each focused package has a one-sentence purpose. The hub ships last, after nine approvals. Every package computes locally, so minimum functionality is satisfied |
| Permission warnings suppress installs | Medium | No `host_permissions` on any package. Per-package minimal permissions, derived from the bundle and validated. `activeTab` plus `contextMenus` plus `scripting` shows no all-sites warning |
| A shared shell bug ships to several live packages | Medium | The deliberate wait between submissions (8.5) is the mitigation. Packages sharing a shell go out consecutively, not simultaneously, so the second is a fix opportunity |
| MV3 worker suspension breaks timers | Medium | `chrome.alarms` for every timer. No state in worker globals. This is a known trap for Pomodoro specifically |
| Maintenance load per new tool | Medium | Tier assignment and package assignment become part of the `add-tool` flow, and the shells mean most new tools need zero extension code. A new *engine* needs a shell decision, which mirrors the existing engine-selection judgment call |
| `keep-screen-awake` is worse as an extension | Low | Excluded. Wake Lock needs a visible document |
| Version scheme mismatch | Low | Web Store versions are numeric only, so `VERSION_CONFIG.status` is dropped and the fourth part comes from the ledger. Teach `version:bump` about the mapping so the two never diverge |
| Extension review turnaround blocks a coupled site release | Low | The site never depends on the extension. `ExtensionButton` renders only for packages with a `storeId` in the ledger |

---

## 11. Recommendation

1. **Do it.** The engines, the mobile-first design system, and the registry-derived build discipline
   mean roughly 70% of the work is already done. The reusable asset is the five-shell UI host, and it
   costs about 400 lines.
2. **Build the spike before committing.** One day proves the CSP and bundling story, which is the only
   genuinely uncertain part.
3. **Ten focused packages, published one at a time, hub last.** Minimal per-package permissions,
   per-listing review risk, and store-search match. Start with `toytools-jwt`: one tool, zero
   permissions, smallest possible first submission.
4. **Multi-package layout from day one.** A package is a `PackageDef` row, never a directory of code.
   Retrofitting this after the first listing is live means rewriting the build while shipping.
5. **Wait between submissions.** Roughly a review cycle plus a week. The waiting is what makes the
   sequence worth anything.
6. **Never claim one-click install.** Copy the button honestly: "Get the Chrome extension" going to
   the Web Store, flipping to a shortcut hint once detection says it is installed.
7. **Ship zero analytics in the extension**, consistent with the feedback system's no-third-party
   stance.
8. **Exclude the 14 simulations**, and gate the per-tool button on the ledger so the site never
   advertises an extension that is not live.

### Feeds back into the platform

Three items here are worth doing regardless of whether the extension ships:

- An `EXTENSION_ICON_SIZES` export gives the icon pipeline a second consumer, which validates that
  `tool-icon.ts` is genuinely size-independent.
- The five-contract table in section 4 is the clearest statement anyone has written of what the
  engine layer actually guarantees. It belongs in `ARCHITECTURE.md`.
- A `contextLabel` on `ToolConfig` ("Decode Base64" rather than "Base64 Encoder / Decoder") is
  useful for the site's own search and command surfaces too.
