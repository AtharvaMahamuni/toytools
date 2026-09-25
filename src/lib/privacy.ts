// The one privacy sentence the site uses in banners, schema, FAQs and copy.
//
// Models and humans were reading five different wordings of the same fact (browser / device /
// never leaves / no upload / local-only). One string, imported everywhere, is the whole fix.

export const PRIVACY_LINE = 'Runs entirely on your device. Nothing is uploaded.';

/** Trust-badge short form. Same claim as PRIVACY_LINE, sized for Zone B. */
export const PRIVACY_BADGE = 'Private ● Runs entirely on your device';

export type TrustVariant = 'private' | 'offline' | 'local' | 'lookup';

/**
 * The privacy sentence a tool may actually claim, keyed by its trust variant.
 *
 * `private` is the default and matches PRIVACY_LINE. Lookup is the exception: the browser
 * does ask an echo, so the "nothing is uploaded" line would be false there.
 */
export function privacyStatement(variant?: TrustVariant): string {
  switch (variant) {
    case 'offline':
      return 'Works offline after the first page load.';
    case 'local':
      return 'No sync, no cloud. Your data stays on this device.';
    case 'lookup':
      return 'Your browser asks an IP echo. ToyTools never sees the reply.';
    default:
      return PRIVACY_LINE;
  }
}

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
