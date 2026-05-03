# VRO Uploads Module Documentation

## Overview
The `vro-uploads` module supports upload workflows for VRO documents within the HDFC micro-frontend ecosystem.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation remote configuration
- `src/styles.css` - Module styling

## Behavior
- Exposes a remote module entry for the host shell
- Provides upload controls and status views
- Uses isolated styles so it does not affect the host or other modules

## Run Locally
```bash
cd vro-uploads
npm install
npm start
```

## Notes
- This module is loaded when the VRO Uploads route is selected from the host app.
