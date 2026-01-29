import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, ExternalLink, User, Calendar, Briefcase, CheckCircle2, Award } from 'lucide-react';

const Verify = () => {
    const { id } = useParams();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCert = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/certificates/verify/${id}`);
                setCert(res.data);
            } catch (err) {
                setError('Certificate not found or invalid ID');
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [id]);

    const handleDownload = () => {

        window.open(`${import.meta.env.VITE_API_URL}/api/certificates/download/${id}`, '_blank');
    };

    const handleLinkedInShare = () => {
        const text = `Verified Certificate: I've completed an internship in ${cert.internshipDomain} at CertifyHub! ID: ${cert.certificateId}`;
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem', color: '#3b82f6' }}>Loading verification data...</div>;
    if (error) return <div className="glass-card" style={{ maxWidth: '500px', margin: '5rem auto', padding: '3rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '4rem auto', color: '#1e293b' }} className="animate-fade">
            <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', background: 'white' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <CheckCircle2 size={40} color="#10b981" />
                    <div>
                        <h2 style={{ fontSize: '2rem', color: '#1e40af' }}>Verified Certificate</h2>
                        <span style={{ color: '#64748b' }}>Certificate ID: {cert.certificateId}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            <User size={18} /> Student Name
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{cert.studentName}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            <Briefcase size={18} /> Domain
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{cert.internshipDomain}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            <Calendar size={18} /> Tenure
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                            {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            <Award size={18} /> Status
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#10b981' }}>Active & Genuine</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleDownload} className="premium-btn" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }}>
                        <Download size={20} /> Download PDF
                    </button>
                    <button onClick={handleLinkedInShare} className="premium-btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#0077b5', flex: 1, padding: '1rem', justifyContent: 'center' }}>
                        <ExternalLink size={20} /> Share on LinkedIn
                    </button>
                </div>


                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <img src={cert.qrCode} alt="Verification QR" style={{ width: '120px', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }} />
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Scan to verify on mobile</p>
                </div>
            </div>
        </div>
    );
};

export default Verify;
