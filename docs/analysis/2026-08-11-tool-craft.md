# Tool Craft: analysis (2026-08-11)

The 2026-08-08 identity phase gave every tool its own page. The tool leads, the platform signs, the
widget owns the first screen. What it deliberately did not touch is what the tool *does once you are
looking at it*, and that is where the catalog is thinnest.

The proposition here: **a ToyTools tool should know something about its own job that a sibling on the
same engine does not.** Base64 and Hex both convert text. Only one of them should know what
`data:image/png;base64,` is.

This document establishes what is true today (measured), defines what a "thoughtful touch" is
precisely enough that an agent can produce one and a gate can check it, sets the minimal-UI rules
that stop those touches accreting into clutter, and specifies the enforcement. The companion
playbook is `.claude/skills/tool-craft/SKILL.md`.

Baseline: **119 tools** (105 with a `Widget.astro`, 14 simulations), 20 engines, 13 shared widgets.

---

## 1. What was measured

A pass over every `src/tools/<segment>/<slug>/Widget.astro`, classifying each tool by whether it adds
anything at all on top of the shared engine widget it wraps: any child markup, any `<script>`, any
`<style>`. Not a quality judgement, just presence.

### 1.1 Three quarters of the catalog adds nothing

| | count |
|---|---|
| tools with a `Widget.astro` | 105 |
| bespoke widgets | 19 |
| shared-widget wrappers | 86 |
| **wrappers that are a self-closing tag and nothing else** | **80** |
| wrappers that add anything at all | 6 |

**80 of 105 tools (76%) are a single self-closing tag.** `base64-encoder-decoder`'s entire widget is
seven lines, six of which are the import and the frontmatter fence. So is `hex-encoder-decoder`'s. So
is `url-encoder-decoder`'s. The three pages differ by one `processorId` string.

### 1.2 It is uniform by engine, which is the tell

| shared widget | wrappers adding nothing |
|---|---|
| `TextProcessorWidget` | 18 / 18 |
| `ConverterWidget` | 13 / 13 |
| `WellnessWidget` | 11 / 11 |
| `FinanceWidget` | 8 / 8 |
| `StructuredDataWidget` | 7 / 7 |
| `DateTimeWidget` | 5 / 5 |
| `GeneratorWidget` | 5 / 5 |
| `CsvWidget` | 3 / 3 |
| `TrackerWidget` | 3 / 3 |
| `MathWidget` | 3 / 3 |
| `JwtWidget` | 1 / 1 |
| `TextMetricWidget` | 3 / 9 |

Eleven of the twelve shared widgets have a **perfect** record: not one tool on them has ever added a
single line for itself. Only `TextMetricWidget` breaks the pattern, and only because the text
counters were built before the engine was factored out.

### 1.3 The 25 tools that do add something are almost all bespoke

Of the 25 tools carrying any tool-specific code, **19 are bespoke widgets** (the design converters,
the number calculators, notepad, pomodoro, todo, find-replace, text-compare, json-tree-viewer) and
6 are the pre-existing text counters.

This is the actual finding, and it is not "the catalog is lazy":

> **Craft today is an accident of implementation route, not a design decision.** A tool has a
> thoughtful touch if and only if somebody happened to hand-build its widget. Nobody ever asked
> "what does *this* tool's user get stuck on?" and then acted on the answer. The question is not in
> the scaffold, not in `add-tool`, not in `tool-builder`, and not in any gate.

That also explains why the touches that do exist are uneven: `word-counter` has a word-goal progress
bar, a top-words chart, a stop-word filter and an insights drawer, while `line-counter` next door has
none of it, because one was written on a day someone felt generous and the other was not.

### 1.4 The engines are already richer than the tools

The important constraint on any fix. `ConverterWidget` is 368 lines and already gives all 13 of its
tools: direction auto-detect, a swap button, two-way editing, per-conversion validation with a
character position, a metadata row, session history, a sample loader, an educational insight block
and a technical-details drawer. `src/lib/engines/encoding/base64.ts` already implements `detect`,
`validate`, `meta`, `insight`, `technical` and `sample`.

So the catalog is not bare. It is **uniformly furnished**. Every tool on an engine gets exactly the
same good baseline, and no tool gets anything past it.

### 1.5 Where the baseline still fails, it fails specifically

Three inputs a real person pastes into `base64-encoder-decoder` today:

| pasted | what happens now | what should happen |
|---|---|---|
| `data:image/png;base64,iVBORw0KGgo=` | `✗ Unexpected character ":" near position 5` | recognise the data URI, offer to decode the payload |
| `eyJhbGciOiJIUzI1NiJ9-_w` (base64url) | `✗ Unexpected character "-" near position 17` | recognise base64url, offer to decode with `-_` mapped |
| `iVBORw0KGgo` (padding stripped) | `⚠ length should be a multiple of 4` | offer to re-pad and decode |

All three are *correct* diagnoses. All three are dead ends: the tool tells you what is wrong and
leaves you to fix it by hand, in the input box, on a phone. The validation layer knows enough to name
the problem and stops one step short of solving it.

That gap is the shape of the whole opportunity, and it generalises: **the baseline diagnoses, the
craft resolves.**

### 1.6 The clutter is real, and it is concentrated in exactly the tools that tried

Widget-level style rules that draw a filled, bordered card:

| | count |
|---|---|
| `border: 1px solid var(--color-border)` in tool widgets | 29 |
| `var(--color-surface-raised)` in tool widgets | 16 |

`word-counter` alone accounts for 8, `text-compare` 7, `find-replace` 6. The correlation is exact:
**the tools with craft are the tools with clutter**, because the only pattern anyone reached for when
adding something was "put it in a box". `word-counter` stacks a bordered goal card, a bordered
insights row and a rule-separated section on top of a widget that already has panels, and it hardcodes
`#d97706` for the near-goal state, which is a raw hex in a codebase whose stated rule is that every
colour comes from a token.

So a craft phase that is not also a restraint phase will make the catalog worse. That is why the
minimal-UI rules in section 4 are part of the same doctrine and the same gate, not a follow-up.

---

## 2. What "craft" means here

A definition tight enough to be actionable, and to refuse decoration:

> **A tool's craft is the one affordance that comes from knowing what this specific tool's users are
> actually doing, which its engine cannot know on their behalf.**

Four tests it must pass. All four, not three:

1. **Sibling test.** Would the tool next door on the same engine want it too? If yes, it is not craft,
   it is an engine feature, and it belongs in the shared widget where all 13 tools get it.
2. **Ten-second test.** Does it serve what the user does in the ten seconds *after* the output
   appears, or the ten seconds *before* they got a usable one? Craft lives at those two edges. A thing
   that makes the transform itself prettier is decoration.
3. **Failure test.** Can you name the specific, concrete way a real person fails at this tool today?
   If the answer is vague ("it could be more helpful"), there is no craft to add yet, and the honest
   move is to say so rather than invent one.
4. **Silence test.** When it is not needed, is it invisible? A craft affordance that occupies layout
   when it has nothing to say is a permanent cost paid for an occasional benefit.

### 2.1 The taxonomy: five kinds, and nothing else counts

Every legitimate touch found in the catalog, and every one worth adding, falls into one of five
categories. The closed list is the point: it is what stops an agent inventing a sixth called "make it
nicer".

| kind | the user problem | example |
|---|---|---|
| **Recovery** | their input is predictably the wrong shape, and the tool already knows why | base64 offers "decode as base64url" instead of just rejecting `-_` |
| **Verification** | their next move is "is this actually right?" | a hash tool takes an expected digest and says match / no match |
| **Continuation** | the real task does not end at the output | a JWT decoder showing how long until `exp` |
| **Guardrail** | a mistake here has real cost and is easy to make | a password generator excluding `0/O` and `1/l` when it will be typed by hand |
| **Orientation** | something true about their input they cannot see | a CSV tool naming the delimiter it detected |

**Recovery is the highest-value kind and the most under-used**, because the validation layer has
already done the diagnostic work on most engines. Anywhere a tool can currently say "that is wrong",
it is one small step from "that is wrong, and here is the fix, one tap".

### 2.2 One per tool, and that is a ceiling

A tool declares **exactly one** craft affordance. Not a minimum, a maximum.

The cap is doing real work. It forces the question "what is the *single* most valuable thing this
tool's users are missing", which has a defensible answer, instead of "what could we add", which has
an unbounded one. It is also the only durable defence of the byte budget and of section 4: five small
good ideas per tool across 119 tools is how a utility becomes a dashboard. `word-counter` accumulated
four and is the most cluttered page in the catalog, which is the evidence, not the theory.

To be precise about what the cap governs: it is a cap on what a tool **declares**, and on what new
work adds. It is not a demand that existing tools be stripped back to one affordance. Deleting
shipped functionality is a product decision, not a tidiness one, so the tools that accumulated
several keep them, declare the one that defines them, and get the section 4 treatment instead. The
declaration names the tool's identity; it does not inventory its features.

---

## 3. The method: how to analyse one tool

The order matters. Every step before the last is about the user, and the last one is the only one
about the UI. Doing it in the other order produces features looking for a problem.

1. **What does it solve?** One sentence, the job not the mechanism. Not "converts text to Base64" but
   "gets binary-unsafe data through a text-only channel".
2. **Who arrives here and from where?** A JWT decoder gets people debugging a 401. A tip calculator
   gets people at a table with the bill. Their context bounds what help is even possible.
3. **How is it solved elsewhere?** What the competent alternative does (the CLI, the IDE extension,
   the incumbent site) and, more usefully, what it does *badly*. `research/datasets/*.json` already
   records weak incumbents per tool.
4. **Where do they fail?** The concrete list. Wrong input shape, wrong direction, right answer they
   cannot trust, right answer they cannot use where it is going. Prefer failures the code can already
   detect, because those are one step from resolved.
5. **What is the single highest-value touch?** Pick one from the taxonomy. State the kind. Kill the
   rest, and write the killed ones into the doc so the next person does not re-derive them.
6. **What is the least UI that delivers it?** Section 4. This is where the restraint gets applied,
   after the value is settled, never as a substitute for settling it.

Worked example, `base64-encoder-decoder`, at each step: gets binary-unsafe data through a text-only
channel → reached by developers pasting a value out of a JSON payload, a JWT, a config file or a
browser devtools panel → the CLI `base64 -d` handles neither base64url nor data URIs and dies with
`invalid input` → they paste a real-world Base64 value and get a correct, useless rejection (1.5) →
**Recovery**, because the validator already localises the fault → one inline sentence offering the
fix, no panel, no box.

---

## 4. Minimal UI: the rules that keep the touch small

The stated goal is a page that reads as calm, not as a control panel. These are the rules; section 6
makes two of them enforceable.

**R1. Compose from what exists, add no new furniture.** `IoPanel`, `ToolActions`, `StatCard`,
`HeroMetric`, the status line and `<details>` already carry every shape a craft affordance needs. A
craft touch that needs a new visual component is nearly always a redesign in disguise.

**R2. No new boxes.** A craft affordance may not introduce a filled, bordered card. A page that
already has two panels does not need a third rectangle to hold one sentence. Prefer, in order: text
in a slot that exists, a line under the control it modifies, a `<details>` drawer, and only then
anything with an edge.

**R3. Silent until relevant.** Hidden by default, revealed by the condition that makes it useful, and
it must reveal without moving anything above it. The `hidden` attribute, never a `display` rule that
silently overrides it (`InstallButton` learned this the hard way).

**R4. Every value is a token.** No raw hex, no bare pixel values. `#d97706` in `word-counter` is a
bug, not a style choice.

**R5. One row, not one section.** The natural size of a craft affordance is a control plus a label,
inline. If it needs a heading, ask whether it is really one affordance.

**R6. It is a control, so it obeys the control rules.** 48px touch target, a visible `:active` state,
the right `inputmode`, no hover-only affordance, and it holds the fold ratchet: nothing may push the
first control further down the phone screen.

---

## 5. What this is not

- **Not a per-tool theme.** No colours, typefaces or marks per tool. That decision was made and
  holds (`2026-08-08`, T4/D11): the derived icon is the visual identity and it is free.
- **Not new bespoke widgets.** Rewriting 80 wrappers as bespoke widgets would delete the engine
  architecture, multiply the CSS on every page and blow the byte budget. Craft goes **through** the
  shared widget, as a declared seam the engine renders and the tool fills, which is why one seam in
  `ConverterWidget` gives 13 tools the mechanism and each processor supplies its own knowledge.
- **Not content.** Guides, FAQs and knowledge files are a separate, gated pipeline (`seo-content`).
  Craft is behaviour.
- **Not a licence to fill the cap.** A tool with no honest answer to test 3 declares no craft and
  waits. An invented touch is worse than an absent one, because it ships to every visitor forever.

---

## 6. Enforcement: why this needs a ratchet and not a paragraph

Every design rule this project has held in prose alone has drifted, and the record is unambiguous:
57% of descriptions broke their stated length ceiling, the tool header drew the one boundary the
recipe forbids, and the design skill described a palette that had been replaced. The identity phase
concluded that the deliverable was the fold ratchet rather than the redesign, and it was right.

So craft ships with a gate. Three parts, in `scripts/check-craft.ts` and `tests/e2e/craft.spec.ts`:

**Part 1: coverage, as a ratio that only rises.** `CRAFT_FLOOR` records the fraction of tools with a
declared craft. A **ratio** rather than a count, deliberately: adding a tool without craft lowers the
fraction and fails the gate, so the rule "every new tool ships a thoughtful touch" enforces itself
without anyone maintaining a list of which tools are new.

**Part 2: the declaration must be real.** A tool declaring `craft.id` whose built page contains no
`[data-craft="<id>"]` fails the build. This is what stops the field becoming documentation that rots:
the prose in `config.ts` and the element in the DOM cannot drift apart.

**Part 3: it works on a phone.** `tests/e2e/craft.spec.ts` asserts on Pixel 5 that every declared
craft element is present, and that if it is a control it meets the 48px touch target. A touch that
only works on a laptop is not shipped in a phone-first catalog.

Plus a fourth, guarding section 4: **the clutter ratchet.** The count of box-drawing declarations and
raw hex values across tool widgets is recorded and may only fall. It is what makes R2 and R4 real, and
it means the craft phase cannot pay for its additions in visual noise.

### 6.1 What the gate cannot do

It cannot tell a thoughtful touch from a thoughtless one. It checks that a declaration exists, that it
renders, that it works on a phone, and that it did not cost a box. Whether the touch is *worth* having
is a judgement, and it stays with the skill, the agent's analysis and the reviewer. Claiming otherwise
would be the failure mode this doc is arguing against.

---

## 7. Pilots shipped with this phase

The mechanism is proved on the engine with the most tools and the clearest failure (1.5), plus the
declutter on the worst offender:

1. **A `recover` verb in the transform contract.** `TransformProvider` gains an optional
   `recover(id, mode, input)` returning `{ label, text }` or null. `ConverterWidget` renders the
   offer as one inline line with a single button, hidden until a recovery exists. One seam, 13 tools.
2. **Per-processor recoveries**, which is where the domain knowledge lives and where the tools stop
   being interchangeable: base64 (data URI, base64url, stripped padding) and url (double-encoded,
   a stray `%` from prose, `+` as space).

   **Hex deliberately ships none**, and that is the doctrine working rather than a gap. Its decode
   is already tolerant of `0x` prefixes and separators, so the only remaining dead end is an
   odd-length string, and nothing can honestly say which end lost a nibble. Test 3 in section 2
   fails, so nothing is shipped. `encodingInfo('hex').recoverable` is `false` and the affordance
   does not render on the page at all, which costs that tool exactly nothing.

   Every offer is gated on actually producing sensible output: the repair is attempted and the
   result must be mostly printable text. Without that gate, `Helloo` fits the Base64 alphabet, has
   a paddable length, and would earn an offer to decode it into mojibake. This is also why an image
   data URI is declined: its payload is binary and a text tool has nothing useful to show.
3. **`word-counter` decluttered**, as the minimal-UI half: the bordered goal card and the three
   bordered insight tiles become inline rows, and the hardcoded `#d97706` "nearly at goal" state is
   removed rather than retinted, because the palette has no warning token and the filled progress
   bar already showed proximity. Its word goal is declared as its craft (kind: verification), which
   is the one of its four affordances that passes all four tests in section 2. The other three are
   left in place: see 2.2 on why the cap is not a mandate to delete.

Everything else is backlog, and it is deliberately not attempted here. 105 tools of craft is a
programme, not a commit, and the ratchet is what makes it land incrementally without regressing.

---

## 8. Backlog, ranked by the failure they resolve

Written down so the next pass starts from evidence rather than from a blank page. Each names the kind
and the concrete failure, per section 3 step 4.

| tool(s) | kind | the failure |
|---|---|---|
| `json-formatter`, `json-validator` | Recovery | a syntax error names a character offset the user must count to by hand |
| `json-formatter` | Recovery | trailing commas and smart quotes pasted from a doc are the two most common causes, and both are mechanically fixable |
| hash generators (5) | Verification | the user has a digest from somewhere else and is comparing 64 hex characters by eye |
| `jwt-decoder` | Continuation | `exp` and `iat` render as Unix integers when the actual question is "is this expired" |
| `password-generator` | Guardrail | a generated password containing `0`/`O` or `1`/`l` that will be typed by hand or read aloud |
| `timezone-converter` | Continuation | the real question is whether the converted time is a reasonable hour to call |
| CSV tools (5) | Orientation | a semicolon-delimited European export parsed as one column, silently |
| `color-contrast-checker` | Continuation | it says "fails AA" and stops, when the next step is always "so what colour passes" |
| text counters (6) | Verification | a limit that matters (tweet, meta description, SMS segment) is a number the user holds in their head |
| `cron-expression-parser` | Verification | "does this fire when I think it does" is answered by seeing the next few fire times |

---

## 9. Summary

Three quarters of the catalog is a single self-closing tag, and craft correlates exactly with whether
somebody hand-built the widget rather than with whether anybody thought about the user. The engines
are good and uniform; that is the achievement and also the ceiling, because a tool that gets only
what its engine gives everyone has no reason to be preferred over its sibling.

The gap is narrow and specific where it matters most: on the encoding engine, the validation layer
already localises the exact fault and then stops, leaving a correct rejection where a one-tap fix
belongs. The baseline diagnoses; the craft resolves. That pattern is worth generalising, and the
five-kind taxonomy is what keeps it from generalising into decoration.

The part worth insisting on, again, is the enforcement. A craft ratio that only rises makes every
future tool carry a thoughtful touch without anyone policing it, and a clutter ratchet that only falls
means the catalog cannot buy that craft with boxes. Both are the same idiom this project already uses
for bytes, folds and query targeting, and it is the only kind of rule that has survived here.

Playbook: `.claude/skills/tool-craft/SKILL.md`. Agent: `.claude/agents/tool-crafter.md`.

---

## 10. Survey of the remaining backlog (2026-08-17)

Taken after coverage reached 26/107, because three seams in a row had the same surprise: roughly
half of what looked like new work was already built and merely undeclared. This replaces guessing
about the ceiling with a measurement.

**Method.** For each of the 81 undeclared tools: does its own `Widget.astro` contain a `<section>`
or `<h2>` *and* a `hidden` attribute? That pair is the signature of a bespoke,
silent-until-warranted affordance. Everything else splits on widget size, since a wrapper under
900 bytes is a pure engine delegate.

| class | n | meaning |
|---|---|---|
| **A. already built, undeclared** | 5 | `find-replace`, `json-tree-viewer`, `notepad`, `scientific-calculator`, `todo-list` |
| **B. bespoke, no hidden affordance** | 13 | per-tool judgment; `units` 3, `calculator` 6, `color` 1, `productivity` 2, `text-interactive` 1 |
| **C. thin wrapper over a shared widget** | 63 | seam work, and where all the leverage is |

Class C by engine, which is the actual work plan:

| engine | tools |
|---|---|
| `text-processor` | 18 |
| `wellness` | 11 |
| `finance` | 8 |
| `encoding` | 6 |
| `datetime` | 5 |
| `generation` | 4 |
| `tracker` | 3 |
| `math` | 3 |
| `csv` | 3 |
| `structured-data` | 2 |

### What this says about the ceiling

**Roughly ten more engine seams would reach 63 tools**, plus 5 declarations, which puts most of the
catalog in range. That is a much better position than the "40 to 50 have a real failure" estimate
that preceded it, and the estimate was wrong for a specific reason worth recording: it was made by
reasoning about tools rather than reading their knowledge files. **Every one of the 81 has at least
two documented `commonMistakes`**, and on the two tools singled out as hopeless (`space-counter`,
`letter-counter`) the recorded mistake turned out to be exactly the detectable failure the touch
needed.

### What it does not say

It does not say 107/107 is reachable, and the number should never be the goal. Coverage is a ratio
so that a *new* tool cannot ship craftless; it was never meant as a target to fill. The gate cannot
tell a thoughtful touch from a thoughtless one, so 107/107 is trivially reachable by inventing 81
affordances and would be worth less than 26/107 honestly earned. The rule stands: a tool with no
honest answer to the failure test declares nothing and waits.

The three seams shipped so far each took one engine verb plus one shared component, and each was
smaller than the per-tool work it replaced. That is the only pattern here that has scaled.

## 11. Class B, closed (2026-08-18)

The 13 bespoke widgets from section 10, worked through in one batch. **12 shipped a touch, 1
deliberately did not**, and coverage moved 26/107 → 38/107.

The measurement that mattered: **11 of the 13 touches came straight out of the tool's own
`knowledge.ts`.** Every one of these tools already had its failure written down, by someone doing
content research, and nobody had read those files while thinking about behaviour. That is the same
surprise as section 10 in a different form, and it is now the standing first step in the skill.

| tool | kind | the failure, in one line |
|---|---|---|
| `tax-calculator` | orientation | subtracting the rate to back tax out of a total |
| `percentage-calculator` | orientation | percentage change read as percentage points |
| `margin-calculator` | guardrail | a loss printed as a percentage, which reads like a margin |
| `markup-calculator` | guardrail | the same |
| `tip-calculator` | continuation | the output stops one step before the number you write down |
| `discount-calculator` | continuation | "30% off, extra 20%" added instead of multiplied |
| `aspect-ratio-calculator` | guardrail | an exact pair the encoder refuses for being odd |
| `px-to-dp-converter` | orientation | a dp value that is half a pixel at ldpi and hdpi |
| `px-to-rem-converter` | orientation | em converted against the root, then nested |
| `color-format-converter` | orientation | 8-digit hex: CSS and Android disagree about byte order |
| `text-compare` | recovery | a CRLF file against an LF file, every line red |
| `keep-screen-awake` | recovery | **declared, not built** — already shipped, never declared |
| `pomodoro-timer` | — | **nothing.** See below. |

### The one that got nothing

`pomodoro-timer`'s three documented mistakes are *skipping breaks*, *checking messages* and
*starting without a clear objective*. All three are behavioural; none is detectable from what the
widget can see, and the widget has no skip control from which to infer the first. The available
options were to invent an affordance or to ship nothing, and the doctrine has one answer to that.

It stays on the backlog with the reason written down, which is the difference between a gap and an
oversight.

### What this changed about the estimate

Two of the three groups turned out smaller than "13 bespoke widgets" suggested, because the six
calculators shared one seam and the three unit converters shared another. **Two engine runtimes and
one shared component covered nine of the twelve.** `calculator` had no browser runtime at all before
this and now has one, which is what let those six rules be unit tested rather than copied into six
inline scripts. That trade is worth restating: **a seam is cheaper than the touches it replaces even
at n = 3.**

The remaining backlog is now **69 tools: 63 class C thin wrappers across ten engine seams, 5 class A
already-built declarations, and `pomodoro-timer`.** The class C figure is the one worth acting on,
and section 10's table is still the work plan.
