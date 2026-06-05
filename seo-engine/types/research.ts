export interface ResearchDocument {
  tool: string;

  primaryIntent: string;
  secondaryIntent: string;

  entities: string[];

  questions: string[];

  contentGaps: string[];

  competitorHeadings: string[];

  competitorFaqs: string[];

  relatedTopics: string[];

  generatedAt: string;
}

export interface SearchResult {
  url: string;
  title: string;
  description: string;
}

export interface CachedPage {
  url: string;
  fetchedAt: string;
  html: string;
}
