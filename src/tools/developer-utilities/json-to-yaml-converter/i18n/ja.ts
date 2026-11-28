import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "JSONからYAML変換ツール",
  "seoTitle": "JSONからYAMLへ変換・Kubernetes/設定用オンラインツール",
  "description": "JSONデータをKubernetes、Docker Compose、Ansible、CI/CD向けの見やすいYAMLへ変換する無料ツール。ブラウザ内で安全に変換できます。",
  "tagline": "Kubernetesや設定ファイル向けに見やすいYAMLへ変換。",
  "lead": "APIレスポンスなどのJSONを、インデントが整った安全なYAML形式へブラウザ上で即座に変換します。",
  "guide": {
    "title": "JSONからYAMLへの変換ガイド・書式と注意点",
    "description": "JSONとYAMLの違い、スペースインデントの規則、yes/noや数値文字列が自動でクォートされる理由とDevOpsでの活用例を解説します。"
  },
  "ui": {
    "inputLabel": "JSON入力",
    "placeholder": "ここにJSONを貼り付けてください",
    "moreAboutHeading": "JSONからYAML変換ツールの仕組み",
    "insight": "設定ファイルによく使われる読みやすいYAML形式へJSONを変換します。データ構造と値はそのままに記法だけを切り替えます。",
    "technical": [
      {
        "term": "処理内容",
        "detail": "解析したJSONをYAML形式で再シリアライズ"
      },
      {
        "term": "主な用途",
        "detail": "設定ファイル、CIパイプライン、マニフェスト"
      },
      {
        "term": "データ保全",
        "detail": "YAMLはJSONの上位互換であり情報は失われません"
      }
    ]
  },
  "knowledge": {
    "summary": "Kubernetes、Docker Compose、Ansible、GitHub ActionsなどのためにJSONを読みやすいYAMLへ安全に変換します。",
    "useCases": [
      "APIレスポンスのJSONからKubernetesマニフェストを作成する",
      "JSON定義からDocker Composeファイルを作成する",
      "Ansible用のYAML変数ファイルを生成する",
      "GitHub Actionsワークフロー定義を変換する",
      "OpenAPI定義をYAML形式にして読みやすくする"
    ],
    "mistakes": [
      "YAMLのインデントにタブ文字を使うこと（スペースのみ有効）",
      "数字に見える文字列をクォートせず数値扱いさせてしまうこと",
      "手修正時にネスト階層のスペース数をずらすこと",
      "先頭に --- がないYAMLをエラーだと誤認すること"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "JSONとYAMLの違いは何ですか？",
      "answer": "どちらも階層データを表しますが、JSONは波括弧と角括弧・ダブルクォートを厳格に使うのに対し、YAMLはスペースの字下げ（インデント）とハイフンを使って人間が読みやすく記述できます。"
    },
    {
      "id": "jyaml-faq-2",
      "question": "なぜJSONをYAMLに変換するのですか？",
      "answer": "Kubernetesマニフェスト、Docker Compose、Ansible、GitHub Actionsなど多くのインフラ設定ツールがYAMLを標準採用しているため、手作業で書き直す手間を省けます。"
    },
    {
      "id": "jyaml-faq-3",
      "question": "YAMLから再びJSONへ戻すこともできますか？",
      "answer": "はい。API送信やJSON Schema検証のためにJSONが必要な場面では、姉妹ツールの「YAMLからJSON変換ツール」で手軽に戻せます。"
    },
    {
      "id": "jyaml-faq-4",
      "question": "YAMLではインデントの厳密な統一が必須ですか？",
      "answer": "はい。YAMLはタブ禁止でスペースの字下げ幅だけで親子関係を表します。2スペースインデントが最も一般的で、1つでもズレると解析エラーや構造変化につながります。"
    },
    {
      "id": "jyaml-faq-5",
      "question": "一部の文字列が自動的に引用符（\"\"）で囲まれるのはなぜですか？",
      "answer": "YAMLではクォートなしの true・false・null・yes・no や「10001」などを自動的に真偽値や数値へ型変換する仕様があるため、文字列型を失わないよう自動でクォートを付けます。"
    },
    {
      "id": "jyaml-faq-6",
      "question": "配列のフロースタイル表示とは何ですか？",
      "answer": "単純な文字列や数値だけの配列を複数行のハイフン表記ではなく [a, b, c] のような1行形式でまとめ、設定ファイルをスッキリ短く見せる書き方です。"
    },
    {
      "id": "jyaml-faq-7",
      "question": "先頭の「---」マーカーは何を意味しますか？",
      "answer": "ドキュメント開始を示すYAMLインジケータです。必須ではないもののKubernetesやHelmのマルチドキュメント定義などでよく使われます。"
    },
    {
      "id": "jyaml-faq-8",
      "question": "機密のサーバー設定を変換してもプライバシーは守られますか？",
      "answer": "はい。入力されたJSONはブラウザ内JavaScriptのみで処理され、サーバーへのアップロード・保存・ログ記録は一切行われません。"
    }
  ]
};
