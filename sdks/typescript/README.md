# Oumla TypeScript SDK

[![npm version](https://badge.fury.io/js/%40oumla%2Fsdk.svg)](https://badge.fury.io/js/%40oumla%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript SDK for Oumla - Blockchain integration made simple. This SDK provides a comprehensive interface to interact with the Oumla API, enabling developers to build blockchain applications with ease.

## Features

- 🚀 **Full API Coverage** - Complete access to all Oumla API endpoints
- 🔒 **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🎯 **Easy Integration** - Simple and intuitive API design
- 📦 **Tree Shakeable** - Optimized bundle size with ES modules support
- 🔄 **Auto-generated** - Always up-to-date with the latest API changes
- 🌐 **Multi-environment** - Support for different deployment environments
- ⏱️ **Workflow Tracking** - Monitor async operations with Temporal workflow status

## Supported Networks

The SDK supports the following blockchain networks:

- **tBTC** - Bitcoin Testnet
- **tETH** - Ethereum Testnet
- **SANDBOX** - Sandbox Environment

## Installation

```bash
npm install @oumla/sdk
```

or

```bash
yarn add @oumla/sdk
```

or

```bash
pnpm add @oumla/sdk
```

## Quick Start

```typescript
import { OumlaSdkApiClient, OumlaSdkApiEnvironment } from '@oumla/sdk';

// Initialize the client
const client = new OumlaSdkApiClient({
  apiKey: 'your-api-key-here',
  environment: OumlaSdkApiEnvironment.Mainnet,
});

// Example: Get profiles
async function getProfiles() {
  try {
    const profiles = await client.profiles.getProfiles();
    console.log('Profiles:', profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
}

// Example: Generate an address (V2 API)
async function generateAddress() {
  try {
    const address = await client.addresses.createAddressV2({
      reference: 'profile-reference',
      network: 'network',
      clientShare: 'your-client-share',
    });
    console.log('Generated address:', address);
  } catch (error) {
    console.error('Error generating address:', error);
  }
}
```

## API Resources

The SDK provides access to the following resources:

### 🏠 Profiles
Manage user profiles and organizations
```typescript
const profiles = await client.profiles.getProfiles();
const profile = await client.profiles.createProfile({ 
  reference: 'my-profile',
  type: 'User' 
});
```

### 💼 Wallets
Create and manage blockchain wallets
```typescript
const wallets = await client.wallets.getWalletsByProfile('profile-reference');
const wallet = await client.wallets.createWallet({ 
  reference: 'profile-reference', 
  network: 'network' 
});
```

### 📍 Addresses
Generate and manage blockchain addresses
```typescript
// Get addresses for a profile
const addresses = await client.addresses.getAddressForProfile({
  reference: 'profile-reference'
});

// Generate a new address (V2 API - recommended)
const address = await client.addresses.createAddressV2({
  reference: 'profile-reference',
  network: 'network',
  clientShare: 'your-client-share',
});

// Get organization addresses
const orgAddresses = await client.addresses.getAddressForOrganization();
```

### 💰 Transactions
Track and manage blockchain transactions
```typescript
// Get transactions by profile
const transactions = await client.transactions.getTransactionsByProfile({
  reference: 'profile-reference'
});

// Get transactions by address
const addressTransactions = await client.transactions.getTransactionsByAddress({
  address: '0x...'
});

// Get transactions by organization
const orgTransactions = await client.transactions.getTransactionsByOrganization({
  reference: 'org-reference'
});
```

### 💼 Portfolio
Manage digital assets and portfolio tracking
```typescript
// Get assets for address, wallet, or contract
const assets = await client.portfolio.getAssets({
  address: '0x...',
  walletId: 'wallet-id',
  contractAddress: '0x...',
  tokenizationId: 'token-id'
});

// Get native balance for network, address, or wallet
const balance = await client.portfolio.getNativeBalance({
  network: 'network',
  address: '0x...',
  walletId: 'wallet-id'
});
```

### 🔥 Withdrawals
Handle withdrawal operations
```typescript
const withdrawal = await client.withdrawals.createWithdraw({
  walletId: 'wallet-id',
  amount: '1.0',
  currency: 'network',
});
```

### 📋 Contract Templates
Deploy and manage smart contract templates
```typescript
const templates = await client.contractTemplates.getContracts();
const template = await client.contractTemplates.createContract({
  name: 'My Contract',
  abi: contractAbi,
  bytecode: '0x...',
  description: 'Contract description'
});
```

### 🏗️ Deployed Contracts
Interact with deployed smart contracts
```typescript
const contracts = await client.deployedContracts.getDeployedContracts();
```

### 🔧 Contract Interactions
Read from and write to smart contracts
```typescript
// Get ABI functions for a deployed contract
const abi = await client.contractInteractions.getDeployedContractAbi(
  'network',
  'contractAddress'
);

// Read from contract
const result = await client.contractInteractions.readCallFunction(
  'network',
  'contractAddress',
  {
    abiFunction: {
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
    parameters: ['0x...']
  }
);

// Write to contract (triggers async workflow)
const writeResult = await client.contractInteractions.writeCallFunction(
  'network',
  'contractAddress',
  {
    addressId: 'your-address-id',
    clientShare: 'your-client-share',
    abiFunction: {
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [],
      type: 'function',
    },
    parameters: ['0x...', '1000000000000000000']
  }
);

// Get transaction receipt
const receipt = await client.contractInteractions.getTransactionReceipt(
  'network',
  'txId'
);
```

### 🪙 Tokenization
Create and manage tokens and collections with full lifecycle support

#### Collections
```typescript
// Get all collections
const collections = await client.tokenization.getCollections();

// Get a specific collection
const collection = await client.tokenization.getCollection('collection-id');

// Create a new collection (triggers async workflow)
const newCollection = await client.tokenization.createCollection({
  type: 'NON_FUNGIBLE_TOKEN',
  addressId: 'your-address-id',
  clientShare: 'your-client-share',
  createParams: {
    initializeParams: [{
      name: 'name',
      type: 'string',
      value: 'My NFT Collection',
    }],
  },
  displayName: 'My Collection',
});

// Delete a collection
await client.tokenization.deleteCollection('collection-id');
```

#### Token Operations
```typescript
// Mint a token (triggers async workflow)
const mintResult = await client.tokenization.mintToken('collection-id', {
  addressId: 'your-address-id',
  clientShare: 'your-client-share',
  to: 'recipient-address',
  tokenId: '1',
});

// Burn a token (triggers async workflow)
const burnResult = await client.tokenization.burnToken('collection-id', {
  addressId: 'your-address-id',
  clientShare: 'your-client-share',
  tokenId: '1',
});

// Get token details
const tokenDetails = await client.tokenization.getCollectionTokenDetails(
  'collection-id',
  'token-id'
);

// Get collection tokens (mints or burns)
const tokens = await client.tokenization.getCollectionTokens({
  id: 'collection-id',
  type: 'MINT', // or 'BURN'
  skip: 0,
  take: 50,
});

// Link an existing contract
await client.tokenization.linkContract({
  contractAddress: '0x...',
});

// Unlink a token
await client.tokenization.unlinkToken('token-id');
```

### ⏱️ Temporal Workflow Status
Track the status of async operations like collection creation, minting, burning, and contract interactions

```typescript
// Get workflow status
const status = await client.temporal.getTemporalWorkflowStatus('workflow-id');

console.log('Workflow ID:', status.data.workflowId);
console.log('Status:', status.data.status); // RUNNING, COMPLETED, FAILED, etc.
console.log('Start Time:', status.data.startTime);
console.log('Result:', status.data.result);

// Example: Poll until workflow completes
async function waitForWorkflow(workflowId: string) {
  while (true) {
    const status = await client.temporal.getTemporalWorkflowStatus(workflowId);
    
    if (status.data.status === 'COMPLETED') {
      console.log('Workflow completed:', status.data.result);
      return status.data.result;
    }
    
    if (status.data.status === 'FAILED') {
      throw new Error(`Workflow failed: ${JSON.stringify(status.data.error)}`);
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

## Configuration

### Environment Setup

```typescript
import { OumlaSdkApiClient, OumlaSdkApiEnvironment } from '@oumla/sdk';

const client = new OumlaSdkApiClient({
  apiKey: process.env.OUMLA_API_KEY!,
  environment: OumlaSdkApiEnvironment.Mainnet, // or custom URL
  baseUrl: 'https://custom-api.oumla.com', // Optional: custom base URL
  headers: {
    'Custom-Header': 'value', // Optional: additional headers
  },
});
```

### Request Options

```typescript
// Global request options
const client = new OumlaSdkApiClient({
  apiKey: 'your-api-key',
  // ... other options
});

// Per-request options
const profiles = await client.profiles.getProfiles({
  timeoutInSeconds: 30,
  maxRetries: 3,
  headers: {
    'Custom-Header': 'value',
  },
});
```

## Error Handling

The SDK provides comprehensive error handling with specific error types for different HTTP status codes:

```typescript
import { 
  OumlaSdkApiError, 
  OumlaSdkApiTimeoutError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError
} from '@oumla/sdk';

try {
  const result = await client.profiles.getProfiles();
} catch (error) {
  if (error instanceof BadRequestError) {
    console.error('Bad Request (400):', error.message);
  } else if (error instanceof UnauthorizedError) {
    console.error('Unauthorized (401):', error.message);
  } else if (error instanceof ForbiddenError) {
    console.error('Forbidden (403):', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Not Found (404):', error.message);
  } else if (error instanceof ConflictError) {
    console.error('Conflict (409):', error.message);
  } else if (error instanceof UnprocessableEntityError) {
    console.error('Unprocessable Entity (422):', error.message);
  } else if (error instanceof InternalServerError) {
    console.error('Internal Server Error (500):', error.message);
  } else if (error instanceof BadGatewayError) {
    console.error('Bad Gateway (502):', error.message);
  } else if (error instanceof ServiceUnavailableError) {
    console.error('Service Unavailable (503):', error.message);
  } else if (error instanceof GatewayTimeoutError) {
    console.error('Gateway Timeout (504):', error.message);
  } else if (error instanceof OumlaSdkApiTimeoutError) {
    console.error('Request timeout:', error.message);
  } else if (error instanceof OumlaSdkApiError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response Body:', error.body);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

The SDK is built with TypeScript and provides full type safety:

```typescript
import type { 
  CreateProfileRequest,
  GetProfilesRequest,
  Profile,
  PaginatedResponse,
  TemporalWorkflowStatusData,
} from '@oumla/sdk';

// Type-safe request parameters
const createProfileRequest: CreateProfileRequest = {
  reference: 'my-profile',
  type: 'User',
};

// Type-safe response handling
const response: PaginatedResponse = await client.profiles.getProfiles();
```

## Complete Workflow Examples

### Create Collection and Mint NFT with Status Tracking

```typescript
async function createCollectionAndMint() {
  // 1. Create a collection
  const collectionResponse = await client.tokenization.createCollection({
    type: 'NON_FUNGIBLE_TOKEN',
    addressId: 'your-address-id',
    clientShare: 'your-client-share',
    createParams: {
      initializeParams: [{
        name: 'name',
        type: 'string',
        value: 'My NFT Collection',
      }],
    },
  });
  
  // 2. Wait for collection creation workflow to complete
  if (collectionResponse.data?.workflowId) {
    await waitForWorkflow(collectionResponse.data.workflowId);
  }
  
  // 3. Mint a token
  const mintResult = await client.tokenization.mintToken(
    collectionResponse.data.id,
    {
      addressId: 'your-address-id',
      clientShare: 'your-client-share',
      to: 'recipient-address',
      tokenId: '1',
    }
  );
  
  // 4. Wait for mint workflow to complete
  if (mintResult.data?.workflowId) {
    await waitForWorkflow(mintResult.data.workflowId);
  }
  
  console.log('NFT minted successfully!');
}
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/oumla/sdk.git
cd sdk/sdks/typescript

# Install dependencies
pnpm install

# Build the SDK
pnpm run build

# Run in development mode
pnpm run dev
```

### Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/oumla/sdk/blob/main/CONTRIBUTING.md) for details.

## Support

- 📚 [Documentation](https://docs.oumla.com)
- 🐛 [Issue Tracker](https://github.com/oumla/sdk/issues)
- 💬 [Discord Community](https://discord.gg/oumla)
- 📧 [Email Support](mailto:support@oumla.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by the Oumla team
