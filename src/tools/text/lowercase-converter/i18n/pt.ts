import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "lowercase-converter",
  "name": "Conversor de Minúsculas",
  "seoTitle": "Converter Texto em Minúsculas Online",
  "description": "Converta textos inteiros para letras minúsculas na hora direto no navegador, ideal para padronizar e-mails e listas.",
  "tagline": "Converta qualquer texto para letras minúsculas na hora.",
  "knowledge": {
    "primaryConcepts": [
      "minúsculas"
    ],
    "realWorldUseCases": [
      "Padronizar e-mails e usuários antes de salvar",
      "Normalizar tags e palavras-chave sem duplicidade",
      "Preparar comparações sem diferenciar maiúsculas",
      "Corrigir texto digitado com Caps Lock ativo"
    ],
    "commonMistakes": [
      "Achatar nomes próprios ou siglas que precisavam destaque",
      "Converter apenas um dos lados da comparação"
    ]
  },
  "faqs": [
    {
      "id": "lc-faq-1",
      "question": "Como converter texto para minúsculas?",
      "answer": "Cole seu texto à esquerda e o resultado todo em minúsculas aparece imediatamente pronto para copiar."
    },
    {
      "id": "lc-faq-2",
      "question": "Onde letras minúsculas são obrigatórias?",
      "answer": "Em endereços de e-mail, slugs de URL, hashtags e chaves de comparação entre sistemas."
    },
    {
      "id": "lc-faq-3",
      "question": "Como padronizar e-mails antes de salvar?",
      "answer": "Converta toda a lista para minúsculas para evitar contas duplicadas como \"Ana@Site.COM\" e \"ana@site.com\"."
    },
    {
      "id": "lc-faq-4",
      "question": "Padronizar em minúsculas ou maiúsculas?",
      "answer": "Em minúsculas, seguindo o padrão universal da web para URLs, tags e e-mails."
    },
    {
      "id": "lc-faq-5",
      "question": "Por que minha comparação ainda falha depois de converter?",
      "answer": "É preciso converter os dois lados da comparação e remover espaços extras nas pontas."
    },
    {
      "id": "lc-faq-6",
      "question": "Muda números ou símbolos?",
      "answer": "Não. Dígitos, pontuações e emojis permanecem idênticos."
    },
    {
      "id": "lc-faq-7",
      "question": "Por que alguns caracteres não mudaram?",
      "answer": "Escritas sem distinção de caixa (japonês, chinês, árabe) e símbolos não possuem forma minúscula."
    },
    {
      "id": "lc-faq-8",
      "question": "Converter para minúsculas apaga siglas e nomes próprios?",
      "answer": "Sim: \"NASA\" vira \"nasa\". Mantenha o original para leitura humana e use minúsculas apenas em chaves ou slugs."
    },
    {
      "id": "lc-faq-9",
      "question": "Funciona sem internet?",
      "answer": "Sim, após carregar uma vez funciona totalmente offline no navegador."
    }
  ],
  "guide": {
    "title": "Como converter texto para minúsculas",
    "description": "Padronização de e-mails, slugs, tags e cuidados para não apagar siglas importantes."
  },
  "ui": {
    "placeholder": "Cole ou digite o texto aqui",
    "outputPlaceholder": "O resultado em minúsculas aparece aqui",
    "sampleText": "Olá MUNDO, API_HTTP e Contato@Exemplo.COM",
    "handoff": {
      "msgTpl": "{n} sigla(s) perderam as letras maiúsculas ({list}) e não podem ser restauradas aqui."
    }
  }
};
