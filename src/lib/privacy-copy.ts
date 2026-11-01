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
