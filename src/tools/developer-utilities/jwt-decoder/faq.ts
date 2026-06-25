import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jwt-faq-1',
    question: 'Is it safe to paste my JWT here?',
    answer:
      'Yes. This tool runs entirely in your browser. The token is decoded with local JavaScript and is never uploaded, logged, or sent to any server. ToyTools is a static site with no backend, so there is nowhere for your token to go. That said, treat any token you copy from other systems as a secret and avoid pasting it into tools you do not trust.',
  },
  {
    id: 'jwt-faq-2',
    question: 'What is a JWT made of?',
    answer:
      'A JWT has three parts separated by dots: the header, the payload, and the signature. The header and payload are JSON objects encoded with Base64URL, so anyone can decode and read them. The signature is a cryptographic value that lets a server confirm the token was not tampered with. This tool decodes the header and payload and shows the raw signature.',
  },
  {
    id: 'jwt-faq-3',
    question: 'Does this tool verify the signature?',
    answer:
      'No. Decoding and verifying are different operations. Decoding just Base64URL-decodes the header and payload so you can read them, which needs no key. Verifying checks the signature against the secret (for HMAC) or the public key (for RSA or ECDSA) to prove the token is authentic and unmodified. Signature verification must happen on your server with the key, never in a public web tool.',
  },
  {
    id: 'jwt-faq-4',
    question: 'What do exp, iat, and nbf mean?',
    answer:
      'These are registered time claims, expressed as Unix timestamps in seconds. "iat" (issued at) is when the token was created. "exp" (expiration) is when it stops being valid. "nbf" (not before) is the earliest time the token may be used. This tool converts each of these to a readable date and a relative time, and flags the token as expired when "exp" is in the past.',
  },
  {
    id: 'jwt-faq-5',
    question: 'Can a JWT be decrypted?',
    answer:
      'A standard JWT is not encrypted, so there is nothing to decrypt. The header and payload are only encoded, which means anyone can read them. Never store passwords or other secrets in a JWT payload. If you genuinely need the contents hidden, you want a JWE (JSON Web Encryption) token, which is a different format.',
  },
  {
    id: 'jwt-faq-6',
    question: 'Why does my token fail to decode?',
    answer:
      'The most common causes are a missing or extra segment (a valid JWT has exactly three dot-separated parts), copied whitespace or line breaks inside the token, or a truncated value. This tool reports the specific problem, such as an invalid Base64URL segment or a payload that is not valid JSON, so you can pinpoint the issue.',
  },
  {
    id: 'jwt-faq-7',
    question: 'What is the difference between Base64 and Base64URL in a JWT?',
    answer:
      'JWTs use Base64URL, a variant of Base64 that replaces "+" with "-" and "/" with "_" and drops the trailing "=" padding. This makes the encoded segments safe to place directly in URLs and HTTP headers without further escaping. This decoder restores the standard characters and padding automatically before decoding.',
  },
  {
    id: 'jwt-faq-8',
    question: 'Can I edit a decoded token and re-sign it?',
    answer:
      'Not with this tool. You can read and copy the decoded header and payload, but changing the payload would invalidate the signature, and re-signing requires the original secret or private key. Issuing or signing tokens should be done by your authentication server, not a browser tool.',
  },
];
