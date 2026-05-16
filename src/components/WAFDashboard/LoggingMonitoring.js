// LoggingMonitoring.jsx

import React, { useState } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';

function LoggingMonitoring() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [logs] = useState([
    {
      time: '09 May 2026 10:22 PM',
      ip: '192.168.1.10',
      method: 'POST',
      endpoint: '/api/login',
      status: 'Blocked',
      threat: 'SQL Injection',
    },
    {
      time: '09 May 2026 09:58 PM',
      ip: '172.16.0.4',
      method: 'GET',
      endpoint: '/api/products',
      status: 'Allowed',
      threat: 'Safe',
    },
    {
      time: '09 May 2026 09:40 PM',
      ip: '10.0.0.8',
      method: 'PUT',
      endpoint: '/api/admin',
      status: 'Suspicious',
      threat: 'Rate Abuse',
    },
  ]);

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        <div
          className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}
        >
          <WAFDashboardNavbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            wafAPIExists={true}
          />

          <div className="dash-dataContainer">
            <span className="pageTitle">
              Ethixion WAF | Logging & Monitoring
            </span>

            {/* HEADER */}

            <div className="logging-header">
              <hr />

              <p>
                Monitor incoming traffic, blocked attacks, suspicious requests,
                and WAF security events in real-time.
              </p>
            </div>

            {/* TOP STATS */}

            <div className="monitor-stats">
              <div className="monitor-card">
                <h3>Total Requests</h3>
                <span>42,381</span>
              </div>

              <div className="monitor-card blocked">
                <h3>Blocked Threats</h3>
                <span>1,204</span>
              </div>

              <div className="monitor-card suspicious">
                <h3>Suspicious Requests</h3>
                <span>382</span>
              </div>

              <div className="monitor-card success">
                <h3>Allowed Requests</h3>
                <span>40,795</span>
              </div>
            </div>

            {/* FILTERS */}

            <div className="log-filters">
              <input type="text" placeholder="Search IP / Endpoint..." />

              <select>
                <option>All Status</option>
                <option>Allowed</option>
                <option>Blocked</option>
                <option>Suspicious</option>
              </select>

              <select>
                <option>All Methods</option>
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>

              <button>Export Logs</button>
            </div>

            {/* LOG TABLE */}

            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Status</th>
                    <th>Threat</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.time}</td>

                      <td>{log.ip}</td>

                      <td>
                        <span
                          className={`method-badge ${log.method.toLowerCase()}`}
                        >
                          {log.method}
                        </span>
                      </td>

                      <td>{log.endpoint}</td>

                      <td>
                        <span
                          className={`status-badge ${log.status.toLowerCase()}`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td>{log.threat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default LoggingMonitoring;
