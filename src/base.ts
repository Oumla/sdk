import { z } from 'zod';
import { THttpError, THttpRequestArgs, TBaseConfigs } from './types';
import { HttpError } from './httpError';

// Define a union type for all possible error types
type ErrorType =
    | 'ValidationError'
    | 'AuthenticationError'
    | 'NotFoundError'
    | 'ServerError'
    | 'UnknownError';

// Define an interface for the structured error
interface StructuredError {
    type: ErrorType;
    message: string;
    status: number;
    path: string;
    details?: unknown;
}

export abstract class Base {
    protected apiKey: string;
    protected baseUrl: string;
    protected env: string;

    constructor(configs: TBaseConfigs) {
        this.apiKey = configs.apiKey;
        this.baseUrl = configs.baseUrl || 'https://sandbox.oumla.com';
        this.env = configs.env || 'testnet';
    }

    protected getCustomHeaders(): Record<string, string> {
        return {};
    }

    protected async httpRequest<T>(args: THttpRequestArgs): Promise<T> {
        try {
            if (args.body && args.schema) {
                this.parseInput(args.body, args.schema);
            }

            const paginationOpts = args.pagination
                ? `?skip=${args.pagination.skip || 0}&take=${
                      args.pagination.take || 10
                  }`
                : '';
            const URL = `${this.baseUrl}${args.path}${paginationOpts}`;

            const headers = {
                'x-api-key': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...this.getCustomHeaders(),
                ...args.headers,
            };

            const config = {
                headers,
                method: args.method || 'GET',
                body: args.body ? JSON.stringify(args.body) : undefined,
            };

            const res = await fetch(URL, config);

            if (!res.ok) {
                const structuredError = await this.handleHttpError(res, args.path);
                throw new HttpError(structuredError);
            }

            return await res.json();
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            } else if (error instanceof z.ZodError) {
                throw this.createStructuredError(
                    'ValidationError',
                    'Input validation failed',
                    400,
                    args.path,
                    error.errors
                );
            } else {
                throw this.createStructuredError(
                    'UnknownError',
                    'An unexpected error occurred',
                    500,
                    args.path,
                    error
                );
            }
        }
    }

    private async handleHttpError(
        res: Response,
        path: string
    ): Promise<StructuredError> {
        const status = res.status;
        let errorType: ErrorType;
        let message: string;
        let details: unknown;

        if (res.headers.get('content-type')?.includes('application/json')) {
            const errorResponse: THttpError = await res.json();

            message = errorResponse.message;
            details = errorResponse;

        } else {
            message = await res.text();
        }

        switch (status) {
            case 400:
            case 402:
                errorType = 'ValidationError';
                break;
            case 401:
            case 403:
                errorType = 'AuthenticationError';
                break;
            case 404:
                errorType = 'NotFoundError';
                break;
            case 500:
                errorType = 'ServerError';
                break;
            default:
                errorType = 'UnknownError';
        }

        return this.createStructuredError(
            errorType,
            message,
            status,
            path,
            details
        );
    }

    private createStructuredError(
        type: ErrorType,
        message: string,
        status: number,
        path: string,
        details?: unknown
    ): StructuredError {
        return { type, message, status, path, details };
    }

    private parseInput<T>(input: T, schema: z.Schema<T>) {
        schema.parse(input);
    }
}
