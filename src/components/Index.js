import bug from '../assets/img/bug.png';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import FadeUpOnScroll from './FadeUpOnScroll';

function Index() {
  return (
    <FadeUpOnScroll>
      <main>
        <div className="hero">
          <div className="main-container">
            <div className="desc-container">
              <h1>
                Ethix<span>ion</span> - Silent Walls, Loud Prtection!
              </h1>
              <p>
                Ethixion is a unified security solution that combines a Web
                Application Firewall (WAF), reverse proxy, and API Access
                Security Layer to protect modern web applications and backend
                services from unauthorized access and malicious traffic. Acting
                as a centralized gateway, Ethixion ensures that every incoming
                request is securely routed, authenticated, and inspected before
                reaching the origin server. By integrating reverse proxy
                capabilities, it manages traffic flow efficiently while
                isolating backend systems from direct exposure, significantly
                reducing the attack surface. The API Access Security Layer
                enforces strict authentication and validation mechanisms,
                ensuring that only authorized clients can interact with
                protected services.
              </p>
              <Link to="/action">
                <button>Start for free</button>
              </Link>
            </div>
            <div className="ethixion-firewall-animation">
              <div className="glow-ring"></div>
              <div className="shield-icon"></div>
              <div className="data-pulse"></div>
              <img src={bug} alt="bug" className="bug bug1" />
              <img src={bug} alt="bug" className="bug bug2" />
              <img src={bug} alt="bug" className="bug bug3" />
            </div>
          </div>
        </div>
        <FadeUpOnScroll>
          <div className="key-features">
            <h1>Key Features</h1>
            <div className="features">
              <div className="featured-box">
                <h3>High Performance</h3>
                <p>
                  Built with Rust, ensuring low-latency and efficient network
                  packet filtering.
                </p>
              </div>
              <div className="featured-box">
                <h3>Customizable Rules</h3>
                <p>Set specific firewall rules tailored to your needs.</p>
              </div>
              <div className="featured-box">
                <h3>Easy Integration</h3>
                <p>Simple configuration with existing network systems.</p>
              </div>
              <div className="featured-box">
                <h3>Cross-Platform</h3>
                <p>Compatible with Linux, Windows.</p>
              </div>
              <div className="featured-box">
                <h3>Real-Time Monitoring</h3>
                <p>Monitor firewall logs and traffic flow.</p>
              </div>
              <div className="featured-box">
                <h3>Lightweight</h3>
                <p>Minimal resource usage even under heavy load.</p>
              </div>
            </div>
          </div>
        </FadeUpOnScroll>
        <div className="timeline-container">
          <h2>How It Works</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="timeline-content">
                <h3>Intercept</h3>
                <p>All traffic passes through Ethixion WAF.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="timeline-content">
                <h3>Analyze</h3>
                <p>Packets are analyzed in real-time with AI + Rules.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="timeline-content">
                <h3>Act</h3>
                <p>Threats are blocked, logs generated, and admins alerted.</p>
              </div>
            </div>
          </div>
        </div>
        <FadeUpOnScroll>
          <div className="why-ethixion-ul">
            <h2>
              Why <span>Ethixion</span> Lite?
            </h2>
            <ul>
              <li>
                <i className="fas fa-bolt"></i> Blazing-fast performance powered
                by Rust, ensuring minimal latency and maximum security.
              </li>
              <li>
                <i className="fas fa-brain"></i> Intelligent threat filtering
                that adapts to evolving attack patterns.
              </li>
              <li>
                <i className="fas fa-satellite-dish"></i> Real-time alerts that
                notify you instantly of suspicious activity.
              </li>
              <li>
                <i className="fas fa-globe-asia"></i> Geo-fencing support to
                restrict access from specific regions or countries.
              </li>
              <li>
                <i className="fas fa-chart-line"></i> Live analytics dashboard
                to monitor threat trends and system health.
              </li>
              <li>
                <i className="fas fa-sliders-h"></i> Fully customizable rule
                engine tailored to your app's security needs.
              </li>
            </ul>
          </div>
        </FadeUpOnScroll>
      </main>
      <Footer />
    </FadeUpOnScroll>
  );
}

export default Index;
