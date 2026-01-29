import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, ArrowRight } from 'lucide-react';


const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/students/login`, { email, password });
            login(res.data.student, res.data.token);
            navigate('/student/portfolio');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/students/google-login`, {
                token: credentialResponse.credential
            });
            login(res.data.student, res.data.token);
            navigate('/student/portfolio');
        } catch (err) {
            setError('Google Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '6rem auto' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <User size={32} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem' }}>Student Portal</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Access your verified achievements</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Mail size={16} /> Registered Email
                        </div>
                        <input type="email" className="premium-input" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <User size={16} /> Password
                        </div>
                        <input type="password" className="premium-input" style={{ width: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        Enter Portfolio <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.8rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            theme="filled_blue"
                            shape="pill"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <Link to="/student/forgot-password" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Forgot Password?</Link>
                        <Link to="/student/register" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default StudentLogin;
