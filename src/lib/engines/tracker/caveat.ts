// The craft seam for the tracker engine. One line, or null.
// A standing caution on every log would be the disclaimer this exists to avoid.

/** Where today's logged number sits, or null when the log can take it at face value. */
export function trackerCaveat(id: string, value: number): string | null {
  if (id !== 'sleep-hours') return null;
  if (!Number.isFinite(value) || value <= 9) return null;
  const shown = Math.round(value * 10) / 10;
  return `${shown} h is long enough to include time awake in bed. The trend counts every logged hour as sleep.`;
}
