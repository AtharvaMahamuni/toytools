import type { EncodingTool } from './types';

// Base64 — byte-parity with the original hand-written widget:
//   encode: btoa(unescape(encodeURIComponent(text)))
//   decode: decodeURIComponent(escape(atob(text.trim())))
// The encodeURIComponent/unescape dance makes btoa UTF-8 safe; decode mirrors it.
// btoa/atob/escape/unescape are global in browsers and Node 18+. All calls stay
// inside methods so importing this module is side-effect-free (safe under tsx/vitest).
export const base64: EncodingTool = {
  id: 'base64',
  family: 'binary-text',
  sample: 'Hello, World!',
  encode: (input) => btoa(unescape(encodeURIComponent(input))),
  decode: (input) => decodeURIComponent(escape(atob(input.trim()))),
};
