import React, { useState } from 'react';
import api_img from '../assets/img/api_img.png';
import Footer from './Footer';
import { apiForm } from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { toast } from 'react-toastify';

function APIPage() {
  const [apiname, setApiname] = useState('');
  const [apidesc, setApidesc] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [authType, setAuthType] = useState('');
  const [allowedIp, setAllowedIp] = useState('');
  const [rateLimit, setRateLimit] = useState('');
  const [threatFilters, setThreatFilters] = useState([]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setThreatFilters([...threatFilters, value]);
    } else {
      setThreatFilters(threatFilters.filter((filter) => filter !== value));
    }
  };

  const handleAPICreation = async (e) => {
    e.preventDefault();
    const data = {
      apiname,
      apidesc,
      endpoint_url: endpointUrl,
      auth_type: authType,
      allowed_ip: allowedIp,
      rate_limit: rateLimit,
      threat_filters: threatFilters.join(','),
    };

    const apinamePatt = /^[a-zA-Z0-9_-]{3,50}$/;
    const apidescPatt = /^.{0,500}$/;
    const endpointUrlPatt = /^https?:\/\/[\S]+$/;
    const allowedIpPatt =
      /^\s*$|^(\d{1,3}\.){3}\d{1,3}(\s*,\s*(\d{1,3}\.){3}\d{1,3})*$/;
    const rateLimitPatt = /^(?:[1-9]|[1-4][0-9]|50)$/;

    if (!apinamePatt.test(apiname)) {
      toast.error('Please enter a valid API name.');
      return;
    }
    if (!apidescPatt.test(apidesc)) {
      toast.error('Please enter a valid API description.');
      return;
    }
    if (!endpointUrlPatt.test(endpointUrl)) {
      toast.error('Please enter a valid endpoint URL.');
      return;
    }
    if (!allowedIpPatt.test(allowedIp)) {
      toast.error('Please enter a valid allowed IP address or list of IPs.');
      return;
    }
    if (!rateLimitPatt.test(rateLimit)) {
      toast.error('Please enter a valid rate limit number.');
      return;
    }

    try {
      const result = await apiForm(data);
      if (result.apiname != null && result.apikey) {
        document.getElementById('apiid').innerText =
          'Your API ID: ' + result.apiname;
        document.getElementById('apikey').innerText =
          'Your API Key: ' + result.apikey;

        document.querySelector('.APICredentials').style.display = 'block';
        document.querySelector('.api-IdeaContainer').style.display = 'none';
        document.querySelector('.api').style.display = 'none';
        document.querySelector('.apisteps-container').style.display = 'none';
        document.querySelector('.api-form').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
      }
      //console.log("API Created with API Name & Key ->", result.apiname, result.apikey);
    } catch (error) {
      console.log('Error ->', error);
    }
    console.log(document.cookie);
  };

  const hideAPIDialog = () => {
    window.location.reload();
  };

  const panelRedirect = () => {
    window.location = '/panel';
  };
  return (
    <FadeUpOnScroll delay={0.3}>
      <main>
        <div className="api-IdeaContainer">
          <div className="imgcontainer">
            <img src={api_img} alt="API" />
          </div>
          <div className="desccontainer">
            <h2> What is the Ethixion API?</h2>
            <p>
              The Ethixion API lets you integrate Ethixion’s Application Layer
              Firewall directly into your web applications. It analyzes incoming
              traffic, detects malicious behavior (like SQL injection, XSS,
              etc.), and helps block harmful requests before they reach your
              server. Incorporating the Ethixion API into your infrastructure
              allows you to enforce custom security rules, monitor traffic
              behavior, and receive detailed threat intelligence — all through a
              simple and developer-friendly interface.
            </p>
            <span>⚠️ Why is it Important?</span>
            <ul>
              <li>🛡️ Protects your application from common web attacks</li>
              <li>
                🚀 Easy to integrate with your backend using simple API calls
              </li>
              <li>📊 Provides real-time threat detection and logging</li>
              <li>
                ⚙️ Adds an extra security layer without changing your
                application code
              </li>
            </ul>
          </div>
        </div>
        <br />
        <div className="api">
          <h1>Steps to Create Ethixion API</h1>
          <p>
            Define your API's basic information and secure it to protect your
            application.
          </p>

          <div className="apisteps-container">
            <div className="box">
              <span>Step 1</span>
              <h3>API Info</h3>
              <p>
                Enter basic details like the name and description of your API.
              </p>
            </div>
            <div className="box">
              <span>Step 2</span>
              <h3>Set Access Rules</h3>
              <p>
                Define how your API can be accessed for example, by IP
                restrictions or enabling authentication.
              </p>
            </div>
            <div className="box">
              <span>Step 3</span>
              <h3>Generate API Key</h3>
              <p>
                Generate your API key to start integrating Ethixion Firewall
                into your application.
              </p>
            </div>
          </div>
        </div>
        <h1 id="heading">Set up your Ethixion API...</h1>
        <div className="api-form">
          <form method="POST" onSubmit={handleAPICreation}>
            <div className="apiform-boxes">
              <label htmlFor="apiName">API Name:</label>
              <input
                type="text"
                id="apiName"
                name="apiName"
                value={apiname}
                onChange={(e) => setApiname(e.target.value)}
                placeholder="Enter API Name"
              />
            </div>

            <div className="apiform-boxes">
              <label htmlFor="apiDescription">API Description:</label>
              <textarea
                id="apiDescription"
                name="apiDescription"
                value={apidesc}
                onChange={(e) => setApidesc(e.target.value)}
                placeholder="Enter API description within 100 characters."
              ></textarea>
            </div>

            <div className="apiform-boxes">
              <label htmlFor="endpointUrl">Endpoint URL:</label>
              <input
                type="url"
                id="endpointUrl"
                name="endpointUrl"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="Enter base endpoint URL"
              />
            </div>

            <div className="apiform-boxes">
              <label htmlFor="authType">Authentication Type:</label>
              <select
                id="authType"
                name="authType"
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
              >
                <option value="">Select Authentication</option>
                <option value="apiKey">API Key</option>
                <option value="bearerToken">Bearer Token</option>
              </select>
            </div>

            <div className="apiform-boxes">
              <label htmlFor="allowedIps">Allowed IPs (optional):</label>
              <input
                type="text"
                id="allowedIps"
                name="allowedIps"
                value={allowedIp}
                onChange={(e) => setAllowedIp(e.target.value)}
                placeholder="E.g., 192.168.1.1, 127.0.0.1"
              />
            </div>

            <div className="apiform-boxes">
              <label htmlFor="rateLimit">
                Rate Limit (requests per minute):
              </label>
              <select
                id="rateLimit"
                name="rateLimit"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
              >
                <option value="">Select Rate Limit</option>
                <option value="1">1 req/min – Strict (sensitive APIs)</option>
                <option value="5">5 req/min – Sandbox / testing</option>
                <option value="10">10 req/min – Hobby projects</option>
                <option value="20">20 req/min – Light business APIs</option>
                <option value="30">30 req/min – Moderate usage apps</option>
                <option value="40">40 req/min – Business apps (growing)</option>
                <option value="50">
                  50 req/min – Maximum (production-ready)
                </option>
              </select>
              <p className="hint">
                Choose the right request limit depending on your API usage
                (sandbox, hobby, or business app).
              </p>
            </div>

            <div className="apiform-boxes">
              <label>Threat Filters:</label>
              <div className="filterscontainer">
                <label>
                  <input
                    type="checkbox"
                    name="filters"
                    value="sqlInjection"
                    checked={threatFilters.includes('sqlInjection')}
                    onChange={handleFilterChange}
                  />
                  SQL Injection
                </label>
                <br />

                <label>
                  <input
                    type="checkbox"
                    name="filters"
                    value="xss"
                    checked={threatFilters.includes('xss')}
                    onChange={handleFilterChange}
                  />
                  Cross-Site Scripting (XSS)
                </label>
                <br />

                <label>
                  <input
                    type="checkbox"
                    name="filters"
                    value="userAgent"
                    checked={threatFilters.includes('userAgent')}
                    onChange={handleFilterChange}
                  />
                  Suspicious User Agents
                </label>
              </div>
            </div>

            <div className="apiform-submit">
              <button type="submit">Create API</button>
            </div>
          </form>
        </div>
        <div className="APICredentials">
          <h2>Success! Your Ethixion API has been created.</h2>
          <p id="apiid">API ID: </p>
          <p id="apikey">API Key: </p>
          <p>
            Please keep your API credentials confidential and do not share them
            with unauthorized parties.
          </p>
          <div className="APIcredentials-buttons">
            <button onClick={panelRedirect}>Manage</button>
            <button onClick={hideAPIDialog}>Close</button>
          </div>
        </div>
      </main>
      <Footer />
    </FadeUpOnScroll>
  );
}

export default APIPage;
