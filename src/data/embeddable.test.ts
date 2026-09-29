// Pins the derived `embeddable` flag (C3): false for exactly the seven page-only tools named in the
// Tool Render Unit contract (the productivity category plus json-tree-viewer), true for every other
// tool, simulations included.
import { describe, it, expect } from 'vitest';
import { tools, embeddable } from './registry';
import { NOT_EMBEDDABLE, isEmbeddable } from './embeddable';

const PAGE_ONLY = [
  'book-tracker',
  'habit-streak-tracker',
  'json-tree-viewer',
  'keep-screen-awake',
  'notepad',
  'pomodoro-timer',
  'todo-list',
];

describe('embeddable registry flag', () => {
  it('declares exactly the seven page-only tools not embeddable', () => {
    expect(Object.keys(NOT_EMBEDDABLE).sort()).toEqual(PAGE_ONLY);
  });

  it('names only real registry slugs', () => {
    const slugs = new Set(tools.map((t) => t.slug));
    for (const slug of PAGE_ONLY) expect(slugs.has(slug), slug).toBe(true);
  });

  it('derives a flag for every tool: false for the seven, true for the rest', () => {
    expect(embeddable.size).toBe(tools.length);
    const off = tools.filter((t) => !embeddable.get(t.slug)).map((t) => t.slug).sort();
    expect(off).toEqual(PAGE_ONLY);
    for (const t of tools) expect(embeddable.get(t.slug)).toBe(isEmbeddable(t));
  });

  it('is the productivity category plus json-tree-viewer, notepad included', () => {
    const productivity = tools.filter((t) => t.categorySlug === 'productivity').map((t) => t.slug);
    expect([...productivity, 'json-tree-viewer'].sort()).toEqual(PAGE_ONLY);
    expect(embeddable.get('notepad')).toBe(false);
  });

  it('gives every page-only tool a reason', () => {
    for (const [slug, reason] of Object.entries(NOT_EMBEDDABLE)) expect(reason.length, slug).toBeGreaterThan(10);
  });

  it('keeps every simulation embeddable', () => {
    const sims = tools.filter((t) => t.engine === 'physics' || t.engine === 'math-lab' || t.engine === 'chemistry');
    expect(sims.length).toBeGreaterThan(0);
    for (const t of sims) expect(embeddable.get(t.slug), t.slug).toBe(true);
  });

  it('writes nothing into the tool configs', () => {
    for (const t of tools) expect(Object.prototype.hasOwnProperty.call(t, 'embeddable')).toBe(false);
  });
});
