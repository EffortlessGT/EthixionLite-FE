import React, { useState, useEffect } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { getCurrentWAFUser, fetchAPIKeysData } from '../../api';
import '../../App.css';

function APIKeysManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  
  const toggleStatus = (index) => {
    const updated = [...apiKeys];
    updated[index].status = !updated[index].status;

    setApiKeys(updated);
  };

  const updateField = (index, field, value) => {
    const updated = [...apiKeys];
    updated[index][field] = value;

    setApiKeys(updated);
  };

  const addAPIKey = () => {
    setApiKeys([
      ...apiKeys,
      {
        name: '',
        key: '',
        permissions: 'Read Only',
        status: true,
      },
    ]);
  };

  const saveAPIKeys = () => {
    console.log(apiKeys);

    alert('API Keys Saved!');
  };

  useEffect(() => {
    const fetchAPIData = async () => {
      try {
        const [userData, apiKeysData] = await Promise.all([
          getCurrentWAFUser(),
          fetchAPIKeysData(),
        ]);
        setUser(userData);
        setApiKeys(apiKeysData);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    };

    fetchAPIData();
  }, []);
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
            userData={userData}
          />

          <div className="dash-dataContainer">
            <span className="pageTitle">
              Ethixion WAF | API Keys Management
            </span>

            <hr />

            {/* HEADER */}

            <div className="apikey-header">
              <p>
                Manage API authentication keys, permissions, and access policies
                for your protected services.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="apikey-actions">
              <button className="add-key-btn" onClick={addAPIKey}>
                Generate API Key
              </button>

              <button className="save-key-btn" onClick={saveAPIKeys}>
                Save Changes
              </button>
            </div>

            {/* TABLE */}

            <div className="apikey-table-container">
              <table className="apikey-table">
                <thead>
                  <tr>
                    <th>Key Owner</th>
                    <th>API Key</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Last Rotated</th>
                    
                  </tr>
                </thead>

                <tbody>
                  {apiKeys.map((item, index) => (
                    <tr key={index}>

                      <td>
                        <input
                          type="text"
                          value={item.waf_name}
                          onChange={(e) =>
                            updateField(index, 'waf_name', e.target.value)
                          }
                          className="apikey-input"
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          value={item.api_key}
                          onChange={(e) =>
                            updateField(index, 'key', e.target.value)
                          }
                          className="apikey-input"
                        />
                      </td>

                      <td>
                        <select
                          value={item.permissions}
                          onChange={(e) =>
                            updateField(index, 'permissions', e.target.value)
                          }
                        >
                          <option>Full Access</option>

                          <option>Read Only</option>

                          <option>Limited</option>
                        </select>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.status}
                            onChange={() => toggleStatus(index)}
                          />

                          <span className="slider"></span>
                        </label>
                      </td>

                      <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>

                      <td>{item.last_used_at ? new Date(item.last_used_at).toLocaleDateString() : 'Not Used Yet!'}</td>

                      <td>{item.last_rotated_at ? new Date(item.last_rotated_at).toLocaleDateString() : 'Not Rotated Yet!'}</td>
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

export default APIKeysManagement;
