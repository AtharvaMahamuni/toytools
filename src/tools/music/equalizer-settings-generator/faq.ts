import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'equalizer-settings-generator-faq-1',
    question: 'Can this change my Spotify or headphone equalizer?',
    answer: 'No, and no web page can. A browser tab has no access to the audio another app is playing, to your phone\'s system equalizer, or to the settings inside a pair of headphones. What this tool does is work out the settings and hand them to you. You then open the equalizer in your own player or device, choose its custom preset, and enter the values yourself. That is a deliberate limit rather than a missing feature: the alternative would be an app that wants control of your audio.',
  },
  {
    id: 'equalizer-settings-generator-faq-2',
    question: 'What are the best EQ settings for bass?',
    answer: 'There is no single answer, because the result depends on the recording, your headphones and how loud you listen. A reasonable starting point is a firm lift around 60 Hz, a smaller one at 150 Hz so the low end does not sound hollow, and a slight cut near 400 Hz so the extra weight reads as depth instead of mud. For example: 60 Hz +6 dB, 150 Hz +3 dB, 400 Hz -1 dB, and everything else flat. That is what the More Bass preset here loads. Take it as a starting shape and move the bands until it sounds right on your own gear.',
  },
  {
    id: 'equalizer-settings-generator-faq-3',
    question: 'What frequency makes vocals clearer?',
    answer: 'Most of the forwardness of a voice sits between about 2 kHz and 4 kHz, which is why the Clear Vocals preset lifts the 2.4 kHz band. Raising that area tends to bring a singer or a speaker closer. The other half of the job is cutting rather than boosting: pulling back 150 Hz and 400 Hz moves the instruments out of the way, so the voice comes forward without the whole track getting louder. EQ settings for vocals are therefore a lift and two cuts, not one slider.',
  },
  {
    id: 'equalizer-settings-generator-faq-4',
    question: 'What does 60 Hz do on an equalizer?',
    answer: 'It controls the bottom of the bass, the part of a kick drum or a bass line you feel as much as hear. Boosting it adds weight and can add a sense of size. Two things limit it: small speakers and cheap earbuds cannot reproduce much down there, so a boost does nothing audible on them, and it is the band that costs the most headroom, so a large lift is the fastest way to make music distort.',
  },
  {
    id: 'equalizer-settings-generator-faq-5',
    question: 'Can EQ cause distortion?',
    answer: 'Boosting can. A boost raises the level of everything in that band, and if the track was already close to full scale the result clips, which is heard as crackle or a hard edge on the loudest parts. The fix is the preamp control, which most players put on the same screen as the equalizer: lower it by roughly the size of your biggest boost. This tool shows that number with your settings and warns you when the curve is boosted far enough to be worth acting on. Cuts never cause this, which is why cutting is often the safer way to change a balance.',
  },
  {
    id: 'equalizer-settings-generator-faq-6',
    question: 'Why do the same EQ settings sound different on different headphones?',
    answer: 'Because an equalizer changes the signal, not the thing playing it. Every pair of headphones and every speaker already has a response of its own, with peaks and dips built in, and your settings are added on top of that. A pair that is already bright will sound harsh with a treble boost that suited a darker pair. Room acoustics and your own hearing add more variation. This is why every explanation on this page is written as a tendency rather than a promise.',
  },
  {
    id: 'equalizer-settings-generator-faq-7',
    question: 'My player has different bands from these seven. What do I do?',
    answer: 'Match the nearest frequency you have and treat anything in between as a halfway point. For example, a five band equalizer offers 60 Hz, 230 Hz, 910 Hz, 4 kHz and 14 kHz, so the 150 Hz and 400 Hz values here both inform its 230 Hz slider, and 2.4 kHz and 6 kHz both inform its 4 kHz. A ten band equalizer has room for all seven values with gaps to fill by interpolating between neighbours. The shape of the curve matters more than hitting exact numbers.',
  },
  {
    id: 'equalizer-settings-generator-faq-8',
    question: 'Should I boost bass or cut everything else?',
    answer: 'Cutting is the more conservative move and costs no headroom, so if the goal is relative balance, pulling other bands down gets you there without any risk of clipping. You then raise the volume to compensate. Boosting is quicker and is fine in moderation, which for most players means keeping the largest boost under about 6 dB. If a preset here needs more than that, the tool offers to scale the boosts down while keeping the same balance between bands.',
  },
  {
    id: 'equalizer-settings-generator-faq-9',
    question: 'Do my settings get uploaded anywhere?',
    answer: 'No. Everything runs in your browser, and the settings are kept in your browser\'s own storage so the page remembers them next time. When you copy a link, the seven values travel inside the link itself, which is why the numbers are readable in the address bar. Nothing is stored on a server, and there is no account to make.',
  },
];
