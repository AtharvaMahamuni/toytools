import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
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
];
