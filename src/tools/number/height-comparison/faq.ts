import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'hc-faq-1',
    question: 'What is a height comparison chart?',
    answer: 'A height comparison chart draws each height as a mark on one scale, so the gap is a picture rather than a subtraction you do in your head. You starts at 170 cm beside a door of 80 inches, which is 203.2 cm. The door is 33.2 cm taller, or 1 ft 1.1 in. Add a rim, a counter, or a height you type. The chart holds six marks, and you can move them left or right.',
  },
  {
    id: 'hc-faq-2',
    question: 'How do I convert 5 feet 11 inches to centimetres?',
    answer: 'Multiply the feet by 30.48 and the inches by 2.54, then add them. Five times 30.48 is 152.4. Eleven times 2.54 is 27.94. The sum is 180.34 cm, which this chart rounds to 180.3 cm and labels 5 ft 11 in. That inch, 2.54 cm, is the international inch, so a foot is exactly 30.48 cm. Type 5 ft 11 in, or 5 feet 11 inches, and the chart does the sum.',
  },
  {
    id: 'hc-faq-3',
    question: 'What does 5.11 mean in feet?',
    answer: '5.11 feet is decimal feet: 5.11 times 30.48 cm, which is 155.8 cm, about 5 ft 1.3 in. It is not 5 feet 11 inches. That height is 180.3 cm, close to 25 cm taller, and the shorter person still looks plausible on the chart. In feet mode the chart shows the short mark and offers one tap, Use 5 ft 11 in. Type 5 ft 11 in, or 5 feet 11 inches, when that is what you mean.',
  },
  {
    id: 'hc-faq-4',
    question: 'How tall is a standard interior door?',
    answer: 'A common US interior door is 80 inches tall. That is 6 ft 8 in, or 203.2 cm. It is a residential convention, not a statute, and older doors and many commercial doors differ. The chart uses 203.2 cm so the label reads 6 ft 8 in exactly. If you are checking whether you clear a doorway, measure the slab you actually walk through and type that number. The preset is only the common 80 inch door.',
  },
  {
    id: 'hc-faq-5',
    question: 'How high is a basketball rim?',
    answer: 'An NBA rim is 10 feet, which is 304.8 cm. FIBA sets the rim at 3.05 m, or 305 cm, two millimetres higher. On a chart that also holds a person, those two millimetres do not move the mark, so this chart keeps 304.8 cm and the label reads 10 ft. The thin pole with a cap is that height. It is a reference, not a drawing of one arena.',
  },
  {
    id: 'hc-faq-6',
    question: 'What is the average adult height?',
    answer: 'For US adults aged 20 and over in 2015 to 2018, the mean is 175.3 cm for men and 161.3 cm for women. That is about 5 ft 9 in and 5 ft 3.5 in. Fryar et al. published both in NCHS Series 3, Number 46 (2021), Table 11 and Table 9. A later survey lists men at 175.1 cm. This chart keeps that pair. You at 170 cm is a placeholder, not an average.',
  },
  {
    id: 'hc-faq-7',
    question: 'Why are there no celebrities on the chart?',
    answer: 'Reported heights for actors and athletes are uneven. Some are measured, some are rounded, and some are publicity. A long list also wants photos and an account, and this page has neither. The chart plots the number you type and five cited marks: a door, a rim, a counter, and the two US adult means. A building is left off on purpose, because one tower shrinks every person to a speck.',
  },
  {
    id: 'hc-faq-8',
    question: 'Does the chart upload my height?',
    answer: 'No. The marks are drawn in the browser from the numbers on the page. The page does not send them to a server, and there is no account to sign in to. The lineup stays in this browser so a refresh can restore it. Copy places a text summary on the clipboard, with both units and the gap. It does not build a link, so the heights are not written into the address bar for someone else to open.',
  },
];
