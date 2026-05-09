import React, { useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';

function APIKeysManagement() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [apiKeys, setApiKeys] = useState([
    {
      name: 'Production Key',
      key: 'ethx_live_x82jd92jd2',
      permissions: 'Full Access',
      status: true,
    },
    {
      name: 'Frontend Client',
      key: 'ethx_pub_92jd82jd92',
      permissions: 'Read Only',
      status: true,
    },
    {
      name: 'Testing Key',
      key: 'ethx_test_22jd92jd91',
      permissions: 'Limited',
      status: false,
    },
  ]);

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
                    <th>Key Name</th>
                    <th>API Key</th>
                    <th>Permissions</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {apiKeys.map((item, index) => (
                    <tr key={index}>
                      {/* NAME */}

                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateField(index, 'name', e.target.value)
                          }
                          className="apikey-input"
                        />
                      </td>

                      {/* API KEY */}

                      <td>
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) =>
                            updateField(index, 'key', e.target.value)
                          }
                          className="apikey-input"
                        />
                      </td>

                      {/* PERMISSIONS */}

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

                      {/* STATUS */}

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
