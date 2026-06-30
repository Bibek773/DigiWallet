import { useState } from 'react';

const initialFormState = {
    name: '',
    batch: '',
    faculty: '',
    registrationNumber: '',
    examRollNo: '',
    college: '',
    password: '',
    confirmPassword: '',
    dob: '',
    photo: null,
};

export default function RegisterPage() {
    const [formData, setFormData] = useState(initialFormState);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value, files, type } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'file' ? files?.[0] ?? null : value,
        }));

        if (error) {
            setError('');
        }
        if (message) {
            setMessage('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirm password do not match.');
            setMessage('');
            return;
        }

        setError('');
        setMessage('Registration form is ready. Connect this form to the backend register API next.');
    };

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            background:
                'radial-gradient(circle at top left, rgba(28, 107, 255, 0.24), transparent 28%), radial-gradient(circle at top right, rgba(25, 195, 125, 0.18), transparent 24%), linear-gradient(135deg, #0b1220 0%, #101a33 48%, #0f172a 100%)',
            color: '#e5eefc',
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        card: {
            width: '100%',
            maxWidth: '920px',
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: '0',
            borderRadius: '28px',
            overflow: 'hidden',
            background: 'rgba(10, 16, 32, 0.72)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(18px)',
        },
        hero: {
            padding: '40px',
            background:
                'linear-gradient(160deg, rgba(59, 130, 246, 0.24), rgba(15, 23, 42, 0.08)), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
            borderRight: '1px solid rgba(148, 163, 184, 0.14)',
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.16)',
            color: '#bfdbfe',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '20px',
        },
        title: {
            margin: 0,
            fontSize: 'clamp(32px, 4vw, 54px)',
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
        },
        subtitle: {
            marginTop: '16px',
            marginBottom: '28px',
            color: '#cbd5e1',
            lineHeight: 1.7,
            maxWidth: '30rem',
        },
        points: {
            display: 'grid',
            gap: '14px',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            color: '#dbeafe',
        },
        point: {
            padding: '14px 16px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
        },
        formWrap: {
            padding: '40px',
            background: 'rgba(15, 23, 42, 0.88)',
        },
        formTitle: {
            margin: 0,
            fontSize: '24px',
            lineHeight: 1.2,
        },
        formText: {
            margin: '10px 0 28px',
            color: '#94a3b8',
            lineHeight: 1.6,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '16px',
        },
        field: {
            display: 'grid',
            gap: '8px',
        },
        label: {
            fontSize: '13px',
            color: '#cbd5e1',
            fontWeight: 600,
        },
        input: {
            width: '100%',
            borderRadius: '14px',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: 'rgba(2, 6, 23, 0.72)',
            color: '#f8fafc',
            padding: '14px 16px',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxSizing: 'border-box',
        },
        full: {
            gridColumn: '1 / -1',
        },
        actions: {
            display: 'grid',
            gap: '14px',
            marginTop: '24px',
        },
        button: {
            border: 'none',
            borderRadius: '14px',
            padding: '15px 18px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
            color: 'white',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 18px 36px rgba(37, 99, 235, 0.28)',
        },
        footer: {
            marginTop: '16px',
            color: '#94a3b8',
            fontSize: '14px',
            textAlign: 'center',
        },
        status: {
            marginTop: '18px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: error ? 'rgba(220, 38, 38, 0.14)' : 'rgba(22, 163, 74, 0.14)',
            color: error ? '#fecaca' : '#bbf7d0',
            border: error ? '1px solid rgba(248, 113, 113, 0.35)' : '1px solid rgba(74, 222, 128, 0.25)',
            minHeight: '20px',
        },
    };

    return (
        <main style={styles.page}>
            <section style={styles.card}>
                <aside style={styles.hero}>
                    <div style={styles.badge}>Student registration</div>
                    <h1 style={styles.title}>Create your DigiWallet account</h1>
                    <p style={styles.subtitle}>
                        Register with your academic details, upload your profile photo, and set a secure password for wallet access.
                    </p>
                    <ul style={styles.points}>
                        <li style={styles.point}>Use your official registration number and exam roll number.</li>
                        <li style={styles.point}>Keep the password and confirm password values identical.</li>
                        <li style={styles.point}>Upload a clear passport-style photo for identity verification.</li>
                    </ul>
                </aside>

                <div style={styles.formWrap}>
                    <h2 style={styles.formTitle}>Register student details</h2>
                    <p style={styles.formText}>Fill in the form below to continue with account creation.</p>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.grid}>
                            <div style={styles.field}>
                                <label htmlFor="name" style={styles.label}>Name</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="batch" style={styles.label}>Batch</label>
                                <input id="batch" name="batch" type="text" value={formData.batch} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="faculty" style={styles.label}>Faculty</label>
                                <input id="faculty" name="faculty" type="text" value={formData.faculty} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="registrationNumber" style={styles.label}>Registration Number</label>
                                <input id="registrationNumber" name="registrationNumber" type="text" value={formData.registrationNumber} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="examRollNo" style={styles.label}>Exam Roll No</label>
                                <input id="examRollNo" name="examRollNo" type="text" value={formData.examRollNo} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="college" style={styles.label}>College</label>
                                <input id="college" name="college" type="text" value={formData.college} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="dob" style={styles.label}>Date of Birth</label>
                                <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={styles.field}>
                                <label htmlFor="photo" style={styles.label}>Passport Photo</label>
                                <input id="photo" name="photo" type="file" accept="image/*" onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={{ ...styles.field, ...styles.full }}>
                                <label htmlFor="password" style={styles.label}>Password</label>
                                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} required />
                            </div>

                            <div style={{ ...styles.field, ...styles.full }}>
                                <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <button type="submit" style={styles.button}>Create Account</button>
                            <div style={styles.status}>{error || message || 'All fields are required before submission.'}</div>
                        </div>
                    </form>

                    <p style={styles.footer}>Use the same details your college issued for verification.</p>
                </div>
            </section>
        </main>
    );
}
