// The overclaim the 1 Nov 2026 audit (P-1) removed from every built page. The site loads analytics
// and has a feedback form, so "Nothing is uploaded" is not true of the site. scripts/check-privacy-copy.ts
// scans dist/ after every build and fails if the phrase comes back anywhere.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const BANNED_PRIVACY = /nothing is uploaded/i;

const TEXT_EXT = /\.(html|txt|json|xml|js|mjs|css|webmanifest|md)$/i;

/** Every text file under dir whose bytes contain the banned phrase, as paths relative to dir. */
export function filesWithBannedPrivacy(dir: string): string[] {
  const hits: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (TEXT_EXT.test(name) && BANNED_PRIVACY.test(readFileSync(p, 'utf8'))) hits.push(relative(dir, p));
    }
  };
  walk(dir);
  return hits.sort();
}

/**
 * A claim that the user's data stays on the device. False on a tool that makes a network request
 * (trustVariant 'lookup': What Is My IP asks an IP echo), so its pages must never carry one.
 */
export const DEVICE_CLAIM = /stays on (your|this) device|runs entirely on your device|not uploaded/i;

/** The built pages that speak for a tool: its tool page and, if it has one, its guide. */
export function pagesForTool(t: { slug: string; categorySlug: string; guide?: { slug: string; categorySlug: string } }): string[] {
  const pages = [join('tool', t.categorySlug, t.slug, 'index.html')];
  if (t.guide) pages.push(join('guide', t.guide.categorySlug, t.guide.slug, 'index.html'));
  return pages;
}

/** Of the given pages (relative to dir), those that exist and make a device claim. */
export function pagesWithDeviceClaim(dir: string, pages: string[]): string[] {
  return pages.filter((rel) => {
    try {
      return DEVICE_CLAIM.test(readFileSync(join(dir, rel), 'utf8'));
    } catch {
      return false;
    }
  });
}
