// What Google Analytics is told about the page's address.
//
// Tools with auto URL state (src/lib/url-state.ts) keep their inputs in the query string, and the
// search page keeps the search in `?q=`. Left alone, gtag copies the full address into
// page_location on every hit, and the previous page's full address (document.referrer, which the
// browser sends in full for same-origin navigations) into page_referrer. So both are cut back to
// origin + path before gtag ever sees them: a hit can say WHICH page, never WHAT was typed there.
//
// The hash goes too. Nothing writes inputs to it today, but it is part of the address, and it is
// cheaper to never send it than to audit every future use.

/** A URL without its query string or hash. Works on any string, including relative and empty. */
export function stripQueryAndHash(url: string): string {
  return url.split(/[?#]/)[0];
}

/** The two parts of a location page_location is built from. */
export interface PageAddress {
  readonly origin: string;
  readonly pathname: string;
}

/** The fields passed to `gtag('config', id, fields)`. */
export interface GtagPageFields {
  page_location: string;
  page_referrer?: string;
}

/**
 * page_location is origin + pathname, never the query or hash. page_referrer is the referrer with
 * its query and hash removed, or omitted when there is no referrer (gtag then sends none).
 */
export function gtagPageFields(loc: PageAddress, referrer: string): GtagPageFields {
  const fields: GtagPageFields = { page_location: loc.origin + loc.pathname };
  const ref = stripQueryAndHash(referrer);
  if (ref) fields.page_referrer = ref;
  return fields;
}
