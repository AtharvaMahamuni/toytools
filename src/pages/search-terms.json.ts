// The term half of the search catalog. dist/search-index.json is fetched on the first search
// and carries only slug, name, and interned ids. This file is the second request, and only when
// that name catalog does not already answer the query. Same order as the catalog's `t` array.

import type { APIRoute } from 'astro';
import { buildSearchTerms } from '@lib/search';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(buildSearchTerms()), {
    headers: { 'Content-Type': 'application/json' },
  });
};
