import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'hst-faq-1',
    question: 'What is a habit streak tracker?',
    answer:
      'A habit streak tracker is a daily checklist that records whether you did a small habit on each calendar day, then shows how many days in a row you kept it up. This tool keeps up to eight active habits, draws a 12-week heat grid per habit, and stores everything in your browser. For example, tap Drink water each morning and the streak badge counts consecutive local days with a check.',
  },
  {
    id: 'hst-faq-2',
    question: 'How does the streak rule work?',
    answer:
      'A current streak is consecutive local calendar days with a check. Missing a full calendar day resets the current streak to zero; your longest streak is kept so one miss does not erase the record. There are no grace days or freeze tokens in v1. For example, checks on Monday and Tuesday with a miss on Wednesday make Wednesday current streak zero, while longest still shows two until you beat it.',
  },
  {
    id: 'hst-faq-3',
    question: 'What does never miss twice mean?',
    answer:
      'Never miss twice is a recovery rule: after one miss, the goal is to show up again today rather than abandon the habit. This tracker shows warm recovery copy and keeps your longest streak visible so identity is not erased by a reset. For example, if you skipped yesterday, checking today starts a new current streak at one and the UI says you are back.',
  },
  {
    id: 'hst-faq-4',
    question: 'Is my habit data private?',
    answer:
      'Yes. Runs entirely on your device. Nothing is uploaded. Habit names, cues, identity lines, and day checks live in browser localStorage under a tool-specific key, and no account is required. For example, a habit named Meditate 2 min never leaves the browser profile you are using right now.',
  },
  {
    id: 'hst-faq-5',
    question: 'Do my habits sync across devices?',
    answer:
      'No. There is no cloud sync in v1. A list created on your laptop stays on that laptop browser, and your phone shows its own empty or separate storage. Expecting sync is the most common misunderstanding. For example, open the page on Chrome on a phone after using Firefox on a desktop and you will not see the desktop habits.',
  },
  {
    id: 'hst-faq-6',
    question: 'Why did my habits disappear?',
    answer:
      'Clearing site data, cookies, or browsing data for this site wipes localStorage, and that loss is permanent unless you exported JSON first. Private or incognito windows also discard storage when they close, and another browser or profile keeps a separate store. For example, a cleanup that removes site data for toytoolsapp.com erases the habit file along with it.',
  },
  {
    id: 'hst-faq-7',
    question: 'How do I export or import my habits?',
    answer:
      'Use Export JSON in the footer to download a backup file, then Import JSON to paste or load that file later. Round-trip preserves habit names, optional cue and identity fields, archive state, and day checks. Export before clearing browser data or switching machines. For example, save the file to your notes app, then import it after a browser reset.',
  },
  {
    id: 'hst-faq-8',
    question: 'Why is there a limit of eight active habits?',
    answer:
      'Eight active habits keeps the Today list intentional. Incumbent apps invite dozens of goals and then bury you in guilt dashboards; a short list is easier to keep honest. Soft-archive hides a habit from Today while keeping its history, and you can restore it later. For example, archive Stretch 2 min when travel breaks the routine, then unarchive when you return.',
  },
  {
    id: 'hst-faq-9',
    question: 'Can I undo today\'s check?',
    answer:
      'Yes. Tap the same habit check again on the same local calendar day to uncheck it. That updates the streak and heat grid immediately. You cannot edit other days in v1, because the product is binary daily check-in, not a full journal editor. For example, if you tapped by mistake this morning, tap again to clear today.',
  },
  {
    id: 'hst-faq-10',
    question: 'What are cue, identity, and habit stacking fields for?',
    answer:
      'They are optional notes that make the habit loop obvious. Cue is when or where you start (After coffee). Identity is who you are becoming (I am someone who moves daily). Stacking is After I ___, I will ___. None are required to check a day. For example, cue After I brush my teeth plus stack I will floss one tooth turns a vague goal into a tiny next action.',
  },
  {
    id: 'hst-faq-11',
    question: 'Does this send reminders or push notifications?',
    answer:
      'No. v1 has no reminders, push notifications, email, or accounts. The craft is an honest on-device loop you open on purpose, not a nag engine. If you need an alarm, use your phone clock separately. For example, set a local 8am alarm that opens this page; the tracker itself will not buzz you.',
  },
  {
    id: 'hst-faq-12',
    question: 'Is this an official Atomic Habits app?',
    answer:
      'No. The guide and UI use educational framing from widely known habit-loop ideas (cue, craving, response, reward; tiny habits; identity). There is no affiliation with the book or its author, and the tool does not reproduce long quotations. For example, treat the guide as plain-language coaching for a private checklist, not a licensed product.',
  },
];
