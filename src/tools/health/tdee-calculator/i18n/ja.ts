import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'tdee-calculator',
  name: 'TDEE計算ツール（1日消費カロリー）',
  seoTitle: 'TDEE計算・1日の総消費カロリー測定（Mifflin-St Jeor式）',
  description:
    'ミフリン・セントジョール式を用いて総消費カロリー（TDEE）と減量・維持・増量別の目標摂取カロリーをブラウザ上で自動計算します。データ送信なし。',
  tagline: '1日の総消費カロリーと減量・増量目標を算出。',
  craft: {
    solves:
      '身体活動レベルは過大評価しがちで、1段階高く選ぶだけで1日の目標カロリーが数百kcalも跳ね上がってしまいます。',
  },
  knowledge: {
    primaryConcepts: ['1日の総消費エネルギー (TDEE)', '基礎代謝量 (BMR)'],
    realWorldUseCases: [
      '減量（ダイエット）や増量前の1日カロリー基準を決める',
      '基礎代謝に対して日常活動がどれだけ消費を増やすか把握する',
      'フィットネスアプリが提示する目標カロリーの妥当性を確認する',
    ],
    commonMistakes: [
      '週の運動頻度を高めに見積もって過大な目標を設定する',
      '推定値を絶対値と思い込み体重推移に合わせた微調整をしない',
      '早く痩せようとして基礎代謝（BMR）未満まで極端に食事を削る',
    ],
  },
  fields: {
    unit: { label: '単位系', options: { metric: 'メートル法 (kg, cm)', imperial: 'ヤード・ポンド法 (lb, ft/in)' } },
    sex: { label: '性別', options: { male: '男性', female: '女性' } },
    age: { label: '年齢', suffix: '歳' },
    weight: { label: '体重', help: 'キログラム（またはポンド）で入力。' },
    height: { label: '身長', help: 'センチメートル（またはインチ）で入力。' },
    activity: {
      label: '身体活動レベル',
      options: {
        sedentary: '低い（デスクワーク中心・運動ほぼなし）',
        light: 'やや低い（週1〜3回の軽い運動）',
        moderate: '適度（週3〜5回の中程度運動）',
        active: '高い（週6〜7回のハードな運動）',
        'very-active': '非常に高い（毎日激しいトレーニングや肉体労働）',
      },
    },
  },
  faqs: [
    {
      id: 'tdee-calculator-faq-1',
      question: 'BMR（基礎代謝）とTDEEの違いは何ですか？',
      answer:
        'BMRは呼吸や臓器維持など完全安静時に消費する最低限のエネルギーです。TDEEはBMRに日常歩行・消化・運動などをすべて足した1日の総消費カロリーで、食事計画の基準になります。',
    },
    {
      id: 'tdee-calculator-faq-2',
      question: 'ダイエットには何キロカロリー摂ればよいですか？',
      answer:
        '維持カロリー（TDEE）より少なく食べます。体脂肪1kgは約7,200〜7,700kcalのため、1日500kcalの赤字で週約0.45〜0.5kg減が目安です。医師の指導なしにBMRを下回る設定は避けてください。',
    },
    {
      id: 'tdee-calculator-faq-3',
      question: '活動レベルはどれを選ぶべきですか？',
      answer:
        '迷ったら1つ下の段階を選ぶのが安全です。デスクワーク中心なら「低い」、週1〜3回運動するなら「やや低い」、週3〜5回なら「適度」が妥当です。',
    },
    {
      id: 'tdee-calculator-faq-4',
      question: 'TDEE計算の精度はどのくらいですか？',
      answer:
        '臨床的に精度の高いMifflin-St Jeor式を採用していますが、筋肉量や体質により個人差が出ます。2〜3週間ほど体重の週平均を見ながら100〜200kcal単位で微調整してください。',
    },
    {
      id: 'tdee-calculator-faq-5',
      question: '計算通りのカロリーなのに体重が変わらないのはなぜですか？',
      answer:
        '活動レベルを高く見積もりすぎているか、摂取量の記録漏れが多いケースが大半です。水分変動を挟むため2〜3週間様子を見た上で目標を150〜200kcal調整してください。',
    },
    {
      id: 'tdee-calculator-faq-6',
      question: '入力した個人データは安全ですか？',
      answer:
        'はい。計算はブラウザ内のみで実行され、年齢・体重・身長がサーバーへ送信されたり保存されたりすることはありません。',
    },
  ],
  guide: {
    title: 'TDEE（総消費カロリー）の計算方法と目標カロリー設定',
    description:
      'BMRとの違い、Mifflin-St Jeor式の仕組み、減量・維持・増量それぞれの安全なカロリー目安を解説します。',
    readMinutes: 6,
  },
  ui: {
    emptyText: '年齢・体重・身長・活動レベルを入力するとTDEEを算出します。',
    engine: {
      fieldUnit: '単位系',
      fieldSex: '性別',
      fieldActivity: '活動レベル',
      fieldAge: '年齢',
      fieldWeight: '体重',
      fieldHeight: '身長',
      errWeightZero: '体重は0より大きい値を入力してください。',
      errHeightZero: '身長は0より大きい値を入力してください。',
      heroLabel: '1日の総消費カロリー (TDEE)',
      heroNote: '体重維持の目安となる1日消費エネルギー',
      cardBmr: '基礎代謝 (BMR)',
      cardMildLoss: '緩やか減量 (-250 kcal)',
      cardLoss: '標準減量 (-500 kcal)',
      cardGain: '増量目安 (+300 kcal)',
      insightRestingTpl: '完全安静時は {bmr} で、日常活動や運動を加えると1日 {maintain} になります。',
      insightGoal: '1日500kcalの赤字はBMRを下回らず週あたり約0.45kg減を狙う目安です。',
      insightCaveat: 'Mifflin-St Jeor式による推定値です。2〜3週間の体重推移に合わせて調整してください。',
      actShort: {
        sedentary: '低い',
        light: 'やや低い',
        moderate: '適度',
        active: '高い',
        'very-active': '非常に高い',
      },
      vizRest: '安静時 (BMR)',
      vizActivity: '活動消費',
      vizTitle: '1日消費エネルギーの内訳',
      vizDescTpl: '安静時の基礎代謝が維持消費量 {maintain} の {pct}% を占めています。',
      assumpUnitsTerm: '単位系',
      assumpMetric: 'メートル法 (kg / cm)',
      assumpImperial: 'ヤード・ポンド法 (lb / in)',
      assumpFormulaTerm: '計算式',
      assumpFormulaVal: 'Mifflin-St Jeor 式 (1990)',
      assumpActivityTerm: '活動係数',
      decBmi: '身長に対するBMI範囲を確認する',
      decBodyFat: '体脂肪率の目安を計算する',
      decWeight: '週ごとの体重トレンドを記録する',
      nextQuestions: [
        'この目標カロリーをタンパク質・脂質・炭水化物にどう配分する？',
        'このカロリー設定で14日続けた場合の体重推移は？',
        '活動レベルを1段階下げると目標はどう変わる？',
      ],
      explanation:
        'まず性別・年齢・体重・身長からMifflin-St Jeor式で基礎代謝量（BMR）を求め、それに活動係数（1.2〜1.9）を掛けて総消費カロリーを算出します。',
    },
  },
};
