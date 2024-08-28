import { z } from 'zod';
import { THttpError, THttpRequestArgs, TBaseConfigs } from './types';
import { HttpError } from './httpError';

export abstract class Base {
    protected apiKey: string;
    protected baseUrl: string;
    protected env: string;

    constructor(configs: TBaseConfigs) {
        this.apiKey = configs.apiKey;
        this.baseUrl = configs.baseUrl || 'https://sandbox.oumla.com';
        this.env = configs.env || 'testnet';
    }

    // Add this method to get custom headers
    protected getCustomHeaders(): Record<string, string> {
        return {};
    }

    protected async httpRequest<T>(args: THttpRequestArgs): Promise<T> {
        if (args.body && args.schema) {
            this.parseInput(args.body, args.schema);
        }

        const paginationOpts = args.pagination
            ? `?skip=${args.pagination.skip || 0}&take=${args.pagination.take || 10}`
            : '';
        const URL = `${this.baseUrl}${args.path}${paginationOpts}`;

        // Merge default headers with custom headers
        const headers = {
            'x-api-key': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...this.getCustomHeaders(),  // Include custom headers
            ...args.headers  // Allow overriding headers for specific requests if needed
        };

        const config = {
            headers,
            method: args.method || 'GET',
            body: args.body ? JSON.stringify(args.body) : undefined,
        };

        const res = await fetch(URL, config);

        if (!res.ok) {
            if (res.headers.get('content-type')?.includes('application/json')) {
                const errorResponse: THttpError = await res.json();
                throw new HttpError(errorResponse);
            }

            const errorResponse: THttpError = {
                message: await res.text(),
                status: res.status,
                success: false,
                path: args.path,
            };

            throw new HttpError(errorResponse);
        }

        return await res.json();
    }

    private parseInput<T>(input: T, schema: z.Schema<T>) {
        schema.parse(input);
    }
}