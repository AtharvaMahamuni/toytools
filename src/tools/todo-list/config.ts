import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'todo-list',
  name: 'Todo List',
  seoTitle: 'Todo List - Free Online Task Tracker',
  description: 'Create tasks, organize subtasks, and track progress directly in your browser. Private, lightweight, and free.',
  categorySlug: 'productivity',
  tags: [
    'todo list', 'task list', 'checklist', 'task tracker', 'online todo list',
    'simple todo list', 'free todo list', 'private todo list', 'browser todo list',
    'daily task list', 'subtasks', 'organize tasks', 'productivity',
  ],
  isNew: true,
  updatedAt: '2026-06-04',
  guide: {
    slug: 'how-to-use-a-todo-list',
    categorySlug: 'productivity',
    title: 'How To Use A Todo List',
    description: 'Learn how simple task lists reduce mental load, improve focus, and help you finish work more consistently.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'todo-list',
    categorySlug: 'productivity',
  },
};
