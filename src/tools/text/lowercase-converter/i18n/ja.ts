import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "lowercase-converter",
  "name": "小文字変換ツール",
  "seoTitle": "英語テキスト小文字変換ツール｜一括lowercase変換",
  "description": "英字テキストを一瞬ですべて小文字（lowercase）に変換。メールアドレスやタグの表記統一、比較前処理にブラウザ上で安全に使えます。",
  "tagline": "英字テキストを一括でlowercase（小文字）に変換します。",
  "knowledge": {
    "primaryConcepts": [
      "小文字変換"
    ],
    "realWorldUseCases": [
      "保存前にメールアドレスやユーザーIDを小文字統一する",
      "タグやキーワードの表記ゆれを防ぐ",
      "大文字小文字を区別しない照合用データを作る",
      "CapsLockのまま打った英文を修正する"
    ],
    "commonMistakes": [
      "固有名詞やAPIなどの専門略語まで平坦化してしまう",
      "比較対象の片方だけを小文字化する"
    ]
  },
  "faqs": [
    {
      "id": "lc-faq-1",
      "question": "テキストを小文字に変換するには？",
      "answer": "左側の入力欄にテキストを貼るだけで、瞬時にすべて小文字の結果が右側へ表示されます。"
    },
    {
      "id": "lc-faq-2",
      "question": "小文字表記が求められる場面は？",
      "answer": "メールアドレス、URLスラッグ、ハッシュタグ、Pythonモジュール名、大文字小文字を区別しない照合前処理などで必須です。"
    },
    {
      "id": "lc-faq-3",
      "question": "メールアドレスを保存前に正規化するには？",
      "answer": "一覧を小文字変換にかければ「Jane@Example.COM」と「jane@example.com」が同一表記に揃い重複を防げます。"
    },
    {
      "id": "lc-faq-4",
      "question": "正規化は小文字と大文字のどちらが良いですか？",
      "answer": "Web標準ではURL・メール・タグすべて小文字正規化が一般的です。"
    },
    {
      "id": "lc-faq-5",
      "question": "小文字化したのに比較が一致しない原因は？",
      "answer": "比較する両方の値を小文字化しているか、前後の空白やタブが含まれていないか確認してください。"
    },
    {
      "id": "lc-faq-6",
      "question": "数字や記号は変更されますか？",
      "answer": "いいえ、アルファベットなどの大文字・小文字がある文字だけ変換され、数字や記号はそのまま残ります。"
    },
    {
      "id": "lc-faq-7",
      "question": "一部の文字が小文字に変わらないのはなぜ？",
      "answer": "数字、絵文字、漢字・ひらがな・アラビア文字など大文字・小文字の区別を持たない文字は変化しません。"
    },
    {
      "id": "lc-faq-8",
      "question": "固有名詞や頭字語（NASAなど）の情報は消えますか？",
      "answer": "はい、すべて小文字化されるため略語の意味が弱まります。表示用は元の文字列を残し、比較用やURL用のみ小文字化してください。"
    },
    {
      "id": "lc-faq-9",
      "question": "オフラインでも動作しますか？",
      "answer": "はい、ページを一度読み込めば通信なしでもブラウザ内で利用できます。"
    }
  ],
  "guide": {
    "title": "テキストを小文字（lowercase）に変換する方法",
    "description": "メールアドレス・URLスラッグ・データ照合で小文字統一が必要な理由や、略語の大文字消失などの注意点をわかりやすく解説します。"
  },
  "ui": {
    "placeholder": "ここにテキストを貼り付けまたは入力",
    "outputPlaceholder": "小文字変換の結果がここに表示されます",
    "sampleText": "Hello WORLD, API_HTTP and User@Example.JP",
    "handoff": {
      "msgTpl": "{n} 個の頭字語・略語（{list}）の大文字情報が失われており、元には戻せません。"
    }
  }
};
