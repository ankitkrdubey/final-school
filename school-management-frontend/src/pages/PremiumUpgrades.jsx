import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Gem, Award, Check, Sparkles, ArrowRight, Shield, Globe, Users, Database, Clock, ChevronRight, Star, Target, Rocket, Box, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', sync);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', sync);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

const PremiumUpgrades = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [selectedTier, setSelectedTier] = useState('Enterprise');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const tiers = [
    {
      name: 'Starter',
      price: '₹0',
      period: '/mo',
      desc: 'Foundation for emerging institutions.',
      icon: <Box size={28} />,
      color: '#64748b',
      features: ['Up to 50 Students', 'Digital Attendance', 'Basic Gradebook', 'Email Support']
    },
    {
      name: 'Professional',
      price: '₹5,000',
      period: '/mo',
      desc: 'Advanced digital operating system.',
      icon: <Zap size={28} />,
      color: '#4f46e5',
      features: ['Unlimited Students', 'Parent Portal App', 'Online Fee Payments', '24/7 Priority Support']
    },
    {
      name: 'Enterprise',
      price: '₹40,000',
      period: '/mo',
      desc: 'Elite institutional intelligence.',
      icon: <Gem size={28} />,
      color: '#0f172a',
      popular: true,
      features: ['Multi-Campus Sync', 'AI Performance Insights', 'Dedicated Manager', 'Custom API Access']
    }
  ];

  const T = {
    bg:         isDark ? 'var(--bg-body)' : '#f8fafc',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border:     'var(--border-color)',
    textMain:   isDark ? '#f1f5f9' : '#0f172a',
    textMuted:  isDark ? '#94a3b8' : '#64748b',
    textDark:   isDark ? '#e2e8f0' : '#1e293b',
    activeBtnBg:isDark ? '#4f46e5' : '#0f172a',
  };

  return (
    <div style={{ padding: '40px', backgroundColor: T.bg, minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', backgroundColor: isDark ? 'rgba(79,70,229,0.2)' : '#4f46e510', borderRadius: '30px', color: isDark ? '#a5b4fc' : '#4f46e5', fontWeight: 800, fontSize: '0.85rem', marginBottom: '24px' }}>
            <Sparkles size={16} /> SCALE YOUR INSTITUTION
         </div>
         <h1 style={{ fontSize: '3.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-2px', lineHeight: 1, marginBottom: '16px' }}>Elevate Your Digital <br/> Operating System</h1>
         <p style={{ color: T.textMuted, fontSize: '1.2rem', fontWeight: 500, maxWidth: '700px', margin: '0 auto' }}>Select the tier that aligns with your institutional ambition. Secure advanced AI insights and global multi-campus synchronization.</p>
      </div>

      {/* Tier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1200px', margin: '0 auto 80px' }}>
         {tiers.map((tier, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             onClick={() => setSelectedTier(tier.name)}
             style={{ 
               padding: '48px 40px', borderRadius: '32px', border: tier.name === selectedTier ? `2px solid ${tier.color}` : `1px solid ${T.border}`,
               backgroundColor: T.bgCard, position: 'relative', cursor: 'pointer', transition: '0.3s',
               boxShadow: tier.name === selectedTier ? (isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.05)') : 'none'
             }}
           >
              {tier.popular && (
                <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: isDark ? '#4f46e5' : '#0f172a', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>CURRENT PLAN</div>
              )}
              
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : `${tier.color}10`, color: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                 {tier.icon}
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 950, color: T.textMain, marginBottom: '8px' }}>{tier.name}</h3>
              <p style={{ color: T.textMuted, fontSize: '0.9rem', fontWeight: 600, marginBottom: '32px' }}>{tier.desc}</p>

              <div style={{ marginBottom: '40px' }}>
                 <span style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain }}>{tier.price}</span>
                 <span style={{ color: T.textMuted, fontWeight: 700 }}>{tier.period}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                 {tier.features.map((feat, j) => (
                   <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Check size={10} color="#10b981" strokeWidth={4} />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: T.textDark }}>{feat}</span>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => {
                  if (tier.name === 'Enterprise') return;
                  showToast(`Initializing secure payment window for the ${tier.name} Tier...`, 'info');
                  setTimeout(() => {
                    showToast(`Successfully upgraded to ${tier.name} Tier! Welcome to advanced digital operations.`, 'success');
                  }, 2000);
                }}
                disabled={tier.name === 'Enterprise'}
                style={{ 
                  width: '100%', padding: '16px', borderRadius: '16px', border: tier.name === selectedTier ? 'none' : `1px solid ${T.border}`, 
                  backgroundColor: tier.name === 'Enterprise' ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (tier.name === selectedTier ? tier.color : T.bgRaised),
                  color: tier.name === 'Enterprise' ? T.textMuted : (tier.name === selectedTier ? 'white' : T.textMuted),
                  fontWeight: 900, fontSize: '0.95rem', cursor: tier.name === 'Enterprise' ? 'not-allowed' : 'pointer'
                }}
              >
                 {tier.name === 'Enterprise' ? 'Active Plan' : `Upgrade to ${tier.name}`}
              </button>
           </motion.div>
         ))}
      </div>

      {/* Comparison Matrix */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: T.bgCard, borderRadius: '32px', padding: '48px', border: `1px solid ${T.border}` }}>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain, marginBottom: '32px', textAlign: 'center' }}>Capability Matrix</h2>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: T.textMuted }}>FEATURE MODULE</th>
                  <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: T.textMuted }}>STARTER</th>
                  <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: T.textMuted }}>PRO</th>
                  <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: T.textMuted }}>ENTERPRISE</th>
               </tr>
            </thead>
            <tbody>
               {[
                 { name: 'Student Information System', s: true, p: true, e: true },
                 { name: 'AI Performance Analytics', s: false, p: 'Basic', e: 'Advanced' },
                 { name: 'Global Multi-Campus Sync', s: false, p: false, e: true },
                 { name: 'API & Developer Access', s: false, p: 'Restricted', e: 'Full' },
                 { name: 'Institutional Compliance', s: 'Standard', p: 'Advanced', e: 'ISO Certified' }
               ].map((row, i) => (
                 <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '20px', fontSize: '0.95rem', fontWeight: 700, color: T.textDark }}>{row.name}</td>
                    <td style={{ padding: '20px', textAlign: 'center', color: T.textMuted }}>{typeof row.s === 'boolean' ? (row.s ? <Check size={16} /> : '-') : row.s}</td>
                    <td style={{ padding: '20px', textAlign: 'center', color: isDark ? '#818cf8' : '#4f46e5', fontWeight: 800 }}>{typeof row.p === 'boolean' ? (row.p ? <Check size={16} /> : '-') : row.p}</td>
                    <td style={{ padding: '20px', textAlign: 'center', color: T.textMain, fontWeight: 900 }}>{typeof row.e === 'boolean' ? (row.e ? <Check size={16} /> : '-') : row.e}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(59, 130, 246, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : '#60a5fa',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumUpgrades;
