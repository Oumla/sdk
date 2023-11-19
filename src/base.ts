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

    /**
     *
     * A generic method to make requests to the Oumla API.
     * Keep it simple for now, could be enhanced later.
     *
     */
    protected async httpRequest<T>(args: THttpRequestArgs): Promise<T> {
        if (args.body && args.schema) {
            this.parseInput(args.body, args.schema);
        }

        // Should be page/limit & Every pagination should also return totals
        const paginationOpts = args.pagination
            ? `?skip=${args.pagination.skip || 0}&take=${
                  args.pagination.take || 10
              }`
            : '';
        const URL = `${this.baseUrl}${args.path}${paginationOpts}`;
        const config = {
            headers: {
                'x-api-key': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            method: args.method || undefined, // GET is the default in fetch
            body: args.body ? JSON.stringify(args.body) : undefined,
        };
        const res = await fetch(URL, config);

        if (!res.ok) {
            if (res.headers.get('content-type')?.includes('application/json')) {
                const errorResponse: THttpError = await res.json();
                throw new HttpError(errorResponse);
            }

            // Either returned from the gateway of a 404 error (404 route does .send() instead of .json())
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
