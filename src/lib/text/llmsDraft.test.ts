import { describe, expect, it } from 'vitest';
import { buildLlmsTxt } from './llmsDraft';

const base = {
  siteName: '',
  siteUrl: '',
  purpose: '',
  contact: '',
  pagesText: '',
  usage: '',
  crawlerPolicy: '',
};

describe('buildLlmsTxt', () => {
  it('writes a minimal site with the name only', () => {
    const draft = buildLlmsTxt({ ...base, siteName: 'Ada Tools' });
    expect(draft.text.startsWith('# Ada Tools\n')).toBe(true);
    expect(draft.text).not.toContain('## Contact');
    expect(draft.omitted).toContain('Contact');
    expect(draft.omitted).toContain('Tools');
  });

  it('lists several tools and resolves a site-relative URL', () => {
    const draft = buildLlmsTxt({
      ...base,
      siteName: 'Ada Tools',
      siteUrl: 'https://ada.example/',
      purpose: 'Small browser tools.',
      pagesText: 'Formatter | /format/\nCounter | https://other.example/count/',
    });
    expect(draft.text).toContain('> Small browser tools.');
    expect(draft.text).toContain('- [Formatter](https://ada.example/format/)');
    expect(draft.text).toContain('- [Counter](https://other.example/count/)');
    expect(draft.omitted).not.toContain('Tools');
  });

  it('keeps special characters in the purpose and strips brackets from a name', () => {
    const draft = buildLlmsTxt({
      ...base,
      siteName: 'A & B',
      purpose: 'Uses <local> checks.',
      pagesText: 'JSON [live] | /json/',
      siteUrl: 'https://ada.example',
    });
    expect(draft.text).toContain('# A & B');
    expect(draft.text).toContain('> Uses <local> checks.');
    expect(draft.text).toContain('- [JSON live](https://ada.example/json/)');
  });

  it('omits blank optional sections', () => {
    const draft = buildLlmsTxt({
      ...base,
      siteName: 'Ada',
      contact: '  ',
      usage: 'Paste it at /llms.txt.',
    });
    expect(draft.text).toContain('## Usage');
    expect(draft.text).not.toContain('## Contact');
    expect(draft.omitted).toContain('Contact');
    expect(draft.omitted).not.toContain('Usage');
  });
});
