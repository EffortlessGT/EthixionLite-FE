import React, { useState } from 'react';
import fevicon from '../assets/img/fevicon.svg';
import { Link } from 'react-router-dom';

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <div className="navbar">
        {/* Logo */}
        <div className="logo" onClick={toggleMenu}>
          <img src={fevicon} alt="Ethixion" /> Ethi<span>xion</span>
        </div>

        {/* Sidebar menu */}
        <div className={`menus ${menuOpen ? 'show' : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/action" onClick={closeMenu}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={closeMenu}>
                API Dashboard
              </Link>
            </li>
            <li>
              <Link to="/waf_dashboard" onClick={closeMenu}>
                WAF Dashboard
              </Link>
            </li>
            <li>
              <Link to="/SDK" onClick={closeMenu}>
                SDK
              </Link>
            </li>
            <li>
              <Link to="/documentation" onClick={closeMenu}>
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                About us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ KEEP overlay always mounted */}
      <div
        className={`overlay ${menuOpen ? 'show' : ''}`}
        onClick={closeMenu}
      />
    </nav>
  );
}

export default Nav;
