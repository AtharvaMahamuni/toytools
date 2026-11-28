import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "uppercase-converter",
  "name": "Conversor de Maiúsculas",
  "seoTitle": "Converter Texto em Maiúsculas Online",
  "description": "Converta qualquer texto para LETRAS MAIÚSCULAS em um clique e copie na hora direto no navegador, com total privacidade.",
  "tagline": "Transforme qualquer texto em MAIÚSCULAS instantaneamente.",
  "knowledge": {
    "primaryConcepts": [
      "converter para maiúsculas"
    ],
    "realWorldUseCases": [
      "Padronizar títulos e rótulos em caixa alta",
      "Escrever constantes de programação como MAX_SIZE",
      "Unificar siglas coladas em formato misto",
      "Destacar avisos curtos"
    ],
    "commonMistakes": [
      "Usar caixa alta em parágrafos longos reduzindo a leitura",
      "Depender de CSS text-transform quando o dado salvo precisa estar em maiúsculas"
    ]
  },
  "faqs": [
    {
      "id": "uc-faq-1",
      "question": "Como converter texto para maiúsculas?",
      "answer": "Cole ou digite à esquerda e a versão em MAIÚSCULAS surge na hora pronta para copiar."
    },
    {
      "id": "uc-faq-2",
      "question": "Números ou pontuações mudam?",
      "answer": "Não. Apenas letras são alteradas; números, espaços e sinais permanecem iguais."
    },
    {
      "id": "uc-faq-3",
      "question": "Por que um texto visível em maiúsculas cola em minúsculas?",
      "answer": "Páginas web usam CSS text-transform apenas no visual; o texto salvo no HTML continua original até você convertê-lo aqui."
    },
    {
      "id": "uc-faq-4",
      "question": "O texto é enviado para algum servidor?",
      "answer": "Não. Tudo roda localmente no seu navegador."
    },
    {
      "id": "uc-faq-5",
      "question": "Quando usar texto todo em maiúsculas?",
      "answer": "Em siglas, constantes de programação, etiquetas curtas ou destaques pontuais, evitando parágrafos longos."
    },
    {
      "id": "uc-faq-6",
      "question": "CSS text-transform ou converter o texto?",
      "answer": "Use CSS apenas para estilo visual; converta o texto real quando o valor salvo ou exportado precisar ficar em maiúsculas."
    },
    {
      "id": "uc-faq-7",
      "question": "A regra funciona igual em todo idioma?",
      "answer": "Aplica o padrão Unicode universal (por exemplo, ß alemão vira SS)."
    },
    {
      "id": "uc-faq-8",
      "question": "Por que letras com acento mantêm o acento?",
      "answer": "No padrão Unicode correto, \"é\" vira \"É\" (\"café\" vira \"CAFÉ\")."
    }
  ],
  "guide": {
    "title": "Como converter texto para maiúsculas",
    "description": "Quando usar caixa alta, preservação de acentos em Unicode e diferença para CSS text-transform."
  },
  "ui": {
    "placeholder": "Cole ou digite o texto aqui",
    "outputPlaceholder": "O resultado em maiúsculas aparece aqui",
    "sampleText": "Bancos fúteis pagavam-lhe queijo, whisky e xadrez"
  }
};
