import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rtc-faq-1',
    question: 'How is reading time calculated?',
    answer:
      'Reading time is estimated by dividing the word count by an average reading speed. This tool uses 200 words per minute (wpm) as the baseline — the commonly cited average for adult silent reading of prose. At 200 wpm, a 1,000-word article reads in approximately 5 minutes. The estimate is displayed as minutes and, for longer texts, hours and minutes.',
  },
  {
    id: 'rtc-faq-2',
    question: 'What is the average reading speed for an adult?',
    answer:
      'Studies consistently find that adults read prose at 200 to 250 words per minute for comprehension. Skimming can exceed 700 wpm but with lower retention. Technical or scientific text is typically read at 100 to 150 wpm because of unfamiliar vocabulary. This tool uses 200 wpm as a conservative baseline that works well for most web content.',
  },
  {
    id: 'rtc-faq-3',
    question: 'How long does it take to read a 1,000-word article?',
    answer:
      'At 200 words per minute, a 1,000-word article takes approximately 5 minutes to read. At 250 wpm, the same article takes about 4 minutes. Reading time varies with content complexity, the reader\'s familiarity with the subject, and whether they read silently or aloud.',
  },
  {
    id: 'rtc-faq-4',
    question: 'What is the speaking time, and how is it different from reading time?',
    answer:
      'Speaking time estimates how long a text will take to read aloud or deliver as a speech. The average speaking rate is 130 to 150 words per minute — significantly slower than silent reading. A 500-word script takes about 3 to 4 minutes to deliver aloud compared to 2.5 minutes to read silently.',
  },
  {
    id: 'rtc-faq-5',
    question: 'How long should a blog post be to hit a specific reading time?',
    answer:
      'At 200 wpm: a 2-minute read is about 400 words; a 5-minute read is about 1,000 words; a 10-minute read is about 2,000 words; a 15-minute read is about 3,000 words. Most SEO practitioners target 1,500 to 2,500 words for competitive blog posts, which is a 7 to 12 minute read.',
  },
  {
    id: 'rtc-faq-6',
    question: 'Why do different reading time calculators show different estimates?',
    answer:
      'Most of the variation comes from the assumed reading speed. Some tools use 200 wpm, others use 238 wpm (a figure from a Staples study), and others allow you to set your own rate. The word count method also affects results — different counters handle punctuation and special characters differently. Small differences in estimate are expected and normal.',
  },
  {
    id: 'rtc-faq-7',
    question: 'Is reading time useful for SEO?',
    answer:
      'Displaying reading time on a blog post or article can increase click-through rates and reduce bounce rates, because readers set accurate expectations. While Google does not directly use reading time as a ranking factor, engagement signals like time-on-page — which reading time affects — are considered quality indicators. Matching content length to user intent is more important than hitting a specific minute target.',
  },
  {
    id: 'rtc-faq-8',
    question: 'Does this reading time calculator upload my text?',
    answer:
      'No. All calculations run in your browser. Your text stays private and is never sent to a server. The tool is free to use with no account required, and results appear instantly.',
  },
];
