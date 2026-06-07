import React, { useEffect, useState } from 'react';
import WAFDashboardNavbar from './WAFDashboardNavbar';
import FadeUpOnScroll from '../FadeUpOnScroll';
import {
  getCurrentWAFUser,
  getWAFAPIRateLimitingRules,
  setRateLimitingRules,
} from '../../api';
import { toast } from 'sonner';
import '../../App.css';

function RateLimiting() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUser] = useState(null);
  const [error, setError] = useState('');
  const [perRowSaving, setPerRowSaving] = useState([]);
  const [perRowMessage, setPerRowMessage] = useState([]);

  const [rateLimits, setRateLimits] = useState([]);

  useEffect(() => {
    const fetchRateLimits = async () => {
      try {
        const [userdata, wafAPIData] = await Promise.all([
          getCurrentWAFUser(),
          getWAFAPIRateLimitingRules(),
        ]);

        setUser(userdata);
        if (wafAPIData) {
          const mapped = wafAPIData.map((item) => ({
            apiname: item.waf_name,
            limit: item.rate_limit,
            duration: item.sec,
            enabled: item.waf_api_status === 'Active',
          }));
          setRateLimits(mapped);
          setPerRowSaving(new Array(mapped.length).fill(false));
          setPerRowMessage(new Array(mapped.length).fill(''));
        } else {
          setError('No rate limiting data available.');
        }
      } catch (error) {
        setError('Failed to fetch rate limiting data. Please try again later.');
        console.error('Error fetching rate limits data:', error);
      }
    };

    fetchRateLimits();
  }, []);

  const updateField = (index, field, value) => {
    const updated = [...rateLimits];
    if (field === 'limit' || field === 'duration') {
      const num = Number(value);
      if (field === 'limit' && num > 99) {
        toast.error('Free plan limit is 99 requests/minute.');
        updated[index][field] = 99;
      } else {
        updated[index][field] = num;
      }
    } else {
      updated[index][field] = value;
    }
    setRateLimits(updated);
  };

  const showFreePlanToast = () => {
    toast.error(
      'Free plan limit does not allow rate limitting for Req/Seconds.'
    );
  };

  const toggleRule = (index) => {
    const updated = [...rateLimits];
    updated[index].enabled = !updated[index].enabled;

    setRateLimits(updated);
  };

  const saveSingleRule = async (index) => {
    // Save only one rule
    setError('');
    const savingArr = [...perRowSaving];
    savingArr[index] = true;
    setPerRowSaving(savingArr);

    try {
      const r = rateLimits[index];
      const payload = {
        rate_limit_data: [
          {
            waf_name: r.apiname,
            rate_limit: Number(r.limit) || 0,
            sec: Number(r.duration) || 0,
            waf_api_status: r.enabled ? 'Active' : 'Inactive',
          },
        ],
      };

      const resp = await setRateLimitingRules(payload);
      const msgArr = [...perRowMessage];
      if (resp && resp.status === 'success') {
        toast.success(
          `Rate Limit Rule for \`${rateLimits[index].apiname}\` WAF API saved successfully.`
        );
        setPerRowMessage(msgArr);
      }
    } catch (err) {
      console.error('Error saving single rate limit:', err);
      const msgArr = [...perRowMessage];
      msgArr[index] = 'Save error';
      setPerRowMessage(msgArr);
    } finally {
      const savingArr2 = [...perRowSaving];
      savingArr2[index] = false;
      setPerRowSaving(savingArr2);
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
            userData={userData}
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

            {/* TABLE */}

            <div className="rate-limit-table-container">
              {rateLimits.length === 0 ? (
                <p>{error}</p>
              ) : (
                <table className="rate-limit-table">
                  <thead>
                    <tr>
                      <th>WAF API Name</th>
                      <th>Requests</th>
                      <th>Duration (sec)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rateLimits.map((rule, index) => (
                      <tr key={index}>
                        {/* WAF API Name */}

                        <td>
                          <input
                            type="text"
                            value={rule.apiname}
                            disabled
                            className="table-input"
                          />
                        </td>

                        {/* LIMIT */}

                        <td>
                          <input
                            type="number"
                            value={rule.limit}
                            max={99}
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
                            readOnly
                            onFocus={showFreePlanToast}
                            onClick={showFreePlanToast}
                            className="table-input small"
                          />
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
                        <td>
                          <button
                            className="save-row-btn"
                            onClick={() => saveSingleRule(index)}
                            disabled={perRowSaving[index]}
                          >
                            {perRowSaving[index] ? 'Saving...' : 'Save'}
                          </button>
                          {perRowMessage[index] && (
                            <div className="row-message">
                              {perRowMessage[index]}
                            </div>
                          )}
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

export default RateLimiting;
