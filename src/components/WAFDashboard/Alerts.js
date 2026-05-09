import React, { useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';

function Alerts() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      title: 'SQL Injection Attempt',
      severity: 'Critical',
      source: '192.168.1.22',
      time: '09 May 2026 11:24 PM',
      status: 'Active',
    },
    {
      title: 'Rate Limit Threshold Exceeded',
      severity: 'Medium',
      source: '172.16.0.5',
      time: '09 May 2026 10:58 PM',
      status: 'Resolved',
    },
    {
      title: 'Unauthorized Admin Access',
      severity: 'High',
      source: '10.0.0.8',
      time: '09 May 2026 10:11 PM',
      status: 'Investigating',
    },
  ]);

  setAlerts([
    ...alerts,
    {
      title: 'Cross-Site Scripting (XSS) Detected',
      severity: 'High',
      source: 'devices.ethixion.com',
      time: '09 May 2026 11:45 PM',
      status: 'Active',
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
            <span className="pageTitle">Ethixion WAF | Security Alerts</span>

            <hr />

            {/* HEADER */}

            <div className="alerts-header">
              <p>
                Monitor critical WAF alerts, suspicious activity detections,
                security incidents, and attack attempts across protected
                applications.
              </p>
            </div>

            {/* ALERT STATS */}

            <div className="alerts-stats">
              <div className="alert-stat-card critical">
                <h3>Critical Alerts</h3>
                <span>12</span>
              </div>

              <div className="alert-stat-card high">
                <h3>High Severity</h3>
                <span>24</span>
              </div>

              <div className="alert-stat-card medium">
                <h3>Medium Severity</h3>
                <span>38</span>
              </div>

              <div className="alert-stat-card resolved">
                <h3>Resolved</h3>
                <span>92</span>
              </div>
            </div>

            {/* FILTERS */}

            <div className="alerts-filters">
              <input type="text" placeholder="Search alerts..." />

              <select>
                <option>All Severities</option>

                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <select>
                <option>All Status</option>

                <option>Active</option>
                <option>Resolved</option>

                <option>Investigating</option>
              </select>

              <button>Export Alerts</button>
            </div>

            {/* ALERT TABLE */}

            <div className="alerts-table-container">
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Alert</th>
                    <th>Severity</th>
                    <th>Source IP</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {alerts.map((alert, index) => (
                    <tr key={index}>
                      <td>{alert.title}</td>

                      <td>
                        <span
                          className={`severity-badge ${alert.severity.toLowerCase()}`}
                        >
                          {alert.severity}
                        </span>
                      </td>

                      <td>{alert.source}</td>

                      <td>{alert.time}</td>

                      <td>
                        <span
                          className={`status-badge ${alert.status.toLowerCase()}`}
                        >
                          {alert.status}
                        </span>
                      </td>
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

export default Alerts;
