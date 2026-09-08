import { describe, expect, it } from 'vitest';
import {
  AUTHOR,
  identityGraph,
  ORG_ID,
  organizationNode,
  orgRef,
  PERSON_ID,
  personNode,
  personRef,
  SITE_ORIGIN,
} from './identity';

const LOGO = `${SITE_ORIGIN}/favicon-512.png`;

describe('identity schema', () => {
  it('uses stable production @id values', () => {
    expect(ORG_ID).toBe('https://toytoolsapp.com/#org');
    expect(PERSON_ID).toBe('https://toytoolsapp.com/#atharva');
  });

  it('Person carries sameAs for X and LinkedIn', () => {
    const person = personNode();
    expect(person['@type']).toBe('Person');
    expect(person['@id']).toBe(PERSON_ID);
    expect(person.name).toBe('Atharva');
    expect(person.sameAs).toEqual([AUTHOR.x, AUTHOR.linkedin]);
    expect(AUTHOR.x).toBe('https://x.com/athmatwt');
    expect(AUTHOR.linkedin).toBe('https://www.linkedin.com/in/atharvamahamuni');
  });

  it('Organization points at the Person as founder', () => {
    const org = organizationNode(LOGO);
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe(ORG_ID);
    expect(org.founder).toEqual({ '@id': PERSON_ID });
    expect(org.logo).toBe(LOGO);
  });

  it('identityGraph is one @graph of Organization then Person', () => {
    const graph = identityGraph(LOGO);
    const nodes = graph['@graph'] as Record<string, unknown>[];
    expect(graph['@context']).toBe('https://schema.org');
    expect(nodes.map((n) => n['@type'])).toEqual(['Organization', 'Person']);
  });

  it('refs are @id only, so pages do not duplicate the entity', () => {
    expect(orgRef()).toEqual({ '@id': ORG_ID });
    expect(personRef()).toEqual({ '@id': PERSON_ID });
  });
});
