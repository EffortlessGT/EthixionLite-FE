import FadeUpOnScroll from './FadeUpOnScroll';
import Footer from './Footer';
import GT from '../assets/img/GT.jpg';

const AboutEthixion = () => {
  return (
    <main>
      <div className="about-ethixion">
        <FadeUpOnScroll>
          <section className="section">
            <h2>Our Mission</h2>
            <p>
              At Ethixion, our mission is to build secure digital ecosystems
              through intelligent traffic monitoring, adaptive rate limiting,
              and zero-trust principles. We are committed to providing robust
              protection for web applications and APIs, ensuring data integrity
              and availability.
            </p>
          </section>
        </FadeUpOnScroll>
        <FadeUpOnScroll>
          <section className="section">
            <h2>How Ethixion Secures You</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <h4>Behavioral Anomaly Detection</h4>
                <p>
                  Detects unusual patterns and deviations from normal behavior
                  to identify and mitigate potential threats.
                </p>
              </div>
              <div className="feature-card">
                <h4>Geo-Fencing and IP-Based Threat Response</h4>
                <p>
                  Restricts access based on geographic location and responds to
                  threats based on IP reputation.
                </p>
              </div>
              <div className="feature-card">
                <h4>Dynamic Rule Enforcement</h4>
                <p>
                  Allows users to define custom filters for granular control
                  over traffic.
                </p>
              </div>
              <div className="feature-card">
                <h4>Real-Time Header and Payload Inspection</h4>
                <p>
                  Inspects headers and payloads in real-time to identify and
                  block malicious content.
                </p>
              </div>
              <div className="feature-card">
                <h4>Automated API Key Management and Abuse Tracking</h4>
                <p>
                  Manages API keys and tracks abuse to prevent unauthorized
                  access and misuse.
                </p>
              </div>
              <div className="feature-card">
                <h4>Integration with Any Backend</h4>
                <p>
                  Seamlessly integrates with various backend technologies,
                  including Rust, Go, and Python.
                </p>
              </div>
            </div>
          </section>
        </FadeUpOnScroll>
        <FadeUpOnScroll>
          <section className="section">
            <h2>Built for Developers, Loved by Systems</h2>
            <p>
              Ethixion is designed with developers in mind, offering easy
              integration, detailed logs, and extensibility. Our architecture
              leverages Rust (Rocket + SQLx), PostgreSQL, React dashboards, and
              optional Python ML microservices to provide a powerful and
              flexible security solution.
            </p>
          </section>
        </FadeUpOnScroll>
        <FadeUpOnScroll>
          <section className="section">
            <h2>Our Tech Philosophy</h2>
            <p>
              We believe in a performance-first design, open architecture, and
              responsible AI use in security. Ethixion shifts from traditional
              signature-based blocking to contextual behavior monitoring,
              providing more effective and adaptive protection against evolving
              threats.
            </p>
          </section>
        </FadeUpOnScroll>
        <FadeUpOnScroll>
          <section className="section creator-section">
            <h2>Behind the Firewall</h2>
            <div className="creator-info">
              <div className="creator-img">
                <img src={GT} alt="Creator" />{' '}
              </div>
              <div className="creator-desc">
                <span>GANESH TELORE</span>
                <br />
                <b className="role">Creator of Ethixion</b>
                <p>
                  Ganesh is a passionate backend and security-focused engineer
                  building infrastructure that not only defends but understands
                  traffic behavior. Ethixion was built from scratch with
                  security, scalability, and developer empathy at its core.
                </p>
              </div>
            </div>
          </section>
        </FadeUpOnScroll>

        <FadeUpOnScroll>
          <div className="contact-container">
            <div className="contact-box">
              <div className="contact-form">
                <h2>Contact Me</h2>
                <form>
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                  <textarea
                    rows="5"
                    placeholder="Your Message"
                    required
                  ></textarea>
                  <button type="submit">Send Message</button>
                </form>
              </div>

              <div className="contact-social">
                <h2>Connect Developer on Socials</h2>
                <p>
                  Ethixion is a personal project built out of my passion for
                  backend security and intelligent systems. As a student
                  developer, I'm exploring how modern firewalls can evolve
                  beyond static rules into adaptive, developer-first security
                  solutions. Let’s connect and grow together.
                </p>
                <ul>
                  <li>
                    <a
                      href="https://instagram.com/effortlessgt/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-instagram icon"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/ganesh-telore-0b566a303/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-linkedin icon"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/EthicalGT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-github icon"></i>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:ganeshtelore4@gmail.com">
                      <i className="fa-solid fa-envelope icon"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeUpOnScroll>
      </div>
      <FadeUpOnScroll>
        <Footer />
      </FadeUpOnScroll>
    </main>
  );
};

export default AboutEthixion;
