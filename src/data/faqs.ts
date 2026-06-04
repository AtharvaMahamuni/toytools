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
