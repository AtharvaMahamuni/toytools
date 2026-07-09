import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jyaml-faq-1',
    question: 'What is the difference between JSON and YAML?',
    answer:
      'Both are data serialization formats that represent the same hierarchical data. JSON uses explicit punctuation: braces for objects, brackets for arrays, commas as separators, and quotes around all strings. YAML uses indentation and minimal punctuation: colons for key-value pairs, dashes for list items, and no mandatory quotes. YAML is often easier to read in configuration files; JSON is more compact and universally supported in APIs and tools.',
  },
  {
    id: 'jyaml-faq-2',
    question: 'Why would I convert JSON to YAML?',
    answer:
      'YAML is the standard format for many configuration and infrastructure tools: Kubernetes manifests, Docker Compose files, Ansible playbooks, GitHub Actions workflows, and CI/CD pipeline definitions all use YAML. If you have data in JSON from an API response, a config export, or a database, converting it to YAML makes it ready for these tools with no manual reformatting.',
  },
  {
    id: 'jyaml-faq-3',
    question: 'Why would I convert YAML back to JSON?',
    answer:
      'JSON is the lingua franca of APIs and most programming languages. If you have a YAML config file and need to pass it to an API, validate it with a JSON Schema, or process it with a language that lacks a YAML library, converting to JSON first is the practical approach. The converter handles this direction just as easily.',
  },
  {
    id: 'jyaml-faq-4',
    question: 'Is YAML indentation mandatory?',
    answer:
      'Yes. In YAML, indentation using spaces (never tabs) defines the document structure. A single misplaced space changes the meaning of the document or causes a parse error. Two spaces per level is the most common convention. The converter always produces correctly-indented output; if you edit the YAML by hand, be careful to keep indentation consistent.',
  },
  {
    id: 'jyaml-faq-5',
    question: 'Why are some string values wrapped in quotes in the YAML output?',
    answer:
      'YAML has reserved words and implicit type coercion rules. The unquoted values true, false, null, yes, no, on, and off are interpreted as booleans or null by most parsers. Values that look like numbers (e.g., 10001) would be parsed as integers. The converter automatically wraps these in double quotes so the string type is preserved exactly as it was in the JSON.',
  },
  {
    id: 'jyaml-faq-6',
    question: 'What does the "Flow arrays" option do?',
    answer:
      'When enabled, arrays that contain only scalar values (strings, numbers, booleans, nulls) are serialized inline in flow style: [a, b, c] instead of the block style with each item on a separate line. This produces more compact output for lists of tags, IDs, or simple values. Arrays containing objects or nested arrays are always serialized in block style regardless of this setting.',
  },
  {
    id: 'jyaml-faq-7',
    question: 'What does the "--- marker" option do?',
    answer:
      'The triple-dash marker (---) is the YAML document-start indicator. Most YAML parsers do not require it, but Kubernetes, some Helm charts, and tools that process multi-document YAML streams expect or prefer it. Enabling this option prepends --- on its own line before the YAML content.',
  },
  {
    id: 'jyaml-faq-8',
    question: 'Is my data private when I use this tool?',
    answer:
      'Yes. The JSON you paste and the YAML it produces are processed entirely in your browser with JavaScript, so nothing is uploaded, stored, or logged on any server. That makes it safe for internal configuration files, credentials structures, or any sensitive data, and it keeps working offline once the page has loaded.',
  },
];
