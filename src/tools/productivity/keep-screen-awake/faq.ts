import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'wl-faq-1',
    question: 'What is a Screen Wake Lock?',
    answer:
      'A Screen Wake Lock is a browser API that allows a web page to request that the device keep its display on. When a wake lock is active, the operating system is instructed to suppress the automatic screen timeout that would normally dim or turn off the display.',
  },
  {
    id: 'wl-faq-2',
    question: 'Can a website keep my screen awake?',
    answer:
      'Yes, in browsers that support the Wake Lock API. The browser requests permission from the operating system to prevent the screen from turning off. No special permissions dialog is shown to the user — the page simply makes the request when you activate the tool. Chrome, Edge, and Android Chrome support this feature. Safari and Firefox do not yet support it.',
  },
  {
    id: 'wl-faq-3',
    question: 'Does Keep Screen Awake drain battery?',
    answer:
      'Yes, keeping your screen on continuously will use more battery than allowing it to dim and sleep. The exact impact depends on your screen brightness and device. On laptops and phones, the display is typically the largest source of power consumption, so expect a noticeable reduction in battery life if you keep the screen awake for long sessions. Lowering your screen brightness can offset some of this.',
  },
  {
    id: 'wl-faq-4',
    question: 'Is Keep Screen Awake safe?',
    answer:
      'Yes. The tool only requests that your screen stay on — it does not access your files, camera, microphone, or any personal data. Everything runs in your browser and nothing is sent to a server. The only risk is battery drain from keeping your display on.',
  },
  {
    id: 'wl-faq-5',
    question: 'Does it work on iPhone?',
    answer:
      'No. Safari on iOS does not support the Wake Lock API. Apple has not yet implemented it in Mobile Safari. To keep your iPhone screen on, go to Settings → Display & Brightness → Auto-Lock and set it to Never or a longer duration.',
  },
  {
    id: 'wl-faq-6',
    question: 'Does it work on Android?',
    answer:
      'Yes, on Android with Chrome or another Chromium-based browser. Open this page in Chrome on your Android device, tap Keep Screen Awake, and the screen will stay on while the tab is active and visible.',
  },
  {
    id: 'wl-faq-7',
    question: 'Does it work when the tab is in the background?',
    answer:
      'No. Wake locks are tied to the visibility of the tab. When you switch to another app or tab, the browser automatically releases the wake lock to preserve battery. The tool will attempt to reacquire the lock when you return to this tab. This is a browser security and performance limitation, not a bug in the tool.',
  },
  {
    id: 'wl-faq-8',
    question: 'Does it prevent computer sleep?',
    answer:
      'No. The Wake Lock API controls only the display. It cannot prevent your computer from entering system sleep or hibernation. If your laptop closes its lid or triggers sleep mode due to inactivity on the keyboard or trackpad, the display lock will not stop that. For full system sleep prevention, use your operating system settings.',
  },
  {
    id: 'wl-faq-9',
    question: 'Why did my screen turn off anyway?',
    answer:
      'Several things can override a wake lock: switching to another tab or app releases it automatically, enabling battery saver mode on some devices overrides wake locks, and some browsers or OS-level power managers may revoke the lock independently. If the screen turned off unexpectedly, try reactivating the tool when you return to this tab.',
  },
  {
    id: 'wl-faq-10',
    question: 'Can I set a time limit?',
    answer:
      'Yes. Click "Tool Settings" below the tool description to expand duration options. You can choose 15 minutes, 30 minutes, 1 hour, 2 hours, or a custom duration. When the timer runs out, the wake lock is released automatically and the status changes to Completed.',
  },
  {
    id: 'wl-faq-11',
    question: 'Will this work during presentations?',
    answer:
      'Yes, in most cases. If you are presenting from a Chrome or Edge browser on a laptop, activating Keep Screen Awake will prevent the display from dimming during your presentation. Keep this tab open alongside your presentation. Note that if your presentation software runs full-screen and covers the browser tab, the wake lock may be released when the browser tab loses visibility.',
  },
  {
    id: 'wl-faq-12',
    question: 'How do I stop my screen from turning off without a tool?',
    answer:
      'On Windows, go to Settings → System → Power & Sleep and set the screen sleep time to Never. On macOS, go to System Settings → Displays → Advanced → Prevent automatic sleeping when the display is off. On Android, go to Settings → Display → Screen Timeout. On iPhone, go to Settings → Display & Brightness → Auto-Lock. These device settings offer a permanent solution when you do not want to keep a browser tab open.',
  },
];
