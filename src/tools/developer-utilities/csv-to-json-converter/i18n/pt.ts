import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de CSV para JSON",
  "seoTitle": "Conversor CSV para JSON - Ferramenta Online Grátis",
  "description": "Converta CSV em array JSON de objetos para APIs e bancos de dados. Com detecção de tipos, delimitadores e padrão RFC 4180.",
  "tagline": "Transforme CSV em array JSON de objetos com detecção de tipos.",
  "lead": "Converta tabelas CSV ou TSV em arrays JSON prontos para APIs e JavaScript direto no navegador, preservando zeros à esquerda.",
  "guide": {
    "title": "Conversor de CSV para JSON: guia completo",
    "description": "Entenda como funciona a conversão de CSV para JSON, como tipos e aspas RFC 4180 são tratados e evite erros comuns."
  },
  "ui": {
    "inputLabel": "Entrada CSV",
    "placeholder": "Cole o CSV aqui",
    "craftNote": "Zeros à esquerda e inteiros grandes em colunas CSV são preservados com segurança na serialização JSON.",
    "moreAboutHeading": "Como funciona o Conversor CSV para JSON",
    "insight": "Converte linhas CSV em um array de objetos JSON usando a primeira linha de cabeçalho como chaves. Útil para transformar planilhas em dados de API.",
    "technical": [
      {
        "term": "Cabeçalho",
        "detail": "A primeira linha define as chaves dos objetos"
      },
      {
        "term": "Saída",
        "detail": "Um array de objetos, um por linha de dados"
      },
      {
        "term": "Valores",
        "detail": "Mantidos como texto salvo números, booleanos ou null claros"
      }
    ],
    "errInvalidCsv": "CSV inválido.",
    "errNoHeaders": "Nenhuma linha de cabeçalho encontrada: a primeira linha deve trazer os nomes das colunas.",
    "errNoRows": "Nenhuma linha de dados encontrada: adicione ao menos uma linha abaixo do cabeçalho."
  },
  "knowledge": {
    "summary": "Converte CSV em um array JSON de objetos para APIs e JavaScript com detecção de tipos, delimitadores e regras RFC 4180.",
    "useCases": [
      "Transformar exportações de planilhas em arrays JSON para apps web",
      "Converter dumps CSV de bancos em payloads JSON para APIs",
      "Gerar dados fictícios em JavaScript a partir de CSV",
      "Preparar relatórios tabulares para gráficos em JSON",
      "Carregar arquivos TSV em fluxos baseados em JSON"
    ],
    "mistakes": [
      "Esquecer a linha de cabeçalho com os nomes das colunas",
      "Esperar que códigos com zeros iniciais virem números sem perda",
      "Escolher o delimitador errado em arquivos com ponto e vírgula ou tab",
      "Não colocar entre aspas campos que contêm o delimitador"
    ]
  },
  "faqs": [
    {
      "id": "c2j-faq-1",
      "question": "Qual formato de CSV o conversor espera?",
      "answer": "Espera uma primeira linha de cabeçalho com os nomes das colunas e uma linha por registro abaixo. Cada cabeçalho vira chave nos objetos do array JSON."
    },
    {
      "id": "c2j-faq-2",
      "question": "Como funciona a detecção de tipos?",
      "answer": "Valores numéricos, true/false e null são convertidos para tipos nativos JSON, enquanto todo o restante permanece como string."
    },
    {
      "id": "c2j-faq-3",
      "question": "Por que um valor como 007 fica como string?",
      "answer": "CEPs, códigos de produto e ramais com zeros à esquerda perderiam os zeros se fossem convertidos para número. Por segurança, ficam como texto."
    },
    {
      "id": "c2j-faq-4",
      "question": "Como vírgulas e aspas dentro de um campo são tratadas?",
      "answer": "Seguindo a RFC 4180: um campo entre aspas duplas pode conter vírgulas, quebras de linha e aspas escapadas como \"\" sem quebrar colunas."
    },
    {
      "id": "c2j-faq-5",
      "question": "Posso usar um delimitador diferente de vírgula?",
      "answer": "Sim. É possível alternar entre vírgula, ponto e vírgula, tabulação (TSV) e barra vertical conforme o padrão da sua planilha."
    },
    {
      "id": "c2j-faq-6",
      "question": "O que acontece se uma linha tiver menos valores que o cabeçalho?",
      "answer": "As células faltantes no final são preenchidas com string vazia para manter todos os objetos do array uniformes."
    },
    {
      "id": "c2j-faq-7",
      "question": "Posso converter o JSON gerado de volta para CSV?",
      "answer": "Sim. Basta abrir o Conversor de JSON para CSV na barra superior para realizar o caminho inverso."
    },
    {
      "id": "c2j-faq-8",
      "question": "Minhas planilhas CSV são enviadas para algum servidor?",
      "answer": "Não. Toda a leitura e geração JSON roda localmente no seu navegador sem enviar dados pela rede."
    }
  ]
};
