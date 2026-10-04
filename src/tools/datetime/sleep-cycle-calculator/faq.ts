import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sleep-cycle-calculator-faq-1',
    question: 'What time should I go to bed for 90 minute sleep cycles?',
    answer:
      'Pick "When I wake", type the alarm, and leave the cycle at 90 minutes. Add the minutes you usually need to fall asleep. The default is 15. For a 7:00 am alarm and 15 minutes to fall asleep, a 5-cycle bedtime is 11:15 pm and a 6-cycle bedtime is 9:45 pm. The list also shows 4 cycles and 3 cycles, which are shorter nights, not better ones.',
  },
  {
    id: 'sleep-cycle-calculator-faq-2',
    question: 'Why does the list start 15 minutes before the first cycle?',
    answer:
      'Those 15 minutes are time in bed before sleep starts. A cycle is sleep, not the gap between the pillow and sleep. If you count 90 minutes backward from the alarm and skip that gap, sleep starts 15 minutes late, so the alarm rings about 15 minutes before the last cycle ends. Set the field to your own number. Zero is allowed, and the page then says the list assumes instant sleep.',
  },
  {
    id: 'sleep-cycle-calculator-faq-3',
    question: 'How many sleep cycles are in a night?',
    answer:
      'The page lists 6, 5, 4, and 3 cycles. At 90 minutes each, that is 9 hours, 7.5 hours, 6 hours, or 4.5 hours of sleep, plus whatever you typed for falling asleep. Five or six cycles is a full night for many adults. Four can be a short night you chose on purpose. Three is a nap stretched long, and the page still shows it so you can see the clock time.',
  },
  {
    id: 'sleep-cycle-calculator-faq-4',
    question: 'Can I start from a bedtime instead of a wake time?',
    answer:
      'Yes. Switch to "When I go to bed" and type the time you get into bed, such as 10:30 pm. The four results are wake times, not bedtimes. With 15 minutes to fall asleep and 90 minute cycles, five cycles from 10:30 pm lands at 6:15 am. The same switch works for 7:00 am, 07:00, or 19:00. All three are clock times the parser accepts.',
  },
  {
    id: 'sleep-cycle-calculator-faq-5',
    question: 'Is a 90 minute cycle the right length for everyone?',
    answer:
      'No. Ninety minutes is a common textbook length for one adult cycle of light sleep, deep sleep, and REM. Your own night can run shorter or longer. The cycle field accepts 60 to 120 minutes so you can try another length. The page does not measure you, and it does not claim the number is a diagnosis. It only does the clock arithmetic you asked for.',
  },
  {
    id: 'sleep-cycle-calculator-faq-6',
    question: 'What happens if I leave minutes to fall asleep at zero?',
    answer:
      'With "When I wake", every bedtime moves later by the minutes you removed. With "When I go to bed", every wake time moves earlier. Either way, a caution says the list assumes instant sleep. That is the mistake a lights-out countdown makes: it treats getting into bed as the start of cycle one. Put back a realistic number, often around 15, and the caution goes away.',
  },
  {
    id: 'sleep-cycle-calculator-faq-7',
    question: 'Does this sleep calculator upload my schedule?',
    answer:
      'No. The wake time, the bedtime, and the cycle length are handled in the browser after the page loads. There is no account, and a work alarm can stay on the device. Once the page is open, it keeps working offline, like the other date and time tools here. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'sleep-cycle-calculator-faq-8',
    question: 'Why is a 6-cycle bedtime earlier than nine hours before the alarm?',
    answer:
      'Nine hours of sleep would be six cycles of 90 minutes and nothing else. The bedtime is earlier than that by the minutes you need to fall asleep. A 7:00 am alarm, 15 minutes to fall asleep, and six cycles means you are in bed at 9:45 pm, asleep around 10:00 pm, and through six cycles at 7:00 am. The extra 15 minutes are in bed, not asleep.',
  },
  {
    id: 'sleep-cycle-calculator-faq-9',
    question: 'Will this tell me if I have a sleep disorder?',
    answer:
      'No. It will not score your sleep, read a wearable, or say that a cycle length is medically right for you. If nights are short no matter which of these times you try, that is a question for a clinician, not for a clock. The tool only answers which bedtimes and wake times line up with whole cycles once you have chosen a length.',
  },
  {
    id: 'sleep-cycle-calculator-faq-10',
    question: 'How is this different from counting backward on a clock?',
    answer:
      'Counting backward by 90 minutes from the alarm forgets the fall-asleep gap, and it usually offers one time. This list offers four, in both directions, and it says so when the gap is zero. A 7:00 am alarm with a 15 minute gap is not the same list as a 7:00 am alarm with no gap. The difference is one field, and it moves every time on the page.',
  },
];
