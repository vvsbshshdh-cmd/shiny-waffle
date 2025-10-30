export function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func: Function, limit: number) {
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    return function executedFunction(...args: any[]) {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

export function isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\\.)+[a-z]{2,6}|localhost|' + // domain name
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // OR ip (v4) address
        '\\[?[a-f0-9]*:[a-f0-9:%.~]*\\]?)' + // OR ip (v6) address
        '(\\:\\d+)?(\\/[-a-z0-9+&@#/%=~_|$?!:.]*[a-z0-9+&@#/%=~_|$])?$', 'i'); // port and path
    return !!pattern.test(url);
}

export function parseJsonSafe(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Invalid JSON string:", jsonString);
        return null;
    }
}