import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Download, ExternalLink, Calendar, Briefcase, Share2 } from 'lucide-react';

const StudentPortfolio = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/students/me`);
            setCerts(res.data);
        } catch (err) {
            console.error('Failed to fetch certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (id) => {
        window.open(`${import.meta.env.VITE_API_URL}/api/certificates/download/${id}`, '_blank');
    };

    const handleLinkedInShare = (cert) => {
        const url = `http://localhost:5173/verify/${cert.certificateId}`;
        const text = `I'm proud to share that I have successfully completed an internship in ${cert.internshipDomain} at CertifyHub! Verified certificate ID: ${cert.certificateId}`;
        const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + " " + url)}`;
        window.open(shareUrl, '_blank');
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Profile link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy link');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem', color: '#3b82f6' }}>Loading your achievements...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto', color: '#1e293b' }} className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1e40af', fontWeight: 800 }}>My Portfolio</h1>
                    <p style={{ color: '#64748b' }}>{certs.length} Verified Certificates</p>
                </div>
                <button onClick={handleShare} className="premium-btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#3b82f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <Share2 size={18} /> Share Profile
                </button>
            </div>

            {certs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '4rem', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)' }}>
                    <Award size={64} color="#94a3b8" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h3 style={{ color: '#334155' }}>No certificates found yet</h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Certificates appear here once they are issued by your organization.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {certs.map((cert) => (
                        <div key={cert._id} className="animate-fade" style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%' }}>
                                    <Award size={32} color="#2563eb" />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {cert.certificateId}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>Verified</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1e293b', fontWeight: 700 }}>{cert.internshipDomain}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <Briefcase size={16} /> CertifyHub Corp
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                                    <Calendar size={14} /> {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleDownload(cert.certificateId)} className="premium-btn" style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', background: '#2563eb', color: 'white', border: 'none' }}>
                                    <Download size={16} /> Download
                                </button>
                                <button onClick={() => handleLinkedInShare(cert)} className="premium-btn" style={{ background: 'white', flex: 1, padding: '0.75rem', fontSize: '0.85rem', color: '#0077b5', border: '1px solid #e2e8f0' }}>
                                    <ExternalLink size={16} /> LinkedIn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentPortfolio;
