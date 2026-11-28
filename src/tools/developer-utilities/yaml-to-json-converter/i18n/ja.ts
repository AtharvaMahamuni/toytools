import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "YAMLからJSON変換ツール",
  "seoTitle": "YAMLからJSONへ変換・API・Schema検証用オンラインツール",
  "description": "YAML設定ファイルをAPIやJSON Schema検証でそのまま使えるJSON形式へ変換する無料ツール。アンカー・エイリアスの展開や日付のISO文字列変換に対応。",
  "tagline": "YAML設定をブラウザ内で即座に有効なJSONへ変換。",
  "lead": "KubernetesマニフェストやYAMLファイルを、アンカー展開と日付保持を行いつつブラウザ上で厳格なJSONへ変換します。",
  "guide": {
    "title": "YAMLからJSONへの変換方法と仕様の解説",
    "description": "YAMLのコメント、アンカーとエイリアス、日付データがJSONへどう変換されるかと、タブ文字エラーなどの注意点を分かりやすく解説。"
  },
  "ui": {
    "inputLabel": "YAML入力",
    "placeholder": "ここにYAMLを貼り付けてください",
    "craftNote": "YAMLではインデントにタブ文字を使えません。パーサー間の標準は半角スペース2文字の字下げです。",
    "moreAboutHeading": "YAMLからJSON変換ツールの仕組み",
    "insight": "YAML設定をAPIやJSON専用ツール向けのJSON形式へ変換します。YAMLのインデント階層がそのままJSONのオブジェクト・配列ネストになります。",
    "technical": [
      {
        "term": "処理内容",
        "detail": "YAMLを解析しJSONとしてシリアライズ"
      },
      {
        "term": "主な用途",
        "detail": "JSON専用APIへのデータ投入やSchema検証"
      },
      {
        "term": "インデント",
        "detail": "YAMLの字下げをJSONオブジェクト・配列構造に変換"
      }
    ]
  },
  "knowledge": {
    "summary": "API連携やJSON Schema検証向けにYAMLをJSONへ変換。アンカー展開とISO日付文字列化も自動で処理します。",
    "useCases": [
      "KubernetesのYAMLマニフェストをJSON対応ツールに渡す",
      "YAML設定をJSON Schemaで検証するためJSON変換する",
      "YAML設定ファイルをJSON受け付けAPIエンドポイントへ送信する",
      "YAMLライブラリのないスクリプト言語から設定を読めるようにする",
      "JSON形式を保存するデータベースへYAMLデータを取り込む"
    ],
    "mistakes": [
      "YAMLのインデントに半角スペースではなくタブ文字を使うこと",
      "YAML内の # コメントが変換後のJSONにも残ると期待すること",
      "日付値がJSON内でも専用日付型のまま残ると誤解すること",
      "特殊記号を含む値を引用符で囲まずエラーになること"
    ]
  },
  "faqs": [
    {
      "id": "y2j-faq-1",
      "question": "なぜYAMLをJSONに変換するのですか？",
      "answer": "Web APIや多くのプログラミング言語ではJSONが標準だからです。YAML設定をAPIへ送る前処理や、JSON Schemaでのバリデーション、YAMLライブラリがない環境での処理にJSON変換が役立ちます。"
    },
    {
      "id": "y2j-faq-2",
      "question": "YAMLはJSONの上位互換（スーパーセット）ですか？",
      "answer": "はい。YAML 1.2以降、有効なJSONはすべてYAMLとしても読み込めます。ただし逆は成り立たず、コメント・アンカー・マルチドキュメントなどYAML特有の記法はJSON変換時に展開または除去されます。"
    },
    {
      "id": "y2j-faq-3",
      "question": "YAMLのコメント（#）はどうなりますか？",
      "answer": "削除されます。JSON仕様にはコメント構文が存在しないため、# から始まるコメントは除外され、キー・値・構造データのみがJSONへ引き継がれます。"
    },
    {
      "id": "y2j-faq-4",
      "question": "アンカー（&）やエイリアス（*）はどう処理されますか？",
      "answer": "JSONには参照構文がないため、エイリアス箇所へ参照元のブロック全体が自動展開されて独立したJSONデータとして出力されます。"
    },
    {
      "id": "y2j-faq-5",
      "question": "YAMLの日付・タイムスタンプはどう変換されますか？",
      "answer": "JSONには日付専用の型が存在しないため、情報を失わないようISO 8601形式の文字列として出力されます。書式をそのまま残したい場合はYAML側で引用符で囲ってください。"
    },
    {
      "id": "y2j-faq-6",
      "question": "YAMLの変換に失敗してエラーが出る原因は？",
      "answer": "最も多い原因はタブ文字の混入やインデント幅のズレです。ほかにもキー後のコロン抜けや未クォートの特殊文字が挙げられます。"
    },
    {
      "id": "y2j-faq-7",
      "question": "変換したJSONをYAMLへ戻すことはできますか？",
      "answer": "はい。ツール上部の関連ツール「JSONからYAML変換ツール」へ切り替えるだけで、入力を保持したまま双方向に行き来できます。"
    },
    {
      "id": "y2j-faq-8",
      "question": "入力したYAMLデータはサーバーに送られますか？",
      "answer": "いいえ。解析からJSON生成までお使いのブラウザ内で完結し、機密の設定ファイルが外部サーバーに送信・保存されることはありません。"
    }
  ]
};
