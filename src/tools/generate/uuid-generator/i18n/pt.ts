import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'uuid-generator',
  name: 'Gerador de UUID',
  seoTitle: 'Gerador de UUID v4 Aleatórios Online',
  description:
    'Gere identificadores únicos UUID versão 4 (GUID) no navegador. Crie de 1 a 100 por vez, alterne hífens e maiúsculas e copie com um clique.',
  tagline: 'UUID versão 4 aleatórios, individuais ou em lote.',
  craft: {
    solves:
      'UUIDs v4 incluem bits fixos de versão (4 bits) e variante RFC 4122 (2 bits) que os diferenciam de UUIDs sequenciais v7 ou nulos.',
  },
  knowledge: {
    primaryConcepts: ['geração de UUID', 'identificadores únicos'],
    realWorldUseCases: [
      'Definir chave primária única para novas linhas no banco de dados',
      'Nomear arquivos e objetos sem risco de conflito',
      'Correlacionar logs entre microsserviços usando request ID',
      'Gerar identificadores offline estáveis antes da sincronização',
    ],
    commonMistakes: [
      'Assumir que um UUID é um segredo criptográfico impossível de adivinhar',
      'Usar UUID como senha ou token de acesso',
      'Guardar UUID como texto longo quando o banco oferece tipo UUID nativo',
      'Esperar que UUID v4 ordene registros por data de criação',
    ],
  },
  fields: {
    count: { label: 'Quantidade' },
    version: { label: 'Versão', options: { v4: 'v4 (aleatório)' } },
    hyphens: { label: 'Incluir hífens', group: 'Formato' },
    uppercase: { label: 'Maiúsculas', group: 'Formato' },
  },
  faqs: [
    {
      id: 'uuid-generator-faq-1',
      question: 'O que é um UUID?',
      answer:
        'Um UUID (Identificador Único Universal) é um valor de 128 bits escrito em 36 caracteres como `f47ac10b-58cc-4372-a567-0e02b2c3d479`, permitindo criar IDs sem coordenação central e com chance desprezível de repetição.',
    },
    {
      id: 'uuid-generator-faq-2',
      question: 'O que significa UUID e GUID é a mesma coisa?',
      answer:
        'UUID significa Universally Unique Identifier e GUID Globally Unique Identifier (termo usado pela Microsoft). Ambos representam exatamente a mesma estrutura de 128 bits.',
    },
    {
      id: 'uuid-generator-faq-3',
      question: 'Qual versão este gerador produz?',
      answer:
        'Versão 4 aleatória conforme a RFC 4122, sem data nem endereço MAC embutidos, sendo o padrão mais seguro e privado.',
    },
    {
      id: 'uuid-generator-faq-4',
      question: 'Como usar este gerador de UUID?',
      answer:
        'Escolha quantos UUIDs deseja, ative ou desative hífens e maiúsculas e clique em Copiar ou Gerar novamente.',
    },
    {
      id: 'uuid-generator-faq-5',
      question: 'Como é o formato de um UUID versão 4?',
      answer:
        'Cinco blocos hexadecimais no padrão 8-4-4-4-12. O 13º dígito é sempre `4` (versão) e o 17º é `8`, `9`, `a` ou `b` (variante RFC 4122).',
    },
    {
      id: 'uuid-generator-faq-6',
      question: 'Os UUIDs têm unicidade garantida?',
      answer:
        'Matematicamente não é impossível, mas 122 bits aleatórios oferecem mais de 5 × 10^36 combinações, tornando colisões desprezíveis na prática.',
    },
    {
      id: 'uuid-generator-faq-7',
      question: 'Este gerador é seguro e privado?',
      answer:
        'Sim. Cada UUID nasce localmente pela Web Crypto API do seu navegador, sem qualquer envio a servidores.',
    },
    {
      id: 'uuid-generator-faq-8',
      question: 'Funciona sem internet?',
      answer:
        'Sim. Após carregar a página, todo o cálculo ocorre em JavaScript local mesmo offline.',
    },
    {
      id: 'uuid-generator-faq-9',
      question: 'Posso gerar vários UUIDs de uma vez?',
      answer:
        'Sim, até 100 por vez listados um por linha, práticos para seeds e massas de teste.',
    },
    {
      id: 'uuid-generator-faq-10',
      question: 'Como copio todos os UUIDs gerados?',
      answer:
        'Clique em Copiar para levar toda a lista à área de transferência mantendo um UUID por linha.',
    },
    {
      id: 'uuid-generator-faq-11',
      question: 'Posso remover os hífens?',
      answer:
        'Sim. Desmarque hífens para receber uma string hexadecimal compacta de 32 caracteres com o mesmo valor.',
    },
    {
      id: 'uuid-generator-faq-12',
      question: 'Posso gerar UUIDs em maiúsculas?',
      answer:
        'Sim. Ative Maiúsculas para exibir `A-F` em vez de `a-f`.',
    },
    {
      id: 'uuid-generator-faq-13',
      question: 'Quando usar UUID em vez de ID sequencial?',
      answer:
        'Quando múltiplos clientes, microsserviços ou apps offline precisam gerar IDs antes de sincronizar com o banco central.',
    },
    {
      id: 'uuid-generator-faq-14',
      question: 'Qual a diferença entre UUID v4 e v1?',
      answer:
        'A versão 1 embute carimbo de hora e endereço MAC da máquina; a versão 4 é aleatória e não expõe dados da origem.',
    },
    {
      id: 'uuid-generator-faq-15',
      question: 'Posso usar UUID como senha ou token secreto?',
      answer:
        'Não é o ideal por ter bits fixos e aparecer com frequência em URLs e logs. Prefira o Gerador de Senhas.',
    },
    {
      id: 'uuid-generator-faq-16',
      question: 'UUIDs v4 ordenam na sequência de criação?',
      answer:
        'Não. Por serem aleatórios, não mantêm ordem temporal; use uma coluna de timestamp separada se precisar ordenar.',
    },
    {
      id: 'uuid-generator-faq-17',
      question: 'UUIDs são secretos ou difíceis de adivinhar?',
      answer:
        'São difíceis de enumerar, mas não devem ser tratados como segredo de acesso por serem visíveis em rotas e logs.',
    },
    {
      id: 'uuid-generator-faq-18',
      question: 'Como armazenar UUID no banco de dados?',
      answer:
        'Use o tipo nativo `UUID` (16 bytes) quando suportado em vez de texto de 36 caracteres.',
    },
    {
      id: 'uuid-generator-faq-19',
      question: 'Por que o banco de dados rejeitou o UUID?',
      answer:
        'Geralmente por retirar os hífens diante de uma coluna estrita ou por divergência entre maiúsculas e minúsculas.',
    },
    {
      id: 'uuid-generator-faq-20',
      question: 'Em quais navegadores funciona?',
      answer:
        'Em todos os navegadores modernos de desktop e celular compatíveis com a Web Crypto API.',
    },
    {
      id: 'uuid-generator-faq-21',
      question: 'A ferramenta guarda os UUIDs gerados?',
      answer:
        'Não. Apenas suas preferências de quantidade e formato ficam salvas localmente.',
    },
    {
      id: 'uuid-generator-faq-22',
      question: 'Algum dado é enviado ou compartilhado?',
      answer:
        'Não. Sem conta, sem servidor e sem rastreamento dos valores gerados.',
    },
  ],
  guide: {
    title: 'O que é UUID v4 e quando usar na prática',
    description:
      'Estrutura 8-4-4-4-12 RFC 4122, diferença entre v4 e v1, armazenamento em 16 bytes e boas práticas de segurança.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Ajuste as opções para gerar UUIDs.',
    engine: {
      metaVersion: 'Versão',
      versionV4: 'v4 (aleatório)',
      metaCount: 'Quantidade',
    },
  },
};
