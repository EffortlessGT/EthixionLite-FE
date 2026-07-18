import React, { useState, useEffect } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import {
  getCurrentWAFUser,
  fetchAPIKeysData,
  retrieveWAFAPIKeyByAuthentication,
  set_api_key_config,
} from '../../api';
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
      const apiId =
        entry.waf_api_id ?? entry.api_id ?? entry.id ?? entry[0] ?? null;
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
  const [updatedAPIData, setUpdatedAPIData] = useState([]);
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    email: '',
    password: '',
    api_id: '',
  });
  const [isDataModified, setIsDataModified] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);

  const toggleStatus = (index) => {
    if (index !== selectedRecordIndex) return;

    const updated = [...updatedAPIData];
    updated[index].status =
      updated[index].status === 'Active' ? 'Inactive' : 'Active';

    setUpdatedAPIData(updated);
    setIsDataModified(true);
  };

  const updateField = (index, field, value) => {
    if (index !== selectedRecordIndex) return;

    const updated = [...updatedAPIData];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setUpdatedAPIData(updated);
    setIsDataModified(true);
  };

  const saveAPIKeys = async () => {
    const selectedRecord = updatedAPIData[selectedRecordIndex];

    if (!selectedRecord) {
      toast.error('No record selected.');
      return;
    }

    if (!selectedRecord.permissions) {
      toast.error('Please select a permission for this API key.');
      return;
    }
    const recordToSave = {
      ...selectedRecord,
      waf_api_status: selectedRecord.status,
    };

    try {
      const response = await set_api_key_config(recordToSave);
      if (response && response.status === 'success') {
        toast.success('API Key Updated Successfully!');
        setIsDataModified(false);
      } else {
        toast.error(response?.msg || 'Failed to update API key configuration.');
      }
    } catch (error) {
      console.error('Error saving API key configuration:', error);
      toast.error('Unable to save API key configuration.');
    }
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

        setUpdatedAPIData((prev) =>
          prev.map((item) => {
            if (String(item.waf_api_id) === String(submittedApiId)) {
              return { ...item, api_key: revealedKey };
            }
            return item;
          })
        );
        toast.success('API key revealed successfully.');
      } else {
        toast.error(
          'The API key could not be retrieved from the server response.'
        );
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
        setUpdatedAPIData(apiKeysData);
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
              <button
                className="save-key-btn"
                onClick={saveAPIKeys}
                disabled={!isDataModified}
              >
                Save Changes
              </button>
            </div>

            {/* TABLE */}

            <div className="apikey-table-container">
              <table className="apikey-table">
                <thead>
                  <tr>
                    <th>Select</th>
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
                  {updatedAPIData.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        selectedRecordIndex === index ? 'selected-row' : ''
                      }
                    >
                      <td>
                        <label className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            name="api-record-selection"
                            checked={selectedRecordIndex === index}
                            onChange={() => setSelectedRecordIndex(index)}
                            title="Select this API record to edit"
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>

                      <td>
                        <input
                          type="text"
                          value={item.waf_name}
                          onChange={(e) =>
                            updateField(index, 'waf_name', e.target.value)
                          }
                          className="apikey-input"
                          disabled={selectedRecordIndex !== index}
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
                            disabled={selectedRecordIndex !== index}
                          />

                          <button
                            type="button"
                            className="apikey-icon-btn"
                            onClick={() => handleCopyKey(item.api_key)}
                            title="Copy API key"
                            disabled={selectedRecordIndex !== index}
                          >
                            <FiCopy size={16} />
                          </button>

                          <button
                            type="button"
                            className="apikey-icon-btn"
                            onClick={() =>
                              handleRevealRequest(
                                item.waf_api_id,
                                userData.email
                              )
                            }
                            title="Reveal secure access"
                            disabled={selectedRecordIndex !== index}
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <select
                          value={item.permissions}
                          onChange={(e) => {
                            updateField(index, 'permissions', e.target.value);
                          }}
                          disabled={selectedRecordIndex !== index}
                        >
                          <option value="">Select Permission</option>
                          <option value="monitor_only">Monitor Only</option>

                          <option value="block">Block</option>
                        </select>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.status === 'Active'}
                            onChange={() => toggleStatus(index)}
                            disabled={selectedRecordIndex !== index}
                          />

                          <span className="slider"></span>
                        </label>
                      </td>

                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td>
                        {item.last_used_at
                          ? new Date(item.last_used_at).toLocaleDateString()
                          : 'Not Used Yet!'}
                      </td>

                      <td>
                        {item.last_rotated_at
                          ? new Date(item.last_rotated_at).toLocaleDateString()
                          : 'Not Rotated Yet!'}
                      </td>
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
                  <p>
                    Enter your credentials to confirm access to the API key.
                  </p>
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
