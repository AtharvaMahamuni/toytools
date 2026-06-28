# Indexing Coverage Detection

An automated, code-driven way to answer **"which of our pages has Google actually indexed?"**
without ever opening the Search Console UI. It reads the canonical URL list (the same
manifest-derived set the sitemap and IndexNow use), inspects each URL through the **Google Search
Console URL Inspection API**, and writes a bucketed coverage report plus a historical snapshot.

## Why the GSC API (and not scraping)

There is no free, reliable, ToS-compliant way to read true indexation status without a credentialed
API. `site:` scraping is against Google's terms, gets captcha'd, and returns false negatives. The
URL Inspection API returns the *same* `coverageState` the Search Console UI shows
("Submitted and indexed", "Crawled - currently not indexed", "Discovered - currently not indexed",
"Excluded by 'noindex' tag", …) — programmatically, so it runs in CI with no manual step.

Quota: **2000 inspections/day, 600/min** per property. The runner throttles to stay under both.

## One-time setup

1. **Create a service account** in a Google Cloud project and download its JSON key.
2. **Enable the Search Console API** for that project
   (`console.cloud.google.com/apis/library/searchconsole.googleapis.com`).
3. **Grant the service account access to the property:** in Search Console →
   Settings → Users and permissions → Add user → paste the service account's `client_email`
   (…@….iam.gserviceaccount.com) with at least **Restricted** (Full is fine).
4. **Provide the credentials** to the runner via environment:
   - `GSC_SITE_URL` — the verified property, e.g. `sc-domain:toytoolsapp.com` (Domain property) or
     `https://toytoolsapp.com/` (URL-prefix property). Must match exactly.
   - `GSC_SA_KEY_JSON` — the service-account JSON, inline (best for CI secrets), **or**
     `GOOGLE_APPLICATION_CREDENTIALS` — a path to the key file (best for local).

For CI, add `GSC_SITE_URL` and `GSC_SA_KEY_JSON` as repository secrets; the
`.github/workflows/indexing.yml` workflow (weekly + `workflow_dispatch`) picks them up
automatically and uploads the report as an artifact. It never runs in the deploy path and never
blocks anything.

## Usage

```sh
npm run build                          # generates dist/indexnow-urls.json (the URL list)
npm run check:indexing                 # live run — needs the env above
npm run check:indexing -- --dry-run    # validate the URL list + provider config, no API calls
npm run check:indexing -- --limit 50   # inspect only the first N URLs (quota-friendly)
```

## Output

Written under `quality-guardian/reports/`:

- `indexing/latest.json` — full records + per-URL **history** (firstDiscovered, firstIndexed,
  lastIndexed, lastCrawlTime, per-run bucket history) for trend analysis.
- `indexing/coverage-YYYY-MM-DD.json` — dated snapshot (counts + records).
- `indexing-coverage.md` — human summary: per-bucket counts + a "Not indexed" table.

Every URL is bucketed as `indexed | crawled-not-indexed | discovered-not-indexed |
excluded-noindex | unknown | error`.

## Architecture

The provider sits behind a generic seam, `quality-guardian/providers/external-signals.ts`
(`ExternalSignalProvider`), so additional sources (Bing Webmaster, IndexNow status, analytics)
can plug in without changing the runner. `GoogleSearchConsoleProvider`
(`providers/google-search-console.ts`) is the first implementation;
`scripts/check-indexing.ts` is the runner. `google-auth-library` is imported lazily inside the
auth path, so `--dry-run` works without credentials or even the dependency installed.
