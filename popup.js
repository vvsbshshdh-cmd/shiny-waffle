let networkCount = 0;
let eventCount = 0;
let blockedCount = 0;

// Update counters
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'NETWORK_REQUEST') {
    networkCount++;
    updateCounters();
  } else if (request.type === 'DOM_EVENT') {
    eventCount++;
    updateCounters();
  }
});

function updateCounters() {
  document.getElementById('requestCount').textContent = networkCount;
  document.getElementById('eventCount').textContent = eventCount;
  document.getElementById('blockedCount').textContent = blockedCount;
}

// Button handlers
document.getElementById('clearNetwork').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'CLEAR_NETWORK_DATA' });
  networkCount = 0;
  updateCounters();
});

document.getElementById('clearEvents').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'CLEAR_EVENTS' });
    eventCount = 0;
    updateCounters();
  });
});

document.getElementById('toggleEvents').addEventListener('click', (e) => {
  const isActive = e.target.classList.contains('active');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { 
      type: 'TOGGLE_MONITORING', 
      enabled: !isActive 
    });
  });
  e.target.classList.toggle('active');
  e.target.textContent = `Events: ${!isActive ? 'ON' : 'OFF'}`;
});

document.getElementById('blockUrl').addEventListener('click', () => {
  const pattern = document.getElementById('blockPattern').value;
  if (pattern) {
    chrome.runtime.sendMessage({ 
      type: 'BLOCK_REQUEST', 
      pattern: pattern 
    });
    blockedCount++;
    updateCounters();
    document.getElementById('blockPattern').value = '';
  }
});

document.getElementById('triggerEvent').addEventListener('click', () => {
  const selector = document.getElementById('triggerSelector').value;
  const eventType = document.getElementById('eventType').value;
  
  if (selector) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'TRIGGER_EVENT',
        selector: selector,
        eventType: eventType
      });
    });
  }
});

document.getElementById('openDevTools').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.debugger.attach({ tabId: tabs[0].id }, "1.3", () => {
      chrome.windows.create({
        url: chrome.runtime.getURL('panel.html'),
        type: 'panel',
        width: 800,
        height: 600
      });
    });
  });
});
