import { contextModel, type ContextModel } from './contextModels';

export interface ContextFit {
  characters: number;
  estimatedTokens: number;
  contextWindow: number;
  /** One decimal place. */
  percent: number;
  fits: boolean;
}

/** characters / charsPerToken, rounded up. Not an official tokenizer count. */
export function estimateContextFit(text: string, model: ContextModel): ContextFit {
  const characters = text.length;
  const factor = model.charsPerToken > 0 ? model.charsPerToken : 4;
  const estimatedTokens = characters === 0 ? 0 : Math.ceil(characters / factor);
  const percent = model.contextWindow === 0
    ? 0
    : Math.round((estimatedTokens / model.contextWindow) * 1000) / 10;
  return {
    characters,
    estimatedTokens,
    contextWindow: model.contextWindow,
    percent,
    fits: estimatedTokens <= model.contextWindow,
  };
}

export function estimateContextFitById(text: string, modelId: string): ContextFit | null {
  const model = contextModel(modelId);
  if (!model) return null;
  return estimateContextFit(text, model);
}
