// Pins the derived `embeddable` flag (C3): false for exactly the six heavy-coupling widgets named in
// the Tool Render Unit contract, true for every other tool, simulations included.
import { describe, it, expect } from 'vitest';
import { tools, embeddable } from './registry';
import { NOT_EMBEDDABLE, isEmbeddable } from './embeddable';

const HEAVY = [
  'book-tracker',
  'habit-streak-tracker',
  'json-tree-viewer',
  'keep-screen-awake',
  'pomodoro-timer',
  'todo-list',
];

describe('embeddable registry flag', () => {
  it('declares exactly the six heavy-coupling tools not embeddable', () => {
    expect(Object.keys(NOT_EMBEDDABLE).sort()).toEqual(HEAVY);
  });

  it('names only real registry slugs', () => {
    const slugs = new Set(tools.map((t) => t.slug));
    for (const slug of HEAVY) expect(slugs.has(slug), slug).toBe(true);
  });

  it('derives a flag for every tool: false for the six, true for the rest', () => {
    expect(embeddable.size).toBe(tools.length);
    const off = tools.filter((t) => !embeddable.get(t.slug)).map((t) => t.slug).sort();
    expect(off).toEqual(HEAVY);
    for (const t of tools) expect(embeddable.get(t.slug)).toBe(isEmbeddable(t));
  });

  it('is by slug, not by category: notepad is productivity and stays embeddable', () => {
    const notepad = tools.find((t) => t.slug === 'notepad');
    expect(notepad?.categorySlug).toBe('productivity');
    expect(embeddable.get('notepad')).toBe(true);
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
