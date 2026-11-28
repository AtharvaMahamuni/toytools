import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "マクロ栄養素（PFC）計算機",
  "seoTitle": "PFCバランス・マクロ栄養素計算機・グラム換算ツール",
  "description": "目標カロリーをバランス型・高タンパク・低糖質・ケトなどの食事スタイル別に、タンパク質・脂質・炭水化物のグラム数へ即座に配分します。",
  "tagline": "1日の目標カロリーをPFC（タンパク質・脂質・炭水化物）のg数に配分。",
  "lead": "目標カロリーを入力するだけで、タンパク質・炭水化物・脂質の1日あたり必要グラム数を食事スタイル別にブラウザ内で自動計算します。",
  "craft": {
    "solves": "自分で好きな割合を選ぶと合計100%にならず、目標カロリーと矛盾した増減が生じてしまうミスを防ぎます。"
  },
  "guide": {
    "title": "目標カロリーからPFC（マクロ栄養素）を計算する方法",
    "description": "三大栄養素の働き、1gあたりのエネルギー換算（4/4/9 kcal）、無理なく続けられるPFCバランスの選び方を解説します。"
  },
  "fields": {
    "calories": {
      "label": "1日の目標カロリー",
      "suffix": "kcal",
      "help": "1日の目標摂取エネルギー（未定の場合はTDEE計算機を参照）。"
    },
    "diet": {
      "label": "食事スタイル",
      "options": {
        "balanced": "バランス型（C 45% / P 25% / F 30%）",
        "high-protein": "高タンパク型（40 / 35 / 25）",
        "low-carb": "低糖質・ローカーボ（25 / 35 / 40）",
        "keto": "ケトジェニック（5 / 25 / 70）"
      }
    }
  },
  "ui": {
    "emptyText": "目標カロリーと食事スタイルを選択すると、P・F・Cそれぞれの推奨グラム数が表示されます。",
    "engine": {
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errMinTpl": "{label}は {min} 以上である必要があります。",
      "errMaxTpl": "{label}は {max} 以下である必要があります。",
      "fieldDiet": "食事スタイル",
      "fieldCalories": "1日のカロリー",
      "errCalZero": "計算するには0より大きいカロリー目標を入力してください。",
      "heroProtein": "タンパク質 (P)",
      "notePctKcalTpl": "{kcal} kcal の {pct}%",
      "notePctTpl": "総カロリーの {pct}%",
      "cardCarb": "炭水化物 (C)",
      "cardFat": "脂質 (F)",
      "cardSplit": "比率 (C/P/F)",
      "vizCarb": "炭水化物",
      "vizProtein": "タンパク質",
      "vizFat": "脂質",
      "vizTitle": "あなたのPFCバランス配分",
      "vizDescTpl": "{kcal} kcal に対して 炭水化物 {carb}%・タンパク質 {protein}%・脂質 {fat}%。",
      "diets": {
        "balanced": "バランス型",
        "high-protein": "高タンパク型",
        "low-carb": "ローカーボ",
        "keto": "ケトジェニック"
      },
      "insSplitTpl": "{diet}（{kcal} kcal）では、1日あたりタンパク質 {protein} g・炭水化物 {carb} g・脂質 {fat} g が目安になります。",
      "insEnergy": "タンパク質と炭水化物は1gあたり4 kcal、脂質は9 kcalです。無理なく継続できる比率を選びましょう。",
      "insTotal": "細かいパーセントの一致以上に、総摂取カロリーを安定させることが結果に直結します。",
      "asmDiet": "食事スタイル",
      "asmEnergy": "1gあたりの熱量",
      "asmEnergyVal": "タンパク質 4・炭水化物 4・脂質 9 kcal",
      "decTdee": "1日の総消費カロリー (TDEE) を調べる",
      "decBmi": "BMI値もあわせて確認する",
      "q1": "1日に何キロカロリー摂取すべきですか？",
      "q2": "タンパク質は1日何グラム必要ですか？",
      "q3": "減量に向いているPFCバランスは？",
      "explanation": "三大栄養素（マクロ栄養素）はタンパク質・炭水化物（各4 kcal/g）と脂質（9 kcal/g）で構成されます。合計100%になる比率から毎日の目安グラム数を正確に換算します。"
    }
  },
  "knowledge": {
    "summary": "バランス型・高タンパク・ローカーボ・ケトの各プリセットで目標カロリーをPFC（g）に換算します。",
    "useCases": [
      "TDEEで求めたカロリーを毎日の食材グラム数に落とし込む",
      "高タンパク食とケトジェニックの栄養配分を比較する",
      "減量期や増量期の食事管理を簡潔にする"
    ],
    "mistakes": [
      "合計100%にならない割合で計算してしまうこと",
      "比率だけ見て体重あたりの総タンパク量を無視すること",
      "1g単位の誤差に悩み総カロリー管理を疎かにすること"
    ]
  },
  "faqs": [
    {
      "id": "macro-calculator-faq-1",
      "question": "マクロ栄養素（PFC）はどう計算しますか？",
      "answer": "目標カロリーに各栄養素の割合を掛け、タンパク質と炭水化物は4、脂質は9で割ることで1日のグラム数を出します。"
    },
    {
      "id": "macro-calculator-faq-2",
      "question": "体脂肪を減らすのに良いPFC比率は？",
      "answer": "満腹感と筋肉維持のためタンパク質を多め（炭水化物40%・タンパク質35%・脂質25%など）にするのが一般的におすすめです。"
    },
    {
      "id": "macro-calculator-faq-3",
      "question": "タンパク質は1日どれくらい摂るべきですか？",
      "answer": "筋トレや運動習慣がある人では体重1kgあたり1.6〜2.2gがよく推奨されます。"
    },
    {
      "id": "macro-calculator-faq-4",
      "question": "食事スタイルのプリセットは何が違いますか？",
      "answer": "バランス型(45/25/30)、高タンパク型(40/35/25)、ローカーボ(25/35/40)、糖質を5%に抑えるケト(5/25/70)の4種類を用意しています。"
    },
    {
      "id": "macro-calculator-faq-5",
      "question": "グラム数は1g単位で完璧に合わせる必要がありますか？",
      "answer": "いいえ。総カロリーとタンパク質目標におおむね合っていれば、日々の細かいズレは気にしなくて大丈夫です。"
    },
    {
      "id": "macro-calculator-faq-6",
      "question": "基準となる目標カロリーはどうやって決めればいいですか？",
      "answer": "先にTDEE計算機でご自身の維持カロリーを調べ、目的に応じて増減させるのが標準的な手順です。"
    }
  ]
};
