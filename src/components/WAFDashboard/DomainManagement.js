import React, { useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';

function DomainManagement() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [domains, setDomains] = useState([
    {
      domain: 'api.ethixion.com',
      proxy: 'proxy.ethixion.com',
      ssl: true,
      waf: true,
      status: 'Active',
    },
    {
      domain: 'secure.demoapp.com',
      proxy: 'secure-proxy.demoapp.com',
      ssl: true,
      waf: false,
      status: 'Inactive',
    },
  ]);

  const [newDomain, setNewDomain] = useState('');
  const [newProxy, setNewProxy] = useState('');

  const addDomain = () => {
    if (!newDomain || !newProxy) return;

    const domainObj = {
      domain: newDomain,
      proxy: newProxy,
      ssl: true,
      waf: true,
      status: 'Active',
    };

    setDomains([...domains, domainObj]);

    setNewDomain('');
    setNewProxy('');
  };

  const toggleSSL = (index) => {
    const updated = [...domains];
    updated[index].ssl = !updated[index].ssl;
    setDomains(updated);
  };

  const toggleWAF = (index) => {
    const updated = [...domains];
    updated[index].waf = !updated[index].waf;
    setDomains(updated);
  };

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        <div
          className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}
        >
          <WAFDashboardNavbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            wafAPIExists={true}
          />

          <div className="dash-dataContainer">
            <span className="pageTitle">Ethixion WAF | Domain Management</span>

            <hr />

            {/* Header */}
            <div className="domain-header">
              <p>
                Manage protected domains, reverse proxy mappings, SSL
                protection, and WAF status.
              </p>
            </div>

            {/* Add Domain */}
            <div className="add-domain-card">
              <h2>Add Protected Domain</h2>

              <div className="domain-input-grid">
                <input
                  type="text"
                  placeholder="Protected Domain"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Proxy Domain"
                  value={newProxy}
                  onChange={(e) => setNewProxy(e.target.value)}
                />

                <button onClick={addDomain}>Add Domain</button>
              </div>
            </div>

            {/* Domain Table */}
            <div className="domain-table-container">
              <div className="table-header">
                <h2>Protected Domains</h2>
              </div>

              <table className="domain-table">
                <thead>
                  <tr>
                    <th>Protected Domain</th>
                    <th>Proxy Domain</th>
                    <th>SSL</th>
                    <th>WAF</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {domains.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="domain-badge">{item.domain}</span>
                      </td>

                      <td>{item.proxy}</td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.ssl}
                            onChange={() => toggleSSL(index)}
                          />

                          <span className="slider"></span>
                        </label>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.waf}
                            onChange={() => toggleWAF(index)}
                          />

                          <span className="slider"></span>
                        </label>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            item.status === 'Active' ? 'active' : 'inactive'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default DomainManagement;
