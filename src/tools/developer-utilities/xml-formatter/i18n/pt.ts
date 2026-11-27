import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'xml-formatter',
  name: 'Formatador e Validador XML',
  seoTitle: 'Formatador e Validador XML Online Grátis',
  description:
    'Formate ou minifique XML online e encontre o primeiro erro de estrutura com número da linha direto no navegador. Privado e sem envio.',
  tagline: 'Indente ou minifique XML e identifique erros de estrutura na hora.',
  citation: {
    problem: 'Use este Formatador e Validador XML para organizar um documento XML ou checar se está bem formado sem fazer upload.',
    nonGoal: 'validar contra esquemas externos XSD, DTD ou Schematron.',
  },
  knowledge: {
    primaryConcepts: ['formatação XML', 'validador XML'],
    realWorldUseCases: [
      'Organizar respostas SOAP ou feeds RSS recebidos em uma linha',
      'Checar se um arquivo de configuração XML está bem formado antes do deploy',
      'Minificar XML para reduzir o tamanho da carga útil',
    ],
    commonMistakes: [
      'Esperar validação de esquema XSD em uma checagem de boa formação',
      'Esquecer que tags XML diferenciam maiúsculas de minúsculas ao contrário do HTML',
    ],
  },
  faqs: [
    {
      id: 'xml-fmt-1',
      question: 'O que o Formatador XML altera?',
      answer:
        'Apenas o layout quando o documento está bem formado. No modo legível aplica recuo de dois espaços e quebras por elemento; em Minificar remove espaços em branco desnecessários. Nomes, atributos, comentários e CDATA não mudam.',
    },
    {
      id: 'xml-fmt-2',
      question: 'O que significa validar XML aqui?',
      answer:
        'Verifica boa formação sintática: um único elemento raiz, tags de abertura e fechamento correspondentes e nomes válidos. Não valida esquemas XSD, DTD nem Schematron.',
    },
    {
      id: 'xml-fmt-3',
      question: 'Por que XML diferencia maiúsculas de minúsculas?',
      answer:
        'Em XML `<Livro>` e `<livro>` são tags diferentes. Se o fechamento divergir na capitalização, o parser acusa documento mal formado em vez de adivinhar.',
    },
    {
      id: 'xml-fmt-4',
      question: 'Como os namespaces XML são tratados?',
      answer:
        'Prefixos vinculados via `xmlns` permanecem exatamente como escritos. A ferramenta nunca busca DTDs ou esquemas externos na internet.',
    },
    {
      id: 'xml-fmt-5',
      question: 'Meu XML é enviado para algum servidor?',
      answer:
        'Não. A leitura via DOMParser e a formatação rodam localmente no seu navegador.',
    },
    {
      id: 'xml-fmt-6',
      question: 'De onde vem o número da linha do erro?',
      answer:
        'Diretamente da mensagem do DOMParser nativo do navegador quando ela inclui linha e coluna.',
    },
    {
      id: 'xml-fmt-7',
      question: 'Também posso minificar XML além de formatar?',
      answer:
        'Sim. Escolha Minificar no seletor de modo para remover espaços supérfluos entre tags e enxugar o tamanho.',
    },
    {
      id: 'xml-fmt-8',
      question: 'Formatar muda o significado do XML?',
      answer:
        'Não para elementos e atributos. Apenas nós de texto compostos só por espaços entre elementos são normalizados ao indentar.',
    },
  ],
  guide: {
    title: 'Formatador XML: idente e valide sem fazer upload',
    description: 'Como funciona a formatação XML no navegador, sensibilidade a maiúsculas e preservação de namespaces.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada XML',
    placeholder: 'Cole seu XML aqui',
    emptyOutput: 'Cole um XML à esquerda para formatar ou minificar.',
    validLabel: 'XML válido',
    invalidLabel: 'XML inválido',
    loadError: 'Não foi possível carregar o processador XML.',
    modePretty: 'Identado',
    modeMinify: 'Minificar',
    modeAriaLabel: 'Modo',
    toolNote: 'O primeiro erro estrutural exibe o número da linha quando informado pelo navegador.',
    insight:
      'Indenta XML bem formado para leitura e verifica a estrutura com o DOMParser local do navegador sem enviar nada fora da aba.',
    technical: [
      { term: 'Operação', detail: 'Lê via DOMParser e serializa com 2 espaços ou minifica' },
      { term: 'Validação', detail: 'Boa formação: tags pareadas, raiz única, nomes válidos' },
      { term: 'Não verifica', detail: 'Esquemas DTD, XSD ou Schematron' },
      { term: 'Preservado', detail: 'Elementos, atributos, texto, comentários e CDATA' },
      { term: 'Privacidade', detail: 'Roda exclusivamente no seu navegador' },
    ],
    engine: {
      errNoParser: 'Análise XML indisponível neste ambiente.',
      whereLineColTpl: ' (linha {line}, coluna {col})',
      whereLineTpl: ' (linha {line})',
      errMalformed: 'XML mal formado',
      errNoRoot: 'XML mal formado: sem elemento raiz.',
    },
  },
};
