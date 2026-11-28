import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "タンパク質摂取量計算機",
  "seoTitle": "タンパク質必要量計算機・体重別1日摂取量と1食目安",
  "description": "体重とトレーニング目的に基づき1日の推奨タンパク質範囲（g・g/kg）と1食あたりの配分目安を算出する無料ツール。筋トレや減量対応。",
  "tagline": "体重と目標に合った1日のタンパク質範囲と1食あたり目安。",
  "lead": "国際スポーツ栄養学会（ISSN/ACSM）の見解に基づき、体重と目的に応じた1日のタンパク質必要範囲と1食あたりの摂取目安を算出します。",
  "craft": {
    "solves": "筋肉合成は1食ごとの刺激に応答するため、夜1回に偏らず各食事へ均等に配分する方が1日の総量以上に効果的です。"
  },
  "guide": {
    "title": "1日に本当に必要なタンパク質量と配分の考え方",
    "description": "なぜ推奨量が幅（レンジ）で示されるのか、0.8 g/kgが最低基準である理由、1日の食事への上手な分割方法をわかりやすく解説します。"
  },
  "fields": {
    "unit": {
      "label": "単位系",
      "options": {
        "metric": "メートル法 (kg)",
        "imperial": "ヤード・ポンド法 (lb)"
      }
    },
    "weight": {
      "label": "体重",
      "help": "メートル法は kg、インペリアルは lb で入力。"
    },
    "goal": {
      "label": "運動・トレーニング目的",
      "options": {
        "sedentary": "ほぼ運動しない（一般健康維持）",
        "active": "適度に活動的（特別メニューなし）",
        "endurance": "持久系トレーニング（ランニング・自転車など）",
        "strength": "筋トレ・筋肥大・筋力向上",
        "fat-loss": "筋肉を落とさず体脂肪を減らす（減量）"
      }
    },
    "meals": {
      "label": "1日の食事回数",
      "suffix": "食"
    }
  },
  "ui": {
    "emptyText": "体重とトレーニング目的を入力すると推奨されるタンパク質量が表示されます。",
    "engine": {
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errMinTpl": "{label}は {min} 以上である必要があります。",
      "errMaxTpl": "{label}は {max} 以下である必要があります。",
      "fieldUnit": "単位系",
      "fieldGoal": "トレーニング目的",
      "fieldWeight": "体重",
      "fieldMeals": "食事回数",
      "errWeightZero": "計算するには0より大きい体重を入力してください。",
      "goals": {
        "sedentary": "一般的な健康維持",
        "active": "日常的な運動習慣",
        "endurance": "持久系トレーニング",
        "strength": "筋力トレーニング・筋肥大",
        "fat-loss": "筋維持を意識した減量"
      },
      "heroLabel": "1日のタンパク質目標",
      "rangeTpl": "{lo}〜{hi}",
      "cardMid": "中心目標値",
      "cardMealTpl": "{n}食あたり1食の目安",
      "cardPerKg": "体重1kgあたり",
      "perKgTpl": "{lo}〜{hi} g/kg",
      "cardKcal": "タンパク質の熱量",
      "bandGen": "一般健康",
      "bandActive": "活動的",
      "bandTrain": "本格トレ",
      "bandCut": "減量期",
      "insRangeTpl": "体重 {kg} kg・{goal} の場合、目安は {loKg}〜{hiKg} g/kg（1日 {lo}〜{hi}）です。",
      "insMealTpl": "{n}回に分けると1食あたり約 {meal} が目安になります。",
      "insBand": "研究では個人差を踏まえ「範囲」で示されています。枠内のどこかに収まっていれば十分で、上限を大きく超えるメリットは乏しいとされます。",
      "vizTitle": "ガイドライン範囲における目標位置 (g/kg)",
      "vizDescTpl": "体重1kgあたり {lo}〜{hi} g が今回の適正範囲です。",
      "vizHighlight": "あなたの目標範囲",
      "asmUnits": "単位",
      "asmMetric": "メートル法 (kg)",
      "asmImp": "インペリアル (lb)",
      "asmSource": "根拠基準",
      "asmSourceVal": "ISSNおよびACSMポジションスタンド",
      "asmBasis": "計算基準",
      "asmBasisVal": "総体重ベース（除脂肪体重ではなく全体重）",
      "decMacro": "PFC全体のマクロバランスを見る",
      "decTdee": "1日の消費カロリー (TDEE) を計算",
      "decBf": "体脂肪率を測って除脂肪量で精密化する",
      "q1": "1日にタンパク質はどれくらい必要ですか？",
      "q2": "タンパク質の摂りすぎは体に悪いですか？",
      "q3": "体重ベースと除脂肪体重ベースどちらが良いですか？",
      "explanation": "タンパク質必要量は体重と筋肉への負荷で決まります。0.8 g/kgは欠乏を防ぐ最低ラインであり、ISSNやACSMは一般活動層に1.2〜1.6 g/kg、筋トレ層に1.6〜2.2 g/kg、減量時に最大2.4 g/kg程度を推奨しています。"
    }
  },
  "knowledge": {
    "summary": "体重と運動目的から1日の推奨タンパク質範囲（g・g/kg）と1食あたりの配分目安を算出します。",
    "useCases": [
      "筋トレ・減量目的に合わせた1日のタンパク質量を設定する",
      "合計量を朝昼晩や間食へバランスよく割り振る",
      "g/kg基準と総カロリーへの影響を確認する"
    ],
    "mistakes": [
      "最低基準の 0.8 g/kg をトレーニング時の最適目標と勘違いすること",
      "夕食1回だけにタンパク質を偏らせてしまうこと"
    ]
  },
  "faqs": [
    {
      "id": "protein-intake-calculator-faq-1",
      "question": "1日にどれくらいのタンパク質が必要ですか？",
      "answer": "体重70kgの例では一般健康維持で56〜70g、適度な運動で84〜112g、筋トレで112〜154g、減量期には筋肉保護のため126〜168g程度が目安です。"
    },
    {
      "id": "protein-intake-calculator-faq-2",
      "question": "1つの数字ではなく「範囲」で表示される理由は？",
      "answer": "ISSNやACSMの公式見解自体が個人差や運動量に応じた幅で定義されているためです。中央値を目安に計画するのが最も実用的です。"
    },
    {
      "id": "protein-intake-calculator-faq-3",
      "question": "タンパク質を摂りすぎると体に悪影響はありますか？",
      "answer": "腎機能が健康な成人では体重1kgあたり2g前後の摂取で悪影響は確認されていません。ただし上限を超えて増やしても筋肥大は頭打ちになります（腎疾患がある場合は医師にご相談ください）。"
    },
    {
      "id": "protein-intake-calculator-faq-4",
      "question": "総体重と除脂肪体重のどちらで計算すべきですか？",
      "answer": "体脂肪率が高い場合は総体重だとやや過大に出るため、体脂肪率が分かる方は同じg/kg係数を除脂肪体重に掛けるとしっくりきます。"
    },
    {
      "id": "protein-intake-calculator-faq-5",
      "question": "1日の食事への配分方法は重要ですか？",
      "answer": "はい。筋タンパク合成は1食あたり約0.4 g/kgで頭打ちになるため、夕食に100gまとめ食いするより3〜4食に均等配分する方が効果的です。"
    },
    {
      "id": "protein-intake-calculator-faq-6",
      "question": "目標量に達するにはプロテインパウダーが必須ですか？",
      "answer": "いいえ。肉・魚・卵・乳製品・大豆製品などの通常食でも1日150g程度は十分達成でき、パウダーは忙しいときの手軽な補助食品にすぎません。"
    }
  ]
};
