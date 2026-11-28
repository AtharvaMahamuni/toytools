import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "体脂肪率計算機（米海軍式）",
  "seoTitle": "体脂肪率計算機・メジャーで測る米海軍方式（BFP）",
  "description": "メジャーで測った首・ウエスト・ヒップのサイズと身長から体脂肪率・体脂肪量・除脂肪体重を推定する無料計算ツール。男女・cm/inch対応。",
  "tagline": "メジャー計測による米海軍式体脂肪率・体脂肪量・除脂肪体重を計算。",
  "lead": "身長と首・腹囲（女性はヒップ含む）のサイズから、米国海軍方式の体脂肪率、ACE判定区分、体脂肪量と除脂肪体重を算出します。",
  "craft": {
    "solves": "メジャーの締め具合によって誤差が出るため、1回の絶対値よりも同じ条件で週単位の推移を見ることが重要です。"
  },
  "guide": {
    "title": "メジャーを使った正確な体脂肪率の測り方（米海軍式）",
    "description": "U.S. Navy方式の計算仕組み、首・ウエスト・ヒップの正しい測定位置、精度の目安やBMIとの違いを詳しく解説します。"
  },
  "fields": {
    "unit": {
      "label": "単位系",
      "options": {
        "metric": "メートル法 (cm, kg)",
        "imperial": "ヤード・ポンド法 (in, lb)"
      }
    },
    "sex": {
      "label": "性別",
      "options": {
        "male": "男性",
        "female": "女性"
      }
    },
    "height": {
      "label": "身長",
      "help": "メートル法は cm、インペリアルは インチ で入力。"
    },
    "neck": {
      "label": "首周り",
      "help": "喉仏のすぐ下を水平に計測します。"
    },
    "waist": {
      "label": "ウエスト（腹囲）",
      "help": "男性はおへその高さ、女性は最もくびれた位置で計測。"
    },
    "hip": {
      "label": "ヒップ（腰囲）",
      "help": "女性のみ最も広い位置を計測（男性の計算では使われません）。"
    },
    "weight": {
      "label": "体重（任意）",
      "help": "入力すると体脂肪量と除脂肪体重を算出します。"
    }
  },
  "ui": {
    "emptyText": "身長と各部位のサイズ（女性はヒップも含む）を入力すると体脂肪率が算出されます。",
    "engine": {
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errMinTpl": "{label}は {min} 以上である必要があります。",
      "errMaxTpl": "{label}は {max} 以下である必要があります。",
      "errPositiveTpl": "{label}は0より大きい値にしてください。",
      "fieldUnit": "単位系",
      "fieldSex": "性別",
      "fieldHeight": "身長",
      "fieldNeck": "首周り",
      "fieldWaist": "ウエスト",
      "fieldHip": "ヒップ",
      "fieldWeight": "体重",
      "errWaistNeck": "ウエストは首周りより大きい値である必要があります。数値を再確認してください。",
      "errWaistHipNeck": "ウエストとヒップの合計は首周りより大きい必要があります。",
      "errInvalidEst": "入力されたサイズからは有効な推定値が得られません。",
      "heroLabel": "推定体脂肪率",
      "cardCat": "判定区分",
      "cardFat": "体脂肪量",
      "cardLean": "除脂肪体重",
      "men": "男性",
      "women": "女性",
      "cats": {
        "essential": "必須脂肪",
        "athletes": "アスリート",
        "fitness": "フィットネス",
        "average": "標準",
        "obese": "高水準（肥満域）"
      },
      "insCatTpl": "推定体脂肪率 {bf}% は{sex}のACE基準で「{cat}」に該当します。",
      "insTape": "メジャー法には数％の誤差範囲があります。同じ時間帯・同じ締め具合で測り、長期トレンドで変化を見てください。",
      "vizTitleTpl": "ACE基準における体脂肪率 {bf}% の位置",
      "vizDescTpl": "{sex}向けのACE体脂肪率区分です。単発の数値より週単位の変化傾向を重視しましょう。",
      "asmMethod": "算出方式",
      "asmMethodVal": "U.S. Navy（米国海軍式）",
      "asmUnits": "単位",
      "asmMetric": "メートル法 (cm, kg)",
      "asmImp": "インペリアル (in, lb)",
      "asmCats": "判定基準",
      "asmCatsVal": "American Council on Exercise (ACE)",
      "decBmi": "BMI値とも比較して確認する",
      "decTdee": "1日の消費カロリー (TDEE) を計算",
      "decTrack": "体重推移を記録する",
      "q1": "健康的な体脂肪率の目安はどれくらいですか？",
      "q2": "米海軍式の体脂肪率計算はどの程度正確ですか？",
      "q3": "体脂肪率とBMIは何が違いますか？",
      "explanation": "米国海軍方式（U.S. Navy method）は、水中体重測定データに基づいた対数式を用い、身長と首・ウエスト（女性はヒップ追加）の周径比から体脂肪率を推定します。特殊な体組成計がなくてもメジャー1本で体形の変化を追跡できます。"
    }
  },
  "knowledge": {
    "summary": "メジャー計測値から米国海軍方式で体脂肪率を算出し、体重入力により体脂肪量と除脂肪体重も計算します。",
    "useCases": [
      "体重の変化が少ないときでも引き締まり具合を数値で追う",
      "減量中に筋肉（除脂肪体重）が維持できているか把握する",
      "筋肉量が多くBMIが高く出る人の体組成を正しく評価する"
    ],
    "mistakes": [
      "測る際にお腹を引っ込めたりメジャーをきつく締めすぎたりすること",
      "朝と食後など時間帯がバラバラな計測値を比べること",
      "メジャー推計値を医療用DEXA測定の絶対値と思い込むこと"
    ]
  },
  "faqs": [
    {
      "id": "body-fat-calculator-faq-1",
      "question": "米国海軍式（U.S. Navy法）の仕組みは？",
      "answer": "水中体重法データに基づく式を使い、男性は首と腹囲、女性は首・腹囲・ヒップと身長の関係から全体の体脂肪率を推計します。"
    },
    {
      "id": "body-fat-calculator-faq-2",
      "question": "どこを測ればよいですか？",
      "answer": "首は喉仏のすぐ下、ウエストは男性はおへそ高さ・女性は一番細い部分、ヒップは一番張り出した部分を水平に計測します。"
    },
    {
      "id": "body-fat-calculator-faq-3",
      "question": "精度はどのくらいですか？",
      "answer": "同じ条件で丁寧に測れば臨床法に対して概ね±3〜4%以内の誤差に収まり、市販体重計より日内水分変動に左右されにくい利点があります。"
    },
    {
      "id": "body-fat-calculator-faq-4",
      "question": "健康的な体脂肪率の範囲は？",
      "answer": "ACE区分ではフィットネス帯が男性約14〜17%、女性約21〜24%とされ、競技者はそれより低く標準域はやや高めになります。"
    },
    {
      "id": "body-fat-calculator-faq-5",
      "question": "体脂肪率とBMIの違いは何ですか？",
      "answer": "BMIは身長と体重しか使わないため筋肉と脂肪を区別できません。本計算機は体脂肪量と除脂肪体重まで分離して確認できます。"
    },
    {
      "id": "body-fat-calculator-faq-6",
      "question": "計測データは外部に保存されますか？",
      "answer": "いいえ。計算はすべてお使いのブラウザ内で処理され、体重やサイズデータが外部へ送信・保存されることはありません。"
    }
  ]
};
