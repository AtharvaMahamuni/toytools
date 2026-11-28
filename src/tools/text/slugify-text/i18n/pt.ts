import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "slugify-text",
  "name": "Gerador de Slugs URL",
  "seoTitle": "Gerador de Slug URL - Slugify Online",
  "description": "Transforme qualquer título em um slug URL limpo em minúsculas, sem acentos e separado por hífens direto no navegador.",
  "tagline": "Gere slugs de URL limpos, em minúsculas e sem acentos.",
  "knowledge": {
    "primaryConcepts": [
      "slug URL"
    ],
    "realWorldUseCases": [
      "Gerar permalinks limpos para posts e produtos",
      "Criar IDs de âncoras HTML legíveis",
      "Padronizar nomes seguros de pastas e arquivos",
      "Converter listas inteiras de títulos para CMS"
    ],
    "commonMistakes": [
      "Esperar preservação de acentos ou caixa alta",
      "Confundir slugify com kebab-case"
    ]
  },
  "faqs": [
    {
      "id": "slugify-text-faq-1",
      "question": "O que é um slug URL?",
      "answer": "É o trecho final legível de um endereço da web, em minúsculas e separado por hífens."
    },
    {
      "id": "slugify-text-faq-2",
      "question": "Como trata acentos e símbolos?",
      "answer": "Remove acentos para ASCII base (\"Café\" vira \"cafe\"), converte ß em ss e troca espaços ou pontuações por um único hífen."
    },
    {
      "id": "slugify-text-faq-3",
      "question": "Posso gerar vários slugs de uma vez?",
      "answer": "Sim. Cada linha da entrada vira um slug próprio na saída."
    },
    {
      "id": "slugify-text-faq-4",
      "question": "O que torna um slug amigável para SEO?",
      "answer": "Ser curto, minúsculo, com palavras-chave principais ligadas por hífen sem palavras vazias."
    },
    {
      "id": "slugify-text-faq-5",
      "question": "Diferença entre slugify e kebab-case?",
      "answer": "Slugify limpa acentos para deixar seguro em URLs; kebab-case apenas junta palavras mantendo acentos."
    },
    {
      "id": "slugify-text-faq-6",
      "question": "Slug é o mesmo que caminho URL?",
      "answer": "Não: o caminho inclui pastas anteriores, enquanto o slug é só o último bloco."
    },
    {
      "id": "slugify-text-faq-7",
      "question": "Mantém letras com acento como \"ç\" ou \"ã\"?",
      "answer": "Não: converte intencionalmente para ASCII (\"c\", \"a\") evitando códigos %C3% na barra do navegador."
    },
    {
      "id": "slugify-text-faq-8",
      "question": "Por que tudo vira minúsculo?",
      "answer": "Servidores distinguem maiúsculas de minúsculas em rotas; padronizar evita URLs duplicadas."
    },
    {
      "id": "slugify-text-faq-9",
      "question": "É seguro colar rascunhos de títulos?",
      "answer": "Sim. Tudo roda localmente no seu navegador sem enviar dados."
    }
  ],
  "guide": {
    "title": "Como transformar texto em slug URL amigável",
    "description": "Por que slugs limpos ajudam o SEO, remoção automática de acentos e diferença para kebab-case."
  },
  "ui": {
    "placeholder": "Cole um título ou lista de títulos",
    "outputPlaceholder": "Os slugs de URL aparecerão aqui",
    "sampleText": "10 Dicas de Café e Açaí em São Paulo!",
    "handoff": {
      "msgTpl": "{n} linha(s) sem letras latinas nem dígitos resultaram em slug vazio.",
      "siblings": {
        "sentence-case-converter": "Frase Capitalizada",
        "kebab-case-converter": "Kebab Case",
        "trim-text": "Aparar Espaços",
        "lowercase-converter": "Minúsculas"
      }
    }
  }
};
