// QR code generator strategy.
//
// Turns text, a URL, an email, a phone number, Wi-Fi credentials, or a contact card into a QR
// matrix. The engine only produces the boolean module grid + the encoded string; the widget
// rasterizes that to a canvas (PNG) and builds an SVG. Encoding uses `qrcode-generator` (MIT, zero
// deps), bundled into the runtime by Astro so it works fully offline after first load.
//
// Content fields are conditional (showWhen) so one static schema drives all six modes: the widget
// shows the Wi-Fi cluster only for the "wifi" type, the contact cluster only for "vcard", etc.

import qrcode from 'qrcode-generator';
import type { Generator, GenerationResult, GeneratorOptions } from '../types';
import { wifiPayload, vcardPayload, emailPayload, phonePayload } from '../utils';

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

/** Build the exact string to encode from the selected content type + its fields. */
function payloadFor(opts: GeneratorOptions): string {
  const type = str(opts.contentType) || 'text';
  switch (type) {
    case 'email':
      return emailPayload(str(opts.text));
    case 'phone':
      return phonePayload(str(opts.text));
    case 'wifi':
      return wifiPayload({
        ssid: str(opts.ssid),
        password: str(opts.wifiPassword),
        encryption: (str(opts.encryption) || 'WPA') as 'WPA' | 'WEP' | 'nopass',
        hidden: bool(opts.hidden, false),
      });
    case 'vcard':
      return vcardPayload({
        fullName: str(opts.fullName),
        phone: str(opts.vcardPhone),
        email: str(opts.vcardEmail),
        org: str(opts.org),
      });
    case 'url':
    case 'text':
    default:
      return str(opts.text);
  }
}

export const qrCode: Generator = {
  id: 'qr-code',
  family: 'code',
  autoGenerate: false,
  live: true,
  fields: [
    {
      id: 'contentType',
      label: 'Content',
      type: 'select',
      default: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'url', label: 'URL' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'wifi', label: 'Wi-Fi' },
        { value: 'vcard', label: 'Contact card' },
      ],
    },
    {
      id: 'text', label: 'Value', type: 'text', default: '',
      placeholder: 'Text, https://example.com, name@example.com, or +1 555 010 0000',
      help: 'What the QR code will contain.',
      showWhen: { field: 'contentType', oneOf: ['text', 'url', 'email', 'phone'] },
    },
    // Wi-Fi cluster
    { id: 'ssid', label: 'Network name (SSID)', type: 'text', default: '', placeholder: 'MyNetwork', showWhen: { field: 'contentType', equals: 'wifi' } },
    { id: 'wifiPassword', label: 'Wi-Fi password', type: 'text', default: '', placeholder: 'Network password', showWhen: { field: 'contentType', equals: 'wifi' } },
    {
      id: 'encryption', label: 'Security', type: 'select', default: 'WPA',
      options: [
        { value: 'WPA', label: 'WPA/WPA2' },
        { value: 'WEP', label: 'WEP' },
        { value: 'nopass', label: 'None' },
      ],
      showWhen: { field: 'contentType', equals: 'wifi' },
    },
    { id: 'hidden', label: 'Hidden network', type: 'boolean', default: false, showWhen: { field: 'contentType', equals: 'wifi' } },
    // Contact card cluster
    { id: 'fullName', label: 'Full name', type: 'text', default: '', placeholder: 'Ada Lovelace', showWhen: { field: 'contentType', equals: 'vcard' } },
    { id: 'vcardPhone', label: 'Phone', type: 'text', default: '', placeholder: '+1 555 010 0000', showWhen: { field: 'contentType', equals: 'vcard' } },
    { id: 'vcardEmail', label: 'Email', type: 'text', default: '', placeholder: 'name@example.com', showWhen: { field: 'contentType', equals: 'vcard' } },
    { id: 'org', label: 'Organization', type: 'text', default: '', placeholder: 'Company (optional)', showWhen: { field: 'contentType', equals: 'vcard' } },
    {
      id: 'errorCorrection', label: 'Error correction', type: 'select', default: 'M',
      options: [
        { value: 'L', label: 'Low (7%)' },
        { value: 'M', label: 'Medium (15%)' },
        { value: 'Q', label: 'Quartile (25%)' },
        { value: 'H', label: 'High (30%)' },
      ],
      group: 'Options',
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const content = payloadFor(opts);
    if (!content.trim()) {
      return { ok: false, kind: 'qr', error: 'Enter the content to encode.' };
    }
    const level = ((): ErrorLevel => {
      const l = str(opts.errorCorrection).toUpperCase();
      return l === 'L' || l === 'Q' || l === 'H' ? l : 'M';
    })();

    // typeNumber 0 = auto-select the smallest version that fits the data at this EC level.
    const qr = qrcode(0, level);
    qr.addData(content);
    qr.make();
    const count = qr.getModuleCount();
    const modules: boolean[][] = [];
    for (let row = 0; row < count; row++) {
      const line: boolean[] = [];
      for (let col = 0; col < count; col++) line.push(qr.isDark(row, col));
      modules.push(line);
    }

    return {
      ok: true,
      kind: 'qr',
      qr: { modules, count, content },
      text: content,
      downloads: ['png', 'svg'],
      meta: [
        { label: 'Modules', value: `${count} x ${count}` },
        { label: 'Error correction', value: level },
      ],
    };
  },
};
