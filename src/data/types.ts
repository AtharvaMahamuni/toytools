export interface Category {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
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
