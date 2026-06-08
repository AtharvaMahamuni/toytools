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
}
