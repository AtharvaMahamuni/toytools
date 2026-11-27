import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'hi',
  slug: 'html-entity-encoder-decoder',
  name: 'HTML एंटिटी एनकोडर और डिकोडर',
  seoTitle: 'ऑनलाइन HTML एंटिटी एनकोड व डिकोड टूल',
  description:
    'ब्राउज़र में HTML के आरक्षित चिह्नों (`<`, `>`, `&`, `"`) को तुरंत एस्केप करें या `&amp;`, `&#38;` व `&#x26;` को वापस सादे टेक्स्ट में बदलें।',
  tagline: 'ब्राउज़र में HTML एंटिटीज़ को तुरंत एनकोड और डिकोड करें।',
  craft: {
    solves:
      'CMS से पेस्ट की गई एंटिटीज़ अक्सर डबल-एस्केप होती हैं या उनमें अंतिम सेमीकोलन नहीं होता, जिससे असली चिह्न के बजाय & कोड दिखता रहता है।',
  },
  knowledge: {
    primaryConcepts: ['HTML एंटिटीज़'],
    realWorldUseCases: [
      'वेबपेज पर HTML कोड के उदाहरण सुरक्षित दिखाना',
      'XSS से बचने के लिए उपयोगकर्ता के टेक्स्ट को एस्केप करना',
      'कॉपीराइट जैसे प्रतीक और न टूटने वाला स्पेस (`&nbsp;`) डालना',
    ],
    commonMistakes: [
      'उपयोगकर्ता द्वारा दिए टेक्स्ट को बिना एस्केप किए पेज में डालना (XSS जोखिम)',
      'CSS की जगह लेआउट के लिए `&nbsp;` का इस्तेमाल करना',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: 'HTML एंटिटी क्या होती है?',
      answer:
        'यह एक कैरेक्टर संदर्भ है जिससे ऐसे चिह्न दिखाए जाते हैं जिन्हें HTML पार्सर अन्यथा टैग समझ लेता है: `&lt;` ब्राउज़र में टैग खोले बिना `<` दिखाता है।',
    },
    {
      id: 'html-ent-faq-2',
      question: 'HTML में किन चिह्नों को हमेशा एस्केप करना चाहिए?',
      answer:
        'चार मुख्य चिह्न: `<` (`&lt;`), `>` (`&gt;`), `&` (`&amp;`) और एट्रिब्यूट मानों में `"` (`&quot;`)। UTF-8 पेज में बाकी सभी अक्षर वैकल्पिक हैं।',
    },
    {
      id: 'html-ent-faq-3',
      question: 'क्या UTF-8 इस्तेमाल करने पर भी HTML एंटिटी की जरूरत होती है?',
      answer:
        'हां, `<`, `>`, `&` और कोट्स के लिए जरूरत रहती है क्योंकि HTML सिंटैक्स में इनका संरचनात्मक अर्थ होता है।',
    },
    {
      id: 'html-ent-faq-4',
      question: '&amp; और &#38; में क्या अंतर है?',
      answer:
        'दोनों एक ही `&` अक्षर दिखाते हैं: `&amp;` नामित एंटिटी है, `&#38;` दशमलव और `&#x26;` हेक्साडेसिमल संख्यात्मक संदर्भ है।',
    },
    {
      id: 'html-ent-faq-5',
      question: '&nbsp; सामान्य स्पेस से अलग व्यवहार क्यों करता है?',
      answer:
        '`&nbsp;` (non-breaking space) `10&nbsp;kg` जैसे शब्दों के बीच लाइन टूटने से रोकता है और ब्राउज़र द्वारा कई स्पेस मिलाए जाने से बचाता है।',
    },
    {
      id: 'html-ent-faq-6',
      question: 'HTML एनकोडिंग और URL एनकोडिंग में क्या फर्क है?',
      answer:
        'HTML एनकोडिंग मार्कअप सुरक्षा के लिए (`<` → `&lt;`) है और URL एनकोडिंग वेब लिंक ट्रांसपोर्ट के लिए (`<` → `%3C`)।',
    },
    {
      id: 'html-ent-faq-7',
      question: 'यदि उपयोगकर्ता सामग्री में < या > एस्केप करना भूल जाएं तो क्या होगा?',
      answer:
        'ब्राउज़र उसे सक्रिय HTML मानकर `<script>` चला सकता है, जिससे क्रॉस-साइट स्क्रिप्टिंग (XSS) हमला हो सकता है।',
    },
    {
      id: 'html-ent-faq-8',
      question: 'क्या HTML एंटिटी एनकोडिंग XSS को रोकती है?',
      answer:
        'यह सामान्य HTML टेक्स्ट और एट्रिब्यूट में प्रमुख XSS खतरों को रोकती है, पर `<script>`, CSS या `href` URL के लिए अलग नियम जरूरी होते हैं।',
    },
    {
      id: 'html-ent-faq-9',
      question: 'पुराने HTML में &apos; क्यों नहीं चलता था?',
      answer:
        '`&apos;` XML/XHTML से आया था और HTML5 में जुड़ा; पुराने HTML4 पार्सर के लिए `&#39;` उपयोग किया जाता है।',
    },
  ],
  guide: {
    title: 'HTML एंटिटीज़ क्या हैं और XSS से बचाव कैसे करें',
    description:
      'HTML के आरक्षित चिह्न, &amp; बनाम &#38;, &nbsp; का सही उपयोग और क्रॉस-साइट स्क्रिप्टिंग से बचाव।',
    readMinutes: 6,
  },
  ui: {
    displayName: 'HTML एंटिटीज़',
    forwardLabel: 'एनकोड → HTML',
    inverseLabel: 'डिकोड ← HTML',
    outputLabel: 'आउटपुट',
    placeholder: 'यहां टेक्स्ट या &lt;...&gt; एंटिटी पेस्ट करें…',
    outputPlaceholder: 'परिणाम यहां दिखेगा…',
    emptyOutput: 'शुरू करने के लिए टेक्स्ट या HTML एंटिटी दर्ज करें।',
    insight:
      '`<`, `>`, `&` और `"` को HTML एंटिटी में बदलने से ब्राउज़र उपयोगकर्ता टेक्स्ट को HTML टैग या स्क्रिप्ट नहीं मानता।',
    technical: [
      { term: 'मुख्य एंटिटीज़', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: 'स्वीकृत रूप', detail: 'नामित (&copy;), दशमलव (&#169;) और हेक्स (&#xA9;)' },
      { term: 'गोपनीयता', detail: 'कोड बाहर भेजे बिना सीधे ब्राउज़र में रूपांतरण' },
    ],
    compareLabel: 'तुलना करें',
    comparePlaceholder: 'वैकल्पिक अपेक्षित मान',
    modeAriaLabel: 'रूपांतरण मोड',
    inputAriaLabel: 'इनपुट',
    outputAriaLabel: 'परिवर्तित आउटपुट',
    swapLabel: 'बदलें',
    swapAriaLabel: 'इनपुट और आउटपुट बदलें',
    metaAriaLabel: 'रूपांतरण मेटाडेटा',
    byteAriaLabel: 'हेक्स बाइट दर्शक',
    historyTitle: 'हाल का इतिहास',
    historyAriaLabel: 'हाल के इनपुट',
    insightAriaLabel: 'तकनीकी व्याख्या',
    appliedPrefix: 'सुधार लागू:',
    checkInputMsg: 'इनपुट जांचें।',
    invalidInputMsg: 'अमान्य HTML एंटिटी इनपुट।',
    couldNotConvertMsg: 'इनपुट बदला नहीं जा सका।',
    detectedPrefix: 'पहचाना गया:',
    validPrefix: 'मान्य',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'टेक्स्ट',
      'Percent-encoded': 'URL एनकोडेड',
      'HTML entities': 'HTML एंटिटीज़',
      Markup: 'मार्कअप',
    },
    engine: {
      errDecode: 'HTML एंटिटीज़ डिकोड नहीं हो सकीं।',
      errEncode: 'HTML एंटिटीज़ एनकोड नहीं हो सकीं।',
      infoNoEntities: 'डिकोड करने के लिए कोई HTML एंटिटी नहीं मिली।',
      recDoubleEsc: 'संभावित डबल एस्केप (&amp;lt;): एक स्तर और डिकोड करें',
      recMissingSemi: 'छूट रहे सेमीकोलन जोड़ें (जैसे बिना ; वाला &amp)',
      metaEntities: 'एंटिटीज़',
      entCountTpl: '{n} एंटिटीज़',
      metaInputLen: 'इनपुट लंबाई',
      metaOutputBytes: 'आउटपुट बाइट्स',
    },
  },
};
