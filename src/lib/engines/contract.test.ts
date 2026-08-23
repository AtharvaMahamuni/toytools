// Engine contract tests — registry-driven, so every tool is covered automatically as the
// catalog grows. Rather than testing one tool at a time, these assert that EVERY member of an
// engine family satisfies that engine's contract: the metadata resolves, a knowledge file exists,
// and the engine actually produces sensible output for the tool's processor. This is what stops
// engines drifting apart as they scale toward thousands of tools.

import { describe, it, expect } from 'vitest';
import { tools } from '@data/registry';
import { getEngine , NON_DISPATCHING_PATTERNS } from '@data/engines';
import { KNOWLEDGE } from '@lib/knowledge/registry';
import { PROCESSORS } from '@lib/text/processors/registry';
import { ENCODERS } from '@lib/engines/encoding/registry';
import { HASHERS, runHash } from '@lib/engines/hashing/registry';
import { STRUCTURED_TOOLS } from '@lib/engines/structured-data/registry';
import { JWT_TOOLS } from '@lib/engines/jwt/registry';
import { FINANCE_CALCULATORS, financeFields } from '@lib/engines/finance/registry';
import { DATETIME_TOOLS, dateTimeFields } from '@lib/engines/datetime/registry';
import { MATH_CALCULATORS, mathFields } from '@lib/engines/math/registry';
import { WELLNESS_CALCULATORS, wellnessFields } from '@lib/engines/wellness/registry';
import { CSV_TOOLS } from '@lib/engines/csv/registry';
import { TRACKER_DEFS } from '@lib/engines/tracker/registry';
import { GENERATORS } from '@lib/generation/registry';
import { engineRegistry } from '@data/engines';
import { SIMULATIONS } from '@lib/simulation/simulations/registry';
import { SUBSTEP } from '@lib/simulation/loop';
import type { SimState } from '@lib/simulation/types';

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
// Non-dispatching patterns are excluded for the same reason as the encoding block below: a tool that
// reports on its input rather than transforming it registers no processor.
describe('text-processor engine', () => {
  const dispatchingText = byEngine('text-processor').filter(t => !NON_DISPATCHING_PATTERNS.has(t.pattern as never));
  it.each(dispatchingText.map(t => [t.slug, t.processorId] as const))(
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
// Tools on a NON_DISPATCHING_PATTERNS pattern are excluded: they sit on this engine to answer which
// codec applies rather than to apply one, so they register no encoder and have nothing to round-trip.
// Read from the same declaration validate-registry uses, so the two can never disagree about which
// tools owe a processor.
describe('encoding engine', () => {
  const sample = 'Hello, World! <tag> & "quote" 123';
  const dispatching = byEngine('encoding').filter(t => !NON_DISPATCHING_PATTERNS.has(t.pattern as never));

  // A codec round-trips the input IT accepts, and for the `numeral` family that input is a number.
  // Roman numerals, English words and base two have no reading of `<tag> & "quote"` at all, so
  // feeding them the generic string tests nothing and fails for the right reason at the wrong time.
  // Keyed off `family` rather than a list of slugs, so a fourth numeral tool inherits this without
  // editing the contract; the sample is the encoder's own, which is also what the widget offers.
  const inputFor = (enc: (typeof ENCODERS)[string]) =>
    enc.family === 'numeral' ? (enc.sample ?? '') : sample;

  it.each(dispatching.map(t => [t.slug, t.processorId] as const))(
    '%s round-trips through encode → decode',
    (_slug, processorId) => {
      const enc = ENCODERS[processorId!];
      expect(enc, `encoder "${processorId}" registered`).toBeDefined();
      const input = inputFor(enc);
      expect(input, `encoder "${processorId}" declares an input it can round-trip`).not.toBe('');
      expect(enc.decode(enc.encode(input))).toBe(input);
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

// ── datetime: every tool resolves a tool with a calculate() and renderable fields ─────────────
describe('datetime engine', () => {
  it.each(byEngine('datetime').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a tool with calculate() and fields',
    (_slug, processorId) => {
      const tool = DATETIME_TOOLS[processorId!];
      expect(tool, `datetime tool "${processorId}" registered`).toBeDefined();
      expect(typeof tool.calculate).toBe('function');
      expect(dateTimeFields(processorId!).length).toBeGreaterThan(0);
    },
  );
});

// ── math: every tool resolves a calculator with a calculate() and renderable fields ───────────
describe('math engine', () => {
  it.each(byEngine('math').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a calculator with calculate() and fields',
    (_slug, processorId) => {
      const calc = MATH_CALCULATORS[processorId!];
      expect(calc, `math calculator "${processorId}" registered`).toBeDefined();
      expect(typeof calc.calculate).toBe('function');
      expect(mathFields(processorId!).length).toBeGreaterThan(0);
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

// ── wellness: every tool resolves a calculator with a calculate() and renderable fields ───────
describe('wellness engine', () => {
  it.each(byEngine('wellness').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a calculator with calculate() and fields',
    (_slug, processorId) => {
      const calc = WELLNESS_CALCULATORS[processorId!];
      expect(calc, `wellness calculator "${processorId}" registered`).toBeDefined();
      expect(typeof calc.calculate).toBe('function');
      expect(wellnessFields(processorId!).length).toBeGreaterThan(0);
    },
  );
});

// ── generation: generate() honours the schema and the autoGenerate flag it declares ───────────
//
// Driving generate() with the field schema's own defaults, rather than an empty object, is the
// point: it proves the schema the widget renders and the options generate() reads are the same
// contract. Randomness lives inside generate(), so this also catches a strategy that throws in Node.
//
// `autoGenerate` decides what a default run MUST produce, because it is exactly what the widget
// promises: a generator declaring `true` paints output on first load, so defaults that cannot
// produce output would render an error on arrival. qr-code is the one that declares `false` — a QR
// code has no meaningful default content — and it owes a clean error result instead, never a throw.
describe('generation engine', () => {
  it.each(byEngine('generation').map(t => [t.slug, t.processorId] as const))(
    '%s honours its own field schema and autoGenerate flag',
    (_slug, processorId) => {
      const gen = GENERATORS[processorId!];
      expect(gen, `generator "${processorId}" registered`).toBeDefined();
      expect(gen.fields.length, 'declares a field schema').toBeGreaterThan(0);

      const options: Record<string, number | string | boolean> = {};
      for (const f of gen.fields) options[f.id] = f.default;

      const result = gen.generate(options);

      if (gen.autoGenerate) {
        expect(result.ok, `"${processorId}" auto-generates, so defaults must produce output`).toBe(true);
        // Each kind carries its payload in a different field; an "ok" result with nothing in it
        // is a broken generator that would paint an empty page.
        if (result.kind === 'text') expect(result.text).toBeTruthy();
        if (result.kind === 'lines') expect(result.lines?.length).toBeGreaterThan(0);
        if (result.kind === 'qr') expect(result.qr).toBeDefined();
      } else {
        expect(
          result.error,
          `"${processorId}" does not auto-generate, so an empty default run owes an error message`,
        ).toBeTruthy();
      }
    },
  );
});

// ── csv: every tool executes and declares how many panes the widget must render ───────────────
describe('csv engine', () => {
  it.each(byEngine('csv').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a csv tool that executes without throwing',
    (_slug, processorId) => {
      const tool = CSV_TOOLS[processorId!];
      expect(tool, `csv tool "${processorId}" registered`).toBeDefined();
      expect(tool.inputs, 'declares 1 or 2 input panes').toBeGreaterThanOrEqual(1);

      // Never-throws is the engine's stated contract, so the empty case must come back as a
      // result rather than an exception — that is what keeps the widget rendering a status line.
      const sample = 'a,b\n1,2\n3,4';
      expect(() => tool.execute(sample, tool.inputs === 2 ? sample : undefined)).not.toThrow();
      expect(() => tool.execute('')).not.toThrow();
      expect(typeof tool.execute(sample, tool.inputs === 2 ? sample : undefined).ok).toBe('boolean');
    },
  );
});

// ── tracker: every tool resolves a declarative TrackerDef the shared widget can render ────────
describe('tracker engine', () => {
  it.each(byEngine('tracker').map(t => [t.slug, t.processorId] as const))(
    '%s resolves a coherent TrackerDef',
    (_slug, processorId) => {
      const def = TRACKER_DEFS[processorId!];
      expect(def, `tracker "${processorId}" registered`).toBeDefined();
      expect(def.id).toBe(processorId);
      expect(def.unit, 'declares a unit').toBeTruthy();
      expect(def.windowDays, 'charts a non-empty window').toBeGreaterThan(0);
      // A 'goal' streak with no goal to hit can never advance, which would render a streak that
      // silently stays at zero forever.
      if (def.streakMode === 'goal') {
        expect(def.defaultGoal, `"${processorId}" streaks on a goal, so it needs one`).toBeGreaterThan(0);
      }
      // Increment trackers are driven entirely by their quick-add buttons; without one there is
      // no way to log anything.
      if (def.inputMode === 'increment') {
        expect(def.quickAdds?.length, `"${processorId}" increments, so it needs a quick-add`).toBeGreaterThan(0);
      }
    },
  );
});

// ── the simulation platform: every tool resolves a SimulationDef that steps and measures ──────
// physics and math-lab are two domain plugins over ONE platform, so they answer to one contract.
// Iterating both here rather than testing physics alone is what stops a math-lab simulation
// shipping untested purely because it entered through the other plugin.
describe.each(['physics', 'math-lab'])('%s engine', (engineId) => {
  it.each(byEngine(engineId).map(t => [t.slug, t.processorId] as const))(
    '%s resolves a simulation that stays finite and produces narrative',
    (_slug, processorId) => {
      const def = SIMULATIONS[processorId!];
      expect(def, `simulation "${processorId}" registered`).toBeDefined();
      expect(def.id).toBe(processorId);
      expect(def.params.length, 'declares parameters').toBeGreaterThan(0);

      const params: Record<string, number> = {};
      for (const p of def.params) params[p.id] = p.default;
      const s: SimState = { t: 0, params, vars: def.init(params) };
      for (let i = 0; i < 200; i++) def.step(s, SUBSTEP);
      expect(s.t, 'advances time').toBeGreaterThan(0);
      for (const m of def.measurements) {
        expect(Number.isFinite(m.compute(s)), `measurement "${m.id}" finite`).toBe(true);
      }
      expect(typeof def.explanation(s)).toBe('string');
      expect(def.explanation(s).length, 'non-empty explanation').toBeGreaterThan(0);
    },
  );
});

// ── the meta-contract: an engine cannot ship without one of the blocks above ──────────────────
//
// Every block above had to be written by hand, which means the honest failure mode of this file
// is not a wrong assertion but a MISSING one: engine 21 arrives, nobody adds a block, and the
// suite stays green while a whole family goes unexercised. That is how wellness reached 11 tools
// and generation reached 9 with no contract of their own.
//
// So the covered set is declared as data and checked against the engine manifest. Adding an
// engine to src/data/engines.ts now fails this test until it is either given a contract block or
// deliberately recorded as bespoke below — the same "make the exception explicit" technique
// NON_DISPATCHING_PATTERNS uses, for the same reason: an exception a reviewer had to type is a
// decision, and one the code inferred is an accident waiting to happen.

/** Engines with a contract block above. Keep in step with the describes. */
const CONTRACT_TESTED = new Set([
  'text-processor', 'encoding', 'hashing', 'structured-data', 'finance', 'datetime', 'math',
  'jwt', 'wellness', 'generation', 'csv', 'tracker', 'physics', 'math-lab',
]);

/**
 * Engines with no per-tool contract to assert, because their tools do not dispatch through a
 * processor registry at all: each one is a self-contained widget that happens to share subject
 * matter (and, for color/units, a namespace object of pure helpers those widgets call).
 *
 * Verified by the check below: a tool on one of these engines must NOT declare a processorId. The
 * day one does, it has become a dispatching engine and owes this file a real contract block.
 */
const BESPOKE_ENGINES = new Set([
  'calculator', 'productivity', 'text-interactive', 'text-analysis', 'color', 'units',
]);

describe('engine contract coverage', () => {
  it.each(engineRegistry.map(e => [e.id] as const))(
    '%s is either contract-tested or declared bespoke',
    (id) => {
      const covered = CONTRACT_TESTED.has(id) || BESPOKE_ENGINES.has(id);
      expect(
        covered,
        `Engine "${id}" has no contract block in this file. Add one next to its siblings, or ` +
          `add it to BESPOKE_ENGINES if its tools genuinely do not dispatch through a registry.`,
      ).toBe(true);
    },
  );

  it('every declared engine is real, and no engine is in both sets', () => {
    const known = new Set(engineRegistry.map(e => e.id));
    for (const id of [...CONTRACT_TESTED, ...BESPOKE_ENGINES]) {
      expect(known.has(id), `"${id}" is listed here but not registered in src/data/engines.ts`).toBe(true);
    }
    for (const id of CONTRACT_TESTED) {
      expect(BESPOKE_ENGINES.has(id), `"${id}" cannot be both contract-tested and bespoke`).toBe(false);
    }
  });

  it('no tool on a bespoke engine dispatches through a processor registry', () => {
    for (const t of tools) {
      if (t.engine && BESPOKE_ENGINES.has(t.engine)) {
        expect(
          t.processorId,
          `"${t.slug}" declares a processorId on bespoke engine "${t.engine}" — that engine now ` +
            `dispatches, so it needs a contract block rather than a bespoke exemption.`,
        ).toBeUndefined();
      }
    }
  });
});
