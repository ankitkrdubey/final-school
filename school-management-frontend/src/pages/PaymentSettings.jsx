import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, Zap, Key,
  Globe, ExternalLink, Info, 
  CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Save,
  X, Sparkles
} from 'lucide-react';

// ─── Dark-mode detector (only needed for a few accent colours) ────────────────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

// ─────────────────────────────────────────────────────────────────────────────

const PaymentGateways = () => {
  const isDark = useDarkMode();

  const [gateways, setGateways] = useState([
    { 
      id: 'stripe', 
      name: 'Stripe', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      status: 'active',
      desc: 'Optimized for international credit and debit card payments.',
      apiKey: 'sk_test_51MzS7xLkdWnZqPxL••••••••',
      pubKey: 'pk_test_51MzS7xLkdWnZqPxL••••••••',
      webhook: 'https://api.edupro.com/webhooks/stripe'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
      status: 'inactive',
      desc: 'Standard global wallet used by millions of parents worldwide.',
      clientId: 'AU_test_paypal_client_id_••••••••',
      secret: 'EEl_test_paypal_secret_key_••••••••',
      webhook: 'https://api.edupro.com/webhooks/paypal'
    },
    { 
      id: 'razorpay', 
      name: 'Razorpay', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
      status: 'active',
      desc: 'Seamless Indian payment gateway with UPI and Netbanking support.',
      apiKey: 'rzp_test_N8e3a2B1••••••••',
      secret: 'sk_test_RazorpaySecret••••••••',
      webhook: 'https://api.edupro.com/webhooks/razorpay'
    }
  ]);

  const [activeTab, setActiveTab]             = useState('stripe');
  const [showKeys, setShowKeys]               = useState(false);
  const [isTestMode, setIsTestMode]           = useState(true);
  const [formData, setFormData]               = useState({ apiKey: '', pubKey: '', webhook: '', secret: '' });
  const [isSaving, setIsSaving]               = useState(false);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [showDocModal, setShowDocModal]       = useState(false);
  const [instantRefunds, setInstantRefunds]   = useState({ stripe: false, paypal: false, razorpay: false });
  const [detailedLogging, setDetailedLogging] = useState({ stripe: true,  paypal: false, razorpay: true  });
  const [toast, setToast]                     = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const gw = gateways.find(g => g.id === activeTab);
    if (gw) setFormData({ apiKey: gw.apiKey || gw.clientId || '', pubKey: gw.pubKey || '', webhook: gw.webhook || '', secret: gw.secret || '' });
  }, [activeTab]);

  const toggleGateway = (id) => {
    setGateways(prev => prev.map(g => {
      if (g.id !== id) return g;
      const next = g.status === 'active' ? 'inactive' : 'active';
      showToast(`${g.name} Gateway ${next === 'active' ? 'activated' : 'deactivated'}.`, next === 'active' ? 'success' : 'info');
      return { ...g, status: next };
    }));
  };

  const handleSwitchMode = () => {
    const next = !isTestMode;
    setIsTestMode(next);
    showToast(`Switched to ${next ? 'TEST ENVIRONMENT' : 'LIVE PRODUCTION'} mode.`, next ? 'info' : 'success');
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    showToast(`Saving config for ${gateways.find(g => g.id === activeTab).name}...`, 'info');
    setTimeout(() => {
      setIsSaving(false);
      setGateways(prev => prev.map(g => g.id === activeTab
        ? { ...g, ...formData, clientId: formData.apiKey }
        : g
      ));
      showToast(`${gateways.find(g => g.id === activeTab).name} settings saved!`, 'success');
    }, 1800);
  };

  const handleTestEndpoint = () => {
    if (!formData.webhook) { showToast('Please enter a webhook URL first.', 'error'); return; }
    setIsTestingEndpoint(true);
    showToast('Pinging webhook gateway...', 'info');
    setTimeout(() => {
      setIsTestingEndpoint(false);
      showToast('Webhook verified! Ping: 28ms (HTTP 200 OK)', 'success');
    }, 1500);
  };

  const toggleInstantRefunds = (gwId) => {
    setInstantRefunds(prev => {
      const next = !prev[gwId];
      showToast(`${gateways.find(g => g.id === gwId).name} Instant Refunds ${next ? 'enabled' : 'disabled'}.`, 'success');
      return { ...prev, [gwId]: next };
    });
  };

  const toggleDetailedLogging = (gwId) => {
    setDetailedLogging(prev => {
      const next = !prev[gwId];
      showToast(`${gateways.find(g => g.id === gwId).name} Detailed Logging ${next ? 'enabled' : 'disabled'}.`, 'success');
      return { ...prev, [gwId]: next };
    });
  };

  // ── Shared input style uses global CSS variables ──────────────────────────
  const inputBase = {
    width: '100%',
    borderRadius: '14px',
    border: '2px solid var(--border-color)',
    backgroundColor: 'var(--bg-body)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const inputSm   = { ...inputBase, padding: '16px 56px 16px 48px' };
  const inputNarrow = { ...inputBase, padding: '16px 20px 16px 48px' };
  const inputWide   = { ...inputBase, padding: '16px 140px 16px 48px' };

  const toggleTrack = (on) => ({
    width: '40px', height: '20px', borderRadius: '20px',
    backgroundColor: on ? 'var(--primary)' : 'var(--border-color)',
    position: 'relative', transition: '0.3s', cursor: 'pointer', flexShrink: 0,
  });
  const toggleThumb = (on) => ({
    width: '16px', height: '16px', borderRadius: '50%',
    backgroundColor: 'white',
    position: 'absolute', top: '2px',
    left: on ? '22px' : '2px',
    transition: '0.3s',
  });

  // info box tint — one of the few things that can't use a single CSS var
  const infoBox    = isDark ? 'rgba(2,132,199,0.08)'  : '#f0f9ff';
  const infoBorder = isDark ? 'rgba(2,132,199,0.25)'  : '#bae6fd';
  const infoTitle  = isDark ? '#7dd3fc' : '#0c4a6e';
  const infoText   = isDark ? '#93c5fd' : '#075985';

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '8px' }}>
            Payment <span style={{ color: 'var(--primary)' }}>Gateways</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
            Configure institutional financial nodes and secure transaction channels.
          </p>
        </div>

        {/* Mode badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
          backgroundColor: isTestMode
            ? (isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7')
            : (isDark ? 'rgba(16,185,129,0.12)'  : '#ecfdf5'),
          borderRadius: '16px', border: '1px solid',
          borderColor: isTestMode ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isTestMode ? '#f59e0b' : '#10b981' }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isTestMode ? '#f59e0b' : '#10b981' }}>
            {isTestMode ? 'TEST MODE ACTIVE' : 'LIVE ENVIRONMENT'}
          </span>
          <button
            onClick={handleSwitchMode}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)', color: 'var(--text-main)',
              fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer'
            }}
          >
            SWITCH
          </button>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>

        {/* ── Left: Gateway cards ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {gateways.map((g) => (
            <motion.div
              key={g.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab(g.id)}
              style={{
                padding: '24px', borderRadius: '24px',
                backgroundColor: 'var(--bg-card)',
                border: '2px solid',
                borderColor: activeTab === g.id ? 'var(--primary)' : 'var(--border-color)',
                boxShadow: activeTab === g.id ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                cursor: 'pointer', transition: 'all 0.25s', position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  backgroundColor: 'var(--bg-body)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'
                }}>
                  <img
                    src={g.logo} alt={g.name}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 900, fontSize: '0.8rem', color: 'var(--primary)' }}>
                    {g.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{g.name}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: g.status === 'active' ? '#10b981' : 'var(--text-muted)' }}>
                    {g.status}
                  </span>
                </div>
                {/* Toggle */}
                <div
                  onClick={(e) => { e.stopPropagation(); toggleGateway(g.id); }}
                  style={toggleTrack(g.status === 'active')}
                >
                  <div style={toggleThumb(g.status === 'active')} />
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>{g.desc}</p>
            </motion.div>
          ))}

          {/* Financial Integrity panel */}
          <div style={{
            marginTop: '8px', padding: '32px', borderRadius: '32px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
          }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} color="#10b981" /> Financial Integrity
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'PCI DSS Status', value: 'COMPLIANT', color: '#10b981' },
                { label: 'Encryption',     value: 'AES-256',   color: '#f1f5f9' },
                { label: 'Global Uptime',  value: '99.99%',    color: '#06b6d4' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Configuration panel ──────────────────────────────────── */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '40px', padding: '48px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSaveSettings}>
                {/* Panel header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '20px' }}>
                      <CreditCard size={32} color="var(--primary)" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                        {gateways.find(g => g.id === activeTab).name} Configuration
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Securely manage your API keys and webhook endpoints.
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary"
                    style={{
                      padding: '12px 24px', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      opacity: isSaving ? 0.7 : 1,
                      cursor: isSaving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSaving ? <RefreshCw size={18} /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gap: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                    {/* API / Client key */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeTab === 'paypal' ? 'Client ID' : 'API Secret Key'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Key size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                        <input
                          type={showKeys ? 'text' : 'password'}
                          placeholder={activeTab === 'paypal' ? 'Enter Client ID' : 'sk_test_••••••••'}
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                          style={inputSm}
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeys(!showKeys)}
                          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Pub / Secret key */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeTab === 'stripe' ? 'Publishable Key' : 'Secret Key'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        {activeTab === 'stripe'
                          ? <Globe size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                          : <Key   size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                        }
                        <input
                          type={activeTab === 'stripe' ? 'text' : (showKeys ? 'text' : 'password')}
                          placeholder={activeTab === 'stripe' ? 'pk_test_••••••••' : 'Enter Secret Key'}
                          value={activeTab === 'stripe' ? formData.pubKey : formData.secret}
                          onChange={(e) => setFormData({ ...formData, [activeTab === 'stripe' ? 'pubKey' : 'secret']: e.target.value })}
                          style={inputNarrow}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Webhook */}
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Webhook Endpoint
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Zap size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="https://api.school.com/webhooks/gateway"
                        value={formData.webhook}
                        onChange={(e) => setFormData({ ...formData, webhook: e.target.value })}
                        style={inputWide}
                      />
                      <button
                        type="button"
                        onClick={handleTestEndpoint}
                        disabled={isTestingEndpoint}
                        style={{
                          position: 'absolute', right: '16px', top: '16px',
                          background: 'none', border: 'none',
                          color: isTestingEndpoint ? 'var(--text-muted)' : 'var(--primary)',
                          fontWeight: 800, fontSize: '0.8rem',
                          cursor: isTestingEndpoint ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isTestingEndpoint ? 'TESTING…' : 'TEST ENDPOINT'}
                      </button>
                    </div>
                  </div>

                  {/* Info box */}
                  <div style={{
                    padding: '24px', borderRadius: '24px',
                    backgroundColor: infoBox,
                    border: `1px solid ${infoBorder}`,
                    display: 'flex', gap: '20px'
                  }}>
                    <div style={{ padding: '10px', backgroundColor: isDark ? 'rgba(2,132,199,0.12)' : '#ffffff', borderRadius: '12px', color: '#0284c7', flexShrink: 0 }}>
                      <Info size={24} />
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 800, color: infoTitle }}>Integration Guidance</h5>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: infoText, lineHeight: 1.5, fontWeight: 500 }}>
                        Ensure your webhook secret is configured in environment variables to verify incoming event signatures.{' '}
                        <button
                          type="button"
                          onClick={() => { setShowDocModal(true); showToast('Opening API webhook guidelines...', 'info'); }}
                          style={{ background: 'none', border: 'none', padding: 0, color: '#0284c7', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          View Documentation <ExternalLink size={14} />
                        </button>
                      </p>
                    </div>
                  </div>

                  {/* Advanced settings */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '24px' }}>Advanced Parameters</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      {[
                        { key: 'instantRefunds',  state: instantRefunds,  toggle: toggleInstantRefunds,  label: 'Instant Refunds',   sub: 'Allow direct portal refunds.'         },
                        { key: 'detailedLogging', state: detailedLogging, toggle: toggleDetailedLogging, label: 'Detailed Logging',   sub: 'Store full API response payloads.'    },
                      ].map(({ key, state, toggle, label, sub }) => (
                        <div
                          key={key}
                          onClick={() => toggle(activeTab)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '20px', borderRadius: '16px',
                            backgroundColor: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer', transition: 'border-color 0.2s'
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{label}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</p>
                          </div>
                          <div style={toggleTrack(state[activeTab])}>
                            <div style={toggleThumb(state[activeTab])} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 24px',
              background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
              color: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxWidth: '400px'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
              color:      toast.type === 'success' ? '#34d399' : toast.type === 'error' ? '#f87171' : '#60a5fa',
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : toast.type === 'error' ? <AlertCircle size={20} /> : <Sparkles size={20} />}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', flex: 1, lineHeight: 1.4 }}>{toast.message}</p>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#94a3b8', borderRadius: '8px' }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Documentation Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDocModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDocModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '650px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '32px', padding: '40px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
                maxHeight: '85vh', overflowY: 'auto'
              }}
            >
              <button
                onClick={() => setShowDocModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '8px', backgroundColor: infoBox, borderRadius: '10px', color: '#0284c7' }}>
                  <Info size={20} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>
                  {gateways.find(g => g.id === activeTab).name} Webhook Setup
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 800, color: 'var(--text-main)' }}>1. CONFIGURE DESTINATION URL</p>
                  <p style={{ margin: 0 }}>Copy your webhook endpoint from the configuration panel and paste it into your {gateways.find(g => g.id === activeTab).name} developer dashboard under webhook subscriptions.</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 800, color: 'var(--text-main)' }}>2. SELECT EVENT TRIGGERS</p>
                  <p style={{ margin: 0 }}>Subscribe to these financial lifecycle events to keep your ledger in sync:</p>
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    {['invoice.payment_succeeded', 'invoice.payment_failed', 'charge.refunded'].map(ev => (
                      <li key={ev}>
                        <code style={{ backgroundColor: 'var(--bg-body)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{ev}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 800, color: 'var(--text-main)' }}>3. VERIFY SIGNATURES (NODE.JS / EXPRESS)</p>
                  <pre style={{
                    backgroundColor: '#0f172a', color: '#38bdf8',
                    padding: '16px', borderRadius: '16px', fontSize: '0.8rem',
                    overflowX: 'auto', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace'
                  }}>
{`app.post('/webhooks/payment', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['${activeTab === 'stripe' ? 'stripe-signature' : activeTab === 'razorpay' ? 'x-razorpay-signature' : 'paypal-transmission-sig'}'];
  const event = GatewaySDK.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
  if (event.type === 'invoice.payment_succeeded') { /* sync DB */ }
  res.json({ received: true });
});`}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => setShowDocModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: '16px', fontWeight: 900, fontSize: '0.95rem' }}
              >
                Close Integration Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentGateways;
