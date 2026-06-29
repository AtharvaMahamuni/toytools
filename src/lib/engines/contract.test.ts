// Engine contract tests — registry-driven, so every tool is covered automatically as the
// catalog grows. Rather than testing one tool at a time, these assert that EVERY member of an
// engine family satisfies that engine's contract: the metadata resolves, a knowledge file exists,
// and the engine actually produces sensible output for the tool's processor. This is what stops
// engines drifting apart as they scale toward thousands of tools.

import { describe, it, expect } from 'vitest';
import { tools } from '@data/registry';
import { getEngine } from '@data/engines';
import { KNOWLEDGE } from '@lib/knowledge/registry';
import { PROCESSORS } from '@lib/text/processors/registry';
import { ENCODERS } from '@lib/engines/encoding/registry';
import { HASHERS, runHash } from '@lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '@lib/engines/structured-data/registry';
import { JWT_TOOLS } from '@lib/engines/jwt/registry';
import { FINANCE_CALCULATORS, financeFields } from '@lib/engines/finance/registry';

const byEngine = (id: string) => tools.filter(t => t.engine === id);

// ── Universal contract: every tool, regardless of engine ─────────────────────────────────────
describe('every tool', () => {
  it.each(tools.map(t => [t.slug, t] as const))('%s satisfies the platform contract', (_slug, t) => {
    expect(t.name, 'name').toBeTruthy();
    expect(t.description, 'description').toBeTruthy();
    expect(t.categorySlug, 'categorySlug').toBeTruthy();
    const engine = getEngine(t.engine!);
    expect(engine, `engine "${t.engine}" is registered`).toBeDefined();
    expect(engine!.patterns, `pattern "${t.pattern}" owned by engine`).toContain(t.pattern);
    expect(KNOWLEDGE.has(t.slug), 'has a knowledge file').toBe(true);
  });
});

// ── text-processor: process(text) is a pure string→string transform ──────────────────────────
describe('text-processor engine', () => {
  it.each(byEngine('text-processor').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a processor that returns a string',
    (_slug, processorId) => {
      const proc = PROCESSORS[processorId!];
      expect(proc, `processor "${processorId}" registered`).toBeDefined();
      expect(typeof proc.process('Hello World 123')).toBe('string');
      expect(proc.process('')).toBe(''); // empty in → empty out
    },
  );
});

// ── encoding: encode/decode round-trips losslessly ───────────────────────────────────────────
describe('encoding engine', () => {
  const sample = 'Hello, World! <tag> & "quote" 123';
  it.each(byEngine('encoding').map(t => [t.slug, t.processorId] as const))(
    '%s round-trips through encode → decode',
    (_slug, processorId) => {
      const enc = ENCODERS[processorId!];
      expect(enc, `encoder "${processorId}" registered`).toBeDefined();
      expect(enc.decode(enc.encode(sample))).toBe(sample);
    },
  );
});

// ── hashing: produces a lowercase-hex digest of the declared width ───────────────────────────
describe('hashing engine', () => {
  it.each(byEngine('hashing').map(t => [t.slug, t.processorId] as const))(
    '%s returns a hex digest of the expected length',
    async (_slug, processorId) => {
      const hasher = HASHERS[processorId!];
      expect(hasher, `hasher "${processorId}" registered`).toBeDefined();
      const digest = await runHash(processorId!, 'abc');
      expect(digest).toMatch(/^[0-9a-f]+$/);
      if (hasher.bits) expect(digest).toHaveLength(hasher.bits / 4);
    },
  );
});

// ── structured-data: every tool exposes an execute() ─────────────────────────────────────────
describe('structured-data engine', () => {
  it.each(byEngine('structured-data').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a tool with an execute()',
    (_slug, processorId) => {
      const tool = STRUCTURED_TOOLS[processorId!];
      expect(tool, `structured tool "${processorId}" registered`).toBeDefined();
      expect(typeof tool.execute).toBe('function');
    },
  );
});

// ── finance: every tool resolves a calculator with a calculate() and renderable fields ─────────
describe('finance engine', () => {
  it.each(byEngine('finance').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a calculator with calculate() and fields',
    (_slug, processorId) => {
      const calc = FINANCE_CALCULATORS[processorId!];
      expect(calc, `finance calculator "${processorId}" registered`).toBeDefined();
      expect(typeof calc.calculate).toBe('function');
      expect(financeFields(processorId!).length).toBeGreaterThan(0);
    },
  );
});

// ── jwt ──────────────────────────────────────────────────────────────────────────────────────
describe('jwt engine', () => {
  it.each(byEngine('jwt').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a jwt tool with a decode()',
    (_slug, processorId) => {
      const tool = JWT_TOOLS[processorId!];
      expect(tool, `jwt tool "${processorId}" registered`).toBeDefined();
      expect(typeof tool.decode).toBe('function');
    },
  );
});
