import type { StructuredDataTool } from './types';

// The tree itself is rendered client-side from the JSON Explorer Core; this engine impl
// exists so the tool's `processorId` resolves in the registry and so copy/download have a
// canonical payload — the pretty-printed JSON (2-space indent). Invalid JSON returns an error.
export const jsonTreeViewer: StructuredDataTool = {
  id: 'json-tree-viewer',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      return { ok: true, output: JSON.stringify(JSON.parse(input), null, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
