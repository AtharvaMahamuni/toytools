// Which tools could one day render outside a ToyTools page (an embed), as data. Nothing reads this
// yet: there is no embed route, no EmbedLayout and no loader, and none is planned in this series.
// It records the Tool Render Unit contract's one exclusion list (ARCHITECTURE.md, "Tool Render
// Unit"; report §2.12) so it is decided once, next to the registry, instead of rediscovered later.
//
// A tool is embeddable unless it is one of the seven below: the whole productivity category plus
// json-tree-viewer. Each owns device APIs, document-level behaviour, or the user's own data in
// local storage (an embed on another site would read and write a different, partitioned store,
// so the user's notes or lists would silently look empty). They only work as a whole page and are
// declared not embeddable, NOT refactored.
//
// The list is by slug so each entry carries its reason; embeddable.test.ts pins that it equals the
// productivity category plus json-tree-viewer.

/** The page-only tools, with the reason each one needs its own page. */
export const NOT_EMBEDDABLE: Readonly<Record<string, string>> = {
  'pomodoro-timer': 'Notification + service-worker notificationclick, fullscreen, raw storage keys, its own URL',
  'todo-list': 'own persistence and document-level behaviour in a 1,100+ line bespoke widget',
  'keep-screen-awake': 'Wake Lock and fullscreen, its own URL',
  'habit-streak-tracker': 'own persistence in an 800+ line bespoke widget',
  'book-tracker': 'own persistence in a 750+ line bespoke widget',
  notepad: "keeps the user's note in local storage, like todo, habit and book",
  'json-tree-viewer': 'document-level listeners and is:global CSS',
};

/** Whether a tool may render outside its page. Data only; nothing consumes it yet. */
export function isEmbeddable(tool: { slug: string }): boolean {
  return !Object.prototype.hasOwnProperty.call(NOT_EMBEDDABLE, tool.slug);
}
