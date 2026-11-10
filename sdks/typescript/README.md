# Oumla TypeScript SDK

[![npm version](https://badge.fury.io/js/%40oumla%2Fsdk.svg)](https://badge.fury.io/js/%40oumla%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript SDK for the Oumla API — blockchain integration with full type safety and minimal configuration. Build tokenization and smart contract workflows with ease.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Resources](#api-resources)
  - [Networks](#-networks)
  - [Profiles](#-profiles)
  - [Wallets](#-wallets)
  - [Addresses](#-addresses)
  - [Transactions](#-transactions)
  - [Assets](#-assets)
  - [Withdraw](#-withdraw)
  - [Contract Templates](#-contract-templates)
  - [Deployed Contracts](#️-deployed-contracts)
  - [Contract Interactions](#-contract-interactions)
  - [Tokenization](#-tokenization)
  - [Operation Status](#️-operation-status)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [TypeScript Types](#typescript-types)
- [Complete Example](#complete-example--onboard-a-user-and-mint-an-nft)
- [Development](#development)
- [Support](#support)

## Features

- **Full API Coverage** — Complete access to all Oumla API endpoints
- **Type Safety** — Strict TypeScript types for every request and response
- **Dynamic Networks** — Networks are managed per organization; no hardcoded chain strings
- **Async Operation Tracking** — Long-running operations return an `operationId`, polled via the Operations resource until `FINALIZED`
- **Idempotent Mutations** — Pass an `x-idempotency-key` to safely retry deploy, mint, burn, issue and write calls
 **Tree Shakeable** — ESM + CJS dual output for optimal bundle size

## Installation

```bash
npm install @oumla/sdk
# or
yarn add @oumla/sdk
# or
pnpm add @oumla/sdk
```

## Quick Start

```typescript
import { OumlaSdkApiClient, OumlaSdkApiEnvironment } from '@oumla/sdk';

const client = new OumlaSdkApiClient({
  apiKey: OUMLA_API_KEY,
  environment: OumlaSdkApiEnvironment.Mainnet,
});

// Fetch networks enabled for your organization
const { data } = await client.networks.getOrganizationNetworks({ skip: 0, take: 50, enabled: true });
const networkId = data.networks[0].id;

// Create a profile and generate an address
await client.profiles.createProfile({ reference: 'user-001', type: 'User' });
const address = await client.addresses.createAddressV2({
  reference: 'user-001',
  networkId,
  clientShare: '<client-share>',
});
```

## API Resources

### 🌐 Networks

Retrieve the networks available and enabled for your organization. Use the returned `id` values wherever a `networkId` is required. `isGasless` indicates whether the network sponsors gas fees.

```typescript
// Networks enabled for your organization (paginated, includes isGasless + chain metadata)
const { data } = await client.networks.getOrganizationNetworks({ skip: 0, take: 50, enabled: true });
// data.networks[].id  — use this as networkId throughout the SDK

// Global catalog of enabled networks — lightweight (networkId, name, alias), any authenticated user
```

---

### 🏠 Profiles

```typescript
// List profiles
const { data } = await client.profiles.getProfiles({ skip: 0, take: 20 });

// Create a profile
await client.profiles.createProfile({ reference: 'user-001', type: 'User' });
```

---

### 💼 Wallets

```typescript
// List wallets for a profile
const { data } = await client.wallets.getWalletsByProfile('user-001');

// Create a wallet
await client.wallets.createWallet({ reference: 'user-001', networkId: '<network-id>' });
```

---

### 📍 Addresses

```typescript
// List addresses for a profile
const { data } = await client.addresses.getAddressForProfile('user-001');

// Generate a new address (V2 — recommended)
await client.addresses.createAddressV2({
  reference: 'user-001',
  networkId: '<network-id>',
  clientShare: '<client-share>',
});

// List addresses for the organization
const { data: orgAddresses } = await client.addresses.getAddressForOrganization();
```

---

### 💰 Transactions

```typescript
// By profile
const { data } = await client.transactions.getTransactionsByProfile({ reference: 'user-001' });

// By address
const { data } = await client.transactions.getTransactionsByAddress({ address: '0x...' });

// By organization
const { data } = await client.transactions.getTransactionsByOrganization({ reference: 'org-001' });
```

---

### 💼 Assets

```typescript
// Token balances for an address
const { data } = await client.assets.getAssets({
  skip: 0,
  take: 20,
  address: '0x...',
  network: '<network-id>',   // optional filter
});

// Native balance (ETH, BTC, etc.)
const { data } = await client.assets.getNativeBalance({
  skip: 0,
  take: 20,
  address: '0x...',
  network: '<network-id>',   // optional filter
});
```

---

### 🔄 Withdraw

```typescript
await client.withdraw.createWithdraw({
  to: '0xDestinationAddress',
  from: ['0xSourceAddress'],   // UTXOs or source addresses
  amount: '1.5',
  networkId: '<network-id>',
  clientShare: '<client-share>',
});
```

---

### 📋 Contract Templates

```typescript
// List templates
const { data } = await client.contractTemplates.getContracts();

// Create a template
await client.contractTemplates.createContract({
  name: 'ERC-20 Token',
  abi: contractAbi,
  bytecode: '0x...',
  description: 'Standard fungible token',
});

// Deploy — async (HTTP 202), returns an operation handle
const deploy = await client.contractTemplates.deployContract('<template-id>', {
  networkId: '<network-id>',
  addressId: '<address-id>',
  clientShare: '<client-share>',
});
const operation = await waitForOperation(deploy.workflowResult.operationId);
// operation.contractAddress — the deployed address
// operation.referenceId    — the deploymentId (referenceType === 'CONTRACT_DEPLOYMENT')
```

---

### 🏗️ Deployed Contracts

```typescript
// List deployed contracts
const { data } = await client.deployedContracts.getDeployedContracts();

// Get by ID
const { data } = await client.deployedContracts.getDeployedContractById('<contract-id>');

// Get by address
const { data } = await client.deployedContracts.getDeployedContractByAddress('<address>');
```

---

### 🔧 Contract Interactions

ABI function inputs use `InputOutputDto`; set `value` on each input to the argument you are passing (a primitive, an array for `T[]` types, or an object keyed by component name for tuples).

```typescript
// Read a contract function (view/pure)
const { data } = await client.contractInteractions.readCallFunction(
  '<network-id>',
  '<contract-address>',
  {
    abiFunction: {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address', value: '0xOwnerAddress' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
  }
);

// Write to a contract — async (HTTP 202), returns an operation handle
const write = await client.contractInteractions.writeCallFunction(
  '<network-id>',
  '<contract-address>',
  {
    addressId: '<address-id>',
    clientShare: '<client-share>',
    abiFunction: {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to',     type: 'address', value: '0xRecipient' },
        { name: 'amount', type: 'uint256', value: '1000000000000000000' },
      ],
      outputs: [],
    },
  }
);
const writeOperation = await waitForOperation(write.workflowResult.operationId);
// writeOperation.txHash — the mined transaction hash

// Get a transaction receipt
const { data } = await client.contractInteractions.getTransactionReceipt('<network-id>', '<tx-hash>');
```

---

### 🪙 Tokenization

All mutating token operations (create collection, issue new token, mint, burn) are asynchronous (HTTP 202) and return a `workflowResult.operationId`. Poll it with the [Operations resource](#️-operation-status).

```typescript
// List collections
const { data } = await client.tokenization.getCollections();

// Get a collection
const { data } = await client.tokenization.getCollection('<collection-id>');

// Create a collection — async
const collection = await client.tokenization.createCollection({
  networkId: '<network-id>',
  addressId: '<address-id>',
  clientShare: '<client-share>',
  type: 'NON_FUNGIBLE_TOKEN',
  displayName: 'My NFT Collection',
  createParams: {
    initializeParams: [{ name: 'name', type: 'string', value: 'My NFT Collection' }],
  },
});
const collectionOperation = await waitForOperation(collection.workflowResult.operationId);
const collectionId = collectionOperation.referenceId!; // referenceType === 'TOKENIZATION_COLLECTION'

// Issue a new fungible token — async (HTTP 202)
const issue = await client.tokenization.issueNewToken({
  networkId: '<network-id>',
  addressId: '<address-id>',
  clientShare: '<client-share>',
  deploymentId: '<collection-deployment-id>',
  displayName: 'My Token',
  useGasless: false,
  fee: '0',
  createParams: {
    initializeParams: [{ name: 'amount', type: 'uint256', value: '1000000' }],
  },
});
await waitForOperation(issue.workflowResult.operationId);

// Mint a token — async
const mint = await client.tokenization.mintToken(collectionId, {
  addressId: '<address-id>',
  clientShare: '<client-share>',
  to: '<recipient-address>',
  tokenId: '1',
  'x-idempotency-key': 'mint-order-1234', // optional: safe to retry with the same key
});
await waitForOperation(mint.workflowResult.operationId);

// Burn a token — async
const burn = await client.tokenization.burnToken(collectionId, {
  addressId: '<address-id>',
  clientShare: '<client-share>',
  tokenId: '1',
});
await waitForOperation(burn.workflowResult.operationId);

// Get tokens in a collection
const { data } = await client.tokenization.getCollectionTokens({
  id: '<collection-id>',
  type: 'MINT',
  skip: 0,
  take: 50,
});

// Link / unlink an existing contract
await client.tokenization.linkContract({ contractAddress: '0x...' });
await client.tokenization.unlinkToken('<token-id>');
```

---

### ⏱️ Operation Status

Every mutating blockchain call (deploy, write, create collection, issue token, mint, burn) is accepted with HTTP 202 and returns a `workflowResult` handle:

```typescript
{
  operationId: string;                                        // poll this
  status: 'started' | 'already_running' | 'completed' | 'failed';
  message: string;
}
```

`already_running`, `completed` and `failed` mean the request replayed an earlier operation with the same `x-idempotency-key`. Poll the Operations resource until the operation reaches a terminal status.

| Status | Meaning |
|---|---|
| `ACCEPTED` | Operation recorded, not yet submitted |
| `SUBMITTING` | Signing and broadcasting |
| `PENDING_CONFIRMATION` | On chain, waiting for `requiredConfirmations` |
| `CONFIRMED` | Enough confirmations, finalizing side effects |
| `FINALIZED` | **Terminal, success** — `referenceId`, `contractAddress` and `txHash` are populated |
| `FAILED` | **Terminal, failure** — see `error` |
| `NEEDS_REVIEW` | **Terminal** — stuck in an ambiguous state; contact support with the `operationId` |

```typescript
import type { OumlaSdkApi } from '@oumla/sdk';

type Operation = OumlaSdkApi.BlockchainOperationDetailResponseDto;

async function waitForOperation(operationId: string, pollIntervalMs = 2000): Promise<Operation> {
  while (true) {
    const operation = await client.operations.getBlockchainOperation(operationId);

    if (operation.status === 'FINALIZED') return operation;

    if (operation.status === 'FAILED' || operation.status === 'NEEDS_REVIEW') {
      throw new Error(`Operation ${operationId} ended with status "${operation.status}": ${operation.error ?? 'unknown error'}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
}
```

The finalized operation tells you what was created:

| `type` | `referenceType` | `referenceId` is the… |
|---|---|---|
| `DEPLOY_CONTRACT` | `CONTRACT_DEPLOYMENT` | deployment id (`deployedContracts.getDeployedContractById`) |
| `CREATE_COLLECTION` | `TOKENIZATION_COLLECTION` | collection id (`tokenization.getCollectionById`) |
| `ISSUE_TOKEN` | `TOKENIZATION_TOKEN` | token id (`tokenization.getLinkedToken`) |
| `MINT` / `BURN` / `WRITE_CALL` | `TRANSACTION` | transaction id; `txHash` is the on-chain hash |

List operations with optional filters:

```typescript
const { operations, pagination } = await client.operations.listBlockchainOperations({
  skip: 0,
  take: 25,
  status: 'FINALIZED',   // optional
  type: 'MINT',          // optional
});
```

---

## Error Handling

```typescript
import {
  OumlaSdkApiError,
  OumlaSdkApiTimeoutError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '@oumla/sdk';

try {
  await client.profiles.getProfiles({ skip: 0, take: 20 });
} catch (error) {
  if (error instanceof BadRequestError)    console.error('400 Bad Request',    error.body);
  else if (error instanceof UnauthorizedError)  console.error('401 Unauthorized',   'check your API key');
  else if (error instanceof ForbiddenError)     console.error('403 Forbidden',      error.body);
  else if (error instanceof NotFoundError)      console.error('404 Not Found',      error.body);
  else if (error instanceof ConflictError)      console.error('409 Conflict',       error.body);
  else if (error instanceof InternalServerError) console.error('500 Server Error',  error.body);
  else if (error instanceof OumlaSdkApiTimeoutError) console.error('Request timed out');
  else if (error instanceof OumlaSdkApiError)   console.error(`HTTP ${error.statusCode}`, error.body);
  else throw error;
}
```

---

## Configuration

```typescript
const client = new OumlaSdkApiClient({
  apiKey: OUMLA_API_KEY,
  environment: OumlaSdkApiEnvironment.Mainnet,  // default
  baseUrl: 'https://custom.oumla.com',          // optional override
  headers: { 'X-Request-ID': 'trace-001' },     // optional extra headers
});
```

### Per-request options

```typescript
await client.profiles.getProfiles(
  { skip: 0, take: 20 },
  { timeoutInSeconds: 30, maxRetries: 3 }
);
```

---

## TypeScript Types

Key request and response types exported from `@oumla/sdk`:

| Type | Used for |
|---|---|
| `CreateProfileRequestBodyDto` | `createProfile()` body |
| `CreateWalletRequestBodyDto` | `createWallet()` body |
| `CreateAddressRequestBodyDto` | `createAddressV2()` body |
| `CreateCollectionBodyDto` | `createCollection()` body |
| `DeployContractRequestBodyDto` | `deployContract()` body |
| `WriteCallFunctionBody` | `writeCallFunction()` body |
| `ReadCallFunctionBody` | `readCallFunction()` body |
| `CreateWithdrawRequestBodyDto` | `createWithdraw()` body |
| `IssueNewTokenRequestBody` | `issueNewToken()` body |
| `IssueTokenWorkflowResponseDto` | `issueNewToken()` response (operation handle) |
| `OrgNetworkItemDto` | Network entity from `getOrganizationNetworks()` |
| `WalletDataDto` | Wallet entity |
| `AddressDataDto` | Address entity |
| `TransactionItemDto` | Transaction entity |
| `AssetItemDto` | Token balance entry |
| `WorkflowStartResultDto` | Async operation handle containing `operationId` |
| `BlockchainOperationDetailResponseDto` | `operations.getBlockchainOperation()` poll response |
| `GetOperationsResponseDto` | `operations.listBlockchainOperations()` response |

---

## Complete Example — Onboard a User and Mint an NFT

```typescript
async function onboardAndMint(profileReference: string, clientShare: string) {
  // 1. Resolve an enabled network
  const { data: networksData } = await client.networks.getOrganizationNetworks({ skip: 0, take: 50, enabled: true });
  const networkId = networksData.networks[0].id;

  // 2. Create a profile
  await client.profiles.createProfile({ reference: profileReference, type: 'User' });

  // 3. Create a wallet
  await client.wallets.createWallet({ reference: profileReference, networkId });

  // 4. Generate an address
  const { data: addressData } = await client.addresses.createAddressV2({
    reference: profileReference,
    networkId,
    clientShare,
  });

  // 5. Create an NFT collection and wait for it to finalize
  const collection = await client.tokenization.createCollection({
    networkId,
    addressId: addressData.data!.id,
    clientShare,
    type: 'NON_FUNGIBLE_TOKEN',
    displayName: 'Loyalty Points',
    createParams: {
      initializeParams: [{ name: 'name', type: 'string', value: 'Loyalty Points' }],
    },
  });
  const collectionOperation = await waitForOperation(collection.workflowResult.operationId);
  const collectionId = collectionOperation.referenceId!;

  // 6. Mint the first token
  const mint = await client.tokenization.mintToken(
    collectionId,
    {
      addressId: addressData.data!.id,
      clientShare,
      to: addressData.data!.address,
      tokenId: '1',
    }
  );
  const mintOperation = await waitForOperation(mint.workflowResult.operationId);

  console.log(`User onboarded and token minted in tx ${mintOperation.txHash}.`);
}
```

---

## Development

```bash
git clone https://github.com/oumla/sdk.git
cd sdk/sdks/typescript
pnpm install
pnpm run build    # compile to dist/
pnpm run dev      # watch mode
```

## Support

- [Documentation](https://docs.oumla.com)
- [Issue Tracker](https://github.com/oumla/sdk/issues)
- [Email Support](mailto:support@oumla.com)

## License

MIT — see [LICENSE](LICENSE) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with ❤️ by the Oumla team
