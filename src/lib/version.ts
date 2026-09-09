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
  major: 10,
  minor: 7,
  patch: 0,
  status: 'alpha',
  releaseDate: '2026-09-09',
  description: 'Fidget play chrome, slime squish, smoother flicks, and richer haptics',
};

export function formatVersion(config: VersionConfig): string {
  const base = `v${config.major}.${config.minor}${config.patch > 0 ? `.${config.patch}` : ''}`;
  return config.status !== 'stable' ? `${config.status}-${base}` : base;
}

export const APP_VERSION = formatVersion(VERSION_CONFIG);
export const VERSION_STATUS = VERSION_CONFIG.status;
export const RELEASE_DATE = VERSION_CONFIG.releaseDate;
