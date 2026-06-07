import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'notepad-faq-1',
    question: 'What is a notepad?',
    answer:
      'A notepad is a simple tool for writing and storing text. It gives you a place to capture ideas, reminders, and information without needing an account, an app, or a server. This notepad runs entirely in your browser and saves notes locally on your device.',
  },
  {
    id: 'notepad-faq-2',
    question: 'Where are my notes stored?',
    answer:
      'Your notes are stored in your browser\'s localStorage — a storage area built into every modern browser. Notes exist only on the device and browser you are using. They are never sent to a server or stored in the cloud.',
  },
  {
    id: 'notepad-faq-3',
    question: 'Are my notes private?',
    answer:
      'Yes. Notes stay on your device and are never transmitted anywhere. ToyTools has no server, no account system, and no way to access your notes. Only you can read them, on the device where you wrote them.',
  },
  {
    id: 'notepad-faq-4',
    question: 'Does ToyTools save my notes?',
    answer:
      'No. ToyTools does not have a server or database. Notes are saved by your browser in localStorage on your own device. ToyTools never sees or stores your content.',
  },
  {
    id: 'notepad-faq-5',
    question: 'Will my notes survive a browser restart?',
    answer:
      'Yes. localStorage persists across page refreshes, tab closes, and browser restarts. Your notes will be there when you come back, as long as you are using the same browser on the same device and have not cleared your browser data.',
  },
  {
    id: 'notepad-faq-6',
    question: 'Can I copy my notes?',
    answer:
      'Yes. Use the Copy button in the toolbar to copy the entire note to your clipboard. You can then paste it anywhere — an email, a document, another app.',
  },
  {
    id: 'notepad-faq-7',
    question: 'Can I download my notes?',
    answer:
      'Yes. Use the Download TXT button to save the current note as a plain text file named note.txt. This is useful for keeping a permanent backup or moving notes to another application.',
  },
  {
    id: 'notepad-faq-8',
    question: 'What happens if I clear browser data?',
    answer:
      'Clearing your browser\'s cache, cookies, or site data will erase localStorage, which will delete your saved notes. If you want to keep notes permanently, use the Download TXT button to save a copy before clearing your browser data.',
  },
];
