import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'wl-faq-1',
    question: 'What is the Wake Lock API?',
    answer:
      'The Wake Lock API lets a web page ask the operating system to keep the screen on. When the lock is active, the normal display timeout is suppressed for that tab. Closing the tab, switching apps, or hiding the page releases the lock.',
  },
  {
    id: 'wl-faq-2',
    question: 'Which browsers support Keep Screen Awake?',
    answer:
      'Chrome, Safari, and Edge support the Wake Lock API on current desktop versions. Safari on iOS supports it from version 16.4. Firefox supports it from version 126. If your browser is older, the tool says so and points you to the device display timeout setting instead.',
  },
  {
    id: 'wl-faq-3',
    question: 'Does it work on iPhone and Chrome mobile?',
    answer:
      'On iPhone, use Safari on iOS 16.4 or later, or another browser that uses the same WebKit engine (including Chrome on iOS). On Android, use Chrome or another Chromium browser. The lock only holds while this tab is visible. Battery saver, switching apps, or an OS power policy can drop it. The tool shows when the lock is lost and retries while the tab is visible.',
  },
  {
    id: 'wl-faq-4',
    question: 'Is Keep Screen Awake private?',
    answer:
      'Yes. It only requests that your display stay on. It does not read your files, camera, microphone, or personal data. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'wl-faq-5',
    question: 'Does Keep Screen Awake drain battery?',
    answer:
      'Yes, keeping your screen on continuously will use more battery than allowing it to dim and sleep. The exact impact depends on your screen brightness and device. On laptops and phones, the display is typically the largest source of power consumption, so expect a noticeable reduction in battery life if you keep the screen awake for long sessions. Lowering your screen brightness can offset some of this.',
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
      'Several things can override a wake lock: switching to another tab or app releases it automatically, enabling battery saver mode on some devices overrides wake locks, and some browsers or OS-level power managers may revoke the lock independently. The tool watches for this. If the lock goes away while a session is running it says "Lock lost, reconnecting" instead of continuing to claim the screen is awake, and it retries every second while the tab is visible.',
  },
  {
    id: 'wl-faq-11',
    question: 'Will this work during presentations?',
    answer:
      'Yes, in most cases. If you are presenting from a Chrome or Edge browser on a laptop, activating Keep Screen Awake will prevent the display from dimming during your presentation. Keep this tab open alongside your presentation. Note that if your presentation software runs full-screen and covers the browser tab, the wake lock may be released when the browser tab loses visibility.',
  },
  {
    id: 'wl-faq-10',
    question: 'Can I set a time limit?',
    answer:
      'Yes. The session panel offers 15 minutes, 30 minutes, 1 hour, 2 hours, a custom length up to 480 minutes, or an open ended session that runs until you stop it. A timed session fills the ring as it counts down, releases the wake lock when it reaches zero, and can chime, vibrate, or send a browser notification so you know even when you are not watching. The chosen length is also kept in the address bar, so a link like ?d=30 reopens the tool set to 30 minutes.',
  },
  {
    id: 'wl-faq-12',
    question: 'How do I stop my screen from turning off without a tool?',
    answer:
      'On Windows, go to Settings, System, Power and Sleep and set the screen sleep time to Never. On macOS, go to System Settings, Battery and disable automatic sleeping when the display is off. On Android, go to Settings, Display, Screen Timeout. On iPhone, go to Settings, Display and Brightness, Auto-Lock. These device settings offer a permanent solution when you do not want to keep a browser tab open.',
  },
];
