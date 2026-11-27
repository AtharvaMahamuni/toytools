import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'px-to-rem-converter',
  name: 'PX ⇄ REM 変換ツール',
  seoTitle: 'PXからREM・EM・PT単位変換ツール（CSS計算）',
  description:
    '指定したルートフォントサイズ（16pxや10pxなど）を基準にpxをrem・em・pt・%へ即変換。ワンタップコピー対応、すべてブラウザ内で完結します。',
  tagline: '任意のルートフォントサイズを基準にpx・rem・em・ptを相互変換。',
  craft: {
    solves:
      'ルート基準でemを計算しても正しいのは最上位要素のみであり、フォントサイズを指定した子要素内ではemが複利的に入れ子膨張する点に注意を促します。',
  },
  knowledge: {
    primaryConcepts: ['CSS単位変換'],
    realWorldUseCases: [
      'デザインカンプのpx指定をスケーラブルなCSSのremへ変換する',
      'DTPツールのポイント（pt）指定をWeb標準のpxへ換算する',
      'pxベースから一貫したrem余白スケールを作成する',
      '62.5%（10px基準）などカスタムルート時のrem値を確認する',
    ],
    commonMistakes: [
      'html { font-size } の指定を確認せず 1rem = 16px と決めつける',
      '全体余白にemを使って入れ子による意図しないサイズ倍増を起こす',
    ],
  },
  faqs: [
    {
      id: 'px-to-rem-converter-faq-1',
      question: 'pxからremへの変換計算式は？',
      answer:
        'px値をルートフォントサイズで割ります。標準の16px基準なら 24px ÷ 16 = 1.5rem です。CSS側で別の基準サイズを指定している場合は上の基準値欄を変更してください。',
    },
    {
      id: 'px-to-rem-converter-faq-2',
      question: 'remとemの違いは何ですか？',
      answer:
        '`rem` は常にルート要素（`html`）基準なのでページ全体で一定ですが、`em` はその要素（または親要素）のフォントサイズ基準のため入れ子で倍率が掛け合わされます。',
    },
    {
      id: 'px-to-rem-converter-faq-3',
      question: 'なぜpxではなくremを使うべきなのですか？',
      answer:
        '`rem` を使うと、ユーザーがブラウザの文字サイズ設定を大きくした際にレイアウトや文字が比例して拡大されるため、アクセシビリティが大幅に向上します。',
    },
    {
      id: 'px-to-rem-converter-faq-4',
      question: 'ルートフォントサイズは何pxにすべきですか？',
      answer:
        '特別な理由がなければブラウザ初期値の `16`（16px）のままにします。`62.5%`（10px基準）を採用している場合は基準欄に `10` を入力して換算してください。',
    },
    {
      id: 'px-to-rem-converter-faq-5',
      question: 'pt（ポイント）とpxの関係は？',
      answer:
        'Web仕様では 1インチ = 96px = 72pt と定義されているため、`1px = 0.75pt`、`16px = 12pt` になります。',
    },
  ],
  guide: {
    title: 'CSS単位の変換ガイド：PX・REM・EM・PTの違い',
    description:
      '基準フォントサイズによるrem換算式、アクセシビリティ上のメリット、emの入れ子注意点を解説します。',
    readMinutes: 5,
  },
  ui: {
    panelValue: '変換する値',
    lblValue: '数値',
    ariaUnit: '入力単位',
    lblBase: 'ルート基準サイズ (px)',
    rootNote: 'ブラウザ初期値は 16px（62.5% 指定時は 10px）です。',
    panelConverted: '変換結果',
    copyLabel: 'コピー',
    errInvalid: '有効な正の数値を入力してください。',
    engine: {
      emHintTpl: 'ルート基準 {base}px での相当値（子要素内では親サイズの影響を受けます）。',
    },
  },
};
