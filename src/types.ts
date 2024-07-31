import { z } from 'zod';
import * as schemas from './schemas';

export type TBaseConfigs = {
    apiKey: string;
    baseUrl?: string;
    env?: EnvType;
};

export type THttpRequestArgs = {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
    schema?: z.Schema<unknown>;
    pagination?: TPagination;
};

export type TPagination = {
    totalElements?: number;
    totalPages?: number;
    skip?: number;
    take?: number;
};

export type THttpError = {
    status?: number;
    message: string;
    success?: boolean;
    path: string;
};

export enum ProfileType {
    User = 'User',
    Department = 'Department',
    Merchant = 'Merchant',
}

export enum Network {
    BTC = 'BTC',
    ETH = 'ETH',
}

export type PaymentType = 'Withdraw' | 'Deposit';
export type PaymentStatus = 'Pending' | 'Confirmed';
export type AssetType = 'Token' | 'NFT';
export type TransactionType = 'withdraw' | 'deposit';
export type TransactionStatus = 'pending' | 'confirmed';

export type Tags = {
    name: string;
    address: Address[];
};

export type Organization = {
    name: string;
    email: string;
};

export type Profile = {
    reference: string;
    userIndex: number;
    currentIndex: number;
    organizationId: string;
    type: ProfileType;
    label?: string;
};

export type MiniWallet = {
    date: Date;
    organizationId: string;
    reference: string;
    index: number;
    currentDeepIndex: number;
    address: Address[];
    transaction: Transaction[];
    type: ProfileType;
    WalletCoinType: Network;
};

export type Address = {
    address: string;
    date: Date;
    index: number;
    label?: string;
    Transaction: Transaction[];
    Tags: Tags[];
    network: Network;
    balance: number;
    reference: string;
};

export type Transaction = {
    date: Date;
    amount: number;
    txid: string;
    addressTo?: string;
    addressFrom?: string;
    type: PaymentType;
    isSpent: boolean;
    isMempool: boolean;
    status: PaymentStatus;
    organizationId?: string;
    addressId: string;
};

export type Insights = {
    totalVolume: number;
    organizationId: string;
    volumeByDay: VolumeByDay[];
};

export type VolumeByDay = {
    totalVolume: number;
    organizationId: string;
    insightsId?: string;
};

export type TGetWalletsResponse = {
    createdAt: Date;
    updated_at: Date;
    isActive: boolean;
    isVerified: boolean;
    reference: string;
    currentIndex: number;
    type: ProfileType;
    label: string | null;
    miniWallets: MiniWallet[];
}[];

export type Wallet = {
    id: string;
    date: Date;
    organizationId: string;
    reference: string;
    index: number;
    currentDeepIndex: number;
    type: z.infer<typeof schemas.ProfileTypeSchema>;
    WalletCoinType: z.infer<typeof schemas.NetworkSchema>;
    createdAt: Date;
    updatedAt: Date;
};

export type TGetProfileWalletsResponse = {
    reference: string;
};

export type TGenerateAddressResponse = {
    data: string;
    message: string;
    success: boolean;
    status: number;
};

export type TGetAddressesResponse = {
    address: string;
    date: Date;
    label: string | null;
    sub: string;
    network: Network;
    balance: number;
    reference: string;
}[];

export type TGetOrganizationResponse = {
    id: string;
    name: string;
    email: string;
};

export type TGetOumlaResponse<T> = {
    data: T;
    success: boolean;
    status: number;
    pagination: TPagination;
};

export type TCreateProfileResponse = {
    message: string;
    data: { reference: string; type: string };
    success: boolean;
    status: number;
};

export type TGetProfilesResponse = {
    createdAt: Date;
    updated_at: Date;
    organizationId: string;
    type: ProfileType;
    label: string | null;
    reference: string;
    miniWallets: MiniWallet[];
    addressesCount: number;
}[];

export type TGetVolumeResponse = {
    createdAt: Date;
    updatedAt: Date;
    totalVolume: number;
    organizationId: string;
    insightsId: string | null;
}[];

export type TGetInsightsResponse = {
    volumeByDay: {
        createdAt: Date;
        totalVolume: number;
    }[];
    totalVolume: number;
} | null;

export type TGetTransactionsResponse = {
    id: string;
    date: Date;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    txid: string;
    addressTo: string | null;
    addressFrom: string | null;
    isSpent: boolean;
    isMempool: boolean;
}[];

export type TTransferResponse = {
    id: string;
    status: string;
};

export type TGenerateWalletResponse = {
    reference: string;
    network: Network;
    type: ProfileType;
    date: Date;
};
// Wallets
export type TGenerateWalletArgs = z.infer<typeof schemas.GenerateWalletSchema>;
export type TGetProfileWalletsArgs = z.infer<
    typeof schemas.GetProfileWalletsSchema
>;

// Transactions
export type TGetTransactionsByAddressArgs = z.infer<
    typeof schemas.GetTransactionsByAddressSchema
>;
export type TGetTransactionsByReferenceArgs = z.infer<
    typeof schemas.GetTransactionsByReferenceSchema
>;
export type TGetTransactionsByWalletArgs = z.infer<
    typeof schemas.GetTransactionsByWalletSchema
>;
export type TGetTransactionsArgs = z.infer<
    typeof schemas.GetTransactionsSchema
>;

// Addresses
export type TGenerateAddressArgs = z.infer<
    typeof schemas.GenerateAddressSchema
>;
export type TGetAddressesArgs = z.infer<typeof schemas.GetAddressesSchema>;
export type TGetProfileAddressesArgs = z.infer<
    typeof schemas.GetProfileAddressesSchema
>;
export type TGetAddresses = z.infer<typeof schemas.GetAddressSchema>;

// Profiles
export type TCreateProfileArgs = z.infer<typeof schemas.CreateProfileSchema>;
export type TGetProfilesArgs = z.infer<typeof schemas.GetProfilesSchema>;

// Statistics
export type TGetVolumeArgs = z.infer<typeof schemas.GetVolumeSchema>;
export type TGetInsightsArgs = z.infer<typeof schemas.GetInsightsSchema>;

// Withdraws

export type TCreateTransactionArgs = z.infer<
    typeof schemas.CreateTransactionSchema
>;

// Organization
export type TGetOrganizationArgs = z.infer<
    typeof schemas.GetOrganizationSchema
>;
export type TGetOrganizationDashboardArgs = z.infer<
    typeof schemas.GetOrganizationDashboardSchema
>;
export type TGetWallets = z.infer<typeof schemas.GetWalletsSchema>;

export type EnvType = 'testnet' | 'mainnet';
