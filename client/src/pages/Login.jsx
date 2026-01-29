import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            login(res.data.user, res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '6rem auto' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Lock size={32} color="#2563eb" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Sign in to manage certificates</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Mail size={16} /> Email Address
                        </div>
                        <input
                            type="email"
                            className="premium-input"
                            style={{ width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Lock size={16} /> Password
                        </div>
                        <input
                            type="password"
                            className="premium-input"
                            style={{ width: '100%' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '2rem', fontSize: '0.85rem' }}>
                Only authorized administrators can access this section.
                Contact IT support for credentials.
            </p>
        </div>
    );
};

export default Login;
