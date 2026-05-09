import React, { useState } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from './FadeUpOnScroll';
import '../App.css';

function HTTPMethodControl() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    blockUnknown: true,
    enableLogging: true,
    strictValidation: true,
    malformedRequests: true,
  });

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

  const saveHTTPConfiguration = () => {
    const payload = {
      globalSettings,
      methods,
    };

    console.log(payload);

    alert('HTTP Method Configuration Saved!');
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
              Ethixion WAF | HTTP Method Control
            </span>

            <hr />

            {/* Header */}
            <div className="http-page-header">
              <p>
                Configure allowed and blocked HTTP request methods for your
                protected APIs and applications.
              </p>
            </div>

            {/* Global Settings */}
            <div className="http-settings-card">
              <h2>Global Settings</h2>

              <div className="settings-grid">
                <label>
                  <input
                    type="checkbox"
                    checked={globalSettings.blockUnknown}
                    onChange={() =>
                      setGlobalSettings({
                        ...globalSettings,
                        blockUnknown: !globalSettings.blockUnknown,
                      })
                    }
                  />
                  Block Unknown Methods
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={globalSettings.enableLogging}
                    onChange={() =>
                      setGlobalSettings({
                        ...globalSettings,
                        enableLogging: !globalSettings.enableLogging,
                      })
                    }
                  />
                  Enable Logging
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={globalSettings.strictValidation}
                    onChange={() =>
                      setGlobalSettings({
                        ...globalSettings,
                        strictValidation: !globalSettings.strictValidation,
                      })
                    }
                  />
                  Strict RFC Validation
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={globalSettings.malformedRequests}
                    onChange={() =>
                      setGlobalSettings({
                        ...globalSettings,
                        malformedRequests: !globalSettings.malformedRequests,
                      })
                    }
                  />
                  Auto Deny Malformed Requests
                </label>
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
                    <th>Logging</th>
                  </tr>
                </thead>

                <tbody>
                  {methods.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="method-name">{item.method}</span>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() => toggleMethod(index)}
                          />

                          <span className="slider"></span>
                        </label>
                      </td>

                      <td>
                        <select
                          value={item.action}
                          onChange={(e) => updateAction(index, e.target.value)}
                        >
                          <option>Allow</option>
                          <option>Block</option>
                          <option>Challenge</option>
                          <option>Rate Limit</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          checked={item.logging}
                          onChange={() => toggleLogging(index)}
                        />
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

export default HTTPMethodControl;
