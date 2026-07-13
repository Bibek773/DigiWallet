import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaShieldAlt,
  FaUniversity,
  FaWallet,
  FaUserShield,
  FaBolt,
} from "react-icons/fa";
import Logo from "../../components/Logo";
import "./Homepage.css";

export default function HomePage() {
  return (
    <div className="home-page">

      <nav className="home-nav">
        <div className="home-nav__brand">
          <Logo size={36} />
          <span className="home-nav__logo">DiGiWallet</span>
        </div>

        <div className="home-nav__links">
          <Link to="/" className="home-nav__link home-nav__link--active">
            Home
          </Link>
          <Link to="/register" className="home-nav__link">
            Register
          </Link>
          <Link to="/terms" className="home-nav__link">
            Terms
          </Link>
          <Link to="/privacy" className="home-nav__link">
            Privacy Policy
          </Link>
          <Link to="/login" className="home-nav__login-btn">
            Login
          </Link>
        </div>
      </nav>

      <header className="hero-section">
        <p className="eyebrow">Digital Academic Credential Platform</p>
        <h1 className="hero-section__title">
          Your Degree.<br />
          Verified Instantly. Trusted Everywhere.
        </h1>
        <p className="hero-section__subtitle">
          DiGiWallet replaces paper certificates with cryptographically signed
          digital credentials — stored safely in your wallet, and verified by
          any employer in seconds.
        </p>
      </header>

      <section className="features-section">
        <p className="eyebrow eyebrow--center">Why DiGiWallet</p>
        <h2 className="features-section__title">
          Built for trust, speed, and security
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaQrcode />
            </div>
            <h3>Instant QR Verification</h3>
            <p>
              Employers scan a single QR code or open a link to confirm a
              credential's authenticity in seconds — no calls, no emails, no
              waiting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaShieldAlt />
            </div>
            <h3>Tamper-Proof Security</h3>
            <p>
              Every credential is digitally signed using your college's
              private key. Any change to the data instantly invalidates the
              signature.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaUniversity />
            </div>
            <h3>College-Verified Identity</h3>
            <p>
              Every student account is manually reviewed and approved by
              their college before it becomes active — keeping fake accounts
              out of the system.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaWallet />
            </div>
            <h3>One Digital Wallet</h3>
            <p>
              Store every certificate, transcript, and credential you earn in
              a single secure wallet you control.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaUserShield />
            </div>
            <h3>Role-Based Access</h3>
            <p>
              Colleges, students, and administrators each get exactly the
              access they need — nothing more, nothing less.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <FaBolt />
            </div>
            <h3>No More Manual Checks</h3>
            <p>
              Replace slow phone calls and email verification requests with
              one instant, automated check.
            </p>
          </div>

        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-section__title">Ready to get started?</h2>
        <p className="cta-section__subtitle">
          Join DiGiWallet and take control of your academic credentials.
        </p>
        <Link to="/register" className="get-started-btn">
          Create your account
        </Link>
      </section>

      <footer className="home-footer">
        <span>© 2026 DiGiWallet — Digital Credential Management System</span>
        <div className="home-footer__links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </footer>

    </div>
  );
}
