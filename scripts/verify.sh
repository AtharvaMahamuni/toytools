#!/usr/bin/env bash
# The done-condition for any change to this repo, in one command.
#
# This mirrors .github/workflows/quality-guardian.yml step for step, and exists because the two
# drifted: a change can pass `npm run build`, `npm run test` and `npm run test:e2e` locally and
# still fail the PR, because CI additionally runs the coverage thresholds, builds with
# KNOWLEDGE_REQUIRED=true, runs the platform health check, and runs Quality Guardian. That is
# exactly how 14 redirect stubs reached a PR and failed the canonical validator on 2026-08-04.
#
# If you add a step to the workflow, add it here. If you add one here, add it there.
#
#   npm run verify         everything, including e2e on desktop AND Pixel 5
#   npm run verify:fast    everything except e2e (for the inner loop; NOT a done-condition)
#
# Every step runs even after an earlier one fails, so one pass reports every problem. Exit is 1 if
# anything failed.

set -uo pipefail
cd "$(dirname "$0")/.."

FAST=0
[[ "${1:-}" == "--fast" ]] && FAST=1

FAILED=()
PASSED=()

step() {
  local name="$1"; shift
  printf '\n\033[1m▶ %s\033[0m\n' "$name"
  if "$@"; then
    PASSED+=("$name")
  else
    FAILED+=("$name")
    printf '\033[31m✗ %s failed\033[0m\n' "$name"
  fi
}

step "unit tests"            npm run test
step "coverage thresholds"   npm run test:coverage

# KNOWLEDGE_REQUIRED mirrors CI: coverage is 100%, so a missing knowledge.ts must fail, not warn.
printf '\n\033[1m▶ build (KNOWLEDGE_REQUIRED=true)\033[0m\n'
if KNOWLEDGE_REQUIRED=true npm run build; then
  PASSED+=("build")

  # These read dist/, so they are only meaningful once the build succeeded.
  step "platform health"     npm run health
  step "query coverage"      npm run check:queries
  step "tool craft"          npm run check:craft
  step "quality guardian"    npm run quality:pr
else
  FAILED+=("build")
  printf '\033[31m✗ build failed — skipping health, query coverage and quality guardian (all read dist/)\033[0m\n'
fi

# Content gate for the tools this branch touched. CI runs this against the PR base; locally the
# best available equivalent is origin/main, and it is skipped when that ref is missing.
if git rev-parse --verify --quiet origin/main >/dev/null; then
  # Pathspec is 'src/tools/', not 'src/tools/*/*/': git's pathspec globbing does not expand the
  # latter, so it silently matched nothing and the gate quietly ran on zero tools. The sed picks
  # the slug out and the grep keeps only paths that really are a tool directory.
  # src/tools/_shared/ holds the shared engine widgets, and two of them have subdirectories
  # (converter/, generator/). Without the _shared filter, touching src/tools/_shared/converter/Foo.astro
  # extracts the slug "converter" and gates a tool that does not exist, which fails on every tool
  # in the catalog's worth of missing content. Shared widgets are platform code and carry no
  # per-tool content to gate.
  SLUGS=$(git diff --name-only origin/main...HEAD -- 'src/tools/' 2>/dev/null \
    | grep -E '^src/tools/[^/]+/[^/]+/' \
    | grep -v '^src/tools/_shared/' \
    | sed -E 's#^src/tools/[^/]+/([^/]+)/.*#\1#' | sort -u)
  if [[ -n "$SLUGS" ]]; then
    for slug in $SLUGS; do
      step "seo:gate $slug" npm run seo:gate -- "$slug"
    done
  else
    printf '\n\033[2m▶ seo:gate — no tool directories changed against origin/main\033[0m\n'
  fi
else
  printf '\n\033[33m▶ seo:gate skipped — no origin/main to diff against\033[0m\n'
fi

# Slowest last, and the one --fast drops. Mobile-first is a hard rule here, so the local run does
# desktop AND Pixel 5 even though the PR workflow runs chromium only for speed.
if [[ $FAST -eq 1 ]]; then
  printf '\n\033[33m▶ e2e skipped (--fast). This is NOT a done-condition; run npm run verify before committing.\033[0m\n'
else
  step "e2e (chromium + pixel5)" npm run test:e2e
fi

printf '\n\033[1m── verify summary ──\033[0m\n'
for s in "${PASSED[@]:-}"; do [[ -n "$s" ]] && printf '  \033[32m✓\033[0m %s\n' "$s"; done
for s in "${FAILED[@]:-}"; do [[ -n "$s" ]] && printf '  \033[31m✗\033[0m %s\n' "$s"; done

if [[ ${#FAILED[@]} -gt 0 ]]; then
  printf '\n\033[31m%d step(s) failed. Fix the cause; never weaken a check to pass it.\033[0m\n' "${#FAILED[@]}"
  exit 1
fi

if [[ $FAST -eq 1 ]]; then
  printf '\n\033[33mAll fast steps passed. e2e was skipped, so this is not yet shippable.\033[0m\n'
  exit 0
fi

printf '\n\033[32mAll checks passed. This matches what the PR workflow will run.\033[0m\n'
