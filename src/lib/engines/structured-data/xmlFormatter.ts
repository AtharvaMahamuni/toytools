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

function serializeNode(node: Node, indent: number, pretty: boolean, parts: string[]): void {
  const pad = pretty ? '  '.repeat(indent) : '';
  const nl = pretty ? '\n' : '';

  if (node.nodeType === Node.TEXT_NODE) {
    const raw = node.nodeValue ?? '';
    if (pretty) {
      const trimmed = raw.trim();
      if (!trimmed) return;
      parts.push(pad + trimmed + nl);
    } else if (raw.trim()) {
      parts.push(raw.replace(/\s+/g, ' ').trim());
    }
    return;
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    parts.push(`${pretty ? pad : ''}<![CDATA[${node.nodeValue ?? ''}]]>${nl}`);
    return;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    parts.push(`${pretty ? pad : ''}<!--${node.nodeValue ?? ''}-->${nl}`);
    return;
  }

  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    parts.push(`${pretty ? pad : ''}<?${pi.target} ${pi.data}?>${nl}`);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;
  const name = el.tagName;
  let attrs = '';
  for (const attr of Array.from(el.attributes)) {
    const q = attr.value.includes('"') ? "'" : '"';
    attrs += ` ${attr.name}=${q}${attr.value}${q}`;
  }

  const children = Array.from(el.childNodes);
  if (children.length === 0) {
    parts.push(`${pretty ? pad : ''}<${name}${attrs}/>${nl}`);
    return;
  }

  // Single text child stays on one line when pretty.
  if (
    pretty &&
    children.length === 1 &&
    children[0].nodeType === Node.TEXT_NODE &&
    !(children[0].nodeValue ?? '').includes('\n')
  ) {
    const text = (children[0].nodeValue ?? '').trim();
    parts.push(`${pad}<${name}${attrs}>${text}</${name}>${nl}`);
    return;
  }

  parts.push(`${pretty ? pad : ''}<${name}${attrs}>${nl}`);
  for (const child of children) serializeNode(child, indent + 1, pretty, parts);
  parts.push(`${pretty ? pad : ''}</${name}>${nl}`);
}

export function formatXml(xml: string, mode: XmlMode = 'pretty'): StructuredDataResult {
  if (!xml.trim()) return { ok: true, output: '' };
  if (typeof DOMParser === 'undefined') {
    return { ok: false, output: '', error: 'XML parsing is not available in this environment.' };
  }

  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const errMsg = parserErrorMessage(doc);
  if (errMsg) {
    const loc = parseErrorLocation(errMsg);
    const where =
      loc.line != null
        ? loc.column != null
          ? ` (line ${loc.line}, column ${loc.column})`
          : ` (line ${loc.line})`
        : '';
    return { ok: false, output: '', error: `Malformed XML${where}: ${errMsg}` };
  }

  const parts: string[] = [];
  // Preserve XML declaration when the source had one.
  if (/^\s*<\?xml\b/i.test(xml)) {
    const decl = /^\s*<\?xml\b[^?]*\?>/i.exec(xml);
    if (decl) parts.push(decl[0].trim() + (mode === 'pretty' ? '\n' : ''));
  }

  const root = doc.documentElement;
  if (!root) return { ok: false, output: '', error: 'Malformed XML: no root element.' };
  serializeNode(root, 0, mode === 'pretty', parts);
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
