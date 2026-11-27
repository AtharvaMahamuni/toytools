import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'html-entity-encoder-decoder',
  name: 'Codificador e Decodificador de Entidades HTML',
  seoTitle: 'Codificar e Decodificar Entidades HTML Online',
  description:
    'Escape caracteres reservados (`<`, `>`, `&`, `"`) em entidades HTML ou decodifique `&amp;`, `&#38;` e `&#x26;` para texto puro no navegador.',
  tagline: 'Codifique e decodifique entidades HTML no próprio navegador.',
  craft: {
    solves:
      'Entidades copiadas de CMS costumam chegar com escape duplo ou sem ponto e vírgula final, exibindo códigos literais em vez do caractere.',
  },
  knowledge: {
    primaryConcepts: ['entidades HTML'],
    realWorldUseCases: [
      'Exibir trechos de código HTML como exemplo em páginas web',
      'Escapar entradas de usuários para evitar vulnerabilidades XSS',
      'Inserir símbolos tipográficos e espaços inquebráveis (`&nbsp;`)',
    ],
    commonMistakes: [
      'Esquecer de escapar entradas de usuários antes de renderizar (risco de XSS)',
      'Usar vários `&nbsp;` para espaçamento visual em vez de CSS',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: 'O que é uma entidade HTML?',
      answer:
        'Uma referência de caractere que exibe símbolos sem que o navegador os interprete como tags: `&lt;` renderiza `<` em texto comum.',
    },
    {
      id: 'html-ent-faq-2',
      question: 'Quais caracteres precisam ser escapados sempre em HTML?',
      answer:
        'Os quatro caracteres estruturais: `<` (`&lt;`), `>` (`&gt;`), `&` (`&amp;`) e `"` em atributos (`&quot;`). Em UTF-8, o restante é opcional.',
    },
    {
      id: 'html-ent-faq-3',
      question: 'Ainda preciso de entidades HTML se a página usa UTF-8?',
      answer:
        'Sim para `<`, `>`, `&` e aspas em atributos, pois o motivo é sintático (evitar interpretação como tag), e não limitação de alfabeto.',
    },
    {
      id: 'html-ent-faq-4',
      question: 'Qual a diferença entre &amp; e &#38;?',
      answer:
        'Representam o mesmo `&`. `&amp;` é a referência nomeada; `&#38;` é a decimal e `&#x26;` é a hexadecimal.',
    },
    {
      id: 'html-ent-faq-5',
      question: 'Por que &nbsp; age diferente de um espaço normal?',
      answer:
        'Um espaço sem quebra (`&nbsp;`) evita quebra de linha no meio de valores (`10&nbsp;kg`) e não é colapsado pelo navegador.',
    },
    {
      id: 'html-ent-faq-6',
      question: 'Qual a diferença entre codificação HTML e codificação URL?',
      answer:
        'HTML protege marcação (`<` vira `&lt;`), enquanto URL protege endereços HTTP (`<` vira `%3C`).',
    },
    {
      id: 'html-ent-faq-7',
      question: 'O que acontece se eu esquecer de escapar < ou >?',
      answer:
        'O navegador interpreta como HTML ativo e pode executar tags `<script>` maliciosas via `innerHTML` (ataque XSS).',
    },
    {
      id: 'html-ent-faq-8',
      question: 'Codificar entidades HTML impede XSS?',
      answer:
        'Bloqueia vetores comuns em texto e atributos HTML, mas blocos `<script>`, estilos CSS e atributos `href` exigem regras específicas do contexto.',
    },
    {
      id: 'html-ent-faq-9',
      question: 'Por que &apos; falhava em HTML antigo?',
      answer:
        '`&apos;` veio do XML/XHTML e só entrou no HTML no HTML5; para compatibilidade total em HTML4 usa-se `&#39;`.',
    },
  ],
  guide: {
    title: 'Entidades HTML: o que escapar e evitar XSS',
    description:
      'Os caracteres reservados no HTML, diferença entre &amp; e &#38;, &nbsp; e segurança contra injeção de script.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'Entidades HTML',
    forwardLabel: 'Codificar → HTML',
    inverseLabel: 'Decodificar ← HTML',
    outputLabel: 'Saída',
    placeholder: 'Digite ou cole texto ou entidades (&lt;...&gt;) aqui…',
    outputPlaceholder: 'O resultado aparecerá aqui…',
    emptyOutput: 'Digite texto ou entidades HTML para começar.',
    insight:
      'Escapar `<`, `>`, `&` e `"` em entidades HTML impede que entradas de usuário sejam interpretadas como tags ou código executável.',
    technical: [
      { term: 'Entidades base', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: 'Formas aceitas', detail: 'Nomeadas (&copy;), decimais (&#169;) e hexadecimais (&#xA9;)' },
      { term: 'Privacidade', detail: 'Tudo processado localmente no navegador sem envio a servidores' },
    ],
    compareLabel: 'Comparar',
    comparePlaceholder: 'Valor esperado opcional',
    modeAriaLabel: 'Modo de conversão',
    inputAriaLabel: 'Entrada',
    outputAriaLabel: 'Resultado convertido',
    swapLabel: 'Inverter',
    swapAriaLabel: 'Trocar entrada e saída',
    metaAriaLabel: 'Metadados',
    byteAriaLabel: 'Visualizador hexadecimal',
    historyTitle: 'Histórico recente',
    historyAriaLabel: 'Entradas recentes',
    insightAriaLabel: 'Explicação técnica',
    appliedPrefix: 'Correção aplicada:',
    checkInputMsg: 'Verifique a entrada.',
    invalidInputMsg: 'Entrada HTML inválida.',
    couldNotConvertMsg: 'Não foi possível converter a entrada.',
    detectedPrefix: 'Detectado:',
    validPrefix: 'Válido',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texto',
      'Percent-encoded': 'Codificado URL',
      'HTML entities': 'Entidades HTML',
      Markup: 'Marcação',
    },
    engine: {
      errDecode: 'Não foi possível decodificar as entidades HTML.',
      errEncode: 'Não foi possível codificar as entidades HTML.',
      infoNoEntities: 'Nenhuma entidade HTML encontrada para decodificar.',
      recDoubleEsc: 'Possível escape duplo (&amp;lt;): decodificar mais um nível',
      recMissingSemi: 'Adicionar ponto e vírgula faltante nas entidades',
      metaEntities: 'Entidades',
      entCountTpl: '{n} entidades',
      metaInputLen: 'Comp. entrada',
      metaOutputBytes: 'Bytes saída',
    },
  },
};
