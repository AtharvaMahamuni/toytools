// localStorage utility for ToyTools.
//
// Key naming convention: "toytools.<tool-slug>.<field>"
// Example: "toytools.base64.input"
//
// Used via <script is:inline> — copy the functions below directly into tool scripts.
// When a tool migrates to a module script, import this file instead.

export const MAX_STORE_BYTES = 50_000;

export function getStored(key: string): string {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

export function setStored(key: string, value: string, maxBytes = MAX_STORE_BYTES): void {
  try {
    if (value.length < maxBytes) {
      localStorage.setItem(key, value);
    }
  } catch {
    // Ignore: private browsing, storage quota exceeded
  }
}

export function clearStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
