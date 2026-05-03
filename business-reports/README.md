# Business Reports Module

The `business-reports` module is a remote micro-frontend in the HDFC micro-frontend project.

## Purpose
This module is designed to display business reporting dashboards and log summaries.

## Files
- `src/App.js` - Main application component
- `src/index.js` - Module entry point
- `webpack.config.js` - Module Federation configuration
- `src/styles.css` - Module styling

## Usage
```bash
cd business-reports
npm install
npm start
```

## Notes
- Load this module together with `host-app`.
- It is mounted by the host when the user selects the Business Reports route.
