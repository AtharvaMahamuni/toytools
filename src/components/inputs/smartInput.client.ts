// Smart-input client behaviour — one bundled module that enhances every [data-smart-input] control on
// the page exactly once. Engine-agnostic: it works for any tool that renders SmartInput components.
//
// What it adds to a numeric control:
//  - increment / decrement buttons using an adaptive step (or the field's fixed step)
//  - keyboard ArrowUp / ArrowDown stepping
//  - natural-number parsing on commit ("10k", "2 lakh", "₹25,000", "7.5%")
//  - grouped display formatting on blur, while keeping the canonical number in `data-raw`
//  - touch-hold repeat on the +/- buttons
//
// The canonical numeric value lives in `data-raw`; the visible field shows a formatted label. Consumers
// (e.g. FinanceWidget) read `data-raw`. Every commit dispatches a bubbling `change` so the widget
// recomputes. With JS disabled the control degrades to a plain typed number input.

import { parseHumanNumber } from '@lib/inputs/parse';
import { formatGrouped } from '@lib/inputs/format';
import { adaptiveStep } from '@lib/inputs/step';

interface FieldEls {
  field: HTMLInputElement;
}

const ENHANCED = new WeakSet<HTMLElement>();

function clampToBounds(field: HTMLInputElement, n: number): number {
  const min = field.dataset.min !== undefined ? Number(field.dataset.min) : undefined;
  const max = field.dataset.max !== undefined ? Number(field.dataset.max) : undefined;
  let v = n;
  if (min !== undefined && Number.isFinite(min)) v = Math.max(min, v);
  if (max !== undefined && Number.isFinite(max)) v = Math.min(max, v);
  return v;
}

function stepFor(field: HTMLInputElement, current: number): number {
  if (field.dataset.step) {
    const s = Number(field.dataset.step);
    if (Number.isFinite(s) && s > 0) return s;
  }
  return adaptiveStep(current);
}

function rawOf(field: HTMLInputElement): number {
  const parsed = parseHumanNumber(field.value);
  if (parsed !== null) return parsed;
  const fallback = Number(field.dataset.raw);
  return Number.isFinite(fallback) ? fallback : 0;
}

function displayFor(field: HTMLInputElement, n: number): string {
  const type = field.dataset.fieldType;
  if (type === 'integer') return String(Math.round(n));
  // Group money/number; leave percent/duration as a plain number so the suffix reads naturally.
  if (type === 'currency' || type === 'number') return formatGrouped(n, { maximumFractionDigits: 2 });
  // strip trailing .0 noise
  return String(Number(n.toFixed(4)));
}

function commit(field: HTMLInputElement, n: number, reformat: boolean): void {
  const bounded = clampToBounds(field, n);
  field.dataset.raw = String(bounded);
  if (reformat) field.value = displayFor(field, bounded);
  field.dispatchEvent(new Event('change', { bubbles: true }));
}

// Native string controls (date / datetime-local / free text) render as [data-smart-input] inputs too,
// but must NOT get numeric stepping or human-number parsing — their value is the raw string.
const NON_NUMERIC_INPUT_TYPES = new Set(['date', 'datetime', 'text', 'select']);

function enhance(field: HTMLInputElement): void {
  if (ENHANCED.has(field)) return;
  if (NON_NUMERIC_INPUT_TYPES.has(field.dataset.fieldType ?? '')) return;
  ENHANCED.add(field);

  // Seed data-raw from the initial value.
  if (field.dataset.raw === undefined || field.dataset.raw === '') {
    const seed = parseHumanNumber(field.value);
    field.dataset.raw = seed !== null ? String(seed) : '';
  }

  // While typing: keep data-raw live (no reformat, so the caret is not disturbed).
  field.addEventListener('input', () => {
    if (field.value.trim() === '') {
      field.dataset.raw = '';
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    const parsed = parseHumanNumber(field.value);
    if (parsed !== null) {
      field.dataset.raw = String(parsed);
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // On blur: normalise the display (grouping / magnitude expansion).
  field.addEventListener('blur', () => {
    if (field.value.trim() === '') return;
    commit(field, rawOf(field), true);
  });

  // Keyboard stepping.
  field.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const current = rawOf(field);
    const delta = stepFor(field, current) * (e.key === 'ArrowUp' ? 1 : -1);
    commit(field, current + delta, true);
  });

  // Wire the −/+ buttons that share this control's wrapper.
  const wrapper = field.closest('[data-smart-input]');
  if (!wrapper) return;
  wrapper.querySelectorAll<HTMLButtonElement>('[data-step-dir]').forEach((btn) => {
    const dir = btn.dataset.stepDir === 'down' ? -1 : 1;

    const bump = () => {
      const current = rawOf(field);
      commit(field, current + stepFor(field, current) * dir, true);
    };

    // Click + touch-hold repeat.
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let repeatTimer: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (holdTimer) clearTimeout(holdTimer);
      if (repeatTimer) clearInterval(repeatTimer);
      holdTimer = repeatTimer = undefined;
    };
    btn.addEventListener('click', bump);
    btn.addEventListener('pointerdown', () => {
      holdTimer = setTimeout(() => {
        repeatTimer = setInterval(bump, 90);
      }, 400);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) =>
      btn.addEventListener(ev, stop),
    );
  });
}

/**
 * Segmented control: pills drive a hidden input that stays the single source of truth.
 *
 * The `value` property is redefined on the instance so that ANY assignment (a widget's setField, a
 * reset, a loaded example, a profile prefill) repaints the pills. Without that, every one of those
 * paths would need to know this control exists.
 */
function enhanceSegmented(group: HTMLElement): void {
  if (ENHANCED.has(group)) return;
  const input = group.querySelector<HTMLInputElement>('input[data-field-id]');
  if (!input) return;
  ENHANCED.add(group);

  const pills = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-segment-value]'));
  const paint = () => {
    pills.forEach((p) => p.setAttribute('aria-checked', p.dataset.segmentValue === input.value ? 'true' : 'false'));
  };

  const nativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  if (nativeValue?.get && nativeValue?.set) {
    Object.defineProperty(input, 'value', {
      configurable: true,
      get() { return nativeValue.get!.call(input); },
      set(v: string) { nativeValue.set!.call(input, v); paint(); },
    });
  }

  pills.forEach((pill, i) => {
    pill.addEventListener('click', () => {
      input.value = pill.dataset.segmentValue ?? '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // Arrow keys move between options, as a radiogroup should.
    pill.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = pills[(i + dir + pills.length) % pills.length];
      next.focus();
      next.click();
    });
  });

  paint();
}

/**
 * Slider: a range control paired with the numeric input, syncing both ways. The numeric input stays
 * canonical, so nothing downstream reads the slider.
 */
function enhanceSlider(range: HTMLInputElement): void {
  if (ENHANCED.has(range)) return;
  const wrapper = range.closest('[data-smart-input]');
  const field = wrapper?.querySelector<HTMLInputElement>('input[data-field-id]');
  if (!field) return;
  ENHANCED.add(range);

  range.addEventListener('input', () => {
    commit(field, Number(range.value), true);
  });

  // Follow the numeric input when it changes by any other route (typing, steppers, prefill).
  field.addEventListener('change', () => {
    const raw = rawOf(field);
    if (Number.isFinite(raw)) range.value = String(raw);
  });

  const seed = rawOf(field);
  if (Number.isFinite(seed)) range.value = String(seed);
}

function initAll(): void {
  document
    .querySelectorAll<HTMLInputElement>('[data-smart-input] input[data-field-id]')
    .forEach((el) => enhance(el));
  document.querySelectorAll<HTMLElement>('[data-smart-input] .smart-segmented').forEach((el) => enhanceSegmented(el));
  document.querySelectorAll<HTMLInputElement>('[data-smart-input] .smart-slider').forEach((el) => enhanceSlider(el));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
}

export { initAll, enhance };
export type { FieldEls };
