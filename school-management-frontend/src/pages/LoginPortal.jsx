import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/service';

const LoginPortal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session and redirect to the login page
    logout();
    const timer = setTimeout(() => {
      navigate('/login', { state: { showLogoutToast: true } });
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f1f5f9', 
          borderTopColor: '#4f46e5', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ fontWeight: 700, color: '#64748b' }}>Redirecting to Secure Login Portal...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPortal;
