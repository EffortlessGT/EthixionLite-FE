import React, { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import { getCurrentUser, getDashboardData } from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';

function Panel() {
  const [userData, setUserData] = useState(null);
  const [totalRQ, setTotalRQ] = useState('');
  const [allowedRQ, setAllowedRQ] = useState('');
  const [blockedRQ, setBlockedRQ] = useState('');
  const [suspiciousRQ, setSuspiciousRQ] = useState('');
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchDashboardRequestData = async () => {
      const data = await getDashboardData();
      if (data && Number(data.allowedReq) === 0) {
        setError("No Request Made today from your API.");
      }
      if (data && data.totalReq != null && data.allowedReq != null && data.blockedReq != null) {
        setTotalRQ(data.totalReq);
        setAllowedRQ(data.allowedReq);
        setBlockedRQ(data.blockedReq);
        setSuspiciousRQ(data.suspiciousReq);
      } else {
        setError("No Request Made from your API yet.");
      }
    };
    fetchDashboardRequestData();
  }, []);

  const dashboardData = error ? (
    <p>{error}</p>
  ) : (
    <div className='quick-stats'>
      <ul>
        <li>🔄 Total Requests Analyzed from your all API's: {totalRQ} </li>
        <li>✅ Allowed Requests: {allowedRQ}</li>
        <li>🚫 Blocked Threats: {blockedRQ}</li>
        <li>⚠️ Suspicious Activities Flagged: {suspiciousRQ}</li>
      </ul>
    </div>
  );

  return (
    <FadeUpOnScroll>
      <main className='dashboard'>
        <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </div>

        <div className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}>
          <div className={`dash-sidebar ${menuOpen ? 'show' : ''}`}>
            <div className='sidebar-userprofile'>
              <img src={user_img} alt='User' />
              <p>{userData ? userData.fullname : "Please Wait..."}</p>
            </div>
            <div className='sidebar-navigations' onClick={() => setMenuOpen(false)}>
              <Link to="/firewall_rules"><h3>Firewall Rules</h3></Link>
              <Link to="/threat_alerts"><h3>Threat Alerts</h3></Link>
              <Link to="/traffic_insights"><h3>Traffic Monitor</h3></Link>
              <Link to="/reportlogs"><h3>Report & Logs</h3></Link>
              <Link to="/api"><h3>API</h3></Link>
              <Link to="/api_settings"><h3>Settings</h3></Link>
              <Link to="/"><h3>Home</h3></Link>
            </div>
          </div>

          <div className="dash-dataContainer">
            <span>Dashboard</span>
            <p>Welcome to Ethixion! Ethixion is actively protecting your applications.</p>

            <h2>Quick Stats</h2>
            {dashboardData}

            <h2>Ethixion Tip</h2>
            <div className='system-tip'>
              <p>
                Consider limiting access to your login endpoints using rate-limiting or geofencing.
                While Ethixion auto-blocks brute-force patterns, narrowing the attack surface
                further enhances protection.
              </p>
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default Panel;
