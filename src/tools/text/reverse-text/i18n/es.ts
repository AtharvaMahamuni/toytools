import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Invertir texto",
  "seoTitle": "Invertir texto - Poner texto al revés online",
  "description": "Invierte cualquier texto o cadena carácter por carácter online, al instante y de forma privada en tu navegador.",
  "tagline": "Invierte una cadena carácter por carácter. Sin salir de tu dispositivo.",
  "lead": "Pega o escribe un texto para voltear el orden completo de sus caracteres en tu dispositivo, conservando emojis y tildes intactos.",
  "guide": {
    "title": "Cómo invertir texto carácter por carácter",
    "description": "Aprende qué hace la inversión de texto, cuándo resulta útil el texto al revés y cómo voltear una cadena carácter por carácter al instante."
  },
  "ui": {
    "placeholder": "Pega o escribe texto aquí",
    "outputPlaceholder": "El texto invertido aparecerá aquí",
    "sampleText": "Anita lava la tina",
    "handoff": {
      "msgTpl": "Contiene {n} salto(s) de línea; al invertir todo el bloque también se invierte el orden de las líneas."
    }
  },
  "knowledge": {
    "summary": "Voltea el texto hacia atrás carácter por carácter, invirtiendo el orden de cada letra sin romper emojis ni signos diacríticos.",
    "useCases": [
      "Crear texto al revés para acertijos, pasatiempos o juegos",
      "Comprobar si una frase o palabra funciona como palíndromo",
      "Generar títulos o pies con efecto espejo para redes sociales",
      "Inspeccionar rápidamente una cadena desde el final hacia el principio"
    ],
    "mistakes": [
      "Esperar que solo cambie el orden de las palabras y no de cada carácter",
      "Olvidar que invertir el bloque entero también invierte la posición de los saltos de línea"
    ]
  },
  "faqs": [
    {
      "id": "reverse-text-faq-1",
      "question": "¿Qué hace exactamente invertir el texto?",
      "answer": "Invierte la posición de cada carácter de modo que el último pasa a ser el primero y el primero el último. \"hola\" se convierte en \"aloh\". Las letras no cambian, únicamente su secuencia."
    },
    {
      "id": "reverse-text-faq-2",
      "question": "¿Al invertir texto también se mueven los saltos de línea?",
      "answer": "Sí. Al invertir el bloque completo, toda la entrada se trata como una única secuencia, por lo que los saltos de línea cambian de sitio y la última línea acaba arriba. Por ejemplo, \"ab\" arriba y \"cd\" abajo pasan a \"dc\" arriba y \"ba\" abajo. Si quieres cada línea invertida en su mismo renglón, invierte de una en una."
    },
    {
      "id": "reverse-text-faq-3",
      "question": "¿Maneja bien los emojis y las letras con tilde?",
      "answer": "Sí. La herramienta trabaja por grafemas y caracteres completos en lugar de dividir unidades internas UTF-16, por lo que los emojis compuestos y las letras acentuadas se conservan íntegros sin fragmentarse."
    },
    {
      "id": "reverse-text-faq-5",
      "question": "¿Para qué se utiliza el texto al revés?",
      "answer": "Se usa en acertijos, comprobación de palíndromos, respuestas ocultas en triviales y textos con estética espejo en perfiles sociales. Por ejemplo, escribir \"dirdaM\" para ocultar \"Madrid\" en una hoja de juego sin dificultar que alguien lo lea si quiere."
    },
    {
      "id": "reverse-text-faq-6",
      "question": "¿Cómo volteo una cadena al revés?",
      "answer": "Pega o escribe la cadena en la entrada y la versión invertida aparece de inmediato sin pulsar ningún botón. Por ejemplo, \"ocas\" muestra \"saco\" en tiempo real y \"a🚀b\" pasa a \"b🚀a\" manteniendo intacto el emoji."
    },
    {
      "id": "reverse-text-faq-7",
      "question": "¿Cómo invierto una palabra para un acertijo?",
      "answer": "Escribe la palabra suelta y copia el resultado invertido en tu juego de pistas. Por ejemplo, \"amor\" pasa a \"roma\", un juego clásico fácil de descifrar de cabeza sin necesidad de herramientas externas."
    },
    {
      "id": "reverse-text-faq-4",
      "question": "¿Se envía mi texto a algún servidor?",
      "answer": "No. La inversión se ejecuta íntegramente en tu navegador. Nada de lo que escribas o pegues sale de tu dispositivo."
    }
  ]
};
