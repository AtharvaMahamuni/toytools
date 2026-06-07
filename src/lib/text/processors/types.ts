// Text Processor System — engine types.
//
// Every transform/cleanup/extract/validate/format/compare tool is the same shape:
//   text → process(text) → text
// A processor is a single object implementing this interface. The shared
// TextProcessorWidget never names a processor; it only calls ToyTools.process(id, text),
// which resolves through the registry. Adding a family never changes this contract.

export type ProcessorFamily = 'transform' | 'cleanup';

export interface TextProcessor {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'uppercase'). */
  id: string;
  /** Grouping used by future discovery systems (related tools, search, clustering). */
  family: ProcessorFamily;
  /** Pure, synchronous, O(n) where possible. No deps, no I/O. */
  process(text: string): string;
}
