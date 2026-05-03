import React, { useState, useEffect } from 'react';
import './styles.css';

// Event Bus for cross-module communication
const EventBus = window.EventBus || {
  listeners: {},
  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
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

// Sample account data
const sampleAccounts = [
  { id: 1, accountNumber: '501234567890', type: 'Savings', balance: 125000.50, branch: 'Mumbai Main', ifsc: 'HDFC0000001', status: 'Active' },
  { id: 2, accountNumber: '501234567891', type: 'Current', balance: 2500000.00, branch: 'Delhi Central', ifsc: 'HDFC0000002', status: 'Active' },
  { id: 3, accountNumber: '501234567892', type: 'Fixed Deposit', balance: 500000.00, branch: 'Bangalore South', ifsc: 'HDFC0000003', status: 'Active' },
  { id: 4, accountNumber: '501234567893', type: 'Savings', balance: 75000.25, branch: 'Chennai East', ifsc: 'HDFC0000004', status: 'Active' }
];

export default function AccountsApp() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Initialize accounts from shared store
  useEffect(() => {
    if (window.EventBus && window.EventBus.getAccounts) {
      const initialAccounts = window.EventBus.getAccounts();
      setAccounts(initialAccounts.length > 0 ? initialAccounts : sampleAccounts);
      setError(null);
    } else {
      setAccounts(sampleAccounts);
    }
    
    const unsubscribe = EventBus.subscribe('account:updated', (data) => {
      setAccounts(data.items || []);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatAccountNumber = (accNo) => {
    return accNo.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  return (
    <div className="accounts-container">
      <div className="module-header">
        <h1>💳 My Accounts</h1>
        <p>Manage your HDFC Bank accounts</p>
      </div>

      {/* Account Summary Cards */}
      <div className="account-summary">
        <div className="summary-card total">
          <span className="summary-icon">💰</span>
          <div className="summary-content">
            <h3>Total Balance</h3>
            <p className="summary-amount">{formatCurrency(getTotalBalance())}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">🏦</span>
          <div className="summary-content">
            <h3>Accounts</h3>
            <p className="summary-count">{accounts.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">✅</span>
          <div className="summary-content">
            <h3>Active</h3>
            <p className="summary-count">{accounts.filter(a => a.status === 'Active').length}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Accounts List */}
      <div className="accounts-list">
        <h2>All Accounts</h2>
        <div className="accounts-grid">
          {accounts.map(account => (
            <div 
              key={account.id} 
              className="account-card"
              onClick={() => handleAccountClick(account)}
            >
              <div className="account-type-badge">{account.type}</div>
              <div className="account-number">{formatAccountNumber(account.accountNumber)}</div>
              <div className="account-balance">{formatCurrency(account.balance)}</div>
              <div className="account-branch">
                <span>🏢</span> {account.branch}
              </div>
              <div className={`account-status ${account.status.toLowerCase()}`}>
                {account.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Detail Modal */}
      {showModal && selectedAccount && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Account Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Account Number</span>
                <span className="detail-value">{formatAccountNumber(selectedAccount.accountNumber)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Type</span>
                <span className="detail-value">{selectedAccount.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Balance</span>
                <span className="detail-value highlight">{formatCurrency(selectedAccount.balance)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Branch</span>
                <span className="detail-value">{selectedAccount.branch}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">IFSC Code</span>
                <span className="detail-value">{selectedAccount.ifsc}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`detail-value status ${selectedAccount.status.toLowerCase()}`}>
                  {selectedAccount.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary">View Statement</button>
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}