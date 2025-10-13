# Publishing Guide for Oumla SDK

This document provides instructions for publishing the Oumla SDK to npm.

## Prerequisites

1. **npm Account**: Ensure you have an npm account and are logged in
2. **Organization Access**: Make sure you have publish access to the `@oumla` organization
3. **Authentication**: Log in to npm using `npm login`

## Publishing Methods

### Method 1: Manual Publishing (Recommended for testing)

1. **Navigate to the TypeScript SDK directory**:
   ```bash
   cd sdks/typescript
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the package**:
   ```bash
   pnpm run build
   ```

4. **Verify the build**:
   ```bash
   # Check that dist folder contains all necessary files
   ls -la dist/
   # Should show: index.d.ts, index.js, index.mjs, and source maps
   ```

5. **Test the package locally** (optional):
   ```bash
   # Test CommonJS
   node -e "const { OumlaSdkApiClient } = require('./dist/index.js'); console.log('CJS works!');"
   
   # Test ES Modules
   node --input-type=module -e "import { OumlaSdkApiClient } from './dist/index.mjs'; console.log('ESM works!');"
   ```

6. **Publish to npm**:
   ```bash
   npm publish
   ```

### Method 2: Using Root Workspace Scripts

From the root directory:

1. **Build the TypeScript SDK**:
   ```bash
   pnpm run build:typescript
   ```

2. **Publish the TypeScript SDK**:
   ```bash
   pnpm run publish:typescript
   ```

### Method 3: Changeset Flow (Recommended for production)

The SDK is integrated with the changeset workflow for version management:

1. **Create a changeset** (from root directory):
   ```bash
   pnpm run changeset
   ```
   - Select the TypeScript SDK package
   - Choose the version bump type (patch, minor, major)
   - Add a description of changes

2. **Version packages**:
   ```bash
   pnpm run version
   ```
   This will update package.json versions based on changesets.

3. **Publish all packages**:
   ```bash
   pnpm run release
   ```

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass (if any)
- [ ] Build completes without errors
- [ ] Package.json version is correct
- [ ] README.md is up to date
- [ ] CHANGELOG.md reflects the changes
- [ ] All necessary files are included in the package
- [ ] .npmignore excludes unnecessary files

## Package Contents

The published package includes:

- `dist/` - Built JavaScript and TypeScript declaration files
- `README.md` - Documentation and usage examples
- `LICENSE` - MIT license
- `CHANGELOG.md` - Version history
- `package.json` - Package metadata

## Version Management

### Semantic Versioning

Follow semantic versioning (semver):
- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Version Bumping

Update the version in `package.json`:
```json
{
  "version": "1.0.1"
}
```

## Troubleshooting

### Common Issues

1. **Authentication Error**:
   ```bash
   npm login
   ```

2. **Permission Denied**:
   - Ensure you have publish access to `@oumla` organization
   - Check npm organization settings

3. **Build Errors**:
   ```bash
   pnpm run clean
   pnpm install
   pnpm run build
   ```

4. **Package Already Exists**:
   - Increment version number
   - Or use `npm publish --tag beta` for pre-release

### Verification

After publishing, verify the package:

1. **Check npm registry**:
   ```bash
   npm view @oumla/sdk
   ```

2. **Test installation**:
   ```bash
   npm install @oumla/sdk
   ```

3. **Test in a new project**:
   ```bash
   mkdir test-sdk
   cd test-sdk
   npm init -y
   npm install @oumla/sdk
   node -e "const { OumlaSdkApiClient } = require('@oumla/sdk'); console.log('Success!');"
   ```

## Rollback

If you need to rollback a version:

1. **Unpublish** (within 24 hours):
   ```bash
   npm unpublish @oumla/sdk@1.0.1
   ```

2. **Deprecate** (after 24 hours):
   ```bash
   npm deprecate @oumla/sdk@1.0.1 "This version has issues, please use 1.0.0"
   ```

## Security

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Keep dependencies up to date
- Review all code before publishing

## Support

For publishing issues:
- Check npm documentation: https://docs.npmjs.com/
- Contact the Oumla team
- Review the project's contributing guidelines
