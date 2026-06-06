import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseHtml } from './html-parser.js';
import type { CrawledPage, RouteManifest } from '../types/index.js';

function walkDir(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, results);
    else if (entry.isFile() && entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function filePathToUrlPath(filePath: string, distDir: string): string {
  const rel = relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel; // e.g. /404.html
}

export async function crawlDist(distDir: string, siteUrl: string): Promise<CrawledPage[]> {
  const htmlFiles = walkDir(distDir);
  return htmlFiles.map(filePath => {
    const urlPath = filePathToUrlPath(filePath, distDir);
    return parseHtml(filePath, urlPath, siteUrl);
  });
}

export function readRouteManifest(distDir: string): string[] {
  const manifestPath = join(distDir, 'route-manifest.json');
  try {
    statSync(manifestPath);
  } catch {
    throw new Error(
      `Route manifest not found at ${manifestPath}.\n` +
      'Run "npm run build" first to generate dist/route-manifest.json.'
    );
  }
  const raw = readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw) as RouteManifest;
  return manifest.routes;
}
