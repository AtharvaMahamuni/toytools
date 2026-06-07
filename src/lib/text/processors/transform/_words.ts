// Shared helper for identifier-style transforms (camel/snake/kebab).
// Splits a single line into word tokens: breaks camelCase humps, treats any
// run of non-alphanumeric characters as a separator, and drops empties.
export function splitWords(line: string): string[] {
  return line
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase / PascalCase humps
    .replace(/[^a-zA-Z0-9]+/g, ' ')         // separators → space
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// Applies a per-line transform while preserving line structure (and blank lines).
export function perLine(text: string, fn: (line: string) => string): string {
  return text.split('\n').map(fn).join('\n');
}
