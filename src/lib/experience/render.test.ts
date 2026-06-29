// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderExperience } from './render';
import { successResult, card } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';

// Minimal copy of the ExperienceRenderer.astro shell so the renderer has its known DOM to fill.
function shell(layout?: string): HTMLElement {
  const root = document.createElement('div');
  root.setAttribute('data-experience', '');
  root.dataset.emptyText = 'Enter values';
  if (layout) root.dataset.layout = layout;
  root.innerHTML = `
    <p data-experience-empty>Enter values</p>
    <div data-experience-sections hidden>
      <div class="tm-hero" data-section="hero" role="status" aria-live="polite" hidden>
        <span data-hero-value>0</span><span data-hero-label></span><p data-hero-note hidden></p>
      </div>
      <div data-section="metrics" hidden><dl class="tm-stats"></dl></div>
      <div data-section="visualization" hidden></div>
      <details data-section="timeline" hidden><summary>Timeline</summary><dl data-list></dl></details>
      <div data-section="milestones" hidden><ul data-list></ul></div>
      <div data-section="insights" hidden><ul data-list></ul></div>
      <div data-section="comparison" hidden></div>
      <details data-section="assumptions" hidden><summary>Assumptions</summary><dl data-list></dl></details>
      <div data-section="explanation" hidden><p data-explanation></p></div>
      <div data-section="nextQuestions" hidden><ul data-list></ul></div>
      <div data-section="decisions" hidden><ul data-list></ul></div>
    </div>`;
  document.body.appendChild(root);
  return root;
}

const fullResult = (): InteractiveResult =>
  successResult({
    hero: card('h', 'Final amount', '$1,100', { raw: 1100, emphasis: 'hero', note: 'after 1 year' }),
    metrics: [card('m1', 'Interest', '$100', { raw: 100, emphasis: 'primary' })],
    insights: [{ id: 'i1', text: 'Compounding helps', tone: 'positive' }],
    milestones: [{ id: 'ms1', label: 'Doubled', reached: false }, { id: 'ms2', label: 'Grew', reached: true }],
    timeline: [{ year: 0, value: 1000, display: '$1,000' }, { year: 1, value: 1100, display: '$1,100' }],
    assumptions: [{ id: 'a1', label: 'Rate', value: '7%' }],
    explanation: 'It grows.',
    nextQuestions: ['What about inflation?'],
    decisions: [{ id: 'd1', label: 'Check inflation', href: '/tool/finance/inflation-calculator/' }, { id: 'd2', label: 'No link' }],
  });

describe('renderExperience', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('does nothing on a null root', () => {
    expect(() => renderExperience(null as unknown as HTMLElement, fullResult())).not.toThrow();
  });

  it('shows the empty state and hides the body for an empty result', () => {
    const root = shell();
    renderExperience(root, { ok: false, uiState: 'empty', metrics: [] });
    expect(root.dataset.uiState).toBe('empty');
    expect(root.querySelector('[data-experience-empty]')!.hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('[data-experience-sections]')!.hasAttribute('hidden')).toBe(true);
  });

  it('shows the error message for a validation error', () => {
    const root = shell();
    renderExperience(root, { ok: false, uiState: 'validation-error', error: 'Enter a principal', metrics: [] });
    expect(root.dataset.uiState).toBe('validation-error');
    expect(root.querySelector('[data-experience-empty]')!.textContent).toBe('Enter a principal');
  });

  it('fills the full hierarchy on success', () => {
    const root = shell();
    renderExperience(root, fullResult());
    expect(root.dataset.uiState).toBe('success');
    expect(root.querySelector('[data-hero-value]')!.textContent).toBe('$1,100');
    expect(root.querySelector('[data-hero-note]')!.textContent).toBe('after 1 year');
    // metrics: hero is excluded, one primary row remains
    expect(root.querySelectorAll('[data-section="metrics"] .tm-stat-row').length).toBe(1);
    // milestones: reached gets a check, unreached a circle
    const ms = root.querySelectorAll('[data-section="milestones"] li');
    expect(ms[0].textContent).toContain('○');
    expect(ms[1].textContent).toContain('✓');
    expect((ms[1] as HTMLElement).className).toContain('is-reached');
    // insights tone class
    expect(root.querySelector('[data-section="insights"] li')!.className).toContain('insight--positive');
    // timeline rows
    expect(root.querySelectorAll('[data-section="timeline"] .tm-stat-row').length).toBe(2);
    // decisions: first is a link, second plain text
    const decs = root.querySelectorAll('[data-section="decisions"] li');
    expect(decs[0].querySelector('a')!.getAttribute('href')).toBe('/tool/finance/inflation-calculator/');
    expect(decs[1].querySelector('a')).toBeNull();
    // explanation + next questions
    expect(root.querySelector('[data-explanation]')!.textContent).toBe('It grows.');
    expect(root.querySelectorAll('[data-section="nextQuestions"] li').length).toBe(1);
  });

  it('keeps aria-live on the hero only (no spam on metric rebuilds)', () => {
    const root = shell();
    renderExperience(root, fullResult());
    // the hero is a polite live region so the answer is announced
    const hero = root.querySelector('[data-section="hero"]')!;
    expect(hero.getAttribute('aria-live')).toBe('polite');
    // metrics are NOT a live region (would re-announce every list on each keystroke)
    const metrics = root.querySelector('[data-section="metrics"] .tm-stats')!;
    expect(metrics.getAttribute('aria-live')).not.toBe('polite');
  });

  it('applies a custom section order via data-layout', () => {
    const root = shell(JSON.stringify(['insights', 'hero', 'metrics']));
    renderExperience(root, fullResult());
    const hero = root.querySelector('[data-section="hero"]') as HTMLElement;
    const insights = root.querySelector('[data-section="insights"]') as HTMLElement;
    expect(Number(insights.style.order)).toBeLessThan(Number(hero.style.order));
  });

  it('hides reserved sections (visualization/comparison) unless their capability is on', () => {
    const root = shell();
    root.dataset.capVisualization = 'false';
    renderExperience(root, { ...fullResult(), visualization: { kind: 'line', data: {} } });
    expect(root.querySelector('[data-section="visualization"]')!.hasAttribute('hidden')).toBe(true);
  });

  it('hides hero and empties lists when data is absent', () => {
    const root = shell();
    renderExperience(root, successResult({ metrics: [] }));
    expect(root.querySelector('[data-section="hero"]')!.hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('[data-section="insights"]')!.hasAttribute('hidden')).toBe(true);
  });
});
