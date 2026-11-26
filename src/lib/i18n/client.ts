// Synchronous browser-side reader for per-page localized UI strings embedded by BaseLayout
// inside <script type="application/json" id="tt-i18n">. Returns an empty object on English pages
// or SSR so English bundles and behavior remain completely untouched.

let cached: Record<string, any> | null = null;

export function readClientI18n(): Record<string, any> {
  if (cached) return cached;
  if (typeof document === 'undefined') return {};
  const el = document.getElementById('tt-i18n');
  if (!el?.textContent) {
    cached = {};
    return cached;
  }
  try {
    cached = JSON.parse(el.textContent) as Record<string, any>;
  } catch {
    cached = {};
  }
  return cached;
}

export function clientStr(key: string, fallback: string): string {
  const dict = readClientI18n();
  const val = dict[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}
