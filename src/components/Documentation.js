import React, { useEffect, useState } from 'react';
import './Documentation.css';
import FadeUpOnScroll from './FadeUpOnScroll';
import Footer from './Footer';
import Nav from './Nav';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('.doc-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const chapters = [
    { id: 'intro', title: 'Chapter 1 — Introduction' },
    { id: 'architecture', title: 'Chapter 2 — Architecture' },
    { id: 'features', title: 'Chapter 3 — Security Features' },
    { id: 'rbac', title: 'Chapter 4 — Authentication & RBAC' },
    { id: 'integration', title: 'Chapter 5 — Developer Integration' },
    { id: 'proxy', title: 'Chapter 6 — Reverse Proxy' },
    { id: 'dashboard', title: 'Chapter 7 — Dashboard System' },
    { id: 'logging', title: 'Chapter 8 — Request Logging' },
    { id: 'ratelimit', title: 'Chapter 9 — Rate Limiting' },
    { id: 'inspection', title: 'Chapter 10 — File & Payload Inspection' },
    { id: 'best-practices', title: 'Chapter 11 — Security Best Practices' },
    { id: 'deployment', title: 'Chapter 12 — Deployment Overview' },
    { id: 'roadmap', title: 'Chapter 13 — Roadmap' },
    { id: 'use-cases', title: 'Chapter 14 — Use Cases' },
    { id: 'conclusion', title: 'Chapter 15 — Conclusion' },
  ];

  return (
    <>
      <Nav />
      <div className="documentation-wrapper">
        <aside className="doc-sidebar">
          <div className="sidebar-category">Getting Started</div>
          <ul>
            <li><a href="#intro" className={activeSection === 'intro' ? 'active' : ''}>Introduction</a></li>
            <li><a href="#architecture" className={activeSection === 'architecture' ? 'active' : ''}>Architecture</a></li>
          </ul>

          <div className="sidebar-category">Core Concepts</div>
          <ul>
            <li><a href="#features" className={activeSection === 'features' ? 'active' : ''}>Security Features</a></li>
            <li><a href="#rbac" className={activeSection === 'rbac' ? 'active' : ''}>Authentication & RBAC</a></li>
          </ul>

          <div className="sidebar-category">Integration</div>
          <ul>
            <li><a href="#integration" className={activeSection === 'integration' ? 'active' : ''}>Developer Integration</a></li>
            <li><a href="#proxy" className={activeSection === 'proxy' ? 'active' : ''}>Reverse Proxy</a></li>
          </ul>

          <div className="sidebar-category">Management</div>
          <ul>
            <li><a href="#dashboard" className={activeSection === 'dashboard' ? 'active' : ''}>Dashboard System</a></li>
            <li><a href="#logging" className={activeSection === 'logging' ? 'active' : ''}>Request Logging</a></li>
            <li><a href="#ratelimit" className={activeSection === 'ratelimit' ? 'active' : ''}>Rate Limiting</a></li>
            <li><a href="#inspection" className={activeSection === 'inspection' ? 'active' : ''}>Payload Inspection</a></li>
          </ul>

          <div className="sidebar-category">Resources</div>
          <ul>
            <li><a href="#best-practices" className={activeSection === 'best-practices' ? 'active' : ''}>Best Practices</a></li>
            <li><a href="#deployment" className={activeSection === 'deployment' ? 'active' : ''}>Deployment</a></li>
            <li><a href="#roadmap" className={activeSection === 'roadmap' ? 'active' : ''}>Roadmap</a></li>
            <li><a href="#use-cases" className={activeSection === 'use-cases' ? 'active' : ''}>Use Cases</a></li>
            <li><a href="#conclusion" className={activeSection === 'conclusion' ? 'active' : ''}>Conclusion</a></li>
          </ul>
        </aside>

        <div className="doc-content-wrapper">
          <main className="doc-content">
            <FadeUpOnScroll>
              <section id="intro" className="doc-section">
                <h1>Introduction to Ethixion</h1>
                <p>
                  Welcome to the Ethixion documentation! Ethixion is a modern, developer-friendly web security platform designed to secure your applications through a unified architecture combining a WAF, Reverse Proxy, and API Access Security Layer.
                </p>

                <div className="note-box">
                  <p><strong>Note:</strong> Ethixion is currently in active development. Expect regular updates to the security engines and dashboard features as we continue to expand the platform.</p>
                </div>
                
                <h2>What is Ethixion?</h2>
                <p>
                  Ethixion acts as an intelligent security gateway positioned between clients and backend servers. Every incoming request is inspected, validated, authenticated, filtered, and securely routed before reaching the origin infrastructure.
                </p>
                <ul>
                  <li><strong>Web Application Firewall (WAF)</strong> — Advanced protection against common web vulnerabilities.</li>
                  <li><strong>Reverse Proxy</strong> — Secure traffic routing and backend isolation.</li>
                  <li><strong>API Access Security (ASG)</strong> — Lightweight request inspection and authorization.</li>
                  <li><strong>Threat Filtering</strong> — Real-time identification of malicious traffic patterns.</li>
                  <li><strong>Centralized Management</strong> — Unified control over your entire security stack.</li>
                </ul>
              </section>

              <section id="architecture" className="doc-section">
                <h2>Ethixion Architecture</h2>
                <p>Ethixion consists of two major service layers designed to provide end-to-end security for modern systems.</p>

                <h3>1. Ethixion Lite (ASG)</h3>
                <p>Ethixion Lite is the API Access Security Layer responsible for:</p>
                <ul>
                  <li>API authentication and key validation</li>
                  <li>Traffic inspection and threat filtering</li>
                  <li>Lightweight request monitoring</li>
                </ul>

                <h3>2. Ethixion Pro</h3>
                <p>Ethixion Pro extends the Lite architecture by introducing a full Reverse Proxy and WAF layer.</p>
                <ul>
                  <li>Domain-level traffic control and request routing</li>
                  <li>Real-time request filtering and rate limiting</li>
                  <li>Advanced security monitoring dashboard</li>
                </ul>

                <h2>Request Flow Architecture</h2>
                <div className="architecture-flow">
                  Client Request<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Ethixion Gateway<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Authentication Layer<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Threat Inspection Engine<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Rate Limiting Engine<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Reverse Proxy Routing<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br />
                  Origin Application Server
                </div>
              </section>

              <section id="features" className="doc-section">
                <h2>Security Features</h2>
                <p>Ethixion includes request inspection mechanisms capable of detecting and mitigating common web-based threats.</p>
                
                <h3>Threat Protection Layers</h3>
                <ul>
                  <li><strong>SQL Injection Detection</strong> — Blocks malicious database query attempts.</li>
                  <li><strong>Cross-Site Scripting (XSS)</strong> — Filters dangerous scripts from user inputs.</li>
                  <li><strong>Path Traversal</strong> — Prevents unauthorized file system access.</li>
                  <li><strong>Rate Limiting</strong> — Protects against brute-force and request flooding.</li>
                  <li><strong>Payload Validation</strong> — Inspects request bodies for suspicious patterns.</li>
                  <li><strong>Unauthorized Access</strong> — Enforces RBAC and API key validation.</li>
                </ul>

                <h2>Reverse Proxy Protection</h2>
                <p>
                  Ethixion Pro operates as a secure entry point where all incoming traffic is first processed before reaching your origin server.
                </p>
                <ul>
                  <li><strong>Backend Isolation</strong> — Reduces direct exposure of your infrastructure.</li>
                  <li><strong>Domain Routing</strong> — Manages traffic across multiple backend services.</li>
                  <li><strong>Layered Enforcement</strong> — Applies security policies at the gateway level.</li>
                </ul>
              </section>

              <section id="rbac" className="doc-section">
                <h2>Authentication & RBAC</h2>
                <p>Ethixion implements a unified Authentication and Role-Based Access Control (RBAC) system to ensure controlled access across services.</p>
                
                <h3>RBAC Controls</h3>
                <ul>
                  <li><strong>Service Authorization</strong> — Service-based access permissions.</li>
                  <li><strong>Dashboard Visibility</strong> — Module-level visibility management.</li>
                  <li><strong>Ownership Verification</strong> — Cross-checks for API and WAF instance ownership.</li>
                  <li><strong>Session Validation</strong> — Continuous verification of active user sessions.</li>
                </ul>
              </section>

              <section id="integration" className="doc-section">
                <h2>Developer Integration</h2>
                <p>Ethixion provides multiple integration methods for securing applications and APIs, designed for developer ease and performance.</p>
                
                <h3>Endpoint</h3>
                <div className="code-block">
                  <button 
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText('POST /ethix_firewall')}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                  <pre><span className="http-method">POST</span> /ethix_firewall</pre>
                </div>

                <h3>Required Headers</h3>
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Header</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>x-api-name</td>
                      <td>Registered API name</td>
                    </tr>
                    <tr>
                      <td>x-api-key</td>
                      <td>Generated API key</td>
                    </tr>
                    <tr>
                      <td>x-redirect-url</td>
                      <td>Optional redirect URL</td>
                    </tr>
                  </tbody>
                </table>

                <h3>Example Request</h3>
                <div className="code-block">
                  <button 
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText('POST /ethix_firewall HTTP/1.1\nHost: api.ethixion.com\nx-api-name: my_service\nx-api-key: YOUR_API_KEY')}
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                  <pre>
<span className="http-method">POST</span> /ethix_firewall HTTP/1.1<br />
Host: api.ethixion.com<br />
x-api-name: my_service<br />
x-api-key: YOUR_API_KEY
                  </pre>
                </div>
              </section>

              <section id="proxy" className="doc-section">
                <h2>Reverse Proxy Configuration</h2>
                <p>Ethixion Pro operates as a reverse proxy security gateway, simplifying how you protect entire domains.</p>
                
                <ol>
                  <li>Configure domain routing in the Ethixion Dashboard.</li>
                  <li>Point your DNS (A/CNAME records) to the Ethixion Gateway.</li>
                  <li>Ethixion performs inspection, filtering, and authentication.</li>
                  <li>Valid traffic is securely forwarded to your backend server.</li>
                </ol>

                <h3>Domain Management</h3>
                <ul>
                  <li><strong>Origin Servers</strong> — Configure where traffic should be routed.</li>
                  <li><strong>Access Policies</strong> — Define fine-grained security rules for each domain.</li>
                  <li><strong>Traffic Insights</strong> — Monitor request statistics in real-time.</li>
                </ul>
              </section>

              <section id="dashboard" className="doc-section">
                <h2>Dashboard System</h2>
                <p>The Ethixion Dashboard provides a centralized interface for monitoring and managing your security stack.</p>
                <ul>
                  <li><strong>API Management</strong> — Control and monitor your protected APIs.</li>
                  <li><strong>WAF Configuration</strong> — Fine-tune firewall rules and threat signatures.</li>
                  <li><strong>Security Logs</strong> — Detailed visibility into blocked and allowed requests.</li>
                  <li><strong>Traffic Analytics</strong> — Real-time insights into your application's health.</li>
                </ul>
              </section>

              <section id="logging" className="doc-section">
                <h2>Request Logging</h2>
                <p>Ethixion records comprehensive request activity for deep security analysis and auditing.</p>
                <ul>
                  <li><strong>Request Metadata</strong> — Method, Path, IP, and Timestamp.</li>
                  <li><strong>Detection Results</strong> — Details of threat engine hits and block reasons.</li>
                  <li><strong>Service Context</strong> — Association with specific APIs or WAF instances.</li>
                </ul>
              </section>

              <section id="ratelimit" className="doc-section">
                <h2>Rate Limiting</h2>
                <p>Protect your services from abuse by applying adaptive request throttling thresholds.</p>
                <ul>
                  <li><strong>Per-Service Limits</strong> — Configure limits based on service capacity.</li>
                  <li><strong>Burst Monitoring</strong> — Detect and restrict sudden request spikes.</li>
                  <li><strong>Auto-Restriction</strong> — Automated handling of repeat offenders.</li>
                </ul>
              </section>

              <section id="inspection" className="doc-section">
                <h2>Payload Inspection</h2>
                <p>Ethixion analyzes incoming request payloads before they reach your origin server, mitigating payload-based attacks.</p>
                <ul>
                  <li>Inspection of Headers, Body, and Query Parameters.</li>
                  <li>Form data and multipart request analysis.</li>
                  <li>Validation of uploaded files and content types.</li>
                </ul>
              </section>

              <section id="best-practices" className="doc-section">
                <h2>Security Best Practices</h2>
                <p>Follow these recommendations to ensure maximum protection for your applications.</p>
                <ul>
                  <li><strong>Enforce HTTPS</strong> — Always use secure communication channels.</li>
                  <li><strong>Rotate Keys</strong> — Periodically update your API keys and credentials.</li>
                  <li><strong>Set Proper Limits</strong> — Configure rate limits that reflect actual usage.</li>
                  <li><strong>Monitor Regularly</strong> — Review security logs for suspicious activity patterns.</li>
                </ul>
              </section>

              <section id="deployment" className="doc-section">
                <h2>Deployment Overview</h2>
                <p>Ethixion is built for scalability and can be deployed across various infrastructure environments.</p>
                <ul>
                  <li><strong>Docker</strong> — Containerized deployment for consistency and scale.</li>
                  <li><strong>Cloud/VPS</strong> — Deploy on AWS, Google Cloud, or any VPS provider.</li>
                  <li><strong>Internal Infrastructure</strong> — Secure your internal microservices and APIs.</li>
                </ul>
              </section>

              <section id="roadmap" className="doc-section">
                <h2>Roadmap</h2>
                <p>We are constantly evolving Ethixion with new features and security layers.</p>
                <ul>
                  <li>AI-assisted Threat Detection Engine.</li>
                  <li>Automated IP Reputation and Geo-filtering.</li>
                  <li>Advanced Traffic Analytics and Insights.</li>
                  <li>WebSocket and gRPC Security Support.</li>
                </ul>
              </section>

              <section id="use-cases" className="doc-section">
                <h2>Use Cases</h2>
                <p>Ethixion is suitable for a wide range of modern application architectures.</p>
                <ul>
                  <li><strong>SaaS Platforms</strong> — Secure multi-tenant application traffic.</li>
                  <li><strong>API Providers</strong> — Protect and monitor public or private APIs.</li>
                  <li><strong>Microservices</strong> — Establish zero-trust communication between services.</li>
                </ul>
              </section>

              <section id="conclusion" className="doc-section">
                <h2>Conclusion</h2>
                <p>
                  Ethixion establishes a strong foundation for modern application protection by combining request validation, traffic inspection, and layered security enforcement.
                </p>
                <div className="creator-card">
                  <p>Developed by <strong>Ganesh Telore</strong></p>
                  <p>Full Stack Developer | Security-Focused SaaS Builder | Rust Enthusiast</p>
                </div>
              </section>
            </FadeUpOnScroll>
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default Documentation;
