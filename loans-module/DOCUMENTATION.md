# Loans Module Documentation

## Overview
The `loans-module` provides loan-related interfaces, such as lists of loan products, outstanding balances, and EMI summaries.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation remote configuration
- `src/styles.css` - UI styling for the module

## Behavior
- Exposes a remote entry for the host shell
- Uses independent styling and routing for the loan module
- Displays mock or sample loan data until backend integration is added

## Run Locally
```bash
cd loans-module
npm install
npm start
```

## Notes
- This module should run alongside `host-app`.
- The host loads it dynamically when the Loans route is requested.
