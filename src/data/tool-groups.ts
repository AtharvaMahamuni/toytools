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
