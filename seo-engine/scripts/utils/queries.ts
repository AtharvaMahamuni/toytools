import { MAX_QUERIES } from './config.js';

/**
 * Generates search query variants from a tool slug.
 * e.g. "base64-encoder-decoder" → ["base64 encoder", "base64 decoder", ...]
 */
export function generateQueries(toolSlug: string): string[] {
  const tokens = toolSlug.split('-').filter(Boolean);
  const queries = new Set<string>();

  if (tokens.length === 0) return [];

  // base phrase: all tokens joined
  queries.add(tokens.join(' '));

  // first two tokens
  if (tokens.length >= 2) {
    queries.add(`${tokens[0]} ${tokens[1]}`);
  }

  // first + third token (e.g. "base64 decoder")
  if (tokens.length >= 3) {
    queries.add(`${tokens[0]} ${tokens[2]}`);
  }

  // action variants based on common verb tokens
  const actionTokens = ['encoder', 'decoder', 'converter', 'generator', 'calculator', 'formatter'];
  for (const t of tokens) {
    if (actionTokens.includes(t)) {
      const subject = tokens.filter(x => x !== t).join(' ');
      if (subject) {
        queries.add(`${t.replace(/er$/, 'e')} ${subject} online`); // "encode base64 online"
        queries.add(`${subject} ${t}`); // "base64 encoder"
        queries.add(`${subject} ${t.replace(/er$/, '')}ing tool`); // "base64 encoding tool"
      }
    }
  }

  // "what is X" query for learning intent
  queries.add(`what is ${tokens[0]}`);

  // online tool variant
  queries.add(`${tokens.slice(0, 2).join(' ')} online`);

  // converter/tool fallback
  if (!toolSlug.includes('converter')) {
    queries.add(`${tokens[0]} converter`);
  }

  return Array.from(queries).slice(0, MAX_QUERIES);
}
