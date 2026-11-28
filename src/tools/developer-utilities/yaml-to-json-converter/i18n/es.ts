import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de YAML a JSON",
  "seoTitle": "Conversor de YAML a JSON - Convertir Config a JSON",
  "description": "Convierte YAML en JSON válido al instante para APIs y JSON Schema. Expande anclas y convierte fechas ISO de forma privada.",
  "tagline": "Convierte configuraciones YAML en JSON válido localmente.",
  "lead": "Transforma manifiestos Kubernetes y archivos YAML en JSON estándar directamente en tu navegador, expandiendo alias sin perder estructura.",
  "guide": {
    "title": "Conversor de YAML a JSON: guía completa",
    "description": "Aprende cómo se convierten comentarios, anclas, alias y fechas YAML a JSON estándar, y cuándo usar cada formato en APIs y configuración."
  },
  "ui": {
    "inputLabel": "Entrada YAML",
    "placeholder": "Pega YAML aquí",
    "craftNote": "YAML no permite tabuladores para la sangría; 2 espacios por nivel es el estándar en los analizadores.",
    "moreAboutHeading": "Cómo funciona el Conversor de YAML a JSON",
    "insight": "Convierte configuraciones YAML en JSON para APIs y herramientas que exigen formato JSON. La sangría en YAML se traduce en objetos y arrays anidados.",
    "technical": [
      {
        "term": "Operación",
        "detail": "Analiza YAML y lo serializa como JSON"
      },
      {
        "term": "Uso",
        "detail": "Alimentar APIs y utilidades estrictamente JSON"
      },
      {
        "term": "Sangría",
        "detail": "La jerarquía YAML pasa a objetos y arrays JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Convierte YAML a JSON para APIs y validación JSON Schema, expandiendo anclas y serializando fechas como cadenas ISO.",
    "useCases": [
      "Pasar un manifiesto Kubernetes YAML a herramientas que consumen JSON",
      "Convertir un archivo de configuración para validarlo con JSON Schema",
      "Enviar ajustes escritos en YAML a un endpoint REST JSON",
      "Procesar YAML desde un lenguaje o script sin librería YAML",
      "Importar datos YAML en bases que almacenan documentos JSON"
    ],
    "mistakes": [
      "Usar tabuladores en lugar de espacios al sangrar el YAML",
      "Esperar que los comentarios # de YAML permanezcan en JSON",
      "Asumir que las fechas YAML siguen siendo objetos fecha nativos en JSON",
      "Dejar caracteres especiales como dos puntos sin comillas en valores"
    ]
  },
  "faqs": [
    {
      "id": "y2j-faq-1",
      "question": "¿Por qué convertir YAML a JSON?",
      "answer": "JSON es el idioma universal de las APIs web y librerías de programación. Pasar de YAML a JSON conserva toda la jerarquía de datos para validarla contra JSON Schema o enviarla a un servicio."
    },
    {
      "id": "y2j-faq-2",
      "question": "¿Es YAML un superconjunto de JSON?",
      "answer": "Sí. Desde YAML 1.2 todo JSON válido también es YAML válido, pero lo inverso no se cumple: los comentarios, anclas y alias propios de YAML se resuelven o descartan al convertir a JSON."
    },
    {
      "id": "y2j-faq-3",
      "question": "¿Qué pasa con los comentarios # del YAML al convertir?",
      "answer": "Se eliminan automáticamente, ya que la especificación RFC 8259 de JSON no admite comentarios. Solo permanecen claves, valores y jerarquía."
    },
    {
      "id": "y2j-faq-4",
      "question": "¿Cómo se manejan las anclas y alias de YAML?",
      "answer": "Las anclas (&nombre) y alias (*nombre) se expanden copiando el bloque completo en cada punto de uso porque JSON carece de sintaxis de referencias."
    },
    {
      "id": "y2j-faq-5",
      "question": "¿Cómo se convierten fechas y marcas temporales de YAML?",
      "answer": "Como JSON no tiene un tipo fecha nativo, las fechas YAML (como 2026-06-18) se serializan como cadenas ISO 8601 para conservar su valor exacto."
    },
    {
      "id": "y2j-faq-6",
      "question": "¿Por qué falla mi YAML al intentar convertirlo?",
      "answer": "La causa más común son tabuladores ocultos o una sangría desalineada. También puede deberse a dos puntos seguidos de espacio dentro de un texto sin comillas."
    },
    {
      "id": "y2j-faq-7",
      "question": "¿Puedo volver a pasar el JSON generado a formato YAML?",
      "answer": "Sí. Cambia al conversor hermano de JSON a YAML en la barra superior para realizar el viaje de ida y vuelta sin volver a copiar."
    },
    {
      "id": "y2j-faq-8",
      "question": "¿Mis configuraciones YAML se mantienen privadas?",
      "answer": "Sí. El análisis YAML y la salida JSON ocurren íntegramente dentro de tu navegador sin conexión ni subidas a ningún servidor."
    }
  ]
};
