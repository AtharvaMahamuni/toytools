# ToyTools Version Management

This document explains the versioning system for ToyTools.

## Version Format

Versions follow semantic versioning with status prefixes:

```
[status-]v{major}.{minor}[.{patch}]
alpha-v0.2    # Alpha release
beta-v1.0     # Beta release
v2.0          # Stable release (no prefix)
```

**Status progression:** `alpha` → `beta` → `stable`

## Current Version

The current version is defined in `src/lib/version.ts` and is automatically displayed in the site's navigation bar.

To check the current version:
```sh
npm run version:show
```

## Bumping Versions

Use the version bump script to update the version. This script updates `src/lib/version.ts` with the new version and automatically sets today's date.

### Bump types

```sh
# Bump patch version (0.2.0 → 0.2.1)
npm run version:bump patch

# Bump minor version (0.2.0 → 0.3.0), reset patch to 0, change status to alpha
npm run version:bump minor

# Bump major version (0.2.0 → 1.0.0), reset minor/patch, change status to alpha
npm run version:bump major

# Change status (alpha → beta → stable)
npm run version:bump prerelease

# Bump with description (stored in version config)
npm run version:bump minor "Added new text tools"
```

## Release Process

1. **Update CHANGELOG.md** — Document all changes under the new version heading
2. **Bump version** — Run `npm run version:bump {type}` with your change description
3. **Review** — Verify changes and build: `npm run build`
4. **Commit** — Create a commit with a message like `Release v1.0.0`
5. **Tag** — Add a git tag: `git tag v1.0.0`
6. **Push** — Push commits and tags: `git push origin main --tags`
7. **Deploy** — The GitHub Actions workflow automatically deploys to GitHub Pages

## Changelog Format

The `CHANGELOG.md` file follows the [Keep a Changelog](https://keepachangelog.com/) format.

### Example entry:

```markdown
## [v1.0.0] - 2026-06-15

### Added
- New dashboard feature
- Search functionality

### Fixed
- Bug with modal closing

### Changed
- Updated styling for buttons

### Deprecated
- Old API endpoint

### Removed
- Legacy code path

### Security
- Fixed XSS vulnerability
```

Categories (in order):
- **Added** — New features
- **Fixed** — Bug fixes
- **Changed** — Changes to existing features
- **Deprecated** — Soon-to-be removed features
- **Removed** — Removed features
- **Security** — Security fixes

## Version in UI

The version badge appears in the site's header navigation:
- **Alpha versions** show a tooltip explaining the alpha status
- **Beta versions** show availability information
- **Stable versions** display without status indicator

To customize the version display, edit the tooltip text in `src/components/Nav.astro`.

## Git Tags

When releasing, create an annotated git tag:

```sh
git tag -a v1.0.0 -m "Release v1.0.0: Added new text tools"
git push origin v1.0.0
```

This creates a GitHub release that can be referenced by users.

## CI/CD Integration

The `.github/workflows/deploy.yml` workflow automatically:
1. Builds the site with the current version
2. Deploys to GitHub Pages
3. The version is embedded in the built site

No manual deployment is needed — just push to `main` and the workflow runs automatically.
