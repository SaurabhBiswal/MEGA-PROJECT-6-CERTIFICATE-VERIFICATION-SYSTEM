import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, ArrowRight, Lock } from 'lucide-react';

const StudentRegister = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/students/register`, formData);
            if (res.status === 200 || res.status === 201) {
                alert(res.data.message || 'Account ready! Please login.');
                navigate('/student/login');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Registration failed';
            setError(errorMsg);
        }

    };


    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>Join CertifyHub</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Create your student account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <User size={16} /> Full Name
                        </div>
                        <input type="text" className="premium-input" style={{ width: '100%' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Mail size={16} /> Email Address
                        </div>
                        <input type="email" className="premium-input" style={{ width: '100%' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Lock size={16} /> Password
                        </div>
                        <input type="password" className="premium-input" style={{ width: '100%' }} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    Already have an account? <Link to="/student/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default StudentRegister;
