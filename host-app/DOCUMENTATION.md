# Host App Documentation

## Overview
The `host-app` is the shell application in the HDFC micro-frontend architecture. It loads remote modules and renders the main navigation and layout.

## Key Files
- `src/App.js` - Container shell and routing logic
- `src/index.js` - React entry point
- `webpack.config.js` - Host configuration for Module Federation
- `src/styles.css` - Global shared styling

## Behavior
- Provides navigation to remote micro-frontend modules
- Loads remote modules dynamically using Webpack Module Federation
- Uses a global event bus for cross-module communication
- Handles UI layout, sidebar, and header elements

## Running Locally
```bash
cd host-app
npm install
npm start
```

## Notes
- Must run together with remote modules so the federated remotes can be loaded.
- The host app uses route-based loading for each remote module.
