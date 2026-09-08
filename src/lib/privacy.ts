// The one privacy sentence the site uses in banners, schema, FAQs and copy.
//
// Models and humans were reading five different wordings of the same fact (browser / device /
// never leaves / no upload / local-only). One string, imported everywhere, is the whole fix.

export const PRIVACY_LINE = 'Runs entirely on your device. Nothing is uploaded.';

/** Trust-badge short form. Same claim as PRIVACY_LINE, sized for Zone B. */
export const PRIVACY_BADGE = 'Private ● Runs entirely on your device';

const ALREADY_STATED =
  /on your device|in your browser|nothing is uploaded|never (uploaded|sent)|no uploads?/i;

/** Append PRIVACY_LINE when the text has not already made the claim. */
export function withPrivacy(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return PRIVACY_LINE;
  if (ALREADY_STATED.test(trimmed)) return trimmed;
  return `${trimmed} ${PRIVACY_LINE}`;
}

/**
 * The quotable opening a model should read for a tool: the on-page line, the meta description,
 * then the privacy sentence if neither already said it.
 *
 * This is the 40-60 word "opening answer" for JSON-LD. The visible tagline stays one line so the
 * fold ratchet does not move; schema is where the longer answer lives.
 */
export function openingAnswer(tool: { tagline?: string; description: string }): string {
  const tagline = tool.tagline?.trim() ?? '';
  const description = tool.description.trim();
  const lead =
    tagline && !description.toLowerCase().includes(tagline.toLowerCase())
      ? `${tagline} ${description}`
      : description;
  return withPrivacy(lead);
}
