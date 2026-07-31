// The transform facade is the one part of the lazy runtime with real branching: ConverterWidget is
// shared by the encoding and hashing engines, but a page loads only the engine its tool declares, so
// every verb has to degrade safely when asked about a kind whose provider was never registered.
// Before the runtime split both providers were always present and these branches could not be hit.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ToyToolsGlobal } from './types';

type Provider = Parameters<typeof import('./transform').registerTransformProvider>[2];

/** A provider whose every verb is identifiable, so we can prove dispatch went to the right one. */
function stubProvider(tag: string): Provider {
  return {
    run: (id, mode, input) => ({ ok: true, output: `${tag}:${id}:${mode}:${input}` }),
    detect: (id) => ({ mode: `${tag}-detect-${id}`, confidence: 'high' }),
    validate: () => ({ ok: false, error: `${tag}-invalid` }),
    meta: (id) => [{ label: tag, value: id }],
    info: (id) => ({ displayName: `${tag}/${id}`, reversible: false, modes: { forward: 'a', inverse: 'b' } }),
  } as unknown as Provider;
}

/** Fresh module per test — PROVIDERS is module-level state that would otherwise leak between cases. */
async function freshModule() {
  vi.resetModules();
  return import('./transform');
}

describe('transform facade', () => {
  let TT: ToyToolsGlobal;

  beforeEach(() => {
    TT = {};
  });

  it('installs ToyTools.transform on first registration', async () => {
    const { registerTransformProvider } = await freshModule();
    expect(TT.transform).toBeUndefined();
    registerTransformProvider(TT, 'encoding', stubProvider('enc'));
    expect(TT.transform).toBeDefined();
  });

  it('dispatches every verb to the provider registered for that kind', async () => {
    const { registerTransformProvider } = await freshModule();
    registerTransformProvider(TT, 'encoding', stubProvider('enc'));
    registerTransformProvider(TT, 'hashing', stubProvider('hash'));
    const t = TT.transform as any;

    expect(t.run('encoding', 'base64', 'encode', 'hi')).toEqual({ ok: true, output: 'enc:base64:encode:hi' });
    expect(t.run('hashing', 'sha256', 'encode', 'hi').output).toBe('hash:sha256:encode:hi');
    expect(t.detect('hashing', 'sha256', 'x').mode).toBe('hash-detect-sha256');
    expect(t.validate('encoding', 'base64', 'decode', 'x')).toEqual({ ok: false, error: 'enc-invalid' });
    expect(t.meta('hashing', 'sha256', 'a', 'b', 'encode')).toEqual([{ label: 'hash', value: 'sha256' }]);
    expect(t.info('encoding', 'base64').displayName).toBe('enc/base64');
  });

  // The safety net: on a hashing page the encoding provider is never loaded. Every verb must return
  // a harmless neutral value rather than throwing on an undefined provider.
  it('degrades to safe neutral defaults for a kind with no registered provider', async () => {
    const { registerTransformProvider } = await freshModule();
    registerTransformProvider(TT, 'hashing', stubProvider('hash'));
    const t = TT.transform as any;

    expect(t.run('encoding', 'base64', 'encode', 'untouched')).toEqual({ ok: true, output: 'untouched' });
    expect(t.detect('encoding', 'base64', 'x')).toEqual({ mode: 'encode', confidence: 'low' });
    expect(t.validate('encoding', 'base64', 'encode', 'x')).toEqual({ ok: true });
    expect(t.meta('encoding', 'base64', 'a', 'b', 'encode')).toEqual([]);
    expect(t.info('encoding', 'base64')).toEqual({
      displayName: 'base64',
      reversible: true,
      modes: { forward: 'encode', inverse: 'decode' },
    });
  });

  it('keeps the first facade when a second provider registers, and still sees the new kind', async () => {
    const { registerTransformProvider } = await freshModule();
    registerTransformProvider(TT, 'encoding', stubProvider('enc'));
    const first = TT.transform;
    registerTransformProvider(TT, 'hashing', stubProvider('hash'));

    expect(TT.transform).toBe(first); // not replaced — widgets may already hold a reference
    expect((TT.transform as any).run('hashing', 'sha256', 'encode', 'x').output).toBe('hash:sha256:encode:x');
  });
});
