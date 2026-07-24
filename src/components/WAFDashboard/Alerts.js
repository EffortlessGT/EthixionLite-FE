import React, { useEffect, useMemo, useState } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';
import { getCurrentUser, getWAFAPIAlertsSummary, getWAFAPIAlertsData } from '../../api';

const defaultAlerts = [];

const getSeverityFromAlert = (alert, fallbackSeverity = null) => {
  const explicitSeverity = String(
    alert?.severity || alert?.risk_level || alert?.level || alert?.priority || ''
  )
    .trim()
    .toLowerCase();

  if (explicitSeverity === 'critical') return 'Critical';
  if (explicitSeverity === 'high') return 'High';
  if (explicitSeverity === 'medium') return 'Medium';

  if (fallbackSeverity) return fallbackSeverity;

  const score = Number(alert?.final_risk_score);
  if (Number.isFinite(score) && score >= 70) return 'Critical';
  if (Number.isFinite(score) && score >= 40) return 'High';

  return 'Medium';
};

const getSeverityFallbackFromSummary = (summaryFromResponse, alertCount) => {
  if (!summaryFromResponse) return null;

  const buckets = [
    { key: 'critical', value: Number(summaryFromResponse.critical || 0) },
    { key: 'high', value: Number(summaryFromResponse.high || 0) },
    { key: 'medium', value: Number(summaryFromResponse.medium || 0) },
  ];

  const nonZeroBuckets = buckets.filter((entry) => entry.value > 0);
  if (nonZeroBuckets.length === 1 && nonZeroBuckets[0].value === Number(summaryFromResponse.total || alertCount || 0)) {
    return `${nonZeroBuckets[0].key[0].toUpperCase()}${nonZeroBuckets[0].key.slice(1)}`;
  }

  return null;
};

export const normalizeAlert = (alert, index, fallbackSeverity = null) => {
  const detectedThreats = Array.isArray(alert?.detected_threats)
    ? alert.detected_threats.filter(Boolean)
    : [];
  const threatLabel = detectedThreats[0] || 'Blocked request';
  const severity = getSeverityFromAlert(alert, fallbackSeverity);

  return {
    threat: threatLabel,
    severity,
    endpoint: alert?.path || alert?.endpoint || alert?.request_path || '/unknown',
    method: (alert?.method || 'GET').toUpperCase(),
    sourceIp: alert?.ip_address || 'N/A',
    actionTaken: alert?.request_status || 'Blocked',
    time: alert?.timestamp || 'N/A',
    status: alert?.request_status || 'Blocked',
    range: 'today',
    id: alert?.id || `${index}`,
    rawThreats: detectedThreats,
    detectedThreats,
    riskScore: Number(alert?.final_risk_score) || null,
  };
};

export const getSummaryFromAlerts = (alertList) => {
  const severityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
  };

  (Array.isArray(alertList) ? alertList : []).forEach((alert) => {
    const severity = getSeverityFromAlert(alert).toLowerCase();

    if (severity === 'critical') severityCounts.critical += 1;
    if (severity === 'high') severityCounts.high += 1;
    if (severity === 'medium') severityCounts.medium += 1;
  });

  return {
    critical: severityCounts.critical,
    high: severityCounts.high,
    medium: severityCounts.medium,
    total: alertList.length,
  };
};

function Alerts({ initialAlerts = defaultAlerts }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [rangeFilter, setRangeFilter] = useState('today');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [summary, setSummary] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    total: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const loadAlertsData = async () => {
      try {
        const [currentUser, alertsSummaryResponse, alertsDataResponse] = await Promise.all([
          getCurrentUser(),
          getWAFAPIAlertsSummary(),
          getWAFAPIAlertsData(),
        ]);

        if (!isMounted) return;

        setUserData(currentUser);

        const responseAlerts = Array.isArray(alertsDataResponse)
          ? alertsDataResponse
          : Array.isArray(alertsDataResponse?.alerts)
            ? alertsDataResponse.alerts
            : [];

        const summaryFromResponse = alertsSummaryResponse?.alerts_summary ||
          alertsSummaryResponse?.summary ||
          alertsSummaryResponse?.counts ||
          null;

        const fallbackSeverity = getSeverityFallbackFromSummary(
          summaryFromResponse,
          responseAlerts.length
        );

        const normalizedAlerts = responseAlerts.map((alert, index) =>
          normalizeAlert(alert, index, fallbackSeverity)
        );
        setAlerts(normalizedAlerts);

        if (summaryFromResponse) {
          setSummary({
            critical: Number(summaryFromResponse.critical || 0),
            high: Number(summaryFromResponse.high || 0),
            medium: Number(summaryFromResponse.medium || 0),
            total: Number(summaryFromResponse.total || normalizedAlerts.length || 0),
          });
        } else {
          setSummary(getSummaryFromAlerts(normalizedAlerts));
        }
      } catch (error) {
        console.error('Failed to load alerts data:', error);
        if (isMounted) {
          setAlerts(defaultAlerts);
        }
      }
    };

    loadAlertsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const severityMatch =
        severityFilter === 'All' ||
        alert.severity?.toLowerCase() === severityFilter.toLowerCase();

      const alertTime = alert.time;
      const alertDate = new Date(alertTime);
      const now = new Date();
      const diffInDays = Number.isNaN(alertDate.getTime())
        ? 0
        : Math.floor((now - alertDate) / (1000 * 60 * 60 * 24));
      const isToday = !Number.isNaN(alertDate.getTime()) && diffInDays <= 1;
      const isLast7Days = !Number.isNaN(alertDate.getTime()) && diffInDays <= 7;
      const rangeMatch =
        rangeFilter === 'all' ||
        (rangeFilter === 'today' ? isToday : isLast7Days);

      return severityMatch && rangeMatch;
    });
  }, [alerts, severityFilter, rangeFilter]);

  const closeDetails = () => setSelectedAlert(null);

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
            <span className="pageTitle">Ethixion WAF | Security Alerts</span>

            <hr />

            <div className="alerts-header">
              <p>
                Monitor critical WAF alerts, suspicious activity detections,
                security incidents, and attack attempts across protected
                applications.
              </p>
            </div>

            <div className="alerts-stats">
              <div className="alert-stat-card critical">
                <h3>Critical</h3>
                <span>{summary.critical}</span>
              </div>

              <div className="alert-stat-card high">
                <h3>High</h3>
                <span>{summary.high}</span>
              </div>

              <div className="alert-stat-card medium">
                <h3>Medium</h3>
                <span>{summary.medium}</span>
              </div>

              <div className="alert-stat-card resolved">
                <h3>Total Alerts</h3>
                <span>{summary.total}</span>
              </div>
            </div>

            <div className="alerts-filters">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="All">Severity: All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>

              <select
                value={rangeFilter}
                onChange={(e) => setRangeFilter(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {filteredAlerts.length === 0 ? (
              <div className="alerts-empty-state">
                <div className="alerts-empty-icon">🛡️</div>
                <h3>No security alerts detected.</h3>
                <p>Your protected API is operating normally.</p>
              </div>
            ) : (
              <div className="alerts-table-container">
                <table className="alerts-table">
                  <thead>
                    <tr>
                      <th>Threat</th>
                      <th>Severity</th>
                      <th>Endpoint</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAlerts.map((alert, index) => (
                      <tr
                        key={`${alert.threat}-${index}`}
                        onClick={() => setSelectedAlert(alert)}
                        className="alerts-table-row"
                      >
                        <td>{alert.threat}</td>

                        <td>
                          <span
                            className={`severity-badge ${alert.severity.toLowerCase()}`}
                          >
                            {alert.severity}
                          </span>
                        </td>

                        <td>{alert.endpoint}</td>

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
            )}
          </div>
        </div>

        {selectedAlert && (
          <div className="alert-details-overlay" onClick={closeDetails}>
            <div
              className="alert-details-drawer"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="alert-details-header">
                <div>
                  <p className="detail-label">Threat</p>
                  <h3>{selectedAlert.threat}</h3>
                </div>
                <button className="alert-details-close" onClick={closeDetails}>
                  ×
                </button>
              </div>

              <div className="alert-details-grid">
                <div>
                  <p className="detail-label">Severity</p>
                  <span
                    className={`severity-badge ${selectedAlert.severity.toLowerCase()}`}
                  >
                    {selectedAlert.severity}
                  </span>
                </div>

                <div>
                  <p className="detail-label">Risk Score</p>
                  <strong>
                    {selectedAlert.riskScore !== null && selectedAlert.riskScore !== undefined
                      ? `${selectedAlert.riskScore.toFixed(2)}`
                      : 'N/A'}
                  </strong>
                </div>

                <div>
                  <p className="detail-label">Endpoint</p>
                  <strong>{selectedAlert.endpoint}</strong>
                </div>

                <div>
                  <p className="detail-label">Method</p>
                  <strong>{selectedAlert.method}</strong>
                </div>

                <div>
                  <p className="detail-label">Source IP</p>
                  <strong>{selectedAlert.sourceIp}</strong>
                </div>

                <div>
                  <p className="detail-label">Action Taken</p>
                  <strong>{selectedAlert.actionTaken}</strong>
                </div>

                <div>
                  <p className="detail-label">Time</p>
                  <strong>{selectedAlert.time}</strong>
                </div>
              </div>

              {selectedAlert.detectedThreats?.length > 0 && (
                <div className="alert-threats-card">
                  <p className="detail-label">Detected Threats</p>
                  <ul>
                    {selectedAlert.detectedThreats.map((threat, index) => (
                      <li key={`${threat}-${index}`}>{threat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </FadeUpOnScroll>
  );
}

export default Alerts;
