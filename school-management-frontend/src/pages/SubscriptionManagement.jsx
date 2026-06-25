import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, CreditCard, History, ArrowUpRight, Shield, Globe, Users, Database, Clock, Download, Plus, ChevronRight, Sparkles, Gem, BadgeCheck, X, AlertCircle } from 'lucide-react';
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

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [showMethodsModal, setShowMethodsModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { type: 'Visa', last4: '4242', expiry: '12/28', isDefault: true },
    { type: 'Mastercard', last4: '8888', expiry: '05/27', isDefault: false }
  ]);
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

  const handleAddMethod = (e) => {
    e.preventDefault();
    showToast('Secure institutional payment method has been added successfully.', 'success');
    setShowMethodsModal(false);
  };

  const currentPlan = {
    name: 'Enterprise Elite',
    status: 'Active',
    price: '₹40,000',
    billingCycle: 'Monthly',
    nextBilling: 'June 01, 2026',
    usage: [
      { label: 'Student Records', used: 4500, limit: 5000, color: '#4f46e5' },
      { label: 'Cloud Storage', used: 85, limit: 100, unit: 'GB', color: '#10b981' },
      { label: 'Faculty Licenses', used: 48, limit: 50, color: '#f59e0b' }
    ]
  };

  const history = [
    { id: 'INV-2026-004', date: 'May 01, 2026', amount: '₹40,000.00', status: 'Paid' },
    { id: 'INV-2026-003', date: 'Apr 01, 2026', amount: '₹40,000.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Mar 01, 2026', amount: '₹40,000.00', status: 'Paid' }
  ];

  const T = {
    bg:         isDark ? 'var(--bg-body)' : '#f8fafc',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border:     'var(--border-color)',
    textMain:   isDark ? '#f1f5f9' : '#0f172a',
    textMuted:  isDark ? '#94a3b8' : '#64748b',
    textDark:   isDark ? '#e2e8f0' : '#1e293b',
    bgProgress: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
  };

  return (
    <div style={{ padding: '40px', backgroundColor: T.bg, minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-1px', marginBottom: '8px' }}>Institutional Subscription</h1>
        <p style={{ color: T.textMuted, fontSize: '1.1rem', fontWeight: 500 }}>Manage your institution's license, usage quotas, and billing records.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
        {/* Current Plan Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div style={{ backgroundColor: isDark ? 'var(--bg-card)' : '#0f172a', border: isDark ? `1px solid ${T.border}` : 'none', borderRadius: '32px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.2), transparent)', zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4f46e5', marginBottom: '12px' }}>
                          <Gem size={24} />
                           <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Institutional Tier</span>
                       </div>
                       <h2 style={{ fontSize: '3rem', fontWeight: 950, margin: 0, letterSpacing: '-1.5px' }}>{currentPlan.name}</h2>
                    </div>
                    <div style={{ padding: '10px 20px', borderRadius: '14px', backgroundColor: '#10b98120', color: '#10b981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <BadgeCheck size={20} /> {currentPlan.status}
                    </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
                    <div>
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Investment</div>
                       <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{currentPlan.price} <small style={{ fontSize: '1rem', color: isDark ? 'var(--text-muted)' : '#94a3b8' }}>/mo</small></div>
                    </div>
                    <div>
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Billing Cycle</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentPlan.billingCycle}</div>
                    </div>
                    <div>
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Next Invoice</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentPlan.nextBilling}</div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={() => navigate('/dashboard/upgrade')}
                      style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                       <Zap size={20} /> Upgrade Tier
                    </button>
                    <button 
                      onClick={() => setShowMethodsModal(true)}
                      style={{ padding: '16px 32px', borderRadius: '18px', border: isDark ? '1px solid var(--border-color)' : '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                    >Manage Methods</button>
                 </div>
              </div>
           </div>

           {/* Usage Metrics */}
           <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', padding: '40px', border: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain, marginBottom: '32px' }}>Institutional Resource Quotas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 {currentPlan.usage.map((item, i) => (
                   <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontWeight: 800, color: T.textDark }}>{item.label}</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textMuted }}>
                            {item.used} / {item.limit} {item.unit || ''}
                         </span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: T.bgProgress, borderRadius: '5px', overflow: 'hidden' }}>
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(item.used / item.limit) * 100}%` }}
                           transition={{ duration: 1, delay: i * 0.2 }}
                           style={{ height: '100%', backgroundColor: item.color, borderRadius: '5px' }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Plan Lifecycle */}
           <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', padding: '40px', border: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: T.textMain, marginBottom: '24px' }}>Plan Lifecycle</h3>
              <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', backgroundColor: T.border, zIndex: 0 }}></div>
                 {[
                   { label: 'Active', date: 'May 01', status: 'Completed', color: '#10b981' },
                   { label: 'Invoice', date: 'May 25', status: 'Upcoming', color: '#64748b' },
                   { label: 'Renewal', date: 'June 01', status: 'Scheduled', color: '#4f46e5' }
                 ].map((step, i) => (
                   <div key={i} style={{ flex: 1, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: T.bgCard, border: `3px solid ${step.color}`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {step.status === 'Completed' ? <CheckCircle size={16} color={step.color} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step.color }}></div>}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 900, color: T.textMain }}>{step.label}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: T.textMuted }}>{step.date}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Side Panel: History & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           {/* Billing History */}
           <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', padding: '40px', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: T.textMain }}>Invoice History</h3>
                 <History size={20} color={T.textMuted} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {history.map((inv, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '20px', backgroundColor: T.bgRaised, border: `1px solid ${T.border}` }}>
                      <div>
                         <div style={{ fontSize: '0.85rem', fontWeight: 800, color: T.textDark }}>{inv.id}</div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMuted }}>{inv.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '0.9rem', fontWeight: 900, color: T.textMain }}>{inv.amount}</div>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                            <CheckCircle size={10} /> {inv.status}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => {
                  showToast('Redirecting to the Secure Institutional Billing Gateway...', 'info');
                  setTimeout(() => {
                    navigate('/dashboard/billing');
                  }, 1500);
                }}
                style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '16px', border: `1px solid ${T.border}`, backgroundColor: 'transparent', color: '#4f46e5', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                 View Full Billing Portal <ArrowUpRight size={18} />
              </button>
           </div>

           {/* Security Feature */}
           <div style={{ backgroundColor: '#4f46e5', borderRadius: '32px', padding: '40px', color: 'white', position: 'relative' }}>
              <Shield size={60} style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.1 }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>Enterprise Security</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '24px' }}>Your institutional financial data is secured via end-to-end PCI DSS Level 1 encryption protocols.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 800 }}>
                 <Globe size={16} /> Global Institutional Compliance
              </div>
           </div>
        </div>
      </div>

      {/* Payment Methods Modal */}
      <AnimatePresence>
        {showMethodsModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowMethodsModal(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: T.bgCard, borderRadius: '32px', padding: '48px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', border: `1px solid ${T.border}` }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: T.textMain }}>Payment Methods</h2>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <Shield size={16} color="#10b981" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Secure Gateway</span>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                   {paymentMethods.map((method, i) => (
                     <div key={i} style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, backgroundColor: T.bgRaised, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <div style={{ padding: '10px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '10px', border: `1px solid ${T.border}` }}>
                              <CreditCard size={24} color={T.textMain} />
                           </div>
                           <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: T.textDark }}>{method.type} ending in {method.last4}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMuted }}>Expires {method.expiry}</div>
                           </div>
                        </div>
                        {method.isDefault && (
                          <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#4f46e510', color: '#4f46e5', fontSize: '0.7rem', fontWeight: 900 }}>DEFAULT</span>
                        )}
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => {
                    showToast('Launching Secure Stripe Integration Portal...', 'info');
                    setTimeout(() => {
                      const newMethod = { 
                        type: 'Visa', 
                        last4: Math.floor(1000 + Math.random() * 9000).toString(), 
                        expiry: '09/29', 
                        isDefault: false 
                      };
                      setPaymentMethods([...paymentMethods, newMethod]);
                      showToast('Secure institutional payment method added successfully!', 'success');
                    }, 1500);
                  }}
                  style={{ width: '100%', padding: '18px', backgroundColor: isDark ? '#4f46e5' : '#0f172a', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: isDark ? '0 10px 20px rgba(79, 70, 229, 0.3)' : '0 10px 20px rgba(15, 23, 42, 0.2)' }}
                >
                   <Plus size={20} /> Add New Payment Method
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default SubscriptionManagement;
