# Maker Requests Module Documentation

## Overview
The `maker-requests` module supports workflows for maker/checker request processing.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Remote module configuration
- `src/styles.css` - Module-specific styling

## Behavior
- Exposes a remote entry to the host shell
- Renders module-specific request management UI
- Uses isolated styling to avoid conflicts with other modules

## Run Locally
```bash
cd maker-requests
npm install
npm start
```

## Notes
- The host app loads this module on the Maker Requests route.
