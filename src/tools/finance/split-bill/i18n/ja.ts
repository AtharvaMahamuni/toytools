import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "split-bill",
  "name": "割り勘計算ツール",
  "seoTitle": "割り勘計算ツール｜チップ込み端数調整でぴったり計算",
  "description": "食事代と任意チップ（0〜30%）を2〜30人で正確に割り勘。端数（余りの最小単位）を最後の1人に寄せて合計金額がぴったり一致します。",
  "tagline": "チップ込みの食事代を合計一致で正確に割り勘します。",
  "methodology": {
    "name": "端数一致アルゴリズム",
    "detail": "全員の基本額を切り捨て計算し、余った端数を最後の1人に加算して合計誤差ゼロを保証します。"
  },
  "knowledge": {
    "primaryConcepts": [
      "割り勘計算"
    ],
    "realWorldUseCases": [
      "友人との会食費とチップを誤差なく等分する"
    ],
    "commonMistakes": [
      "全員分を個別に四捨五入して合計が合わなくなる",
      "決済手数料ツールと混同する"
    ]
  },
  "faqs": [
    {
      "id": "bill-faq-1",
      "question": "割り勘ツールとは何ですか？",
      "answer": "食事代と任意のチップ（0〜30%）を2〜30人で分割し、全員の支払合計が元の請求額と完全一致するよう計算します。"
    },
    {
      "id": "bill-faq-2",
      "question": "割り切れない端数はどう処理されますか？",
      "answer": "最小単位（パイサ）で計算し、基本額を全員均等にしたうえで余り分を最後の1人に足すため誤差が出ません。"
    },
    {
      "id": "bill-faq-3",
      "question": "1000・チップ10%・3人の場合は？",
      "answer": "合計1100に対し、366.66、366.66、366.68となり合計がぴったり1100になります。"
    },
    {
      "id": "bill-faq-4",
      "question": "ぴったり割り切れる場合は？",
      "answer": "全員同額となり、端数の注記は表示されません。"
    },
    {
      "id": "bill-faq-5",
      "question": "チップ率は何%まで入力できますか？",
      "answer": "0〜30%の整数（未入力なら0%）です。"
    },
    {
      "id": "bill-faq-6",
      "question": "何人まで割り勘できますか？",
      "answer": "2人から30人まで（整数）に対応しています。"
    },
    {
      "id": "bill-faq-7",
      "question": "アカウントやメンバー履歴は保存されますか？",
      "answer": "いいえ、登録や履歴保存はありません。"
    },
    {
      "id": "bill-faq-8",
      "question": "決済手数料の計算ツールですか？",
      "answer": "いいえ、食事代の割り勘専用ツールです。"
    },
    {
      "id": "bill-faq-9",
      "question": "金額が外部に送信されますか？",
      "answer": "いいえ、すべてお使いの端末内で計算されます。"
    },
    {
      "id": "bill-faq-10",
      "question": "チップ計算ツールとの違いは？",
      "answer": "チップ計算は総額算出までですが、本ツールは1人ずつの端数調整済み支払額まで求めます。"
    }
  ],
  "guide": {
    "title": "合計が必ず合う公平な割り勘の仕組み",
    "description": "割り切れない端数の処理方法、チップ率（0〜30%）の計算ルール、チップ専用ツールとの違いを具体例で解説します。"
  },
  "ui": {
    "engine": {
      "billNote1": "ぴったり割り切れない場合、合計が一致するように最後の1人が余りの端数を負担します。",
      "billNote2": "アカウント登録や履歴保存はありません。入力値は端末内にとどまります。",
      "heroLabel": "チップ込み合計",
      "eachLineTpl": "1人あたり {each} です。",
      "noteEvenTpl": "{n}人。{eachLine}",
      "noteOddTpl": "{n}人。{eachLine} 最後の1人は {last} です。",
      "insEven": "全員がまったく同じ金額です。",
      "insOdd": "最後の1人が割り切れない端数を引き受けます。",
      "msSum": "全員の合計が会計総額と一致",
      "asmTip": "チップ",
      "noTip": "なし",
      "asmPeople": "人数",
      "asmRem": "端数（最小単位）",
      "decTip": "チップ額だけを専用ツールで計算する",
      "errBillEmpty": "会計金額を入力してください。",
      "errBillNaN": "金額は数値で入力してください。",
      "errBillPos": "金額は0より大きい値にしてください。",
      "errBillDec": "小数点以下は2桁以内で入力してください。",
      "errBillCap": "上限金額（100,000,000）を超えています。",
      "errPeopleEmpty": "2〜30人の範囲で人数を入力してください。",
      "errPeopleNaN": "人数は数値で入力してください。",
      "errPeopleInt": "人数は整数で入力してください。",
      "errPeopleRange": "人数は2〜30人で指定してください。",
      "errTipNaN": "チップ率は数値で入力してください。",
      "errTipRange": "チップ率は0〜30の範囲にしてください。",
      "errTipInt": "チップ率は整数で入力してください。",
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errNotNegativeTpl": "{Label}は0以上にしてください。",
      "errMinTpl": "{Label}は{min}以上にしてください。",
      "errMaxTpl": "{Label}は{max}以下にしてください。",
      "errPositiveTpl": "{label}は0より大きい値にしてください。",
      "yearSingular": "年",
      "yearsPlural": "年",
      "neverLabel": "到達不可",
      "vLabels": {
        "amount": "金額",
        "rate": "年率",
        "years": "年数",
        "goal": "目標金額",
        "current": "現在の貯蓄額",
        "start": "開始金額",
        "end": "終了金額"
      }
    },
    "billNote1": "ぴったり割り切れない場合、合計が一致するように最後の1人が余りの端数を負担します。",
    "billNote2": "アカウント登録や履歴保存はありません。入力値は端末内にとどまります。",
    "heroLabel": "チップ込み合計",
    "eachLineTpl": "1人あたり {each} です。",
    "noteEvenTpl": "{n}人。{eachLine}",
    "noteOddTpl": "{n}人。{eachLine} 最後の1人は {last} です。",
    "insEven": "全員がまったく同じ金額です。",
    "insOdd": "最後の1人が割り切れない端数を引き受けます。",
    "msSum": "全員の合計が会計総額と一致",
    "asmTip": "チップ",
    "noTip": "なし",
    "asmPeople": "人数",
    "asmRem": "端数（最小単位）",
    "decTip": "チップ額だけを専用ツールで計算する",
    "errBillEmpty": "会計金額を入力してください。",
    "errBillNaN": "金額は数値で入力してください。",
    "errBillPos": "金額は0より大きい値にしてください。",
    "errBillDec": "小数点以下は2桁以内で入力してください。",
    "errBillCap": "上限金額（100,000,000）を超えています。",
    "errPeopleEmpty": "2〜30人の範囲で人数を入力してください。",
    "errPeopleNaN": "人数は数値で入力してください。",
    "errPeopleInt": "人数は整数で入力してください。",
    "errPeopleRange": "人数は2〜30人で指定してください。",
    "errTipNaN": "チップ率は数値で入力してください。",
    "errTipRange": "チップ率は0〜30の範囲にしてください。",
    "errTipInt": "チップ率は整数で入力してください。",
    "errEnterTpl": "{label}を入力してください。",
    "errNotNumberTpl": "{label}は数値で入力してください。",
    "errNotNegativeTpl": "{Label}は0以上にしてください。",
    "errMinTpl": "{Label}は{min}以上にしてください。",
    "errMaxTpl": "{Label}は{max}以下にしてください。",
    "errPositiveTpl": "{label}は0より大きい値にしてください。",
    "yearSingular": "年",
    "yearsPlural": "年",
    "neverLabel": "到達不可",
    "vLabels": {
      "amount": "金額",
      "rate": "年率",
      "years": "年数",
      "goal": "目標金額",
      "current": "現在の貯蓄額",
      "start": "開始金額",
      "end": "終了金額"
    }
  },
  "fields": {
    "bill": {
      "label": "会計合計額",
      "help": "小数点第2位まで入力可能。食事代の割り勘用です。"
    },
    "people": {
      "label": "人数",
      "unit": "人",
      "help": "2人から30人まで指定できます。"
    },
    "tip": {
      "label": "チップ (%)",
      "help": "任意（0〜30の整数）。空欄の場合はチップなし。"
    }
  }
};
