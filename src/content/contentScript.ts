// This file contains the content script that interacts with web pages. 
// It injects functionality into the pages and communicates with the background script.

import { sendMessage } from '../shared/messaging';
import { NetworkMonitor } from '../services/networkMonitor';

// Initialize the network monitor
const networkMonitor = new NetworkMonitor();

// Function to handle network requests
const handleNetworkRequest = (request: any) => {
    // Monitor the request (use optional chaining / fallbacks to avoid TS/runtime errors)
    try {
        if (typeof (networkMonitor as any).trackRequest === 'function') {
            (networkMonitor as any).trackRequest(request);
        } else if (typeof (networkMonitor as any).track === 'function') {
            (networkMonitor as any).track(request);
        }
    } catch (err) {
        // ignore monitoring errors in content script
    }

    // Send a message to the background script (safe call)
    try {
        sendMessage({ type: 'NETWORK_REQUEST', payload: request });
    } catch (err) {
        // ignore send errors
    }
};

// Function to handle network responses
const handleNetworkResponse = (response: any) => {
    try {
        if (typeof (networkMonitor as any).trackResponse === 'function') {
            (networkMonitor as any).trackResponse(response);
        } else if (typeof (networkMonitor as any).trackResp === 'function') {
            (networkMonitor as any).trackResp(response);
        }
    } catch (err) {
        // ignore
    }

    try {
        sendMessage({ type: 'NETWORK_RESPONSE', payload: response });
    } catch (err) {
        // ignore
    }
};

// Listen for network requests (wrap and normalize inputs)
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args: any[]) => {
    // normalize request info (Request | URL string)
    const requestInfo = (args[0] instanceof Request)
        ? args[0]
        : { url: String(args[0]), method: (args[1] && (args[1] as RequestInit).method) || 'GET' };

    try {
        handleNetworkRequest(requestInfo);
    } catch (err) { /* ignore */ }

    const response = await originalFetch(...args);

    try {
        handleNetworkResponse(response);
    } catch (err) { /* ignore */ }

    return response;
};

// Listen for XMLHttpRequest
const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (this: any, ...args: any[]) {
    this.addEventListener('load', () => {
        try {
            const req = { url: args[1], method: args[0] };
            handleNetworkRequest(req);
        } catch (err) { /* ignore */ }

        try {
            handleNetworkResponse(this);
        } catch (err) { /* ignore */ }
    });
    return originalXhrOpen.apply(this, args);
};

// Additional functionality can be added here as needed.