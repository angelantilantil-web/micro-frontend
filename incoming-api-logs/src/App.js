import React, { useState } from 'react';
import './styles.css';

const sampleLogs = [
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1234',
    success: true,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:13',
    generatedAt: '1 May 2026 09:30:10'
  },
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1235',
    success: true,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:12',
    generatedAt: '1 May 2026 09:30:09'
  },
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1236',
    success: true,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:08',
    generatedAt: '1 May 2026 09:30:04'
  },
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1237',
    success: false,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:07',
    generatedAt: '1 May 2026 09:30:06'
  },
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1238',
    success: true,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:04',
    generatedAt: '1 May 2026 09:30:03'
  },
  {
    system: 'GOOGLE_SCHEDULER',
    request: '/trigger?job=cron-task',
    response: '/response?id=1239',
    success: false,
    url: '/UATEOL/API/UserManagement/invokeCron',
    createdAt: '1 May 2026 15:00:04',
    generatedAt: '1 May 2026 09:30:01'
  }
];

export default function IncomingApiLogsApp() {
  const [dateRange, setDateRange] = useState({
    from: '2026-05-01',
    to: '2026-05-01'
  });

  const filteredLogs = sampleLogs.filter(log => {
    const created = new Date(log.createdAt);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(`${dateRange.to}T23:59:59`);
    return created >= fromDate && created <= toDate;
  });

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="module-title-row">
          <div className="date-filter-row">
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
          </div>
          <div className="module-actions">
            <button className="module-action-btn">Filter</button>
            <button className="module-action-btn secondary">Export</button>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>External System Name</th>
                <th>Request</th>
                <th>Response</th>
                <th>Is Successful</th>
                <th>URL</th>
                <th>Creation Date</th>
                <th>Log Generation Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.system}</td>
                    <td><button className="link-button">View</button></td>
                    <td><button className="link-button">View</button></td>
                    <td><span className={`status-pill ${log.success ? 'success' : 'failed'}`}>{log.success ? 'Yes' : 'No'}</span></td>
                    <td>{log.url}</td>
                    <td>{log.createdAt}</td>
                    <td>{log.generatedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-logs-message">No logs found for the selected date range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
