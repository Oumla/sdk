import { Base } from './base';
import * as Types from './types';
import {
    GenerateWalletSchema,
    GenerateAddressSchema,
    CreateProfileSchema,
    CreateTransactionSchema,
} from './schemas';
import { TGetWallets } from './types';

/**
 * Oumla SDK
 * @param apiKey - Your API key
 * @param baseUrl - The base URL of the API
 * @param env - The environment of the API
 * @example
 * ```ts
 *
 * const client = new Oumla({
 *  apiKey: 'YOUR_API_KEY',
 *  baseUrl: 'https://sandbox.oumla.com',
 *  env: 'testnet',
 * })
 * ```
 */
export class Oumla extends Base {
    constructor(configs: Types.TBaseConfigs) {
        super(configs);
    }

    /**
     *
     * Generate a wallet for a profile
     *
     * @param {string} args.reference - The reference of the profile
     * @param {string} args.network - The network to generate a wallet for
     *
     * @example
     * ``` ts
     *
     * const wallet = await client.generateWallet({
     * reference: 'PROFILE_REFERENCE',
     * network: 'BTC',
     * });
     *
     * ```
     *
     * @returns {Types.TGenerateWalletResponse} - The generated wallet or an error
     *
     */
    async generateWallet(
        args: Types.TGenerateWalletArgs
    ): Promise<Types.TGenerateWalletResponse> {
        return await this.httpRequest({
            method: 'POST',
            path: '/api/v1/wallets/generate',
            body: args,
            schema: GenerateWalletSchema,
        });
    }

    /**
     *
     * Get wallets for an organization
     *
     * @param {string} args.reference - The reference of the profile
     * @param {Types.TPagination} [pagination] - Pagination options
     *
     * @example
     * ``` ts
     *
     * const wallets = await client.getWallets({
     * skip: 0,
     * take: 3,
     * });
     *
     * ```
     *
     * @returns {Types.TGetWalletsResponse} - The wallets for the organization
     *
     */
    async getWallets(
        args?: Types.TGetWallets,
        pagination?: Types.TPagination
    ): Promise<Types.TGetWalletsResponse> {
        if (args?.reference) {
            return await this.httpRequest({
                path: `/api/v1/wallets/profile/${args.reference}`,
                pagination,
            });
        } else {
            return await this.httpRequest({
                path: '/api/v1/wallets/organization',
                pagination,
            });
        }
    }

    /**
     *
     * Generate an address for a profile
     *
     * @param {string} args.reference - The reference of the profile
     * @param {string} args.network - The network to generate an address for
     *
     * @example
     * ``` ts
     *
     * const address = await client.generateAddress({
     * reference: 'PROFILE_REFERENCE',
     * network: 'BTC',
     * });
     *
     * ```
     *
     * @returns {Types.TGenerateAddressResponse} - The generated address
     */
    async generateAddress(
        args: Types.TGenerateAddressArgs
    ): Promise<Types.TGenerateAddressResponse> {
        return await this.httpRequest({
            method: 'POST',
            path: '/api/v1/address/generate',
            body: args,
            schema: GenerateAddressSchema,
        });
    }

    /**
     *
     * Get addresses
     *
     * @param {string} args.reference - The reference of the profile, Optional
     * @param {Types.TPagination} [pagination] - Pagination options
     * @example
     * ``` ts
     *
     * const addresses = await client.getAddresses({
     * reference: 'PROFILE_REFERENCE',
     * },
     *  {
     * skip: 0,
     * take: 3,
     * }
     * );
     *
     * ```
     *
     * @returns {Types.TGetProfileAddressesResponse} - The addresses for the profile
     */
    async getAddresses(
        args?: Types.TGetAddresses,
        pagination?: Types.TPagination
    ): Promise<Types.TGetAddressesResponse> {
        if (args?.reference) {
            return await this.httpRequest({
                path: `/api/v1/addresses/${args.reference}`,
                pagination,
            });
        } else {
            return await this.httpRequest({
                path: '/api/v1/addresses/organization',
                pagination,
            });
        }
    }

    /**
     *
     * Get the organization's information
     *
     * @example
     * ``` ts
     *
     * const organization = await client.getOrganization();
     *
     * ```
     *
     * @returns {Types.TGetOrganizationResponse} - The organization's information
     */
    async getOrganization(): Promise<Types.TGetOrganizationResponse> {
        return await this.httpRequest({
            path: '/api/v1/organizations',
        });
    }

    /**
     *
     * Create a profile
     *
     * @param {string} args.reference - The reference of the profile
     * @param {Types.TCreateProfileArgs['type']} args.type - The type of the profile
     *
     * @example
     * ``` ts
     *
     * const profile = await client.createProfile({
     * reference: 'PROFILE_REFERENCE',
     * type: 'User',
     * });
     *
     * ```
     *
     * @returns {Types.TCreateProfileResponse} - The created profile
     */
    async createProfile(
        args: Types.TCreateProfileArgs
    ): Promise<Types.TCreateProfileResponse> {
        return await this.httpRequest({
            method: 'POST',
            path: '/api/v1/profiles',
            body: args,
            schema: CreateProfileSchema,
        });
    }

    /**
     *
     *  Get the profiles for an organization
     *
     * @param {Types.TPagination} [pagination] - Pagination options
     *
     * @example
     * ``` ts
     *
     * const profiles = await client.getProfiles({
     * skip: 0,
     * take: 3,
     * });
     *
     * ```
     *
     * @returns {Types.TGetProfilesResponse} - The profiles for the organization
     */
    async getProfiles(
        pagination?: Types.TPagination
    ): Promise<Types.TGetProfilesResponse> {
        return await this.httpRequest({
            path: '/api/v1/profiles',
            pagination,
        });
    }

    /**
     *
     * Get the volume for an organization
     *
     * @example
     * ``` ts
     *
     * const volume = await client.getVolume();
     *
     * ```
     *
     * @returns {Types.TGetVolumeResponse} - The volume of the organization
     */
    async getVolume(): Promise<Types.TGetVolumeResponse> {
        return await this.httpRequest({
            path: '/api/v1/statistics/organization/volume',
        });
    }

    /**
     *
     * Get the insights for an organization
     *
     * @example
     * ``` ts
     *
     * const insights = await client.getInsights();
     *
     * ```
     *
     * @returns {Types.TGetInsightsResponse} - The insights of the organization
     */
    async getInsights(): Promise<Types.TGetInsightsResponse> {
        return await this.httpRequest({
            path: '/api/v1/statistics/organization/insights',
        });
    }

    /**
     *
     * Get the all the transactions or transactions for an address, wallet or reference
     *
     * By providing more than one option, only one will be used.
     *
     * @param {string} [args.address] - The address to get transactions for
     * @param {string} [args.wallet] - The wallet to get transactions for
     * @param {string} [args.reference] - The reference to get transactions for
     * @param {Types.TPagination} [pagination] - Pagination options
     *
     * @example
     * ``` ts
     *
     * const transactionsByAddress = await client.getTransactions({
     * address: 'ADDRESS',
     * });
     *
     * ```
     *
     * @returns {Types.TGetTransactionsResponse} - The transactions
     *
     */
    async getTransactions(
        args?: Types.TGetTransactionsArgs,
        pagination?: Types.TPagination
    ): Promise<Types.TGetTransactionsResponse> {
        if (args?.address) {
            return await this.httpRequest({
                path: `/api/v1/transactions/address/${args.address}`,
                pagination,
            });
        } else if (args?.wallet) {
            return await this.httpRequest({
                path: `/api/v1/transactions/wallet/${args.wallet}`,
                pagination,
            });
        } else if (args?.reference) {
            return await this.httpRequest({
                path: `/api/v1/transactions/profile/${args.reference}`,
                pagination,
            });
        } else {
            return await this.httpRequest({
                path: '/api/v1/transactions/organization',
                pagination,
            });
        }
    }

    /**
     * create transaction
     *
     * @param  args.from - the address or addresses to transfer from
     * @param  args.to - The desired address to transfer to
     * @param  args.amount - The amount to transfer
     *
     * @example
     *
     * ``` ts
     *
     * const transfer = await client.transfer({
     * from: '0x...',
     * to: '0x...',
     * reference: '0x...',
     * amount: 100,
     * });
     *
     * ```
     */
    async createTransaction(
        args: Types.TCreateTransactionArgs
    ): Promise<Types.TTransferResponse> {
        return await this.httpRequest({
            method: 'POST',
            path: '/api/v1/withdraw',
            body: args,
            schema: CreateTransactionSchema,
        });
    }
}
