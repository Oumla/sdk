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
  environment: OumlaSdkApiEnvironment.Production,
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
    const address = await client.addresses.generateAddressV2({
      reference: 'profile-reference',
      network: 'ETH',
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
const wallets = await client.wallets.getProfileWallets('profile-reference');
const wallet = await client.wallets.generateWallet({ 
  reference: 'profile-reference', 
  network: 'tETH' 
});
```

### 📍 Addresses (V2 API)
Generate and manage blockchain addresses with the enhanced V2 API
```typescript
// Get addresses for a profile
const addresses = await client.addresses.getProfileAddresses('profile-reference');

// Generate a new address (V2)
const address = await client.addresses.generateAddressV2({
  reference: 'profile-reference',
  network: 'ETH', // Supports: BTC, tBTC, ETH, tETH
  clientShare: 'your-client-share',
});

// Get organization addresses
const orgAddresses = await client.addresses.getOrganizationAddresses();
```

### 💰 Transactions
Track and manage blockchain transactions
```typescript
const transactions = await client.transactions.getProfileTransactions('profile-reference');
```

### 🎨 Assets
Manage digital assets and collections
```typescript
const assets = await client.assets.getAssets();
```

### 🔥 Withdrawals
Handle withdrawal operations
```typescript
const withdrawal = await client.withdrawals.createWithdrawal({
  walletId: 'wallet-id',
  amount: '1.0',
  currency: 'ETH',
});
```

### 📋 Contract Templates
Deploy and manage smart contract templates
```typescript
const templates = await client.contractTemplates.getContractTemplates();
const template = await client.contractTemplates.createContractTemplate({
  name: 'My Contract',
  abi: contractAbi,
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
// Get available contract functions
const functions = await client.contractInteractions.getContractFunctions(
  'network',
  'contractAddress'
);

// Read from contract
const result = await client.contractInteractions.callReadFunction(
  'network',
  'contractAddress',
  {
    abiFunction: {
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
  }
);

// Write to contract (triggers async workflow)
const writeResult = await client.contractInteractions.callWriteFunction(
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
  environment: OumlaSdkApiEnvironment.Production, // or custom URL
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

The SDK provides comprehensive error handling:

```typescript
import { OumlaSdkApiError, OumlaSdkApiTimeoutError } from '@oumla/sdk';

try {
  const result = await client.profiles.getProfiles();
} catch (error) {
  if (error instanceof OumlaSdkApiError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response Body:', error.body);
  } else if (error instanceof OumlaSdkApiTimeoutError) {
    console.error('Request timeout:', error.message);
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
