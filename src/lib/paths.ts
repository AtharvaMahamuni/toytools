export function withBase(path: string): string {
  // import.meta.env is provided by Vite/Astro; under plain tsx (scripts) it is undefined,
  // so fall back to an empty base — callers there resolve absolute URLs against Astro.site.
  const base = (import.meta.env?.BASE_URL ?? '').replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}
