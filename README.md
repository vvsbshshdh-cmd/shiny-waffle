# Network Monitor Extension

## Overview
The Network Monitor Extension is a browser extension designed to monitor and control network activity. It provides users with insights into their network requests and responses, allowing for better management and optimization of web interactions.

## Features
- Monitors network requests and responses in real-time.
- Provides a user-friendly popup interface for quick access to network data.
- Implements rate limiting to control the frequency of network requests.
- Injects functionality into web pages through a content script.
- Communicates seamlessly between background scripts, content scripts, and popup interfaces.

## Project Structure
```
network-monitor-extension
├── src
│   ├── background
│   │   └── background.ts          # Background script managing events and network requests
│   ├── content
│   │   └── contentScript.ts       # Content script interacting with web pages
│   ├── popup
│   │   ├── popup.html             # HTML structure for the popup interface
│   │   └── popup.tsx              # React component for the popup
│   ├── panel
│   │   ├── panel.html             # HTML structure for the panel interface
│   │   └── panel.tsx              # React component for the panel
│   ├── services
│   │   ├── networkMonitor.ts      # Class for monitoring network activity
│   │   └── rateLimiter.ts         # Class for implementing rate limiting
│   ├── shared
│   │   ├── messaging.ts           # Functions for messaging between extension parts
│   │   ├── types.ts               # TypeScript interfaces and types
│   │   └── utils.ts               # Utility functions for common tasks
│   └── styles
│       └── popup.css              # CSS styles for the popup interface
├── manifest.json                  # Configuration file for the Chrome extension
├── package.json                   # npm configuration file
├── tsconfig.json                  # TypeScript configuration file
├── webpack.config.js              # Webpack configuration file
├── .eslintrc.js                   # ESLint configuration file
└── README.md                      # Documentation for the project
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd network-monitor-extension
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Load the extension in your browser:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `network-monitor-extension` directory.
2. Click on the extension icon to open the popup and start monitoring your network activity.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.