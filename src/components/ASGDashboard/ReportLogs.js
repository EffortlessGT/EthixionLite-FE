import React, { useEffect, useState } from 'react';
import user_img from '../../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import { getCurrentUser, getReportLogs } from '../../api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ReportLogs() {
  const [userData, setUserData] = useState(null);
  const [totalRQ, setTotalRQ] = useState('');
  const [allowedRQ, setAllowedRQ] = useState('');
  const [blockedRQ, setBlockedRQ] = useState('');
  const [suspiciousRQ, setSuspiciousRQ] = useState('');
  const [threat_filters, setThreatFilters] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
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
    const fetchReport = async () => {
      try {
        const result = await getReportLogs();
        console.log(result.data1);
        console.log(result.data2);
        if (parseInt(result.data1.totalReq) > 0) {
          setTotalRQ(result.data1.totalReq);
          setAllowedRQ(result.data1.allowedReq);
          setBlockedRQ(result.data1.blockedReq);
          setSuspiciousRQ(result.data1.suspiciousReq);
          setThreatFilters(result.data2);
        } else {
          setError('No request made today.');
        }
      } catch (error) {
        setError(
          'No api request made today. if you dont created any api yet kindly do it first and your request made stats will be visible here.'
        );
        //console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  let tableData;
  if (error) {
    tableData = (
      <div className="logsContainer">
        <h2>Overall Logs Data</h2>
        <p>{error}</p>
      </div>
    );
  } else {
    tableData = (
      <div className="logsContainer">
        <h2>All API's Overall Logs Data</h2>
        <table>
          <thead>
            <tr>
              <th>API Name</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>User Agent</th>
              <th>Request Status</th>
              <th>Threats</th>
            </tr>
          </thead>
          <tbody>
            {threat_filters.map((item, index) => (
              <tr key={index}>
                <td>{item.apiname}</td>
                <td>{item.timestamp}</td>
                <td>{item.ip_address}</td>
                <td>{item.user_agent}</td>
                <td>{item.status ? 'Allowed' : 'Blocked'}</td>
                <td>{item.threats && item.threats.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  let render;
  if (error) {
    render = (
      <div className="statContainer">
        <h2>Todays Request Statistics</h2>
        <p>{error}</p>
      </div>
    );
  } else {
    render = (
      <div className="statContainer">
        <h2>Todays Request Stats</h2>
        <p>Allowed Requests: {allowedRQ}</p>
        <p>Total Requests: {totalRQ}</p>
        <p>Blocked Requests: {blockedRQ}</p>
        <p>suspicious Request Detected: {suspiciousRQ}</p>
      </div>
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
            {isLoading ? (
              <div style={{ padding: '20px' }}>
                <Skeleton
                  height={20}
                  width="30%"
                  style={{ margin: '24px 0 16px 0' }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    margin: '16px 0',
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      height={80}
                      width={200}
                      borderRadius={8}
                    />
                  ))}
                </div>
                <Skeleton
                  height={20}
                  width="30%"
                  style={{ margin: '24px 0 16px 0' }}
                />
                <div style={{ margin: '16px 0' }}>
                  <Skeleton height={20} style={{ marginBottom: '12px' }} />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <Skeleton height={20} width="15%" />
                      <Skeleton height={20} width="15%" />
                      <Skeleton height={20} width="15%" />
                      <Skeleton height={20} width="15%" />
                      <Skeleton height={20} width="10%" />
                      <Skeleton height={20} width="20%" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {render}
                {tableData}
              </>
            )}
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default ReportLogs;
