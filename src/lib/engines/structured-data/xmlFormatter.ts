// XML Formatter and Validator: pure browser formatting with DOMParser.
// No libraries. Pretty-print, minify, and report the first well-formedness error
// with a line and column when the browser surfaces one.

import type { StructuredDataTool, StructuredDataResult } from './types';

const MODE_PREFIX = /^@@(pretty|minify)@@\n/;

export type XmlMode = 'pretty' | 'minify';

export function stripModePrefix(input: string): { mode: XmlMode; xml: string } {
  const m = MODE_PREFIX.exec(input);
  if (!m) return { mode: 'pretty', xml: input };
  return { mode: m[1] as XmlMode, xml: input.slice(m[0].length) };
}

/** Line and column of a character offset (1-based), counting \\n. */
export function offsetToLineCol(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const end = Math.min(Math.max(0, offset), text.length);
  for (let i = 0; i < end; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

function parserErrorMessage(doc: Document): string | null {
  const err = doc.querySelector('parsererror');
  if (!err) return null;
  const text = (err.textContent || 'Malformed XML').replace(/\s+/g, ' ').trim();
  return text || 'Malformed XML';
}

/** Try to pull a 1-based line (and optional column) out of a DOMParser error string. */
export function parseErrorLocation(message: string): { line?: number; column?: number } {
  const lineCol = /line\s+(\d+)(?:\s*(?:,\s*|\s+at\s+)column\s+(\d+))?/i.exec(message);
  if (lineCol) {
    return {
      line: Number(lineCol[1]),
      column: lineCol[2] ? Number(lineCol[2]) : undefined,
    };
  }
  const at = /at\s+(\d+)(?::(\d+))?/.exec(message);
  if (at) {
    return { line: Number(at[1]), column: at[2] ? Number(at[2]) : undefined };
  }
  return {};
}

/**
 * Strip browser-specific DOMParser boilerplate so the status line can show
 * a short, human error plus our own (line N) suffix.
 */
export function cleanParserError(message: string): string {
  let s = message.replace(/\s+/g, ' ').trim();
  s = s.replace(/^This page contains the following errors:\s*/i, '');
  s = s.replace(/\s*Below is a rendering of the page up to the first error\.?/i, '');
  s = s.replace(/^error on line \d+(?:(?:\s*,)?\s*(?:at\s+)?column\s+\d+)?:\s*/i, '');
  s = s.replace(/^xml parse error:\s*/i, '');
  s = s.replace(/^Malformed XML:\s*/i, '');
  return s.trim();
}

/** Escape text-node content so a re-parse keeps the same characters. */
export function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape an attribute value written inside double quotes. */
export function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

const CDATA_PLACEHOLDER_BASE = 'tt-cdata-ph';

/** Pick a placeholder element name that does not already appear in the input. */
export function pickCdataPlaceholder(xml: string): string {
  const lower = xml.toLowerCase();
  let name = CDATA_PLACEHOLDER_BASE;
  let n = 0;
  while (lower.includes(`<${name}`) || lower.includes(`</${name}`)) {
    name = `${CDATA_PLACEHOLDER_BASE}-${++n}`;
  }
  return name;
}

/** Lift CDATA so DOMParser (and happy-dom) never has to parse it. */
export function extractCdataSections(
  xml: string,
  placeholder = CDATA_PLACEHOLDER_BASE,
): { xml: string; blocks: string[]; placeholder: string } {
  const name = placeholder;
  const blocks: string[] = [];
  const next = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_m, content: string) => {
    const i = blocks.length;
    blocks.push(content);
    return `<${name} i="${i}"/>`;
  });
  return { xml: next, blocks, placeholder: name };
}

/** Pull an XML declaration and/or DOCTYPE off the front of the source. */
export function extractProlog(xml: string): { prolog: string; body: string } {
  let i = 0;
  const parts: string[] = [];
  const ws = /^\s*/.exec(xml)?.[0] ?? '';
  i = ws.length;
  const decl = /^<\?xml\b[\s\S]*?\?>/i.exec(xml.slice(i));
  if (decl) {
    parts.push(decl[0].trim());
    i += decl[0].length;
    i += (/^\s*/.exec(xml.slice(i))?.[0] ?? '').length;
  }
  if (/^<!DOCTYPE\b/i.test(xml.slice(i))) {
    let j = i;
    let depth = 0;
    let quote = '';
    for (; j < xml.length; j++) {
      const c = xml[j];
      if (quote) {
        if (c === quote) quote = '';
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        continue;
      }
      if (c === '[') depth++;
      else if (c === ']') depth = Math.max(0, depth - 1);
      else if (c === '>' && depth === 0) {
        j++;
        break;
      }
    }
    parts.push(xml.slice(i, j).trim());
    i = j;
  }
  return { prolog: parts.join('\n'), body: xml.slice(i) };
}

function xmlSpacePreserve(el: Element): boolean {
  let n: Element | null = el;
  while (n) {
    const v = n.getAttribute('xml:space');
    if (v === 'preserve') return true;
    if (v === 'default') return false;
    n = n.parentElement;
  }
  return false;
}

function hasMixedContent(children: Node[]): boolean {
  let hasText = false;
  let hasEl = false;
  for (const c of children) {
    if (c.nodeType === Node.TEXT_NODE && (c.nodeValue ?? '').length > 0 && (c.nodeValue ?? '').trim()) {
      hasText = true;
    } else if (c.nodeType === Node.CDATA_SECTION_NODE) {
      hasText = true;
    } else if (c.nodeType === Node.ELEMENT_NODE) {
      hasEl = true;
    }
  }
  return hasText && hasEl;
}

function serializeInline(node: Node, parts: string[], cdataName: string, cdataBlocks: string[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    parts.push(escapeXmlText(node.nodeValue ?? ''));
    return;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    parts.push(`<![CDATA[${node.nodeValue ?? ''}]]>`);
    return;
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    parts.push(`<!--${node.nodeValue ?? ''}-->`);
    return;
  }
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    parts.push(`<?${pi.target} ${pi.data}?>`);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;
  const name = el.tagName;
  if (name === cdataName || name === cdataName.toUpperCase()) {
    const i = Number(el.getAttribute('i') ?? '-1');
    parts.push(`<![CDATA[${cdataBlocks[i] ?? ''}]]>`);
    return;
  }
  let attrs = '';
  for (const attr of Array.from(el.attributes)) {
    attrs += ` ${attr.name}="${escapeXmlAttr(attr.value)}"`;
  }
  const children = Array.from(el.childNodes);
  if (children.length === 0) {
    parts.push(`<${name}${attrs}/>`);
    return;
  }
  parts.push(`<${name}${attrs}>`);
  for (const child of children) serializeInline(child, parts, cdataName, cdataBlocks);
  parts.push(`</${name}>`);
}

function serializeNode(
  node: Node,
  indent: number,
  pretty: boolean,
  parts: string[],
  cdataName: string,
  cdataBlocks: string[],
  preserve = false,
): void {
  const pad = pretty && !preserve ? '  '.repeat(indent) : '';
  const nl = pretty && !preserve ? '\n' : '';

  if (node.nodeType === Node.TEXT_NODE) {
    const raw = node.nodeValue ?? '';
    if (preserve) {
      parts.push(escapeXmlText(raw));
      return;
    }
    if (pretty) {
      const trimmed = raw.trim();
      if (!trimmed) return;
      parts.push(pad + escapeXmlText(trimmed) + nl);
    } else if (raw.trim()) {
      parts.push(escapeXmlText(raw.replace(/\s+/g, ' ').trim()));
    }
    return;
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    parts.push(`${pad}<![CDATA[${node.nodeValue ?? ''}]]>${nl}`);
    return;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    parts.push(`${pad}<!--${node.nodeValue ?? ''}-->${nl}`);
    return;
  }

  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    parts.push(`${pad}<?${pi.target} ${pi.data}?>${nl}`);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;
  const name = el.tagName;
  // Placeholder for a CDATA section lifted before parse.
  if (name === cdataName || name === cdataName.toUpperCase()) {
    const i = Number(el.getAttribute('i') ?? '-1');
    const content = cdataBlocks[i] ?? '';
    parts.push(`${pad}<![CDATA[${content}]]>${nl}`);
    return;
  }
  let attrs = '';
  for (const attr of Array.from(el.attributes)) {
    attrs += ` ${attr.name}="${escapeXmlAttr(attr.value)}"`;
  }

  const children = Array.from(el.childNodes);
  const keepSpace = preserve || xmlSpacePreserve(el);

  if (children.length === 0) {
    parts.push(`${pad}<${name}${attrs}/>${nl}`);
    return;
  }

  // xml:space="preserve": keep the subtree verbatim, with no added indent.
  if (pretty && keepSpace) {
    parts.push(`${pad}<${name}${attrs}>`);
    for (const child of children) serializeNode(child, indent + 1, pretty, parts, cdataName, cdataBlocks, true);
    parts.push(`</${name}>${nl}`);
    return;
  }

  // Mixed content (text plus elements): keep it on one line, do not re-indent.
  if (pretty && hasMixedContent(children)) {
    parts.push(`${pad}<${name}${attrs}>`);
    for (const child of children) serializeInline(child, parts, cdataName, cdataBlocks);
    parts.push(`</${name}>${nl}`);
    return;
  }

  // Single text child stays on one line when pretty.
  if (
    pretty &&
    children.length === 1 &&
    children[0].nodeType === Node.TEXT_NODE &&
    !(children[0].nodeValue ?? '').includes('\n')
  ) {
    const text = escapeXmlText((children[0].nodeValue ?? '').trim());
    parts.push(`${pad}<${name}${attrs}>${text}</${name}>${nl}`);
    return;
  }

  parts.push(`${pad}<${name}${attrs}>${nl}`);
  for (const child of children) serializeNode(child, indent + 1, pretty, parts, cdataName, cdataBlocks, keepSpace);
  parts.push(`${pad}</${name}>${nl}`);
}

export function formatXml(xml: string, mode: XmlMode = 'pretty'): StructuredDataResult {
  if (!xml.trim()) return { ok: true, output: '' };
  if (typeof DOMParser === 'undefined') {
    return { ok: false, output: '', error: 'XML parsing is not available in this environment.' };
  }

  const { prolog, body } = extractProlog(xml);
  // Parse the body only so a referenced DTD is not fetched. Shift any line
  // the parser reports by the number of lines in the stripped prolog.
  const prefixLen = xml.length - body.length;
  const lineShift = (xml.slice(0, prefixLen).match(/\n/g) || []).length;
  const placeholder = pickCdataPlaceholder(body);
  const { xml: withoutCdata, blocks } = extractCdataSections(body, placeholder);
  const doc = new DOMParser().parseFromString(withoutCdata, 'application/xml');
  const errMsg = parserErrorMessage(doc);
  if (errMsg) {
    const loc = parseErrorLocation(errMsg);
    const line = loc.line != null ? loc.line + lineShift : undefined;
    const where =
      line != null
        ? loc.column != null
          ? ` (line ${line}, column ${loc.column})`
          : ` (line ${line})`
        : '';
    const detail = cleanParserError(errMsg);
    return { ok: false, output: '', error: detail ? `Malformed XML${where}: ${detail}` : `Malformed XML${where}`.trim() };
  }

  const parts: string[] = [];
  if (prolog) {
    parts.push(prolog + (mode === 'pretty' ? '\n' : ''));
  }

  const root = doc.documentElement;
  if (!root) return { ok: false, output: '', error: 'Malformed XML: no root element.' };
  serializeNode(root, 0, mode === 'pretty', parts, placeholder, blocks);
  let output = parts.join('');
  if (mode === 'pretty') output = output.replace(/\n+$/, '\n');
  return { ok: true, output };
}

export const xmlFormatter: StructuredDataTool = {
  id: 'xml-formatter',
  family: 'json',
  execute: (input) => {
    const { mode, xml } = stripModePrefix(input);
    return formatXml(xml, mode);
  },
};
