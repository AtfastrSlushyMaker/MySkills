import { useState } from 'react';
import { userApi } from '../services/api';
import { Link } from 'react-router-dom';
import '../App.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await userApi.forgotPassword({ email });
            setLoading(false);
            setSubmitted(true);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong.');
            }
        }
    };

    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(59,130,246,0.08)', padding: 32, maxWidth: 400, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="https://i.ibb.co/Qv8TXgcp/myskills-logo-icon.png" alt="MySkills Logo" style={{ width: 64, marginBottom: 8 }} />
                    <h1 style={{ color: '#1E40AF', fontSize: 28, margin: 0 }}>Forgot Password</h1>
                    <p style={{ color: '#6B7280', margin: '8px 0 0 0' }}>Enter your email to receive a reset link</p>
                </div>
                {submitted ? (
                    <div style={{ color: '#16a34a', textAlign: 'center', fontWeight: 500 }}>
                        If your email exists in our system, you will receive a password reset link.
                        <div style={{ marginTop: 24 }}>
                            <Link to="/login" style={{ color: '#1E40AF', textDecoration: 'underline' }}>Back to Login</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                        />
                        {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
                        <button
                            type="submit"
                            className="app-container button"
                            style={{ width: '100%', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <div style={{ marginTop: 18, textAlign: 'center' }}>
                            <Link to="/login" style={{ color: '#1E40AF', textDecoration: 'underline' }}>Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
