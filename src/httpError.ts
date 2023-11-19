import { THttpError } from './types';

export class HttpError extends Error{
    public readonly status: number;
    public readonly success: boolean;
    public readonly path: string;
    
    constructor(error: THttpError) {
        super(error.message || "An HTTP error occurred");
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "HttpError";
        this.status = error.status || 502;
        this.success = error.success || false;
        this.path = error.path || "/";
        Error.captureStackTrace(this, this.constructor);
    };

    toString(): string { 
        return `${this.name}: ${this.message} - Status: ${this.status} - Success: ${this.success}` ;
    };
};