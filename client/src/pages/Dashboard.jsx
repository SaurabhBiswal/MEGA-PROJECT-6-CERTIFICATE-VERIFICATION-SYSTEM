import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Users, Eye, Download, FileSpreadsheet, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, views: 0, downloads: 0, recent: [], chartData: [] });
    const [auditLogs, setAuditLogs] = useState([]);
    const [view, setView] = useState('overview'); // overview, audit
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStats();
        fetchAudit();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/stats`);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    const fetchAudit = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/audit/all`);
            setAuditLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch audit logs');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/certificates/upload`, formData);
            setMessage('Upload successful! Emails queued.');
            fetchStats();
            fetchAudit();
        } catch (err) {
            setMessage('Upload failed. Check format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto' }} className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Intelligence</h1>
                <div className="glass-card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setView('overview')} className="premium-btn" style={{ padding: '0.5rem 1rem', background: view === 'overview' ? '' : 'transparent', border: view === 'overview' ? '' : 'none' }}>Overview</button>
                    <button onClick={() => setView('audit')} className="premium-btn" style={{ padding: '0.5rem 1rem', background: view === 'audit' ? '' : 'transparent', border: view === 'audit' ? '' : 'none' }}>Audit Trail</button>
                </div>
            </div>

            {view === 'overview' ? (
                <>
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <Users color="#3b82f6" />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Total Issued</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <Eye color="#10b981" />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.views}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Verification Hits</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <Download color="#f59e0b" />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.downloads}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>PDF Downloads</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <TrendingUp color="#8b5cf6" />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.chartData?.length > 0 ? stats.chartData[stats.chartData.length - 1].count : 0}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Latest Batch</div>
                        </div>
                    </div>

                    {/* Chart & Bulk Upload */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Issuance Trends</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chartData}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="_id" stroke="var(--text-dim)" fontSize={12} />
                                        <YAxis stroke="var(--text-dim)" fontSize={12} />
                                        <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />

                                        <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}><FileSpreadsheet size={20} /> Bulk Upload</h3>
                            <form onSubmit={handleUpload}>
                                <input type="file" style={{ display: 'none' }} id="fileInput" onChange={(e) => setFile(e.target.files[0])} />
                                <label htmlFor="fileInput" style={{ display: 'block', border: '2px dashed var(--glass-border)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                                    <Upload style={{ margin: '0 auto 0.5rem' }} />
                                    {file ? file.name : "Select Excel"}
                                </label>
                                <button className="premium-btn" style={{ width: '100%' }} disabled={uploading}>{uploading ? "Processing..." : "Generate"}</button>
                                {message && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: message.includes('fail') ? '#ef4444' : '#10b981' }}>{message}</p>}
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <div className="glass-card animate-fade" style={{ padding: '2rem' }}>
                    <h3>Security Audit Trail</h3>
                    <div style={{ marginTop: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                        {auditLogs.map((log) => (
                            <div key={log._id} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#60a5fa' }}>{log.action}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{log.details}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>IP: {log.ipAddress} {log.performedBy?.email && `- ${log.performedBy.email}`}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
