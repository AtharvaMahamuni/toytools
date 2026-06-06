/**
 * SearchConsoleProvider interface — stub for future Google Search Console integration.
 * Current implementation: NullSearchConsoleProvider returns empty data everywhere.
 * Future: GoogleSearchConsoleProvider implements this interface with real API calls.
 */
export interface SearchConsoleProvider {
  getIndexedPages(): Promise<string[]>;
  getImpressions(page: string): Promise<number>;
  getClicks(page: string): Promise<number>;
  getQueries(page: string): Promise<string[]>;
}

export class NullSearchConsoleProvider implements SearchConsoleProvider {
  async getIndexedPages(): Promise<string[]> { return []; }
  async getImpressions(_page: string): Promise<number> { return 0; }
  async getClicks(_page: string): Promise<number> { return 0; }
  async getQueries(_page: string): Promise<string[]> { return []; }
}

// Default export for use in workflows
export const searchConsole: SearchConsoleProvider = new NullSearchConsoleProvider();
