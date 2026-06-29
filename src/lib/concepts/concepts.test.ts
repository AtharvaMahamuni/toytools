import { describe, it, expect } from 'vitest';
import { buildConceptRegistry, type Concept } from './types';
import { buildExampleRegistry, examplesForRef, type WorkedExample } from '../examples/types';

const concepts: Concept[] = [
  { id: 'compound-interest', term: 'Compound interest', definition: 'Interest on interest.', relatedConcepts: ['inflation'] },
  { id: 'inflation', term: 'Inflation', definition: 'Rising prices over time.' },
];

const examples: WorkedExample[] = [
  { id: 'ci-basic', engine: 'finance', ref: 'compound-interest', title: 'Basic', inputs: { principal: 1000 }, expect: { final: 1100 } },
  { id: 'inf-basic', engine: 'finance', ref: 'inflation', title: 'Basic', inputs: { amount: 1000 } },
];

describe('concept registry', () => {
  it('builds an id -> concept map', () => {
    const map = buildConceptRegistry(concepts);
    expect(map.get('compound-interest')?.term).toBe('Compound interest');
    expect(map.size).toBe(2);
  });
});

describe('example registry', () => {
  it('builds an id -> example map', () => {
    const map = buildExampleRegistry(examples);
    expect(map.get('ci-basic')?.ref).toBe('compound-interest');
  });

  it('filters examples by engine + ref', () => {
    const found = examplesForRef(examples, 'finance', 'compound-interest');
    expect(found).toHaveLength(1);
    expect(found[0].id).toBe('ci-basic');
  });
});
