import type { MetricFormatter } from '@data/types';

export type { MetricFormatter };

export function formatMetric(value: number, formatter: MetricFormatter): string {
  if (formatter === 'integer') return value.toLocaleString();
  if (formatter === 'duration') return `${value} min`;
  if (formatter === 'percentage') return `${value}%`;
  if (formatter === 'decimal') return value.toFixed(1);
  return String(value);
}
