// Shared helper for identifier-style transforms (camel/snake/kebab).
// Splits a single line into word tokens: breaks camelCase humps, treats any
// run of non-letter/non-digit characters as a separator, and drops empties.
// Unicode-aware (\p{L}/\p{N}) so accented letters are kept, not destroyed
// ("café menu" → ['café', 'menu'], not ['caf', 'menu']).
export function splitWords(line: string): string[] {
  return line
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2') // camelCase / PascalCase humps
    .replace(/[^\p{L}\p{N}]+/gu, ' ')              // separators → space
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// Applies a per-line transform while preserving line structure (and blank lines).
export function perLine(text: string, fn: (line: string) => string): string {
  return text.split('\n').map(fn).join('\n');
}
