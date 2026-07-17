import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../services/authService';
import './RegisterPage.css';
import { getAllColleges } from '../../services/collegeService';

const initialFormState = {
  name: '',
  email: '',
  dob: '',
  college: '',
  faculty: '',
  program: '',
  batch: '',
  registrationNumber: '',
  examRollNo: '',
  password: '',
  confirmPassword: '',
  photo: null,
};

function getPasswordStrength(password) {
  if (!password) return { label: '', width: 0 };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: 'Too weak', width: 25 },
    { label: 'Weak', width: 45 },
    { label: 'Fair', width: 65 },
    { label: 'Strong', width: 85 },
    { label: 'Excellent', width: 100 },
  ];
  return levels[score];
}

// Deterministic placeholder hash-style credential ID, shown only as a preview
// of the tamper-evident ID issued after verification.
function previewCredentialId(seed) {
  if (!seed) return '•••• •••• •••• ••••';
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hex = hash.toString(16).padStart(8, '0').toUpperCase();
  return `${hex.slice(0, 4)} ${hex.slice(4, 8)} PEND`;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [colleges,setColleges]=useState([]);
  useEffect(()=>{

    const fetchColleges=async()=>{

        try{

            const response=await getAllColleges();

            setColleges(response.data.data);

        }catch(error){

            console.log(error);

        }

    };


    fetchColleges();


},[]);
  useEffect(() => {
    if (!formData.photo) {
      setPhotoUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(formData.photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.photo]);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const credentialId = useMemo(
    () => previewCredentialId(formData.registrationNumber || formData.name),
    [formData.registrationNumber, formData.name]
  );

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] ?? null : value,
    }));
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Password and confirm password do not match.' });
      return;
    }
    if (formData.password.length < 8) {
      setStatus({ type: 'error', message: 'Use at least 8 characters, with a number and a symbol.' });
      return;
    }
    if (!agreedToTerms) {
      setStatus({ type: 'error', message: 'Please agree to the Terms & Conditions and Privacy Policy to continue.' });
      return;
    }

    const payload = {
      Name: formData.name.trim(),
      Email: formData.email.trim(),
      Password: formData.password,
      Faculty: formData.faculty.trim(),
      Program: formData.program.trim(),
      Batch: formData.batch.trim(),
      RegistrationNumber: formData.registrationNumber.trim(),
      RollNo: formData.examRollNo.trim(),
      DOB: formData.dob,
      College_Id: formData.college,
    };

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await registerStudent(payload);
      setStatus({
        type: 'success',
        message: response.data?.message || 'Signup successful. Redirecting to login...',
      });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setLoading(false);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed. Please check your details and try again.',
      });
    }
  };

  const initials = formData.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SN';

  return (
    <main className="page">
      <section className="panel">

        {/* Left: institutional context + live credential preview */}
        <aside className="hero">
          <div className="hero__content">
            <p className="eyebrow">Academic Credential Registration</p>
            <h1 className="hero__title">
              Credentials verified beyond doubt.
            </h1>
            <p className="hero__subtitle">
              Register your academic identity to issue, store, and share
              digitally signed credentials — cryptographically verifiable by
              any college or employer, instantly.
            </p>

            <ul className="trust-row">
              <li><span className="trust-row__icon" aria-hidden="true">◆</span>Digitally signed</li>
              <li><span className="trust-row__icon" aria-hidden="true">▦</span>SHA-256 hashed</li>
              <li><span className="trust-row__icon" aria-hidden="true">▣</span>QR verification</li>
            </ul>

            <div className="credential-card" aria-hidden="true">
              <div className="credential-card__top">
                <span className="credential-card__brand">DigiWallet</span>
                <span className="credential-card__tag">Academic Credential</span>
              </div>

              <div className="credential-card__body">
                <div className="credential-card__photo">
                  {photoUrl ? <img src={photoUrl} alt="" /> : <span>{initials}</span>}
                </div>
                <div className="credential-card__info">
                  <span className="credential-card__name">{formData.name || 'Student Name'}</span>
                  <span className="credential-card__college">{formData.college || 'College Name'}</span>
                  <span className="credential-card__meta">
                    {formData.faculty || 'Faculty'} · Batch {formData.batch || '—'}
                  </span>
                </div>
              </div>

              <div className="credential-card__footer">
                <div className="credential-card__ids">
                  <div>
                    <span className="credential-card__label">Reg. No.</span>
                    <span className="credential-card__value">{formData.registrationNumber || '—————'}</span>
                  </div>
                  <div>
                    <span className="credential-card__label">Roll No.</span>
                    <span className="credential-card__value">{formData.examRollNo || '————'}</span>
                  </div>
                  <div>
                    <span className="credential-card__label">Credential ID</span>
                    <span className="credential-card__value">{credentialId}</span>
                  </div>
                </div>
                <div className="credential-card__qr" role="img" aria-label="QR verification placeholder">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span key={i} className={(i * 7 + i) % 3 === 0 ? 'on' : ''} />
                  ))}
                </div>
              </div>
              <span className="credential-card__status">Pending verification</span>
            </div>
            <p className="hero__note">
              This preview updates as you complete the form. A signed credential and scannable QR are issued once your college verifies your identity.
            </p>
          </div>
        </aside>

        {/* Right: form */}
        <div className="form-wrap">
          <header className="form-header">
            <h2>Register your academic identity</h2>
            <p>Used to issue and verify your digital academic credentials. All fields are required.</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="group">
              <legend>Identity details</legend>

              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" placeholder="As it appears on your college records"
                  value={formData.name} onChange={handleChange} required />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="field">
                  <label htmlFor="dob">Date of birth</label>
                  <input id="dob" name="dob" type="date"
                    value={formData.dob} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="photo">Photo for verification</label>
                  <input id="photo" name="photo" type="file" accept="image/*"
                    onChange={handleChange} />
                  <span className="hint">Preview only for now. Photo upload will be connected after the backend upload endpoint exists.</span>
                </div>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>Academic details</legend>

              <div className="row">
                <div className="field">
                  <label htmlFor="college">College</label>
                  {/* updated because college id was null and college dashboaard couldnot identify college */}
                    <select 
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          required
                      >

                      <option value="">
                          Select College
                      </option>


                      {
                          colleges.map((college)=>(

                              <option
                                  key={college._id}
                                  value={college._id}
                              >

                                  {college.collegeName}

                              </option>

                          ))
                      }


                    </select>
                </div>
                <div className="field">
                  <label htmlFor="faculty">Faculty</label>
                  <input id="faculty" name="faculty" type="text" placeholder="e.g. Management"
                    value={formData.faculty} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="program">Program</label>
                  <select id="program" name="program" value={formData.program} onChange={handleChange} required>
                    <option value="">Select program</option>
                    <option value="Computer">Computer</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label htmlFor="batch">Batch</label>
                  <input id="batch" name="batch" type="text" placeholder="e.g. 2024"
                    value={formData.batch} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="registrationNumber">Registration number</label>
                  <input id="registrationNumber" name="registrationNumber" type="text" className="mono"
                    value={formData.registrationNumber} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="examRollNo">Exam roll no.</label>
                  <input id="examRollNo" name="examRollNo" type="text" className="mono"
                    value={formData.examRollNo} onChange={handleChange} required />
                </div>
              </div>
              <span className="hint">Cross-checked against your college's records before any credential is signed.</span>
            </fieldset>

            <fieldset className="group">
              <legend>Account security</legend>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="At least 8 characters"
                  value={formData.password} onChange={handleChange} required />
                {formData.password && (
                  <div className="strength" data-level={strength.label}>
                    <div className="strength__bar" style={{ width: `${strength.width}%` }} />
                    <span>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password"
                  value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              <span className="hint hint--secure">
                <span className="hint__icon" aria-hidden="true">🔒</span>
                Your password is hashed with bcrypt before storage. DigiWallet never stores or transmits it in plain text.
              </span>
            </fieldset>

            <div className="terms">
              <label className="terms__row" htmlFor="agreedToTerms">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  required
                />
                <svg className="terms__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M12 2.6 4.8 5.5v5.1c0 5 3.2 8.9 7.2 10.3 4-1.4 7.2-5.3 7.2-10.3V5.5L12 2.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="m8.6 12.1 2.1 2.1 4.3-4.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="terms__text">
                  I have read and agree to the{' '}
                  <span
                    className="terms__tooltip-wrap"
                   
                  >
                    <a
                      href="/terms"
                      className="terms__link"
                    >
                      Terms &amp; Conditions
                    </a>

                    
                  </span>{' '}
                  and{' '}
                  <a href="/privacy" className="terms__link">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {status.message && (
              <div className={`status status--${status.type}`} role="status">
                {status.message}
              </div>
            )}

            <button type="submit" className="submit" disabled={!agreedToTerms || loading}>
              {loading ? 'Creating account...' : 'Create secure account'}
            </button>

            <p className="fine-print">
              By registering, you consent to your academic details being encrypted, digitally signed, and made available for verification through secure QR or link sharing.
            </p>

            <p className="signin-link">
              Already registered? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
