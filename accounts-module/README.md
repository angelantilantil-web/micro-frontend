# Accounts Module

The `accounts-module` is a remote micro-frontend in the `hdfc-micro-frontend` project.

## Purpose
This module provides the UI for viewing and managing customer bank accounts.

## Files
- `src/App.js` - Main application component
- `src/index.js` - Module entry point
- `src/styles.css` - Module-specific styling
- `webpack.config.js` - Webpack Module Federation configuration

## Usage
```bash
cd accounts-module
npm install
npm start
```

## Notes
- This module is loaded by `host-app` through Module Federation.
- The module structure is designed to support independent development and deployment.
