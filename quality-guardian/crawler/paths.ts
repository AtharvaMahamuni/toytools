// Which dist/ HTML files the crawler treats as pages, and the URL path of each. Kept free of the
// HTML parser (cheerio) so the root vitest run can test it before quality-guardian's deps install.
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { NON_PAGE_HTML } from '../config/index.js';

function walkDir(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, results);
    else if (entry.isFile() && entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

export function filePathToUrlPath(filePath: string, distDir: string): string {
  const rel = relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel; // e.g. /404.html
}

/** Every .html file under distDir except the generated non-page files in NON_PAGE_HTML. */
export function pageHtmlFiles(distDir: string): string[] {
  return walkDir(distDir).filter(f => !NON_PAGE_HTML.has(filePathToUrlPath(f, distDir)));
}
