import { z } from 'zod';
import { ProfileType } from './types';

export const NetworkSchema = z.enum(['BTC', 'ETH']);

export const ProfileTypeSchema = z.enum(['User', 'Department', 'Merchant']);

export const GetWalletsSchema = z.object({
    reference: z.string(),
});

export const GetProfileWalletsSchema = z.object({
    reference: z.string(),
});

export const GenerateWalletSchema = z.object({
    network: NetworkSchema,
    reference: z.string(),
});

export const GetTransactionsByAddressSchema = z.object({
    baseUrl: z.string(),
    address: z.string(),
    apiKey: z.string(),
});

export const GetTransactionsByWalletSchema = z.object({
    baseUrl: z.string(),
    wallet: z.string(),
    apiKey: z.string(),
});

export const GetTransactionsByReferenceSchema = z.object({
    baseUrl: z.string(),
    reference: z.string(),
    apiKey: z.string(),
});

export const GetTransactionsSchema = z
    .object({
        address: z.string(),
        wallet: z.string(),
        reference: z.string(),
    })
    .partial();

export const GenerateAddressSchema = z.object({
    network: NetworkSchema,
    reference: z.string(),
});

export const GetAddressesSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});

export const GetProfileAddressesSchema = z.object({
    reference: z.string(),
});

export const GetAddressSchema = z.object({
    reference: z.string(),
});

export const CreateProfileSchema = z.object({
    reference: z.string(),
    type: z.enum(['User', 'Department', 'Merchant']),
});

export const GetProfilesSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});

export const GetVolumeSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});

export const GetInsightsSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});

export const CreateTransactionSchema = z.object({
    to: z.string(),
    amount: z.number(),
    from: z.array(z.string()),
    network: NetworkSchema,
});

export const GetOrganizationSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});

export const GetOrganizationDashboardSchema = z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
});
