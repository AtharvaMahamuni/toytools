// Public surface of the math engine. Tools import from here. The registries are re-exported so
// future tools (equation solver, graphing, statistics) can read or extend the language without
// reaching into internal modules.

export { evaluate } from './evaluate';
export type { EvaluateOptions } from './evaluate';
export { formatResult } from './format';
export type { FormatOptions } from './format';
export { OPERATORS } from './operators';
export { FUNCTIONS } from './functions';
export { CONSTANTS } from './constants';
export { MathError } from './errors';
export type { AngleMode, EvalResult, EvalContext, Token, OperatorDef, FunctionDef } from './types';
