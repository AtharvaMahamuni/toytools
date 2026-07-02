import type { TextProcessor } from '../types';

// Strip emoji while leaving words, numbers, punctuation, and spacing intact.
//
// Unicode property escapes do the heavy lifting. A pictograph counts as emoji when it renders
// as one: either it has default emoji presentation (\p{Emoji_Presentation}: faces, hearts,
// flags, most symbols typed from an emoji keyboard) or it is a text-default pictograph forced
// into emoji form by variation selector-16. Text symbols like ™ © ® or a bare ☺ stay, because
// they read as ordinary characters. The alternation also removes what travels WITH emoji so no
// invisible debris is left behind: ZWJ sequences (family/profession emoji), skin-tone
// modifiers, regional-indicator pairs (flags), keycap marks (the digit is kept), tag
// characters (subdivision flags), and stray joiners/selectors.
const PICT = '(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}\\uFE0F)(?:\\uFE0F)?(?:\\p{EMod})?';
const EMOJI_SEGMENT = new RegExp(
  [
    '\\p{RI}\\p{RI}',                 // flags: pairs of regional indicators
    `${PICT}(?:\\u200D${PICT})*`,     // single emoji and ZWJ sequences
    '[\\u{E0020}-\\u{E007F}]',        // tag characters (subdivision flags)
    '\\u20E3',                        // combining enclosing keycap (keeps its base)
    '\\uFE0F',                        // stray variation selector-16
    '\\p{EMod}',                      // stray skin-tone modifier
    '\\u200D',                        // stray zero-width joiner
  ].join('|'),
  'gu',
);

export const removeEmoji: TextProcessor = {
  id: 'removeEmoji',
  family: 'cleanup',
  process: (text) => text.replace(EMOJI_SEGMENT, ''),
};
