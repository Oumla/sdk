/**
 * Example usage of the Oumla TypeScript SDK
 * 
 * This file demonstrates how to use the SDK in your applications.
 * Note: This file is for documentation purposes and is not included in the npm package.
 */

import { OumlaSdkApiClient, OumlaSdkApiEnvironment } from '@oumla/sdk';

// Using any for return types to avoid TypeScript namespace issues
type PaginatedResponse = any;
type SuccessResponse = any;

// Initialize the client
const client = new OumlaSdkApiClient({
  apiKey: 'your-api-key',
  environment: OumlaSdkApiEnvironment.Mainnet,
  // sdkVersion not specified - should use default "1.0.0"
});


// Example: Get all profiles
async function getProfiles(): Promise<PaginatedResponse> {
  try {
    const profiles = await client.profiles.getProfiles();
    console.log('Profiles:', profiles);
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
}

// Example: Create a new profile
async function createProfile(reference: string, type: 'User' | 'Department' | 'Merchant' = 'User'): Promise<SuccessResponse> {
  try {
    const profile = await client.profiles.createProfile({
      reference,
      type,
    });
    console.log('Created profile:', profile);
    return profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

// Example: Get wallets for a profile
async function getProfileWallets(profileReference: string): Promise<PaginatedResponse> {
  try {
    const wallets = await client.wallets.getWalletsByProfile(profileReference);
    console.log('Profile wallets:', wallets);
    return wallets;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw error;
  }
}

// Example: Create a wallet
async function createWallet(profileReference: string, network: 'tBTC'  | 'tETH' = 'tETH'): Promise<SuccessResponse> {
  try {
    const wallet = await client.wallets.createWallet({
      reference: profileReference,
      network,
    });
    console.log('Created wallet:', wallet);
    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

// Example: Get addresses for a profile
async function getProfileAddresses(profileReference: string): Promise<PaginatedResponse> {
  try {
    const addresses = await client.addresses.getAddressForProfile({
      reference: profileReference
    });
    console.log('Profile addresses:', addresses);
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}

// Example: Create a new address (V2 API - recommended)
async function createAddress(profileReference: string, network: 'tBTC' | 'tETH' = 'tETH'): Promise<SuccessResponse> {
  try {
    const address = await client.addresses.createAddressV2({
      reference: profileReference,
      network,
      clientShare: '1234567890'
    });
    console.log('Created address:', address);
    return address;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
}

// Example: Get transactions
async function getTransactions(profileReference: string): Promise<PaginatedResponse> {
  try {
    const transactions = await client.transactions.getTransactionsByProfile({
      reference: profileReference
    });
    console.log('Transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

// Example: Portfolio - Get assets
async function getAssets(address?: string, walletId?: string): Promise<PaginatedResponse> {
  try {
    const assets = await client.portfolio.getAssets({
      address,
      walletId
    });
    console.log('Assets:', assets);
    return assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

// Example: Portfolio - Get native balance
async function getNativeBalance(network: string, address?: string, walletId?: string): Promise<SuccessResponse> {
  try {
    const balance = await client.portfolio.getNativeBalance({
      network,
      address,
      walletId
    });
    console.log('Native balance:', balance);
    return balance;
  } catch (error) {
    console.error('Error fetching native balance:', error);
    throw error;
  }
}

// Example: Tokenization - Get collections
async function getCollections(): Promise<PaginatedResponse> {
  try {
    const collections = await client.tokenization.getCollections();
    console.log('Collections:', collections);
    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

// Example: Create a collection
async function createCollection(addressId: string, clientShare: string, displayName?: string): Promise<SuccessResponse> {
  try {
    const collection = await client.tokenization.createCollection({
      type: 'NON_FUNGIBLE_TOKEN',
      addressId,
      clientShare,
      createParams: {
        initializeParams: [{
          name: 'name',
          type: 'type',
          value: 'value'
        }]
      },
      displayName,
    });
    console.log('Created collection:', collection);
    return collection;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}

// Example: Contract interactions - Read function
async function readContractFunction(network: string, contractAddress: string, functionName: string, parameters: string[] = []): Promise<SuccessResponse> {
  try {
    const result = await client.contractInteractions.readCallFunction(
      network,
      contractAddress,
      {
        abiFunction: {
          name: functionName,
          inputs: parameters.map((param, index) => ({
            name: `param${index}`,
            type: 'string'
          })),
          outputs: [],
          type: 'function'
        },
        parameters: parameters
      }
    );
    console.log('Contract read result:', result);
    return result;
  } catch (error) {
    console.error('Error reading contract function:', error);
    throw error;
  }
}

// Example: Contract interactions - Write function
async function writeContractFunction(network: string, contractAddress: string, functionName: string, addressId: string, parameters: string[] = [], value?: string): Promise<SuccessResponse> {
  try {
    const result = await client.contractInteractions.writeCallFunction(
      network,
      contractAddress,
      {
        addressId,
        clientShare: 'your-client-share', // Required for write operations
        abiFunction: {
          name: functionName,
          inputs: parameters.map((param, index) => ({
            name: `param${index}`,
            type: 'string'
          })),
          outputs: [],
          type: 'function'
        },
        parameters: parameters,
        amount: value,
      }
    );
    console.log('Contract write result:', result);
    return result;
  } catch (error) {
    console.error('Error writing contract function:', error);
    throw error;
  }
}

// Example workflow: Complete setup
async function completeSetup(): Promise<{ profile: SuccessResponse; wallet: SuccessResponse; address: SuccessResponse; addresses: PaginatedResponse; }> {
  try {
    // 1. Create a profile
    const profile = await createProfile('my-org-reference', 'User');
    
    // 2. Create a wallet for the profile
    const wallet = await createWallet('my-org-reference', 'tETH');
    
    // 3. Create an address for the profile
    const address = await createAddress('my-org-reference', 'tETH');
    
    // 4. Get all addresses for the profile
    const addresses = await getProfileAddresses('my-org-reference');
    
    console.log('Setup complete!');
    console.log('Profile:', profile);
    console.log('Wallet:', wallet);
    console.log('Address:', address);
    console.log('All addresses:', addresses);
    
    return { profile, wallet, address, addresses };
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}



// Export examples for use in other files
export {
  getProfiles,
  createProfile,
  getProfileWallets,
  createWallet,
  getProfileAddresses,
  createAddress,
  getTransactions,
  getAssets,
  getNativeBalance,
  getCollections,
  createCollection,
  readContractFunction,
  writeContractFunction,
  completeSetup,
};

// Example usage (uncomment to run)
// completeSetup().catch(console.error);
