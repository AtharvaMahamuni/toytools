import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'qr-code-generator',
  name: 'QRコード作成ツール',
  seoTitle: 'QRコード生成ツール – URL・Wi-Fi・テキストをPNG/SVG保存',
  description:
    'テキスト、URL、メール、電話、Wi-Fi接続、連絡先(vCard)からQRコードを即座に生成。PNG・SVG形式で無料ダウンロードでき、すべて端末内で安全に完結します。',
  tagline: 'URL・Wi-Fi・連絡先・テキストのQRコードを即座に作成しPNG/SVG保存。',
  knowledge: {
    primaryConcepts: ['qrコード作成', 'qrコード生成', 'wifi qrコード'],
    realWorldUseCases: [
      'チラシやポスター、商品パッケージからWebサイトへ誘導する',
      'パスワードを読み上げずに来店客へWi-Fi接続を共有する',
      '名刺やメール署名に連絡先（vCard）を載せる',
      'メニュー表やアンケートフォームへのリンクを卓上に置く',
    ],
    commonMistakes: [
      '長すぎるURLを入れてセルが細かくなり読み取りにくくなること',
      '読み取り距離に対して印刷サイズが小さすぎること',
      '折り目や汚れがつきやすい印刷物で誤り訂正レベルL（低）を選ぶこと',
      'QRコード周囲の白い余白（クワイエットゾーン）を切り落としてしまうこと',
    ],
  },
  faqs: [
    {
      id: 'qr-code-generator-faq-1',
      question: 'QRコードとは何ですか？',
      answer:
        '格子状のセルで情報を記録する2次元コードです。カメラで読むとURL移動やWi-Fi接続などを即実行できます。',
    },
    {
      id: 'qr-code-generator-faq-2',
      question: 'このQRコード生成ツールの使い方は？',
      answer:
        '種類を選んで内容を入力すると即座に生成されます。PNG・SVG保存や元文字列のコピーもブラウザ内で完結します。',
    },
    {
      id: 'qr-code-generator-faq-3',
      question: 'どのような種類のデータに対応していますか？',
      answer:
        'テキスト・URL・メール・電話番号・Wi-Fi・連絡先(vCard)の6種類に対応し、標準形式で符号化します。',
    },
    {
      id: 'qr-code-generator-faq-4',
      question: 'Wi-Fi接続用のQRコードはどうやって作りますか？',
      answer:
        '「Wi-Fi」を選びSSID・パスワード・暗号化(通常WPA/WPA2)を入力します。非公開なら「隠しネットワーク」にチェックしてください。',
    },
    {
      id: 'qr-code-generator-faq-5',
      question: '作成したQRコードはダウンロードできますか？',
      answer:
        'はい。Web向けのPNG画像と印刷でも劣化しないベクターSVGの両方を無料で保存できます。',
    },
    {
      id: 'qr-code-generator-faq-6',
      question: 'PNGとSVGの違いは何ですか？',
      answer:
        'PNGは拡大するとにじむピクセル画像、SVGは名刺から看板まで鮮明に印刷できるベクター形式です。',
    },
    {
      id: 'qr-code-generator-faq-7',
      question: 'オフライン環境でもQRコードを作成できますか？',
      answer:
        'はい。読み込み後はローカルJavaScriptのみで生成するためオフラインや機内モードでも動作します。',
    },
    {
      id: 'qr-code-generator-faq-8',
      question: 'Wi-Fiパスワードなどの個人情報は安全ですか？',
      answer:
        'はい。すべて端末内メモリのみで処理され、外部サーバーへの送信や記録は一切ありません。',
    },
    {
      id: 'qr-code-generator-faq-9',
      question: 'QRコードの誤り訂正機能（エラー訂正）とは？',
      answer:
        '汚れや欠けがあっても復元できる冗長データ機能で、L(7%)〜H(30%)の4段階から選べます。通常はM(15%)が標準です。',
    },
    {
      id: 'qr-code-generator-faq-10',
      question: '誤り訂正レベルはどれを選ぶべきですか？',
      answer:
        '通常は「中 (15%)」、小さく印刷する場合や摩耗しやすい環境・ロゴ入りにはQ(25%)やH(30%)を推奨します。',
    },
    {
      id: 'qr-code-generator-faq-11',
      question: 'WebサイトやURL用のQRコードも作れますか？',
      answer:
        'はい。「URL」で `https://...` を入力してください。不要なパラメータを省き短くすると認識しやすくなります。',
    },
    {
      id: 'qr-code-generator-faq-12',
      question: '名刺用の連絡先（vCard）QRコードはどう作りますか？',
      answer:
        '「連絡先カード」を選び氏名・電話・メール等を入力します。標準vCard形式でスマホに即登録できます。',
    },
    {
      id: 'qr-code-generator-faq-13',
      question: 'スマホで読み取れないときの原因は何ですか？',
      answer:
        '文字過多で細かい、印刷が小さい、コントラスト不足、白い余白欠けが主な原因です。白背景と余白を保ってください。',
    },
    {
      id: 'qr-code-generator-faq-14',
      question: '印刷する際の最小サイズ目安は？',
      answer:
        '短いURLでも最低 2cm × 2cm 以上が目安です。データ量や距離に応じて大きくし事前に実機テストしてください。',
    },
    {
      id: 'qr-code-generator-faq-15',
      question: 'クワイエットゾーン（周囲の余白）とは何ですか？',
      answer:
        '四方を囲む白い余白のことで読み取りに必須です。保存PNG/SVGに含まれているため切り取らないでください。',
    },
    {
      id: 'qr-code-generator-faq-16',
      question: '印刷したあとにQRコードの飛び先を変更できますか？',
      answer:
        'いいえ。静的QRのため変更できません。変えたい場合は自サイトのリダイレクトURLを入れて生成してください。',
    },
    {
      id: 'qr-code-generator-faq-17',
      question: 'このツールで作ったQRコードに有効期限はありますか？',
      answer:
        '有効期限はありません。中継サーバーを通さず内容そのものを画像化しているためずっと使えます。',
    },
    {
      id: 'qr-code-generator-faq-18',
      question: 'QRコードに最大何文字まで入れられますか？',
      answer:
        '規格上は数千文字ですが実用的には短いほどセルが大きくなり確実に読み取れます。',
    },
    {
      id: 'qr-code-generator-faq-25',
      question: '日本語や絵文字、アクセント記号も入りますか？',
      answer:
        'はい、UTF-8で日本語や絵文字に対応しています。日本語は1文字3バイト使うため文字数にご注意ください。',
    },
    {
      id: 'qr-code-generator-faq-19',
      question: '画像ではなく符号化された元文字列をコピーできますか？',
      answer:
        'はい。「コピー」ボタンで `WIFI:...` やURLなどの生ペイロードを取得できます。',
    },
    {
      id: 'qr-code-generator-faq-20',
      question: '商用利用可能で透かし（ウォーターマーク）は入りませんか？',
      answer:
        'はい。個人・商用ともに無料、無制限、透かしなしでご利用いただけます。',
    },
    {
      id: 'qr-code-generator-faq-21',
      question: '対応しているブラウザ環境を教えてください。',
      answer:
        'Chrome・Safari・Firefox・EdgeなどPCおよびスマホの最新ブラウザ全般で動作します。',
    },
    {
      id: 'qr-code-generator-faq-22',
      question: 'ダークモード中でもQRコードは読み取れる配色になりますか？',
      answer:
        'はい。読み取り精度を保つため常に白背景・黒セルで描画・書き出しされます。',
    },
    {
      id: 'qr-code-generator-faq-23',
      question: '入力したテキストやパスワードは履歴に残りませんか？',
      answer:
        '種類などのUI設定のみローカル保持し、入力テキストやWi-Fiパスワードは保存しません。',
    },
    {
      id: 'qr-code-generator-faq-24',
      question: '外部へのアクセスやトラッキングは組み込まれていますか？',
      answer:
        'いいえ。追跡タグや外部リダイレクトは一切含まれない完全ローカル生成です。',
    },
  ],
  guide: {
    title: 'QRコードの作り方と失敗しない印刷・サイズ設定',
    description: 'URL・Wi-Fi・vCard用QRコードの作り方、PNGとSVGの違い、誤り訂正レベルと余白のルールを解説。',
    readMinutes: 9,
  },
  fields: {
    contentType: {
      label: '種類',
      options: {
        text: 'テキスト',
        url: 'URL',
        email: 'メール',
        phone: '電話番号',
        wifi: 'Wi-Fi',
        vcard: '連絡先 (vCard)',
      },
    },
    text: {
      label: '内容',
      placeholder: 'テキスト、https://example.com、メールアドレス、電話番号',
      help: 'QRコードに直接埋め込む文字列を入力します。',
    },
    ssid: { label: 'ネットワーク名 (SSID)', placeholder: 'MyWiFi' },
    wifiPassword: { label: 'Wi-Fiパスワード', placeholder: 'パスワード' },
    encryption: {
      label: '暗号化方式',
      options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'なし' },
    },
    hidden: { label: 'ステルスネットワーク（非公開SSID）' },
    fullName: { label: '氏名', placeholder: '山田 太郎' },
    vcardPhone: { label: '電話番号', placeholder: '+81 90-0000-0000' },
    vcardEmail: { label: 'メールアドレス', placeholder: 'name@example.com' },
    org: { label: '会社名・組織名', placeholder: '組織名（任意）' },
    errorCorrection: {
      label: '誤り訂正レベル',
      group: 'オプション',
      options: {
        L: '低 L (7%)',
        M: '中 M (15%)',
        Q: '高めのQ (25%)',
        H: '最高 H (30%)',
      },
    },
  },
  ui: {
    emptyText: '種類と内容を入力するとQRコードを生成します。',
    engine: {
      enterContent: 'エンコードする内容を入力してください。',
      tooMuchTpl: 'データ量が上限を超えています（{bytes}バイト / 訂正レベル{level}の上限{limit}バイト）。文字列を短くするか誤り訂正レベルを下げてください。',
      modulesLabel: 'セル数',
      ecLabel: '誤り訂正',
    },
  },
};
