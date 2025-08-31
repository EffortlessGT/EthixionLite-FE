import React, { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import { getCurrentUser, setEthixionRules } from '../api';

function EthixionRules() {
  const [userData, setUserData] = useState(null);
  const [apiname, setApiName] = useState('');
  const [threat_filters, setThreatFilters] = useState([]);
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

  const handleThreatFilters = (e) => {
    const val = e.target.value;
    if (e.target.checked) {
      setThreatFilters([...threat_filters, val]);
    } else {
      setThreatFilters(threat_filters.filter((filter) => filter !== val));
    }
  }
  const handleRules = async (e) => {
    e.preventDefault();
    const data = {
      apiname,
      threat_filters: threat_filters.join(','),
    };
    const apinamePatt = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!apinamePatt.test(apiname)) {
      alert("Please enter a valid API name.");
      return;
    }
    try {
      const res = await setEthixionRules(data);
      console.log(res.msg);
    } catch (error) {
      console.log("Error ->", error);
    }
  }
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
              <p>{userData ? userData.fullname : "Loading..."}</p>
            </div>
            <div className='sidebar-navigations' onClick={() => setMenuOpen(false)}>
              <Link to="/firewall_rules"><h3>Firewall Rules</h3></Link>
              <Link to="/threat_alerts"><h3>Threat Alerts</h3></Link>
              <h3>Traffic Monitor</h3>
              <h3>Application Insights</h3>
              <h3>Rate Limiting & Flood Control</h3>
              <Link to="/reportlogs"><h3>Report & Logs</h3></Link>
              <Link to="/api"><h3>API</h3></Link>
              <h3>Settings</h3>
              <Link to="/"><h3>Home</h3></Link>
            </div>
          </div>

          <div className="dash-dataContainer">
            <div className="firewall-rules-container">
              <h2>Ethixion Rules</h2>
              <form onSubmit={handleRules} method="POST">
                <label for="apiname">API Name:</label><br />
                <input type="text" id="apiname" name="apiname" value={apiname} onChange={(e) => setApiName(e.target.value)} required /><br />

                <fieldset>
                  <legend>Custom Firewall Rules (Enable/Disable)</legend>

                  <input type="checkbox" id="rule_allowlist_ip" name="allowlist_ip" value="Allowlist IP" checked={threat_filters.includes('Allowlist IP')} onChange={handleThreatFilters} />
                  <label for="rule_allowlist_ip">Allowlist IP</label><br />

                  <input type="checkbox" id="rule_rate_limit" name="rate_limit" value="Rate Limiting" checked={threat_filters.includes('Rate Limiting')} onChange={handleThreatFilters} />
                  <label for="rule_rate_limit">Enable Rate Limiting</label><br />

                  <input type="checkbox" id="rule_geofencing" name="geofencing" value="Geofencing" checked={threat_filters.includes('Geofencing')} onChange={handleThreatFilters} />
                  <label for="rule_geofencing">Enable Geofencing</label><br />

                  <input type="checkbox" id="rule_alert_email" name="alert_email_enabled" value="Alert Emails" checked={threat_filters.includes('Alert Emails')} onChange={handleThreatFilters} />
                  <label for="rule_alert_email">Enable Alert Emails</label><br />

                  <input type="checkbox" id="rule_pattern_matching" name="pattern_matching" value="Threat Pattern Matching" checked={threat_filters.includes('Threat Pattern Matching')} onChange={handleThreatFilters} />
                  <label for="rule_pattern_matching">Enable Threat Pattern Matching</label><br />
                </fieldset>

                <br />
                <button type="submit">Submit</button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default EthixionRules;
