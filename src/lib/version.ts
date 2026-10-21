export type VersionStatus = 'alpha' | 'beta' | 'stable';

export interface VersionConfig {
  major: number;
  minor: number;
  patch: number;
  status: VersionStatus;
  releaseDate: string;
  description: string;
}

export const VERSION_CONFIG: VersionConfig = {
  major: 13,
  minor: 9,
  patch: 0,
  status: 'alpha',
  releaseDate: '2026-10-21',
  description: 'Pregnancy Due Date Calculator for a last period, cycle length, and weeks pregnant',
};

export function formatVersion(config: VersionConfig): string {
  const base = `v${config.major}.${config.minor}${config.patch > 0 ? `.${config.patch}` : ''}`;
  return config.status !== 'stable' ? `${config.status}-${base}` : base;
}

export const APP_VERSION = formatVersion(VERSION_CONFIG);
export const VERSION_STATUS = VERSION_CONFIG.status;
export const RELEASE_DATE = VERSION_CONFIG.releaseDate;
