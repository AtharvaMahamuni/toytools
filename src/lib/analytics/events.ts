// Analytics event contract — definitions only (no wiring). A single, reusable event
// vocabulary attached to engine interactions, so future engines reuse these names rather
// than inventing tool-specific events. Prevents analytics fragmentation as tools scale.

export const AnalyticsEvents = {
  TOOL_USED: 'tool_used',
  COPY_OUTPUT: 'copy_output',
  SAMPLE_LOADED: 'sample_loaded',
  GUIDE_OPENED: 'guide_opened',
  FAQ_OPENED: 'faq_opened',
  RELATED_TOOL_CLICKED: 'related_tool_clicked',
  SEARCH_TOOL: 'search_tool',
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
