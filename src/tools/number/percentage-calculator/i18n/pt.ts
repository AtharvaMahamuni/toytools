import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'percentage-calculator',
  name: 'Calculadora de Porcentagem',
  seoTitle: 'Calculadora de Porcentagem Online Grátis',
  description:
    'Quanto é 15% de 80? É 12. Calcule porcentagens, variação percentual e que porcentagem X representa de Y direto no seu dispositivo.',
  tagline: 'Calcule o percentual de um valor ou a variação entre dois números no dispositivo.',
  knowledge: {
    primaryConcepts: ['porcentagem', 'variação percentual', 'pontos percentuais'],
    realWorldUseCases: [
      'Calcular descontos, acréscimos e margens sobre um valor',
      'Medir quanto um indicador cresceu ou caiu em porcentagem',
      'Estimar gorjetas ou impostos sobre o total de uma conta',
      'Converter uma pontuação em nota percentual de 0 a 100',
    ],
    commonMistakes: [
      'Confundir variação percentual com pontos percentuais ao comparar taxas',
      'Inverter a parte e o todo ao descobrir que porcentagem X representa de Y',
    ],
  },
  faqs: [
    {
      id: 'pct-faq-1',
      question: 'O que é uma porcentagem?',
      answer:
        'Porcentagem é um número expresso como fração de 100. O termo vem do latim "per centum" ("por cem"). Dizer 25% significa 25 partes de cada 100, ou seja, um quarto do total, permitindo comparar quantias de escalas diferentes.',
    },
    {
      id: 'pct-faq-2',
      question: 'Como calcular a porcentagem de um número?',
      answer:
        'Multiplique o número pela porcentagem e divida por 100. Exemplo: 20% de 150 = (20 × 150) ÷ 100 = 30. Um atalho mental rápido é mover a vírgula uma casa para a esquerda para achar 10% (15) e dobrar para obter 20% (30).',
    },
    {
      id: 'pct-faq-3',
      question: 'Como descobrir que porcentagem um número é de outro?',
      answer:
        'Divida a parte pelo todo e multiplique por 100. Para saber quanto 45 representa de 200: (45 ÷ 200) × 100 = 22,5%. Muito usado para notas escolares e metas.',
    },
    {
      id: 'pct-faq-4',
      question: 'Qual a diferença entre porcentagem e pontos percentuais?',
      answer:
        'Ponto percentual é a diferença aritmética direta entre duas porcentagens. Se uma taxa de juros sobe de 3% para 5%, o aumento é de 2 pontos percentuais, mas representa um salto relativo de 66,7% sobre a taxa anterior.',
    },
    {
      id: 'pct-faq-5',
      question: 'Como calcular aumento ou redução percentual?',
      answer:
        'Subtraia o valor inicial do valor final, divida pelo valor inicial absoluto e multiplique por 100: ((Novo - Antigo) ÷ |Antigo|) × 100. De R$ 80 para R$ 100: ((100 - 80) ÷ 80) × 100 = 25% de aumento.',
    },
    {
      id: 'pct-faq-6',
      question: 'Como calcular um desconto sobre um preço?',
      answer:
        'Multiplique o preço original pela taxa de desconto e divida por 100 para achar a economia, ou multiplique direto por (1 - taxa). Em R$ 120 com 30% de desconto: 120 × 0,70 = R$ 84.',
    },
    {
      id: 'pct-faq-7',
      question: 'Por que dar 50% de desconto e depois aumentar 50% não volta ao valor inicial?',
      answer:
        'Porque cada operação atua sobre uma base diferente. Um item de 100 com 50% de desconto cai para 50; somar 50% sobre 50 resulta em 75, não em 100.',
    },
    {
      id: 'pct-faq-8',
      question: 'Como calcular ou retirar um imposto percentual?',
      answer:
        'Para somar 20% a R$ 100, multiplique por 1,20 (= R$ 120). Para descobrir o valor original antes de um imposto de 20% incluído no total de R$ 120, divida por 1,20 (= R$ 100) em vez de subtrair 20%.',
    },
  ],
  guide: {
    title: 'Como calcular porcentagem: 3 fórmulas essenciais',
    description: 'As três fórmulas de porcentagem com exemplos passo a passo, variação percentual e pontos percentuais.',
    readMinutes: 6,
  },
  ui: {
    panelValues: 'Valores',
    lblMode: 'Cálculo',
    optOf: 'Quanto é A% de B?',
    optChange: 'Variação percentual de A para B',
    optIs: 'A é quantos % de B?',
    lblA: 'A',
    phA: 'Exemplo: 20',
    lblB: 'B',
    phB: 'Exemplo: 150',
    emptyHint: 'Digite os valores para calcular.',
    errInvalid: 'Digite números válidos.',
    errFirstZero: 'O primeiro valor não pode ser zero.',
    errSecondZero: 'O segundo valor não pode ser zero.',
    fmlOf: '{a}% de {b}',
    dirIncrease: 'Aumento',
    dirDecrease: 'Redução',
    dirNone: 'Sem alteração',
    fmlChange: '{dir} de {a} para {b}',
    fmlIs: '{a} equivale a este % de {b}',
    toastEmptyCopy: 'Nada para copiar!',
    btnCopied: '✓ Copiado',
    btnCopy: 'Copiar',
    btnClear: 'Limpar',
    btnConfirmClear: 'Confirmar limpeza',
  },
};
