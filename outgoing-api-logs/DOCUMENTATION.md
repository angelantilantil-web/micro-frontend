# Outgoing API Logs Module Documentation

## Overview
The `outgoing-api-logs` module provides a UI for viewing outgoing API log records.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation remote configuration
- `src/styles.css` - Styling for the module

## Behavior
- Exposes a remote entry used by the host shell
- Displays outgoing API log entries in a table or dashboard
- Uses isolated CSS to keep the module visually separated

## Run Locally
```bash
cd outgoing-api-logs
npm install
npm start
```

## Notes
- The host app loads this module when the Outgoing API Logs route is selected.
