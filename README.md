#  Micro Frontend Project

A micro-frontend architecture project for  Bank with a host shell and several independent remote modules.

## Project Structure

```
micro-frontend/
├── host-app/                      # Main container application
├── business-reports/              # Business reports module
├── incoming-api-logs/             # Incoming API logs module
├── maker-requests/                # Maker requests module
├── model-portfolio-configuration/ # Model portfolio configuration module
├── outgoing-api-logs/             # Outgoing API logs module
├── ai-agent-module/               # AI Agent chatbot module
└── vro-uploads/                   # VRO uploads module
```

## Architecture

This project uses **Webpack Module Federation** to implement a micro-frontend architecture:

- **host-app**: Main shell application that loads and orchestrates remote modules
- **Remote Modules**: Standalone applications that can be independently developed and deployed
  - `business-reports`
  - `incoming-api-logs`
  - `maker-requests`
  - `model-portfolio-configuration`
  - `outgoing-api-logs`
- `ai-agent-module`
- npm or yarn

## Installation

Install dependencies for each folder:

```bash
cd host-app
npm install

cd ../business-reports
npm install

cd ../incoming-api-logs
npm install

cd ../maker-requests
npm install

cd ../model-portfolio-configuration
npm install

cd ../outgoing-api-logs
npm install

cd ../ai-agent-module
npm install

cd ../vro-uploads
npm install
```

## Running the Application

### Run All Modules Separately

Open a terminal for each module and start them individually:

```bash
cd host-app
npm start

cd business-reports
npm start

cd incoming-api-logs
npm start

cd maker-requests
npm start

cd model-portfolio-configuration
npm start

cd outgoing-api-logs
npm start

cd ai-agent-module
npm start

cd vro-uploads
npm start
```

### Use `start-all-modules.bat`

From the project root on Windows, run:

```bash
start-all-modules.bat
```

### Using `concurrently`

Install concurrently globally:

```bash
npm install -g concurrently
```

Run a host app plus example remotes from the root:

```bash
concurrently "cd host-app && npm start" "cd business-reports && npm start" "cd incoming-api-logs && npm start"
```

## Module Documentation
Each module contains its own module-level documentation:

- `business-reports/README.md`
- `incoming-api-logs/README.md`
- `maker-requests/README.md`
- `model-portfolio-configuration/README.md`
- `outgoing-api-logs/README.md`
- `vro-uploads/README.md`

Detailed specifications are available in each module's `DOCUMENTATION.md`.

## Features

### Host App
- Main container shell for micro-frontend routing
- Sidebar and header navigation
- Dynamic remote module loading via Module Federation
- Shared event bus for cross-module communication

### Incoming API Logs Module
- Date range filter for log records
- Sample incoming API log table
- Success/failure status indicators
- Filter and export actions

### Outgoing API Logs Module
- Outgoing API log visualization
- Remote module loaded by host app

### Other Modules
- `business-reports`: Reporting dashboards
- `maker-requests`: Maker/checker workflows
- `model-portfolio-configuration`: Portfolio configuration UI
- `vro-uploads`: Upload workflows

## Technology Stack

- **React 18** - UI framework
- **Webpack 5** - Module Federation
- **React Router** - Client-side routing
- **Babel** - JavaScript transpilation

## Cross-Module Communication

The project uses an Event Bus pattern for communication between modules:

```javascript
// Subscribe to events
EventBus.subscribe('account:updated', (data) => {
  console.log('Accounts updated:', data);
});

// Publish events
EventBus.publish('cart:updated', { count: 1, items: [] });
```

## Building for Production

Build each module for production:

```bash
cd host-app
npm run build

cd ../business-reports
npm run build

cd ../incoming-api-logs
npm run build

cd ../maker-requests
npm run build

cd ../model-portfolio-configuration
npm run build

cd ../outgoing-api-logs
npm run build

cd ../vro-uploads
npm run build
```

## License

This project is for demonstration purposes.
