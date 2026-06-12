import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'url-enc-faq-1',
    question: 'What does URL encoding do?',
    answer:
      'It converts characters that are unsafe or reserved in URLs into a safe `%XX` format. Each unsafe character is replaced with a percent sign followed by two hexadecimal digits: its ASCII or UTF-8 byte value. `%20` is a space, `%3A` is a colon, `%26` is an ampersand. The server decodes these back to the original characters before your application reads the value.',
  },
  {
    id: 'url-enc-faq-2',
    question: 'What\'s the difference between %20 and + for spaces?',
    answer:
      'Both represent a space, but in different contexts. `%20` is correct for URL paths and query strings in standard URIs. `+` is only valid inside form data encoded as `application/x-www-form-urlencoded`: the format HTML forms use on submission. Use `+` in that context, `%20` everywhere else. If you send a `+` in a JSON API call or URL path, the server treats it as a literal plus sign, not a space.',
  },
  {
    id: 'url-enc-faq-3',
    question: 'When should I use encodeURIComponent vs encodeURI?',
    answer:
      'Use `encodeURIComponent` for individual query parameter values and path segments, any data that could contain `&`, `=`, `/`, `?`, or `:`. It encodes those characters because they would otherwise be interpreted as URL structure. Use `encodeURI` only for a complete URL you want to preserve intact, since it skips structural characters. In practice, `encodeURIComponent` is what you need nearly every time.',
  },
  {
    id: 'url-enc-faq-4',
    question: 'Which characters must be percent-encoded?',
    answer:
      'At minimum: space, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, and the backtick. Also any byte with value above 127: accented characters, emoji, non-Latin scripts. The reserved characters (`/`, `?`, `#`, `&`, `=`, `:`, `@`) only need encoding when they appear as data inside a URL component. When acting as URL structure (a slash separating path segments, a `?` starting the query) they must stay unencoded.',
  },
  {
    id: 'url-enc-faq-5',
    question: 'What is double encoding and how do I avoid it?',
    answer:
      'Double encoding means encoding an already-encoded string a second time. A space encodes to `%20` once. If you encode that again, `%` becomes `%25` and the result is `%2520`. The server decodes it to the literal text `%20`, not a space. Encode raw user input exactly once, right before it goes into the URL. If you\'re working with a string that may already be encoded, decode it first, then encode once.',
  },
  {
    id: 'url-enc-faq-6',
    question: 'Does URL encoding apply to paths or just query parameters?',
    answer:
      'Both. A path segment with a space in it needs encoding: `/my%20folder/readme.txt`. Query parameters need it too: `?name=John%20Doe&city=New%20York`. The reserved characters differ slightly between path and query contexts: for example, `?` and `=` are structural in the query but not in the path, but encoding applies everywhere. `encodeURIComponent` handles both correctly when used on individual segments.',
  },
  {
    id: 'url-enc-faq-7',
    question: 'Is URL encoding the same as URL escaping or percent-encoding?',
    answer:
      'Yes, all three names refer to the same mechanism. RFC 3986 calls it percent-encoding. Developers call it URL encoding or URL escaping. The technique is identical: an unsafe character is replaced with `%` followed by its hexadecimal byte value. Different names, one thing.',
  },
  {
    id: 'url-enc-faq-8',
    question: 'What happens if I forget to encode a query parameter?',
    answer:
      'Special characters corrupt URL parsing. An unencoded `&` splits one parameter into two. An unencoded `#` ends the query string: everything after it becomes a fragment identifier that never reaches the server. An unencoded `?` starts a second query string. Most frameworks encode parameters automatically when you build URLs through their APIs, but hand-assembled URL strings have no safety net.',
  },
  {
    id: 'url-enc-faq-9',
    question: 'How does this tool encode and decode?',
    answer:
      'Encoding uses `encodeURIComponent`, which encodes every character except unreserved ones: `A–Z`, `a–z`, `0–9`, `-`, `_`, `.`, `!`, `~`, `*`, `\'`, `(`, `)`. Decoding uses `decodeURIComponent`. This is the right choice for encoding query values and path segments. If you need to encode a complete URL without breaking its structure, use `encodeURI` in your own code instead.',
  },
];
