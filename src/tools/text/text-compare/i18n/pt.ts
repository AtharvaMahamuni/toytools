import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'pt',
  slug: 'text-compare',
  name: 'Comparador de Textos (Diff)',
  seoTitle: 'Comparador de Textos Online – Diff Lado a Lado Grátis',
  description:
    'Compare dois textos lado a lado e veja na hora quais linhas foram adicionadas ou removidas. Ignora espaços extras com um clique e roda só no dispositivo.',
  tagline: 'Compare duas versões de um texto e veja exatamente quais linhas mudaram.',
  knowledge: {
    primaryConcepts: ['comparador de textos', 'diff online', 'diferenças entre textos'],
    realWorldUseCases: [
      'Conferir o que mudou entre duas revisões de um documento ou contrato',
      'Revisar alterações feitas por outra pessoa em um rascunho',
      'Comparar dois trechos de configuração ou código antes do deploy',
      'Verificar se uma tradução preservou toda a estrutura de linhas',
    ],
    commonMistakes: [
      'Comparar arquivos sem perceber diferenças invisíveis de espaços finais ou quebra de linha',
      'Esperar mesclagem automática em vez de um relatório de leitura das diferenças',
    ],
  },
  faqs: [
    {
      id: 'tc-faq-1',
      question: 'Como comparo dois textos online?',
      answer:
        'Cole o texto original na primeira caixa e o texto novo na segunda. A ferramenta destaca na hora as linhas adicionadas, removidas e idênticas, além de informar o percentual de semelhança.',
    },
    {
      id: 'tc-faq-2',
      question: 'A comparação é por palavra ou por linha?',
      answer:
        'É uma comparação linha por linha (line diff), como no git diff. Se uma palavra mudar dentro de uma linha, a linha inteira aparece removida no original e adicionada no texto novo para facilitar a revisão.',
    },
    {
      id: 'tc-faq-3',
      question: 'O que significam os símbolos + e - no resultado?',
      answer:
        'Uma linha com + foi adicionada na versão nova (não estava no original). Uma linha com - foi removida do original. Linhas sem alteração aparecem suavizadas sem marcador.',
    },
    {
      id: 'tc-faq-4',
      question: 'Meu texto é enviado a algum servidor durante a comparação?',
      answer:
        'Não. Todo o processamento ocorre localmente no seu navegador via JavaScript; nenhum texto sai do dispositivo.',
    },
    {
      id: 'tc-faq-5',
      question: 'O que significa o percentual de semelhança?',
      answer:
        'Indica a proporção de linhas em comum entre os dois textos. 100% significa textos idênticos e 0% indica nenhuma linha igual.',
    },
    {
      id: 'tc-faq-6',
      question: 'O comparador diferencia maiúsculas de minúsculas?',
      answer:
        'Sim. Por padrão diferencia letras maiúsculas de minúsculas ("Texto" vs. "texto"), seguindo o padrão profissional de ferramentas diff.',
    },
    {
      id: 'tc-faq-7',
      question: 'Posso comparar mais de dois textos ao mesmo tempo?',
      answer:
        'A ferramenta compara um par de textos por vez. Para várias revisões seguidas, compare em pares: original vs. v1 e v1 vs. v2.',
    },
    {
      id: 'tc-faq-8',
      question: 'Qual a diferença para Localizar e Substituir?',
      answer:
        'Comparar Textos é somente leitura e exibe onde há diferenças sem tocar no conteúdo. Localizar e Substituir modifica o próprio texto.',
    },
    {
      id: 'tc-faq-9',
      question: 'Por que espaços invisíveis no fim da linha contam como diferença?',
      answer:
        'Porque a comparação exata verifica cada caractere da linha. Se o único conflito for espaço extra no final ou quebra de linha CRLF/LF, aparece um botão contextual para ignorar essas diferenças.',
    },
    {
      id: 'tc-faq-10',
      question: 'Por que mover um parágrafo de lugar faz ele aparecer inteiro alterado?',
      answer:
        'Porque o algoritmo alinha as linhas em sequência de cima para baixo. Um bloco movido é marcado como removido da posição antiga e adicionado na nova.',
    },
  ],
  guide: {
    title: 'Comparar textos online: como ler um diff passo a passo',
    description: 'Aprenda a comparar duas versões de texto, interpretar símbolos + e - e ignorar diferenças só de espaços.',
    readMinutes: 4,
  },
  ui: {
    btnSampleAria: 'Carregar texto de exemplo para comparar',
    panelOriginal: 'Original',
    phOriginal: 'Cole o texto original...',
    ariaOriginal: 'Texto original',
    panelNew: 'Texto novo',
    phNew: 'Cole o texto novo...',
    ariaNew: 'Texto novo',
    ariaDiffResult: 'Resultado da comparação',
    sampleA: 'A primeira linha continua igual.\nEsta linha será removida.\nTerceira linha com pequeno erro.\nQuarta linha sem alterações.',
    sampleB: 'A primeira linha continua igual.\nTerceira linha sem erros.\nQuarta linha sem alterações.\nEsta nova linha foi adicionada.',
    msgIdentical: 'Os dois textos são idênticos.',
    msgSummaryTpl: 'Os textos têm {sim}% de semelhança: {added} adicionadas, {removed} removidas.',
    wsIgnoringTpl: 'Ignorando {level}. ',
    wsOtherwiseIdentical: 'Fora isso, os dois textos são idênticos.',
    wsNormChangedTpl: '{norm} de {raw} linhas alteradas têm diferenças visíveis.',
    wsOnlyDiffTpl: 'Diferem apenas em {level}. Todas as {raw} linhas marcadas dizem o mesmo.',
    wsSomeDiffTpl: '{diff} de {raw} linhas alteradas diferem apenas em {level}.',
    btnShowRaw: 'Mostrar diff exato',
    btnIgnorePrefix: 'Ignorar ',
    lblAdded: 'Adicionadas',
    lblRemoved: 'Removidas',
    lblUnchanged: 'Sem alteração',
    lblSimilarity: 'Semelhança',
    unchangedRunTpl: '⋯ {n} linhas sem alteração',
  },
};
