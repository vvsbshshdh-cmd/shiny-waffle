let networkLogs = [];
let eventLogs = [];

// Listen for real-time updates
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'NETWORK_REQUEST' || 
      request.type === 'NETWORK_RESPONSE' || 
      request.type === 'NETWORK_ERROR') {
    networkLogs.unshift(request.data);
    updateNetworkDisplay();
  } else if (request.type === 'DOM_EVENT') {
    eventLogs.unshift(request.data);
    updateEventsDisplay();
  }
});

function updateNetworkDisplay() {
  const container = document.getElementById('networkLogs');
  container.innerHTML = networkLogs.map(req => `
    <div class="log-entry request">
      <strong>${req.method} ${req.url}</strong><br>
      Type: ${req.type} | Status: ${req.status} | Code: ${req.statusCode || 'N/A'}<br>
      Time: ${new Date(req.timestamp).toLocaleTimeString()}
    </div>
  `).join('');
}

function updateEventsDisplay() {
  const container = document.getElementById('eventLogs');
  container.innerHTML = eventLogs.map(evt => `
    <div class="log-entry event">
      <strong>${evt.type}</strong> on ${evt.target.selector}<br>
      Details: ${JSON.stringify(evt.details)}<br>
      Time: ${new Date(evt.timestamp).toLocaleTimeString()}
    </div>
  `).join('');
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabName).style.display = 'block';
}

function clearCurrentTab() {
  const visibleTab = document.querySelector('.tab-content[style="display: block"]');
  if (visibleTab.id === 'network') {
    networkLogs = [];
    updateNetworkDisplay();
  } else if (visibleTab.id === 'events') {
    eventLogs = [];
    updateEventsDisplay();
  }
}

// Load initial data
chrome.runtime.sendMessage({ type: 'GET_NETWORK_DATA' }, (response) => {
  networkLogs = response || [];
  updateNetworkDisplay();
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_EVENTS' }, (response) => {
      eventLogs = response || [];
      updateEventsDisplay();
    });
  }
});
