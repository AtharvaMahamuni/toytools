import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'hi',
  slug: 'url-encoder-decoder',
  name: 'URL एनकोडर और डिकोडर',
  seoTitle: 'ऑनलाइन URL एनकोड और डिकोड (Percent-Encoding) टूल',
  description:
    'ब्राउज़र में URL पैरामीटर और हिस्सों (`encodeURIComponent`) को तुरंत एनकोड या डिकोड करें। %20 बनाम + और डबल-एनकोडिंग सुधार के साथ।',
  tagline: 'तुरंत ब्राउज़र में %XX के साथ URL भागों को एनकोड और डिकोड करें।',
  craft: {
    solves:
      'डबल-एनकोड मान (%2520), फॉर्म वाला "+" या भटका हुआ "%" अक्सर डिकोडिंग को रोक देते हैं, जिससे इनपुट की बजाय टूल खराब होने का भ्रम होता है।',
  },
  knowledge: {
    primaryConcepts: ['URL एनकोडिंग'],
    realWorldUseCases: [
      'क्वेरी स्ट्रिंग में खोज शब्दों या हिंदी टेक्स्ट को सुरक्षित बदलना',
      'URL पैरामीटर के रूप में ईमेल पता या OAuth रीडायरेक्ट लिंक भेजना',
      'स्पेस या विशेष चिह्नों वाले फाइल पथ को सही लिंक में बदलना',
    ],
    commonMistakes: [
      'अलग-अलग पैरामीटर के बजाय पूरे URL को एक साथ एनकोड कर देना',
      'पहले से एनकोड मान को दोबारा एनकोड करके %2520 बना देना',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: 'URL एनकोडिंग (percent-encoding) क्या करती है?',
      answer:
        'यह URL में असुरक्षित या आरक्षित अक्षरों को `%` और दो हेक्साडेसिमल अंकों (UTF-8 बाइट मान, जैसे स्पेस के लिए `%20`, `&` के लिए `%26`) में बदलती है ताकि लिंक टूटे नहीं।',
    },
    {
      id: 'url-enc-faq-2',
      question: 'स्पेस के लिए %20 और + में क्या अंतर है?',
      answer:
        '`%20` मानक URI पथ और क्वेरी के लिए RFC 3986 नियम है। `+` केवल HTML फॉर्म (`application/x-www-form-urlencoded`) डेटा में स्पेस दर्शाता है; अन्यत्र यह वास्तविक जोड़ चिह्न माना जाता है।',
    },
    {
      id: 'url-enc-faq-3',
      question: 'encodeURIComponent बनाम encodeURI कब उपयोग करें?',
      answer:
        'अलग-अलग क्वेरी मानों या पथ खंडों के लिए `encodeURIComponent` चुनें ताकि `&`, `=`, `/` या `?` सुरक्षित हों। `encodeURI` केवल तब उपयोग करें जब पूरा URL ज्यों का त्यों रखना हो।',
    },
    {
      id: 'url-enc-faq-4',
      question: 'किन अक्षरों को प्रतिशत-एनकोड करना जरूरी है?',
      answer:
        'स्पेस, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, देवनागरी/गैर-ASCII अक्षर व इमोजी; तथा डेटा के रूप में आने वाले `&`, `=`, `/`, `?`, `#` चिह्न।',
    },
    {
      id: 'url-enc-faq-5',
      question: 'डबल एनकोडिंग क्या है और इससे कैसे बचें?',
      answer:
        'पहले से एनकोड स्ट्रिंग को दोबारा एनकोड करने पर `%20` बदलकर `%2520` बन जाता है। हमेशा URL जोड़ने से ठीक पहले मूल टेक्स्ट को केवल एक बार एनकोड करें।',
    },
    {
      id: 'url-enc-faq-6',
      question: 'क्या URL एनकोडिंग पथ (path) और क्वेरी दोनों पर लागू होती है?',
      answer:
        'हां। `/my%20folder/file.txt` जैसे पथ खंड और `?name=Asha%20Rao` जैसे क्वेरी पैरामीटर दोनों को सही एस्केपिंग की जरूरत होती है।',
    },
    {
      id: 'url-enc-faq-7',
      question: 'क्या URL एनकोडिंग, URL एस्केपिंग और percent-encoding एक ही हैं?',
      answer:
        'हां, तीनों एक ही प्रक्रिया के अलग-अलग नाम हैं। RFC 3986 में इसे percent-encoding कहा जाता है।',
    },
    {
      id: 'url-enc-faq-8',
      question: 'क्वेरी पैरामीटर एनकोड करना भूल जाएं तो क्या होता है?',
      answer:
        'बिना एस्केप वाला `&` पैरामीटर को दो हिस्सों में तोड़ देता है और `#` के बाद का सारा हिस्सा सर्वर तक पहुंचने से पहले ही ब्राउज़र में कट जाता है।',
    },
    {
      id: 'url-enc-faq-9',
      question: 'यह टूल एनकोड और डिकोड कैसे करता है?',
      answer:
        'यह आपके ब्राउज़र में सीधे UTF-8 पर मानक `encodeURIComponent` और `decodeURIComponent` चलाता है, जो क्वेरी और पथ के लिए सटीक है।',
    },
  ],
  guide: {
    title: 'URL एनकोडिंग क्या है: %20 बनाम + और डबल एनकोडिंग',
    description:
      'RFC 3986 percent-encoding, encodeURI बनाम encodeURIComponent का फर्क और %2520 जैसी गलतियों से बचाव।',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'एनकोड → URL',
    inverseLabel: 'डिकोड ← URL',
    outputLabel: 'आउटपुट',
    placeholder: 'यहां टेक्स्ट या %XX स्ट्रिंग पेस्ट करें…',
    outputPlaceholder: 'परिणाम यहां दिखेगा…',
    emptyOutput: 'शुरू करने के लिए टेक्स्ट या एनकोड किया गया URL दर्ज करें।',
    insight:
      'Percent-encoding आरक्षित और गैर-ASCII अक्षरों को UTF-8 के %XX रूप (`encodeURIComponent`) में बदलती है ताकि &, = या ? URL की संरचना न तोड़ें।',
    technical: [
      { term: 'पद्धति', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: 'स्पेस नियम', detail: 'मानक URI में %20; x-www-form-urlencoded फॉर्म में +' },
      { term: 'गोपनीयता', detail: 'सर्वर पर भेजे बिना 100% स्थानीय ब्राउज़र प्रोसेसिंग' },
    ],
    compareLabel: 'तुलना करें',
    comparePlaceholder: 'वैकल्पिक अपेक्षित मान',
    modeAriaLabel: 'रूपांतरण मोड',
    inputAriaLabel: 'इनपुट',
    outputAriaLabel: 'परिवर्तित आउटपुट',
    swapLabel: 'बदलें',
    swapAriaLabel: 'इनपुट और आउटपुट आपस में बदलें',
    metaAriaLabel: 'रूपांतरण मेटाडेटा',
    byteAriaLabel: 'हेक्स बाइट दर्शक',
    historyTitle: 'हाल का इतिहास',
    historyAriaLabel: 'हाल के इनपुट',
    insightAriaLabel: 'तकनीकी जानकारी',
    appliedPrefix: 'सुधार लागू:',
    checkInputMsg: 'इनपुट जांचें: इसमें गलत % क्रम मौजूद है।',
    invalidInputMsg: 'अमान्य percent-encoded इनपुट।',
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
      errDecode: 'URL स्ट्रिंग को डिकोड नहीं किया जा सका।',
      errEncode: 'URL घटक के रूप में एनकोड नहीं हो सका।',
      errInvalidPctTpl: 'स्थिति {pos} के पास अधूरा या अमान्य % क्रम है।',
      recDouble: 'संभावित डबल एनकोडिंग (%25XX): एक स्तर और डिकोड करें',
      recStrayPct: 'डिकोड से पहले अकेले % को %25 में बदलें',
      recPlus: '+ को स्पेस से बदलें (x-www-form-urlencoded)',
      metaEscapes: '%XX अनुक्रम',
      escCountTpl: '{n} अनुक्रम',
      metaInputLen: 'इनपुट लंबाई',
      metaOutputBytes: 'आउटपुट बाइट्स',
    },
  },
};
