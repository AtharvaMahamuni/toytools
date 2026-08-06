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
      'Yes, in browsers that support the Wake Lock API. The browser requests permission from the operating system to prevent the screen from turning off. No special permissions dialog is shown to the user: the page simply makes the request when you activate the tool. Chrome, Edge, and Android Chrome have supported this for years, Safari added it in version 16.4, and Firefox added it in version 126. If your browser is older than that, the tool says so and shows the device setting to use instead.',
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
      'Yes. The tool only requests that your screen stay on: it does not access your files, camera, microphone, or any personal data. Everything runs in your browser and nothing is sent to a server. The only risk is battery drain from keeping your display on.',
  },
  {
    id: 'wl-faq-5',
    question: 'Does it work on iPhone?',
    answer:
      'Yes, on iOS 16.4 and later. Safari added Wake Lock support in that release, so opening this page in Safari and tapping Keep Screen Awake holds the display on. On an older iPhone the tool detects the missing support and points you at Settings, Display and Brightness, Auto-Lock, where you can set a longer timeout or Never.',
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
      'Several things can override a wake lock: switching to another tab or app releases it automatically, enabling battery saver mode on some devices overrides wake locks, and some browsers or OS-level power managers may revoke the lock independently. The tool watches for this. If the lock goes away while a session is running it says "Lock lost, reconnecting" instead of continuing to claim the screen is awake, and it retries every second while the tab is visible.',
  },
  {
    id: 'wl-faq-13',
    question: 'Will it drain my battery flat?',
    answer:
      'It can, which is why the tool watches the battery for you. Where the browser exposes a battery level, usually Chrome on Android and on some laptops, the current charge is shown in the session options and a session stops on its own once the battery falls to 15 percent while unplugged. You can switch that off if you are running a display that stays plugged in.',
  },
  {
    id: 'wl-faq-14',
    question: 'Can I use it as a bedside or kitchen clock?',
    answer:
      'Yes. Ambient mode fills the screen with a large clock plus the session status, and can be dimmed in two steps for a dark room. The content drifts slowly across the screen so a phone left on for hours does not risk OLED burn-in, and the controls fade away after a few seconds and return on a tap. Install the tool to your home screen and it runs full screen with no browser chrome at all.',
  },
  {
    id: 'wl-faq-10',
    question: 'Can I set a time limit?',
    answer:
      'Yes. The session panel offers 15 minutes, 30 minutes, 1 hour, 2 hours, a custom length up to 480 minutes, or an open ended session that runs until you stop it. A timed session fills the ring as it counts down, releases the wake lock when it reaches zero, and can chime, vibrate, or send a browser notification so you know even when you are not watching. The chosen length is also kept in the address bar, so a link like ?d=30 reopens the tool set to 30 minutes.',
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
      'On Windows, go to Settings → System → Power & Sleep and set the screen sleep time to Never. On macOS, go to System Settings → Battery and disable automatic sleeping when the display is off. On Android, go to Settings → Display → Screen Timeout. On iPhone, go to Settings → Display & Brightness → Auto-Lock. These device settings offer a permanent solution when you do not want to keep a browser tab open.',
  },
];
