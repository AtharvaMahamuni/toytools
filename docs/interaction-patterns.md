# Interaction patterns

A tool composes interaction that already exists. The job (`docs/tool-design.md`) decides which rows apply. A row with no job behind it stays off the page.

There is no `src/interaction-patterns/` directory. The names below are a vocabulary for agents. The implementation is the component, engine section, or platform helper in the right-hand column. Inventing a parallel component for one of these names is a layering error. A genuinely new primitive goes through `ui-design-system` and is added to this table in the same change.

| when the job needs | use |
|---|---|
| a live result while the person types | the engine widget for that engine. Calculators recompute through the experience renderer. Text tools recompute through the shared processor widget |
| the answer in one glance | `HeroMetric`, then the rest. On a phone the order is answer, input, actions (`CLAUDE.md`, widget UX) |
| a breakdown of the result | the calculator ledger (`ui-design-system` → "Calculator ledger"), or `InteractiveResult.metrics` rendered as the experience section `metrics`. Finance engines also return `breakdown` parts on that result (`src/lib/results/types.ts`) |
| a second case or a comparison | the experience section `comparison`. The engine returns the second case as data. There is no shared scenario-comparison widget to drop in |
| input beside output | two `IoPanel`s in `ToolSplit` |
| the formula or the method | `methodology` on the config when a published method is what the engine runs, `FormulaDef` on a simulation, or the experience section `explanation` |
| copy | `CopyButton`, `ToolActions`, or `ToyTools.copy` |
| a result that leaves the page as a link | `ToyTools.url`. Whether a tool may write the URL is decided in `src/lib/url-state.ts` (`auto`, `manual`, or `off`). Secrets and unbounded private text stay off the address bar |
| a file the person keeps | only when the job produces a file. There is no shared export widget. Add the smallest control that writes that file, through `ui-design-system` |
| a table the person edits | the csv engine and `CsvWidget` |
| a diff | the structured-compare and csv diff tools. A new diff joins that engine. It does not become a new diff framework |
| validation | the structured-validate pattern, or the engine's own error result. The widget shows the failure next to the input |
| a chart | `VizSpec` and `src/lib/visualization/`. On a calculator, set `capabilities.visualization` and return the spec (`ARCHITECTURE.md`). On a simulation, use the graph helpers under `src/lib/simulation/graphs/` |
| a slider | a simulation `ParamDef`, or a calculator range paired with the numeric field (`ARCHITECTURE.md`). A slider does not replace the number |
| play, pause, reset, timestep | `src/tools/_shared/SimulationWidget.astro` and `src/lib/simulation/boot.ts`. A new simulation supplies the model. It does not copy the loop |
| clear or start again | `ToolActions` clear, or the simulation reset |

Experience sections (`hero`, `visualization`, `metrics`, `comparison`, `explanation`, and the rest of `SectionId`) are data on the engine result. Engines reorder them with `layout`. The renderer is `src/components/experience/ExperienceRenderer.astro`. A calculator that needs a new section adds it to `SectionId` and the renderer once, then every engine can place it.

URL state, copy, and charts are platform behavior. A bespoke widget that reimplements them has drifted. Read `docs/code-map.json` for a sibling on the same engine before writing a control.
