# Incoming API Logs Module

This module is part of the `hdfc-micro-frontend` project and provides the UI for Viewing and filtering incoming API log records.

## What this module does
- Displays incoming API log records in a table
- Provides a date range filter for `Creation Date`
- Shows the request and response actions as UI buttons
- Visualizes success state with color-coded pills
- Includes `Filter` and `Export` action buttons in the header

## Files
- `src/App.js` - Main module component with sample log data, filter state, and table rendering
- `src/styles.css` - Styling for the module layout, buttons, table, and filter controls
- `.gitignore` - Module-level ignore patterns for local dependencies and build output
- `DOCUMENTATION.md` - Detailed module specification and usage information

## Usage
1. Install dependencies:
   ```bash
   cd incoming-api-logs
   npm install
   ```
2. Run the module locally:
   ```bash
   npm start
   ```
3. Run the host app so it can load this remote module:
   ```bash
   cd ../host-app
   npm install
   npm start
   ```

## Notes
- The module currently uses sample static log data for display.
- The `Filter` and `Export` buttons are styled as actions and can be wired to backend or export logic later.
- The date filter currently filters the `createdAt` values in the sample data.
