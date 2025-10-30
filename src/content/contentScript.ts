// This file contains the content script that interacts with web pages. 
// It injects functionality into the pages and communicates with the background script.

import { sendMessage } from '../shared/messaging';
import { NetworkMonitor } from '../services/networkMonitor';

// Initialize the network monitor
const networkMonitor = new NetworkMonitor();

// Function to handle network requests
const handleNetworkRequest = (request: Request) => {
    // Monitor the request
    networkMonitor.trackRequest(request);
    
    // Send a message to the background script
    sendMessage({ type: 'NETWORK_REQUEST', payload: request });
};

// Function to handle network responses
const handleNetworkResponse = (response: Response) => {
    // Monitor the response
    networkMonitor.trackResponse(response);
    
    // Send a message to the background script
    sendMessage({ type: 'NETWORK_RESPONSE', payload: response });
};

// Listen for network requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    handleNetworkRequest(args[0]);
    handleNetworkResponse(response);
    return response;
};

// Listen for XMLHttpRequest
const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (...args) {
    this.addEventListener('load', () => {
        handleNetworkRequest({ url: args[1], method: args[0] });
        handleNetworkResponse(this);
    });
    originalXhrOpen.apply(this, args);
};

// Additional functionality can be added here as needed.