const networkRequests = new Map();
const blockedRequests = new Set();
const modifiedRequests = new Map();

// Network monitoring
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const requestId = details.requestId;
    const requestData = {
      id: requestId,
      url: details.url,
      method: details.method,
      type: details.type,
      timestamp: Date.now(),
      requestHeaders: details.requestHeaders,
      status: 'pending'
    };
    
    networkRequests.set(requestId, requestData);
    
    // Check if this request should be blocked
    if (blockedRequests.has(details.url) || blockedRequests.has(new URL(details.url).hostname)) {
      return { cancel: true };
    }
    
    // Check if this request should be modified
    if (modifiedRequests.has(details.url)) {
      const modification = modifiedRequests.get(details.url);
      return modification;
    }
    
    // Send to popup/devtools
    chrome.runtime.sendMessage({
      type: 'NETWORK_REQUEST',
      data: requestData
    }).catch(() => {}); // Ignore errors when no listeners
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const requestData = networkRequests.get(details.requestId);
    if (requestData) {
      requestData.status = 'completed';
      requestData.statusCode = details.statusCode;
      requestData.responseHeaders = details.responseHeaders;
      requestData.completedTimestamp = Date.now();
      
      chrome.runtime.sendMessage({
        type: 'NETWORK_RESPONSE',
        data: requestData
      }).catch(() => {});
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const requestData = networkRequests.get(details.requestId);
    if (requestData) {
      requestData.status = 'error';
      requestData.error = details.error;
      
      chrome.runtime.sendMessage({
        type: 'NETWORK_ERROR',
        data: requestData
      }).catch(() => {});
    }
  },
  { urls: ["<all_urls>"] }
);

// Message handling for controls
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'BLOCK_REQUEST':
      blockedRequests.add(request.pattern);
      break;
      
    case 'UNBLOCK_REQUEST':
      blockedRequests.delete(request.pattern);
      break;
      
    case 'MODIFY_REQUEST':
      modifiedRequests.set(request.url, request.modification);
      break;
      
    case 'GET_NETWORK_DATA':
      sendResponse(Array.from(networkRequests.values()));
      break;
      
    case 'CLEAR_NETWORK_DATA':
      networkRequests.clear();
      break;
  }
});
