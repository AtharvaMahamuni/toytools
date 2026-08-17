import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'todo-list',
  name: 'Todo List',
  seoTitle: 'Todo List — Free Online Task Manager',
  description: 'Create tasks, organize subtasks, and track progress directly in your browser. Private, lightweight, and free.',
  tagline: 'Tasks and subtasks tracked privately in your browser.',
  categorySlug: 'productivity',
  tags: [
    'todo list', 'task list', 'checklist', 'task tracker', 'online todo list',
    'simple todo list', 'free todo list', 'private todo list', 'browser todo list',
    'daily task list', 'subtasks', 'organize tasks', 'productivity',
    'free todo list online', 'to-do list online', 'task list browser', 'checklist online free', 'simple task manager',
  ],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'task',
  guide: {
    slug: 'how-to-use-a-todo-list',
    categorySlug: 'productivity',
    title: 'How To Use A Todo List',
    description: 'Learn how simple task lists reduce mental load, improve focus, and help you finish work more consistently.',
    readMinutes: 5,
    updatedAt: '2026-06-01',
  },
  trustVariant: 'local',
};
