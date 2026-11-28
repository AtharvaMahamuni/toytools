import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Conversor de JSON a YAML",
  "seoTitle": "Conversor de JSON a YAML - Transformar Config Online",
  "description": "Convierte JSON a YAML al instante para Kubernetes, Docker Compose, Ansible y CI/CD. Sangría limpia y comillas automáticas en el navegador.",
  "tagline": "Convierte JSON a YAML legible para Kubernetes y CI/CD.",
  "lead": "Transforma objetos JSON en YAML limpio para manifiestos de Kubernetes, Docker Compose y flujos CI/CD directamente en tu dispositivo.",
  "guide": {
    "title": "Conversor de JSON a YAML: guía completa",
    "description": "Descubre diferencias entre JSON y YAML, cómo gestionar sangrías, comillas de palabras reservadas y manifiestos Kubernetes."
  },
  "ui": {
    "inputLabel": "Entrada JSON",
    "placeholder": "Pega JSON aquí",
    "moreAboutHeading": "Cómo funciona el Conversor de JSON a YAML",
    "insight": "Convierte JSON en YAML, un superconjunto legible muy usado en archivos de configuración. Los datos se mantienen idénticos; solo cambia la sintaxis.",
    "technical": [
      {
        "term": "Operación",
        "detail": "Re-serializa el JSON analizado como YAML"
      },
      {
        "term": "Uso",
        "detail": "Configuración, pipelines CI y manifiestos"
      },
      {
        "term": "Datos",
        "detail": "Conservados: YAML es un superconjunto de JSON"
      }
    ]
  },
  "knowledge": {
    "summary": "Convierte JSON a YAML para Kubernetes, Docker Compose, Ansible y pipelines CI/CD con comillas seguras e indentación limpia.",
    "useCases": [
      "Pasar respuestas de API JSON a manifiestos Kubernetes",
      "Crear archivos Docker Compose desde definiciones JSON",
      "Transformar variables JSON en playbooks de Ansible",
      "Preparar configuraciones para GitHub Actions",
      "Mejorar la lectura de fragmentos OpenAPI en YAML"
    ],
    "mistakes": [
      "Usar tabuladores en YAML cuando la especificación exige espacios",
      "Dejar sin comillas cadenas numéricas o palabras como yes/no",
      "Desalinear sangrías al editar estructuras anidadas a mano",
      "Creer que un YAML sin --- al inicio es inválido"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "¿Cuál es la diferencia entre JSON y YAML?",
      "answer": "Ambos representan datos jerárquicos. JSON usa llaves, corchetes y comillas obligatorias; YAML usa sangría con espacios, dos puntos y guiones, facilitando la lectura humana en configuraciones."
    },
    {
      "id": "jyaml-faq-2",
      "question": "¿Por qué convertir JSON a YAML?",
      "answer": "Herramientas DevOps como Kubernetes, Docker Compose, Ansible y GitHub Actions emplean YAML por defecto. Convertir un JSON exportado lo deja listo sin reescribirlo a mano."
    },
    {
      "id": "jyaml-faq-3",
      "question": "¿Puedo volver a pasar el YAML resultante a JSON?",
      "answer": "Sí. JSON sigue siendo el estándar universal para APIs y validación de esquemas, y puedes usar el conversor hermano de YAML a JSON."
    },
    {
      "id": "jyaml-faq-4",
      "question": "¿Es obligatoria la sangría correcta en YAML?",
      "answer": "Sí. YAML define su jerarquía mediante espacios (nunca tabuladores). Un espacio de más o de menos cambia la estructura o da error; dos espacios por nivel es la norma habitual."
    },
    {
      "id": "jyaml-faq-5",
      "question": "¿Por qué algunas cadenas aparecen entre comillas en YAML?",
      "answer": "Palabras sin comillas como true, false, null, yes o no y dígitos como 10001 se interpretan como booleanos o números. Las comillas preservan exactamente el tipo cadena original."
    },
    {
      "id": "jyaml-faq-6",
      "question": "¿Qué aporta la notación inline para arrays simples?",
      "answer": "Serializa listas cortas de escalares en línea como [a, b, c] frente al formato de bloque con guiones, reduciendo la longitud vertical en etiquetas o IDs."
    },
    {
      "id": "jyaml-faq-7",
      "question": "¿Para qué sirve el marcador inicial --- en YAML?",
      "answer": "Indica el comienzo explícito de un documento YAML; muchos parsers no lo exigen, aunque resulta útil en manifiestos multidocumento de Kubernetes o Helm."
    },
    {
      "id": "jyaml-faq-8",
      "question": "¿Son privados mis archivos de configuración al usar esta herramienta?",
      "answer": "Sí. Toda la conversión ocurre localmente en tu navegador con JavaScript, sin subir manifiestos ni estructuras sensibles a ningún servidor."
    }
  ]
};
