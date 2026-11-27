import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'bmr-calculator',
  name: '基礎代謝量 (BMR) 計算ツール',
  seoTitle: '基礎代謝 (BMR) 計算・Mifflin-St Jeor式',
  description:
    'ミフリン・セントジョール式で基礎代謝量（BMR）をブラウザ上で計算し、各身体活動レベルを加えた1日消費カロリーを一覧表示します。',
  tagline: '基礎代謝量（BMR）と活動レベル別の消費カロリーを算出。',
  craft: {
    solves:
      '基礎代謝が1,400kcal未満だと代謝が悪いと誤解されがちですが、体重1kgあたりで見ると小柄な体格ではまったく標準的な数値です。',
  },
  knowledge: {
    primaryConcepts: ['基礎代謝量 (BMR)', '安静時代謝量 (RMR)'],
    realWorldUseCases: [
      '活動係数を掛ける前の純粋な安静時消費量を把握する',
      '減量時に下回ってはならない最低摂取カロリーラインを知る',
      '1日の消費のうち安静時と活動時が占める割合を比較する',
    ],
    commonMistakes: [
      '総消費（TDEE）ではなくBMRと同じ量だけ食べて過度な赤字にする',
      '身長と体重だけの計算式に筋肉量の反映を期待してしまう',
      '体格差による低いBMRを「太りやすい体質」と誤認する',
    ],
  },
  fields: {
    unit: { label: '単位系', options: { metric: 'メートル法 (kg, cm)', imperial: 'ヤード・ポンド法 (lb, ft/in)' } },
    sex: { label: '性別', options: { male: '男性', female: '女性' } },
    age: { label: '年齢', suffix: '歳' },
    weight: { label: '体重', help: 'キログラム（またはポンド）で入力。' },
    height: { label: '身長', help: 'センチメートル（またはインチ）で入力。' },
  },
  faqs: [
    {
      id: 'bmr-calculator-faq-1',
      question: '正常な基礎代謝量（BMR）の目安は？',
      answer:
        '体格によって大きく異なります。30歳・175cm・70kgの男性で約1,650kcal/日、同じ年齢で165cm・60kgの女性で約1,320kcal/日が目安です。小柄な人ほど低く出ますが異常ではありません。',
    },
    {
      id: 'bmr-calculator-faq-2',
      question: 'BMRとTDEEは何が違いますか？',
      answer:
        'BMRは完全安静時に生命維持だけで消費するエネルギーです。TDEEはそこに歩行・食事誘発性熱産生・運動を加えた合計（通常BMRの1.2〜1.9倍）で、食事量の基準はこちらを使います。',
    },
    {
      id: 'bmr-calculator-faq-3',
      question: '痩せるためにBMRと同じカロリーだけ食べてもよいですか？',
      answer:
        'おすすめしません。活動分のエネルギーがすべて削られ、筋量低下や体調不良を招く過度な制限になります。必ずTDEEから300〜500kcal引く形で設計し、BMRを下回らないようにしてください。',
    },
    {
      id: 'bmr-calculator-faq-4',
      question: 'ハリス・ベネディクト式ではなくMifflin-St Jeor式を使う理由は？',
      answer:
        '1919年発表のハリス・ベネディクト式は現代人に対して約5%高めに算出される傾向があるため、1990年のより実測値に近いMifflin-St Jeor式が標準的に採用されています。',
    },
    {
      id: 'bmr-calculator-faq-5',
      question: '筋肉が増えるとBMRは大きく上がりますか？',
      answer:
        '上がりますが俗説ほど劇的ではありません。筋肉1kgあたりの安静時消費は約13kcal/日（脂肪は約4.5kcal/日）です。なお本式は身長・体重・年齢・性別のみを用いるため体組成は直接反映されません。',
    },
    {
      id: 'bmr-calculator-faq-6',
      question: 'BMRとRMR（安静時代謝量）は同じものですか？',
      answer:
        'ほぼ近い値ですが測定条件が異なります。BMRは厳密な空腹・覚醒安静状態で測定され、RMRはやや緩やかな条件のため10%ほど高めになります。',
    },
  ],
  guide: {
    title: '基礎代謝量（BMR）が示す本当の意味と活用法',
    description:
      'Mifflin-St Jeor式の仕組み、BMR未満のダイエットが危険な理由、TDEEへの換算方法を分かりやすく解説します。',
    readMinutes: 5,
  },
  ui: {
    emptyText: '性別・年齢・体重・身長を入力するとBMRを算出します。',
    engine: {
      fieldUnit: '単位系',
      fieldSex: '性別',
      fieldAge: '年齢',
      fieldWeight: '体重',
      fieldHeight: '身長',
      errWeightZero: '体重は0より大きい値を入力してください。',
      errHeightZero: '身長は0より大きい値を入力してください。',
      errBmrNonPos: '数値を見直してください（正の値になりません）。',
      heroLabel: '基礎代謝量 (BMR)',
      heroNote: '完全安静時の消費量（1日の食事目標ではありません）',
      cardPerHour: '安静時1時間あたり',
      levels: {
        sedentary: '低い (×1.2)',
        light: 'やや低い (×1.375)',
        moderate: '適度 (×1.55)',
        active: '高い (×1.725)',
        'very-active': '非常に高い (×1.9)',
      },
      insightRestingTpl: '何もせず完全に安静にしていても、1日に {bmr}（1時間あたり約 {perHour} kcal）を消費します。',
      insightNotEatTpl: 'BMRは食べるべき目標ではありません。座り中心の日でも {sedentary} ほど消費するため、BMR水準の食事は過度な制限になります。',
      insightDrivers: '主に体格（体重・身長）と年齢・性別によって決まります。',
      vizRest: '基礎代謝 (BMR)',
      vizModerate: '適度な活動日',
      vizTitle: '完全安静時と適度な活動日の比較',
      vizDescTpl: '基礎代謝は適度な活動日の合計消費（{moderate}）の {pct}% を占めます。',
      assumpUnitsTerm: '単位系',
      assumpMetric: 'メートル法 (kg / cm)',
      assumpImperial: 'ヤード・ポンド法 (lb / in)',
      assumpFormulaTerm: '計算式',
      assumpFormulaVal: 'Mifflin-St Jeor 式 (1990)',
      assumpBodyTerm: '体組成',
      assumpBodyVal: '筋肉量と体脂肪量の内訳は考慮しません',
      decTdee: 'TDEE計算ツールで活動レベル別カロリーを求める',
      decMacro: 'PFCバランス（三大栄養素）を配分する',
      decBodyFat: '体脂肪率の目安を計算する',
      nextQuestions: [
        '現在の運動習慣を合わせた1日の維持カロリー（TDEE）はいくら？',
        '基礎代謝を割らずに安全に減らせるカロリー赤字の幅は？',
        '年齢が5歳上がるとBMRはどのくらい変化する？',
      ],
      explanation:
        '性別・年齢・体重・身長からMifflin-St Jeor式を用いて、生命維持のみに使われる完全安静時の基礎代謝量（BMR）を算出します。',
    },
  },
};
