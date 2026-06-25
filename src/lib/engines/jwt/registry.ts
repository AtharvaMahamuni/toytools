// JWT Engine — registry (single source of truth).
//
// The decoder is registered here exactly once. The shared widget never imports it directly; it
// calls ToyTools.runJwt(id, token), which resolves through runJwt() below. validate-registry also
// resolves a tool's `processorId` against JWT_TOOLS, the same way it does for every other engine.

import type { JwtTool, JwtResult } from './types';
import { decodeJwt } from './decode';

// A realistic-looking but throwaway HS256 token (signature is not verified) for the Sample button.
const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const jwtDecoder: JwtTool = {
  id: 'jwt-decoder',
  family: 'token',
  sample: SAMPLE,
  decode: decodeJwt,
};

// Keyed by tool id, referenced from a tool config's `processorId`.
export const JWT_TOOLS: Record<string, JwtTool> = {
  'jwt-decoder': jwtDecoder,
};

/**
 * Resolve a JWT tool by id and decode the token. Never throws: an unknown id reports a clear
 * error, and a decode failure is captured as { ok:false, error } (with the decoder's specific
 * message) so the widget can render its error state.
 */
export function runJwt(id: string, token: string): JwtResult {
  const tool = JWT_TOOLS[id];
  if (!tool) {
    // eslint-disable-next-line no-console
    console.warn(`[jwt] Unknown tool id "${id}".`);
    return { ok: false, error: 'Unknown JWT tool.' };
  }
  try {
    return { ok: true, decoded: tool.decode(token) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Could not decode this token.',
    };
  }
}
