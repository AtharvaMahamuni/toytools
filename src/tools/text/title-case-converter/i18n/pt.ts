import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "pt",
  "slug": "title-case-converter",
  "name": "Conversor Título (Title Case)",
  "seoTitle": "Converter Texto para Title Case Online",
  "description": "Coloque a primeira letra de cada palavra em maiúscula instantaneamente direto no navegador, ideal para títulos e cabeçalhos.",
  "tagline": "Primeira letra de cada palavra em maiúscula.",
  "knowledge": {
    "primaryConcepts": [
      "title case"
    ],
    "realWorldUseCases": [
      "Formatar títulos de artigos e apresentações",
      "Padronizar nomes de livros, músicas e cursos",
      "Alinhar menus e subtítulos",
      "Corrigir títulos colados em caixa baixa"
    ],
    "commonMistakes": [
      "Usar inicial maiúscula em parágrafos inteiros",
      "Esquecer que preposições curtas costumam ficar minúsculas em guias editoriais"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "O que é Title Case?",
      "answer": "Capitaliza a primeira letra de todas as palavras (\"The Quick Brown Fox\"), comum em títulos em inglês e cabeçalhos."
    },
    {
      "id": "tc-faq-2",
      "question": "Quais palavras capitalizar em um título?",
      "answer": "A ferramenta capitaliza todas as palavras como base prática; guias em inglês costumam deixar artigos e preposições curtas em minúsculas no meio do título."
    },
    {
      "id": "tc-faq-3",
      "question": "Diferença entre Title Case e Sentence Case?",
      "answer": "Sentence case só capitaliza a primeira palavra da frase; Title Case capitaliza todas."
    },
    {
      "id": "tc-faq-4",
      "question": "Posso usar em parágrafos normais?",
      "answer": "Não é recomendado, pois prejudica a fluidez de textos corridos."
    },
    {
      "id": "tc-faq-5",
      "question": "Altera números ou pontuação?",
      "answer": "Não, apenas a inicial de cada palavra."
    },
    {
      "id": "tc-faq-6",
      "question": "Como converter uma manchete?",
      "answer": "Cole o texto e copie o resultado na hora."
    },
    {
      "id": "tc-faq-7",
      "question": "Devo capitalizar \"of\" ou \"the\" no meio do título?",
      "answer": "Nos padrões ingleses AP e Chicago, eles permanecem minúsculos no meio do título."
    },
    {
      "id": "tc-faq-8",
      "question": "Por que a ferramenta capitalizou palavras curtas?",
      "answer": "Porque aplica uma regra uniforme palavra a palavra e avisa quantas preposições ou artigos curtos foram detectados."
    },
    {
      "id": "tc-faq-9",
      "question": "Como trata palavras com hífen?",
      "answer": "Cada parte ligada por hífen recebe inicial maiúscula (\"Well-Known\")."
    }
  ],
  "guide": {
    "title": "Como formatar títulos em Title Case",
    "description": "Quando usar Title Case versus frase normal, palavras menores no inglês e compostos com hífen."
  },
  "ui": {
    "placeholder": "Cole seu título ou texto aqui",
    "outputPlaceholder": "O texto em Title Case aparece aqui",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "{n} palavra(s) curta(s) também receberam maiúscula inicial, que manuais como Chicago e AP mantêm em minúsculas.",
      "siblings": {
        "sentence-case-converter": "Frase Capitalizada",
        "kebab-case-converter": "Kebab Case",
        "trim-text": "Aparar Espaços",
        "lowercase-converter": "Minúsculas"
      }
    }
  }
};
