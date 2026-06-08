// Hashing Engine — types.
//
// Hashing is one-way: input → hex digest. There is no decode. A hasher is a single
// object implementing this interface. The shared HashWidget never names a hasher;
// it calls ToyTools.runHash(id, text), which resolves through the registry and always
// returns a Promise<string> (SHA via crypto.subtle is async; MD5 is sync but normalized).

export type HashFamily = 'cryptographic';

export interface HashTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'sha256'). */
  id: string;
  family: HashFamily;
  /** Returns a lowercase hex digest. May be sync (MD5) or async (SHA via crypto.subtle). */
  hash(input: string): string | Promise<string>;
}
