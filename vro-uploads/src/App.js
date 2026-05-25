import React, { useState } from 'react';
import './styles.css';

const sampleUploads = [
  {
    id: 'VRO-001',
    name: 'loan-upload-05-03.csv',
    type: 'Incremental',
    status: 'Completed',
    uploadedAt: '2026-05-03 10:18 AM',
    size: '1.2 MB'
  },
  {
    id: 'VRO-002',
    name: 'scheme-report.xlsx',
    type: 'Full',
    status: 'Failed',
    uploadedAt: '2026-05-03 09:55 AM',
    size: '3.8 MB'
  },
  {
    id: 'VRO-003',
    name: 'daily-incremental.csv',
    type: 'Incremental',
    status: 'Processing',
    uploadedAt: '2026-05-03 08:47 AM',
    size: '2.1 MB'
  }
];

export default function VroUploadsApp() {
  const [uploads] = useState(sampleUploads);
  const [selectedType, setSelectedType] = useState('All');
  const [dragActive, setDragActive] = useState(false);

  const filteredUploads = uploads.filter(upload =>
    selectedType === 'All' ? true : upload.type === selectedType
  );

  const handleDragEnter = e => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileChange = () => {
    // Placeholder for real upload handling
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-title-row">
          <div>
            <h1>VRO Uploads</h1>
            <p className="module-subtitle">Upload files for VRO processing and monitor recent upload status.</p>
          </div>
          <div className="upload-actions">
            <button className="primary-btn">New Upload</button>
            <button className="secondary-btn">Download Template</button>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Uploads</span>
            <strong>26</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Completed</span>
            <strong>18</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">In Progress</span>
            <strong>4</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Failed</span>
            <strong>4</strong>
          </div>
        </div>
      </div>

      <div className="upload-panel">
        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="dropzone-content">
            <span className="dropzone-icon">⤵</span>
            <strong>Drag & drop files here</strong>
            <p>or click to browse and upload CSV / XLSX files</p>
            <input type="file" className="file-input" onChange={handleFileChange} />
          </div>
        </div>
      </div>

      <div className="upload-table-section">
        <div className="table-header-row">
          <h2>Recent Uploads</h2>
          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option>All</option>
              <option>Incremental</option>
              <option>Full</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="uploads-table">
            <thead>
              <tr>
                <th>Upload ID</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Uploaded At</th>
                <th>File Size</th>
              </tr>
            </thead>
            <tbody>
              {filteredUploads.map(upload => (
                <tr key={upload.id}>
                  <td>{upload.id}</td>
                  <td>{upload.name}</td>
                  <td>{upload.type}</td>
                  <td>
                    <span className={`status-pill ${upload.status.toLowerCase()}`}>
                      {upload.status}
                    </span>
                  </td>
                  <td>{upload.uploadedAt}</td>
                  <td>{upload.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}