// RIE registries — the single place providers/analyzers/scorers are wired. Adding a provider is one
// import + one array entry here (nothing else changes), mirroring src/data/registry.ts. The analyzer
// and scorer name lists are declarative metadata used by the validator and docs.

import type { Provider } from './models/provider';
import { seedDatasetProvider } from './providers/seed-dataset/index';
import { autocompleteProvider } from './providers/autocomplete/index';
import { peopleAlsoAskProvider } from './providers/people-also-ask/index';
import { relatedSearchesProvider } from './providers/related-searches/index';
import { searchConsoleProvider } from './providers/search-console/index';
import { redditProvider } from './providers/reddit/index';
import { githubProvider } from './providers/github/index';
import { stackoverflowProvider } from './providers/stackoverflow/index';
import { hackernewsProvider } from './providers/hackernews/index';
import { producthuntProvider } from './providers/producthunt/index';
import { competitorProvider } from './providers/competitor/index';
import { documentationProvider } from './providers/documentation/index';
import { mdnProvider } from './providers/mdn/index';
import { npmProvider } from './providers/npm/index';
import { w3cProvider } from './providers/w3c/index';
import { browserApisProvider } from './providers/browser-apis/index';

/** Every registered provider. seed-dataset is the only one with data today; the rest are live seams. */
export const PROVIDERS: Provider[] = [
  seedDatasetProvider,
  autocompleteProvider,
  peopleAlsoAskProvider,
  relatedSearchesProvider,
  searchConsoleProvider,
  redditProvider,
  githubProvider,
  stackoverflowProvider,
  hackernewsProvider,
  producthuntProvider,
  competitorProvider,
  documentationProvider,
  mdnProvider,
  npmProvider,
  w3cProvider,
  browserApisProvider,
];

/** Declarative analyzer pipeline order (for docs + the validator's completeness check). */
export const ANALYZERS = [
  'deduplicate',
  'intent',
  'transformation',
  'workflow',
  'related-tools',
  'opportunity-score',
  'cluster',
  'engine-match',
  'missing-engine',
  'topic-cluster',
  'gaps',
  'trend',
  'guide-generator',
  'faq-generator',
  'roadmap',
  'craft-debt',
  'io-graph',
  'latent-demand',
] as const;

/** Declarative scorer list. Each is a 0–1 signal blended into finalScore (weights in config.ts). */
export const SCORERS = [
  'demand',
  'competition',
  'evergreen',
  'implementation',
  'engine-reuse',
  'seo',
  'localization',
  'algorithmic-fit',
  'corroboration',
  'confidence',
] as const;
