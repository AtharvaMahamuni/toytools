// Tool Groups — declarative manifest for tools that form one unified workspace.
//
// A group is a set of sibling tools sharing one engine + experience (e.g. the seven
// case converters): each member keeps its own URL/metadata/guide/FAQ for SEO, but the
// tool page renders a GroupSwitcher between them and TextProcessorWidget persists
// input under a shared state key ("group:{id}") so text survives mode switches.
//
// Member order here defines switcher order. validate-registry enforces that every
// member slug resolves, that membership is bidirectional (config.toolGroup ↔ manifest),
// and that all members share the same engine + pattern.

export interface ToolGroupMember {
  /** Tool slug — must exist in the registry and declare `toolGroup` back to this group. */
  slug: string;
  /** Short switcher label (e.g. 'camelCase', 'snake_case') — not the SEO page name. */
  label: string;
}

export interface ToolGroup {
  /** Stable group id, referenced by ToolConfig.toolGroup (e.g. 'case-converters'). */
  id: string;
  /** Human name for the workspace (e.g. 'Case Converter'). */
  name: string;
  /** Ordered members — defines GroupSwitcher pill order. */
  members: ToolGroupMember[];
}

export const toolGroups: ToolGroup[] = [
  {
    id: 'json-tools',
    name: 'JSON Tools',
    members: [
      { slug: 'json-formatter',   label: 'Format'    },
      { slug: 'json-minifier',    label: 'Minify'    },
      { slug: 'json-tree-viewer', label: 'Tree View' },
    ],
  },
  {
    id: 'json-yaml',
    name: 'JSON ↔ YAML',
    members: [
      { slug: 'json-to-yaml-converter', label: 'JSON → YAML' },
      { slug: 'yaml-to-json-converter', label: 'YAML → JSON' },
    ],
  },
  {
    id: 'json-csv',
    name: 'JSON ↔ CSV',
    members: [
      { slug: 'json-to-csv-converter', label: 'JSON → CSV' },
      { slug: 'csv-to-json-converter', label: 'CSV → JSON' },
    ],
  },
  {
    id: 'text-counters',
    name: 'Text Counter',
    members: [
      { slug: 'word-counter',             label: 'Words'        },
      { slug: 'character-counter',        label: 'Characters'   },
      { slug: 'letter-counter',           label: 'Letters'      },
      { slug: 'sentence-counter',         label: 'Sentences'    },
      { slug: 'paragraph-counter',        label: 'Paragraphs'   },
      { slug: 'line-counter',             label: 'Lines'        },
      { slug: 'space-counter',            label: 'Spaces'       },
      { slug: 'reading-time-calculator',  label: 'Reading Time' },
    ],
  },
  {
    id: 'hash-generators',
    name: 'Hash Generator',
    members: [
      { slug: 'md5-hash-generator',    label: 'MD5'     },
      { slug: 'sha1-hash-generator',   label: 'SHA-1'   },
      { slug: 'sha256-hash-generator', label: 'SHA-256' },
      { slug: 'sha512-hash-generator', label: 'SHA-512' },
      { slug: 'crc32-hash-generator',  label: 'CRC32'   },
    ],
  },
  {
    id: 'encoders',
    name: 'Encoder / Decoder',
    members: [
      { slug: 'base64-encoder-decoder',      label: 'Base64'   },
      { slug: 'url-encoder-decoder',         label: 'URL'      },
      { slug: 'html-entity-encoder-decoder', label: 'HTML'     },
      { slug: 'hex-encoder-decoder',         label: 'Hex'      },
      { slug: 'binary-text-converter',       label: 'Binary'   },
      { slug: 'punycode-converter',          label: 'Punycode' },
    ],
  },
  {
    id: 'text-cleanup',
    name: 'Text Cleanup',
    members: [
      { slug: 'remove-extra-spaces',    label: 'Extra Spaces'    },
      { slug: 'remove-blank-lines',     label: 'Blank Lines'     },
      { slug: 'remove-duplicate-lines', label: 'Duplicate Lines' },
      { slug: 'remove-line-breaks',     label: 'Line Breaks'     },
      { slug: 'remove-tabs',            label: 'Tabs'            },
      { slug: 'trim-text',              label: 'Trim'            },
      { slug: 'normalize-whitespace',   label: 'Whitespace'      },
      { slug: 'remove-accents',         label: 'Accents'         },
    ],
  },
  {
    id: 'case-converters',
    name: 'Case Converter',
    members: [
      { slug: 'uppercase-converter',     label: 'UPPERCASE' },
      { slug: 'lowercase-converter',     label: 'lowercase' },
      { slug: 'title-case-converter',    label: 'Title Case' },
      { slug: 'sentence-case-converter', label: 'Sentence Case' },
      { slug: 'camel-case-converter',    label: 'camelCase' },
      { slug: 'snake-case-converter',    label: 'snake_case' },
      { slug: 'kebab-case-converter',    label: 'kebab-case' },
    ],
  },
];

export function getToolGroup(id: string): ToolGroup | undefined {
  return toolGroups.find(g => g.id === id);
}
