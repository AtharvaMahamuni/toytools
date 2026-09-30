import { describe, expect, it } from 'vitest';
import { toolAbstract } from './abstract';
import { toolFacts } from '@lib/llms/facts';
import { tools } from '@data/registry';

const bySlug = (slug: string) => tools.find(t => t.slug === slug)!;

describe('toolAbstract', () => {
  it('is the citation copy the visible block used to show, one sentence after another', () => {
    expect(toolAbstract(toolFacts(bySlug('json-formatter')))).toBe(
      'Use this JSON Formatter when someone needs to format or inspect JSON without uploading it. ' +
        'Runs entirely on your device. Nothing is uploaded. ' +
        'It does not call an AI model or interpret what the data means.',
    );
    expect(toolAbstract(toolFacts(bySlug('prompt-packer')))).toBe(
      'Use Prompt Packer when someone needs separate prompt fields joined into one block, without a model writing the text. ' +
        'Runs entirely on your device. Nothing is uploaded. ' +
        'It does not write, score, or rewrite the prompt, or send the text to an AI model.',
    );
  });

  it('exists exactly for the tools that set a citation', () => {
    const cited = tools.filter(t => t.citation).map(t => t.slug);
    const withAbstract = tools.filter(t => toolAbstract(toolFacts(t))).map(t => t.slug);
    expect(withAbstract).toEqual(cited);
    expect(cited.length).toBeGreaterThanOrEqual(17);
  });

  it('carries each cited tool\'s problem and privacy line', () => {
    for (const tool of tools.filter(t => t.citation)) {
      const facts = toolFacts(tool);
      const abstract = toolAbstract(facts)!;
      expect(abstract.startsWith(`${tool.citation!.problem} ${facts.privacy} It does not `), tool.slug).toBe(true);
      expect(abstract.endsWith('.'), tool.slug).toBe(true);
      expect(abstract).not.toMatch(/\.\./);
    }
  });

  it('lowercases the non-goal after "It does not" and drops its own full stop', () => {
    expect(toolAbstract({ problem: 'P.', privacy: 'Q.', doesNot: 'Store your notes online.' })).toBe('P. Q. It does not store your notes online.');
    expect(toolAbstract({ problem: 'P.', privacy: 'Q.', doesNot: undefined })).toBeUndefined();
    expect(toolAbstract({ problem: undefined, privacy: 'Q.', doesNot: 'x.' })).toBeUndefined();
  });
});
