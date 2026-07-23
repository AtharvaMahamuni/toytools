import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'body-fat-calculator-faq-1',
    question: 'How does the U.S. Navy body fat method work?',
    answer: 'It estimates body fat from the circumference of a few body parts rather than from calipers or a scan. Men enter neck and waist; women add hip. Those measurements, set against your height, go into a formula fitted to underwater-weighing data. It works because fat and muscle sit differently around the waist, neck, and hips, so their sizes hint at overall composition.',
  },
  {
    id: 'body-fat-calculator-faq-2',
    question: 'Where exactly do I measure?',
    answer: 'Measure your neck just below the larynx, sloping the tape slightly down at the front. Men measure the waist horizontally at the navel; women measure at the narrowest point. Women also measure the hips at the widest point. Keep the tape level and snug against the skin without compressing it, and breathe normally rather than sucking in.',
  },
  {
    id: 'body-fat-calculator-faq-3',
    question: 'How accurate is it?',
    answer: 'For most people it lands within about three to four percentage points of a clinical measurement, which is very good for a free tape-measure method. Accuracy drops at the extremes and depends heavily on consistent measuring. Because a single reading carries that margin, the trend across several weeks tells you far more than any one number.',
  },
  {
    id: 'body-fat-calculator-faq-4',
    question: 'What is a healthy body fat percentage?',
    answer: 'It differs by sex because women naturally carry more essential fat. On the American Council on Exercise scale, the fitness range is roughly 14 to 17 percent for men and 21 to 24 percent for women, with athletes lower and the average population higher. The calculator names your band automatically once it has your measurements.',
  },
  {
    id: 'body-fat-calculator-faq-5',
    question: 'How is body fat different from BMI?',
    answer: 'BMI uses only height and weight, so it cannot tell muscle from fat. Body fat percentage measures composition directly, which is why a muscular person can have a high BMI but low body fat. If you add your bodyweight here, the tool also splits it into fat mass and lean mass, something BMI can never show.',
  },
  {
    id: 'body-fat-calculator-faq-6',
    question: 'Is my data kept private?',
    answer: 'Yes. Every calculation runs in your browser. Your measurements and weight are never uploaded, and they are only stored on your own device so the tool remembers them next time. Clearing your browser storage removes them entirely.',
  },
];
