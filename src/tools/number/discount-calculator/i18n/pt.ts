import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'discount-calculator',
  name: 'Calculadora de Desconto',
  seoTitle: 'Calculadora de Desconto Online – Preço Final',
  description:
    'Calcule o preço final e quanto você economiza após aplicar desconto em porcentagem ou valor fixo direto no navegador, sem enviar preços.',
  tagline: 'Preço promocional e economia por percentual ou valor fixo.',
  craft: {
    solves:
      'Placas com "30% + 20% extra no caixa" parecem 50% de desconto, mas em cascata equivalem na prática a apenas 44%.',
  },
  knowledge: {
    primaryConcepts: ['cálculo de desconto', 'preço com desconto'],
    realWorldUseCases: [
      'Descobrir rapidamente o preço final de um produto em promoção',
      'Comparar cupom percentual contra cupom de valor fixo em reais',
      'Conferir a economia real de liquidações sazonais',
      'Planejar o gasto antes de fechar o carrinho',
    ],
    commonMistakes: [
      'Somar dois descontos sucessivos em vez de aplicá-los um sobre o outro',
      'Aplicar desconto em cima de impostos extras em vez do preço de lista',
    ],
  },
  faqs: [
    {
      id: 'disc-faq-1',
      question: 'Como calcular um desconto em porcentagem?',
      answer:
        'Multiplique o preço original pela porcentagem e divida por 100 para achar o abatimento, depois subtraia do original. Em 25% sobre 80: economia = 20 e preço final = 60.',
    },
    {
      id: 'disc-faq-2',
      question: 'Qual a diferença entre porcentagem e valor fixo?',
      answer:
        'A porcentagem acompanha o valor do item (20% economiza 10 em 50, mas 40 em 200), enquanto um desconto fixo abate sempre o mesmo montante.',
    },
    {
      id: 'disc-faq-3',
      question: 'Quanto vou economizar exatamente?',
      answer:
        'Digite o preço original e o desconto percentual ou fixo: o valor economizado e o preço final aparecem na hora.',
    },
    {
      id: 'disc-faq-4',
      question: 'Como funcionam descontos acumulados em sequência?',
      answer:
        'Aplicam-se em cascata: 20% seguido de 10% sobre 100 resulta em 80 e depois 72, totalizando 28% de desconto real (não 30%).',
    },
    {
      id: 'disc-faq-5',
      question: 'O desconto entra antes ou depois dos impostos?',
      answer:
        'No varejo comum o desconto incide primeiro sobre o preço anunciado antes de taxas extras ou tributos destacados.',
    },
    {
      id: 'disc-faq-6',
      question: 'Como achar o preço original a partir do valor com desconto?',
      answer:
        'Divida o valor pago por `(1 − taxa)`. Se algo custou 60 após 25% de desconto: `60 ÷ 0,75 = 80`.',
    },
    {
      id: 'disc-faq-7',
      question: 'O que significa "2ª unidade com 50% de desconto"?',
      answer:
        'Comprando dois itens de igual valor (um cheio e outro pela metade), você paga 150% de 200%, o que equivale a 25% de desconto total.',
    },
    {
      id: 'disc-faq-8',
      question: 'Desconto no preço de venda é o mesmo que reduzir margem/markup?',
      answer:
        'Não: desconto incide sobre o preço de venda ao cliente, enquanto markup incide sobre o custo do produto.',
    },
    {
      id: 'disc-faq-9',
      question: 'Meus preços são enviados para algum servidor?',
      answer:
        'Não. Toda conta roda apenas no seu navegador sem cadastro ou envio.',
    },
  ],
  guide: {
    title: 'Como calcular descontos, cascata e preço original',
    description:
      'Por que 20% + 10% dá 28%, fórmula reversa para descobrir o preço antigo e comparação entre cupons.',
    readMinutes: 4,
  },
  ui: {
    panelDetails: 'Dados do desconto',
    lblMode: 'Tipo de desconto',
    optPercent: 'Porcentagem (%)',
    optFixed: 'Valor fixo',
    lblPrice: 'Preço original',
    phPrice: 'Ex. 80',
    lblAmountPct: 'Desconto (%)',
    lblAmountFixed: 'Valor abatido',
    phPct: 'Ex. 25',
    phFixed: 'Ex. 15',
    lblFinalPrice: 'Preço final',
    emptyHint: 'Informe o preço original e o desconto para calcular.',
    lblSaved: 'Você economiza',
    lblRate: 'Taxa efetiva',
    errInvalidPrice: 'Informe um preço original válido maior ou igual a 0.',
    warnFixedCapTpl: 'O desconto de {amt} supera o preço de {price}; total limitado a zero.',
    warnPctCapTpl: 'Desconto acima de 100% ({rate}) limitado a 100%; preço final fica em zero.',
    copyLabel: 'Copiar resultado',
    copiedLabel: 'Copiado',
    clearLabel: 'Limpar',
    confirmClearLabel: 'Clique novamente para limpar',
    nothingToCopy: 'Calcule um desconto antes de copiar.',
    engine: {
      pitfallChainedTpl: 'Taxa acumulada equivalente a {rate} sobre o preço base {base}.',
      pitfallSingleTpl: 'Desconto único sobre {price}: preço final {final}.',
      pitfallActionLabel: 'Percentual efetivo',
    },
  },
};
