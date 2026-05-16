import React, { useEffect, useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { getDomainsData, getCurrentWAFUser, updateWAFAPIDomainStatus } from '../../api';
import '../../App.css';
import { toast } from 'sonner';

function DomainManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDomain, setNewDomain] = useState('');
  const [newProxy, setNewProxy] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDomainsData = async () => {
      try {
        const [user, domains] = await Promise.all([
          getCurrentWAFUser(),
          getDomainsData(),
        ]);
        setUser(user);
        setDomains(domains);
        setLoading(true);

        const data = await getDomainsData();

        console.log('API DATA =>', data);

        if (!data) {
          setDomains([]);
          return;
        }

        const domainData = data.domainData || data;

        if (!domainData.protected_domain) {
          setDomains([]);
          return;
        }

        const formattedData = [
          {
            waf_name: domainData.waf_name || '',
            domain: domainData.protected_domain || '',
            proxy: domainData.proxy_domain || '',
            ssl: true,
            waf: domainData.waf_api_status === 'Active',
            status: domainData.waf_api_status || 'Inactive',
            created_at: domainData.created_at || '',
          },
        ];

        setDomains(formattedData);
      } catch (error) {
        console.error('Failed to fetch domains:', error);
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainsData();
  }, []);



  // Add Domain (creation is disabled — function removed until backend integration)

  const toggleWAF = async (index) => {
    const domainToUpdate = domains[index];
    if (!domainToUpdate) return;

    const newStatus = domainToUpdate.waf ? 'Inactive' : 'Active';
    const payload = {
      apiname: domainToUpdate.waf_name || domainToUpdate.domain,
      status: newStatus,
    };

    const result = await updateWAFAPIDomainStatus(payload);

    if (result && result.status === 'success') {
      toast.success(`WAF status updated to ${newStatus}`);
      setDomains((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                waf: !item.waf,
                status: newStatus,
              }
            : item
        )
      );
    } else {
      toast.error('Unable to update WAF domain status on the backend:', payload);
    }
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
            userData={user}
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

            {/* Add Domain (disabled — coming soon) */}
            <div
              className="add-domain-card disabled-card"
              title="Multi-Domain Protection coming soon — creating or mapping domains is disabled."
              tabIndex={0}
            >
              <h2>
                Add Protected Domain
                <span className="coming-soon-badge" aria-hidden>
                  Coming Soon
                </span>
              </h2>

              <div className="coming-soon-note">
                <p>
                  Multi-Domain Protection is coming soon. Creating or mapping new
                  domains is disabled for now.
                </p>
              </div>

              <div className="tooltip" role="tooltip">Multi-Domain Protection coming soon</div>

              <form className="domain-form" onSubmit={(e) => e.preventDefault()}>
                <div className="domain-input-grid">
                  <input
                    type="text"
                    placeholder="Protected Domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    disabled
                  />

                  <input
                    type="text"
                    placeholder="Proxy Domain"
                    value={newProxy}
                    onChange={(e) => setNewProxy(e.target.value)}
                    disabled
                  />

                  <button disabled title="Disabled until Multi-Domain Protection is available">
                    Add Domain
                  </button>
                </div>
              </form>

              <div className="disabled-disclaimer">
                This feature will allow mapping multiple protected domains and proxies
                to a WAF API. It will be available in a future release.
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
                      <th>WAF Name</th>
                      <th>Protected Domain</th>
                      <th>Proxy Domain</th>
                      <th>WAF</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {domains.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="waf-badge">{item.waf_name}</span>
                        </td>
                        <td>
                          <span className="domain-badge">{item.domain}</span>
                        </td>

                        <td>{item.proxy}</td>

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
                        <td>
                          <span className="createdat-badge">
                            {item.created_at
                              ? item.created_at.replace('T', ' ').split('.')[0]
                              : 'N/A'}
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
