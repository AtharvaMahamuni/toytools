// Structured-Data Engine — types.
//
// Every structured-data tool follows: input → parse → operate → result. Unlike the other
// engines, the operation can succeed or fail with a status, so execute() returns a result
// object (not a bare string). The shared StructuredDataWidget never names a tool; it calls
// ToyTools.runStructuredData(id, input), which resolves through the registry.

export type StructuredDataFamily = 'json';

export interface StructuredDataResult {
  ok: boolean;
  output: string;
  error?: string;
}

export interface StructuredDataTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'json-formatter'). */
  id: string;
  family: StructuredDataFamily;
  /** Pure, synchronous. Parses + operates, never throws — failures become a result error. */
  execute(input: string): StructuredDataResult;
  /**
   * True when this tool's *input* is JSON, so a JSON repair offer applies to it.
   *
   * Not derivable from `family`: every tool here is JSON-family, but `csv-to-json` and
   * `yaml-to-json` consume CSV and YAML, and offering to strip a trailing comma from a CSV file
   * would be gibberish. The processor owns the answer, per the craft doctrine.
   */
  jsonInput?: boolean;
}
