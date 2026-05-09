import React, { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link, useNavigate } from 'react-router-dom';
import {
  checkASGExistsForCurrentUser,
  getCurrentUser,
  getDashboardData,
} from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Panel() {
  const [userData, setUserData] = useState(null);
  const [isAPIExists, setIsAPIExists] = useState(null);
  const [totalRQ, setTotalRQ] = useState(0);
  const [allowedRQ, setAllowedRQ] = useState(0);
  const [blockedRQ, setBlockedRQ] = useState(0);
  const [suspiciousRQ, setSuspiciousRQ] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [apiStatus, user, dashboard] = await Promise.all([
          checkASGExistsForCurrentUser(),
          getCurrentUser(),
          getDashboardData(),
        ]);

        setIsAPIExists(apiStatus);
        setUserData(user);

        if (!dashboard) {
          setError('No Request Made from your API yet.');
          return;
        }

        setTotalRQ(dashboard.totalReq ?? 0);
        setAllowedRQ(dashboard.allowedReq ?? 0);
        setBlockedRQ(dashboard.blockedReq ?? 0);
        setSuspiciousRQ(dashboard.suspiciousReq ?? 0);

        if (Number(dashboard.allowedReq) === 0) {
          setError('No Request Made today from your API.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isAPIExists === null) {
    return (
      <FadeUpOnScroll>
        <main className="dashboard">
          <div style={{ padding: '20px' }}>
            <Skeleton height={24} width="50%" style={{ marginBottom: '20px' }} />
            <Skeleton height={20} width="30%" style={{ margin: '24px 0 16px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '16px 0' }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={80} width={200} borderRadius={8} />
              ))}
            </div>
            <Skeleton height={200} borderRadius={8} style={{ padding: '24px', margin: '16px 0' }} />
          </div>
        </main>
      </FadeUpOnScroll>
    );
  }

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
              <div
                className="truncate"
                data-tooltip-id="nameTip"
                data-tooltip-content={
                  userData?.fullname === 'Setup Required!'
                    ? 'Set up your ASG to get started!'
                    : userData?.fullname || 'Loading...'
                }
              >
                {userData?.fullname || 'Loading...'}
              </div>

              <ReactTooltip
                id="nameTip"
                place="bottom"
                className="custom-tooltip"
              />
            </div>

            <div
              className="sidebar-navigations"
              onClick={() => setMenuOpen(false)}
            >
              {isAPIExists === true && (
                <>
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
                  <Link to="/api_settings">
                    <h3>Settings</h3>
                  </Link>
                  <Link to="/waf_dashboard">
                    <h3>WAF Dashboard</h3>
                  </Link>
                </>
              )}
              <Link to="/api">
                <h3>API</h3>
              </Link>
              <Link to="/">
                <h3>Home</h3>
              </Link>
            </div>
          </div>

          <div className="dash-dataContainer">
            <span>Ethixion | API Security Gatway Dashboard</span>

            {loading ? (
              <div style={{ padding: '20px' }}>
                <Skeleton height={24} width="50%" style={{ marginBottom: '20px' }} />
                <Skeleton height={16} style={{ marginBottom: '8px' }} />
                <Skeleton height={20} width="30%" style={{ margin: '24px 0 16px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '16px 0' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height={80} width={200} borderRadius={8} />
                  ))}
                </div>
                <Skeleton height={20} width="30%" style={{ margin: '24px 0 16px 0' }} />
                <Skeleton height={200} borderRadius={8} style={{ padding: '24px', margin: '16px 0' }} />
              </div>
            ) : !isAPIExists ? (
              <div className="api-warning">
                <p>
                  It looks like you haven't set up your API Security Gateway
                  Service yet. Please create your ASG API first and start
                  protecting your APIs.
                </p>
                <button onClick={() => navigate('/api')}>Create ASG API</button>
              </div>
            ) : (
              <>
                <p>
                  Welcome Back Dear, {userData?.fullname || 'User'}! Have a look
                  at your ASG Statistics.
                </p>

                <h2>Quick Stats</h2>

                {error ? (
                  <p>{error}</p>
                ) : (
                  <div className="quick-stats">
                    <ul>
                      <li>🔄 Total Requests: {totalRQ}</li>
                      <li>✅ Allowed Requests: {allowedRQ}</li>
                      <li>🚫 Blocked Threats: {blockedRQ}</li>
                      <li>⚠️ Suspicious Activities: {suspiciousRQ}</li>
                    </ul>
                  </div>
                )}

                <h2>Ethixion Tip</h2>
                <div className="system-tip">
                  <p>
                    Consider limiting access to your login endpoints using
                    rate-limiting or geofencing. While Ethixion auto-blocks
                    brute-force patterns, narrowing the attack surface further
                    enhances protection.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default Panel;
