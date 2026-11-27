import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'px-to-rem-converter',
  name: 'Conversor de PX para REM',
  seoTitle: 'Conversor PX para REM, EM e PT CSS Online',
  description:
    'Converta pixels para rem, em, pt e porcentagem com base configurável de fonte raiz direto no navegador e cópia com um toque.',
  tagline: 'px para rem, em e pt conforme seu tamanho raiz de CSS.',
  craft: {
    solves:
      'Converter `em` pela fonte raiz só vale no nível superior; dentro de elementos com fonte própria, o aninhamento multiplica os espaçamentos.',
  },
  knowledge: {
    primaryConcepts: ['conversão de unidades CSS'],
    realWorldUseCases: [
      'Traduzir layouts em pixels do Figma para rem escalável em CSS',
      'Converter medidas em pontos (pt) de design gráfico para pixels web',
      'Montar uma escala de espaçamentos em rem a partir de px',
      'Validar valores rem com tamanho base customizado como 10 px',
    ],
    commonMistakes: [
      'Assumir que 1rem é sempre 16px sem checar html { font-size }',
      'Usar em para margens globais causando crescimento composto ao aninhar',
    ],
  },
  faqs: [
    {
      id: 'px-to-rem-converter-faq-1',
      question: 'Como converter px para rem?',
      answer:
        'Divida o valor em pixels pelo tamanho da fonte raiz. No padrão de 16 px, 24 px ÷ 16 = 1,5 rem. Se o seu CSS usa outra base, altere o campo raiz.',
    },
    {
      id: 'px-to-rem-converter-faq-2',
      question: 'Qual a diferença entre rem e em?',
      answer:
        '`rem` sempre toma como referência a raiz (`html`), permanecendo estável na página inteira. `em` depende da fonte do próprio elemento ou pai e acumula ao aninhar.',
    },
    {
      id: 'px-to-rem-converter-faq-3',
      question: 'Por que devo usar rem em vez de px?',
      answer:
        'Usando `rem`, textos e espaçamentos acompanham automaticamente quando o usuário aumenta o tamanho da fonte no navegador por legibilidade e acessibilidade.',
    },
    {
      id: 'px-to-rem-converter-faq-4',
      question: 'Qual tamanho de fonte raiz devo usar?',
      answer:
        'Deixe em 16 px (padrão dos navegadores), salvo se o CSS redefinir `html { font-size }`. Se usar o truque de `62,5%` (10 px), informe `10` na base.',
    },
    {
      id: 'px-to-rem-converter-faq-5',
      question: 'Como pt se relaciona com px?',
      answer:
        'Na web, 1 polegada equivale a 96 px e 72 pt, logo 1 px = 0,75 pt e 16 px = 12 pt.',
    },
  ],
  guide: {
    title: 'PX, REM, EM e PT: relação e conversão em CSS',
    description:
      'Como converter px, rem, em e pt pela fonte raiz e por que rem melhora a acessibilidade responsiva.',
    readMinutes: 5,
  },
  ui: {
    panelValue: 'Valor para converter',
    lblValue: 'Valor',
    ariaUnit: 'Unidade de entrada',
    lblBase: 'Fonte raiz (px)',
    rootNote: 'O padrão dos navegadores é 16 px (ou 10 px usando 62,5%).',
    panelConverted: 'Unidades convertidas',
    copyLabel: 'Copiar',
    errInvalid: 'Digite um número finito positivo para converter.',
    engine: {
      emHintTpl: 'Equivalente frente à base de {base} px na raiz (pode multiplicar em elementos aninhados).',
    },
  },
};
