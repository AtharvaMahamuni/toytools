// localStorage reference for ToyTools inline scripts.
//
// Key naming convention: "toytools.<tool-slug>.<field>"
// Example: "toytools.base64.input"
//
// <script is:inline> cannot import modules, so copy these functions verbatim
// into each tool's inline script. MAX_STORE_BYTES is the shared size cap —
// inline scripts reference it as a local constant (e.g. var MAX_STORE = 50000).

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
