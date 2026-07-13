import './PrivacyPage.css';

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-card">

        <header className="privacy-card__header">
          <p className="eyebrow">DigiWallet Student Privacy</p>
          <h1 className="privacy-card__title">Privacy Policy</h1>
          <p className="privacy-card__intro">
            DigiWallet values student privacy and is committed to protecting
            personal and academic information while providing secure digital
            credential services. This policy explains how your information
            is collected, used, stored, and protected.
          </p>

          <dl className="privacy-card__meta">
            <div>
              <dt>Last Updated</dt>
              <dd>July 2026</dd>
            </div>
            <div>
              <dt>Project Type</dt>
              <dd>University Academic Project</dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>Registered Students</dd>
            </div>
          </dl>
        </header>

        <section className="privacy-section">
          <p className="privacy-section__label">01 — Collection</p>
          <h2 className="privacy-section__title">Information We Collect</h2>
          <p>To create and maintain your account, DigiWallet may collect:</p>
          <ul className="privacy-list">
            <li>Full name</li>
            <li>Email address</li>
            <li>Student ID</li>
            <li>College or university name</li>
            <li>Academic information</li>
            <li>Profile photo, if uploaded</li>
            <li>Login credentials, stored securely</li>
            <li>Device or login information necessary for security</li>
          </ul>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">02 — Purpose</p>
          <h2 className="privacy-section__title">How We Use Your Information</h2>
          <p>Collected information is used to:</p>
          <ul className="privacy-list">
            <li>Create and manage student accounts.</li>
            <li>Issue digital academic credentials.</li>
            <li>Verify credentials when requested.</li>
            <li>Authenticate users during login.</li>
            <li>Improve platform reliability.</li>
            <li>Prevent fraud and unauthorized access.</li>
          </ul>
          <p>Your information is not collected for advertising purposes.</p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">03 — Academic Records</p>
          <h2 className="privacy-section__title">Academic Credential Data</h2>
          <p>
            Academic records uploaded or issued through DigiWallet are used
            only for educational credential management and verification.
            Students remain the owners of their own academic information at
            all times.
          </p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">04 — Protection</p>
          <h2 className="privacy-section__title">Data Storage and Security</h2>
          <p>DigiWallet applies reasonable security measures, including:</p>
          <ul className="privacy-list">
            <li>Password hashing</li>
            <li>Secure authentication</li>
            <li>Encrypted communication where applicable</li>
            <li>Restricted database access</li>
          </ul>
          <p>No online system can guarantee complete security.</p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">05 — Disclosure</p>
          <h2 className="privacy-section__title">Sharing of Information</h2>
          <p>DigiWallet does not sell student information. Information may only be shared when:</p>
          <ul className="privacy-list">
            <li>Required for credential verification.</li>
            <li>Required by applicable law.</li>
            <li>Authorized by the student.</li>
          </ul>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">06 — Your Control</p>
          <h2 className="privacy-section__title">Student Rights</h2>
          <p>As a registered student, you may:</p>
          <ul className="privacy-list">
            <li>View your stored information.</li>
            <li>Request corrections to inaccurate details.</li>
            <li>Update your account details.</li>
            <li>Request account deletion, subject to academic record requirements.</li>
          </ul>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">07 — Sessions</p>
          <h2 className="privacy-section__title">Cookies and Technical Data</h2>
          <p>
            DigiWallet may use minimal technical data, such as session
            cookies or authentication tokens, solely to maintain secure login
            sessions. No advertising or tracking cookies are used.
          </p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">08 — Retention</p>
          <h2 className="privacy-section__title">Data Retention</h2>
          <p>
            Information is retained only as long as necessary for academic
            credential management, legal requirements, or the purposes of
            this project.
          </p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">09 — Infrastructure</p>
          <h2 className="privacy-section__title">Third-Party Services</h2>
          <p>
            DigiWallet may rely on trusted third-party technologies such as
            cloud hosting, databases, or authentication services. Only the
            information necessary for these services to function is
            processed by them.
          </p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">10 — Updates</p>
          <h2 className="privacy-section__title">Changes to this Privacy Policy</h2>
          <p>
            This Privacy Policy may be updated as the project evolves.
            Students are encouraged to review the latest version
            periodically. Continued use of DigiWallet indicates acceptance
            of the updated policy.
          </p>
        </section>

        <hr className="privacy-divider" />

        <section className="privacy-section">
          <p className="privacy-section__label">11 — Reach Us</p>
          <h2 className="privacy-section__title">Contact Information</h2>
          <p>For questions regarding this policy, please contact:</p>
          <dl className="privacy-contact">
            <div>
              <dt>Email</dt>
              <dd>privacy@digiwallet.edu</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>Department of Computer Engineering</dd>
            </div>
            <div>
              <dt>University</dt>
              <dd>Pokhara University</dd>
            </div>
          </dl>
          <p className="privacy-contact__note">Contact details will be replaced with official information before deployment.</p>
        </section>

        <div className="privacy-notice">
          <p className="privacy-notice__title">Privacy Commitment</p>
          <p>
            DigiWallet is designed to protect student information through
            responsible data handling and reasonable security practices. By
            creating an account, you acknowledge that you have read and
            understood this Privacy Policy.
          </p>
        </div>

        <footer className="privacy-card__footer">
          <a href="/register" className="privacy-card__back">← Back to Registration</a>
        </footer>

      </article>
    </main>
  );
}