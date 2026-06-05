import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pt-faq-1',
    question: 'What is a Pomodoro?',
    answer: 'A Pomodoro is a single timed work session — traditionally 25 minutes of focused work followed by a 5-minute break. The term comes from the Italian word for tomato, after the tomato-shaped kitchen timer Francesco Cirillo used when developing the technique.',
  },
  {
    id: 'pt-faq-2',
    question: 'How long is a Pomodoro?',
    answer: 'The standard Pomodoro is 25 minutes. After four sessions you take a longer break of 15 minutes. Many people adjust the duration to match their concentration span — 50-minute sessions are common for developers and writers.',
  },
  {
    id: 'pt-faq-3',
    question: 'Why is it called Pomodoro?',
    answer: 'Francesco Cirillo named the technique after a tomato-shaped (pomodoro in Italian) kitchen timer he used as a university student in the late 1980s. The timer itself became the symbol for the method.',
  },
  {
    id: 'pt-faq-4',
    question: 'Can I customize the timer?',
    answer: 'Yes. Click "Customize" to set your own focus duration (1–180 minutes), short break (1–60 minutes), long break (1–120 minutes), and sessions per cycle (1–12). Your settings are saved automatically to your browser and persist across visits.',
  },
  {
    id: 'pt-faq-5',
    question: 'Can I use 50/10 instead of 25/5?',
    answer: 'Yes. Open the Customize panel, set Focus Duration to 50 and Short Break to 10. The cycle flow and session progress dots update automatically. Many people find 50/10 works better for deep work tasks that take time to warm up.',
  },
  {
    id: 'pt-faq-6',
    question: 'How many Pomodoros should I do per day?',
    answer: 'Most people sustain 8–12 Pomodoros (25-minute sessions) per day of focused work. Knowledge workers typically complete 4–6 before mental fatigue sets in. Start with what feels manageable — 4 sessions is a reasonable daily target for beginners.',
  },
  {
    id: 'pt-faq-7',
    question: 'What should I do during breaks?',
    answer: 'Short breaks (5 minutes): stand up, stretch, look away from the screen, get water. Avoid checking messages or social media — these pull you back into reactive mode. Long breaks (15 minutes): take a short walk, eat something, or rest your eyes away from any screen.',
  },
  {
    id: 'pt-faq-8',
    question: 'Is Pomodoro good for studying?',
    answer: 'Yes — it works well for study sessions with clear tasks like reading chapters, working through problem sets, or reviewing notes. It\'s less effective for open-ended revision without a concrete goal. The forced breaks also reduce the mental fatigue that builds during long uninterrupted study sessions.',
  },
  {
    id: 'pt-faq-9',
    question: 'Is Pomodoro useful for programmers?',
    answer: 'It depends on the task. Pomodoro works well for writing new code, reviewing pull requests, or debugging known issues. It can disrupt flow state during complex problem-solving — some programmers prefer 50/10 or 90/20 schedules that allow longer uninterrupted blocks.',
  },
  {
    id: 'pt-faq-10',
    question: 'Does this timer work offline?',
    answer: 'Yes. Once the page has loaded, it works entirely in your browser. There is no server communication, no API calls, and no internet required for the timer to run.',
  },
  {
    id: 'pt-faq-11',
    question: 'Does ToyTools save my data?',
    answer: 'No. Everything — your settings, preferences, and today\'s session statistics — is stored only in your browser\'s localStorage. Nothing is sent to any server. Clearing your browser data will reset everything.',
  },
  {
    id: 'pt-faq-12',
    question: 'Does the timer continue when the browser tab is inactive?',
    answer: 'Yes. The timer uses timestamp-based calculations rather than relying solely on JavaScript intervals. When you return to the tab, the timer reflects actual elapsed time accurately. Browsers may throttle intervals in background tabs, but this timer compensates for that drift.',
  },
  {
    id: 'pt-faq-13',
    question: 'Does the timer work on mobile devices?',
    answer: 'Yes. The interface is designed mobile-first. The timer is visible immediately without scrolling on most phone screens. All buttons meet minimum touch target sizes. Note that mobile browsers may suspend JavaScript when the screen locks — open the timer in your browser\'s foreground to keep it active.',
  },
];
