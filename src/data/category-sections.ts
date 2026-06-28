// Category Sections — declarative pattern → section map for the category pages.
// CategoryToolList groups a category's tools into titled sections by their `pattern`
// (an unknown pattern falls into "Other"). Headers render only when a category has
// more than one section, so single-section categories (Productivity, Number) stay flat.
// Add a row here when registering a new pattern in src/data/engines.ts.

export interface CategorySection {
  title: string;
  order: number;
}

export const sectionsByPattern: Record<string, CategorySection> = {
  'text-metric':          { title: 'Counting & Analysis',    order: 1 },
  'text-transform':       { title: 'Case Conversion',        order: 2 },
  'text-cleanup':         { title: 'Cleanup',                order: 3 },
  'text-interactive':     { title: 'Find & Compare',         order: 4 },
  'encode-decode':        { title: 'Encode & Decode',        order: 1 },
  'hash':                 { title: 'Hashing',                order: 2 },
  'structured-transform': { title: 'JSON & Structured Data', order: 3 },
  'structured-validate':  { title: 'JSON & Structured Data', order: 3 },
  'token-decode':         { title: 'Tokens & JWT',          order: 4 },
  'calculate':            { title: 'Calculators',            order: 1 },
  'stateful':             { title: 'Focus & Notes',          order: 1 },
};
