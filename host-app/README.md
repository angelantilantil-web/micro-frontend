# Host App

The `host-app` is the main container application for the HDFC micro-frontend project.

## Purpose
It loads and orchestrates remote modules using Webpack Module Federation.

## Files
- `src/App.js` - Main shell application
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation host configuration
- `src/styles.css` - Global UI styles

## Usage
```bash
cd host-app
npm install
npm start
```

## Notes
- This module acts as the host shell for all remote modules.
- It contains navigation, shared layout, and cross-module integration.
