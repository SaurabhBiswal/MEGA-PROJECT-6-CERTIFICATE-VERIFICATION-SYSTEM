import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import ForgotPassword from './pages/ForgotPassword';
import StudentPortfolio from './pages/StudentPortfolio';
import Navbar from './components/Navbar';

import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify/:id" element={<Verify />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/student/portfolio" element={<StudentPortfolio />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}



export default App;
