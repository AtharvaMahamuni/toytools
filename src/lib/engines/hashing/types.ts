// Hashing Engine — types.
//
// Hashing is one-way: input → hex digest. There is no decode. A hasher is a single
// object implementing this interface. The shared ConverterWidget never names a hasher;
// it calls the ToyTools.transform facade (kind 'hashing', one-way + async), which resolves
// through the registry. runHash() still returns a Promise<string> (SHA via crypto.subtle is
// async; MD5 is sync but normalized).

import type { TechnicalEntry } from '../transform/types';

export type HashFamily = 'cryptographic' | 'checksum';

export interface HashTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'sha256'). */
  id: string;
  family: HashFamily;
  /** Returns a lowercase hex digest. May be sync (MD5) or async (SHA via crypto.subtle). */
  hash(input: string): string | Promise<string>;

  // ── Optional UX surface (generic transform contract) ──────────────────────
  /** Friendly name for status lines and metadata ("MD5", "SHA-256"). */
  displayName?: string;
  /** Digest size in bits (md5 128, sha1 160, sha256 256, sha512 512). */
  bits?: number;
  /** Compact educational copy. */
  insight?: string | string[];
  /** Collapsible technical reference rows. */
  technical?: TechnicalEntry[];
  /** One-click example text. */
  sample?: string;
}
