import { Base } from './base';
import * as Types from './types';
import {
    GenerateWalletSchema,
    GenerateAddressSchema,
    CreateProfileSchema,
    CreateTransactionSchema,
} from './schemas';

export type OumlaOptions = {
    apiKey: string;
    baseUrl?: string;
    env?: 'testnet' | 'mainnet';
};

export class Oumla extends Base {
    private static readonly CURRENT_VERSION = '1.0.0'; // Update this with each release
    private lastUpdateCheck: number = 0;
    private readonly UPDATE_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

    constructor(opts: OumlaOptions) {
        super({
            apiKey: opts.apiKey,
            baseUrl: opts.baseUrl,
            env: opts.env,
        });
        this.apiKey = opts.apiKey;
        this.baseUrl = opts.baseUrl || 'https://api.oumla.com';
        this.env = opts.env || 'testnet';
        this.initialize();
    }

    private async initialize() {
        await this.checkForUpdates();
    }

    protected getCustomHeaders(): Record<string, string> {
        return {
            'x-sdk-version': Oumla.CURRENT_VERSION,
        };
    }

    private async checkForUpdates() {
        const now = Date.now();
        if (now - this.lastUpdateCheck < this.UPDATE_CHECK_INTERVAL) {
            return; // Skip if checked recently
        }

        try {
            const response = await this.httpRequest<{ latestVersion: string }>({
                path: '/api/v1/sdk-version',
                method: 'GET',
            });

            if (response.latestVersion !== Oumla.CURRENT_VERSION) {
                console.log(
                    `A new version (${response.latestVersion}) of the Oumla SDK is available. Please update.`
                );
            }
            this.lastUpdateCheck = now;
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }

    public wallets = {
        generate: async (
            args: Types.TGenerateWalletArgs
        ): Promise<Types.TGetOumlaResponse<Types.TGenerateWalletResponse>> => {
            
            return this.httpRequest({
                path: '/api/v1/wallets/generate',
                method: 'POST',
                body: args,
                schema: GenerateWalletSchema,
            });
        },
        get: async (
            args?: Types.TGetWallets,
            pagination?: Types.TPagination
        ): Promise<Types.TGetOumlaResponse<Types.TGetWalletsResponse>> => {
            const path = args?.reference
                ? `/api/v1/wallets/profile/${args.reference}`
                : '/api/v1/wallets/organization';
            return this.httpRequest({
                path,
                method: 'GET',
                pagination,
            });
        },
    };

    public addresses = {
        generate: async (
            args: Types.TGenerateAddressArgs
        ): Promise<Types.TGenerateAddressResponse> => {
            
            return this.httpRequest({
                path: '/api/v1/address/generate',
                method: 'POST',
                body: args,
                schema: GenerateAddressSchema,
            });
        },
        get: async (
            args?: Types.TGetAddresses,
            pagination?: Types.TPagination
        ): Promise<Types.TGetOumlaResponse<Types.TGetAddressesResponse>> => {
            const path = args?.reference
                ? `/api/v1/addresses/${args.reference}`
                : '/api/v1/addresses/organization';
            return this.httpRequest({
                path,
                method: 'GET',
                pagination,
            });
        },
    };

    public profiles = {
        create: async (
            args: Types.TCreateProfileArgs
        ): Promise<Types.TCreateProfileResponse> => {
            
            return this.httpRequest({
                path: '/api/v1/profiles',
                method: 'POST',
                body: args,
                schema: CreateProfileSchema,
            });
        },
        get: async (
            pagination?: Types.TPagination
        ): Promise<Types.TGetOumlaResponse<Types.TGetProfilesResponse>> => {
            return this.httpRequest({
                path: '/api/v1/profiles',
                method: 'GET',
                pagination,
            });
        },
    };

    public organization = {
        get: async (): Promise<
            Types.TGetOumlaResponse<Types.TGetOrganizationResponse>
        > => {
            return this.httpRequest({
                path: '/api/v1/organizations',
                method: 'GET',
            });
        },
        volume: async (): Promise<
            Types.TGetOumlaResponse<Types.TGetVolumeResponse>
        > => {
            return this.httpRequest({
                path: '/api/v1/statistics/organization/volume',
                method: 'GET',
            });
        },
        insights: async (): Promise<
            Types.TGetOumlaResponse<Types.TGetInsightsResponse>
        > => {
            return this.httpRequest({
                path: '/api/v1/statistics/organization/insights',
                method: 'GET',
            });
        },
    };

    public transactions = {
        create: async (
            args: Types.TCreateTransactionArgs
        ): Promise<Types.TTransferResponse> => {
            
            return this.httpRequest({
                path: '/api/v1/withdraw/address',
                method: 'POST',
                body: args,
                schema: CreateTransactionSchema,
            });
        },
        get: async (
            args?: Types.TGetTransactionsArgs,
            pagination?: Types.TPagination
        ): Promise<Types.TGetOumlaResponse<Types.TGetTransactionsResponse>> => {
            let path = '/api/v1/transactions/organization';
            if (args?.address) {
                path = `/api/v1/transactions/address/${args.address}`;
            } else if (args?.wallet) {
                path = `/api/v1/transactions/wallet/${args.wallet}`;
            } else if (args?.reference) {
                path = `/api/v1/transactions/profile/${args.reference}`;
            }
            return this.httpRequest({
                path,
                method: 'GET',
                pagination,
            });
        },
    };
}
