# Cards Module

The `cards-module` is a remote micro-frontend in the HDFC project.

## Purpose
This module handles credit and debit card management UI.

## Files
- `src/App.js` - Main component
- `src/index.js` - Entry point
- `webpack.config.js` - Module Federation setup
- `src/styles.css` - Module-specific styling

## Usage
```bash
cd cards-module
npm install
npm start
```

## Notes
- It is loaded by `host-app` when the Cards route is selected.
