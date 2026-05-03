# HDFC Micro Frontend Project Documentation

## Overview
This repository implements a micro-frontend architecture for the HDFC Bank UI using `host-app` as the shell and multiple remote modules.

## Project Structure
- `host-app/` - Main application shell and shared navigation
- `accounts-module/` - Accounts management micro-frontend
- `business-reports/` - Business reports micro-frontend
- `cards-module/` - Cards management micro-frontend
- `incoming-api-logs/` - Incoming API logs micro-frontend
- `loans-module/` - Loans management micro-frontend
- `maker-requests/` - Maker-requests workflow micro-frontend
- `model-portfolio-configuration/` - Portfolio configuration micro-frontend
- `outgoing-api-logs/` - Outgoing API logs micro-frontend
- `vro-uploads/` - VRO uploads micro-frontend

## Module Documentation
Each module contains its own `README.md` and `DOCUMENTATION.md` describing module purpose, files, and local run instructions.

## Running the Project
1. Start each module locally in its folder:
   ```bash
   cd host-app && npm install && npm start
   cd accounts-module && npm install && npm start
   cd loans-module && npm install && npm start
   cd cards-module && npm install && npm start
   cd incoming-api-logs && npm install && npm start
   cd maker-requests && npm install && npm start
   cd model-portfolio-configuration && npm install && npm start
   cd outgoing-api-logs && npm install && npm start
   cd vro-uploads && npm install && npm start
   ```

2. Open the host app URL in your browser to load the remote modules.

## Notes
- The host uses Webpack Module Federation to load remote entries from each module.
- Each module is independently runnable and documented at its own folder level.
