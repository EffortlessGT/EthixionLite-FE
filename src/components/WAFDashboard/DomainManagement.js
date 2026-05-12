import React, { useEffect, useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { getDomainsData } from '../../api';
import '../../App.css';

function DomainManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDomain, setNewDomain] = useState('');
  const [newProxy, setNewProxy] = useState('');

  // Fetch Domains
  useEffect(() => {
    const fetchDomainsData = async () => {
      try {
        setLoading(true);

        const data = await getDomainsData();

        console.log('API DATA =>', data);

        if (data && data.domainData) {
          const domainData = data.domainData;
          const formattedData = [
            {
              domain: domainData.protected_domain || '',
              proxy: domainData.proxy_domain || '',
              ssl: true,
              waf: true,
              status: domainData.waf_api_status || 'Inactive',
            },
          ];

          setDomains(formattedData);
        } else if (data) {
          const formattedData = [
            {
              domain: data.protected_domain || '',
              proxy: data.proxy_domain || '',
              ssl: true,
              waf: true,
              status: data.waf_api_status || 'Inactive',
            },
          ];

          setDomains(formattedData);
        } else {
          setDomains([]);
        }
      } catch (error) {
        console.error('Failed to fetch domains:', error);
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainsData();
  }, []);

  // Add Domain
  const addDomain = () => {
    if (!newDomain.trim() || !newProxy.trim()) return;

    const domainObj = {
      domain: newDomain.trim(),
      proxy: newProxy.trim(),
      ssl: true,
      waf: true,
      status: 'Active',
    };

    setDomains((prev) => [...prev, domainObj]);

    setNewDomain('');
    setNewProxy('');
  };

  // Toggle SSL
  const toggleSSL = (index) => {
    setDomains((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              ssl: !item.ssl,
            }
          : item
      )
    );
  };

  // Toggle WAF
  const toggleWAF = (index) => {
    setDomains((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              waf: !item.waf,
            }
          : item
      )
    );
  };

  return (
    <FadeUpOnScroll>
      <main className="dashboard">
        <div
          className={`dashboard-container ${
            menuOpen ? 'sidebar-open' : ''
          }`}
        >
          <WAFDashboardNavbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            wafAPIExists={true}
          />

          <div className="dash-dataContainer">
            <span className="pageTitle">
              Ethixion WAF | Domain Management
            </span>

            <hr />

            {/* Header */}
            <div className="domain-header">
              <p>
                Manage protected domains, reverse proxy mappings,
                SSL protection, and WAF status.
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

                <button onClick={addDomain}>
                  Add Domain
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="domain-table-container">
              <div className="table-header">
                <h2>Protected Domains</h2>
              </div>

              {loading ? (
                <div className="loading-container">
                  <p>Loading domains...</p>
                </div>
              ) : domains.length === 0 ? (
                <div className="empty-container">
                  <p>No protected domains found.</p>
                </div>
              ) : (
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
                          <span className="domain-badge">
                            {item.domain}
                          </span>
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
                              item.status === 'Active'
                                ? 'active'
                                : 'inactive'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default DomainManagement;