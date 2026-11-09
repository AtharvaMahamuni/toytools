import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'xml-fmt-1',
    question: 'What does the XML Formatter change?',
    answer:
      'Only layout when the document is well-formed. Pretty print uses two-space indentation and puts nested elements on their own lines. Minify removes insignificant whitespace between elements. Element names, attributes, text, comments and CDATA stay the same.',
  },
  {
    id: 'xml-fmt-2',
    question: 'What does validate mean here?',
    answer:
      'Well-formedness: one root element, matching start and end tags, and legal names. It does not check an XSD, DTD or Schematron schema. Therefore a document can be well-formed and still fail a schema your API expects.',
  },
  {
    id: 'xml-fmt-3',
    question: 'Why is XML case sensitive?',
    answer:
      'XML treats Book and book as different element names. HTML is more forgiving in browsers. If a close tag does not match the open tag exactly, including case, the document is not well-formed and the formatter reports an error instead of guessing.',
  },
  {
    id: 'xml-fmt-4',
    question: 'How do XML namespaces show up?',
    answer:
      'A namespace is a URI bound to a prefix (xmlns:book="...") or to the default xmlns. Prefixed names stay as written. This page does not resolve external DTDs or schemas, so namespace URIs are kept as attributes rather than fetched.',
  },
  {
    id: 'xml-fmt-5',
    question: 'Is my XML sent to a server?',
    answer:
      'No. Parsing and formatting run in your browser with the built-in DOMParser. Nothing leaves this tab and nothing is stored remotely.',
  },
  {
    id: 'xml-fmt-6',
    question: 'Where is the error line taken from?',
    answer:
      'From the browser parser message when it includes a line (and sometimes a column). Different browsers word that message differently. If no line is present, the status still shows the malformed XML message.',
  },
  {
    id: 'xml-fmt-7',
    question: 'Can I minify XML as well as pretty-print it?',
    answer:
      'Yes. Choose Minify in the mode control. Insignificant whitespace between elements is removed so the payload is smaller while the infoset stays the same.',
  },
  {
    id: 'xml-fmt-8',
    question: 'Will formatting change what my XML means?',
    answer:
      'No for element structure and attribute values. Whitespace-only text nodes between elements may be normalised when pretty-printing, which matches how most documents treat insignificant whitespace.',
  },
];
