import React, { useState, useEffect } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { getCurrentWAFUser, fetchAPIKeysData, retrieveWAFAPIKeyByAuthentication } from '../../api';
import { toast } from 'sonner';
import { FiCopy, FiEye, FiShield, FiX } from 'react-icons/fi';
import '../../App.css';

export const parseWAFApiKeyResponse = (response) => {
  const payload = Array.isArray(response?.data) ? response.data : [];
  const parsedRecords = [];

  payload.forEach((entry) => {
    if (Array.isArray(entry)) {
      const [apiId, apiKey] = entry;
      if (apiId != null && apiKey) {
        parsedRecords.push({ api_id: apiId, api_key: apiKey });
      }
      return;
    }

    if (entry && typeof entry === 'object') {
      const apiId = entry.waf_api_id ?? entry.api_id ?? entry.id ?? entry[0] ?? null;
      const apiKey = entry.api_key ?? entry.key ?? entry[1] ?? null;

      if (apiId != null && apiKey) {
        parsedRecords.push({ api_id: apiId, api_key: apiKey });
      }
    }
  });

  return parsedRecords;
};

function APIKeysManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({ email: '', password: '', api_id: '' });
  
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
        permissions: 'Read Only',
        status: true,
      },
    ]);
  };

  const saveAPIKeys = () => {
    console.log(apiKeys);

    alert('API Keys Saved!');
  };

  const handleCopyKey = async (value) => {
    if (!value) {
      toast.error('No API key available to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success('API key copied to clipboard.');
    } catch (error) {
      toast.error('Unable to copy API key.');
    }
  };

  const handleRevealRequest = (api_id, username) => {
    const nextEmail = username || '';
    const nextApiId = api_id != null ? String(api_id) : '';

    setIsRevealModalOpen(true);
    setModalForm({
      email: nextEmail,
      password: '',
      api_id: nextApiId,
    });
  };

  const closeRevealModal = () => {
    setIsRevealModalOpen(false);
    setModalForm({ email: '', password: '', api_id: '' });
  };

  const handleModalInputChange = (event) => {
    const { name, value } = event.target;
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    const submittedEmail = (modalForm?.email || '').trim();
    const submittedPassword = (modalForm?.password || '').trim();
    const submittedApiId = modalForm?.api_id ?? '';

    if (!submittedEmail || !submittedPassword) {
      toast.error('Please enter your email and password to continue.');
      return;
    }

    if (submittedApiId === '' || submittedApiId == null) {
      toast.error('Unable to identify the API key. Please try again.');
      return;
    }

    const payload = {
      username: submittedEmail,
      pwd: submittedPassword,
      api_id: Number(submittedApiId),
    };

    try {
      const resp = await retrieveWAFAPIKeyByAuthentication(payload);
      const parsedRecords = parseWAFApiKeyResponse(resp);

      if (parsedRecords.length > 0) {
        const revealedKey = parsedRecords[0].api_key;

        setApiKeys((prev) =>
          prev.map((item) => {
            if (String(item.waf_api_id) === String(submittedApiId)) {
              return { ...item, api_key: revealedKey };
            }
            return item;
          })
        );
        toast.success('API key revealed successfully.');

      } else {
        toast.error('The API key could not be retrieved from the server response.');
      }
    } catch (error) {
      console.error('Error revealing API key:', error);
      toast.error('Unable to reveal API key right now.');
    } finally {
      closeRevealModal();
    }
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
      <main className={`dashboard ${isRevealModalOpen ? 'page-blurred' : ''}`}>
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
                          disabled
                        />
                      </td>

                      <td>
                        <div className="apikey-field">
                          <input
                            type="text"
                            value={item.api_key || ''}
                            onChange={(e) =>
                              updateField(index, 'api_key', e.target.value)
                            }
                            className="apikey-input"
                            disabled
                          />

                          <button
                            type="button"
                            className="apikey-icon-btn"
                            onClick={() => handleCopyKey(item.api_key)}
                            title="Copy API key"
                          >
                            <FiCopy size={16} />
                          </button>

                          <button
                            type="button"
                            className="apikey-icon-btn"
                            onClick={() => handleRevealRequest(item.waf_api_id, userData.email)}
                            title="Reveal secure access"
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
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

        {isRevealModalOpen && (
          <div className="apikey-modal-overlay" onClick={closeRevealModal}>
            <div
              className="apikey-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reveal-modal-title"
            >
              <button
                type="button"
                className="apikey-modal-close"
                onClick={closeRevealModal}
                title="Close"
              >
                <FiX size={18} />
              </button>

              <div className="apikey-modal-header">
                <div className="apikey-modal-icon">
                  <FiShield size={18} />
                </div>
                <div>
                  <h3 id="reveal-modal-title">Ethixion WAF Secure Access</h3>
                  <p>Enter your credentials to confirm access to the API key.</p>
                </div>
              </div>

              <form className="apikey-modal-form" onSubmit={handleModalSubmit}>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={modalForm.email}
                    onChange={handleModalInputChange}
                    placeholder="you@example.com"
                    disabled
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={modalForm.password}
                    onChange={handleModalInputChange}
                    placeholder="Enter your password"
                  />
                </label>

                <input type="hidden" name="api_id" value={modalForm.api_id} />

                <div className="apikey-modal-actions">
                  <button
                    type="button"
                    className="apikey-modal-cancel"
                    onClick={closeRevealModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="apikey-modal-submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </FadeUpOnScroll>
  );
}

export default APIKeysManagement;
