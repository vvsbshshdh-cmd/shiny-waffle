export interface NetworkRequest {
    id: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    body?: string;
    timestamp: number;
}

export interface NetworkResponse {
    requestId: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body?: string;
    timestamp: number;
}

export interface Message<T = any> {
    type: string;
    payload: T;
}

export interface RateLimitConfig {
    maxRequests: number;
    timeWindow: number; // in milliseconds
}

export type Callback<T> = (data: T) => void;