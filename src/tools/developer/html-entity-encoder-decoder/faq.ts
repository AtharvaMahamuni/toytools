import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'html-ent-faq-1',
    question: 'What is an HTML entity?',
    answer:
      'A character reference that lets you display characters the HTML parser would otherwise treat as markup. `&lt;` renders as `<` without the browser interpreting it as an opening tag. Entities start with `&` and end with `;`, with either a name (`&lt;`) or a numeric code point (`&#60;` or `&#x3C;`) in between.',
  },
  {
    id: 'html-ent-faq-2',
    question: 'Which characters must always be escaped in HTML?',
    answer:
      'Four: `<` as `&lt;`, `>` as `&gt;`, `&` as `&amp;`, and `"` inside attribute values as `&quot;`. These have structural meaning in HTML — they open and close tags, start entity references, and delimit attribute strings. Everything else is optional if your page is UTF-8, though numeric references always work as alternatives.',
  },
  {
    id: 'html-ent-faq-3',
    question: 'Do I still need HTML entities if my page uses UTF-8?',
    answer:
      'Only for the four reserved characters above. UTF-8 covers virtually all of Unicode, so you can include an em dash, a copyright symbol, or Japanese text directly in your HTML source without escaping. The reason you still escape `<`, `>`, and `&` has nothing to do with encoding — it\'s because they carry structural meaning in HTML syntax.',
  },
  {
    id: 'html-ent-faq-4',
    question: 'What\'s the difference between &amp; and &#38;?',
    answer:
      'Same character, different notation. `&amp;` is the named character reference. `&#38;` is the decimal numeric reference. `&#x26;` is the hexadecimal numeric reference. All three render as `&`. Named references are more readable; numeric ones work for any Unicode code point, including characters that have no named form.',
  },
  {
    id: 'html-ent-faq-5',
    question: 'Why does &nbsp; behave differently from a regular space?',
    answer:
      'A regular space is a line-break opportunity — the browser can wrap text at it and collapse multiple adjacent spaces to one. A non-breaking space (`&nbsp;`) prevents the line break and prevents collapse. Use it to keep values together on one line, like `10&nbsp;kg` or `Vol.&nbsp;IV`. Don\'t use it to add visual padding or indentation — that\'s a job for CSS margins and padding.',
  },
  {
    id: 'html-ent-faq-6',
    question: 'What\'s the difference between HTML encoding and URL encoding?',
    answer:
      'Different problems, different formats. HTML encoding escapes characters so they render safely inside HTML markup. URL encoding escapes characters so they transmit safely inside a URL. A `<` in HTML becomes `&lt;`. The same `<` in a URL becomes `%3C`. If you\'re building a URL inside an HTML attribute, both apply: the URL components get percent-encoded, and any `&` separating query parameters gets written as `&amp;` in the HTML source.',
  },
  {
    id: 'html-ent-faq-7',
    question: 'What happens if I forget to escape < or > in user content?',
    answer:
      'The browser parses it as HTML. A stray `<script>` in a username, comment, or form field can execute arbitrary JavaScript if the page renders it unescaped — that\'s cross-site scripting (XSS). Any content from user input, a database, or an external API must be HTML-escaped before it\'s inserted into the page. Most templating engines do this automatically, but raw DOM manipulation or `innerHTML` assignments don\'t.',
  },
  {
    id: 'html-ent-faq-8',
    question: 'Does HTML entity encoding prevent XSS?',
    answer:
      'It blocks the most common XSS vectors in HTML text and attribute contexts. But the protection is context-dependent. The same content placed inside a `<script>` block, a CSS `style` attribute, or a URL `href` needs different escaping rules. HTML entity encoding covers HTML contexts — for other contexts, use the escaping rules specific to that context.',
  },
  {
    id: 'html-ent-faq-9',
    question: 'Why doesn\'t &apos; work in older HTML?',
    answer:
      '`&apos;` was defined in XML and XHTML, but it wasn\'t added to the HTML spec until HTML5 (2008). Older HTML4 parsers don\'t recognize it and render the literal text `&apos;` instead of an apostrophe. If you need a single quote in an attribute value and want to support older parsers, use the numeric reference `&#39;` instead.',
  },
];
