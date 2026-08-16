import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'shell-quote-escalator-faq-layers',
    question: 'How many levels of quoting does my command need?',
    answer:
      'One level for every shell that parses the command before the last one runs it. Sending a command over ssh means the local shell reads the line and the remote shell reads what arrives, so the command needs one level. Adding sudo sh -c on the far side makes three shells and two levels. Counting the shells is the part people get wrong, which is why this tool asks where the command travels rather than asking for a number.',
  },
  {
    id: 'shell-quote-escalator-faq-single-quotes',
    question: 'Why single quotes rather than backslashes or double quotes?',
    answer:
      'Inside single quotes a POSIX shell expands nothing at all: no variables, no backticks, no globs, no tilde. That makes the transformation identical at every layer, so it can simply be applied again for each shell in the path. Double-quote or backslash escaping needs a different rule at each layer depending on what survived the previous one, which is why hand-written attempts drift after the second hop.',
  },
  {
    id: 'shell-quote-escalator-faq-expansion',
    question: 'Will $HOME use my machine or the remote one?',
    answer:
      'The remote one. The quoting protects the dollar sign from every shell along the way, so the variable survives intact and is expanded by the last shell, against the far end environment. The same is true of globs, backticks and a leading tilde. If you meant the local value, substitute it into the command before quoting. The tool prints a line naming the tokens it found so this is visible rather than assumed.',
  },
  {
    id: 'shell-quote-escalator-faq-spaces',
    question: 'Why does a path with spaces split into two arguments on the server?',
    answer:
      'Because the quoting ran out one layer early. Each shell removes one level of quoting and then splits what remains on whitespace, so a path that was protected for the local shell arrives at the remote shell as bare text and is split there. The ladder in this tool shows the string at each stage, which is where a missing level becomes visible.',
  },
  {
    id: 'shell-quote-escalator-faq-safe',
    question: 'Is it safe to paste a command here?',
    answer:
      'Everything runs in your browser. The command is quoted by JavaScript on the page, nothing is uploaded, and the page works with no network once it has loaded. The command is saved in your browser local storage so it survives a reload, and the Clear button removes it.',
  },
  {
    id: 'shell-quote-escalator-faq-unbalanced',
    question: 'What happens if my command already has a quoting mistake?',
    answer:
      'The tool reports it instead of quoting it. An unbalanced quote in the original command would still produce a valid-looking quoted string, which then fails at the far end with an error that points at the wrong place. Catching it before quoting is the only moment the mistake is still easy to read.',
  },
];
