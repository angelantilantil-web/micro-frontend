import React, { useState } from 'react';
import './styles.css';

const sampleOutgoingLogs = [
  {
    id: 'OUT-20260503-001',
    system: 'PAYMENTS_GATEWAY',
    userRef: 'UAT-5501',
    request: '/api/v1/payments/initiate',
    response: '/api/v1/payments/status',
    success: true,
    url: 'https://uat-payments.hdfcbank.com/api/v1/payments',
    sentAt: '2026-05-03 10:22:15',
    receivedAt: '2026-05-03 10:22:17'
  },
  {
    id: 'OUT-20260503-002',
    system: 'LOAN_SERVICE',
    userRef: 'UAT-5499',
    request: '/api/v1/loan/verify',
    response: '/api/v1/loan/verify/response',
    success: false,
    url: 'https://uat-loans.hdfcbank.com/api/v1/loan',
    sentAt: '2026-05-03 09:55:40',
    receivedAt: '2026-05-03 09:55:41'
  },
  {
    id: 'OUT-20260503-003',
    system: 'KYC_SERVICE',
    userRef: 'UAT-5515',
    request: '/api/v1/kyc/start',
    response: '/api/v1/kyc/status',
    success: true,
    url: 'https://uat-kyc.hdfcbank.com/api/v1/kyc',
    sentAt: '2026-05-03 08:48:22',
    receivedAt: '2026-05-03 08:48:24'
  },
  {
    id: 'OUT-20260503-004',
    system: 'REPORTING_ENGINE',
    userRef: 'UAT-5523',
    request: '/api/v1/reports/generate',
    response: '/api/v1/reports/download',
    success: true,
    url: 'https://uat-reporting.hdfcbank.com/api/v1/reports',
    sentAt: '2026-05-03 07:30:13',
    receivedAt: '2026-05-03 07:30:18'
  },
  {
    id: 'OUT-20260503-005',
    system: 'NOTIFICATION_SERVICE',
    userRef: 'UAT-5529',
    request: '/api/v1/notify/send',
    response: '/api/v1/notify/status',
    success: false,
    url: 'https://uat-notify.hdfcbank.com/api/v1/notify',
    sentAt: '2026-05-03 06:12:04',
    receivedAt: '2026-05-03 06:12:05'
  }
];

export default function OutgoingApiLogsApp() {
  const [dateRange, setDateRange] = useState({
    from: '2026-05-03',
    to: '2026-05-03'
  });

  const filteredLogs = sampleOutgoingLogs.filter(log => {
    const sentDate = new Date(log.sentAt.replace(' ', 'T'));
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(`${dateRange.to}T23:59:59`);
    return sentDate >= fromDate && sentDate <= toDate;
  });

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="module-title-row">
          <div>
            <h1>Outgoing API Logs</h1>
            <p className="module-subtitle">Review outgoing API transactions, success status, and endpoint details.</p>
          </div>
          <div className="module-actions">
            <button className="module-action-btn">Refresh</button>
            <button className="module-action-btn secondary">Export</button>
          </div>
        </div>

        <div className="filter-row">
          <div className="date-filter-item">
            <label htmlFor="from-date">From</label>
            <input
              id="from-date"
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
          </div>

          <div className="date-filter-item">
            <label htmlFor="to-date">To</label>
            <input
              id="to-date"
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>

          <div className="summary-pill">
            Showing <strong>{filteredLogs.length}</strong> records
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>External System</th>
                <th>User Ref ID</th>
                <th>Request</th>
                <th>Response</th>
                <th>Success</th>
                <th>Endpoint</th>
                <th>Sent At</th>
                <th>Received At</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.id}</td>
                    <td>{log.system}</td>
                    <td>{log.userRef}</td>
                    <td><button className="link-button">View</button></td>
                    <td><button className="link-button">View</button></td>
                    <td><span className={`status-pill ${log.success ? 'success' : 'failed'}`}>{log.success ? 'Yes' : 'No'}</span></td>
                    <td>{log.url}</td>
                    <td>{log.sentAt}</td>
                    <td>{log.receivedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-logs-message">No outgoing logs found for the selected date range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}