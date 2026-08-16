import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'shell-quote-escalator',
  title: 'Shell Quote Escalator',
  category: 'developer-utilities',
  summary:
    'Quote a command for every shell it passes through on the way to ssh, sudo or docker exec, and read the exact string each layer receives.',
  primaryConcepts: ['Nested shell quoting across ssh, bash and docker exec layers'],
  secondaryConcepts: [
    'nested quotes',
    'POSIX single quoting',
    'shell word splitting',
    'parameter expansion',
    'remote command execution',
  ],
  intentGroups: {
    informational: [
      'Why does a command need quoting more than once?',
      'What does each shell do to a command it receives?',
    ],
    howTo: [
      'How to escape quotes in an ssh command',
      'How to quote a command for sudo sh -c',
      'How to pass a command with spaces to docker exec',
    ],
    comparison: [
      'Single quotes vs double quotes for remote commands',
      'Shell quoting vs JSON escaping',
    ],
    misconception: [
      'One set of quotes is enough for any remote command',
      'Backslashes and quotes are interchangeable protection',
    ],
    troubleshooting: [
      'A path with spaces splits into two arguments on the remote host',
      'A variable expands locally instead of on the server',
      'A command works locally and fails over ssh',
    ],
  },
  realWorldUseCases: [
    'Running a one-liner on a server over ssh from a local terminal',
    'Wrapping a command in sudo sh -c inside an Ansible or CI task',
    'Sending a command with spaces and quotes into docker exec',
    'Building a remote command inside a shell script without testing it against production',
  ],
  commonMistakes: [
    'Adding backslashes until the error stops, without ever seeing what the far end received',
    'Quoting for one shell when the command passes through two or three',
    'Expecting a variable or a glob to resolve locally when the quoting protects it for the far side',
    'Mixing single and double quotes so the outer layer ends early and the rest becomes separate arguments',
  ],
  commonQuestions: [
    'How do I escape quotes in an ssh command?',
    'How many levels of quoting does sudo inside ssh need?',
    'Why does my path with spaces break on the remote host?',
    'Where does $HOME resolve when I send it over ssh?',
  ],
  usedWith: [
    { slug: 'json-escape', reason: 'Embed the quoted command inside a JSON payload for an API or CI config', strength: 0.7 },
    { slug: 'text-compare', reason: 'Compare the command that worked against the one that did not', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'url-encoder-decoder', reason: 'Escape for a URL rather than for a shell' },
    { slug: 'json-escape', reason: 'Escape for a JSON string literal rather than for a shell' },
  ],
  nextSteps: [
    { slug: 'json-escape', reason: 'Wrap the quoted command into a JSON field', priority: 1 },
    { slug: 'cron-expression-parser', reason: 'Schedule the command once it runs correctly', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'shell quoting',
    'escape quotes ssh',
    'nested quotes bash',
    'sudo sh -c quoting',
    'docker exec quoting',
    'quote command for remote shell',
  ],
  entityAliases: ['shell escaping', 'quote escalation', 'nested shell quoting', 'ssh command escaping'],
  inputs: ['a shell command', 'a chain of shells'],
  outputs: ['the quoted command', 'the string each layer receives'],
  difficulty: 'intermediate',
  audience: ['developers', 'system administrators'],
};
