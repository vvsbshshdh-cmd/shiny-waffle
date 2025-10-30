// Event monitoring and interception
class EventMonitor {
  constructor() {
    this.events = [];
    this.isMonitoring = true;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const eventTypes = [
      'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
      'keydown', 'keyup', 'keypress',
      'focus', 'blur', 'change', 'input', 'submit',
      'load', 'unload', 'scroll', 'resize'
    ];
    
    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        if (!this.isMonitoring) return;
        
        const eventData = {
          type: e.type,
          target: {
            tagName: e.target.tagName,
            id: e.target.id,
            className: e.target.className,
            selector: this.getSelector(e.target)
          },
          timestamp: Date.now(),
          details: this.getEventDetails(e)
        };
        
        this.events.push(eventData);
        
        // Send to background for logging
        chrome.runtime.sendMessage({
          type: 'DOM_EVENT',
          data: eventData
        }).catch(() => {});
      }, true);
    });
  }
  
  getSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }
  
  getEventDetails(event) {
    const details = {};
    
    switch (event.type) {
      case 'click':
      case 'mousedown':
      case 'mouseup':
        details.clientX = event.clientX;
        details.clientY = event.clientY;
        details.button = event.button;
        break;
        
      case 'keydown':
      case 'keyup':
      case 'keypress':
        details.key = event.key;
        details.code = event.code;
        details.ctrlKey = event.ctrlKey;
        details.altKey = event.altKey;
        details.shiftKey = event.shiftKey;
        details.metaKey = event.metaKey;
        break;
        
      case 'input':
      case 'change':
        details.value = event.target.value;
        break;
    }
    
    return details;
  }
  
  startMonitoring() {
    this.isMonitoring = true;
  }
  
  stopMonitoring() {
    this.isMonitoring = false;
  }
  
  getEvents() {
    return this.events;
  }
  
  clearEvents() {
    this.events = [];
  }
  
  // Programmatic event triggering
  triggerEvent(selector, eventType, details = {}) {
    const element = document.querySelector(selector);
    if (element) {
      let event;
      
      switch (eventType) {
        case 'click':
          event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: details.clientX || 0,
            clientY: details.clientY || 0
          });
          break;
          
        case 'keydown':
          event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: details.key || 'Enter',
            code: details.code || 'Enter'
          });
          break;
          
        default:
          event = new Event(eventType, {
            bubbles: true,
            cancelable: true
          });
      }
      
      element.dispatchEvent(event);
      return true;
    }
    return false;
  }
}

// Initialize event monitor
const eventMonitor = new EventMonitor();

// Expose to window for devtools access
window.eventMonitor = eventMonitor;

// Listen for control messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'TRIGGER_EVENT':
      const success = eventMonitor.triggerEvent(
        request.selector, 
        request.eventType, 
        request.details
      );
      sendResponse({ success });
      break;
      
    case 'GET_EVENTS':
      sendResponse(eventMonitor.getEvents());
      break;
      
    case 'CLEAR_EVENTS':
      eventMonitor.clearEvents();
      break;
      
    case 'TOGGLE_MONITORING':
      if (request.enabled) {
        eventMonitor.startMonitoring();
      } else {
        eventMonitor.stopMonitoring();
      }
      break;
  }
});
