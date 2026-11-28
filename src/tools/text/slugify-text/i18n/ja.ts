import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "slugify-text",
  "name": "URLスラッグ生成ツール",
  "seoTitle": "URLスラッグ生成ツール｜Slugify・ハイフン変換",
  "description": "タイトルからSEOに最適な小文字・ハイフン区切りのURLスラッグを一括生成。アクセント文字のASCII変換にも対応し、複数行まとめて処理できます。",
  "tagline": "見出しテキストをクリーンなURLスラッグへ一括変換。",
  "knowledge": {
    "primaryConcepts": [
      "URLスラッグ（Slugify）"
    ],
    "realWorldUseCases": [
      "ブログ記事タイトルからパーマリンクを作成する",
      "HTML見出し用のクリーンなアンカーIDを作る",
      "安全なファイル名・フォルダ名を生成する",
      "CMS向けにタイトルリストをまとめてスラッグ化する"
    ],
    "commonMistakes": [
      "日本語やアクセント付き文字・大文字がそのまま残ると思う",
      "アクセントを除去しないケバブケースと混同する"
    ]
  },
  "faqs": [
    {
      "id": "slugify-text-faq-1",
      "question": "URLスラッグとは何ですか？",
      "answer": "Webアドレスの末尾にある、ページ内容を表す小文字・ハイフン区切りの読みやすい文字列です。"
    },
    {
      "id": "slugify-text-faq-2",
      "question": "アクセント記号や記号はどう処理されますか？",
      "answer": "é→eのようにASCII文字へ正規化され、ß→ss等の置換も行われます。記号・空白の連続は1つのハイフンにまとまり、先頭・末尾のハイフンは除去されます。"
    },
    {
      "id": "slugify-text-faq-3",
      "question": "複数行のリストを一度にスラッグ化できますか？",
      "answer": "はい、各行を独立した1つのスラッグとして一括変換します。"
    },
    {
      "id": "slugify-text-faq-4",
      "question": "SEOに強いURLスラッグの条件は？",
      "answer": "短く、小文字で、ハイフン区切りで、検索意図に沿ったキーワードが含まれていることです。"
    },
    {
      "id": "slugify-text-faq-5",
      "question": "SlugifyとKebab Caseの違いは？",
      "answer": "Slugifyはアクセント記号も取り除いてASCIIのURL安全文字列にし、Kebab Caseは元の文字を残したままハイフンで繋ぎます。"
    },
    {
      "id": "slugify-text-faq-6",
      "question": "スラッグとURLパスは同じ意味ですか？",
      "answer": "いいえ。パスはドメイン以降全体を指し、スラッグはその最後の1区切り（記事固有ID部分）を指します。"
    },
    {
      "id": "slugify-text-faq-7",
      "question": "éやüなどのアクセント文字は残りますか？",
      "answer": "いいえ。URL上で%C3%A8のようなエンコード文字に化けるのを防ぐためASCIIに置換します。"
    },
    {
      "id": "slugify-text-faq-8",
      "question": "なぜすべて小文字になるのですか？",
      "answer": "Webサーバーの多くが大文字・小文字を別URLとして扱うため、重複URLによるSEO評価分散を防ぐ目的があります。"
    },
    {
      "id": "slugify-text-faq-9",
      "question": "公開前の記事タイトルを貼り付けても安全ですか？",
      "answer": "はい、変換はすべてお使いのブラウザ内で実行され、外部サーバーに送信されません。"
    }
  ],
  "guide": {
    "title": "テキストから安全なURLスラッグを生成する方法",
    "description": "SEOに強いスラッグの条件、アクセント記号のASCII置換、kebab-caseとの違いを解説します。"
  },
  "ui": {
    "placeholder": "タイトルまたはタイトル一覧を入力",
    "outputPlaceholder": "URLスラッグがここに表示されます",
    "sampleText": "10 Easy Café Recipes: Crème Brûlée 2026",
    "handoff": {
      "msgTpl": "英数字を含まない行が {n} 行あり、スラッグが空文字になりました（非ラテン文字は自動音訳されません）。",
      "siblings": {
        "sentence-case-converter": "文頭大文字変換",
        "kebab-case-converter": "ケバブケース変換",
        "trim-text": "前後空白削除",
        "lowercase-converter": "小文字変換"
      }
    }
  }
};
