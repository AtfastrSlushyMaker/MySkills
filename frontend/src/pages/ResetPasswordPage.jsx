import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import '../App.css';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: searchParams.get('email') || '',
        token: searchParams.get('token') || '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await userApi.resetPassword(form);
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Reset failed.');
            }
        }
    };

    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(59,130,246,0.08)', padding: 32, maxWidth: 400, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="https://i.ibb.co/Qv8TXgcp/myskills-logo-icon.png" alt="MySkills Logo" style={{ width: 64, marginBottom: 8 }} />
                    <h1 style={{ color: '#1E40AF', fontSize: 28, margin: 0 }}>Reset Password</h1>
                    <p style={{ color: '#6B7280', margin: '8px 0 0 0' }}>Enter your new password below</p>
                </div>
                {success ? (
                    <div style={{ color: '#16a34a', textAlign: 'center', fontWeight: 500 }}>
                        Password reset successful! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                            disabled
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                        />
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm new password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                            minLength={8}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                        />
                        {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
                        <button
                            type="submit"
                            className="app-container button"
                            style={{ width: '100%', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
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
