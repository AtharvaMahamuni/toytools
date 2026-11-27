import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'aspect-ratio-calculator',
  name: 'アスペクト比計算機',
  seoTitle: 'アスペクト比計算機 – 16:9・4:3リサイズ寸法を即計算',
  description:
    '16:9や4:3などの比率を固定して幅・高さのピクセル数を自動計算。プレビュー表示とH.264動画向けの偶数調整提案も備えています。',
  tagline: '16:9などのアスペクト比を固定し、片方の値からもう一方の寸法を算出します。',
  knowledge: {
    primaryConcepts: ['アスペクト比', '縦横比 16:9'],
    realWorldUseCases: [
      '動画やバナー画像の幅から正しい高さを即座に求める',
      '写真を引き伸ばしやトリミングなしで拡大・縮小する',
      '解像度（例: 1920x1080）から約分された比率を割り出す',
      'レスポンシブなWeb枠や埋め込みプレイヤーの縦横比を揃える',
    ],
    commonMistakes: [
      '幅と高さを別々に打ち替えて元の縦横比を崩してしまうこと',
      'ピクセル解像度そのものとアスペクト比（比率）を混同すること',
    ],
  },
  faqs: [
    {
      id: 'aspect-ratio-calculator-faq-1',
      question: '16:9のアスペクト比で高さを計算するには？',
      answer:
        '幅に 9 を掛けて 16 で割ります。たとえば幅 1600px の場合、1600 × 9 ÷ 16 = 900px です。プリセットから「16:9」を選び幅を入力すると、高さと比率プレビューが即座に表示されます。',
    },
    {
      id: 'aspect-ratio-calculator-faq-2',
      question: 'リサイズ時にアスペクト比を維持するコツは？',
      answer:
        'まず比率を固定し、幅か高さのどちらか一方だけを書き換えます。幅を変えれば高さが連動し、高さを変えれば幅が自動で再計算されるため画像や動画が歪みません。',
    },
    {
      id: 'aspect-ratio-calculator-faq-3',
      question: '1920x1080のアスペクト比は何ですか？',
      answer:
        '1920対1080を最大公約数120で割ると「16:9」（標準ワイド画面）になります。任意の幅と高さを入力すると、最も簡単な整数比が自動で計算・表示されます。',
    },
    {
      id: 'aspect-ratio-calculator-faq-4',
      question: 'よく使われる主なアスペクト比はどれですか？',
      answer:
        '動画やPCモニターは 16:9、クラシック画面は 4:3、一眼カメラ写真は 3:2、ウルトラワイドや映画は 21:9、正方形投稿は 1:1、縦長スマホ動画（ショート/リール）は 9:16 が定番です。カスタム値も自由に入力できます。',
    },
    {
      id: 'aspect-ratio-calculator-faq-5',
      question: '比率や寸法に小数も入力できますか？',
      answer:
        'はい。カスタム比率（例: 1.85:1 や 2.39:1）や寸法に小数を入力でき、計算結果は最大小数点以下4桁まで丸めて表示します。',
    },
  ],
  guide: {
    title: 'アスペクト比（16:9）の計算式とリサイズ手順',
    description:
      'アスペクト比の基本、幅・高さの計算公式、H.264動画で偶数pxが必要になる理由や解像度スケーリングまでわかりやすく解説します。',
    readMinutes: 5,
  },
  ui: {
    panelDims: '寸法・比率',
    lblRatio: 'アスペクト比',
    opt169: '16:9 (ワイド)',
    opt43: '4:3 (標準)',
    opt32: '3:2 (写真)',
    opt219: '21:9 (ウルトラワイド)',
    opt11: '1:1 (正方形)',
    opt916: '9:16 (縦長)',
    optCustom: 'カスタム',
    ariaRatioW: '比率の幅',
    ariaRatioH: '比率の高さ',
    lblWidth: '幅 (px)',
    lblHeight: '高さ (px)',
    btnCopyDims: '寸法をコピー',
    errInvalidRatio: '16:9 のような有効な比率を入力してください。',
    errNeedDim: '幅または高さを入力してください。',
    errInvalidVals: '有効な数値を入力してください。',
    evenHintText: 'H.264 / MP4 エンコーダはエンコードエラーを防ぐため幅・高さとも偶数の整数を必要とします。',
    btnUsePrefix: '採用: ',
    toastEmptyCopy: 'コピーする値がありません',
    btnCopied: '✓ コピー済み',
  },
};
