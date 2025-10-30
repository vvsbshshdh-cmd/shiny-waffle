import { NetworkMonitor } from '../services/networkMonitor';
import { RateLimiter } from '../services/rateLimiter';
import { sendMessage, receiveMessage } from '../shared/messaging';

const networkMonitor = new NetworkMonitor();
const rateLimiter = new RateLimiter();

chrome.runtime.onInstalled.addListener(() => {
    console.log('Network Monitor Extension installed');
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        rateLimiter.limitRequest(details);
        networkMonitor.trackRequest(details);
    },
    { urls: ['<all_urls>'] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        networkMonitor.trackResponse(details);
    },
    { urls: ['<all_urls>'] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getNetworkData':
            sendResponse(networkMonitor.getNetworkData());
            break;
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

receiveMessage((message) => {
    console.log('Received message:', message);
});