# Accounts Module Documentation

## Overview
The `accounts-module` is part of the HDFC micro-frontend architecture. It is intended to display account summaries, balances, and account details.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Remote module configuration for Module Federation
- `src/styles.css` - Styling for module layout and components

## Behavior
- Exposes remote entry for the host shell
- Provides account navigation and list views
- Uses isolated module styles and components

## Running Locally
```bash
cd accounts-module
npm install
npm start
```

## Notes
- This module should be started alongside `host-app`.
- The host app loads this module as a federated remote when the user navigates to the Accounts route.
