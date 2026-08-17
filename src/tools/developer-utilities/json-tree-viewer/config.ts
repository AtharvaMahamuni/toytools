import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-tree-viewer',
  name: 'JSON Tree Viewer',
  seoTitle: 'JSON Tree Viewer — Visualize & Explore JSON Online',
  description: 'Visualize JSON as a collapsible tree. Explore structure, search keys and values, and copy any node path or value. Fast, private, and free.',
  tagline: 'Explore JSON as a collapsible tree, and copy any path or value.',
  categorySlug: 'developer-utilities',
  tags: ['json tree viewer', 'json viewer', 'json visualizer', 'view json', 'json explorer', 'json tree', 'collapsible json', 'developer'],
  isNew: true,
  updatedAt: '2026-06-17',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-tree-viewer',
  toolGroup: 'json-tools',
  relatedTools: ['json-formatter', 'json-minifier', 'json-validator'],
  guide: {
    slug: 'json-tree-viewer',
    categorySlug: 'developer-utilities',
    title: 'JSON Tree Viewer: Explore JSON Visually',
    description: 'Learn how a tree viewer reveals JSON structure, how to search nested data, and how to copy the dot path or JSONPath of any value.',
    readMinutes: 5,
    updatedAt: '2026-06-17',
  },
};
