import { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import {
  getCurrentUser,
  getReportLogs,
  getDashboardSecurityDetails,
  getDashboardTrendsDetails,
  getDashboardTrendsStatusDetails,
  getDashboardAdvanceMonitorsDetails,
} from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from 'recharts';

function TrafficMonitorPage() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('volume');
  const [isLoading, setIsLoading] = useState(true);

  const [totalRQ, setTotalRQ] = useState('0 Today');
  const [allowedRQ, setAllowedRQ] = useState('0 Today');
  const [blockedRQ, setBlockedRQ] = useState('0 Today');
  const [suspiciousRQ, setSuspiciousRQ] = useState('0 Today');

  const [topThreats, setTopThreats] = useState([]);
  const [threatsOverTime, setThreatsOverTime] = useState([]);
  const [error, setError] = useState('');
  const [userActivity, setUserActivity] = useState([]);
  const [userAgents, setUserAgents] = useState([]);
  const [peakTraffic, setPeakTraffic] = useState([]);
  const [weekdayTraffic, setWeekdayTraffic] = useState([]);
  const [geoDistribution, setGeoDistribution] = useState([]);
  const [statusPieData, setStatusPieData] = useState([]);
  const [apiStatusBreakdown, setApiStatusBreakdown] = useState([]);
  const [failuresOverTime, setFailuresOverTime] = useState([]);
  const [apiHeatmapData, setApiHeatmapData] = useState([]);
  const [ipReliability, setIpReliability] = useState([]);
  const [autoFlaggedIPs, setAutoFlaggedIPs] = useState([]);
  const [rateAbusePatterns, setRateAbusePatterns] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        setUserData(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchVolumeData = async () => {
      try {
        const result = await getReportLogs();
        console.log('REPORT LOGS =>', result.data1);

        setTotalRQ(result.data1.totalReq);
        setAllowedRQ(result.data1.allowedReq);
        setBlockedRQ(result.data1.blockedReq);
        setSuspiciousRQ(result.data1.suspiciousReq);
        setError('');
      } catch (e) {
        setError('No API request made today...');
      }
    };

    const fetchSecurityData = async () => {
      try {
        const result = await getDashboardSecurityDetails();
        //console.log("SECURITY API RESULT:", result);

        if (result && result.securitydata) {
          const cleanedTopThreats = result.securitydata.top_threat_types.map(
            (threat) => ({
              threat: threat.threat || 'Unknown Threat',
              count: Number(threat.count) || 0,
            })
          );

          const cleanedThreatsOverTime =
            result.securitydata.threats_over_time.map((entry) => ({
              ...entry,
              date: new Date(entry.date).toLocaleDateString(),
              count: Number(entry.count) || 0,
            }));

          setTopThreats(cleanedTopThreats);
          setThreatsOverTime(cleanedThreatsOverTime);
          setError('');
        } else {
          setError('Security data is empty or malformed.');
        }
      } catch (e) {
        console.error('Error fetching security dashboard:', e);
        setError('Security data not available. Make some API requests first.');
      }
    };

    const fetchTrendsData = async () => {
      try {
        const result = await getDashboardTrendsDetails();

        if (result && result.trenddata) {
          setUserActivity(
            result.trenddata.user_activity.map((entry) => ({
              ...entry,
              count: Number(entry.count),
            }))
          );

          setUserAgents(
            result.trenddata.user_agents.map((entry) => ({
              ...entry,
              count: Number(entry.count),
            }))
          );

          setPeakTraffic(
            result.trenddata.peak_traffic.map((entry) => ({
              ...entry,
              hour: new Date(entry.hour).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              count: Number(entry.count),
            }))
          );

          setWeekdayTraffic(
            result.trenddata.weekday_traffic.map((entry) => ({
              day_of_week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                entry.day_of_week
              ],
              count: Number(entry.count),
            }))
          );

          setGeoDistribution(
            result.trenddata.geo_distribution.map((entry) => ({
              ip_address: entry.ip_address
                ? String(entry.ip_address)
                : 'Unknown',
              count: Number(entry.count),
            }))
          );

          setError('');
        } else {
          setError('Trend data is empty or malformed.');
        }
      } catch (e) {
        console.error('Error fetching trend data:', e);
        setError('Trend data not available.');
      }
    };

    const fetchTrendsStatusData = async () => {
      try {
        const result = await getDashboardTrendsStatusDetails();
        if (result && result.trends_status) {
          setStatusPieData(
            result.trends_status.status_pie.map((item) => ({
              name: item.status ? 'Success' : 'Failure',
              value: Number(item.count),
            }))
          );

          setApiStatusBreakdown(
            result.trends_status.api_status_breakdown.map((item) => ({
              apiname: item.apiname,
              success: Number(item.success),
              failure: Number(item.failure),
            }))
          );

          setFailuresOverTime(
            result.trends_status.failure_timeline.map((entry) => ({
              ...entry,
              date: new Date(entry.date).toLocaleDateString(),
              failures: Number(entry.failures),
            }))
          );

          setError('');
        } else {
          setError('Status data is empty or malformed.');
        }
      } catch (e) {
        console.error('Error fetching trends status data:', e);
        setError('Status trend data not available.');
      }
    };

    const fetchAdvanceMonitorsData = async () => {
      try {
        const result = await getDashboardAdvanceMonitorsDetails();

        if (result && result.adv_monitors) {
          setApiHeatmapData(
            result.adv_monitors.api_threat_heatmap.map((entry) => ({
              apiname: entry.apiname,
              threat_count: Number(entry.threat_count || 0),
              total_requests: Number(entry.total_requests || 0),
            }))
          );

          setIpReliability(
            result.adv_monitors.success_rate_data.map((entry) => {
              const total =
                Number(entry.success || 0) + Number(entry.failure || 0);
              const rate = total > 0 ? (entry.success / total) * 100 : 0;
              return {
                ip_address: entry.ip_address,
                success_rate: parseFloat(rate.toFixed(2)),
                success: Number(entry.success || 0),
                failure: Number(entry.failure || 0),
              };
            })
          );

          setAutoFlaggedIPs(
            result.adv_monitors.flagged_abuse.map((entry) => ({
              ip: entry.ip_address,
              failures: Number(entry.failure || 0),
            }))
          );

          setRateAbusePatterns(
            result.adv_monitors.rate_limit_alerts.map((entry) => ({
              ip: entry.ip_address,
              frequency: Number(entry.frequency || 0),
            }))
          );

          setError('');
        } else {
          setError('Advanced monitoring data is empty or malformed.');
        }
      } catch (e) {
        console.error('Error fetching advanced monitors:', e);
        setError('Advanced monitoring data not available.');
      }
    };

    fetchUser();
    fetchVolumeData();
    fetchSecurityData();
    fetchTrendsData();
    fetchTrendsStatusData();
    fetchAdvanceMonitorsData();

    // Set loading to false after a short delay to ensure all data is fetched
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const volumeContainer = error ? (
    <p>{error}</p>
  ) : (
    <>
      <h2>📊 Volume & Usage Overview - Today</h2>
      <div className="monitor-grid">
        <div className="monitor-card">
          <h3>Total Requests</h3>
          <p>{totalRQ} Today</p>
        </div>
        <div className="monitor-card">
          <h3>Allowed Requests</h3>
          <p>{allowedRQ} Today</p>
        </div>
        <div className="monitor-card">
          <h3>Blocked Requests</h3>
          <p>{blockedRQ} Today</p>
        </div>
        <div className="monitor-card">
          <h3>Suspicious Requests</h3>
          <p>{suspiciousRQ} Today</p>
        </div>
      </div>
    </>
  );

  const securityContainer = error ? (
    <p>{error}</p>
  ) : (
    <>
      <h2>🔐 Security & Threat Insights</h2>
      <div className="chart-wrapper">
        <div className="chart-card">
          <h4>Top Threat Types</h4>
          {topThreats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topThreats}>
                <XAxis dataKey="threat" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7f50" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No threat data available</p>
          )}
        </div>

        <div className="chart-card">
          <h4>Threats Over Time</h4>
          {threatsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatsOverTime}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No threat timeline data available</p>
          )}
        </div>
      </div>
    </>
  );

  const trendsContainer = error ? (
    <p>{error}</p>
  ) : (
    <>
      <h2>🗓️ Time-based Traffic Trends</h2>
      <div className="chart-wrapper">
        <div className="chart-card">
          <h4>📈 User Activity Timeline</h4>
          {userActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivity}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No activity data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>🕓 Peak Traffic Hours</h4>
          {peakTraffic.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakTraffic}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hourly data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>⌛ Requests per Weekday</h4>
          {weekdayTraffic.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekdayTraffic}>
                <XAxis dataKey="day_of_week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No weekday data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>🌐 Top User Agents</h4>
          {userAgents.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userAgents}>
                <XAxis dataKey="user_agent" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8dd1e1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No user agent data</p>
          )}
        </div>
        <div className="chart-card">
          <h4>🌍 Top IP Addresses</h4>
          {geoDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geoDistribution}>
                <XAxis dataKey="ip_address" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#a569bd" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No IP geo data available</p>
          )}
        </div>
      </div>
    </>
  );
  const trendsStatusContainer = error ? (
    <p>{error}</p>
  ) : (
    <>
      <h2>⚙️ API Status & Reliability Trends</h2>
      <div className="chart-wrapper">
        <div className="chart-card">
          <h4>✔️ Success vs Failure Rate</h4>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusPieData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No status pie data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>📊 API-wise Status Breakdown</h4>
          {apiStatusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiStatusBreakdown}>
                <XAxis dataKey="apiname" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" stackId="a" fill="#4caf50" />
                <Bar dataKey="failure" stackId="a" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No API breakdown data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>📉 Failures Over Time</h4>
          {failuresOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={failuresOverTime}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="failures" stroke="#f44336" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No failure timeline data</p>
          )}
        </div>
      </div>
    </>
  );

  const advanceMonitorContainers = error ? (
    <p>{error}</p>
  ) : (
    <>
      <h2>🔶 Advanced Monitoring & Alerts</h2>
      <div className="chart-wrapper">
        <div className="chart-card">
          <h4>📊 API Threat Heatmap</h4>
          {apiHeatmapData && apiHeatmapData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiHeatmapData}>
                <XAxis dataKey="apiname" />
                <YAxis domain={[0, 'dataMax + 10']} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="threat_count"
                  fill="#f39c12"
                  name="Threat Count"
                  barSize={40}
                  minPointSize={10}
                />
                <Bar
                  dataKey="total_requests"
                  fill="#3498db"
                  name="Total Requests"
                  barSize={40}
                  minPointSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="chart-card">
          <h4>⚖️ IP Success Rate</h4>
          {ipReliability && ipReliability.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ipReliability}>
                <XAxis dataKey="ip_address" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="success"
                  fill="#2ecc71"
                  barSize={40}
                  minPointSize={10}
                />
                <Bar
                  dataKey="failure"
                  fill="#e74c3c"
                  barSize={40}
                  minPointSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="chart-card">
          <h4>⛔ Auto-Flagged IPs</h4>
          {autoFlaggedIPs && autoFlaggedIPs.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={autoFlaggedIPs}>
                <XAxis dataKey="ip" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="failures"
                  fill="#e74c3c"
                  barSize={40}
                  minPointSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No flagged IPs</p>
          )}
        </div>

        <div className="chart-card">
          <h4>🔁 Rate Abusive IPs</h4>
          {rateAbusePatterns && rateAbusePatterns.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rateAbusePatterns}>
                <XAxis dataKey="ip" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="frequency"
                  fill="#9b59b6"
                  barSize={40}
                  minPointSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No rate-abuse patterns detected</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </div>

        <div
          className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}
        >
          <div className={`dash-sidebar ${menuOpen ? 'show' : ''}`}>
            <div className="sidebar-userprofile">
              <img src={user_img} alt="User" />
              <p>{userData ? userData.fullname : 'Loading...'}</p>
            </div>
            <div
              className="sidebar-navigations"
              onClick={() => setMenuOpen(false)}
            >
              <Link to="/firewall_rules">
                <h3>Firewall Rules</h3>
              </Link>
              <Link to="/threat_alerts">
                <h3>Threat Alerts</h3>
              </Link>
              <Link to="/traffic_insights">
                <h3>Traffic Monitor</h3>
              </Link>
              <Link to="/reportlogs">
                <h3>Report & Logs</h3>
              </Link>
              <Link to="/api">
                <h3>API</h3>
              </Link>
              <Link to="/api_settings">
                <h3>Settings</h3>
              </Link>
              <Link to="/">
                <h3>Home</h3>
              </Link>
            </div>
          </div>

          <div className="dash-dataContainer">
            <div className="monitor-tabs">
              <button
                onClick={() => setCurrentView('volume')}
                className={currentView === 'volume' ? 'active' : ''}
              >
                📊 Volume
              </button>
              <button
                onClick={() => setCurrentView('security')}
                className={currentView === 'security' ? 'active' : ''}
              >
                🔐 Security
              </button>
              <button
                onClick={() => setCurrentView('trends')}
                className={currentView === 'trends' ? 'active' : ''}
              >
                🗓️ Trends
              </button>
              <button
                onClick={() => setCurrentView('advance_monitors')}
                className={currentView === 'advance_monitors' ? 'active' : ''}
              >
                🌍 Advance Monitorings
              </button>
              <button
                onClick={() => setCurrentView('status')}
                className={currentView === 'status' ? 'active' : ''}
              >
                ⚙️ Status
              </button>
            </div>

            <div className="monitor-section fade-in">
              {isLoading ? (
                <div style={{ padding: '20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                      margin: '24px 0',
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton
                        key={i}
                        height={300}
                        borderRadius={8}
                        style={{ padding: '16px' }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {currentView === 'volume' && volumeContainer}
                  {currentView === 'security' && securityContainer}
                  {currentView === 'trends' && trendsContainer}
                  {currentView === 'advance_monitors' &&
                    advanceMonitorContainers}
                  {currentView === 'status' && trendsStatusContainer}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default TrafficMonitorPage;
