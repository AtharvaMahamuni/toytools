// Stable Organization + Person entities for JSON-LD.
//
// Models need a person they can attach to the publisher; humans should not see a byline. The
// credit stays in the HTML (hidden) and in these nodes. @id values are the production origin on
// purpose, so a preview build still names the same entities.

export const SITE_ORIGIN = 'https://toytoolsapp.com';
export const ORG_ID = `${SITE_ORIGIN}/#org`;
export const PERSON_ID = `${SITE_ORIGIN}/#atharva`;

export const AUTHOR = {
  name: 'Atharva',
  x: 'https://x.com/athmatwt',
  linkedin: 'https://www.linkedin.com/in/atharvamahamuni',
} as const;

/** The site's own X account, signed next to "Powered by ToyTools". */
export const BRAND_X = {
  handle: '@ToytoolsApp',
  url: 'https://x.com/ToytoolsApp',
} as const;

export function personNode(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR.name,
    url: `${SITE_ORIGIN}/`,
    sameAs: [AUTHOR.x, AUTHOR.linkedin],
  };
}

export function organizationNode(logoUrl: string): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'ToyTools',
    url: `${SITE_ORIGIN}/`,
    logo: logoUrl,
    founder: { '@id': PERSON_ID },
    sameAs: [BRAND_X.url],
  };
}

/** Organization + Person as one @graph. Emitted once from BaseLayout on every page. */
export function identityGraph(logoUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(logoUrl), personNode()],
  };
}

export function orgRef(): { '@id': string } {
  return { '@id': ORG_ID };
}

export function personRef(): { '@id': string } {
  return { '@id': PERSON_ID };
}
