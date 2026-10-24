// Category filter state for the Home directory and /search/ chips.
//
// The state is the ?cat=<category slug> query parameter and nothing else: no localStorage, no
// sessionStorage. A chip click PUSHES a history entry (so Back undoes a filter), while the
// /search/ text box keeps using replaceState for ?q= (typing should not flood history).
// The canonical tag is built from the plain page URL at build time, so ?cat never becomes indexable.

/** The active slug from a query string, or null for "All" (missing, empty or unknown slug). */
export function parseCat(search: string, valid: readonly string[]): string | null {
  const slug = new URLSearchParams(search).get('cat');
  return slug && valid.includes(slug) ? slug : null;
}

/** Tapping the active chip, or "All" (empty slug), clears the filter. */
export function toggleCat(current: string | null, clicked: string): string | null {
  return !clicked || clicked === current ? null : clicked;
}

/** The same URL with ?cat set to slug, or removed for null. Other params (e.g. ?q) survive. */
export function catUrl(href: string, slug: string | null): string {
  const url = new URL(href);
  if (slug) url.searchParams.set('cat', slug);
  else url.searchParams.delete('cat');
  return url.toString();
}

/** Live-region text, e.g. "Showing 12 Finance tools". */
export function announceCat(count: number, name: string | null): string {
  const noun = count === 1 ? 'tool' : 'tools';
  return name ? `Showing ${count} ${name} ${noun}` : `Showing all ${count} ${noun}`;
}
