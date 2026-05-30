import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

const Maintenance = () => {
  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: 'var(--bg-body)', padding: '24px' 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          maxWidth: '500px', textAlign: 'center', padding: '60px', 
          backgroundColor: 'var(--bg-card)', borderRadius: '32px', 
          boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          margin: '0 auto 32px' 
        }}>
          <AlertTriangle size={40} />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)' }}>System Maintenance</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          We're currently performing scheduled institutional updates. The portal will be back online shortly.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Clock size={18} /> Expected Duration: 45 Minutes
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary" 
            style={{ padding: '16px 32px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
          >
            <RefreshCw size={18} /> Refresh Page
          </button>
        </div>

        {/* Admin Link (Hidden/Subtle) */}
        <p style={{ marginTop: '40px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Administrative personnel? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }} onClick={() => {
            localStorage.setItem('maintenanceMode', 'false');
            window.location.reload();
          }}>Emergency Bypass</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;
