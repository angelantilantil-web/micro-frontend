# Business Reports Module Documentation

## Overview
The `business-reports` module provides dashboard-style reporting information for the HDFC micro-frontend application.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Remote entry configuration for Module Federation
- `src/styles.css` - Visual styling for the module

## Behavior
- Renders report cards and summaries
- Exposes remote component for host-shell consumption
- Uses isolated CSS for module-specific layout

## Local Run
```bash
cd business-reports
npm install
npm start
```

## Notes
- The module is loaded by `host-app` when the Business Reports route is active.
- This documentation is module-specific and lives beside the source.
