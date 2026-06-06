import { execSync } from 'node:child_process';
import type { Issue, QualityContext } from '../types/index.js';
import { SITE_URL, ROOT_DIR } from '../config/index.js';

export interface AutoFixResult {
  rebuildsTriggered: number;
}

/**
 * One-cycle auto-fixer for generated artifacts.
 * Never modifies human-authored source files.
 * Only triggers a rebuild when fixable (generated artifact) issues are found.
 * Fixable issues: wrong domain in canonical/robots/sitemap caused by missing ASTRO_SITE.
 */
export async function runAutoFix(issues: Issue[], _ctx: QualityContext): Promise<AutoFixResult> {
  const fixableIssues = issues.filter(i => i.fixable && i.auto_fix_strategy === 'AUTO_FIX');

  if (fixableIssues.length === 0) {
    return { rebuildsTriggered: 0 };
  }

  console.log(`\n[auto-fix] Found ${fixableIssues.length} fixable issue(s) in generated artifacts.`);
  console.log('[auto-fix] Triggering rebuild with ASTRO_SITE set...\n');

  execSync('npm run build', {
    env: { ...process.env, ASTRO_SITE: SITE_URL },
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  console.log('\n[auto-fix] Rebuild complete. Re-validating...\n');
  return { rebuildsTriggered: 1 };
}
