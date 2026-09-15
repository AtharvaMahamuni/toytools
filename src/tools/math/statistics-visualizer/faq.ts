import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'statistics-visualizer-faq-1',
    question: 'How do I calculate mean, median, and mode from a list of numbers?',
    answer:
      'Paste the numbers separated by commas, spaces, or new lines. The mean is the average (sum divided by count). The median is the middle value after sorting. The mode is the value with the highest frequency; if every value appears once, there is no mode. This statistics visualizer shows all three next to a histogram and box plot so you can see the shape, not only the table.',
  },
  {
    id: 'statistics-visualizer-faq-2',
    question: 'What is the difference between sample and population standard deviation?',
    answer:
      'Sample standard deviation divides the squared deviations by n − 1. Use it when the list is a sample from a larger group (most homework and science labs). Population standard deviation divides by n. Use it when the list is the entire group you care about. Switch the control under the paste box; the chart stays the same while the SD and variance update.',
  },
  {
    id: 'statistics-visualizer-faq-3',
    question: 'How do I read the histogram and box plot together?',
    answer:
      'The histogram bars show how many values fall in each equal-width bin across the range. Tall bars mean a cluster; empty bins mean a gap. The box plot under it marks the five-number summary: minimum, Q1, median, Q3, and maximum. The box spans Q1 to Q3 (the middle half of the data). Dots outside the whiskers are Tukey outliers (beyond 1.5 × IQR from the quartiles).',
  },
  {
    id: 'statistics-visualizer-faq-4',
    question: 'Is my data uploaded to a server?',
    answer:
      'No. Every calculation and every chart runs in your browser. Class scores, survey responses, and lab measurements never leave the tab. There is no account and no upload step. Once the page has loaded, it keeps working offline.',
  },
  {
    id: 'statistics-visualizer-faq-5',
    question: 'How are quartiles and the interquartile range calculated?',
    answer:
      'After sorting, the median splits the list. Q1 is the median of the lower half and Q3 is the median of the upper half, using inclusive Tukey hinges (each half includes the overall median when n is odd). The interquartile range is Q3 − Q1. That IQR is the length of the box and the scale for Tukey outlier fences.',
  },
  {
    id: 'statistics-visualizer-faq-6',
    question: 'Why does my mean differ from my median?',
    answer:
      'A few extreme values pull the mean toward the tail while the median stays at the middle rank. When the mean sits above the median, the distribution leans right. When it sits below, it leans left. The histogram makes that skew visible; a table of summary numbers alone hides it.',
  },
  {
    id: 'statistics-visualizer-faq-7',
    question: 'Can I paste numbers with decimals or negatives?',
    answer:
      'Yes. Decimals like 3.14 and negatives like −2 are fine. Separate values with commas, spaces, semicolons, pipes, or new lines. Tokens that are not numbers (words, empty cells) stop the parse so you can fix the paste instead of getting a silent wrong chart.',
  },
  {
    id: 'statistics-visualizer-faq-8',
    question: 'How is this different from a standard deviation calculator that only shows a table?',
    answer:
      'Those pages print mean, median, and SD as rows of text, after uploading your paste. Here the same numbers appear as cards, and a histogram plus box plot draw the distribution in the same view. Skew and outliers show up as shape, not as extra arithmetic you have to imagine.',
  },
  {
    id: 'statistics-visualizer-faq-9',
    question: 'What should I do after I have the five-number summary?',
    answer:
      'If you are turning counts of outcomes into odds, open the Probability Lab. If you need combinations or permutations for a counting problem, use the Combinations and Permutations Calculator. For exact fraction work instead of decimals, use the Fraction Calculator.',
  },
];
