// Experience renderer — the engine-agnostic function that turns an InteractiveResult into the standard
// experience hierarchy inside a pre-rendered shell (src/components/experience/ExperienceRenderer.astro).
//
// It manipulates a KNOWN static DOM (one [data-section] node per section) rather than building markup,
// so it stays small, framework-free, and accessible. It only fills text and toggles visibility; the
// section ORDER is data (the engine's `layout`), applied via CSS `order`. Wired onto ToyTools via the
// runtime so every interactive widget calls it with the same readiness guarantees as the engines.

import type {
  InteractiveResult,
  SectionId,
  ResultCard,
  Milestone,
  Insight,
  Assumption,
  Decision,
} from '@lib/results/types';

interface RenderOptions {
  /** Section order; defaults to the shell's data-layout, then DEFAULT_LAYOUT. */
  layout?: SectionId[];
}

function $(root: ParentNode, sel: string): HTMLElement | null {
  return root.querySelector(sel);
}

function setText(root: ParentNode, sel: string, text: string): void {
  const el = $(root, sel);
  if (el) el.textContent = text;
}

function show(section: HTMLElement | null, visible: boolean): void {
  if (section) section.hidden = !visible;
}

function clear(el: HTMLElement | null): void {
  if (el) while (el.firstChild) el.removeChild(el.firstChild);
}

function li(text: string, className?: string): HTMLLIElement {
  const el = document.createElement('li');
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

function statRow(label: string, value: string): HTMLDivElement {
  const row = document.createElement('div');
  row.className = 'tm-stat-row';
  const dt = document.createElement('dt');
  dt.className = 'tm-stat-label';
  dt.textContent = label;
  const dd = document.createElement('dd');
  dd.className = 'tm-stat-value';
  dd.textContent = value;
  row.append(dt, dd);
  return row;
}

function fillMetrics(root: ParentNode, metrics: ResultCard[]): boolean {
  const list = $(root, '[data-section="metrics"] .tm-stats') as HTMLElement | null;
  clear(list);
  if (!list) return false;
  const rows = metrics.filter((m) => m.emphasis !== 'hero');
  rows.forEach((m) => list.appendChild(statRow(m.label, m.value)));
  return rows.length > 0;
}

function fillList<T>(
  root: ParentNode,
  section: SectionId,
  items: T[] | undefined,
  toEl: (item: T) => HTMLElement,
): boolean {
  const sec = $(root, `[data-section="${section}"]`);
  const list = sec?.querySelector('[data-list]') as HTMLElement | null;
  clear(list);
  if (!list || !items || items.length === 0) {
    show(sec, false);
    return false;
  }
  items.forEach((it) => list.appendChild(toEl(it)));
  show(sec, true);
  return true;
}

function fillAssumptions(root: ParentNode, assumptions: Assumption[] | undefined): boolean {
  return fillList(root, 'assumptions', assumptions, (a: Assumption) => statRow(a.label, a.value));
}

function applyLayout(root: ParentNode, layout: SectionId[]): void {
  layout.forEach((id, idx) => {
    const sec = $(root, `[data-section="${id}"]`);
    if (sec) sec.style.order = String(idx);
  });
}

/**
 * Render `result` into the experience shell rooted at `root`. Never throws. Handles every UiState:
 * empty/error states blank the sections and show the hint; success fills each section that has data.
 */
export function renderExperience(
  root: HTMLElement,
  result: InteractiveResult,
  opts: RenderOptions = {},
): void {
  if (!root) return;
  const emptyEl = $(root, '[data-experience-empty]');
  const sectionsEl = $(root, '[data-experience-sections]');

  // Layout (section order) is data — engine override, else the shell default.
  let layout = opts.layout;
  if (!layout && root.dataset.layout) {
    try {
      layout = JSON.parse(root.dataset.layout) as SectionId[];
    } catch (_) {
      layout = undefined;
    }
  }
  if (layout) applyLayout(root, layout);

  // Empty / error: show the hint (with the error message when present), hide the result body.
  if (!result.ok) {
    if (emptyEl) {
      emptyEl.hidden = false;
      if (result.error) emptyEl.textContent = result.error;
      else if (root.dataset.emptyText) emptyEl.textContent = root.dataset.emptyText;
      emptyEl.dataset.state = result.uiState;
    }
    if (sectionsEl) sectionsEl.hidden = true;
    root.dataset.uiState = result.uiState;
    return;
  }

  root.dataset.uiState = 'success';
  if (emptyEl) emptyEl.hidden = true;
  if (sectionsEl) sectionsEl.hidden = false;

  // Hero.
  const heroSec = $(root, '[data-section="hero"]');
  if (result.hero) {
    setText(root, '[data-hero-value]', result.hero.value);
    setText(root, '[data-hero-label]', result.hero.label);
    setText(root, '[data-hero-note]', result.hero.note ?? '');
    const note = $(root, '[data-hero-note]');
    if (note) note.hidden = !result.hero.note;
    show(heroSec, true);
  } else {
    show(heroSec, false);
  }

  // Metrics.
  show($(root, '[data-section="metrics"]'), fillMetrics(root, result.metrics));

  // Milestones — "reached" gets a check.
  fillList(root, 'milestones', result.milestones, (m: Milestone) =>
    li((m.reached ? '✓ ' : '○ ') + m.label, m.reached ? 'milestone is-reached' : 'milestone'),
  );

  // Insights.
  fillList(root, 'insights', result.insights, (ins: Insight) =>
    li('💡 ' + ins.text, `insight insight--${ins.tone ?? 'info'}`),
  );

  // Assumptions (inside a disclosure in the shell).
  fillAssumptions(root, result.assumptions);

  // Explanation.
  const explainSec = $(root, '[data-section="explanation"]');
  if (result.explanation) {
    setText(root, '[data-explanation]', result.explanation);
    show(explainSec, true);
  } else {
    show(explainSec, false);
  }

  // Next questions.
  fillList(root, 'nextQuestions', result.nextQuestions, (q: string) => li(q, 'next-question'));

  // Decisions — render as links when an href is provided, else plain text.
  fillList(root, 'decisions', result.decisions, (d: Decision) => {
    const item = document.createElement('li');
    item.className = 'decision';
    if (d.href) {
      const a = document.createElement('a');
      a.href = d.href;
      a.textContent = d.label;
      item.appendChild(a);
    } else {
      item.textContent = d.label;
    }
    return item;
  });

  // Timeline — rendered as a simple disclosable list of points (a real chart is a reserved seam, but
  // the data is genuinely shown). Gated by the timeline capability.
  const timelineOn = root.dataset.capTimeline !== 'false';
  fillList(
    root,
    'timeline',
    timelineOn ? result.timeline : undefined,
    (p) => statRow(`Year ${p.year}`, p.display ?? String(p.value)),
  );

  // Comparison + visualization are reserved seams: the engine emits the DATA (VizSpec, comparisons)
  // for the future, but rendering is gated off by capability so nothing half-built shows in v1.
  const comparisonOn = root.dataset.capComparison === 'true';
  const visualizationOn = root.dataset.capVisualization === 'true';
  show($(root, '[data-section="comparison"]'), comparisonOn && !!(result.comparisons && result.comparisons.length));
  show($(root, '[data-section="visualization"]'), visualizationOn && !!result.visualization);
}
