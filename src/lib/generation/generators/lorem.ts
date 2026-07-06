// Lorem ipsum generator strategy.
//
// Classic placeholder text. Builds words, sentences, or paragraphs from the traditional lorem word
// bank. Sentence and paragraph lengths vary within natural ranges (secure-random), the first letter
// of each sentence is capitalised, and occasional commas are inserted so the output reads like real
// prose rather than a flat word list. "Start with Lorem ipsum" pins the familiar opening phrase.

import type { Generator, GenerationResult, GeneratorOptions } from '../types';
import { secureInt, pick } from '../utils';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error', 'voluptatem',
  'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae',
  'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
];

const LOREM_OPENING = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** A random word not equal to the classic opening bias (keeps body text varied). */
function randomWords(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(pick(WORDS));
  return out;
}

/** One sentence of 6..14 words with a couple of commas, capitalised, terminated with a period. */
function makeSentence(): string {
  const len = 6 + secureInt(9);
  const words = randomWords(len);
  // Insert 0..2 commas at interior positions.
  const commas = secureInt(3);
  for (let i = 0; i < commas; i++) {
    const pos = 1 + secureInt(Math.max(1, words.length - 2));
    words[pos] = words[pos] + ',';
  }
  return capitalize(words.join(' ')).replace(/,$/, '') + '.';
}

function makeParagraph(): string {
  const sentences = 3 + secureInt(4); // 3..6 sentences
  const out: string[] = [];
  for (let i = 0; i < sentences; i++) out.push(makeSentence());
  return out.join(' ');
}

export const lorem: Generator = {
  id: 'lorem-ipsum',
  family: 'placeholder',
  autoGenerate: true,
  live: true,
  fields: [
    {
      id: 'unit',
      label: 'Generate',
      type: 'select',
      default: 'paragraphs',
      options: [
        { value: 'paragraphs', label: 'Paragraphs' },
        { value: 'sentences', label: 'Sentences' },
        { value: 'words', label: 'Words' },
      ],
    },
    { id: 'count', label: 'How many', type: 'number', default: 5, min: 1, max: 100, step: 1 },
    { id: 'startWithLorem', label: 'Start with "Lorem ipsum dolor sit amet"', type: 'boolean', default: true, group: 'Options' },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const unit = String(opts.unit ?? 'paragraphs');
    const count = Math.max(1, Math.min(100, Math.round(Number(opts.count) || 5)));
    const startWithLorem = bool(opts.startWithLorem, true);

    let text = '';
    if (unit === 'words') {
      const words = startWithLorem ? [...LOREM_OPENING] : [];
      while (words.length < count) words.push(pick(WORDS));
      const sliced = words.slice(0, count);
      text = capitalize(sliced.join(' '));
    } else if (unit === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) sentences.push(makeSentence());
      if (startWithLorem && sentences.length) {
        sentences[0] = 'Lorem ipsum dolor sit amet, ' + sentences[0].charAt(0).toLowerCase() + sentences[0].slice(1);
      }
      text = sentences.join(' ');
    } else {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) paragraphs.push(makeParagraph());
      if (startWithLorem && paragraphs.length) {
        paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0];
      }
      text = paragraphs.join('\n\n');
    }

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return {
      ok: true,
      kind: 'text',
      text,
      meta: [
        { label: 'Words', value: String(wordCount) },
        { label: 'Characters', value: String(text.length) },
      ],
    };
  },
};
