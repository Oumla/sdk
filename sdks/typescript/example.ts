/**
 * Oumla TypeScript SDK — Usage Examples
 *
 * Demonstrates production-ready patterns for integrating with the Oumla API.
 * All async operations that return a workflowResult must be polled via the Temporal resource.
 */

import {
  OumlaSdkApiClient,
  OumlaSdkApiEnvironment,
  OumlaSdkApiError,
  OumlaSdkApiTimeoutError,
} from '@oumla/sdk';

// ─── Client Initialization ────────────────────────────────────────────────────

const client = new OumlaSdkApiClient({
  apiKey: 'OUMLA_API_KEY',
  environment: OumlaSdkApiEnvironment.Mainnet,
});

// ─── Temporal Workflow Helper ─────────────────────────────────────────────────

/**
 * Polls a temporal workflow until it reaches a terminal state.
 * Use this after any operation that returns a workflowResult.workflowId.
 */
async function waitForWorkflow(workflowId: string, pollIntervalMs = 2000): Promise<Record<string, unknown> | undefined> {
  while (true) {
    const status = await client.temporal.getWorkflowStatus(workflowId);

    if (status.status === 'COMPLETED') return status.result;

    if (status.status === 'FAILED' || status.status === 'TERMINATED' || status.status === 'TIMED_OUT') {
      throw new Error(`Workflow ${workflowId} ended with status "${status.status}": ${status.error ?? 'unknown error'}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
}

// ─── Error Handling Helper ────────────────────────────────────────────────────

function handleApiError(error: unknown): never {
  if (error instanceof OumlaSdkApiTimeoutError) {
    throw new Error('Request timed out');
  }
  if (error instanceof OumlaSdkApiError) {
    throw new Error(`API Error (${error.statusCode}): ${JSON.stringify(error.body)}`);
  }
  throw error;
}

// ─── Networks ─────────────────────────────────────────────────────────────────

/**
 * List networks enabled for your organization.
 * Use the returned network IDs when creating wallets, addresses, and collections.
 */
async function getNetworks() {
  const networks = await client.networks.getNetworks({ skip: 0, take: 50, enabled: true });
  return networks;
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

async function getProfiles() {
  const profiles = await client.profiles.getProfiles({ skip: 0, take: 20 });
  return profiles;
}

async function createProfile(reference: string, type: 'User' | 'Department' | 'Merchant' = 'User') {
  try {
    const profile = await client.profiles.createProfile({ reference, type });
    return profile;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Wallets ──────────────────────────────────────────────────────────────────

async function getWalletsByProfile(profileReference: string) {
  const wallets = await client.wallets.getWalletsByProfile(profileReference);
  return wallets;
}

async function createWallet(profileReference: string, networkId: string) {
  try {
    const wallet = await client.wallets.createWallet({ reference: profileReference, networkId });
    return wallet;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Addresses ───────────────────────────────────────────────────────────────

async function getAddressesForProfile(profileReference: string) {
  const addresses = await client.addresses.getAddressForProfile(profileReference);
  return addresses;
}

/**
 * Generate a new blockchain address for a profile.
 * @param clientShare  Your client-side key share (MPC custody model).
 */
async function createAddress(profileReference: string, networkId: string, clientShare: string) {
  try {
    const address = await client.addresses.createAddressV2({ reference: profileReference, networkId, clientShare });
    return address;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Transactions ─────────────────────────────────────────────────────────────

async function getTransactionsByProfile(profileReference: string) {
  const transactions = await client.transactions.getTransactionsByProfile(profileReference);
  return transactions;
}

async function getTransactionsByAddress(address: string) {
  const transactions = await client.transactions.getTransactionsByAddress(address);
  return transactions;
}

// ─── Assets ───────────────────────────────────────────────────────────────────

async function getAssets(address: string, networkId?: string) {
  const assets = await client.assets.getAssets({ skip: 0, take: 20, address, network: networkId });
  return assets;
}

async function getNativeBalance(address: string, networkId?: string) {
  const balance = await client.assets.getNativeBalance({ skip: 0, take: 20, address, network: networkId });
  return balance;
}

// ─── Withdraw ─────────────────────────────────────────────────────────────────

/**
 * Initiate a withdrawal.
 * @param from  Input UTXOs or source addresses.
 * @param to    Destination address.
 */
async function createWithdraw(params: {
  to: string;
  from: string[];
  amount: string;
  networkId: string;
  clientShare: string;
}) {
  try {
    const withdrawal = await client.withdraw.createWithdraw(params);
    return withdrawal;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Tokenization ─────────────────────────────────────────────────────────────

async function getCollections() {
  const collections = await client.tokenization.getCollections();
  return collections;
}

/**
 * Create a new NFT collection.
 * Returns a workflowResult — poll via waitForWorkflow() until COMPLETED.
 */
async function createCollection(params: {
  networkId: string;
  addressId: string;
  clientShare: string;
  name: string;
  displayName?: string;
}) {
  try {
    const collection = await client.tokenization.createCollection({
      networkId: params.networkId,
      addressId: params.addressId,
      clientShare: params.clientShare,
      type: 'NON_FUNGIBLE_TOKEN',
      displayName: params.displayName,
      createParams: {
        initializeParams: [{ name: 'name', type: 'string', value: params.name }],
      },
    });
    return collection;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Mint a token.
 * Returns a workflowResult — poll via waitForWorkflow() until COMPLETED.
 */
async function mintToken(collectionId: string, params: {
  addressId: string;
  clientShare: string;
  to: string;
  tokenId: string;
}) {
  try {
    const mint = await client.tokenization.mintToken(collectionId, params);
    return mint;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Burn a token.
 * Returns a workflowResult — poll via waitForWorkflow() until COMPLETED.
 */
async function burnToken(collectionId: string, params: {
  addressId: string;
  clientShare: string;
  tokenId: string;
}) {
  try {
    const burn = await client.tokenization.burnToken(collectionId, params);
    return burn;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Contract Templates ───────────────────────────────────────────────────────

/**
 * Deploy a contract from a template.
 * Returns a workflowResult — polls automatically and returns the final result.
 */
async function deployContract(templateId: string, params: {
  networkId: string;
  addressId: string;
  clientShare: string;
}) {
  try {
    const deploy = await client.contractTemplates.deployContract(templateId, params);
    const result = await waitForWorkflow(deploy.workflowResult.workflowId);
    return result;
  } catch (error) {
    handleApiError(error);
  }
}

// ─── Contract Interactions ────────────────────────────────────────────────────

/**
 * Call a read-only (view/pure) contract function.
 * Each input value is encoded as a JSON-compatible Record.
 */
async function readContractFunction(networkId: string, contractAddress: string, functionName: string) {
  const result = await client.contractInteractions.readCallFunction(networkId, contractAddress, {
    abiFunction: {
      type: 'function',
      name: functionName,
      inputs: [
        { name: 'account', type: 'address', value: { raw: '0xOwnerAddress' } },
      ],
      outputs: [
        { name: '', type: 'uint256', value: {} },
      ],
    },
  });
  return result;
}

/**
 * Call a state-changing contract function.
 * Returns a workflowResult — poll via waitForWorkflow() until COMPLETED.
 */
async function writeContractFunction(networkId: string, contractAddress: string, params: {
  addressId: string;
  clientShare: string;
  functionName: string;
}) {
  const result = await client.contractInteractions.writeCallFunction(networkId, contractAddress, {
    addressId: params.addressId,
    clientShare: params.clientShare,
    abiFunction: {
      type: 'function',
      name: params.functionName,
      inputs: [
        { name: 'to',     type: 'address', value: { raw: '0xRecipientAddress' } },
        { name: 'amount', type: 'uint256', value: { raw: '1000000000000000000' } },
      ],
      outputs: [],
    },
  });
  return result;
}

// ─── End-to-End Workflow Example ──────────────────────────────────────────────

/**
 * Complete onboarding flow:
 * 1. Resolve an available network
 * 2. Create a profile
 * 3. Create a wallet
 * 4. Generate an address
 * 5. Create an NFT collection and wait for deployment
 * 6. Mint the first token
 */
async function onboardAndMintNft(profileReference: string, clientShare: string) {
  // 1. Resolve network
  const networks = await getNetworks();
  const network = networks.networks.find(n => n.enabled);
  if (!network) throw new Error('No enabled networks found for this organization');

  // 2. Create profile
  await createProfile(profileReference);

  // 3. Create wallet
  await createWallet(profileReference, network.id);

  // 4. Generate address
  const address = await createAddress(profileReference, network.id, clientShare);

  // 5. Create collection and wait for deployment
  const collection = await createCollection({
    networkId: network.id,
    addressId: address!.data!.id,
    clientShare,
    name: 'My NFT Collection',
    displayName: 'My NFT Collection',
  });
  await waitForWorkflow(collection!.workflowResult.workflowId);

  // 6. Mint first token and wait
  const mint = await mintToken(collection!.workflowResult.operationId, {
    addressId: address!.data!.id,
    clientShare,
    to: address!.data!.address,
    tokenId: '1',
  });
  await waitForWorkflow(mint!.workflowResult.workflowId);

  console.log('Onboarding complete.');
  return { address, collection, mint };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  waitForWorkflow,
  handleApiError,
  getNetworks,
  getProfiles,
  createProfile,
  getWalletsByProfile,
  createWallet,
  getAddressesForProfile,
  createAddress,
  getTransactionsByProfile,
  getTransactionsByAddress,
  getAssets,
  getNativeBalance,
  createWithdraw,
  getCollections,
  createCollection,
  mintToken,
  burnToken,
  deployContract,
  readContractFunction,
  writeContractFunction,
  onboardAndMintNft,
};

// Uncomment to run the end-to-end example:
// onboardAndMintNft('org-reference-001', 'client-share-value').catch(console.error);
