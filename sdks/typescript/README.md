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
  - [Workflow Status](#️-workflow-status)
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
- **Async Workflow Tracking** — Long-running operations return a workflow ID, polled via the Workflows resource
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
const { data } = await client.networks.getNetworks({ skip: 0, take: 50, enabled: true });
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
const { data } = await client.networks.getNetworks({ skip: 0, take: 50, enabled: true });
// data.networks[].id  — use this as networkId throughout the SDK

// Global catalog of enabled networks — lightweight (networkId, name, alias), any authenticated user
const { data: enabled } = await client.networks.getEnabledNetworks();
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

// Deploy — async, returns a workflow ID
const { data } = await client.contractTemplates.deployContract('<template-id>', {
  networkId: '<network-id>',
  addressId: '<address-id>',
  clientShare: '<client-share>',
});
const result = await waitForWorkflow(data.workflowResult.workflowId);
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

ABI function inputs and outputs use `InputOutputDto`, which requires a `value` field to carry the parameter data.

```typescript
// Read a contract function (view/pure)
const { data } = await client.contractInteractions.readCallFunction(
  '<network-id>',
  '<contract-address>',
  {
    abiFunction: {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address', value: { raw: '0xOwnerAddress' } }],
      outputs: [{ name: '', type: 'uint256', value: {} }],
    },
  }
);

// Write to a contract — triggers an async workflow
const { data } = await client.contractInteractions.writeCallFunction(
  '<network-id>',
  '<contract-address>',
  {
    addressId: '<address-id>',
    clientShare: '<client-share>',
    abiFunction: {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to',     type: 'address', value: { raw: '0xRecipient' } },
        { name: 'amount', type: 'uint256', value: { raw: '1000000000000000000' } },
      ],
      outputs: [],
    },
  }
);

// Get a transaction receipt
const { data } = await client.contractInteractions.getTransactionReceipt('<network-id>', '<tx-hash>');
```

---

### 🪙 Tokenization

All mutating token operations (create collection, issue new token, mint, burn) are asynchronous and return a `workflowResult.workflowId`.

```typescript
// List collections
const { data } = await client.tokenization.getCollections();

// Get a collection
const { data } = await client.tokenization.getCollection('<collection-id>');

// Create a collection — async
const { data } = await client.tokenization.createCollection({
  networkId: '<network-id>',
  addressId: '<address-id>',
  clientShare: '<client-share>',
  type: 'NON_FUNGIBLE_TOKEN',
  displayName: 'My NFT Collection',
  createParams: {
    initializeParams: [{ name: 'name', type: 'string', value: 'My NFT Collection' }],
  },
});
await waitForWorkflow(data.workflowResult.workflowId);

// Issue a new fungible token — async (returns workflow handle with HTTP 202)
const { data: issue } = await client.tokenization.issueNewToken({
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
await waitForWorkflow(issue.workflowResult.workflowId);

// Mint a token — async
const { data: mint } = await client.tokenization.mintToken('<collection-id>', {
  addressId: '<address-id>',
  clientShare: '<client-share>',
  to: '<recipient-address>',
  tokenId: '1',
});
await waitForWorkflow(mint.workflowResult.workflowId);

// Burn a token — async
const { data: burn } = await client.tokenization.burnToken('<collection-id>', {
  addressId: '<address-id>',
  clientShare: '<client-share>',
  tokenId: '1',
});
await waitForWorkflow(burn.workflowResult.workflowId);

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

### ⏱️ Workflow Status

Any operation that returns a `workflowResult.workflowId` is asynchronous. Poll via the Workflows resource until the workflow reaches a terminal state.

```typescript
async function waitForWorkflow(workflowId: string): Promise<Record<string, unknown> | undefined> {
  while (true) {
    const { data } = await client.workflows.getWorkflowStatus(workflowId);

    if (data.status === 'COMPLETED') return data.result;

    if (data.status === 'FAILED' || data.status === 'TERMINATED') {
      throw new Error(`Workflow ${workflowId} ended with status "${data.status}": ${data.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
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
| `IssueTokenWorkflowResponseDto` | `issueNewToken()` response (workflow handle) |
| `OrgNetworkItemDto` | Network entity from `getNetworks()` |
| `EnabledNetworkItemDto` | Network entity from `getEnabledNetworks()` |
| `WalletDataDto` | Wallet entity |
| `AddressDataDto` | Address entity |
| `TransactionItemDto` | Transaction entity |
| `AssetItemDto` | Token balance entry |
| `WorkflowStartResultDto` | Async operation response containing `workflowId` |
| `GetWorkflowStatusResponseDto` | Workflow poll response |

---

## Complete Example — Onboard a User and Mint an NFT

```typescript
async function onboardAndMint(profileReference: string, clientShare: string) {
  // 1. Resolve an enabled network
  const { data: networksData } = await client.networks.getNetworks({ skip: 0, take: 50, enabled: true });
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

  // 5. Create an NFT collection and wait for deployment
  const { data: collection } = await client.tokenization.createCollection({
    networkId,
    addressId: addressData.data!.id,
    clientShare,
    type: 'NON_FUNGIBLE_TOKEN',
    displayName: 'Loyalty Points',
    createParams: {
      initializeParams: [{ name: 'name', type: 'string', value: 'Loyalty Points' }],
    },
  });
  await waitForWorkflow(collection.workflowResult.workflowId);

  // 6. Mint the first token
  const { data: mint } = await client.tokenization.mintToken(
    collection.workflowResult.operationId,
    {
      addressId: addressData.data!.id,
      clientShare,
      to: addressData.data!.address,
      tokenId: '1',
    }
  );
  await waitForWorkflow(mint.workflowResult.workflowId);

  console.log('User onboarded and token minted successfully.');
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
