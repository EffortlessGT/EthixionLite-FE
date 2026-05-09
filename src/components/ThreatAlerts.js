import React, { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import { getThreatLogs, getCurrentUser } from '../api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ThreatAlerts() {
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        setUserData(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await getThreatLogs();
        if (res.logs && res.logs.length > 0) {
          setLogs(res.logs);
          console.log(res);
        } else {
          setError('No Threats Detected Today for your API.');
        }
      } catch (exc) {
        console.error('Error -> ', exc);
        setError('No Threats Detected Today for your API.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreats();
  }, []);

  let logsdata;
  if (error) {
    logsdata = <p>{error}</p>;
  } else {
    logsdata = (
      <>
        {logs.map((app, i) => (
          <div class="threat-alert-box" key={i}>
            <h4>
              Threats Detected for API: <strong>{app.apiname}</strong>
            </h4>
            {app.threats.map((log, j) => (
              <div class="alert-log">
                <div className="alert-entry" key={j}>
                  <p>{log}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </>
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
            <h2 id="logs-heading">Threat Logs</h2>
            <p>
              You can view today's threat logs for your generated API requests
              along with detected threat details here.
            </p>
            {isLoading ? (
              <div style={{ padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      height={150}
                      borderRadius={8}
                      style={{ padding: '16px' }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="threat-alert-box">{logsdata}</div>
            )}
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default ThreatAlerts;
