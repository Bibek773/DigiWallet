import './TermsPage.css';

export default function TermsPage() {
  return (
    <main className="terms-page">
      <article className="terms-card">

        <header className="terms-card__header">
          <p className="eyebrow">DigiWallet Student Policy</p>
          <h1 className="terms-card__title">Terms &amp; Conditions</h1>
          <p className="terms-card__intro">
            DigiWallet is a secure academic credential platform used to issue,
            store, and verify student records. These terms govern the use of
            your DigiWallet student account and the digital academic
            credentials associated with it.
          </p>

          <dl className="terms-card__meta">
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

        <section className="terms-section">
          <p className="terms-section__label">01 — Agreement</p>
          <h2 className="terms-section__title">Acceptance of Terms</h2>
          <p>
            By creating a DigiWallet account, you confirm that you have read
            and agree to these Terms &amp; Conditions. If you do not agree,
            please do not register for or use the platform.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">02 — Your Obligations</p>
          <h2 className="terms-section__title">User Responsibilities</h2>
          <p>As a registered student, you agree to:</p>
          <ul className="terms-list">
            <li>Provide accurate and truthful information during registration and account use.</li>
            <li>Protect your login credentials and avoid sharing your password with others.</li>
            <li>Avoid impersonating another student, faculty member, or institution.</li>
            <li>Avoid uploading false, altered, or misleading academic information.</li>
          </ul>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">03 — Personal Data</p>
          <h2 className="terms-section__title">Privacy</h2>
          <p>Your personal and academic information is used only for:</p>
          <ul className="terms-list">
            <li>Creating and maintaining your student account.</li>
            <li>Issuing digitally signed academic credentials.</li>
            <li>Verifying credentials on your behalf when requested.</li>
          </ul>
          <p>
            DigiWallet does not intentionally share student data with
            unauthorized third parties.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">04 — Protection Measures</p>
          <h2 className="terms-section__title">Data Security</h2>
          <p>
            DigiWallet applies password hashing, secure authentication, and
            encrypted communication to protect your account and academic
            records. These are reasonable security measures appropriate to a
            university project, but no system can guarantee absolute
            security, and DigiWallet cannot promise uninterrupted or
            error-free protection at all times.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">05 — Credential Integrity</p>
          <h2 className="terms-section__title">Credential Verification</h2>
          <p>
            Academic credentials issued through DigiWallet may be digitally
            verified by colleges, employers, or other authorized parties.
            Attempting to forge, alter, tamper with, or otherwise misuse a
            credential issued through this platform is strictly prohibited.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">06 — Ownership</p>
          <h2 className="terms-section__title">Intellectual Property</h2>
          <p>
            The DigiWallet name, branding, interface, source code, and
            overall design remain the intellectual property of the project
            creators. Students retain ownership of their own academic
            information at all times.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">07 — Enforcement</p>
          <h2 className="terms-section__title">Account Suspension</h2>
          <p>Your account may be suspended if you:</p>
          <ul className="terms-list">
            <li>Submit fraudulent or falsified information.</li>
            <li>Misuse the platform or its verification systems.</li>
            <li>Violate any part of these Terms &amp; Conditions.</li>
          </ul>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">08 — Disclaimer</p>
          <h2 className="terms-section__title">Limitation of Liability</h2>
          <p>
            DigiWallet is developed as a university project. While reasonable
            efforts are made to protect your information and maintain the
            platform, DigiWallet cannot guarantee uninterrupted service or
            absolute security, and is not liable for damages arising from
            use of the platform beyond what is reasonably expected of an
            academic project.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">09 — Updates</p>
          <h2 className="terms-section__title">Changes to Terms</h2>
          <p>
            The project team may update these terms when necessary. Continued
            use of DigiWallet after changes are published indicates your
            acceptance of the updated terms.
          </p>
        </section>

        <hr className="terms-divider" />

        <section className="terms-section">
          <p className="terms-section__label">10 — Reach Us</p>
          <h2 className="terms-section__title">Contact Information</h2>
          <p>For questions regarding these terms, please contact:</p>
          <dl className="terms-contact">
            <div>
              <dt>Email</dt>
              <dd>support@digiwallet.edu</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>Department of Computer Engineering</dd>
            </div>
            <div>
              <dt>University</dt>
              <dd>Your University Name</dd>
            </div>
          </dl>
          <p className="terms-contact__note">Contact details will be replaced with official information before launch.</p>
        </section>

        <div className="terms-notice">
          <p className="terms-notice__title">Important Notice</p>
          <p>
            By registering for DigiWallet, you acknowledge that you have
            read, understood, and agreed to these Terms &amp; Conditions
            before creating your account.
          </p>
        </div>

        <footer className="terms-card__footer">
          <a href="/register" className="terms-card__back">← Back to Registration</a>
        </footer>

      </article>
    </main>
  );
}