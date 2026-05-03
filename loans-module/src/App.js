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

// Sample loan data
const sampleLoans = [
  { id: 1, loanNumber: 'LN5012345678', type: 'Home Loan', amount: 2500000, emi: 21500, tenure: 240, rate: 8.5, branch: 'Mumbai Main', status: 'Active', startDate: '2022-01-15', balance: 1850000 },
  { id: 2, loanNumber: 'LN5012345679', type: 'Car Loan', amount: 1200000, emi: 24500, tenure: 60, rate: 9.5, branch: 'Delhi Central', status: 'Active', startDate: '2023-06-01', balance: 850000 },
  { id: 3, loanNumber: 'LN5012345680', type: 'Personal Loan', amount: 500000, emi: 12500, tenure: 48, rate: 12.5, branch: 'Bangalore South', status: 'Active', startDate: '2024-02-10', balance: 420000 },
  { id: 4, loanNumber: 'LN5012345681', type: 'Education Loan', amount: 800000, emi: 9500, tenure: 120, rate: 7.5, branch: 'Chennai East', status: 'Active', startDate: '2023-09-01', balance: 680000 }
];

export default function LoansApp() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Initialize loans from shared store
  useEffect(() => {
    if (window.EventBus && window.EventBus.getLoans) {
      const initialLoans = window.EventBus.getLoans();
      setLoans(initialLoans.length > 0 ? initialLoans : sampleLoans);
      setError(null);
    } else {
      setLoans(sampleLoans);
    }
    
    const unsubscribe = EventBus.subscribe('loan:updated', (data) => {
      setLoans(data.items || []);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLoanNumber = (loanNo) => {
    return loanNo.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleLoanClick = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  const getTotalLoanAmount = () => {
    return loans.reduce((sum, loan) => sum + loan.amount, 0);
  };

  const getTotalOutstanding = () => {
    return loans.reduce((sum, loan) => sum + loan.balance, 0);
  };

  const getLoanTypeIcon = (type) => {
    const icons = {
      'Home Loan': '🏠',
      'Car Loan': '🚗',
      'Personal Loan': '💰',
      'Education Loan': '🎓',
      'Business Loan': '💼'
    };
    return icons[type] || '💳';
  };

  return (
    <div className="loans-container">
      <div className="module-header">
        <h1>🏠 My Loans</h1>
        <p>Manage your HDFC Bank loans</p>
      </div>

      {/* Loan Summary Cards */}
      <div className="loan-summary">
        <div className="summary-card total">
          <span className="summary-icon">💰</span>
          <div className="summary-content">
            <h3>Total Loan Amount</h3>
            <p className="summary-amount">{formatCurrency(getTotalLoanAmount())}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📊</span>
          <div className="summary-content">
            <h3>Outstanding</h3>
            <p className="summary-amount">{formatCurrency(getTotalOutstanding())}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📋</span>
          <div className="summary-content">
            <h3>Active Loans</h3>
            <p className="summary-count">{loans.length}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Loans List */}
      <div className="loans-list">
        <h2>All Loans</h2>
        <div className="loans-grid">
          {loans.map(loan => (
            <div 
              key={loan.id} 
              className="loan-card"
              onClick={() => handleLoanClick(loan)}
            >
              <div className="loan-header">
                <span className="loan-icon">{getLoanTypeIcon(loan.type)}</span>
                <div className="loan-type-badge">{loan.type}</div>
              </div>
              <div className="loan-number">{formatLoanNumber(loan.loanNumber)}</div>
              <div className="loan-amount">{formatCurrency(loan.amount)}</div>
              <div className="loan-details">
                <div className="loan-detail">
                  <span className="detail-label">EMI</span>
                  <span className="detail-value">{formatCurrency(loan.emi)}/mo</span>
                </div>
                <div className="loan-detail">
                  <span className="detail-label">Rate</span>
                  <span className="detail-value">{loan.rate}%</span>
                </div>
                <div className="loan-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">{loan.tenure} mo</span>
                </div>
              </div>
              <div className="loan-progress">
                <div className="progress-label">
                  <span>Outstanding</span>
                  <span>{formatCurrency(loan.balance)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(loan.balance / loan.amount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`loan-status ${loan.status.toLowerCase()}`}>
                {loan.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Detail Modal */}
      {showModal && selectedLoan && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Loan Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Loan Number</span>
                <span className="detail-value">{formatLoanNumber(selectedLoan.loanNumber)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Loan Type</span>
                <span className="detail-value">{selectedLoan.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sanctioned Amount</span>
                <span className="detail-value highlight">{formatCurrency(selectedLoan.amount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Outstanding Balance</span>
                <span className="detail-value">{formatCurrency(selectedLoan.balance)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Monthly EMI</span>
                <span className="detail-value">{formatCurrency(selectedLoan.emi)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Interest Rate</span>
                <span className="detail-value">{selectedLoan.rate}% p.a.</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tenure</span>
                <span className="detail-value">{selectedLoan.tenure} months</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{selectedLoan.startDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Branch</span>
                <span className="detail-value">{selectedLoan.branch}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`detail-value status ${selectedLoan.status.toLowerCase()}`}>
                  {selectedLoan.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary">Pay EMI</button>
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