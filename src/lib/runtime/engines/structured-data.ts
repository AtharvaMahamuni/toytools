import { runStructuredData, repairStructuredData } from '@lib/engines/structured-data/registry';
import { diffJson } from '@lib/engines/structured-data/jsonDiff';
import { validateJsonSchema } from '@lib/engines/structured-data/schemaValidate';
import { jsonExplorer } from '@lib/json/explorer';
import { yamlSerializer } from '@lib/json/yaml';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runStructuredData = runStructuredData; // (id, input) → { ok, output, error }
  TT.repairStructuredData = repairStructuredData; // (id, input) → { text, label } | null
  TT.json = jsonExplorer; // ToyTools.json.parse/stats/search — reusable JSON Explorer Core
  TT.yaml = yamlSerializer; // ToyTools.yaml.serialize(value, opts) → YAML string
  TT.diffJson = diffJson; // ToyTools.diffJson(left, right) → structural path diff
  TT.validateJsonSchema = validateJsonSchema; // ToyTools.validateJsonSchema(schema, data) → issues
};
