import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="landing-logo">VendorFlow</span>
        <div className="landing-nav-actions">
          <Link className="btn-ghost" to="/login">
            Log in
          </Link>
          <Link className="btn-primary" to="/register">
            Get started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">
            Your orders, organized.
            <br />
            Your business, taken seriously.
          </h1>
          <p className="hero-sub">
            Stop losing sales in the chat scroll. Track every order, every
            customer, every naira — in one place built for how you actually
            sell.
          </p>
          <Link className="btn-primary hero-cta" to="/register">
            Start now — it's free
          </Link>
        </div>
        <div className="hero-image-wrap">
          <img
            src={heroImage}
            alt="VendorFlow dashboard"
            className="hero-image"
          />
        </div>
      </section>

      <section className="platform-section">
        <p className="platform-label">Works with however you sell</p>
        <div className="platform-row">
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.6 14.2c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.7.8 2 .9.3.2.5.2.6.3.1.2.1.7-.1 1.3z" />
            </svg>
            <span>WhatsApp</span>
          </div>
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .3 2.4.5a4.9 4.9 0 011.8 1.2 4.9 4.9 0 011.2 1.8c.2.4.4 1.2.5 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 2-.5 2.4a4.9 4.9 0 01-1.2 1.8 4.9 4.9 0 01-1.8 1.2c-.4.2-1.2.4-2.4.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.3-2.4-.5a4.9 4.9 0 01-1.8-1.2 4.9 4.9 0 01-1.2-1.8c-.2-.4-.4-1.2-.5-2.4-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-2 .5-2.4a4.9 4.9 0 011.2-1.8A4.9 4.9 0 015.8 2.8c.4-.2 1.2-.4 2.4-.5C9.4 2.2 9.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.4a3 3 0 00-1.1.7 3 3 0 00-.7 1.1c-.2.3-.3.9-.4 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 1.9a3 3 0 00.7 1.1 3 3 0 001.1.7c.3.2.9.3 1.9.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.4a3 3 0 001.1-.7 3 3 0 00.7-1.1c.2-.3.3-.9.4-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-1.9a3 3 0 00-.7-1.1 3 3 0 00-1.1-.7c-.3-.2-.9-.3-1.9-.4-1.2-.1-1.6-.1-4.7-.1zm0 3a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-1.9a1.2 1.2 0 110 2.3 1.2 1.2 0 010-2.3z" />
            </svg>
            <span>Instagram</span>
          </div>
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.6 5.8c-1-.9-1.5-2.1-1.5-3.5h-3.2v13.4c0 1.6-1.3 3-3 3-1.6 0-3-1.3-3-3 0-1.6 1.3-3 3-3 .3 0 .6 0 .9.1V9.5c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V9c1.2.9 2.7 1.4 4.3 1.4V7.2c-.9 0-1.8-.3-2.6-.9z" />
            </svg>
            <span>TikTok</span>
          </div>
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.9 3H22l-7.6 8.7L23 21h-6.9l-5.4-6.6L4.5 21H1.4l8.1-9.3L1 3h7.1l4.9 6 5.9-6zm-1.2 16.2h1.7L7.4 4.7H5.6l12.1 14.5z" />
            </svg>
            <span>Twitter/X</span>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <span className="feature-icon">📋</span>
          <h3>Every order, one place</h3>
          <p>No more scrolling through chats to remember who ordered what.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📲</span>
          <h3>One-tap follow-up</h3>
          <p>
            Message customers with their order status already written for you.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📈</span>
          <h3>Your sales, remembered</h3>
          <p>
            A permanent record of every sale — not a diary, not a lost chat.
          </p>
        </div>
      </section>

      <section className="landing-cta-final">
        <h2>Ready to stop losing orders in the chat?</h2>
        <Link className="btn-primary hero-cta" to="/register">
          Get started free
        </Link>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} VendorFlow</span>
      </footer>
    </div>
  );
}

export default Landing;
