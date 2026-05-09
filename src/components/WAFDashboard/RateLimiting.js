// RateLimiting.jsx

import React, { useState } from 'react';
import WAFDashboardNavbar from '../WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import '../../App.css';

function RateLimiting() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [rateLimits, setRateLimits] = useState([
    {
      endpoint: '/api/auth/login',
      limit: 10,
      duration: 60,
      action: 'Block',
      enabled: true,
    },
    {
      endpoint: '/api/payment',
      limit: 25,
      duration: 60,
      action: 'Challenge',
      enabled: true,
    },
    {
      endpoint: '/api/public',
      limit: 100,
      duration: 60,
      action: 'Allow',
      enabled: false,
    },
  ]);

  const updateField = (index, field, value) => {
    const updated = [...rateLimits];
    updated[index][field] = value;
    setRateLimits(updated);
  };

  const toggleRule = (index) => {
    const updated = [...rateLimits];
    updated[index].enabled = !updated[index].enabled;

    setRateLimits(updated);
  };

  const addRateLimitRule = () => {
    setRateLimits([
      ...rateLimits,
      {
        endpoint: '',
        limit: 50,
        duration: 60,
        action: 'Block',
        enabled: true,
      },
    ]);
  };

  const saveRateLimits = () => {
    console.log(rateLimits);

    alert('Rate Limiting Rules Saved!');
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
            <span className="pageTitle">Ethixion WAF | Rate Limiting</span>

            <hr />

            {/* HEADER */}

            <div className="rate-limit-header">
              <p>
                Configure request throttling and abuse prevention policies for
                your protected APIs and applications.
              </p>
            </div>

            {/* ACTION BAR */}

            <div className="rate-limit-actions">
              <button className="add-rule-btn" onClick={addRateLimitRule}>
                Add New Rule
              </button>

              <button className="save-rule-btn" onClick={saveRateLimits}>
                Save Rules
              </button>
            </div>

            {/* TABLE */}

            <div className="rate-limit-table-container">
              <table className="rate-limit-table">
                <thead>
                  <tr>
                    <th>Endpoint</th>
                    <th>Requests</th>
                    <th>Duration (sec)</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rateLimits.map((rule, index) => (
                    <tr key={index}>
                      {/* ENDPOINT */}

                      <td>
                        <input
                          type="text"
                          value={rule.endpoint}
                          onChange={(e) =>
                            updateField(index, 'endpoint', e.target.value)
                          }
                          className="table-input"
                        />
                      </td>

                      {/* LIMIT */}

                      <td>
                        <input
                          type="number"
                          value={rule.limit}
                          onChange={(e) =>
                            updateField(index, 'limit', e.target.value)
                          }
                          className="table-input small"
                        />
                      </td>

                      {/* DURATION */}

                      <td>
                        <input
                          type="number"
                          value={rule.duration}
                          onChange={(e) =>
                            updateField(index, 'duration', e.target.value)
                          }
                          className="table-input small"
                        />
                      </td>

                      {/* ACTION */}

                      <td>
                        <select
                          value={rule.action}
                          onChange={(e) =>
                            updateField(index, 'action', e.target.value)
                          }
                        >
                          <option>Allow</option>
                          <option>Block</option>
                          <option>Challenge</option>
                          <option>Rate Limit</option>
                        </select>
                      </td>

                      {/* STATUS */}

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={() => toggleRule(index)}
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

export default RateLimiting;
