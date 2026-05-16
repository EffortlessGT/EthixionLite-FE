import React, { useState } from 'react';
import waf_img from '../../assets/img/api_img.png';
import Footer from '../Footer';
import FadeUpOnScroll from '../FadeUpOnScroll';
import { wafapiForm } from '../../api';
import { toast } from 'react-toastify';

function WAFAPIPage() {
  const [wafName, setWafName] = useState('');
  const [wafDesc, setWafDesc] = useState('');
  const [protectedDomain, setProtectedDomain] = useState('');
  const [proxyDomain, setProxyDomain] = useState('');
  const [inspectionMode, setInspectionMode] = useState('');
  const [threatRules, setThreatRules] = useState([]);
  const [rateLimit, setRateLimit] = useState('');
  const [alertMethod, setAlertMethod] = useState('');
  const [logging, setLogging] = useState('');
  const [geoBlock, setGeoBlock] = useState('');
  const [httpallowedmethods, setHttpAllowedMethods] = useState([]);

  const handleThreatChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) setThreatRules([...threatRules, value]);
    else setThreatRules(threatRules.filter((v) => v !== value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      waf_name: wafName,
      description: wafDesc,
      protected_domain: protectedDomain,
      inspection_mode: inspectionMode,
      threat_rules: threatRules.join(','),
      rate_limit: rateLimit,
      alert_method: alertMethod,
      logging: logging,
      geo_block: geoBlock,
      proxy_domain: proxyDomain,
      http_allowed_methods: httpallowedmethods,
    };

    const urlPattern = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
    if (!urlPattern.test(protectedDomain)) {
      toast.error('Please enter a valid protected domain or endpoint.');
      return;
    }
    if (!urlPattern.test(proxyDomain)) {
      toast.error('Please enter a valid proxy domain or endpoint.');
      return;
    }

    try {
      const result = await wafapiForm(data);
      console.log(result);
    } catch (error) {
      console.error('Error ->', error);
      toast.error(
        'Failure Occurred: ' + (error.message || 'Unknown network/server error')
      );
    }
  };

  return (
    <FadeUpOnScroll delay={0.3}>
      <main>
        <div className="waf-intro">
          <div className="imgcontainer">
            <img src={waf_img} alt="WAF" />
          </div>
          <div className="desccontainer">
            <h2>What is the Ethixion WAF?</h2>
            <p>
              The Ethixion Web Application Firewall (WAF) acts as a smart
              security gateway between your users and your application servers.
              Every HTTP request first passes through this intelligent
              protection layer, where it is deeply inspected for anomalies,
              threats, and malicious intent. Using advanced pattern recognition
              and behavioral analysis, Ethixion WAF can detect and block attacks
              such as SQL Injection, Cross-Site Scripting (XSS), Remote Code
              Execution (RCE), CSRF, file upload exploits, and even large-scale
              DDoS floods before they ever touch your infrastructure. Beyond
              just blocking, Ethixion continuously monitors traffic in real
              time, learns from request patterns, and adapts dynamically to new
              attack techniques.
            </p>
            <span>🧠 Why Use Ethixion WAF?</span>
            <ul>
              <li>🛡️ Blocks OWASP Top 10 attacks</li>
              <li>📈 Monitors traffic patterns in real-time</li>
              <li>🚀 Zero code changes to your backend</li>
              <li>🔔 Alerts you instantly when threats are detected</li>
            </ul>
          </div>
        </div>

        <FadeUpOnScroll>
          <div className="waf-steps">
            <h1>Steps to Deploy Your WAF API</h1>
            <div className="steps-container">
              <div className="box">
                <span>Step 1</span>
                <h3>Setup</h3>
                <p>Enter WAF name, description, and your domain.</p>
              </div>
              <div className="box">
                <span>Step 2</span>
                <h3>Configure Rules</h3>
                <p>Select your inspection mode, rules, and rate limits.</p>
              </div>
              <div className="box">
                <span>Step 3</span>
                <h3>Generate Keys</h3>
                <p>Deploy your secure firewall API and get credentials.</p>
              </div>
            </div>
          </div>
        </FadeUpOnScroll>
        <FadeUpOnScroll>
          <h1 id="heading">Configure Your WAF API</h1>
          <div className="WAF">
            <div className="waf-form">
              <form method="POST" onSubmit={handleSubmit}>
                <div className="form-box">
                  <label>WAF Name:</label>
                  <input
                    type="text"
                    value={wafName}
                    onChange={(e) => setWafName(e.target.value)}
                    placeholder="MySite-WAF"
                    required
                  />
                </div>
                <div className="form-box">
                  <label>Description:</label>
                  <textarea
                    value={wafDesc}
                    onChange={(e) => setWafDesc(e.target.value)}
                    placeholder="Short description of your WAF purpose"
                  />
                </div>
                <div className="form-box">
                  <label>Protected Domain / Endpoint:</label>
                  <input
                    type="text"
                    value={protectedDomain}
                    onChange={(e) => setProtectedDomain(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div className="form-box">
                  <label>HTTP Methods:</label>

                  <div className="checkboxes">
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((method) => (
                      <label key={method}>
                        <input
                          type="checkbox"
                          value={method}
                          checked={httpallowedmethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHttpAllowedMethods([
                                ...httpallowedmethods,
                                method,
                              ]);
                            } else {
                              setHttpAllowedMethods(
                                httpallowedmethods.filter((m) => m !== method)
                              );
                            }
                          }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-box">
                  <label>Proxy Domain :</label>
                  <input
                    type="text"
                    value={proxyDomain}
                    onChange={(e) => setProxyDomain(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div className="form-box">
                  <label>Inspection Mode:</label>
                  <select
                    value={inspectionMode}
                    onChange={(e) => setInspectionMode(e.target.value)}
                    required
                  >
                    <option value="">Select Mode</option>
                    <option value="monitor">Monitor Only</option>
                    <option value="block">Block Suspicious Requests</option>
                  </select>
                </div>

                <div className="form-box waf-rules">
                  <label>Threat Rules:</label>
                  <div className="filterscontainer">
                    {[
                      'SQL Injection',
                      'Cross Site Scripting',
                      'File Upload',
                      'RCE',
                      'CSRF',
                      'Bot Detection',
                    ].map((rule, i) => (
                      <label key={i}>
                        <input
                          type="checkbox"
                          value={rule.toLowerCase().replace(/\s/g, '')}
                          onChange={handleThreatChange}
                          checked={threatRules.includes(
                            rule.toLowerCase().replace(/\s/g, '')
                          )}
                        />
                        {rule}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-box">
                  <label>Rate Limit (req/min):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="form-box">
                  <label>Alert Method:</label>
                  <select
                    value={alertMethod}
                    onChange={(e) => setAlertMethod(e.target.value)}
                  >
                    <option value="">Select Alert Type</option>
                    <option value="email">Email</option>
                    <option value="webhook">Webhook</option>
                    <option value="dashboard">Dashboard Only</option>
                  </select>
                </div>

                <div className="form-box">
                  <label>Request Logging:</label>
                  <select
                    value={logging}
                    onChange={(e) => setLogging(e.target.value)}
                  >
                    <option value="">Select Logging Level</option>
                    <option value="full">Full Request Logs</option>
                    <option value="threatsOnly">Only Threat Requests</option>
                    <option value="none">No Logging</option>
                  </select>
                </div>

                <div className="form-box">
                  <label>Geo Blocking (Optional):</label>
                  <input
                    type="text"
                    value={geoBlock}
                    onChange={(e) => setGeoBlock(e.target.value)}
                    placeholder="e.g., CN, RU, IR"
                  />
                </div>

                <div className="submit-btn">
                  <button type="submit">Create WAF API</button>
                </div>
              </form>
            </div>
          </div>
        </FadeUpOnScroll>
      </main>
      <Footer />
    </FadeUpOnScroll>
  );
}

export default WAFAPIPage;
