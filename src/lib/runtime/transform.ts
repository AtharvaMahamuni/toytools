// The generic transform facade behind ToyTools.transform — the engine-agnostic surface that
// ConverterWidget speaks.
//
// ConverterWidget is shared by the `encoding` and `hashing` engines, so the facade has to exist
// whenever either one is loaded, but must NOT pull both engines onto a page that needs one. Each
// engine module registers its own provider here on attach; a page therefore carries exactly the
// providers its tool declares. Every verb degrades to a safe neutral default when a kind has no
// provider registered.

import type { encodingProvider } from '@lib/engines/encoding/registry';
import type { ToyToolsGlobal } from './types';

type Provider = typeof encodingProvider;

const PROVIDERS: Record<string, Provider> = {};

/** Register a transform provider for `kind` and install the facade if it is not there yet. */
export function registerTransformProvider(TT: ToyToolsGlobal, kind: string, provider: Provider): void {
  PROVIDERS[kind] = provider;
  if (TT.transform) return;
  TT.transform = {
    run: (kind: string, id: string, mode: string, input: string) => {
      const p = PROVIDERS[kind];
      return p ? p.run(id, mode, input) : { ok: true, output: input };
    },
    detect: (kind: string, id: string, input: string) => {
      const p = PROVIDERS[kind];
      return p ? p.detect(id, input) : { mode: 'encode', confidence: 'low' };
    },
    validate: (kind: string, id: string, mode: string, input: string) => {
      const p = PROVIDERS[kind];
      return p ? p.validate(id, mode, input) : { ok: true };
    },
    meta: (kind: string, id: string, input: string, output: string, mode: string) => {
      const p = PROVIDERS[kind];
      return p ? p.meta(id, input, output, mode) : [];
    },
    info: (kind: string, id: string) => {
      const p = PROVIDERS[kind];
      return p
        ? p.info(id)
        : { displayName: id, reversible: true, modes: { forward: 'encode', inverse: 'decode' } };
    },
    // Optional on a provider: a kind with no recoveries (hashing has no malformed input to repair)
    // simply never offers one, and the widget's offer stays hidden.
    recover: (kind: string, id: string, mode: string, input: string) => {
      const p = PROVIDERS[kind];
      return p && p.recover ? p.recover(id, mode, input) : null;
    },
    // Optional in the same way: only hashing has an output the user arrived holding a copy of.
    // Everything else returns null and the widget's comparison row stays hidden.
    compare: (kind: string, id: string, expected: string, actual: string) => {
      const p = PROVIDERS[kind];
      return p && p.compare ? p.compare(id, expected, actual) : null;
    },
  };
}
