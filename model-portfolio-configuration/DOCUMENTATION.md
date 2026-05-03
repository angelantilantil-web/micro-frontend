# Model Portfolio Configuration Module Documentation

## Overview
The `model-portfolio-configuration` module enables users to configure and manage investment model portfolios.

## Key Files
- `src/App.js` - Main module component
- `src/index.js` - React entry point
- `webpack.config.js` - Module Federation remote configuration
- `src/styles.css` - Module styling and layout

## Behavior
- Provides a remote entry for the host shell
- Renders configuration views and settings panels
- Isolation ensures styles do not leak into the host or other modules

## Run Locally
```bash
cd model-portfolio-configuration
npm install
npm start
```

## Notes
- This module is part of the HDFC micro-frontend ecosystem.
- The host app loads it dynamically through Module Federation.
