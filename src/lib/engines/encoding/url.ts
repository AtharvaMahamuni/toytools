import type { EncodingTool } from './types';

// URL (percent) encoding. encodeURIComponent escapes everything that isn't an
// unreserved URI character; decodeURIComponent reverses it and throws on a
// malformed percent sequence (e.g. '%E0%A4%A') — caught by the resolver.
export const url: EncodingTool = {
  id: 'url',
  family: 'web',
  sample: 'hello world & friends?a=1',
  encode: (input) => encodeURIComponent(input),
  decode: (input) => decodeURIComponent(input),
};
