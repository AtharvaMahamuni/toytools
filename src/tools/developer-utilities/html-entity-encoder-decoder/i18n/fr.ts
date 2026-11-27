import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'fr',
  slug: 'html-entity-encoder-decoder',
  name: 'Encodeur & Décodeur d’Entités HTML',
  seoTitle: 'Encoder et Décoder Entités HTML en Ligne',
  description:
    'Échappez les caractères réservés (`<`, `>`, `&`, `"`) en entités HTML ou décodez `&amp;`, `&#38;` et `&#x26;` vers du texte brut directement en local.',
  tagline: 'Encodez et décodez les entités HTML dans votre navigateur.',
  craft: {
    solves:
      'Les entités copiées depuis un CMS arrivent souvent doublement échappées ou sans point-virgule final, affichant des esperluettes brutes au lieu du symbole.',
  },
  knowledge: {
    primaryConcepts: ['entités HTML'],
    realWorldUseCases: [
      'Afficher du code HTML brut dans un article ou une documentation',
      'Échapper les saisies utilisateur pour bloquer les failles XSS',
      'Insérer des symboles typographiques et espaces insécables `&nbsp;`',
    ],
    commonMistakes: [
      'Oublier d’échapper du texte saisi par les visiteurs (risque XSS)',
      'Utiliser `&nbsp;` à la chaîne pour espacer la mise en page au lieu du CSS',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: 'Qu’est-ce qu’une entité HTML ?',
      answer:
        'C’est une référence de caractère qui affiche un symbole sans que le navigateur le traite comme du balisage : `&lt;` s’affiche `<` sans ouvrir de balise.',
    },
    {
      id: 'html-ent-faq-2',
      question: 'Quels caractères faut-il toujours échapper en HTML ?',
      answer:
        'Les quatre caractères structurels : `<` (`&lt;`), `>` (`&gt;`), `&` (`&amp;`) et `"` dans les attributs (`&quot;`). En UTF-8, le reste est facultatif.',
    },
    {
      id: 'html-ent-faq-3',
      question: 'Les entités restent-elles utiles si la page est en UTF-8 ?',
      answer:
        'Oui pour `<`, `>`, `&` et les guillemets d’attributs, car ils portent un rôle syntaxique dans l’analyseur HTML indépendamment de l’encodage.',
    },
    {
      id: 'html-ent-faq-4',
      question: 'Quelle différence entre &amp; et &#38; ?',
      answer:
        'Tous deux affichent `&` : `&amp;` est la forme nommée, `&#38;` la forme décimale et `&#x26;` la forme hexadécimale.',
    },
    {
      id: 'html-ent-faq-5',
      question: 'Pourquoi &nbsp; se comporte-t-il différemment d’un espace ordinaire ?',
      answer:
        '`&nbsp;` empêche le retour à la ligne entre deux éléments (ex. `10&nbsp;kg`) et n’est pas fusionné par le navigateur.',
    },
    {
      id: 'html-ent-faq-6',
      question: 'Quelle différence entre encodage HTML et encodage URL ?',
      answer:
        'L’encodage HTML protège le balisage (`<` → `&lt;`), tandis que l’encodage URL sécurise les adresses HTTP (`<` → `%3C`).',
    },
    {
      id: 'html-ent-faq-7',
      question: 'Que se passe-t-il si j’oublie d’échapper < ou > ?',
      answer:
        'Le navigateur l’interprète comme du vrai HTML pouvant injecter une balise `<script>` malveillante (attaque XSS) via `innerHTML`.',
    },
    {
      id: 'html-ent-faq-8',
      question: 'L’encodage en entités HTML empêche-t-il le XSS ?',
      answer:
        'Il protège les contextes texte et attributs HTML standards, mais les blocs `<script>`, styles CSS ou attributs `href` exigent des règles propres.',
    },
    {
      id: 'html-ent-faq-9',
      question: 'Pourquoi &apos; posait-il problème dans les anciens parseurs HTML ?',
      answer:
        '`&apos;` existait en XML/XHTML mais n’a rejoint HTML qu’avec HTML5 ; la référence numérique `&#39;` fonctionne partout.',
    },
  ],
  guide: {
    title: 'Entités HTML : quoi échapper et prévenir XSS',
    description:
      'Les caractères syntaxiques HTML, &amp; vs &#38;, espaces insécables &nbsp; et limites en contexte JS ou URL.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'Entités HTML',
    forwardLabel: 'Encoder → HTML',
    inverseLabel: 'Décoder ← HTML',
    outputLabel: 'Sortie',
    placeholder: 'Collez du texte ou des entités (&lt;...&gt;) ici…',
    outputPlaceholder: 'Le résultat s’affichera ici…',
    emptyOutput: 'Saisissez du texte ou des entités HTML pour commencer.',
    insight:
      'Échapper `<`, `>`, `&` et `"` en entités HTML empêche le navigateur d’interpréter une saisie utilisateur comme du balisage ou du script.',
    technical: [
      { term: 'Entités clés', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: 'Notations', detail: 'Nommées (&copy;), décimales (&#169;) et hexadécimales (&#xA9;)' },
      { term: 'Confidentialité', detail: 'Conversion locale dans votre navigateur sans envoi' },
    ],
    compareLabel: 'Comparer',
    comparePlaceholder: 'Valeur attendue optionnelle',
    modeAriaLabel: 'Mode de conversion',
    inputAriaLabel: 'Entrée',
    outputAriaLabel: 'Résultat converti',
    swapLabel: 'Inverser',
    swapAriaLabel: 'Permuter l’entrée et la sortie',
    metaAriaLabel: 'Métadonnées',
    byteAriaLabel: 'Inspecteur hexadécimal',
    historyTitle: 'Historique récent',
    historyAriaLabel: 'Entrées récentes',
    insightAriaLabel: 'Note technique',
    appliedPrefix: 'Correction appliquée :',
    checkInputMsg: 'Vérifiez l’entrée.',
    invalidInputMsg: 'Entrée HTML invalide.',
    couldNotConvertMsg: 'Impossible de convertir l’entrée.',
    detectedPrefix: 'Détecté :',
    validPrefix: 'Valide',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Texte',
      'Percent-encoded': 'Encodé URL',
      'HTML entities': 'Entités HTML',
      Markup: 'Balisage',
    },
    engine: {
      errDecode: 'Impossible de décoder les entités HTML.',
      errEncode: 'Impossible d’encoder les entités HTML.',
      infoNoEntities: 'Aucune entité HTML à décoder trouvée.',
      recDoubleEsc: 'Double échappement détecté (&amp;lt;) : décoder un niveau de plus',
      recMissingSemi: 'Ajouter les points-virgules manquants sur les entités',
      metaEntities: 'Entités',
      entCountTpl: '{n} entités',
      metaInputLen: 'Long. entrée',
      metaOutputBytes: 'Octets sortie',
    },
  },
};
