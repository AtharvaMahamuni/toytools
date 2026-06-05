export interface CompetitorPage {
  url: string;
  title: string;
  description: string;

  h1: string[];
  h2: string[];
  h3: string[];

  tables: number;
  lists: number;

  faqQuestions: string[];

  wordCount: number;

  schemaTypes: string[];
}
