import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'es',
  slug: 'sql-formatter',
  name: 'Formateador SQL',
  seoTitle: 'Formateador SQL Online – Embellecer Consultas Gratis',
  description:
    'Formatea consultas SQL en una línea con palabras clave en mayúsculas y cláusulas sangradas al instante en tu navegador, sin subir datos ni contraseñas.',
  tagline: 'Ordena consultas SQL enrevesadas con cláusulas limpias y sangría clara.',
  citation: {
    problem: 'Utiliza este Formateador SQL cuando necesites volver legible una consulta en una sola línea sin subirla a ningún sitio externo.',
    nonGoal: 'ejecutar la consulta contra una base de datos ni reescribir su lógica.',
  },
  knowledge: {
    primaryConcepts: ['formateador SQL'],
    realWorldUseCases: [
      'Limpiar una consulta SQL en una sola línea copiada de un registro',
      'Hacer legible un JOIN extenso antes de revisarlo en equipo',
      'Ordenar una consulta extraída de un ticket sin subir credenciales a webs externas',
    ],
    commonMistakes: [
      'Pegar consultas con contraseñas reales en formateadores que envían texto al servidor',
      'Esperar que el formateador reescriba u optimice el plan de ejecución SQL',
    ],
  },
  faqs: [
    {
      id: 'sql-fmt-1',
      question: '¿Qué modifica exactamente el Formateador SQL?',
      answer:
        'Solo la presentación. Pasa las palabras clave a mayúsculas, sitúa cada cláusula principal en su propia línea y sangra listas anidadas con dos espacios. Cadenas de texto, comentarios, números e identificadores se mantienen intactos, incluidas comillas escapadas como `O\'\'Brien`.',
    },
    {
      id: 'sql-fmt-2',
      question: '¿Qué dialectos SQL comprende?',
      answer:
        'Cubre palabras clave habituales de PostgreSQL, MySQL y SQLite: SELECT, JOIN, GROUP BY, ORDER BY, WITH, RETURNING, cadenas con delimitador dólar y agregados comunes. Las extensiones poco frecuentes se tratan como identificadores normales sin alterarse.',
    },
    {
      id: 'sql-fmt-3',
      question: '¿Se envía mi consulta SQL a algún servidor?',
      answer:
        'No. Todo el análisis y formateo se ejecutan dentro de tu navegador. Nada sale de esta pestaña y funciona incluso sin conexión tras cargar la página.',
    },
    {
      id: 'sql-fmt-4',
      question: '¿Por qué debo evitar pegar consultas con claves en webs con servidor?',
      answer:
        'Muchos formateadores envían la consulta por HTTP a su backend, dejando contraseñas, API keys o cadenas de conexión expuestas en registros ajenos. Usa siempre una herramienta local y rota cualquier secreto que ya hayas subido antes.',
    },
    {
      id: 'sql-fmt-5',
      question: '¿Qué ocurre si falta cerrar unas comillas?',
      answer:
        'El formateador se detiene e informa una cadena sin cerrar de comillas simples, dobles o invertidas, sin intentar adivinar dónde termina.',
    },
    {
      id: 'sql-fmt-6',
      question: '¿También minifica consultas SQL?',
      answer:
        'Esta herramienta está pensada para embellecer y dar sangría legible (pretty-print). Revisa primero la consulta ordenada antes de compactarla para un registro.',
    },
    {
      id: 'sql-fmt-7',
      question: '¿Formatear cambia cómo se ejecuta mi consulta?',
      answer:
        'No. En SQL los espacios entre palabras clave y las mayúsculas de palabras reservadas no alteran la semántica; los literales e identificadores quedan exactamente igual.',
    },
    {
      id: 'sql-fmt-8',
      question: '¿Qué pasa con los comentarios `--` o `/* ... */`?',
      answer:
        'Se conservan en sus propias líneas. Nunca se eliminan para no perder notas operativas importantes en SQL de producción.',
    },
  ],
  guide: {
    title: 'Formateador SQL: consultas legibles sin subir datos',
    description: 'Cómo funciona el formateo SQL local, qué dialectos cubre y cómo protege frente a fugas de credenciales.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'Entrada SQL',
    placeholder: 'Pega tu consulta SQL aquí',
    emptyOutput: 'Pega una consulta SQL a la izquierda para formatearla.',
    validLabel: 'SQL válido',
    invalidLabel: 'Error de SQL',
    loadError: 'No se pudo cargar el procesador SQL.',
    toolNote: 'Si detecta una contraseña o clave API en un valor entrecomillado, muestra aviso antes de compartirla.',
    insight:
      'El formateo pone en mayúsculas las palabras clave SQL y separa cada cláusula principal en su línea, conservando literales, comentarios e identificadores tal cual.',
    technical: [
      { term: 'Operación', detail: 'Tokeniza, pone palabras clave en mayúsculas y sangra cláusulas' },
      { term: 'Dialectos', detail: 'Palabras clave habituales de PostgreSQL, MySQL y SQLite' },
      { term: 'Preservado', detail: 'Literales, comentarios -- y /* */, números e identificadores' },
      { term: 'Errores', detail: 'Informa comillas sin cerrar sin adivinar' },
      { term: 'Privacidad', detail: 'Ejecución local y aviso ante posibles credenciales visibles' },
    ],
    engine: {
      warnSecret: 'Esta consulta parece contener una contraseña o secreto entre comillas. El formateo corre solo en este navegador, pero evita copiar credenciales a sitios públicos.',
      errTooLargeTpl: 'El SQL supera {max} caracteres. Recórtalo antes de formatear.',
      errUnclosedTpl: 'Cadena con comillas {name} sin cerrar. Añade {q} que falta e inténtalo de nuevo.',
      quoteNames: { single: 'simples', double: 'dobles', backtick: 'invertidas' },
    },
  },
};
