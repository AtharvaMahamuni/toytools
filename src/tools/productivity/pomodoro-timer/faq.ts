import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pt-faq-1',
    question: 'What is a Pomodoro?',
    answer: 'A Pomodoro is a single timed work session, traditionally 25 minutes of focused work followed by a 5-minute break. The term comes from the Italian word for tomato, after the tomato-shaped kitchen timer Francesco Cirillo used when developing the technique.',
  },
  {
    id: 'pt-faq-2',
    question: 'How long is a Pomodoro?',
    answer: 'The standard Pomodoro is 25 minutes. After four sessions you take a longer break of 15 minutes. Many people adjust the duration to match their concentration span: 50-minute sessions are common for developers and writers.',
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
    answer: 'Most people sustain 8–12 Pomodoros (25-minute sessions) per day of focused work. Knowledge workers typically complete 4–6 before mental fatigue sets in. Start with what feels manageable: 4 sessions is a reasonable daily target for beginners.',
  },
  {
    id: 'pt-faq-7',
    question: 'What should I do during breaks?',
    answer: 'Short breaks (5 minutes): stand up, stretch, look away from the screen, get water. Avoid checking messages or social media: these pull you back into reactive mode. Long breaks (15 minutes): take a short walk, eat something, or rest your eyes away from any screen.',
  },
  {
    id: 'pt-faq-8',
    question: 'Is Pomodoro good for studying?',
    answer: 'Yes, it works well for study sessions with clear tasks like reading chapters, working through problem sets, or reviewing notes. It\'s less effective for open-ended revision without a concrete goal. The forced breaks also reduce the mental fatigue that builds during long uninterrupted study sessions.',
  },
  {
    id: 'pt-faq-9',
    question: 'Is Pomodoro useful for programmers?',
    answer: 'It depends on the task. Pomodoro works well for writing new code, reviewing pull requests, or debugging known issues. It can disrupt flow state during complex problem-solving: some programmers prefer 50/10 or 90/20 schedules that allow longer uninterrupted blocks.',
  },
  {
    id: 'pt-faq-16',
    question: 'Does the Pomodoro Technique work for ADHD?',
    answer: 'For many people with ADHD, yes, with caveats. The technique\'s external structure addresses two common ADHD challenges directly: it makes an open-ended task feel bounded ("just 25 minutes"), which lowers the barrier to starting, and it enforces breaks that prevent the hyperfocus burnout that follows long uninterrupted sessions. The scheduled interruptions, which frustrate neurotypical users in flow, can actually feel natural to an ADHD brain that interrupts itself anyway. That said, 25 minutes may be too long or too short depending on the individual. Shorter 15-minute sessions often work better early on; longer 40–50-minute blocks suit people who take time to settle in. Experiment with the Customize panel to find your interval. The technique is most effective for ADHD when combined with a written task list: knowing exactly what you\'re doing for the next 25 minutes removes the decision overhead that often derails a session before it starts.',
  },
  {
    id: 'pt-faq-17',
    question: 'Pomodoro vs time blocking, which is better?',
    answer: 'They solve different problems and work well together. Time blocking reserves calendar slots for categories of work ("2–4 pm: deep coding"). Pomodoro structures the work within those slots into focused intervals with mandatory recovery breaks. Time blocking answers "when will I work on what"; Pomodoro answers "how will I sustain focus while I do it". If you struggle to start tasks or drift during long stretches, Pomodoro\'s countdown is the better lever. If you struggle with scattered days and reactive scheduling, time blocking is the fix. Many people use both: block the time in advance, then run Pomodoro sessions inside each block.',
  },
  {
    id: 'pt-faq-18',
    question: 'Does the Pomodoro Technique actually work? Is there evidence?',
    answer: 'Yes, for most people and most task types. The honest picture: the research base specifically on Pomodoro is thin, it has not been studied in large controlled trials the way some productivity interventions have. But the mechanisms it relies on are well-supported. Structured work intervals with scheduled breaks consistently show moderate positive effects on sustained attention and output quality in time-on-task research. The forced breaks align with the brain\'s ultradian rhythm (roughly 90-minute cycles of higher and lower cognitive readiness) meaning the rest is functional, not arbitrary. The timer\'s bounded commitment also reduces procrastination by making the task feel finite. The most credible evidence is the breadth of adoption: millions of developers, students, and knowledge workers have used it for decades, across very different working styles, with largely positive reported results. It is not a productivity myth or placebo. It does, however, work better for some task types than others: see "What is Pomodoro good for?" for specifics.',
  },
  {
    id: 'pt-faq-14',
    question: 'Who is the Pomodoro Technique for?',
    answer: 'It suits anyone doing focused, task-based work: students revising or working through problem sets, knowledge workers clearing email and admin, developers writing or reviewing code, and writers drafting. It is especially helpful if you procrastinate, lose track of time, or find long stretches of work mentally draining: the fixed intervals and scheduled breaks impose structure. It fits less well for work that depends on uninterrupted flow, where longer 50/10 or 90/20 cycles tend to work better.',
  },
  {
    id: 'pt-faq-10',
    question: 'Does this timer work offline?',
    answer: 'Yes. Once the page has loaded, it works entirely in your browser. There is no server communication, no API calls, and no internet required for the timer to run.',
  },
  {
    id: 'pt-faq-11',
    question: 'Does ToyTools save my data?',
    answer: 'No. Everything (your settings, preferences, and today\'s session statistics) is stored only in your browser\'s localStorage. Nothing is sent to any server. Clearing your browser data will reset everything.',
  },
  {
    id: 'pt-faq-12',
    question: 'Does the timer continue when the browser tab is inactive?',
    answer: 'Yes. The timer uses timestamp-based calculations rather than relying solely on JavaScript intervals. When you return to the tab, the timer reflects actual elapsed time accurately. Browsers may throttle intervals in background tabs, but this timer compensates for that drift.',
  },
  {
    id: 'pt-faq-13',
    question: 'Does the timer work on mobile devices?',
    answer: 'Yes. The interface is designed mobile-first. The timer is visible immediately without scrolling on most phone screens. All buttons meet minimum touch target sizes. Note that mobile browsers may suspend JavaScript when the screen locks: open the timer in your browser\'s foreground to keep it active.',
  },
  {
    id: 'pt-faq-15',
    question: 'Can I add the timer to my home screen or use it across devices?',
    answer: 'Yes, open it in your mobile browser and use "Add to Home Screen" to launch it like an app; on desktop you can bookmark or pin the tab. Because your settings and session stats are stored in your browser\'s localStorage, they stay on that one device and do not sync. If you switch phones or computers you start fresh with the default 25/5 setup.',
  },
];
