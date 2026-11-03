import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'nsw-faq-1',
    question: 'What is a no sleep website?',
    answer:
      'A no sleep website is a webpage that asks your operating system to keep your display turned on using the standard W3C Screen Wake Lock API. While the tab remains open and visible, it prevents your phone, tablet, or laptop from entering automatic display sleep or dimming.',
  },
  {
    id: 'nsw-faq-2',
    question: 'How do I keep my screen awake online?',
    answer:
      'Open this page and click or tap the Keep Screen Awake button. Your browser immediately requests a screen wake lock. As long as this tab stays visible in your browser window, your display remains awake without requiring you to touch the screen or move the mouse.',
  },
  {
    id: 'nsw-faq-3',
    question: 'Does this no sleep website work on Android?',
    answer:
      'Yes. It works in Google Chrome, Microsoft Edge, Brave, and other modern Chromium browsers on Android phones and tablets. The wake lock stays active while this tab is open and visible on your screen.',
  },
  {
    id: 'nsw-faq-4',
    question: 'Does it work on iPhone and iPad?',
    answer:
      'Yes. Apple added native Screen Wake Lock API support in Safari on iOS 16.4 and iPadOS 16.4. It also works in third-party iOS browsers that use the WebKit engine. The page must stay open and visible on screen.',
  },
  {
    id: 'nsw-faq-5',
    question: 'Can I keep my laptop or desktop screen awake?',
    answer:
      'Yes. Chrome, Edge, and Safari on macOS and Windows support the Wake Lock API out of the box. Firefox also supports wake locks starting from version 126. Note that closing a laptop lid or hardware sleep shortcuts will still trigger system sleep.',
  },
  {
    id: 'nsw-faq-6',
    question: 'Does the page work when I switch tabs or minimize the browser?',
    answer:
      'No. Web browsers automatically release screen wake locks when a tab is hidden or minimized to conserve battery power. When you switch back to this tab, the utility automatically re-acquires the lock so your screen stays awake.',
  },
  {
    id: 'nsw-faq-7',
    question: 'Does keeping my screen awake drain battery?',
    answer:
      'Yes. Keeping the display backlight active consumes more energy than letting the screen turn off. You can enable the optional battery guard setting in the panel below, which automatically releases the lock if your battery level drops below 15 percent.',
  },
  {
    id: 'nsw-faq-8',
    question: 'Is this no sleep website free to use?',
    answer:
      'Yes. The tool is completely free, requires no user account, has no subscription, and displays no intrusive ads. Everything executes client-side directly within your web browser.',
  },
  {
    id: 'nsw-faq-9',
    question: 'Do I need to install an app or extension?',
    answer:
      'No. You do not need to install software, browser extensions, or helper utilities. The tool uses standard native web browser APIs, meaning you can open the webpage and start using it instantly on any device.',
  },
  {
    id: 'nsw-faq-10',
    question: 'Why does my screen still turn off?',
    answer:
      'Operating system battery saver modes, device power management policies, pressing the physical power button, or closing a laptop lid will override web browser wake locks. If the lock is dropped, this tool detects the loss immediately and attempts to reconnect while the tab remains visible.',
  },
];
