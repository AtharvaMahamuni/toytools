import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de YAML para JSON",
  "seoTitle": "Conversor YAML para JSON - Validar e Exportar Online",
  "description": "Converta YAML para JSON válido na hora para APIs e JSON Schema. Expande âncoras e datas ISO com privacidade no navegador.",
  "tagline": "Converta arquivos YAML em JSON válido direto no navegador.",
  "lead": "Transforme manifestos Kubernetes e arquivos YAML em JSON padrão localmente, resolvendo aliases e datas ISO sem erros.",
  "guide": {
    "title": "Conversor de YAML para JSON: guia completo",
    "description": "Entenda como comentários, âncoras, aliases e datas do YAML são convertidos para JSON e como evitar erros de indentação."
  },
  "ui": {
    "inputLabel": "Entrada YAML",
    "placeholder": "Cole o YAML aqui",
    "craftNote": "YAML não permite tabulações para indentação; dois espaços por nível é o padrão entre os parsers.",
    "moreAboutHeading": "Como funciona o Conversor YAML para JSON",
    "insight": "Converte configurações YAML em JSON para APIs e ferramentas que exigem JSON. A indentação vira aninhamento de objetos e arrays.",
    "technical": [
      {
        "term": "Operação",
        "detail": "Lê o YAML e serializa em JSON estrito"
      },
      {
        "term": "Uso",
        "detail": "Alimentar APIs e validadores JSON"
      },
      {
        "term": "Indentação",
        "detail": "Aninhamento YAML vira objetos e arrays JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Converte YAML para JSON em APIs e JSON Schema, expandindo âncoras e convertendo datas para strings ISO.",
    "useCases": [
      "Converter manifesto Kubernetes YAML para ferramenta JSON",
      "Validar configuração YAML contra um JSON Schema",
      "Enviar ajustes em YAML para um endpoint REST JSON",
      "Ler YAML em ambiente sem biblioteca nativa YAML",
      "Importar registros em bancos orientados a JSON"
    ],
    "mistakes": [
      "Usar caractere Tab em vez de espaços no YAML",
      "Esperar que comentários # continuem no JSON final",
      "Supor que datas virem tipo nativo de data no JSON",
      "Deixar caracteres especiais como dois-pontos sem aspas"
    ]
  },
  "faqs": [
    {
      "id": "y2j-faq-1",
      "question": "Por que converter YAML para JSON?",
      "answer": "JSON é o formato padrão de APIs web e validadores JSON Schema. A conversão preserva toda a hierarquia compartilhada sem perda."
    },
    {
      "id": "y2j-faq-2",
      "question": "O YAML é um superconjunto do JSON?",
      "answer": "Sim. Desde o YAML 1.2 todo JSON válido é YAML válido, mas recursos extras como comentários e âncoras são removidos ou expandidos rumo ao JSON."
    },
    {
      "id": "y2j-faq-3",
      "question": "O que acontece com comentários # no YAML?",
      "answer": "São descartados porque a especificação JSON não admite comentários. Apenas chaves, valores e estrutura seguem para o JSON."
    },
    {
      "id": "y2j-faq-4",
      "question": "Como âncoras e aliases do YAML são tratados?",
      "answer": "Âncoras (&nome) e aliases (*nome) são expandidos copiando o bloco inteiro no ponto de uso para manter o JSON autossuficiente."
    },
    {
      "id": "y2j-faq-5",
      "question": "Como datas e timestamps do YAML ficam no JSON?",
      "answer": "Como JSON não possui tipo de data nativo, datas do YAML são serializadas como strings ISO 8601 sem perda."
    },
    {
      "id": "y2j-faq-6",
      "question": "Por que meu YAML falhou ao converter?",
      "answer": "A causa principal é indentação com Tab ou espaçamento irregular, além de caracteres especiais não colocados entre aspas."
    },
    {
      "id": "y2j-faq-7",
      "question": "Posso converter o JSON de volta para YAML?",
      "answer": "Sim. Acesse o Conversor JSON para YAML na barra superior para alternar entre os formatos instantaneamente."
    },
    {
      "id": "y2j-faq-8",
      "question": "Meus arquivos YAML continuam privados?",
      "answer": "Sim. Todo o parsing e a conversão ocorrem no seu navegador, sem enviar nada para servidores."
    }
  ]
};
