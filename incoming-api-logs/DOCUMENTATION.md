# Incoming API Logs Module Documentation

## Overview
This module is part of the `hdfc-micro-frontend` project and provides an interface for viewing incoming API log records.

It is designed as a remote micro-frontend that can be loaded into the `host-app` using Webpack Module Federation.

## Key Features
- Displays a sample table of incoming API log entries
- Includes a date range filter for the `createdAt` values
- Shows status pills for successful or failed calls
- Provides `Filter` and `Export` actions in the same header row

## Files and Behavior

### `src/App.js`
- Defines `sampleLogs`, a static dataset representing incoming API events
- Uses `useState` to store the current `from` and `to` date range
- Filters logs dynamically using the selected range
- Renders the matching log entries in a responsive table
- Displays a no-results message when no logs match the selected range

### `src/styles.css`
- Styles the module layout, table, buttons, and filter controls
- Uses a card-style `module-content` area for cleaner presentation
- Provides `status-pill` classes for success/failure states

## UI Behavior
- The date filter row and action buttons are aligned in a single header line
- Selecting a date range updates the displayed log rows immediately
- `Filter` and `Export` are included as action placeholders and can be wired to real logic later

## Run Instructions
1. Start the module locally:
   ```bash
   cd incoming-api-logs
   npm install
   npm start
   ```
2. Start the host app so it can load this module:
   ```bash
   cd ../host-app
   npm install
   npm start
   ```

## Notes
- This module currently uses sample/static log data for UI and layout purposes.
- The `Export` button is styled but not connected to an export workflow yet.
- The document can be extended with API integration details once backend data is wired in.
