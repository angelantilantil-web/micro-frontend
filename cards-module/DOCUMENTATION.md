# Cards Module Documentation

## Overview
The `cards-module` provides card-related UI features such as card lists, balances, and status.

## Key Files
- `src/App.js` - Main application component
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation remote configuration
- `src/styles.css` - Component and layout styling

## Behavior
- Exposes a remote entry to the host shell
- Displays card data as a standalone micro-frontend
- Uses isolated styles for module-specific UI

## Run Locally
```bash
cd cards-module
npm install
npm start
```

## Notes
- This module is independent and should be served alongside `host-app`.
- The host shell loads this module dynamically as part of the micro-frontend routing.
