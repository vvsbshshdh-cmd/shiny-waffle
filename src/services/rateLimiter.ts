export class RateLimiter {
    private requests: number;
    private limit: number;
    private interval: number;
    private lastReset: number;

    constructor(limit: number, interval: number) {
        this.requests = 0;
        this.limit = limit;
        this.interval = interval;
        this.lastReset = Date.now();
    }

    public isAllowed(): boolean {
        const now = Date.now();
        if (now - this.lastReset > this.interval) {
            this.reset();
        }

        if (this.requests < this.limit) {
            this.requests++;
            return true;
        }

        return false;
    }

    private reset(): void {
        this.requests = 0;
        this.lastReset = Date.now();
    }
}