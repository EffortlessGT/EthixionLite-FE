import React, { useEffect, useState } from 'react';
//import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import {
  getWAFDashboardData,
  getCurrentWAFUser,
  getWAFSecurityTipOfDay,
} from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function WAFPanel() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    allowed: 0,
    blocked: 0,
    suspicious: 0,
  });

  const [wafInfo, setWafInfo] = useState([]);

  const [dailySecurityTips, setDailySecurityTips] = useState({
    title: '',
    description: '',
    category: '',
    severity: '',
  });

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentWAFUser();
        setUserData(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getWAFDashboardData();

        if (response) {
          // Stats
          setStats({
            total: response.data?.total_requests || 0,
            allowed: response.data?.allowed_requests || 0,
            blocked: response.data?.blocked_requests || 0,
            suspicious: response.data?.suspicious_requests || 0,
          });

          // ✅ MULTIPLE WAF APIs
          if (Array.isArray(response.waf_details)) {
            setWafInfo(
              response.waf_details.map((item) => ({
                wafName: item.waf_name,
                domain: item.protected_domain,
                status: item.waf_api_status,
                inspection: item.inspection_mode,
                proxy: item.proxy_domain,
                apiKey: item.api_key,
              }))
            );
          } else if (response.waf_details) {
            // fallback if backend sends single object
            setWafInfo([
              {
                wafName: response.waf_details.waf_name,
                domain: response.waf_details.protected_domain,
                status: response.waf_details.waf_api_status,
                inspection: response.waf_details.inspection_mode,
                proxy: response.waf_details.proxy_domain,
                apiKey: response.waf_details.api_key,
              },
            ]);
          }
        }
      } catch (err) {
        console.log(err);
      }
      try {
        const response = await getWAFSecurityTipOfDay();
        setDailySecurityTips({
          title: response.title,
          description: response.description,
          category: response.category,
          severity: response.severity,
        });
      } catch (err) {
        console.log('Error fetching data => ', err);
      }
    };

    fetchDashboard();
  }, []);

  const pieData = [
    { name: 'Allowed', value: stats.allowed },
    { name: 'Blocked', value: stats.blocked },
    { name: 'Suspicious', value: stats.suspicious },
  ];

  const barData = [
    { type: 'Allowed', value: stats.allowed },
    { type: 'Blocked', value: stats.blocked },
    { type: 'Suspicious', value: stats.suspicious },
  ];

  const COLORS = ['#00ff9d', '#ff4d4d', '#ffc107'];

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        {/* Hamburger */}
        <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </div>

        <div
          className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}
        >
          {/* Sidebar */}
          <div className={`dash-sidebar ${menuOpen ? 'show' : ''}`}>
            <div className="sidebar-userprofile">
              <img src="../assets/img/user_img.png" alt="user" />
              <p>{userData ? userData.fullname : 'Please Wait...'}</p>
            </div>

            <div
              className="sidebar-navigations"
              onClick={() => setMenuOpen(false)}
            >
              <Link to="/domain">
                <h3>Domain Management</h3>
              </Link>
              <Link to="/rules">
                <h3>Security Rules</h3>
              </Link>
              <Link to="/ratelimit">
                <h3>Rate Limiting</h3>
              </Link>
              <Link to="/http">
                <h3>HTTP Method Control</h3>
              </Link>
              <Link to="/apikeys">
                <h3>API Keys</h3>
              </Link>
              <Link to="/logs">
                <h3>Logging & Monitoring</h3>
              </Link>
              <Link to="/alerts">
                <h3>Alerts</h3>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="dash-dataContainer">
            <span>Dashboard</span>
            <p>Ethixion is actively protecting your APIs and domains.</p>

            {/* WAF INFO */}
            <h2>WAF Information</h2>

            <div className="waf-info-grid">
              <table className="waf-table">
                <thead>
                  <tr>
                    <th>WAF Name</th>
                    <th>Protected Domain</th>
                    <th>Status</th>
                    <th>Inspection Mode</th>
                    <th>Proxy Domain</th>
                    <th>API Key</th>
                  </tr>
                </thead>
                <tbody>
                  {wafInfo.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        No APIs found
                      </td>
                    </tr>
                  ) : (
                    wafInfo.map((api, index) => (
                      <tr key={index}>
                        <td>{api.wafName}</td>
                        <td>{api.domain}</td>
                        <td>
                          <span
                            className={`status ${api.status === 'Active' ? 'active' : 'inactive'}`}
                          >
                            {api.status}
                          </span>
                        </td>
                        <td>{api.inspection}</td>
                        <td>{api.proxy}</td>
                        <td className="api-key">{api.apiKey}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* QUICK STATS */}
            <h2>Quick Stats</h2>

            <div className="quick-stats">
              <ul>
                <li>🔄 Total Requests: {stats.total}</li>
                <li>✅ Allowed Requests: {stats.allowed}</li>
                <li>🚫 Blocked Threats: {stats.blocked}</li>
                <li>⚠ Suspicious Activities: {stats.suspicious}</li>
              </ul>
            </div>

            {/* CHARTS */}
            <div className="chart-grid">
              <div className="chart-box">
                <h3>Request Status</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={90}>
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-box">
                <h3>Threat Detection</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ff4d4d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TIP */}
            <h2>Ethixion Tip</h2>

            <div className="system-tip">
              <div className="tip-header">
                <span className="tip-badge">Daily Tip</span>
                <span className="tip-severity high">
                  {dailySecurityTips.severity}
                </span>
              </div>

              <h3 className="tip-title">{dailySecurityTips.title}</h3>

              <p className="tip-description">{dailySecurityTips.description}</p>

              <div className="tip-footer">
                <span className="tip-category">
                  {dailySecurityTips.category}
                </span>
                <span className="tip-date">Today</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default WAFPanel;
