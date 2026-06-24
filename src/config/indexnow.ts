// IndexNow configuration — the single source of truth for the IndexNow integration.
//
// IndexNow lets us notify participating search engines (Bing, Yandex, Naver, Seznam, …) the
// moment content changes, instead of waiting for a crawl. It is complementary to robots.txt,
// the sitemaps, and Google/Bing webmaster tools — it replaces none of them.
//
// The IndexNow key is NOT a secret: it is published publicly at https://<host>/<key>.txt so
// search engines can verify ownership. That is why it lives as a committed constant here
// (env-overridable) and the matching key file lives in public/ — see public/<key>.txt.
//
// Everything is env-driven with safe defaults so the pipeline fails gracefully when disabled.

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? '81433a8e29464f45ab05cb1242e6483a';

export const INDEXNOW_HOST = process.env.INDEXNOW_HOST ?? 'toytoolsapp.com';

/** Filename served at the site root, content equal to the key. */
export const INDEXNOW_KEY_FILENAME = `${INDEXNOW_KEY}.txt`;

/** Enabled by default; set INDEXNOW_ENABLED=false to make the whole pipeline a no-op. */
export const INDEXNOW_ENABLED = (process.env.INDEXNOW_ENABLED ?? 'true') !== 'false';

/** Canonical absolute site origin (matches astro.config.mjs `site`). */
export const INDEXNOW_SITE = process.env.ASTRO_SITE ?? 'https://toytoolsapp.com';

/** IndexNow aggregator endpoint — fans the submission out to all participating engines. */
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Absolute URL of the published key file (used as `keyLocation` in the payload). */
export const INDEXNOW_KEY_LOCATION = new URL(`/${INDEXNOW_KEY_FILENAME}`, `https://${INDEXNOW_HOST}`).href;
