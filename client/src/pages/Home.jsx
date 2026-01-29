import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, CheckCircle, ShieldCheck } from 'lucide-react';

const Home = () => {
    const [certId, setCertId] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (certId.trim()) {
            navigate(`/verify/${certId.trim()}`);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', textAlign: 'center' }}>
            <div className="animate-fade">
                <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Verify Excellence Instantly
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    The industry standard for secure, immutable, and verifiable internship certifications.
                    Empowering organizations and students with trust.
                </p>

                <form onSubmit={handleSearch} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder="Enter Certificate ID (e.g., CH-XXXXXXX)"
                        className="premium-input"
                        style={{ flex: 1, fontSize: '1.1rem' }}
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                    />
                    <button type="submit" className="premium-btn">
                        <Search size={20} /> Verify
                    </button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '5rem' }}>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <ShieldCheck size={40} color="#2563eb" style={{ marginBottom: '1rem' }} />
                        <h3>Secure Verification</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Blockchain-inspired ID tracking for zero fraud.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <Award size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
                        <h3>Premium Design</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>High-fidelity certificates ready for printing.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <CheckCircle size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                        <h3>Instant Access</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Download and share on LinkedIn in one click.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
