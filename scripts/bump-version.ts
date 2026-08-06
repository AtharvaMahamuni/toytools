import fs from 'fs';
import path from 'path';

type BumpType = 'major' | 'minor' | 'patch' | 'prerelease';
type Status = 'alpha' | 'beta' | 'stable';

interface VersionConfig {
  major: number;
  minor: number;
  patch: number;
  status: Status;
  releaseDate: string;
  description: string;
}

const versionFilePath = path.join(process.cwd(), 'src/lib/version.ts');

function readCurrentVersion(): VersionConfig {
  const content = fs.readFileSync(versionFilePath, 'utf-8');
  const majorMatch = content.match(/major:\s*(\d+)/);
  const minorMatch = content.match(/minor:\s*(\d+)/);
  const patchMatch = content.match(/patch:\s*(\d+)/);
  const statusMatch = content.match(/status:\s*'(\w+)'/);
  const dateMatch = content.match(/releaseDate:\s*'([\d-]+)'/);

  return {
    major: majorMatch ? parseInt(majorMatch[1]) : 0,
    minor: minorMatch ? parseInt(minorMatch[1]) : 0,
    patch: patchMatch ? parseInt(patchMatch[1]) : 0,
    status: (statusMatch?.[1] as Status) || 'alpha',
    releaseDate: dateMatch?.[1] || new Date().toISOString().split('T')[0],
    description: '',
  };
}

function getNextVersion(current: VersionConfig, bumpType: BumpType): VersionConfig {
  const today = new Date().toISOString().split('T')[0];

  switch (bumpType) {
    case 'major':
      return {
        ...current,
        major: current.major + 1,
        minor: 0,
        patch: 0,
        status: 'alpha',
        releaseDate: today,
      };
    case 'minor':
      return {
        ...current,
        minor: current.minor + 1,
        patch: 0,
        status: 'alpha',
        releaseDate: today,
      };
    case 'patch':
      return {
        ...current,
        patch: current.patch + 1,
        releaseDate: today,
      };
    case 'prerelease':
      return {
        ...current,
        status: current.status === 'alpha' ? 'beta' : current.status === 'beta' ? 'stable' : 'alpha',
        releaseDate: today,
      };
    default:
      return current;
  }
}

/**
 * Render a value as a single-quoted TS string literal. The description comes from the command
 * line, so an apostrophe ("don't") would otherwise close the literal and leave version.ts
 * unparseable — a bump that breaks the next build.
 */
function tsString(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
  return `'${escaped}'`;
}

function writeVersionFile(config: VersionConfig): void {
  const content = `export type VersionStatus = 'alpha' | 'beta' | 'stable';

export interface VersionConfig {
  major: number;
  minor: number;
  patch: number;
  status: VersionStatus;
  releaseDate: string;
  description: string;
}

export const VERSION_CONFIG: VersionConfig = {
  major: ${config.major},
  minor: ${config.minor},
  patch: ${config.patch},
  status: '${config.status}',
  releaseDate: '${config.releaseDate}',
  description: ${tsString(config.description)},
};

export function formatVersion(config: VersionConfig): string {
  const base = \`v\${config.major}.\${config.minor}\${config.patch > 0 ? \`.\${config.patch}\` : ''}\`;
  return config.status !== 'stable' ? \`\${config.status}-\${base}\` : base;
}

export const APP_VERSION = formatVersion(VERSION_CONFIG);
export const VERSION_STATUS = VERSION_CONFIG.status;
export const RELEASE_DATE = VERSION_CONFIG.releaseDate;
`;

  fs.writeFileSync(versionFilePath, content);
}

async function main() {
  const args = process.argv.slice(2);
  const bumpType = (args[0] as BumpType) || 'patch';
  const description = args.slice(1).join(' ');

  if (!['major', 'minor', 'patch', 'prerelease'].includes(bumpType)) {
    console.error(`Invalid bump type: ${bumpType}. Use: major, minor, patch, or prerelease`);
    process.exit(1);
  }

  const current = readCurrentVersion();
  const next = getNextVersion(current, bumpType);
  next.description = description || current.description;

  writeVersionFile(next);

  const formatVersion = (v: VersionConfig) => {
    const base = `v${v.major}.${v.minor}${v.patch > 0 ? `.${v.patch}` : ''}`;
    return v.status !== 'stable' ? `${v.status}-${base}` : base;
  };

  console.log(`✓ Version bumped: ${formatVersion(current)} → ${formatVersion(next)}`);
  console.log(`  Status: ${next.status}`);
  console.log(`  Release date: ${next.releaseDate}`);
}

main().catch(console.error);
