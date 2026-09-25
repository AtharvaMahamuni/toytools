import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const FILES = [
  'src/lib/text/promptPack.ts',
  'src/lib/text/chatClean.ts',
  'src/lib/text/contextFit.ts',
  'src/lib/text/contextModels.ts',
  'src/lib/text/llmsDraft.ts',
  'src/lib/engines/structured-data/jsonToSchema.ts',
  'src/lib/engines/structured-data/schemaValidate.ts',
  'src/tools/prep/prompt-packer/Widget.astro',
  'src/tools/prep/chat-export-cleaner/Widget.astro',
  'src/tools/prep/json-to-schema/Widget.astro',
  'src/tools/prep/json-schema-validator/Widget.astro',
  'src/tools/prep/context-fit-checker/Widget.astro',
  'src/tools/prep/llms-txt-generator/Widget.astro',
];

describe('prep tools do not transmit input', () => {
  it('has no network client in the prep engines or widgets', () => {
    for (const file of FILES) {
      const src = readFileSync(file, 'utf8');
      expect(src, file).not.toMatch(/\bfetch\s*\(/);
      expect(src, file).not.toContain('XMLHttpRequest');
      expect(src, file).not.toContain('sendBeacon');
      expect(src, file).not.toContain('axios');
      expect(src, file).not.toContain('localStorage');
    }
  });
});
