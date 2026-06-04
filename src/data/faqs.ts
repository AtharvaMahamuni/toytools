import type { FAQItem } from './types';

export const toolFAQs: Record<string, FAQItem[]> = {
  'todo-list': [
    {
      id: 'todo-faq-1',
      question: 'What is a todo list?',
      answer:
        'A todo list is a written record of tasks you need to complete. It externalizes what you need to do so your brain does not have to hold everything at once. A good todo list is simple, honest, and kept short enough to be useful.',
    },
    {
      id: 'todo-faq-2',
      question: 'Why use a todo list instead of trying to remember tasks?',
      answer:
        'Human working memory is limited. Trying to remember everything you need to do creates background mental load that drains focus and causes anxiety. Writing tasks down frees your mind to concentrate on the work itself rather than on remembering the work.',
    },
    {
      id: 'todo-faq-3',
      question: 'Should I use subtasks for every task?',
      answer:
        'No. Subtasks are useful only when a task is large enough to feel overwhelming or unclear as a single item. A task like "Reply to email" needs no subtasks. A task like "Launch website" benefits from breaking down into smaller concrete steps.',
    },
    {
      id: 'todo-faq-4',
      question: 'How many tasks should I keep on a list?',
      answer:
        'There is no fixed limit, but shorter lists work better in practice. When a list grows too long, it becomes a source of guilt rather than a useful tool. A daily list of five to ten tasks tends to be more effective than a backlog of fifty.',
    },
    {
      id: 'todo-faq-5',
      question: 'Can a todo list improve productivity?',
      answer:
        'Yes, when used well. The benefit comes from clarity and focus — knowing exactly what to do next reduces the time spent deciding and the mental energy spent worrying. The key is keeping the list realistic and reviewing it regularly.',
    },
    {
      id: 'todo-faq-6',
      question: 'Should completed tasks stay visible or be deleted?',
      answer:
        'Keeping completed tasks visible lets you see your progress, which is motivating and useful for reviewing what you accomplished. This tool keeps completed tasks by default with a strikethrough style. You can hide them with the "Hide Completed" toggle if you prefer a cleaner view.',
    },
    {
      id: 'todo-faq-7',
      question: 'How often should I review my todo list?',
      answer:
        'A quick daily review — at the start or end of the day — is enough for most people. A longer weekly review helps you clear completed tasks, reprioritize, and add anything new. Regular review prevents the list from becoming stale and useless.',
    },
    {
      id: 'todo-faq-8',
      question: 'What is the difference between a task and a subtask?',
      answer:
        'A task is an item that needs to be completed. A subtask is a smaller step that belongs to a larger task. For example, "Build homepage" is a task; "Write headline copy" and "Set up navigation" are subtasks. Subtasks help you make progress on complex tasks one step at a time.',
    },
  ],
  'notepad': [
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
  ],
  'keep-screen-awake': [
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
        'Yes. Click "Set time limit" below the tool description to expand duration options. You can choose 15 minutes, 30 minutes, 1 hour, 2 hours, or a custom duration. When the timer runs out, the wake lock is released automatically and the status changes to Completed.',
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
  ],
  'base64-encoder-decoder': [
    {
      id: 'b64-faq-1',
      question: 'What is Base64?',
      answer:
        'Base64 is a binary-to-text encoding scheme that converts binary data into a sequence of 64 printable ASCII characters. It was designed to safely represent arbitrary byte data as text so it can pass through systems that only handle text — such as email servers or HTTP headers.',
    },
    {
      id: 'b64-faq-2',
      question: 'How do I encode text to Base64?',
      answer:
        'Paste or type your text into the input field, then select "Encode → Base64" from the mode selector. The encoded output appears instantly in the right panel. You can copy it with the Copy button.',
    },
    {
      id: 'b64-faq-3',
      question: 'How do I decode Base64 back to text?',
      answer:
        'Paste your Base64 string into the input field and select "Decode ← Base64" from the mode selector. The decoded plain text appears in the output panel. If the input is not valid Base64, the tool will show an error message.',
    },
    {
      id: 'b64-faq-4',
      question: 'Is Base64 a form of encryption?',
      answer:
        'No. Base64 is encoding, not encryption. Encryption uses a secret key to scramble data so that only authorized parties can read it. Base64 simply changes how data is represented — anyone can decode it instantly without any key. Never use Base64 to protect sensitive information.',
    },
    {
      id: 'b64-faq-5',
      question: 'Is Base64-encoded data secure?',
      answer:
        'No. Base64 provides zero security. It is trivially reversible by anyone who sees it. If you need to protect data, use proper encryption such as AES or TLS. Base64 is useful for safe transport of binary data, not for confidentiality.',
    },
    {
      id: 'b64-faq-6',
      question: 'Why does Base64 output sometimes end with "=" or "=="?',
      answer:
        'Base64 encodes data in 3-byte groups. If the input length is not a multiple of 3, padding characters ("=") are added to complete the final group. One "=" means one byte of padding was added; "==" means two bytes were added. The padding ensures the decoder knows exactly where the data ends.',
    },
    {
      id: 'b64-faq-7',
      question: 'What is Base64URL and how is it different from standard Base64?',
      answer:
        'Base64URL is a variant of Base64 that replaces the "+" character with "-" and "/" with "_". This makes the output safe to use in URLs and filenames without percent-encoding. Standard Base64 uses "+" and "/" which have special meanings in URLs. JWT tokens, for example, use Base64URL encoding.',
    },
    {
      id: 'b64-faq-8',
      question: 'Can Base64 encode images or binary files?',
      answer:
        'Yes. Base64 can encode any binary data, including images, PDFs, and other files. Web developers commonly embed small images directly in HTML or CSS as Base64 data URIs (e.g., data:image/png;base64,...) to reduce HTTP requests. This tool currently handles text input; for binary files you would need a file-upload capable tool.',
    },
    {
      id: 'b64-faq-9',
      question: 'Why is Base64 output larger than the original data?',
      answer:
        'Base64 encodes every 3 bytes of input as 4 characters of output, which means the encoded size is approximately 33% larger than the original. For example, 3 KB of data becomes roughly 4 KB after encoding. This size increase is the trade-off for making binary data safely representable as plain text.',
    },
  ],
};
