import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'slugify-text-faq-1',
    question: 'What is a URL slug?',
    answer:
      'A slug is the human-readable part of a web address that identifies a page, such as "how-to-slugify-text" in /guide/how-to-slugify-text. A good slug is lowercase, uses hyphens between words, and contains only letters and numbers.',
  },
  {
    id: 'slugify-text-faq-2',
    question: 'How does slugify handle accents and symbols?',
    answer:
      'Accented letters are converted to their plain ASCII base first, so "Café" becomes "cafe". Every run of spaces, punctuation, or other symbols is replaced with a single hyphen, and leading or trailing hyphens are trimmed.',
  },
  {
    id: 'slugify-text-faq-3',
    question: 'Can I slugify a whole list at once?',
    answer:
      'Yes. Each line is turned into its own slug, so you can paste a list of titles and get one slug per line back. This is handy for generating permalinks for many posts at once.',
  },
  {
    id: 'slugify-text-faq-4',
    question: 'What makes a URL slug SEO-friendly?',
    answer:
      'An SEO-friendly slug is short, lowercase, hyphen-separated, and built from the keywords a searcher would actually type. For example, a post titled "10 Easy Pasta Recipes for Busy Weeknights" ranks and reads better as "easy-pasta-recipes" than as the full title with numbers and filler words. Readable, keyword-bearing slugs earn more clicks in search results, are easier to share, and give search engines a clear, stable signal about the page topic.',
  },
  {
    id: 'slugify-text-faq-5',
    question: 'What is the difference between slugify and kebab-case?',
    answer:
      'Slugify builds URL-safe slugs: it strips accents to plain ASCII, lowercases everything, and removes any character that is not a letter or number. Kebab-case is a code formatting style for identifiers such as CSS class names and config keys, and it hyphenates words without folding accents away. For example, slugify turns "Crème Brûlée Recipe!" into "creme-brulee-recipe", while a kebab-case pass keeps the è and û intact. Use slugify for permalinks and kebab-case for code.',
  },
  {
    id: 'slugify-text-faq-6',
    question: 'Is a slug the same as the URL path?',
    answer:
      'No. The slug is only the final readable segment of an address, while the path is everything after the domain, including parent folders. For example, in toytoolsapp.com/guide/text/how-to-slugify-text/, the path is /guide/text/how-to-slugify-text/ and the slug is just how-to-slugify-text. When a CMS asks for a slug, it wants that last segment alone; the rest of the path is built for you from the site structure.',
  },
  {
    id: 'slugify-text-faq-7',
    question: 'Does slugify keep accented characters like é or ü?',
    answer:
      'No, slugify folds accented characters to their unaccented ASCII form by design. For example, "Crème Brûlée Recipe!" becomes "creme-brulee-recipe": è and û fold to e and u, and the exclamation mark disappears. Accented characters inside a URL get percent-encoded into strings like %C3%A8, which are unreadable and easy to mistype, so a slug limited to a-z and 0-9 stays shareable everywhere.',
  },
  {
    id: 'slugify-text-faq-8',
    question: 'Why does slugify make everything lowercase?',
    answer:
      'Slugify lowercases every letter by design because URL paths are case-sensitive on many web servers. If /My-Post and /my-post both resolve, search engines can treat them as two separate pages with duplicated content, splitting ranking signals between them. For example, "10 JavaScript Tips" always becomes "10-javascript-tips", never "10-JavaScript-Tips". Publishing every slug in one consistent lowercase form removes that ambiguity, so there is no option here to preserve capitals.',
  },
  {
    id: 'slugify-text-faq-9',
    question: 'Is it safe to paste titles into an online slug generator?',
    answer:
      'This slug generator runs entirely in your browser, so nothing you paste is uploaded to a server. The slugify step is plain JavaScript executed on your device, and results appear as you type. For example, you can paste a full list of unpublished post titles for a client project and generate their permalinks without any of that text leaving your machine.',
  },
];
