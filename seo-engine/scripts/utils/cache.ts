import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CACHE_TTL_MS } from './config.js';
import type { CachedPage } from '../../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '../../cache');

function keyToHash(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

function cachePath(key: string): string {
  return join(CACHE_DIR, `${keyToHash(key)}.json`);
}

interface CacheEntry<T> {
  key: string;
  fetchedAt: string;
  data: T;
}

/**
 * Generic keyed cache. Returns the stored data if present and fresher than the
 * TTL, otherwise null. Keys are arbitrary strings (e.g. a URL or `serp:<query>`).
 */
export function getCachedData<T>(key: string): T | null {
  const path = cachePath(key);
  if (!existsSync(path)) return null;

  const raw = JSON.parse(readFileSync(path, 'utf-8')) as CacheEntry<T>;
  const age = Date.now() - new Date(raw.fetchedAt).getTime();
  if (age > CACHE_TTL_MS) return null;

  return raw.data;
}

export function setCachedData<T>(key: string, data: T): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  const entry: CacheEntry<T> = { key, fetchedAt: new Date().toISOString(), data };
  writeFileSync(cachePath(key), JSON.stringify(entry, null, 2));
}

/**
 * Page-HTML cache, preserving the original `{ url, fetchedAt, html }` shape on
 * disk for readability and backwards compatibility.
 */
export function getCached(url: string): CachedPage | null {
  const path = cachePath(url);
  if (!existsSync(path)) return null;

  const raw = JSON.parse(readFileSync(path, 'utf-8')) as CachedPage;
  if (!raw.fetchedAt || typeof raw.html !== 'string') return null;
  const age = Date.now() - new Date(raw.fetchedAt).getTime();
  if (age > CACHE_TTL_MS) return null;

  return raw;
}

export function setCached(url: string, html: string): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  const entry: CachedPage = { url, fetchedAt: new Date().toISOString(), html };
  writeFileSync(cachePath(url), JSON.stringify(entry, null, 2));
}
