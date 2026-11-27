import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'bmi-calculator',
  name: 'BMI計算ツール（体格指数）',
  seoTitle: 'BMI計算機 – 適正体重・肥満度を瞬時にチェック',
  description:
    '身長と体重からBMI（ボディマス指数）を計算し、WHO基準の判定区分と適正体重の範囲を算出。メートル法・ヤードポンド法に両対応しています。',
  tagline: '身長と体重からBMIと適正体重の範囲をブラウザ内で算出します。',
  methodology: {
    name: 'WHO成人BMI分類基準',
    detail:
      '体重(kg)を身長(m)の2乗で割り、世界保健機関（WHO）の成人基準値（18.5・25・30）で分類します。',
  },
  knowledge: {
    primaryConcepts: ['BMI計算', 'ボディマス指数', '標準体重範囲'],
    realWorldUseCases: [
      '減量や増量の目標を立てる前に、身長に対する標準体重の帯域を確認する',
      '健康診断や問診票に記されたBMI値の区分を正しく理解する',
      '標準範囲（BMI 18.5〜24.9）まであと何kgかを把握する',
    ],
    commonMistakes: [
      'BMIを医学的な確定診断と誤解すること（あくまで集団統計ベースのスクリーニング指標です）',
      '体重をポンドのまま身長だけセンチで入力するなど単位を混在させること',
      '成人基準を18歳未満や筋肉量の非常に多いアスリートにそのまま当てはめること',
    ],
  },
  faqs: [
    {
      id: 'bmi-calculator-faq-1',
      question: '健康的な標準BMIの範囲はいくつですか？',
      answer:
        'WHOの成人基準では 18.5〜24.9 が標準（健康体重）とされています。18.5未満は低体重、25.0〜29.9は過体重、30.0以上は肥満に分類されます。本ツールはあなたの数値・区分と身長ごとの適正体重範囲を同時に表示します。',
    },
    {
      id: 'bmi-calculator-faq-2',
      question: 'BMIの計算式はどうなっていますか？',
      answer:
        '体重(kg) ÷ 身長(m)² で求めます。たとえば体重70kg・身長175cm(1.75m)なら 70 ÷ (1.75 × 1.75) = 約22.9 です。ヤードポンド法を選んだ場合は内部でkg・mへ自動換算して同じ式で算出します。',
    },
    {
      id: 'bmi-calculator-faq-3',
      question: '筋肉質な人やスポーツ選手でもBMIは正確ですか？',
      answer:
        '必ずしも正確ではありません。BMIは身長と体重だけで計算するため筋肉と体脂肪を区別できません。筋肉量が非常に多いアスリートは体脂肪率が低くても過体重と判定されることがあります。基礎代謝やTDEEなど他の指標も参考にしてください。',
    },
    {
      id: 'bmi-calculator-faq-4',
      question: 'ポンド（lb）やインチ（in）でBMIを計算するには？',
      answer:
        '上の単位切替で「ヤード・ポンド法 (lb, in)」を選び、体重をポンド、身長を総インチで入力してください。入力済みの値も自動で単位変換されます。',
    },
    {
      id: 'bmi-calculator-faq-5',
      question: 'このBMI計算機は子どもや10代にも使えますか？',
      answer:
        'いいえ。成人の固定基準（18.5 / 25 / 30）は18歳未満の成長期には適用できません。小児・思春期では年齢別・性別ごとのBMIパーセンタイル曲線（成長曲線）を使用するため、小児科や学校保健の基準をご確認ください。',
    },
    {
      id: 'bmi-calculator-faq-6',
      question: '入力した体重や身長のデータは保存・送信されますか？',
      answer:
        'いいえ。計算はすべてお使いのブラウザ上で完結します。体重・身長の数値が外部サーバーに送信・記録されることはありません（選択した単位設定のみブラウザに保持されます）。',
    },
  ],
  guide: {
    title: 'BMIの計算方法と結果の正しい見方',
    description: 'BMIの計算式、WHO成人区分、標準体重の算出法とスクリーニング指標としての限界をわかりやすく解説。',
    readMinutes: 5,
  },
  fields: {
    unit: {
      label: '単位',
      options: { metric: 'メートル法 (kg, cm)', imperial: 'ヤード・ポンド法 (lb, in)' },
    },
    weight: {
      label: '体重',
      help: '現在の体重を入力してください。',
    },
    height: {
      label: '身長',
      help: 'cm単位または総インチ数で身長を入力してください。',
    },
  },
  ui: {
    emptyText: '身長と体重を入力するとBMIと標準体重範囲を計算します。',
    engine: {
      fieldUnit: '単位設定',
      fieldWeight: '体重',
      fieldHeight: '身長',
      errWeightZero: 'BMIを計算するには0より大きい体重を入力してください。',
      errHeightZero: 'BMIを計算するには0より大きい身長を入力してください。',
      heroLabel: 'BMI（ボディマス指数）',
      categoryLabel: '判定区分（WHO）',
      healthyRangeLabel: 'この身長での標準体重範囲',
      weightToLoseLabel: '標準範囲上限までの目安減量幅',
      weightToGainLabel: '標準範囲下限までの目安増量幅',
      insightNormal: 'BMI {bmi} は成人の健康基準範囲（18.5〜24.9）に収まっています。',
      insightOther: 'BMI {bmi} は「{label}」区分です。あなたの身長の標準体重範囲は {range} です。',
      insightCaveat:
        'BMIは簡易的なスクリーニング指標であり医学的診断ではありません。筋肉量や脂肪分布は反映されないため、目安の1つとしてご活用ください。',
      cats: {
        underweight: '低体重',
        normal: '標準体重',
        overweight: '過体重',
        obese: '肥満',
      },
      bands: {
        underweight: '低体重',
        normal: '標準',
        overweight: '過体重',
        obese: '肥満',
      },
      vizTitle: 'WHO成人スケール上のあなたのBMI ({bmi})',
      vizDesc: 'この身長における標準体重範囲: {range}',
      milestoneHealthy: '体重が健康的なBMI範囲内に収まっています',
      assumpUnitsTerm: '単位',
      assumpMetric: 'メートル法 (kg, cm)',
      assumpImperial: 'ヤード・ポンド法 (lb, in)',
      assumpFormulaTerm: '計算式',
      assumpFormulaVal: '体重 (kg) / 身長 (m)²',
      assumpCatsTerm: '分類基準',
      assumpCatsVal: 'WHO成人区分 (18.5 / 25 / 30)',
      decTdee: '1日の消費カロリー（TDEE）を調べる',
      decBodyFat: 'BMIで分からない体脂肪率の目安を計算する',
      decWeight: '体重の推移を記録する',
      nextQuestions: [
        '1日にどれくらいカロリーを消費していますか？',
        '自分の体脂肪率の目安はどのくらいですか？',
        'スポーツ選手でもBMIは当てはまりますか？',
      ],
      explanation:
        'BMIは体重(kg)を身長(m)の2乗で割り、世界保健機関（WHO）が定めた成人の国際区分（18.5 / 25 / 30）と比較します。身長と体重のみを用いるため筋肉と体脂肪を区別できず、個人の診断ではなく集団統計に基づく最初の目安として利用されます。',
    },
  },
};
