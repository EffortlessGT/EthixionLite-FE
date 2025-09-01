import React, { useEffect, useState } from 'react';
import user_img from '../assets/img/user_img.png';
import { Link } from 'react-router-dom';
import { getAPIData, getCurrentUser, APIDisableResp, APIEnableResp, APIDeleteResp, APIRegenerateResp, APIAlertsDataResp } from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { FiMenu, FiX } from 'react-icons/fi';
import PopupNotificationWrapper from './PopUpNotificationWrapper';
import EthixionAlert from './EthixionAlert';
import HeaderAuthSnippets from './HeaderAuthSnippets';

function APISettings() {
    const [userData, setUserData] = useState(null);
    const [activeApiTab, setActiveApiTab] = useState('Overview');
    const [apiData, setApiData] = useState(null);
    const [showRegenerated, setShowRegenerated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [key, setKey] = useState('');
    const [regStatus, setRegStatus] = useState(false);
    const [myapiname, setMyAPIName] = useState('');
    const [apiAlertData, setAPIAlertData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await getCurrentUser();
                setUserData(result);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        const fetchApiData = async () => {
            try {
                const data = await getAPIData();
                if (data && data.apidata) {
                    setApiData(data.apidata);
                } else {
                    console.log("No API data.");
                }
            } catch (err) {
                console.error("Error fetching API data:", err);
            }
        };

        const fetchApiAlertsData = async () => {
            try {
                const data = await APIAlertsDataResp();
                if (data && data.api_alerts_data) {
                    setAPIAlertData(data);
                } else {
                    console.log("No API data.");
                }
            } catch (err) {
                console.error("Error fetching API data:", err);
            }
        };


        fetchUser();
        fetchApiData();
        fetchApiAlertsData();
    }, []);

    const disableAPI = async (apiname) => {
        try {
            const resp = await APIDisableResp(apiname);
            if (resp) {
                alert("API Service Disable request processed successfully.");
                window.location.reload();
            }
        } catch (Err) {
            <EthixionAlert msg={"Something went wrong with server please try again later"} />
        }
    };

    const enableAPI = async (apiname) => {
        try {
            const resp = await APIEnableResp(apiname);
            if (resp) {
                alert("API Service Enabled request processed successfully.");
                window.location.reload();
            }
        } catch (Err) {
            <EthixionAlert msg={"Something went wrong with server please try again later"} />
        }
    };

    const deleteAPI = async (apiname) => {
        try {
            const resp = await APIDeleteResp(apiname);
            if (resp) {
                alert("API Service deleted successfully.");
                window.location.reload();
            }
        } catch (Err) {
            <EthixionAlert msg={"Something went wrong with server please try again later"} />
        }
    };

    const regenerateAPI = async (apiname) => {
        try {
            const resp = await APIRegenerateResp(apiname);
            if (resp.status === "success") {
                setRegStatus(true);
                setMyAPIName(resp.apiname);
                setKey(resp.apikey);
            }
        } catch (Err) {
            setRegStatus(false);
            <EthixionAlert msg={"Something went wrong with server please try again later"} />
        }
    };

    return (
        <FadeUpOnScroll>
            <main className='dashboard'>
                <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
                </div>

                <div className={`dashboard-container ${menuOpen ? 'sidebar-open' : ''}`}>
                    <div className={`dash-sidebar ${menuOpen ? 'show' : ''}`}>
                        <div className='sidebar-userprofile'>
                            <img src={user_img} alt='User' />
                            <p>{userData ? userData.fullname : "Please Wait..."}</p>
                        </div>
                        <div className='sidebar-navigations' onClick={() => setMenuOpen(false)}>
                            <Link to="/firewall_rules"><h3>Firewall Rules</h3></Link>
                            <Link to="/threat_alerts"><h3>Threat Alerts</h3></Link>
                            <Link to="/traffic_insights"><h3>Traffic Monitor</h3></Link>
                            <Link to="/reportlogs"><h3>Report & Logs</h3></Link>
                            <Link to="/api"><h3>API</h3></Link>
                            <Link to="/api_settings"><h3>Settings</h3></Link>
                            <Link to="/"><h3>Home</h3></Link>
                        </div>
                    </div>

                    {showRegenerated ? (
                        <PopupNotificationWrapper>
                            <div className='regeratedAPIDIV'>
                                {regStatus ? (
                                    <>
                                        <h2>Regenerated API Key</h2>
                                        <strong>New API key Generated for {myapiname}.</strong><br />
                                        <strong>Your API Key: {key}</strong>
                                        <p>
                                            Your new Ethixion API key has been created. Keep it private and never share it publicly.
                                            Use it only in authorized applications.
                                        </p>
                                        <button onClick={() => setShowRegenerated(false)}>I Understand</button>
                                    </>
                                ) : (
                                    <>
                                        <h2>API Key Regeneration Failed.</h2>
                                        <p>
                                            The Ethixion server encountered an error while processing your request to regenerate the API key for <b>{myapiname}</b>.
                                            Please try again later or contact support if the issue persists.
                                        </p>
                                        <button onClick={() => setShowRegenerated(false)}>I Understand</button>
                                    </>
                                )}
                            </div>
                        </PopupNotificationWrapper>
                    ) : (
                        <div className="dash-dataContainer" id="dash-dataContainer">
                            <h1>🔧 API Settings</h1>
                            <div className="api-settings-nav">
                                {[
                                    'Overview',
                                    'API Keys',
                                    'Integration',
                                    'Alerts & Logs',
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-btn ${activeApiTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveApiTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="api-settings-content">
                                {activeApiTab === 'Overview' && (
                                    <div>
                                        <h2>🧩 API Overview</h2>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>API Name</th>
                                                    <th>Endpoint</th>
                                                    <th>Working Status</th>
                                                    <th>Created</th>
                                                    <th>Last Used</th>
                                                    <th>Total Requests</th>
                                                    <th>Threats Blocked</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apiData && apiData.apis && apiData.apis.length > 0 ? (
                                                    apiData.apis.map((api, idx) => (
                                                        <tr key={idx}>
                                                            <td>{api.apiname}</td>
                                                            <td>{api.endpoint}</td>
                                                            <td>{api.total_req > 0 ? "Actively Working" : "Currently No Request"}</td>
                                                            <td>{api.createdon ? new Date(api.createdon).toLocaleString() : "unknown"}</td>
                                                            <td>{api.last_used ? new Date(api.last_used).toLocaleString() : "never"}</td>
                                                            <td>{api.total_req}</td>
                                                            <td>{api.threats_blocked && api.threats_blocked.length > 0 ? api.threats_blocked.join(", ") : "None"}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7">No API data available. Please try again later.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeApiTab === 'API Keys' && (
                                    <div>
                                        <h2>🔑 API Key Management</h2>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>API Name</th>
                                                    <th>Creation Date</th>
                                                    <th>Status</th>
                                                    <th colSpan="2">Action</th>
                                                    <th>Regenerate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apiData && apiData.apis && apiData.apis.length > 0 ? (
                                                    apiData.apis.map((api, idx) => (
                                                        <tr key={idx}>
                                                            <td>{api.apiname}</td>
                                                            <td>{api.createdon ? new Date(api.createdon).toLocaleString() : "unknown"}</td>
                                                            <td>{api.active_status ? "Active" : "Inactive"}</td>
                                                            <td>
                                                                {api.active_status ? (
                                                                    <form method='POST' onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        disableAPI(api.apiname);
                                                                    }}>
                                                                        <button type='submit'>Disable</button>
                                                                    </form>
                                                                ) : (
                                                                    <form method='POST' onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        enableAPI(api.apiname);
                                                                    }}>
                                                                        <button type='submit'>Enable</button>
                                                                    </form>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <form method='POST' onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    deleteAPI(api.apiname);
                                                                }}>
                                                                    <button type='submit'>Delete</button>
                                                                </form>
                                                            </td>
                                                            <td>
                                                                <form method='POST' onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    regenerateAPI(api.apiname);
                                                                    setShowRegenerated(true);
                                                                }}>
                                                                    <button type='submit'>Regenerate Key</button>
                                                                </form>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6">No API data available. Please try again later.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeApiTab === 'Integration' && (
                                    <div>
                                        <HeaderAuthSnippets />
                                    </div>
                                )}
                                {activeApiTab === 'Alerts & Logs' && (
                                    <div>
                                        <h2>📊 Alerts & Logs</h2>
                                        <p>View API activity logs, monitor blocked threats, and analyze traffic insights.</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Alert ID</th>
                                                    <th>Email</th>
                                                    <th>API Name</th>
                                                    <th>Request ID</th>
                                                    <th>Alert Type</th>
                                                    <th>Severity</th>
                                                    <th>Message</th>
                                                    <th>Status</th>
                                                    <th>DateTime</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apiAlertData?.api_alerts_data?.length > 0 ? (
                                                    apiAlertData.api_alerts_data.map((api, idx) => (
                                                        <tr key={idx}>
                                                            <td>{api.alert_id}</td>
                                                            <td>{api.user_email}</td>
                                                            <td>{api.apiname}</td>
                                                            <td>{api.request_id}</td>
                                                            <td>{api.alert_type.join(", ")}</td>
                                                            <td>{api.severity.join(", ")}</td>
                                                            <td>{api.message.join(" | ")}</td>
                                                            <td>{api.status ?? "unknown"}</td>
                                                            <td>{api.created_at ? new Date(api.created_at).toLocaleString() : "unknown"}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9">No alerts available</td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </FadeUpOnScroll>
    );
}

export default APISettings;
