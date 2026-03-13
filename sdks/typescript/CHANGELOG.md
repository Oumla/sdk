# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-16

### Added

#### Dynamic Network Support
- API responses now return dynamic network entities instead of hardcoded network strings.
- Networks are globally managed objects that can be assigned per organization.

#### Networks Resource
- New `networks` resource with `getNetworks()` endpoint for listing available networks.

#### Contract Deployment
- Improved contract deployment workflow with better parameter handling and execution reliability.

### Changed

#### Resource Renames ⚠️ Breaking Change
- `portfolio` resource renamed to `assets` — update all `client.portfolio.*` calls to `client.assets.*`.
- `withdrawals` resource renamed to `withdraw` — update all `client.withdrawals.*` calls to `client.withdraw.*`.

#### Request / Response Type Renames ⚠️ Breaking Change
All request and response types have been renamed to match the server-side DTO naming convention:

| Old Name | New Name |
|---|---|
| `CreateWalletRequest` | `CreateWalletRequestBodyDto` |
| `CreateProfileRequest` | `CreateProfileRequestBodyDto` |
| `CreateCollectionRequest` | `CreateCollectionBodyDto` |
| `CreateContractRequest` | `CreateContractRequestBodyDto` |
| `DeployContractRequest` | `DeployContractRequestBodyDto` |
| `AddContractAbiRequest` | `AddContractAbiRequestBodyDto` |
| `FetchContractAbiRequest` | `FetchContractAbiRequestBodyDto` |
| `ReadCallFunctionRequest` | `ReadCallFunctionBody` |
| `WriteCallFunctionRequest` | `WriteCallFunctionBody` |
| `BurnTokenRequest` | `BurnTokenBodyDto` |
| `IssueNewTokenRequest` | `IssueNewTokenRequestBody` |
| `LinkContractRequest` | `LinkContractBodyDto` |
| `MintTokenRequest` | `MintTokenBodyDto` |
| `CreateWithdrawRequest` | `CreateWithdrawRequestBodyDto` |
| `WalletData` | `WalletDataDto` |
| `AssetData` | `AssetItemDto` |
| `AddressData` | `AddressDataDto` |
| `NativeBalanceData` | `NativeBalanceItemDto` |
| `TokenData` | `TokenResponseDto` |
| `TransactionData` | `TransactionItemDto` |
| `CollectionData` | `CollectionItemDto` |
| `CollectionTokenData` | `CollectionTokenDetailDto` |
| `DeployedContractData` | `DeployedContractItemDto` |
| `ContractTemplateData` | `ContractTemplateItemDto` |
| `Pagination` | `AddressListPaginationDto` |

#### Network Architecture ⚠️ Breaking Change
- Removed the `network` attribute from all database-backed models.
- API responses that previously returned a `network` string now return dynamic network entities.
- Any code reading the `network` string directly from API responses must be updated.

#### Removed Error Classes ⚠️ Breaking Change
The following error classes have been removed. Catch `OumlaSdkApiError` directly for these status codes if needed:
- `BadGatewayError` (502)
- `GatewayTimeoutError` (504)
- `ServiceUnavailableError` (503)
- `UnprocessableEntityError` (422)

#### Error Handling
- Error response bodies are now loosely typed (`unknown`) for forward compatibility.

#### Request Validation
- Standardized Joi schema configuration and improved request validation across all API endpoints.

### Fixed
- Updated address generation endpoint to the correct API version with improved error handling.
- Added validation for `initializeParams` in the `issue-new-token` operation.

---

## [1.3.0] - 2026-01-31

### Added

#### Enhanced Error Handling
- Added comprehensive error types for better error handling:
  - `BadGatewayError` (502) - Bad Gateway errors
  - `ConflictError` (409) - Conflict errors
  - `ForbiddenError` (403) - Forbidden access errors
  - `GatewayTimeoutError` (504) - Gateway timeout errors
  - `InternalServerError` (500) - Internal server errors
  - `ServiceUnavailableError` (503) - Service unavailable errors
  - `UnauthorizedError` (401) - Unauthorized access errors
  - `UnprocessableEntityError` (422) - Unprocessable entity errors
- All existing endpoints now include appropriate error codes in their documentation and error handling

#### Portfolio Resource
- `getNativeBalance()` - Get native balance for network, address, or wallet

### Changed
- Renamed `assets` resource to `portfolio` for better semantic clarity
- Enhanced error handling across all endpoints with appropriate HTTP status code mappings
- Improved type definitions with new response types for all endpoints
- `readFunction()` renamed to `readCallFunction()` in contract interactions
- `writeFunction()` renamed to `writeCallFunction()` in contract interactions
- `getTransactionsByWallet()` renamed to `getTransactionsByMiniWallet()` in transactions
- `createWithdrawal()` renamed to `createWithdraw()` in withdrawals

---

## [1.2.4] - 2025-12-23

### Changed
-   - Use `OumlaSdkApiEnvironment.Mainnet` instead of `OumlaSdkApiEnvironment.Production` in examples
- Update README examples to use Mainnet environment

---

## [1.2.3] - 2025-12-23

### Changed
- Renamed environment from `Production` to `Mainnet` for better clarity
- Use `OumlaSdkApiEnvironment.Mainnet` instead of `OumlaSdkApiEnvironment.Production`

---

## [1.2.2] - 2025-12-15

### Fixed
- Updated README.md to use correct `generateAddressV2` method name in code example in quick start

---

## [1.2.1] - 2025-12-15

### Fixed
- Updated README.md to use correct `generateAddressV2` method name in code example

---

## [1.2.0] - 2025-12-12

### Added

#### Workflow Status
- New `workflows` resource for tracking async operation status
- `getWorkflowStatus(workflowId)` - Get status and result of async workflows
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
- Updated README.md with documentation for async workflows, new collection endpoints, and V2 address generation

---

## [1.0.0] - 2025-11-13

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
