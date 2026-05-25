import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import './styles.css';

// Event Bus for cross-module communication
const EventBus = {
  listeners: {},
  
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },
  
  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// Make EventBus available globally
window.EventBus = EventBus;

// Lazy load remote modules
const BusinessReports = React.lazy(() => import('businessReports/BusinessReportsApp').catch(error => {
  console.error('Business Reports module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="Business Reports" /> };
}));
const ModelPortfolio = React.lazy(() => import('modelPortfolio/ModelPortfolioApp').catch(error => {
  console.error('Model Portfolio module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="Model Portfolio Configuration" /> };
}));
const OutgoingApiLogs = React.lazy(() => import('outgoingApiLogs/OutgoingApiLogsApp').catch(error => {
  console.error('Outgoing API Logs module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="Outgoing API Logs" /> };
}));
const IncomingApiLogs = React.lazy(() => import('incomingApiLogs/IncomingApiLogsApp').catch(error => {
  console.error('Incoming API Logs module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="Incoming API Logs" /> };
}));
const MakerRequests = React.lazy(() => import('makerRequests/MakerRequestsApp').catch(error => {
  console.error('Maker Requests module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="Maker Requests" /> };
}));
const VroUploads = React.lazy(() => import('vroUploads/VroUploadsApp').catch(error => {
  console.error('VRO Uploads module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="VRO Uploads" /> };
}));
const AIAgent = React.lazy(() => import('aiAgent/AIAgentApp').catch(error => {
  console.error('AI Agent module failed to load', error);
  return { default: () => <ModuleLoadUnavailable moduleName="AI Agent Chatbot" /> };
}));

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading module...</p>
    </div>
  );
}

function ModuleLoadUnavailable({ moduleName }) {
  return (
    <div className="module-error-card">
      <div className="module-error-icon">⚠️</div>
      <h2>{moduleName} is currently unavailable</h2>
      <p>The requested module could not be loaded. Please try again later.</p>
    </div>
  );
}

class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Module load failed:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="module-error-card">
          <div className="module-error-icon">⚠️</div>
          <h2>Server is not available</h2>
          <p>We could not load the requested module right now. Please try again after a few moments.</p>
          <button className="module-error-button" onClick={this.resetError}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Module names mapping
const moduleNames = {
  '/business-reports': 'Business Reports',
  '/model-portfolio': 'Model Portfolio Configuration',
  '/outgoing-api': 'Outgoing API Logs',
  '/incoming-api': 'Incoming API Logs',
  '/http-access-logs': 'HTTP Access Logs',
  '/maker-requests': 'Maker Requests',
  '/vro-uploads': 'VRO Uploads',
  '/ai-agent': 'AI Agent Chatbot'
};

function Breadcrumb() {
  const location = useLocation();
  const moduleName = moduleNames[location.pathname] || 'Dashboard';

  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb-top">
        <div className="breadcrumb-brand">
          <img src="/hdfc-logo.svg" alt="HDFC Bank" className="breadcrumb-logo" />
          <div className="breadcrumb-slogan">We understand your world</div>
        </div>
        <div className="header-right">
          <div className="last-login">Last login: 01 May 2026, 10:30 AM</div>
          <span className="header-bell" title="Notifications">🔔</span>
          <span className="header-user">John Doe</span>
        </div>
      </div>
      <div className="breadcrumb-bar">
        <span className="breadcrumb-module">{moduleName}</span>
      </div>
    </div>
  );
}

// Header Component with Burger Menu
function Header({ menuOpen, setMenuOpen }) {
  return (
    <>
      {/* Burger Menu Button */}
     
      
      {/* Slide-in Menu */}
      <div className={`burger-menu ${menuOpen ? 'open' : ''}`}>
        <div className="burger-menu-header">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            🏦 HDFC Bank
          </Link>
        </div>
        <nav className="burger-menu-nav">
          <NavLink to="/business-reports" onClick={() => setMenuOpen(false)}>
            📊 Business Reports
          </NavLink>
          <NavLink to="/model-portfolio" onClick={() => setMenuOpen(false)}>
            ⚙️ Model Portfolio Configuration
          </NavLink>
          <NavLink to="/outgoing-api" onClick={() => setMenuOpen(false)}>
            📤 Outgoing API Logs
          </NavLink>
          <NavLink to="/incoming-api" onClick={() => setMenuOpen(false)}>
            📥 Incoming API Logs
          </NavLink>
          <NavLink to="/http-access-logs" onClick={() => setMenuOpen(false)}>
            🌐 HTTP Access Logs
          </NavLink>
          <NavLink to="/maker-requests" onClick={() => setMenuOpen(false)}>
            📝 Maker Requests
          </NavLink>
          <NavLink to="/vro-uploads" onClick={() => setMenuOpen(false)}>
            📁 VRO Uploads
          </NavLink>
          <NavLink to="/ai-agent" onClick={() => setMenuOpen(false)}>
            🤖 AI Agent Chatbot
          </NavLink>
        </nav>
      </div>
      
      {/* Overlay */}
      {menuOpen && <div className="burger-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
      
        {/* Collapsible Sidebar - shows icons when collapsed, full menu when expanded */}
        <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
          <button className="sidebar-toggle-btn" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            <img src="/menu-icon.svg" alt="Menu" className="sidebar-menu-logo" />
            <span className="sidebar-menu-text">Menu</span>
          </button>
          <nav className="sidebar-nav">
            <Link to="/business-reports" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">📊</span> <span className="link-text">Business Reports</span></Link>
            <Link to="/model-portfolio" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">⚙️</span> <span className="link-text">Model Portfolio Configuration</span></Link>
            <Link to="/outgoing-api" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">📤</span> <span className="link-text">Outgoing API Logs</span></Link>
            <Link to="/incoming-api" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">📥</span> <span className="link-text">Incoming API Logs</span></Link>
            <Link to="/http-access-logs" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">🌐</span> <span className="link-text">HTTP Access Logs</span></Link>
            <Link to="/maker-requests" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">📝</span> <span className="link-text">Maker Requests</span></Link>
            <Link to="/vro-uploads" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">📁</span> <span className="link-text">VRO Uploads <span className="beta-badge">(Beta Mode)</span></span></Link>
            <Link to="/ai-agent" className="sidebar-link" onClick={() => setSidebarExpanded(false)}><span className="sidebar-icon">🤖</span> <span className="link-text">AI Agent Chatbot</span></Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-content-area">
          <Breadcrumb />
          <main className="hdfc-content">
            <ModuleErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/business-reports" element={<BusinessReports />} />
                  <Route path="/model-portfolio" element={<ModelPortfolio />} />
                  <Route path="/outgoing-api" element={<OutgoingApiLogs />} />
                  <Route path="/incoming-api" element={<IncomingApiLogs />} />
                  <Route path="/http-access-logs" element={<div style={{padding:32}}>HTTP Access Logs (Placeholder)</div>} />
                  <Route path="/maker-requests" element={<MakerRequests />} />
                  <Route path="/vro-uploads" element={<VroUploads />} />
                  <Route path="/ai-agent" element={<AIAgent />} />
                  <Route path="/" element={<div style={{padding:32}}>Select a module from the menu.</div>} />
                </Routes>
              </Suspense>
            </ModuleErrorBoundary>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;