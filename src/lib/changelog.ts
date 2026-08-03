/**
 * Parser for CHANGELOG.md, so /changelog/ renders the real file rather than a hand-kept copy that
 * drifts. `npm run version:bump` writes that file; this reads it at build time.
 *
 * It understands exactly the Keep a Changelog subset the file actually uses:
 *   ## [version] - date
 *   ### Section
 *   - item
 * and three inline forms: `code`, **bold**, [text](url). Anything else is shown as written, which
 * is the honest failure mode for a parser this small.
 */

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

const RELEASE = /^##\s+\[([^\]]+)\]\s*-\s*(.+?)\s*$/;
const SECTION = /^###\s+(.+?)\s*$/;
const ITEM = /^-\s+(.*)$/;

export function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let entry: ChangelogEntry | null = null;
  let section: ChangelogSection | null = null;

  for (const line of markdown.split('\n')) {
    const release = RELEASE.exec(line);
    if (release) {
      entry = { version: release[1]!, date: release[2]!, sections: [] };
      section = null;
      entries.push(entry);
      continue;
    }
    if (!entry) continue; // preamble above the first release

    const heading = SECTION.exec(line);
    if (heading) {
      section = { title: heading[1]!, items: [] };
      entry.sections.push(section);
      continue;
    }

    const item = ITEM.exec(line);
    if (item && section) {
      section.items.push(item[1]!.trim());
      continue;
    }
    // A continuation line of the previous bullet (wrapped text) belongs to that bullet.
    if (section && section.items.length && line.trim() && !line.startsWith('#')) {
      section.items[section.items.length - 1] += ` ${line.trim()}`;
    }
  }

  return entries;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Escape first, then apply the three inline forms. Order matters: doing it the other way round
 * would let the file's own text inject markup.
 */
export function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  return out;
}
