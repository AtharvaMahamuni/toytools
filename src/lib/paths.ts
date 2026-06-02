export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}
