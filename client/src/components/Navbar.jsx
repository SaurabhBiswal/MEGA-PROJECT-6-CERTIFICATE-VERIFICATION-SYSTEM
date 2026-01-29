import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LayoutDashboard, LogOut, CheckCircle, User } from 'lucide-react';


const Navbar = () => {
    const { token, user, logout } = useContext(AuthContext); // Assuming user object contains role/type
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-card" style={{ margin: '1rem 2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#1e40af' }}>

                <CheckCircle size={32} color="#2563eb" />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>CertifyHub</span>
            </Link>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {token && user ? (
                    <>
                        <Link to={user?.email?.includes('admin') ? "/admin/dashboard" : "/student/portfolio"} className="premium-btn" style={{ padding: '0.5rem 1rem' }}>
                            <LayoutDashboard size={18} /> {user?.email?.includes('admin') ? 'Admin Panel' : 'My Portfolio'}
                        </Link>
                        <button onClick={handleLogout} className="premium-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/student/login" className="premium-btn" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <User size={18} /> Student Login
                        </Link>
                        <Link to="/admin/login" className="premium-btn">
                            <Shield size={18} /> Admin Access
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};


export default Navbar;
