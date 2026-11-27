import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'base64-encoder-decoder',
  name: 'Base64 エンコード・デコード',
  seoTitle: 'Base64 エンコード・デコード変換ツール（UTF-8対応）',
  description:
    '日本語テキスト（UTF-8）のBase64エンコードとBase64・Base64URLのデコードをブラウザ上で即変換。Data URI除去や末尾パディング補完も1クリックで行えます。',
  tagline: 'Base64とテキストをブラウザ内で双方向変換。',
  craft: {
    solves:
      'Data URI接頭辞やパディング省略型のBase64URL文字列・混入した空白によってデコードが失敗し、ツール不具合に見えてしまう問題を防ぎます。',
  },
  knowledge: {
    primaryConcepts: ['Base64'],
    realWorldUseCases: [
      '小さな画像をData URIとしてHTML/CSSに直接埋め込む',
      'JSON APIレスポンス内でバイナリデータを安全に扱う',
      'JWTトークンのヘッダーやペイロードをデコードして確認する',
      'メール添付やMIMEヘッダー向けのデータ形式を検証する',
    ],
    commonMistakes: [
      'Base64を暗号化や秘匿手段だと誤解する',
      'エンコード後にデータサイズが約33%増える点を見落とす',
    ],
  },
  faqs: [
    {
      id: 'b64-faq-1',
      question: 'Base64とは何ですか？',
      answer:
        '任意のバイナリデータを64種類の印字可能なASCII文字（`A–Z`, `a–z`, `0–9`, `+`, `/` と埋め文字 `=`）へ変換する方式で、メールやHTTPヘッダーなどテキスト前提の経路を安全に通すために使われます。',
    },
    {
      id: 'b64-faq-2',
      question: 'テキストをBase64にエンコードするには？',
      answer:
        '入力欄に文字列を貼り付け、モードで「エンコード → Base64」を選ぶとUTF-8バイト列として即座に変換され、「コピー」ボタンで取得できます。',
    },
    {
      id: 'b64-faq-3',
      question: 'Base64を元のテキストにデコードするには？',
      answer:
        'Base64文字列を貼り付けて「デコード ← Base64」を選択します。Data URI接頭辞やBase64URL形式が混ざっていても1クリック修正を提案します。',
    },
    {
      id: 'b64-faq-4',
      question: 'Base64は暗号化の一種ですか？',
      answer:
        'いいえ。暗号化ではなく単なる文字変換（エンコーディング）です。秘密鍵なしで誰でも即座に元へ戻せるため、機密保護には必ずAESやTLSを使ってください。',
    },
    {
      id: 'b64-faq-5',
      question: 'Base64で変換したデータは安全・秘匿されますか？',
      answer:
        '秘匿性は一切ありません。バイナリをテキストとして安全に運ぶ用途にのみ使い、パスワードや秘密鍵の隠蔽には使用しないでください。',
    },
    {
      id: 'b64-faq-6',
      question: '末尾に "=" や "==" が付くことがあるのはなぜですか？',
      answer:
        'Base64は3バイト（24ビット）単位を4文字に変換するため、入力バイト数が3の倍数でない場合に不足分を補うパディング文字として末尾に `=` または `==` を付けます。',
    },
    {
      id: 'b64-faq-7',
      question: 'Base64URLと標準Base64の違いは何ですか？',
      answer:
        'Base64URLはURLやファイル名でそのまま使えるよう `+` を `-`、`/` を `_` に置き換え（多くの場合末尾 `=` も省略）した派生形式です。JWTトークンで採用されています。',
    },
    {
      id: 'b64-faq-8',
      question: '画像やバイナリファイルもBase64にできますか？',
      answer:
        '仕組み上はあらゆるバイナリを `data:image/png;base64,...` などのData URI形式に変換できます。本ツールは文字列・UTF-8テキスト変換に特化しています。',
    },
    {
      id: 'b64-faq-9',
      question: 'なぜBase64変換すると元のデータより大きくなるのですか？',
      answer:
        '元の3バイトを4文字（4バイト）のASCII文字に割り当てる仕様のため、データサイズが約33%増加します。テキスト安全な転送とのトレードオフです。',
    },
  ],
  guide: {
    title: 'Base64の仕組み：末尾「=」の意味とBase64URLとの違い',
    description:
      '3バイトが4文字になる原理、データサイズ約33%増の理由、Base64URLとの違い、暗号化ではない重要な注意点を解説します。',
    readMinutes: 5,
  },
  ui: {
    displayName: 'Base64',
    forwardLabel: 'エンコード → Base64',
    inverseLabel: 'デコード ← Base64',
    outputLabel: '出力結果',
    placeholder: 'テキストまたはBase64文字列をここに貼り付け…',
    outputPlaceholder: '変換結果がここに表示されます…',
    emptyOutput: 'テキストまたはBase64文字列を入力すると自動変換します。',
    insight:
      'Base64は任意バイト列を安全な64文字のASCII表現に変換します（サイズ約33%増）。可逆の転送形式であり暗号化ではありません。',
    technical: [
      { term: '文字セット', detail: 'UTF-8バイト列を RFC 4648 文字セット (A-Z, a-z, 0-9, +, /) へ変換' },
      { term: 'データ膨張率', detail: '3バイトごとに4文字出力（約33%増＋末尾パディング =）' },
      { term: 'プライバシー', detail: 'サーバー送信なし・ブラウザ内ローカル処理で完結' },
    ],
    compareLabel: '比較チェック',
    comparePlaceholder: '一致確認したい期待値（任意）',
    modeAriaLabel: '変換モード選択',
    inputAriaLabel: '入力欄',
    outputAriaLabel: '変換結果',
    swapLabel: '入出力を入替',
    swapAriaLabel: '入力と出力を入れ替える',
    metaAriaLabel: '変換メタデータ',
    byteAriaLabel: '16進数バイトビューア',
    historyTitle: '変換履歴',
    historyAriaLabel: '最近の入力',
    insightAriaLabel: '技術解説',
    appliedPrefix: '自動修正を適用:',
    checkInputMsg: '入力を確認してください。デコードできない文字が含まれています。',
    invalidInputMsg: '有効なBase64形式ではありません。',
    couldNotConvertMsg: '入力を変換できませんでした。',
    detectedPrefix: '自動検出:',
    validPrefix: '有効',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'テキスト',
      'Percent-encoded': 'URLエンコード',
      'HTML entities': 'HTMLエンティティ',
      Markup: 'マークアップ',
    },
    engine: {
      errDecode: '有効なBase64としてデコードできませんでした。',
      errEncode: 'Base64へエンコードできませんでした。',
      errBadCharTpl: '{pos}文字目に不正なBase64文字「{ch}」があります。',
      errBadPadTpl: '{pos}文字目付近に不正な = パディングがあります（末尾のみ有効）。',
      warnLen: 'パディングを除いた長さが4の倍数ではありません（末尾の = が欠落している可能性）。',
      recDataUri: 'Data URI接頭辞（data:...;base64,）を除去する',
      recBase64Url: 'Base64URL（- / _）から標準Base64へ変換する',
      recPadding: '末尾に不足している = パディングを補う',
      metaInputBytes: '入力バイト',
      metaB64Length: 'Base64文字数',
      metaExpansion: '増加率',
    },
  },
};
