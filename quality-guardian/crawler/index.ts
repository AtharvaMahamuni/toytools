import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseHtml } from './html-parser.js';
import type { CrawledPage, RouteManifest } from '../types/index.js';
import { filePathToUrlPath, pageHtmlFiles } from './paths.js';

export async function crawlDist(distDir: string, siteUrl: string): Promise<CrawledPage[]> {
  const htmlFiles = pageHtmlFiles(distDir);
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
