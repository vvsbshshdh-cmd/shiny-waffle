import { RateLimiter } from './rateLimiter';

export class NetworkMonitor {
    private requests: Map<string, RequestInfo>;
    private rateLimiter: RateLimiter;

    constructor() {
        this.requests = new Map();
        this.rateLimiter = new RateLimiter();
    }

    public trackRequest(requestId: string, url: string, method: string): void {
        if (this.rateLimiter.allowRequest()) {
            const requestInfo: RequestInfo = { url, method, timestamp: Date.now() };
            this.requests.set(requestId, requestInfo);
            console.log(`Tracking request: ${requestId} - ${method} ${url}`);
        } else {
            console.warn(`Rate limit exceeded for request: ${requestId}`);
        }
    }

    public trackResponse(requestId: string, status: number): void {
        const requestInfo = this.requests.get(requestId);
        if (requestInfo) {
            console.log(`Response for request: ${requestId} - Status: ${status}`);
            this.requests.delete(requestId);
        } else {
            console.warn(`No request found for ID: ${requestId}`);
        }
    }

    public getRequestInfo(requestId: string): RequestInfo | undefined {
        return this.requests.get(requestId);
    }

    public clearRequests(): void {
        this.requests.clear();
        console.log('Cleared all tracked requests');
    }
}

interface RequestInfo {
    url: string;
    method: string;
    timestamp: number;
}