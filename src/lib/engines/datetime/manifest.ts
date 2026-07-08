// Date & Time engine manifest — structured metadata describing the engine as a citizen of the
// engine-first architecture. Available to diagnostics and the /architecture view; derived from the
// registry so it never drifts.

import { DATETIME_TOOLS } from './registry';

export interface DateTimeManifest {
  engine: 'datetime';
  runtimeGlobal: 'runDateTime';
  widget: 'DateTimeWidget';
  processors: string[];
  families: string[];
  resultTypes: string[];
}

const tools = Object.values(DATETIME_TOOLS);

export const dateTimeManifest: DateTimeManifest = {
  engine: 'datetime',
  runtimeGlobal: 'runDateTime',
  widget: 'DateTimeWidget',
  processors: tools.map((t) => t.id),
  families: [...new Set(tools.map((t) => t.family))],
  resultTypes: ['hero', 'metrics', 'milestones', 'insights', 'decisions'],
};
