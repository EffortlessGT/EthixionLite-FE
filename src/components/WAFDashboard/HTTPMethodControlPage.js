import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { getCurrentWAFUser, getDomainsData, getHTTPMethodRules, saveHTTPMethodRules, deleteHTTPMethodRule, addWAFHTTPRule } from '../../api';
import { toast } from 'sonner';
import '../../App.css';

function HTTPMethodControl() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newMethod, setNewMethod] = useState({
    method: 'GET',
    enabled: true,
    action: 'Allow',
    logging: true,
    priority: 1,
  });


  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let currentDomains = domains;
        
        // Initial load: fetch user and domains
        if (domains.length === 0) {
          const [userData, domainData] = await Promise.all([
            getCurrentWAFUser(),
            getDomainsData(),
          ]);
          setUser(userData);
          if (domainData) {
            const domainInfo = domainData.domainData || domainData;
            currentDomains = domainInfo.protected_domain ? [domainInfo] : (Array.isArray(domainInfo) ? domainInfo : []);
            setDomains(currentDomains);
            if (currentDomains.length > 0 && !selectedDomain) {
              setSelectedDomain(currentDomains[0]);
              return; // Let the next effect cycle handle rule fetching
            }
          }
        }

        // Fetch rules for selected domain
        if (selectedDomain) {
          const name = selectedDomain.waf_name || selectedDomain.protected_domain;
          const data = await getHTTPMethodRules(name);
          if (data) {
            let rawRules = [];
            if (data.methods && Array.isArray(data.methods)) {
              rawRules = data.methods;
            } else if (Array.isArray(data)) {
              rawRules = data;
            }

            const mapped = rawRules.map(m => ({
              method: m.method || m.http_method || '',
              enabled: m.enabled !== undefined ? m.enabled : (m.status === 'Active' || m.status === 'active'),
              action: m.action || m.http_method_action || 'Allow',
              logging: m.logging !== undefined ? m.logging : true,
              priority: m.priority || 1
            })).filter(m => m.method !== '');

            setMethods(mapped);
          }
        }
      } catch (error) {
        console.error('Data fetch error:', error);
        if (domains.length === 0) toast.error('Failed to fetch initial configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDomain, refreshTrigger, domains]);

  const handleDomainChange = (e) => {
    const domainName = e.target.value;
    const domainObj = domains.find(d => (d.waf_name || d.protected_domain) === domainName);
    setSelectedDomain(domainObj);
  };

  const handleAddRule = async () => {
    if (!newMethod.method) {
      toast.error('Please select a method');
      return;
    }
    if (!selectedDomain) {
      toast.error('Please select a domain first');
      return;
    }

    const isDuplicate = methods.some(
      (rule) => rule.method?.toUpperCase() === newMethod.method?.toUpperCase()
    );
    if (isDuplicate) {
      toast.error(`Rule for ${newMethod.method} already exists. Please update the existing rule instead.`);
      return;
    }

    const domainName = selectedDomain.waf_name || selectedDomain.protected_domain;

    const payload = {
      apiname: domainName,
      http_method: newMethod.method,
      action: newMethod.action,
      status: 'Active',
      priority: parseInt(newMethod.priority) || 1,
      logging: newMethod.logging,
    };

    try {
      const res = await addWAFHTTPRule(payload);
      if (res && res.status === 'success') {
        toast.success(res.msg || 'Rule added successfully');
        setRefreshTrigger(prev => prev + 1);
        setNewMethod({ method: 'GET', enabled: true, action: 'Allow', logging: true, priority: 1 });
      }
    } catch (error) {
      console.error('Add rule error:', error);
    }
  };

  const handleDeleteRule = async (index) => {
    const methodToDelete = methods[index].method;
    if (!selectedDomain) return;

    const domainName = selectedDomain.waf_name || selectedDomain.protected_domain;

    try {
      const res = await deleteHTTPMethodRule(domainName, methodToDelete);
      if (res && res.status === 'success') {
        toast.success(res.msg || 'Rule deleted successfully');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Delete rule error:', error);
    }
  };

  const [methods, setMethods] = useState([
    {
      method: 'GET',
      enabled: true,
      action: 'Allow',
      logging: true,
    },
    {
      method: 'POST',
      enabled: true,
      action: 'Allow',
      logging: true,
    },
    {
      method: 'PUT',
      enabled: false,
      action: 'Block',
      logging: true,
    },
    {
      method: 'PATCH',
      enabled: false,
      action: 'Block',
      logging: true,
    },
    {
      method: 'DELETE',
      enabled: false,
      action: 'Block',
      logging: true,
    },
  ]);

  const toggleMethod = (index) => {
    const updated = [...methods];
    updated[index].enabled = !updated[index].enabled;

    updated[index].action = updated[index].enabled ? 'Allow' : 'Block';

    setMethods(updated);
  };

  const updateAction = (index, value) => {
    const updated = [...methods];
    updated[index].action = value;
    setMethods(updated);
  };

  const toggleLogging = (index) => {
    const updated = [...methods];
    updated[index].logging = !updated[index].logging;
    setMethods(updated);
  };

  const updatePriority = (index, value) => {
    const updated = [...methods];
    updated[index].priority = parseInt(value) || 1;
    setMethods(updated);
  };

  const saveHTTPConfiguration = async () => {
    if (!selectedDomain) {
      toast.error('Please select a domain to save rules for.');
      return;
    }

    const domainName = selectedDomain.waf_name || selectedDomain.protected_domain;

    try {
      const result = await saveHTTPMethodRules(domainName, methods);
      if (result && result.status === 'success') {
        toast.success(`HTTP rules for ${domainName} saved successfully!`);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save HTTP rules.');
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
            <span className="pageTitle">
              Ethixion WAF | HTTP Method Control
            </span>

            <hr />

            {/* Domain Selection Showcase */}
            <div className="http-showcase-container">
              <div className="showcase-header">
                <div className="api-selector-group">
                  <label htmlFor="api-select">Protected API / Domain:</label>
                  <select
                    id="api-select"
                    className="api-select-dropdown"
                    value={selectedDomain ? (selectedDomain.waf_name || selectedDomain.protected_domain) : ''}
                    onChange={handleDomainChange}
                  >
                    {domains.length === 0 ? (
                      <option value="">No domains found</option>
                    ) : (
                      domains.map((d, i) => (
                        <option key={i} value={d.waf_name || d.protected_domain}>
                          {d.waf_name || d.protected_domain}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {selectedDomain && (
                  <div className="selected-api-details">
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-${selectedDomain.waf_api_status?.toLowerCase()}`}>
                        {selectedDomain.waf_api_status || 'Active'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Proxy:</span>
                      <span className="detail-value">{selectedDomain.proxy_domain || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr />

            {/* Header */}
            <div className="http-page-header">
              <p>
                Configure allowed and blocked HTTP request methods for your
                protected APIs and applications.
              </p>
            </div>


            {/* Add New Rule Form */}
            <div className="http-add-rule-card">
              <h2>Add New Method Rule</h2>
              <div className="add-rule-grid">
                <div className="form-group">
                  <label>HTTP Method</label>
                  <select
                    value={newMethod.method}
                    onChange={(e) => setNewMethod({ ...newMethod, method: e.target.value })}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Default Action</label>
                  <select
                    value={newMethod.action}
                    onChange={(e) => setNewMethod({ ...newMethod, action: e.target.value })}
                  >
                    <option value="Allow">Allow</option>
                    <option value="Block">Block</option>
                  </select>
                </div>
                <div className="form-group" style={{ maxWidth: '80px' }}>
                  <label>Priority</label>
                  <input
                    type="number"
                    min="1"
                    className="priority-form-input"
                    value={newMethod.priority}
                    onChange={(e) => setNewMethod({ ...newMethod, priority: e.target.value })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="custom-checkbox-container">
                    <input
                      type="checkbox"
                      checked={newMethod.logging}
                      onChange={(e) => setNewMethod({ ...newMethod, logging: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Enable Logging
                  </label>
                </div>
                <button className="add-method-btn" onClick={handleAddRule}>
                  <FiPlus /> Add Rule
                </button>
              </div>
            </div>

            {/* Method Table */}
            <div className="http-method-table-container">
              <div className="table-header">
                <h2>HTTP Methods</h2>

                <button
                  className="save-http-btn"
                  onClick={saveHTTPConfiguration}
                >
                  Save HTTP Rules
                </button>
              </div>

              <table className="http-method-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Priority</th>
                    <th>Logging</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        Loading rules...
                      </td>
                    </tr>
                  ) : methods.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        No rules defined for this domain.
                      </td>
                    </tr>
                  ) : (
                    methods.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`method-badge method-${item.method?.toLowerCase() || 'unknown'}`}>{item.method}</span>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={() => toggleMethod(index)}
                              />
                              <span className="slider"></span>
                            </label>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: '700',
                              color: item.enabled ? '#10b981' : '#94a3b8',
                              textTransform: 'uppercase'
                            }}>
                              {item.enabled ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <select
                            className={`action-select action-${item.action?.toLowerCase() || 'allow'}`}
                            value={item.action}
                            onChange={(e) => updateAction(index, e.target.value)}
                          >
                            <option value="Allow">Allow</option>
                            <option value="Block">Block</option>
                          </select>
                        </td>

                        <td>
                          <input
                            type="number"
                            min="1"
                            className="priority-input"
                            style={{ 
                              width: '60px', 
                              padding: '5px', 
                              borderRadius: '4px', 
                              border: '1px solid #cbd5e1',
                              textAlign: 'center'
                            }}
                            value={item.priority}
                            onChange={(e) => updatePriority(index, e.target.value)}
                          />
                        </td>

                        <td>
                          <label className="custom-checkbox-container" style={{ justifyContent: 'center' }}>
                            <input
                              type="checkbox"
                              checked={item.logging}
                              onChange={() => toggleLogging(index)}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </td>

                        <td>
                          <button
                            className="delete-rule-btn"
                            onClick={() => handleDeleteRule(index)}
                            title="Remove Rule"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </FadeUpOnScroll>
  );
}

export default HTTPMethodControl;
