import type { LocaleCode } from '@data/locales';
import type { LocalizedToolPack } from './types';

export interface WidgetChromeStrings {
  input: string;
  output: string;
  status: string;
  details: string;
  result: string;
  options: string;
  paste: string;
  copy: string;
  clear: string;
  download: string;
  loadExample: string;
  sample: string;
  regenerate: string;
  downloadPng: string;
  downloadSvg: string;
  show: string;
  hide: string;
  copied: string;
  nothingToCopy: string;
  emptyOutput: string;
  qrAria: string;
}

export const WIDGET_CHROME: Record<LocaleCode, WidgetChromeStrings> = {
  en: {
    input: 'Input',
    output: 'Output',
    status: 'Status',
    details: 'Details',
    result: 'Result',
    options: 'Options',
    paste: 'Paste',
    copy: 'Copy',
    clear: 'Clear',
    download: 'Download',
    loadExample: 'Load example',
    sample: 'Sample',
    regenerate: 'Regenerate',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    show: 'Show',
    hide: 'Hide',
    copied: '✓ Copied',
    nothingToCopy: 'Nothing to copy yet!',
    emptyOutput: 'Output will appear here',
    qrAria: 'Generated QR code',
  },
  es: {
    input: 'Entrada',
    output: 'Salida',
    status: 'Estado',
    details: 'Datos',
    result: 'Resultado',
    options: 'Opciones',
    paste: 'Pegar',
    copy: 'Copiar',
    clear: 'Borrar',
    download: 'Descargar',
    loadExample: 'Cargar ejemplo',
    sample: 'Ejemplo',
    regenerate: 'Regenerar',
    downloadPng: 'Descargar PNG',
    downloadSvg: 'Descargar SVG',
    show: 'Mostrar',
    hide: 'Ocultar',
    copied: '✓ Copiado',
    nothingToCopy: '¡Nada que copiar todavía!',
    emptyOutput: 'El resultado aparecerá aquí',
    qrAria: 'Código QR generado',
  },
  de: {
    input: 'Eingabe',
    output: 'Ausgabe',
    status: 'Status',
    details: 'Angaben',
    result: 'Ergebnis',
    options: 'Optionen',
    paste: 'Einfügen',
    copy: 'Kopieren',
    clear: 'Leeren',
    download: 'Herunterladen',
    loadExample: 'Beispiel laden',
    sample: 'Beispiel',
    regenerate: 'Neu erzeugen',
    downloadPng: 'PNG laden',
    downloadSvg: 'SVG laden',
    show: 'Anzeigen',
    hide: 'Ausblenden',
    copied: '✓ Kopiert',
    nothingToCopy: 'Noch nichts zum Kopieren!',
    emptyOutput: 'Die Ausgabe erscheint hier',
    qrAria: 'Erzeugter QR-Code',
  },
  fr: {
    input: 'Entrée',
    output: 'Sortie',
    status: 'Statut',
    details: 'Paramètres',
    result: 'Résultat',
    options: 'Options',
    paste: 'Coller',
    copy: 'Copier',
    clear: 'Effacer',
    download: 'Télécharger',
    loadExample: 'Charger un exemple',
    sample: 'Exemple',
    regenerate: 'Régénérer',
    downloadPng: 'Télécharger PNG',
    downloadSvg: 'Télécharger SVG',
    show: 'Afficher',
    hide: 'Masquer',
    copied: '✓ Copié',
    nothingToCopy: 'Rien à copier pour le moment !',
    emptyOutput: 'Le résultat apparaîtra ici',
    qrAria: 'Code QR généré',
  },
};

export function uiStr(pack: LocalizedToolPack | null | undefined, key: string, fallback: string): string {
  const val = pack?.ui?.[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

export function localizeFields<
  T extends {
    id: string;
    label: string;
    help?: string;
    placeholder?: string;
    unit?: string;
    group?: string;
    options?: readonly { value: string; label: string }[];
  },
>(fields: readonly T[], pack?: LocalizedToolPack | null): T[] {
  const overrides = pack?.fields;
  if (!overrides) return [...fields];
  return fields.map((f) => {
    const ov = overrides[f.id];
    if (!ov) return f;
    return {
      ...f,
      label: ov.label ?? f.label,
      help: ov.help ?? f.help,
      placeholder: ov.placeholder ?? f.placeholder,
      unit: ov.unit ?? f.unit,
      group: ov.group ?? f.group,
      options: f.options && ov.options
        ? f.options.map((opt) => ({
            ...opt,
            label: ov.options?.[opt.value] ?? opt.label,
          }))
        : f.options,
    };
  });
}
