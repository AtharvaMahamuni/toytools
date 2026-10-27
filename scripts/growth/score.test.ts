import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  controlLabels,
  faqAnswers,
  formatGrowthReport,
  guideProse,
  isToolSlug,
  scoreContent,
  scoreDepth,
  growthBand,
  scoreGrowth,
  scoreIntent,
  scoreInteraction,
  scoreNiche,
  stringField,
  type GrowthResearch,
  type GrowthSources,
} from './score';

function research(overrides: Partial<GrowthResearch> = {}): GrowthResearch {
  return {
    contentGaps: [],
    competitorHeadings: [],
    redditQuestions: [],
    redditDemandScore: 0,
    dataConfidence: 0,
    sampleSize: 0,
    ...overrides,
  };
}

function sources(overrides: Partial<GrowthSources> = {}): GrowthSources {
  return {
    slug: 'sample',
    title: 'Sample Tool',
    research: null,
    widgetSource: null,
    faqSource: null,
    knowledgeSource: null,
    guideSource: null,
    ...overrides,
  };
}

describe('scoreNiche', () => {
  it('stays blank when there is no research file', () => {
    expect(scoreNiche(null).score).toBeNull();
  });

  it('stays blank when the SERP corpus recorded nothing', () => {
    expect(scoreNiche(research()).score).toBeNull();
  });

  it('reads a crowded SERP as 0 and does not let weak Reddit demand lower an open one', () => {
    expect(scoreNiche(research({
      competitorHeadings: ['a', 'b', 'c', 'd', 'e', 'f'],
      contentGaps: ['g'],
      dataConfidence: 1,
      sampleSize: 20,
      redditDemandScore: 10,
    })).score).toBe(0);

    const open = scoreNiche(research({
      competitorHeadings: [],
      contentGaps: ['a', 'b', 'c'],
      dataConfidence: 1,
      sampleSize: 20,
      redditDemandScore: 0,
    }));
    expect(open.score).toBe(2);
    expect(open.note).toContain('does not change');
  });

  it('does not treat a missing Reddit sample as low demand', () => {
    const row = scoreNiche(research({
      contentGaps: ['a', 'b', 'c', 'd'],
      dataConfidence: 0,
      sampleSize: 0,
    }));
    expect(row.score).toBe(2);
    expect(row.note).toContain('not applied');
  });

  it('lifts a mixed SERP when collected demand is high and a gap exists', () => {
    const row = scoreNiche(research({
      competitorHeadings: ['a', 'b', 'c', 'd'],
      contentGaps: ['e', 'f'],
      dataConfidence: 0.5,
      sampleSize: 10,
      redditDemandScore: 60,
    }));
    expect(row.score).toBe(2);
    expect(row.note).toContain('lifts');
  });

  it('does not lift when confidence is below 0.5', () => {
    const row = scoreNiche(research({
      competitorHeadings: ['a', 'b', 'c', 'd'],
      contentGaps: ['e', 'f'],
      dataConfidence: 0.49,
      sampleSize: 10,
      redditDemandScore: 90,
    }));
    expect(row.score).toBe(1);
    expect(row.note).toContain('not applied');
  });
});

describe('scoreIntent', () => {
  it('stays blank without question clusters and never prints the topic', () => {
    expect(scoreIntent('Word Counter', null).score).toBeNull();
    const secret = 'supercalifragilistic secret phrase';
    const row = scoreIntent('Word Counter Online', research({
      redditQuestions: [{ topic: secret }],
    }));
    expect(row.score).toBe(0);
    expect(row.note).not.toContain('supercalifragilistic');
    expect(formatGrowthReport(scoreGrowth(sources({
      title: 'Word Counter Online',
      research: research({ redditQuestions: [{ topic: secret }] }),
    })))).not.toContain('supercalifragilistic');
  });

  it('scores one shared token as 1 and two as 2', () => {
    expect(scoreIntent('Word Counter', research({
      redditQuestions: [{ topic: 'How many word count limits' }],
    })).score).toBe(1);
    expect(scoreIntent('Word Counter', research({
      redditQuestions: [{ topic: 'Word counter for essays' }],
    })).score).toBe(2);
  });
});

describe('page text counts', () => {
  it('reads FAQ answers and knowledge arrays', () => {
    expect(faqAnswers("answer: 'one two three'\nanswer: `four five`")).toEqual(['one two three', 'four five']);
    expect(stringField("commonMistakes: ['forgot the unit', 'used the wrong base']", 'commonMistakes')).toEqual([
      'forgot the unit',
      'used the wrong base',
    ]);
  });

  it('needs five long FAQs, a mistake, and a number for depth 2', () => {
    const long = 'This answer explains the control with a concrete case and enough detail to teach the rule before anyone types a single value into the field on the page itself today. ';
    const faq = Array.from({ length: 5 }, (_, i) => `answer: '${long} Case ${i + 1}.'`).join('\n');
    const knowledge = "commonMistakes: ['People reset the goal and expect the old count.']\nrealWorldUseCases: ['A 500 word essay.']";
    expect(scoreDepth(faq, knowledge, null).score).toBe(2);
    expect(scoreDepth(faq, null, null).score).toBe(1);
    expect(scoreDepth("answer: 'Too short.'", null, null).score).toBe(0);
  });

  it('matches widget labels and ignores generic button names', () => {
    const widget = `
      <button aria-label="Clear">Clear</button>
      <label for="goal">Word goal</label>
      <button>Download Report</button>
      label: 'Reading Time'
    `;
    expect(controlLabels(widget)).toEqual(['Download Report', 'Reading Time', 'Word goal']);
    expect(scoreContent(['Word goal'], 'Set a word goal before you paste.').score).toBe(2);
    const many = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
    expect(scoreContent(many, many.join(' ')).note).toContain('and 1 more');
    expect(scoreContent(['Word goal', 'Reading Time', 'Top Words'], 'Set a word goal.').score).toBe(1);
    expect(scoreContent(['Word goal'], 'Nothing about the controls.').score).toBe(0);
    expect(scoreContent([], '').score).toBeNull();
  });
});

describe('scoreInteraction', () => {
  it('scores a slider or canvas as 1 and leaves a plain form blank', () => {
    expect(scoreInteraction('<input type="range" />').score).toBe(1);
    expect(scoreInteraction('<canvas id="plot"></canvas>').score).toBe(1);
    expect(scoreInteraction('<div draggable="true"></div>').score).toBe(1);
    expect(scoreInteraction('addEventListener("pointerdown", release)').score).toBeNull();
    expect(scoreInteraction('<input type="number" />').score).toBeNull();
    expect(scoreInteraction(null).score).toBeNull();
  });

  it('never emits 2', () => {
    const row = scoreGrowth(sources({
      widgetSource: '<canvas></canvas><input type="range"><div draggable="true"></div>',
    }));
    expect(row.interaction.score).toBe(1);
  });
});

describe('growthBand', () => {
  it('sends a complete 10 to the seo-content pipeline only when the floor passes', () => {
    expect(growthBand(10, [], 'pass').action).toBe('Run the seo-content pipeline.');
    expect(growthBand(10, [], 'fail').priority).toBe('high');
    expect(growthBand(7, [], 'pass').priority).toBe('medium');
    expect(growthBand(6, [], 'fail').priority).toBe('low');
  });
});

describe('scoreGrowth', () => {
  it('holds the band when interaction is blank and keeps performance at 0', () => {
    const long = 'This answer explains the control with a concrete case and enough detail to teach the rule before anyone types a single value into the field on the page itself today. ';
    const faq = Array.from({ length: 5 }, () => `answer: '${long} The word goal is 500.'`).join('\n');
    const row = scoreGrowth(sources({
      title: 'Word Counter',
      research: research({
        contentGaps: ['a', 'b', 'c'],
        redditQuestions: [{ topic: 'Word counter for school' }],
        dataConfidence: 1,
        sampleSize: 20,
        redditDemandScore: 80,
      }),
      widgetSource: '<label>Word goal</label>',
      faqSource: faq,
      knowledgeSource: "commonMistakes: ['Clearing the goal also clears the text.']\nrealWorldUseCases: ['500 words.']",
      guideSource: 'Set the word goal, then type.',
    }));
    expect(row.perf.score).toBe(0);
    expect(row.interaction.score).toBeNull();
    expect(row.priority).toBe('incomplete');
    expect(row.qualityFloor).toBe('pass');
    expect(row.action).toContain('interaction');
    expect(formatGrowthReport(row)).toContain('| sample |');
    expect(formatGrowthReport(row)).toContain('finalScore');
  });

  it('marks a fully scored low row as do-not-expand when the floor fails', () => {
    const row = scoreGrowth(sources({
      widgetSource: '<input type="range" aria-label="Rate" />',
      research: research({
        competitorHeadings: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        contentGaps: ['h'],
        redditQuestions: [{ topic: 'unrelated cluster topic' }],
        dataConfidence: 1,
        sampleSize: 12,
        redditDemandScore: 10,
      }),
      faqSource: "answer: 'Short.'",
    }));
    expect(row.priority).toBe('low');
    expect(row.qualityFloor).toBe('fail');
    expect(row.action).toContain('Do not expand');
  });
});

describe('research files are gitignored', () => {
  it('Niche and Intent are blank, not zero, and say why, when research.json is missing', () => {
    const row = scoreGrowth(sources({ research: null }));
    expect(row.niche.score).toBeNull();
    expect(row.intent.score).toBeNull();
    expect(row.niche.note).toMatch(/gitignored/);
    expect(row.intent.note).toMatch(/gitignored/);
    expect(row.priority).toBe('incomplete');
  });
});

describe('guideProse', () => {
  const guide = `---
import Cta from '../Cta.astro';
const n = 42;
---
<h2 class="g">Why it matters</h2>
<p>Paste the text {n} and read it.</p>
<style>.g { margin: 2px; }</style>`;

  it('keeps the visible prose and drops frontmatter, expressions, tags and styles', () => {
    expect(guideProse(guide)).toBe('Why it matters Paste the text and read it.');
    expect(guideProse(null)).toBe('');
  });

  it('a guide whose only digits are markup does not count as a numbered example', () => {
    expect(scoreDepth(null, null, guide).note).toMatch(/no numbered example/);
    expect(scoreDepth(null, null, `${guide}\n<p>Trim 3 lines.</p>`).note).toMatch(/a numbered example/);
  });
});

describe('growth:score slug check', () => {
  it('accepts tool slugs', () => {
    for (const ok of ['roman-numeral-converter', 'connect-4', 'a']) expect(isToolSlug(ok), ok).toBe(true);
  });

  it('rejects paths and malformed slugs', () => {
    for (const bad of ['../x', '../../etc/passwd', 'a/b', '/abs', 'Roman', 'a--b', '-a', 'a-', 'a b', '', 'a.b', 'a\\b']) {
      expect(isToolSlug(bad), bad).toBe(false);
    }
  });

  it('the CLI refuses a path-like slug before looking for a tool dir', () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
    const run = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/growth-score.ts', '../src'], { cwd: root, encoding: 'utf8' });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('"../src" is not a tool slug.');
  }, 30_000);
});
