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
      'Your notes are stored in your browser\'s localStorage, a storage area built into every modern browser. Notes exist only on the device and browser you are using. They are never sent to a server or stored in the cloud.',
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
      'Yes. Use the Copy button in the toolbar to copy the entire note to your clipboard. You can then paste it anywhere: an email, a document, another app.',
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
  {
    id: 'notepad-faq-9',
    question: 'Does the online notepad autosave?',
    answer:
      'Yes, the notepad autosaves while you type: every keystroke writes the note to your browser\'s localStorage, so there is no Save button to remember. For example, type half a draft, close the tab mid-sentence, and reopen the page; the text reappears exactly where you stopped. Autosave holds up to 50 KB of text, enough for several thousand words, and it writes to this browser only, not to any cloud account.',
  },
  {
    id: 'notepad-faq-10',
    question: 'How do I jot down a quick note that saves automatically?',
    answer:
      'Open the notepad and start typing; that is the entire workflow, because autosave begins with the first character. There is no file to create, no account, and no Save step. For example, when a phone number comes up mid-call, click into the page, type it, and switch back to your work; the draft persists through refreshes and restarts. When a note becomes worth keeping, press Ctrl+S or Download TXT to export it as a file.',
  },
  {
    id: 'notepad-faq-11',
    question: 'Can I use an online scratchpad without installing anything?',
    answer:
      'Yes, this scratchpad runs entirely in a browser tab: no download, no extension, no sign-up. Loading the page once is the whole setup, and it keeps working offline afterward. For example, on a locked-down work machine where you cannot install apps, open the notepad, keep it pinned as a tab, and use it all day as a holding area for snippets you move between programs. The scratchpad remembers its contents per browser, so the same tab habit works tomorrow too.',
  },
  {
    id: 'notepad-faq-12',
    question: 'Is this notepad plain text or rich text?',
    answer:
      'Plain text only: the notepad stores exactly the characters you type, with no bold, headings, colors, or images. That is a deliberate trade. Plain text pastes cleanly into any destination, from a code editor to an email, and the note.txt export opens everywhere. For example, paste a formatted paragraph from a web page and only the words are kept, which makes the notepad a handy place to strip formatting. For styled documents, use a word processor instead.',
  },
  {
    id: 'notepad-faq-13',
    question: 'Why is my note not showing up on another device?',
    answer:
      'The note is not missing; it was never copied off the first device, because autosave writes to that browser\'s local storage and nowhere else. A draft written in the notepad on your desktop stays inside that desktop browser. For example, a meeting summary jotted at the office will greet you as an empty page on your home laptop. To move a note between devices, use Download TXT and transfer the file, or paste the text into an email to yourself.',
  },
];
