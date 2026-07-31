// Parity between the two maps that drive the lazy runtime. validate-registry enforces this at build
// time as well; having it here fails in milliseconds instead of after a full Astro render, and keeps
// the contract visible next to the maps themselves.
import { describe, expect, it } from 'vitest';
import { ENGINE_LOADERS, ENGINE_GLOBALS, RUNTIME_ENGINE_IDS } from './loaders';
import { engineIds } from '@data/engines';

/** Engines that deliberately have no ToyTools.* runtime — see the comment in loaders.ts. */
const NO_RUNTIME = ['calculator', 'productivity', 'physics', 'math-lab'];

describe('engine loader maps', () => {
  it('declares the same engines in both maps', () => {
    expect(Object.keys(ENGINE_GLOBALS).sort()).toEqual(RUNTIME_ENGINE_IDS.slice().sort());
  });

  it('only references engines that exist in the engine manifest', () => {
    for (const id of RUNTIME_ENGINE_IDS) {
      expect(engineIds.has(id), `"${id}" is not a registered engine`).toBe(true);
    }
  });

  it('never claims a runtime for an engine that deliberately has none', () => {
    for (const id of NO_RUNTIME) {
      expect(RUNTIME_ENGINE_IDS, `"${id}" must not have a lazy runtime`).not.toContain(id);
    }
  });

  it('lists at least one global per engine, with no duplicates within an engine', () => {
    for (const [id, globals] of Object.entries(ENGINE_GLOBALS)) {
      expect(globals.length, `"${id}" declares no globals`).toBeGreaterThan(0);
      expect(new Set(globals).size, `"${id}" repeats a global`).toBe(globals.length);
    }
  });

  it('actually loads a module exporting attach() for every engine', async () => {
    for (const id of RUNTIME_ENGINE_IDS) {
      const mod = await ENGINE_LOADERS[id]!();
      expect(typeof mod.attach, `"${id}" has no attach() export`).toBe('function');
    }
  });

  // Surfaces several engines share (experience, viz, transform) must be claimed by each engine that
  // attaches them, or a page loading only one of them would fail the validate-registry widget check.
  it('declares shared surfaces on every engine that attaches them', () => {
    expect(ENGINE_GLOBALS.encoding).toContain('transform');
    expect(ENGINE_GLOBALS.hashing).toContain('transform');
    for (const id of ['finance', 'datetime', 'math', 'wellness']) {
      expect(ENGINE_GLOBALS[id], `"${id}" renders InteractiveResults`).toContain('experience');
    }
    for (const id of ['wellness', 'tracker']) {
      expect(ENGINE_GLOBALS[id], `"${id}" draws sparklines`).toContain('viz');
    }
  });
});
