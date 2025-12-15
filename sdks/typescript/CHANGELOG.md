# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-12-15

### Fixed
- Updated README.md to use correct `generateAddressV2` method name in code example

---

## [1.2.0] - 2024-12-12

### Added

#### Temporal Workflow Status
- New `temporal` resource for tracking async workflow status
- `getTemporalWorkflowStatus(workflowId)` - Get status and result of temporal workflows
- Enables tracking of async operations like create collection, mint, burn, and contract interactions
- Returns workflow status, start/close time, execution time, history length, and result/error data

#### Generate Address V2
- Updated `generateAddress()` endpoint to use V2 API (`/api/v2/addresses/generate`)
- Improved address generation with enhanced parameters

#### New Collection Endpoints
- `getCollection(id)` - Retrieve a specific collection by ID
- `deleteCollection(id)` - Delete a collection
- `getCollectionTokenDetails(collectionId, tokenId)` - Get detailed information for a specific token in a collection
- `getCollectionTokens(request)` - Retrieve collection tokens (mints or burns) with filtering by collection ID and type

#### New Token Operations
- `unlinkToken(id)` - Unlink a token from the platform

#### Contract Interactions
- `getTransactionReceipt(network, txId)` - Retrieve transaction receipt for a specific transaction

### Changed
- Address generation now uses the V2 API endpoint for enhanced functionality
- Updated example.ts with comprehensive examples for all new features
- Updated README.md with documentation for temporal workflows, new collection endpoints, and V2 address generation

---

## [1.0.0] - 2024-11-13

### Added
- Initial release of Oumla TypeScript SDK
- Complete API coverage for all Oumla endpoints
- TypeScript type definitions for all API resources
- Support for profiles, wallets, addresses, transactions, assets, withdrawals
- Smart contract interaction capabilities
- Tokenization and NFT management features
- Comprehensive error handling with custom error types
- Multi-environment support (Production and custom URLs)
- Tree-shakeable ES modules and CommonJS support
- Full TypeScript support with strict type checking

### Features
- **Profiles**: Create and manage user profiles and organizations
- **Wallets**: Generate and manage blockchain wallets
- **Addresses**: Create and track blockchain addresses
- **Transactions**: Monitor and manage blockchain transactions
- **Assets**: Handle digital assets and collections
- **Withdrawals**: Process withdrawal operations
- **Contract Templates**: Deploy and manage smart contract templates
- **Deployed Contracts**: Interact with deployed smart contracts
- **Contract Interactions**: Read from and write to smart contracts
- **Tokenization**: Create and manage tokens and NFT collections

### Technical Details
- Built with TypeScript for full type safety
- Bundled with tsup for optimal package size
- Supports both ES modules and CommonJS
- Comprehensive error handling with custom error types
- Auto-generated from OpenAPI specification
- Compatible with Node.js 18+ and modern browsers
