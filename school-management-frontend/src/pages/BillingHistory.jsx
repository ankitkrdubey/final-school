import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Search, Filter, 
  ArrowLeft, CreditCard, CheckCircle, 
  Clock, AlertCircle, History, TrendingUp,
  Receipt, Wallet, Building, Calendar, ShieldCheck,
  X, Sparkles
} from 'lucide-react';
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

const BillingHistory = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [downloadingInv, setDownloadingInv] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExportSummary = () => {
    setIsExporting(true);
    showToast('Compiling comprehensive institutional fiscal audit...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      showToast('The Institutional Financial Summary has been successfully compiled and exported.', 'success');
    }, 2500);
  };

  const handleDownloadPDF = (invId) => {
    setDownloadingInv(invId);
    showToast(`Compiling secure document for invoice ${invId}...`, 'info');
    setTimeout(() => {
      setDownloadingInv(null);
      showToast(`Invoice ${invId} has been successfully compiled and downloaded.`, 'success');
    }, 1500);
  };

  const invoices = [
    { id: 'INV-2026-006', date: 'May 10, 2026', plan: 'Enterprise Elite', amount: '$499.00', status: 'Pending', method: 'Visa ending in 4242' },
    { id: 'INV-2026-005', date: 'May 01, 2026', plan: 'Enterprise Elite', amount: '$499.00', status: 'Paid', method: 'Visa ending in 4242' },
    { id: 'INV-2026-004', date: 'Apr 01, 2026', plan: 'Enterprise Elite', amount: '$499.00', status: 'Paid', method: 'Visa ending in 4242' },
    { id: 'INV-2026-003', date: 'Mar 15, 2026', plan: 'Add-on: 500 Students', amount: '$50.00', status: 'Failed', method: 'Mastercard ending in 8888' },
    { id: 'INV-2026-002', date: 'Mar 01, 2026', plan: 'Enterprise Elite', amount: '$499.00', status: 'Paid', method: 'Mastercard ending in 8888' },
    { id: 'INV-2026-001', date: 'Feb 01, 2026', plan: 'Professional Tier', amount: '$59.00', status: 'Paid', method: 'Visa ending in 4242' }
  ];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const T = {
    bg:         isDark ? 'var(--bg-body)' : '#f8fafc',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border:     'var(--border-color)',
    textMain:   isDark ? '#f1f5f9' : '#0f172a',
    textMuted:  isDark ? '#94a3b8' : '#64748b',
    textDark:   isDark ? '#e2e8f0' : '#1e293b',
    inputBg:    isDark ? 'rgba(255,255,255,0.03)' : 'white',
    headerBg:   isDark ? 'rgba(255,255,255,0.015)' : '#f8fafc',
    activeBtnBg:isDark ? '#4f46e5' : '#0f172a',
  };

  return (
    <div style={{ padding: '40px', backgroundColor: T.bg, minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <div 
            onClick={() => navigate('/dashboard/subscription')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDark ? '#818cf8' : '#4f46e5', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '12px' }}
          >
             <ArrowLeft size={16} /> BACK TO SUBSCRIPTION
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-1.5px', marginBottom: '8px' }}>Billing Ledger</h1>
          <p style={{ color: T.textMuted, fontSize: '1.1rem', fontWeight: 500 }}>Comprehensive history of your institutional financial transactions.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <button 
             onClick={handleExportSummary}
             disabled={isExporting}
             style={{ 
               padding: '16px 24px', borderRadius: '18px', border: `1px solid ${T.border}`, 
               backgroundColor: T.bgCard, color: isExporting ? T.textMuted : T.textMain, 
               fontWeight: 800, fontSize: '0.9rem', cursor: isExporting ? 'not-allowed' : 'pointer', 
               display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' 
             }}
           >
              <Download size={18} /> {isExporting ? 'Compiling Audit...' : 'Export Financial Summary'}
           </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
         {[
           { label: 'Total Investment', value: '$2,055', icon: <TrendingUp size={20} />, color: '#4f46e5' },
           { label: 'Next Invoice', value: '$499.00', icon: <Calendar size={20} />, color: '#10b981' },
           { label: 'Billing Status', value: 'Healthy', icon: <CheckCircle size={20} />, color: '#8b5cf6' },
           { label: 'Active Method', value: 'Visa (4242)', icon: <CreditCard size={20} />, color: '#ec4899' }
         ].map((stat, i) => (
           <div key={i} style={{ backgroundColor: T.bgCard, padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <div style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>{stat.value}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {stat.icon}
              </div>
           </div>
         ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} size={18} />
            <input 
              type="text" placeholder="Search by Invoice ID (e.g. INV-2026)..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 54px', borderRadius: '18px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 600 }}
            />
         </div>
         <div style={{ display: 'flex', backgroundColor: T.bgCard, padding: '6px', borderRadius: '18px', border: `1px solid ${T.border}`, gap: '8px' }}>
            {['All', 'Paid', 'Pending', 'Failed'].map(s => (
              <button 
                key={s} onClick={() => setFilterStatus(s)}
                style={{ 
                  padding: '10px 20px', borderRadius: '14px', border: 'none',
                  backgroundColor: filterStatus === s ? T.activeBtnBg : 'transparent',
                  color: filterStatus === s ? 'white' : T.textMuted,
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s'
                }}
              >
                 {s} Transactions
              </button>
            ))}
         </div>
      </div>

      {/* Invoice Ledger */}
      <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', border: `1px solid ${T.border}`, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ backgroundColor: T.headerBg, borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>INVOICE ID</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>BILLING DATE</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>PLAN TIER</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>AMOUNT</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>STATUS</th>
                  <th style={{ padding: '24px 32px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: T.textMuted }}>ACTION</th>
               </tr>
            </thead>
            <tbody>
               {filteredInvoices.map((inv, i) => (
                 <motion.tr 
                   key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                   style={{ borderBottom: `1px solid ${T.border}` }}
                 >
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: T.bgRaised, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FileText size={16} color="#4f46e5" />
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: T.textDark }}>{inv.id}</span>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textMuted }}>{inv.date}</span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textDark }}>{inv.plan}</span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ fontSize: '0.95rem', fontWeight: 900, color: T.textMain }}>{inv.amount}</span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {inv.status === 'Paid' ? <CheckCircle size={14} color="#10b981" /> : (inv.status === 'Pending' ? <Clock size={14} color="#f59e0b" /> : <AlertCircle size={14} color="#ef4444" />)}
                          <span style={{ 
                            fontSize: '0.8rem', fontWeight: 900, 
                            color: inv.status === 'Paid' ? '#10b981' : (inv.status === 'Pending' ? '#f59e0b' : '#ef4444') 
                          }}>{inv.status}</span>
                       </div>
                       <div style={{ fontSize: '0.7rem', fontWeight: 600, color: T.textMuted, marginTop: '2px' }}>Via {inv.method}</div>
                    </td>
                    <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                       <button 
                         onClick={() => handleDownloadPDF(inv.id)}
                         disabled={downloadingInv === inv.id}
                         style={{ 
                           padding: '10px 20px', borderRadius: '12px', border: `1px solid ${T.border}`, 
                           backgroundColor: T.inputBg, color: downloadingInv === inv.id ? T.textMuted : T.textDark, 
                           fontWeight: 800, fontSize: '0.8rem', cursor: downloadingInv === inv.id ? 'not-allowed' : 'pointer', 
                           display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', transition: '0.3s' 
                         }}
                       >
                          <Download size={14} /> {downloadingInv === inv.id ? 'Compiling...' : 'PDF'}
                       </button>
                    </td>
                  </motion.tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Security Signaling */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
            <ShieldCheck size={20} color={T.textMuted} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>PCI DSS Level 1 Certified</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
            <Wallet size={20} color={T.textMuted} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>AES-256 Bit Encryption</span>
         </div>
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

export default BillingHistory;
