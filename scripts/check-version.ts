// Version + changelog gate.
//
// CLAUDE.md has required a version bump and a CHANGELOG entry on every PR that changes what the
// site ships since the versioning policy was written, and nothing checked it. A shipped change
// carrying a stale version is a change nobody can tell landed: the footer and /changelog/ both
// render APP_VERSION, so the site claims a release that does not describe it.
//
// Discipline held while one person shipped a few PRs a week. It is the first thing to go when tool
// production runs in parallel, which is the direction the catalog is heading, so it becomes a gate.
//
// Two things are checked, and they fail for different reasons:
//   1. A diff that touches shipped code must also touch src/lib/version.ts.
//   2. CHANGELOG.md must carry a heading for whatever version.ts currently declares.
//
// (2) runs unconditionally: a bump with no changelog entry is the more common half of the mistake,
// and unlike (1) it can be checked without a base ref to diff against.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VERSION_CONFIG, formatVersion } from '../src/lib/version';

const ROOT = join(import.meta.dirname, '..');

/**
 * Paths whose contents reach the built site. Deliberately broader than src/tools/: a token change
 * in src/styles or a layout change in src/components ships just as visibly as a new tool, and the
 * versioning table in CLAUDE.md calls both a patch rather than nothing.
 *
 * Everything absent from this list — docs, tests, CI config, research datasets, the scripts that
 * run at build time but never ship — is a "none" bump by that same table.
 */
const SHIPPING_PATHS = [
  'src/tools/',
  'src/data/',
  'src/lib/',
  'src/components/',
  'src/layouts/',
  'src/pages/',
  'src/styles/',
  'public/',
];

/** Paths inside SHIPPING_PATHS that do not actually ship. */
const NON_SHIPPING = (path: string): boolean =>
  path.endsWith('.test.ts') || path.endsWith('.test.tsx') || path.includes('/__tests__/');

const errors: string[] = [];

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function hasRef(ref: string): boolean {
  try {
    git('rev-parse', '--verify', '--quiet', ref);
    return true;
  } catch {
    return false;
  }
}

// ── 1. Shipped code changed, so the version must have moved ──────────────────────────────────
//
// The base ref mirrors how the seo:gate step resolves one: CI passes the PR base explicitly,
// and locally origin/main is the best available equivalent. A missing ref SKIPS rather than
// fails — a fresh clone with no origin/main must not be unable to run verify.
// An empty argument, not just a missing one, falls back: the workflow passes
// github.event.pull_request.base.sha, which is an empty string on push and workflow_dispatch.
const baseArg = process.argv[2];
const base = baseArg && baseArg.trim() ? baseArg.trim() : 'origin/main';

if (!hasRef(base)) {
  console.log(`[check-version] no "${base}" to diff against — skipping the bump check.`);
} else {
  // Committed history AND the working tree. CI only ever sees the former, but verify runs BEFORE
  // the commit: checking committed history alone would pass locally and fail on the PR, which is
  // precisely the local/CI drift verify.sh exists to eliminate. `git status --porcelain` covers
  // staged, unstaged and untracked in one pass; the rename form ("R  old -> new") is split so the
  // destination path is the one tested.
  const committed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const working = git('status', '--porcelain')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const path = line.slice(3);
      const arrow = path.indexOf(' -> ');
      return arrow === -1 ? path : path.slice(arrow + 4);
    });
  const changed = [...new Set([...committed, ...working])];
  const shipping = changed.filter(
    (p) => SHIPPING_PATHS.some((prefix) => p.startsWith(prefix)) && !NON_SHIPPING(p),
  );
  const bumped = changed.includes('src/lib/version.ts');

  if (shipping.length > 0 && !bumped) {
    const sample = shipping.slice(0, 5).map((p) => `    ${p}`).join('\n');
    const more = shipping.length > 5 ? `\n    …and ${shipping.length - 5} more` : '';
    errors.push(
      `${shipping.length} shipped file(s) changed but src/lib/version.ts did not:\n${sample}${more}\n` +
        `  A shipped change with a stale version is one nobody can tell landed.\n` +
        `  Run:  npm run version:bump <major|minor|patch> "<summary>"\n` +
        `  Which bump: a new/modified tool is minor, a new category or engine is major, ` +
        `anything else that ships is patch (see CLAUDE.md).`,
    );
  } else if (shipping.length > 0) {
    console.log(`[check-version] ${shipping.length} shipped file(s) changed, version.ts bumped.`);
  } else {
    console.log('[check-version] no shipped files changed — no bump required.');
  }
}

// ── 2. The declared version has a changelog entry ─────────────────────────────────────────────
//
// Matched against formatVersion() rather than a hand-built string, because formatVersion omits a
// .0 patch: alpha-v7.1 and alpha-v7.1.2 are both well-formed, and a check that assembled the
// heading itself would disagree with the file for every .0 release.
const version = formatVersion(VERSION_CONFIG);
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');

if (!changelog.includes(`## [${version}]`)) {
  errors.push(
    `CHANGELOG.md has no entry for "${version}".\n` +
      `  version:bump rewrites src/lib/version.ts only — the entry is written by hand.\n` +
      `  Add a section at the top:  ## [${version}] - ${VERSION_CONFIG.releaseDate}\n` +
      `  Write what a visitor or the next maintainer would notice, not a file-by-file diff.`,
  );
} else {
  console.log(`[check-version] CHANGELOG.md documents ${version}.`);
}

if (errors.length > 0) {
  console.error('\n[check-version] FAILED\n');
  for (const e of errors) console.error(`  ✗ ${e}\n`);
  process.exit(1);
}

console.log('[check-version] OK');
