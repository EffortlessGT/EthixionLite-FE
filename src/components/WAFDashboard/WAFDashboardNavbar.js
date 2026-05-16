import React from 'react';
import user_img from '../../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import '../../App.css';

function WAFDashboardNavbar({ menuOpen, setMenuOpen, userData, wafAPIExists }) {
  return (
    <>
      {/* Hamburger */}
      <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </div>

      {/* Sidebar */}
      <div className={`dash-sidebar ${menuOpen ? 'show' : ''}`}>
        <div className="sidebar-userprofile">
          <img src={user_img} alt="user" />

          <div
            className="truncate"
            data-tooltip-id="nameTip"
            data-tooltip-content={
              userData?.fullname === 'Setup Required!'
                ? 'Set up your WAF to get started!'
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

        <div className="sidebar-navigations" onClick={() => setMenuOpen(false)}>
          {wafAPIExists === true && (
            <>
              <Link to="/domainmanagement">
                <h3>Domain Management</h3>
              </Link>

              <Link to="/rules">
                <h3>Security Rules</h3>
              </Link>

              <Link to="/ratelimit">
                <h3>Rate Limiting</h3>
              </Link>

              <Link to="/httpcontrol">
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

              <Link to="/dashboard">
                <h3>ASG Dashboard</h3>
              </Link>
            </>
          )}

          <Link to="/waf_api">
            <h3>API</h3>
          </Link>

          <Link to="/">
            <h3>Home</h3>
          </Link>
        </div>
      </div>
    </>
  );
}

export default WAFDashboardNavbar;
