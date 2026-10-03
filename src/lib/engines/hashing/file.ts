// Hash a local Blob in slices. SHA-256 and CRC32 never hold more than one slice.
// MD5, SHA-1, and SHA-512 still go through one-shot code, so a file over the limit
// is refused rather than loaded whole. The caller can switch to SHA-256.
//
// This file must not import the registry. The registry imports fileHash from here.

import { compareDigest } from './compare';
import { crc32, crc32Finish, crc32Start, crc32Update } from './crc32';
import { md5, md5hexBytes } from './md5';
import { sha1, sha256, sha512, shaBytes } from './sha';
import { createSha256 } from './sha256-inc';
import type { HashTool } from './types';
import type { DigestComparison } from '../transform/types';

export const FILE_SLICE_BYTES = 1024 * 1024;
/** Above this, one-shot algorithms are refused. SHA-256 and CRC32 keep slicing. */
export const FILE_ONESHOT_LIMIT = 32 * 1024 * 1024;

const SLICED = new Set(['sha256', 'crc32']);

const LENGTHS: Record<string, number> = {
  crc32: 8,
  md5: 32,
  sha1: 40,
  sha256: 64,
  sha512: 128,
};

const NAMES: Record<string, string> = {
  crc32: crc32.displayName ?? 'CRC32',
  md5: md5.displayName ?? 'MD5',
  sha1: sha1.displayName ?? 'SHA-1',
  sha256: sha256.displayName ?? 'SHA-256',
  sha512: sha512.displayName ?? 'SHA-512',
};

export interface FileHashResult {
  ok: true;
  id: string;
  hex: string;
  bytes: number;
  empty: boolean;
}

export interface FileHashLimited {
  ok: false;
  reason: 'too-large' | 'unsupported' | 'unreadable';
  id: string;
  bytes: number;
}

export type FileHashOutcome = FileHashResult | FileHashLimited;

export async function hashBlob(
  blob: Blob,
  id: string,
  onProgress?: (done: number, total: number) => void,
): Promise<FileHashOutcome> {
  const total = blob.size;
  if (!SLICED.has(id) && total > FILE_ONESHOT_LIMIT) {
    return { ok: false, reason: 'too-large', id, bytes: total };
  }
  try {
    return await readBlob(blob, id, total, onProgress);
  } catch {
    return { ok: false, reason: 'unreadable', id, bytes: total };
  }
}

async function readBlob(
  blob: Blob,
  id: string,
  total: number,
  onProgress?: (done: number, total: number) => void,
): Promise<FileHashOutcome> {
  if (id === 'sha256' || id === 'crc32') {
    const sha = id === 'sha256' ? createSha256() : null;
    let crc = crc32Start();
    let done = 0;
    while (done < total) {
      const end = Math.min(done + FILE_SLICE_BYTES, total);
      const chunk = new Uint8Array(await blob.slice(done, end).arrayBuffer());
      if (sha) sha.update(chunk);
      else crc = crc32Update(crc, chunk);
      done = end;
      onProgress?.(done, total);
    }
    if (total === 0) onProgress?.(0, 0);
    const hex = sha ? sha.hex() : crc32Finish(crc);
    return { ok: true, id, hex, bytes: total, empty: total === 0 };
  }
  if (id !== 'md5' && id !== 'sha1' && id !== 'sha512') {
    return { ok: false, reason: 'unsupported', id, bytes: total };
  }
  const bytes = new Uint8Array(await blob.arrayBuffer());
  onProgress?.(total, total);
  const hex = id === 'md5'
    ? md5hexBytes(bytes)
    : await shaBytes(id === 'sha1' ? 'SHA-1' : 'SHA-512', bytes);
  if (!hex) return { ok: false, reason: 'unsupported', id, bytes: total };
  return { ok: true, id, hex, bytes: total, empty: total === 0 };
}

/** Compare a pasted digest against the file digest, using the real algorithm lengths. */
export function compareFileDigest(id: string, expected: string, actual: string): DigestComparison | null {
  const own = LENGTHS[id] ?? actual.length;
  if (!own) return null;
  return compareDigest(expected, actual, own, LENGTHS, NAMES);
}

/** Text contract for the registry. The page hashes file bytes; this keeps processorId resolvable. */
export const fileHash: HashTool = {
  id: 'file-hash',
  family: 'cryptographic',
  displayName: 'File hash',
  sample: '',
  insight: 'Hashes the bytes of a local file. The text contract delegates to SHA-256.',
  hash: (input: string) => sha256.hash(input),
};
