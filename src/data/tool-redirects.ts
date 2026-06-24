// Tool URL redirects — SEO migration shim.
//
// The Developer category's URL segment was renamed `developer` → `developer-utilities`
// (commit 45f4f9f), which changed every developer tool's public URL from
// `/tool/developer/{slug}/` to `/tool/developer-utilities/{slug}/`. Google had already
// indexed the old `/tool/developer/{slug}/` URLs, so they now 404 (and GitHub Pages
// serves the noindex 404.html — surfacing as "noindex detected" in Search Console).
//
// These mappings reproduce every previously-indexed old tool URL so it serves a redirect
// stub (meta-refresh + canonical → the new tool page) instead of a 404, preserving link
// equity. The list is exactly the developer tools that existed at the time of the rename
// (recovered from git history); tools added afterwards never had a `/tool/developer/` URL
// and must NOT appear here. These stubs are intentionally noindex and in no sitemap.

export interface ToolRedirect {
  /** Historical path under /tool/, e.g. 'developer/url-encoder-decoder'. */
  oldPath: string;
  /** Tool that now hosts the content at its current (renamed-segment) URL. */
  toolSlug: string;
}

export interface CategoryRedirect {
  /** Historical path under /category/, e.g. 'developer-tools'. */
  oldSlug: string;
  /** Current category slug the old URL should redirect to. */
  categorySlug: string;
}

// The same rename also changed the category slug `developer-tools` → `developer-utilities`,
// so the previously-indexed `/category/developer-tools/` URL now 404s. Same redirect-stub
// treatment. (The other three categories kept their slugs.)
export const categoryRedirects: CategoryRedirect[] = [
  { oldSlug: 'developer-tools', categorySlug: 'developer-utilities' },
];

export const toolRedirects: ToolRedirect[] = [
  { oldPath: 'developer/base64-encoder-decoder',      toolSlug: 'base64-encoder-decoder' },
  { oldPath: 'developer/html-entity-encoder-decoder', toolSlug: 'html-entity-encoder-decoder' },
  { oldPath: 'developer/json-formatter',              toolSlug: 'json-formatter' },
  { oldPath: 'developer/json-minifier',               toolSlug: 'json-minifier' },
  { oldPath: 'developer/json-validator',              toolSlug: 'json-validator' },
  { oldPath: 'developer/md5-hash-generator',          toolSlug: 'md5-hash-generator' },
  { oldPath: 'developer/sha1-hash-generator',         toolSlug: 'sha1-hash-generator' },
  { oldPath: 'developer/sha256-hash-generator',       toolSlug: 'sha256-hash-generator' },
  { oldPath: 'developer/url-encoder-decoder',         toolSlug: 'url-encoder-decoder' },
];
