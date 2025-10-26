# Ethixion Lite

Ethixion Lite is a lightweight Web Application Firewall (WAF) and API Access Security Layer built to protect web applications and microservices from malicious requests and unauthorized access. It stands between clients and backend services, validating and inspecting every request before forwarding it to the actual application server.

Ethixion Lite focuses on simplicity, performance, and reliability, making it suitable for small to medium-scale applications and developer environments.

---

## Purpose

- Protect APIs and web applications from unauthorized access.
- Detect and block common web attacks such as:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Path Traversal
  - Header Manipulation
- Provide a controlled access mechanism using API Key and API ID.

Ethixion Lite ensures that no internal API or service endpoint is directly exposed to the internet without authentication and inspection.

---

## How It Works

1. A developer registers their application in Ethixion Lite.
2. Ethixion generates a unique API Key and API ID.
3. The client accessing the protected API must include these credentials in the request headers.
4. Ethixion validates:
   - API Key and API ID
   - Request integrity
   - Suspicious payload patterns
5. If validation succeeds, the request is forwarded to the actual backend.
6. If validation fails, the request is blocked.

---

## Features

- API-level authentication using API Key and API ID.
- Request integrity checks.
- Protection against common injection and scripting attacks.
- Centralized application and key management.
- Lightweight inspection logic for minimal performance overhead.
- Easy integration without modifying backend application code.

---

## Architecture Overview

| Layer | Role |
|------|------|
| API Authentication | Ensures only registered clients send requests |
| Threat Detection | Blocks harmful payloads before they reach backend |
| Forwarding Layer | Routes valid traffic to protected servers |

---

## Tech Stack

| Component | Technology |
|----------|------------|
| Language | Rust |
| Framework | Rocket |
| Database | PostgreSQL |
| Deployment Target | Linux / Docker / VM environments |

Rust ensures memory safety, speed, and high concurrency—making Ethixion Lite secure and efficient.

---

## Suitable Use Cases

- Protecting personal and hobby web services.
- Securing internal APIs and backend endpoints.
- Teaching and demonstration of practical API security.
- Lightweight WAF protection for SaaS and microservice deployments.

---

## Roadmap

| Feature | Status |
|--------|--------|
| Dashboard for app/key management | In Progress |
| Rate Limiting | Planned |
| Event Logging and Monitoring | Planned |
| Threat Signature Database | Planned |
| Upgrade Path to Reverse Proxy WAF (Ethixion Pro) | Upcoming |

---

## Vision

Ethixion Lite serves as the foundation layer for the broader Ethixion Security Suite. It aims to provide developers and small teams with a secure-by-default API protection system that can be scaled and upgraded over time. The long-term goal is to evolve Ethixion Lite into Ethixion Pro, a full-scale reverse-proxy WAF with dynamic routing and intelligent threat prevention.