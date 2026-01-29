import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/students/reset-password/${token}`, { password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/student/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '6rem auto' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>Set New Password</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Create a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Lock size={16} /> New Password
                        </div>
                        <input
                            type="password"
                            className="premium-input"
                            style={{ width: '100%' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Lock size={16} /> Confirm Password
                        </div>
                        <input
                            type="password"
                            className="premium-input"
                            style={{ width: '100%' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && <div style={{ color: '#10b981', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} /> {message}</div>}
                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
