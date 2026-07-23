import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'heart-rate-zone-calculator-faq-1',
    question: 'What are the five heart rate zones?',
    answer: 'They are effort bands defined as ranges of your maximum heart rate. Zone 1 (50 to 60 percent) is a very light warm-up. Zone 2 (60 to 70 percent) is easy aerobic work, often called the base or fat-burning zone. Zone 3 (70 to 80 percent) is steady moderate effort. Zone 4 (80 to 90 percent) is hard, near your threshold. Zone 5 (90 to 100 percent) is an all-out maximum effort you can only hold briefly.',
  },
  {
    id: 'heart-rate-zone-calculator-faq-2',
    question: 'What is my fat-burning heart rate zone?',
    answer: 'It is Zone 2, roughly 60 to 70 percent of your maximum heart rate, and the calculator shows the exact beats per minute for you. At this easy pace your body uses a higher proportion of fat for fuel. That said, harder sessions burn more total calories, so the real value of Zone 2 is building your aerobic base comfortably, not some magic fat-loss switch.',
  },
  {
    id: 'heart-rate-zone-calculator-faq-3',
    question: 'How accurate is 220 minus age?',
    answer: 'It is a convenient rule of thumb, not a precise measurement. Real maximum heart rates vary by around ten beats either side of the formula, so two people the same age can differ noticeably. The Tanaka formula, 208 minus 0.7 times age, fits the population a little better, especially for older adults. For a truly accurate maximum, a supervised test or a chest-strap monitor beats any formula.',
  },
  {
    id: 'heart-rate-zone-calculator-faq-4',
    question: 'What is the Karvonen method?',
    answer: 'It personalises your zones using your heart-rate reserve, the gap between your resting and maximum heart rates. Instead of taking a flat percentage of your max, it takes a percentage of that reserve and adds your resting rate back on. Because a fitter person has a lower resting heart rate and a larger reserve, the Karvonen zones reflect individual fitness. Add your resting heart rate and the calculator switches to it automatically.',
  },
  {
    id: 'heart-rate-zone-calculator-faq-5',
    question: 'How do I measure my resting heart rate?',
    answer: 'Measure it first thing in the morning before getting up, when you are calm and still. Count your pulse for a full minute, or use a fitness tracker that logs overnight resting rate. Typical adult values fall between 50 and 80 beats per minute, with fitter people lower. Enter that number and the zones become noticeably more tailored to you.',
  },
  {
    id: 'heart-rate-zone-calculator-faq-6',
    question: 'Is my data private?',
    answer: 'Yes. The whole calculation runs in your browser. Your age and resting heart rate are never sent anywhere, and the values are only stored on your own device so the tool remembers them next time. Clearing your browser storage removes them.',
  },
];
