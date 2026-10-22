import { describe, expect, it } from 'vitest';
import { LAZY_DATETIME_IDS, loadDateTimeTool, runLazyDateTime } from './lazy';
import { DATETIME_TOOLS, runDateTime } from './registry';
import { DATETIME_EXAMPLES } from './examples';

// Card ids count up per call, so the comparison is on what the page shows.
const shown = (r: ReturnType<typeof runLazyDateTime>) => JSON.stringify([r.uiState, r.hero, r.metrics, r.error, r.explanation]);

describe('datetime lazy loading', () => {
  it('has one loader per registry id', () => {
    expect([...LAZY_DATETIME_IDS].sort()).toEqual(Object.keys(DATETIME_TOOLS).sort());
  });

  it('an id is unknown until loaded, then runs exactly like the registry', async () => {
    const id = Object.keys(DATETIME_TOOLS)[0]!;
    expect(runLazyDateTime(id, {}, {} as never).uiState).toBe('calculation-error');
    for (const each of Object.keys(DATETIME_TOOLS)) {
      await loadDateTimeTool(each);
      await loadDateTimeTool(each);
      const input = DATETIME_EXAMPLES.find((ex) => ex.ref === each)?.inputs ?? {};
      expect(shown(runLazyDateTime(each, input as never, {} as never)), each).toBe(shown(runDateTime(each, input as never, {} as never)));
    }
  });

  it('an unknown id stays an error', async () => {
    await loadDateTimeTool('nope');
    expect(runLazyDateTime('nope', {}, {} as never).uiState).toBe('calculation-error');
  });
});
