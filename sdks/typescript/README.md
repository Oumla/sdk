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

// Example: Create a wallet
async function createWallet() {
  try {
    const wallet = await client.wallets.createWallet({
      profileId: 'your-profile-id',
      name: 'My Wallet',
    });
    console.log('Created wallet:', wallet);
  } catch (error) {
    console.error('Error creating wallet:', error);
  }
}
```

## API Resources

The SDK provides access to the following resources:

### 🏠 Profiles
Manage user profiles and organizations
```typescript
const profiles = await client.profiles.getProfiles();
const profile = await client.profiles.createProfile({ name: 'My Profile' });
```

### 💼 Wallets
Create and manage blockchain wallets
```typescript
const wallets = await client.wallets.getProfileWallets({ profileId: 'profile-id' });
const wallet = await client.wallets.createWallet({ profileId: 'profile-id', name: 'My Wallet' });
```

### 📍 Addresses
Generate and manage blockchain addresses
```typescript
const addresses = await client.addresses.getProfileAddresses({ profileId: 'profile-id' });
const address = await client.addresses.createAddress({ walletId: 'wallet-id' });
```

### 💰 Transactions
Track and manage blockchain transactions
```typescript
const transactions = await client.transactions.getProfileTransactions({ profileId: 'profile-id' });
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
const result = await client.contractInteractions.readFunction({
  contractAddress: '0x...',
  functionName: 'balanceOf',
  parameters: ['0x...'],
});
```

### 🪙 Tokenization
Create and manage tokens and collections
```typescript
const collections = await client.tokenization.getCollections();
const collection = await client.tokenization.createCollection({
  name: 'My NFT Collection',
  symbol: 'MNC',
});
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
  PaginatedResponse 
} from '@oumla/sdk';

// Type-safe request parameters
const createProfileRequest: CreateProfileRequest = {
  name: 'My Profile',
  // TypeScript will enforce the correct structure
};

// Type-safe response handling
const response: PaginatedResponse<Profile> = await client.profiles.getProfiles();
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
