export interface Category {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
  accent?: string;
  segment: string; // short URL path segment used in /tools/[segment]/[slug]/
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  tags: string[];
  isNew?: boolean;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;       // anchor-safe slug, e.g. "b64-faq-1"
  question: string;
  answer: string;
}

export interface EcosystemEntry {
  guide?: {
    slug: string;
    categorySlug: string; // URL segment, e.g. "developer"
    title: string;
    description: string;
    readMinutes: number;
    updatedAt: string;    // display string, e.g. "Jun 2026"
  };
  faq?: {
    slug: string;
    categorySlug: string;
  };
}
