import { runStructuredData } from '@lib/engines/structured-data/registry';
import { jsonExplorer } from '@lib/json/explorer';
import { yamlSerializer } from '@lib/json/yaml';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runStructuredData = runStructuredData; // (id, input) → { ok, output, error }
  TT.json = jsonExplorer; // ToyTools.json.parse/stats/search — reusable JSON Explorer Core
  TT.yaml = yamlSerializer; // ToyTools.yaml.serialize(value, opts) → YAML string
};
