#!/usr/bin/env bash
# Stop hook: run the full PR gate whenever a turn ends having changed shipped code.
#
# Why this exists: the local done-condition and the CI gate drifted, and the gap only surfaced as a
# red PR. Running `npm run verify` (which mirrors .github/workflows/quality-guardian.yml) at the end
# of every implementation closes it, and blocking the stop means the model has to fix what it broke
# rather than report success on top of it.
#
# Contract with Claude Code:
#   exit 0  -> allow the turn to end (nothing to verify, or verification passed)
#   exit 2  -> block; stderr is fed back to the model as the reason
#
# Never blocks twice in a row: stop_hook_active guards the loop, so a genuinely stuck run can still
# end and report honestly instead of spinning.

set -uo pipefail

INPUT=$(cat)
REPO="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[[ -z "$REPO" || ! -d "$REPO" ]] && exit 0
cd "$REPO" || exit 0

# Already blocked once this turn; let it end so the model can report what is still failing.
if grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true' <<<"$INPUT"; then
  exit 0
fi

# Opt out for a session that is deliberately mid-experiment: touch .claude/.skip-verify
[[ -f .claude/.skip-verify ]] && exit 0

# Only shipped code counts. Docs, analysis notes, research reports and scratch files do not change
# what the PR workflow will do, and verifying them costs minutes for nothing.
WATCHED=(src scripts tests public quality-guardian seo-engine package.json astro.config.mjs tsconfig.json playwright.config.ts)
CHANGED=$(git status --porcelain -- "${WATCHED[@]}" 2>/dev/null)
[[ -z "$CHANGED" ]] && exit 0

LOG=$(mktemp)
if npm run verify >"$LOG" 2>&1; then
  rm -f "$LOG"
  exit 0
fi

{
  echo "npm run verify failed, so this work is not done. This is the same gate the PR runs"
  echo "(.github/workflows/quality-guardian.yml), so a failure here is a failure there."
  echo
  echo "Fix the cause and re-run. Never weaken a check, raise a budget, or delete an assertion to"
  echo "get past it. If a check is genuinely wrong, say so explicitly rather than editing it quietly."
  echo
  echo "--- verify output (tail) ---"
  tail -n 120 "$LOG"
} >&2

rm -f "$LOG"
exit 2
