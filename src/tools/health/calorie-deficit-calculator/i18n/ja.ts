import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "カロリー赤字・減量計算機",
  "seoTitle": "カロリー赤字計算機・1日の目標摂取量と減量期間",
  "description": "目標ペースに合わせて1日の適切な摂取カロリーと減量期間を算出する無料ツール。基礎代謝（BMR）を下回らない安全な計画を立てられます。",
  "tagline": "無理のない減量ペースに必要な毎日の摂取カロリーと期間を算出。",
  "lead": "基礎代謝（BMR）の下限を守りながら、目標体重までの最適な1日あたりの摂取カロリーと達成目安週数をブラウザ内で計算します。",
  "craft": {
    "solves": "最初に設定したカロリーを体重減少後も据え置くと、維持カロリーが下がった分だけ赤字幅が消えて停滞の原因になります。"
  },
  "guide": {
    "title": "無理なく続くカロリー赤字（アンダーカロリー）の作り方",
    "description": "体脂肪1kgあたり約7,700 kcalの根拠、BMR以下にしてはいけない理由、体重減少に伴う目標カロリーの再調整タイミングを解説します。"
  },
  "fields": {
    "unit": {
      "label": "単位系",
      "options": {
        "metric": "メートル法 (kg, cm)",
        "imperial": "ヤード・ポンド法 (lb, in)"
      }
    },
    "sex": {
      "label": "性別",
      "options": {
        "male": "男性",
        "female": "女性"
      },
      "help": "基礎代謝の推定式に使用します。"
    },
    "age": {
      "label": "年齢",
      "suffix": "歳"
    },
    "weight": {
      "label": "現在の体重",
      "help": "メートル法は kg、インペリアルは lb で入力。"
    },
    "height": {
      "label": "身長",
      "help": "メートル法は cm、インペリアルは総インチ数。"
    },
    "activity": {
      "label": "活動レベル",
      "options": {
        "sedentary": "ほぼ運動しない（デスクワーク中心）",
        "light": "軽い運動（週1〜3回）",
        "moderate": "適度な運動（週3〜5回）",
        "active": "活発（週6〜7回の運動）",
        "very-active": "非常に活発（激しいトレーニングや肉体労働）"
      }
    },
    "rate": {
      "label": "1週間あたりの減量ペース",
      "options": {
        "1": "週 1 kg（かなり厳格）",
        "0.25": "週 0.25 kg（ゆるやか）",
        "0.5": "週 0.5 kg（標準的）",
        "0.75": "週 0.75 kg（やや速め）"
      }
    },
    "goal": {
      "label": "目標体重",
      "help": "期間予測が不要な場合は空欄のままにします。"
    }
  },
  "ui": {
    "emptyText": "体格と減量ペースを入力すると、1日の目標摂取カロリーと達成までの週数が表示されます。",
    "engine": {
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errMinTpl": "{label}は {min} 以上である必要があります。",
      "errMaxTpl": "{label}は {max} 以下である必要があります。",
      "fieldUnit": "単位系",
      "fieldSex": "BMR計算用の性別",
      "fieldActivity": "活動レベル",
      "fieldRate": "減量ペース",
      "fieldAge": "年齢",
      "fieldWeight": "現在の体重",
      "fieldHeight": "身長",
      "fieldGoal": "目標体重",
      "errWeightZero": "計画を作成するには0より大きい現在の体重を入力してください。",
      "errHeightZero": "0より大きい身長を入力してください。",
      "heroLabel": "1日の食事目安",
      "noteFloorTpl": "この計算機での安全な下限（週あたり約 {kg} kg 減）",
      "noteRateTpl": "週 {kg} kg 減ペースの目安",
      "cardMaint": "維持カロリー (TDEE)",
      "cardDailyDef": "1日の赤字幅",
      "cardWeeklyDef": "1週間の赤字幅",
      "cardBmr": "基礎代謝 (BMR下限)",
      "cardLeft": "目標までの残量",
      "cardWeeks": "このペースでの期間",
      "weeksTpl": "約 {n} 週間",
      "msQuarterTpl": "25%達成時点: {w}",
      "msHalfTpl": "折り返し地点: {w}",
      "msGoalTpl": "目標体重: {w}",
      "insMainTpl": "現在の維持カロリーは約 {maint} です。毎日 {target} に調整すると1日 {daily} kcal（週 {weekly} kcal）の赤字になります。",
      "insFloorTpl": "週 {kg} kg 減のペースでは基礎代謝（{bmr}）を下回るため、安全上の下限をBMRに固定しています。",
      "insWater": "体脂肪1kgは約7,700 kcalです。水分変動で一時的に停滞に見えることがあります。",
      "stepMetric": "4〜5 kg",
      "stepImp": "10 lb",
      "insRecalcTpl": "体重が {step} 減るごとに再計算してください。",
      "vizEat": "摂取目標",
      "vizGap": "赤字分",
      "vizTitle": "維持カロリーとの比較",
      "vizDescTpl": "維持カロリー {maint} から {pct}% 削減。",
      "asmUnits": "単位",
      "asmMetric": "メートル法 (kg, cm)",
      "asmImp": "インペリアル (lb, in)",
      "asmFormula": "BMR式",
      "asmEnergy": "1kg換算",
      "asmFloor": "下限ライン",
      "decTdee": "TDEE維持カロリーを確認",
      "decMacro": "PFCマクロに配分",
      "decTrack": "体重推移を記録",
      "q1": "適切な赤字幅は？",
      "q2": "達成まで何週間かかる？",
      "q3": "停滞する原因は？",
      "explanation": "Mifflin-St Jeor式のBMRと活動係数から維持カロリーを求め、体脂肪1kg＝約7,700 kcal換算でBMRを下回らない日次目標を算出します。"
    }
  },
  "knowledge": {
    "summary": "基礎代謝（BMR）を下回らない範囲で減量ペースに応じた1日の摂取カロリーと目標達成週数を算出します。",
    "useCases": [
      "過度な空腹や筋肉減少を避けながら減量カロリーを設定する",
      "現在体重から目標体重まで何週間かかるか見通しを立てる",
      "設定した減量幅が基礎代謝割れしていないか確認する"
    ],
    "mistakes": [
      "基礎代謝を下回る極端な減量ペースを選んでしまうこと",
      "体重が減った後も初期カロリーを一度も再計算しないこと",
      "1日だけの体重測定値で一喜一憂すること"
    ]
  },
  "faqs": [
    {
      "id": "calorie-deficit-calculator-faq-1",
      "question": "1日のカロリー赤字はどれくらいが適切ですか？",
      "answer": "多くの場合、週あたり体重の0.5%〜1%減（体重80kgなら1日約440〜880 kcalの赤字）が筋肉を守りながら続けやすい安全域です。"
    },
    {
      "id": "calorie-deficit-calculator-faq-2",
      "question": "「1kgあたり7,700 kcal」の根拠は何ですか？",
      "answer": "ヒトの体脂肪1kgに含まれる利用可能エネルギーが約7,700 kcalとされているためです。7日で割ると週1kg減＝1日約1,100 kcalの差になります。"
    },
    {
      "id": "calorie-deficit-calculator-faq-3",
      "question": "減量の途中で体重が落ちなくなる原因は？",
      "answer": "体重が軽くなると基礎代謝も消費量も減るため、当初の赤字幅が自然と縮小するためです。また水分保持で数週間停滞に見えることもあります。"
    },
    {
      "id": "calorie-deficit-calculator-faq-4",
      "question": "食事制限と運動はどちらを優先すべきですか？",
      "answer": "両立が最も効果的です。食事はカロリー調整を正確に管理しやすく、運動を加えると食事量を極端に減らさずに赤字を作れます。"
    },
    {
      "id": "calorie-deficit-calculator-faq-5",
      "question": "基礎代謝（BMR）より少ないカロリーを食べるとどうなりますか？",
      "answer": "筋肉の分解や倦怠感が増し継続が困難になります。そのため本計算機はBMRを安全上の下限値に設定しています。"
    },
    {
      "id": "calorie-deficit-calculator-faq-6",
      "question": "予測された達成週数はどの程度正確ですか？",
      "answer": "毎日正確に赤字を守れた場合の理想的な線形予測です。実際の計画では数週間の余裕を見て調整の基準にしてください。"
    }
  ]
};
