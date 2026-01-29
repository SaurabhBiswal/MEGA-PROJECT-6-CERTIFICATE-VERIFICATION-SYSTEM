import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/students/forgot-password`, { email });
            setMessage('If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setMessage('If an account exists, a reset link has been sent to your email.'); // Same message for security
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '6rem auto' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>Reset Password</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Mail size={16} /> Email Address
                        </div>
                        <input type="email" className="premium-input" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {message && <p style={{ color: '#10b981', fontSize: '0.85rem', textAlign: 'center' }}>{message}</p>}

                    <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
                        Send Link <Send size={18} />
                    </button>
                </form>

                <Link to="/student/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem', textDecoration: 'none', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
