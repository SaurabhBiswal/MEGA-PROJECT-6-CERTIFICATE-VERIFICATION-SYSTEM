import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Award, Briefcase, Calendar, CheckCircle2, User } from 'lucide-react';

const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/students/public/${id}`);
                setProfile(res.data);
            } catch (err) {
                setError('Profile not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleDownload = (certId) => {
        window.open(`${import.meta.env.VITE_API_URL}/api/certificates/download/${certId}`, '_blank');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem', color: '#3b82f6' }}>Loading profile...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '5rem', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', color: '#1e293b' }} className="animate-fade">
            {/* Header Section */}
            <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }}></div>

                <div style={{ width: '100px', height: '100px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid #3b82f6' }}>
                    <User size={48} color="#2563eb" />
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.5rem' }}>{profile.student.name}</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{profile.student.email}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '2rem', marginTop: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Verified Student
                </div>
            </div>

            {/* Certificates Grid */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#1e293b', paddingLeft: '1rem', borderLeft: '4px solid #3b82f6' }}>
                Earned Certificates ({profile.certificates.length})
            </h2>

            {profile.certificates.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8' }}>No certificates earned yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {profile.certificates.map((cert) => (
                        <div key={cert._id} className="glass-card" style={{ padding: '2rem', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <Award size={32} color="#f59e0b" />
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>{cert.certificateId}</span>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>{cert.internshipDomain}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Briefcase size={14} /> CertifyHub Corp
                            </p>

                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                <Calendar size={14} />
                                {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                            </div>

                            <button onClick={() => handleDownload(cert.certificateId)} className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                View Certificate
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicProfile;
