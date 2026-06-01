import React, { useState, useEffect, useMemo } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import {getAllTimeWAFTrends, getCurrentWAFUser} from '../../api';
import '../../App.css';

function LoggingMonitoring() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUser] = useState(null);
  const [logsData, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');


  useEffect(() => {
    const fetchWAFTrends = async () => {
      const [rawLogsData, userData] = await Promise.all([
        getAllTimeWAFTrends(),
        getCurrentWAFUser(),
      ]);
      setUser(userData);

      // normalize possible response shapes
      let logsArray = [];
      if (Array.isArray(rawLogsData)) logsArray = rawLogsData;
      else if (rawLogsData) {
        if (Array.isArray(rawLogsData.logs)) logsArray = rawLogsData.logs;
        else if (Array.isArray(rawLogsData.data)) logsArray = rawLogsData.data;
        else if (Array.isArray(rawLogsData.waf_logs)) logsArray = rawLogsData.waf_logs;
        else if (Array.isArray(rawLogsData.records)) logsArray = rawLogsData.records;
      }

      setLogs(logsArray);
    };
    fetchWAFTrends();
  }, []);

  const filteredLogs = useMemo(() => {
    return logsData.filter((log) => {
      const query = searchQuery.trim().toLowerCase();
      const wafName = String(log.waf_name || '').toLowerCase();
      const timestamp = String(log.timestamp || log.time || '').toLowerCase();
      const ip = String(log.ip_address || log.ip || '').toLowerCase();
      const userAgent = String(log.user_agent || log.ua || '').toLowerCase();
      const method = String(log.method || log.http_method || log.request_method || '').toLowerCase();
      const requestStatus = String(log.request_status || log.status || '').toLowerCase();
      const userEmail = String(log.user_email || log.user || '').toLowerCase();
      const threats = Array.isArray(log.detected_threats)
        ? log.detected_threats.join(' ').toLowerCase()
        : String(log.detected_threats || '').toLowerCase();

      if (query) {
        const haystack = `${wafName} ${timestamp} ${ip} ${userAgent} ${method} ${requestStatus} ${userEmail} ${threats}`;
        if (!haystack.includes(query)) return false;
      }

      if (statusFilter && statusFilter !== 'All') {
        if (requestStatus !== statusFilter.toLowerCase()) return false;
      }

      if (methodFilter && methodFilter !== 'All') {
        if (method !== methodFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [logsData, searchQuery, statusFilter, methodFilter]);

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        <div
          className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}
        >
          <WAFDashboardNavbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            userData={userData}
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
              <input
                type="text"
                placeholder="Search IP / User / WAF / Method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="allowed">Allowed</option>
                <option value="blocked">Blocked</option>
                <option value="suspicious">Suspicious</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="get">GET</option>
                <option value="post">POST</option>
                <option value="put">PUT</option>
                <option value="delete">DELETE</option>
                <option value="patch">PATCH</option>
              </select>

              <button
                onClick={() => {
                  const csvRows = [];
                  const headers = ['timestamp', 'ip', 'method', 'endpoint', 'status', 'threat'];
                  csvRows.push(headers.join(','));
                  filteredLogs.forEach((l) => {
                    const row = [
                      (l.timestamp || l.time || l.created_at || ''),
                      (l.ip_address || l.ip || l.client_ip || ''),
                      (l.method || l.http_method || l.request_method || ''),
                      (l.endpoint || l.path || l.url || ''),
                      (l.status || l.result || ''),
                      (l.detected_threats || l.threat || ''),
                    ];
                    csvRows.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
                  });
                  const csv = csvRows.join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'waf_logs.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export Logs
              </button>
            </div>

            {/* LOG TABLE */}

            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>WAF Name</th>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                    <th>User Agent</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Threat</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                        No logs match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => {
                      const timestamp = log.timestamp;
                      const ip = log.ip_address;
                      const userAgent = log.user_agent;
                      const method = log.method;
                      const status = log.request_status;
                      const threat = log.detected_threats;
                      const WAFName = log.waf_name;
                      return (
                        <tr key={index}>
                          <td>{WAFName}</td>
                          <td>{timestamp}</td>

                          <td>{ip}</td>

                          <td>
                            <span className={`method-badge ${userAgent}`}>
                              {userAgent}
                            </span>
                          </td>

                          <td>{method}</td>

                          <td>
                            <span className={`status-badge ${status}`}>
                              {status}
                            </span>
                          </td>

                          <td>{threat}</td>
                        </tr>
                      );
                    })
                  )}
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
