// The /feedback/ page's FAQ. The page renders it (and its FAQPage JSON-LD), and /faq-ai.txt
// prints the same items, so the two never drift.
import type { FAQItem } from '@data/types';

export const FEEDBACK_FAQ: readonly FAQItem[] = [
  {
    id: 'feedback-faq-account',
    question: 'Do I need an account?',
    answer:
      'No. There is nothing to sign up for and nothing to log into. Fill in the form and send it. You do not have to leave an email address either, though the form has nowhere to reply to if you do not.',
  },
  {
    id: 'feedback-faq-public',
    question: 'Will my suggestion be public?',
    answer:
      'No. Submissions go straight to a private inbox. There is no comment section, no public voting, and no list of requests on the site. If an idea does turn into a tool, the tool is public but your message is not.',
  },
  {
    id: 'feedback-faq-read',
    question: 'Will you actually read it?',
    answer:
      'Yes. ToyTools is small enough that every submission gets read by a person. That is exactly why the form asks four questions instead of showing one empty box: a handful of well-described problems is far more useful than a flood of one-line requests.',
  },
  {
    id: 'feedback-faq-bug',
    question: 'How do I report something that is broken?',
    answer:
      'Choose "Report a Bug" and describe what you did, what you got, and what you expected instead. If you arrived from the tool itself, you can tick one box to attach whatever you had typed into it, which usually turns a guess into a five-minute fix.',
  },
  {
    id: 'feedback-faq-improve',
    question: 'Can I ask for a change to a tool that already exists?',
    answer:
      'That is what "Improve an Existing Tool" is for, and it is often more valuable than a brand new suggestion. A tool that is nearly right for your work is a tool that only needs one more thing.',
  },
  {
    id: 'feedback-faq-example-data',
    question: 'Should I include example data?',
    answer:
      'If you can, yes. A small sample of real input and the result you expected removes all the guesswork. Do not paste anything private, secret, or personal: send a small anonymised sample that shows the same problem.',
  },
  {
    id: 'feedback-faq-what-gets-built',
    question: 'What kinds of tools does ToyTools build?',
    answer:
      'Things a browser can work out exactly and instantly, with no account and no server. For example, converting between formats, calculating a figure from a few numbers, cleaning up messy text, or checking whether something is valid. If a question has one correct answer, it is a good fit.',
  },
  {
    id: 'feedback-faq-how-long',
    question: 'How long does it take for something to get built?',
    answer:
      'There is no queue you can watch and no promised date. Suggestions are weighed against how many people hit the same problem, how badly the existing options handle it, and whether it can be done well in the browser. Some ideas ship quickly, and plenty never ship at all.',
  },
  {
    id: 'feedback-faq-ai',
    question: 'Can you build something that uses AI?',
    answer:
      'Almost certainly not, and it is worth explaining why. ToyTools runs entirely on your device with no server behind it, so there is nothing to run a model on. More to the point, a tool is only worth using here if it gives the same correct answer every time, and that is a different kind of question from the ones AI is good at.',
  },
];
