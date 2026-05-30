import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Save, Lock, Eye, Settings, Database, Server, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PermissionsLogic = () => {
  const [activeTab, setActiveTab] = useState('Core Modules');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [viewingModule, setViewingModule] = useState(null);
  const [configuringModule, setConfiguringModule] = useState(null);

  const modules = [
    { 
      id: 'attendance', 
      name: 'Attendance Management', 
      category: 'Core Modules', 
      roles: ['Admin', 'Teacher', 'Staff'],
      config: { readOnly: false, masking: true, export: true, api: false }
    },
    { 
      id: 'fees', 
      name: 'Fee & Financials', 
      category: 'Financials', 
      roles: ['Admin', 'Staff'],
      config: { readOnly: false, masking: true, export: false, api: false }
    },
    { 
      id: 'exams', 
      name: 'Examination Engine', 
      category: 'Academics', 
      roles: ['Admin', 'Teacher'],
      config: { readOnly: false, masking: false, export: true, api: true }
    },
    { 
      id: 'library', 
      name: 'Library Operations', 
      category: 'Core Modules', 
      roles: ['Admin', 'Staff', 'Student'],
      config: { readOnly: true, masking: false, export: false, api: false }
    },
    { 
      id: 'transport', 
      name: 'Transport & Fleet', 
      category: 'Logistics', 
      roles: ['Admin', 'Staff'],
      config: { readOnly: false, masking: false, export: true, api: false }
    },
    { 
      id: 'security', 
      name: 'Institutional Security', 
      category: 'Administration', 
      roles: ['Admin'],
      config: { readOnly: false, masking: true, export: false, api: true }
    },
    { 
      id: 'audit', 
      name: 'Audit Logs', 
      category: 'Administration', 
      roles: ['Admin'],
      config: { readOnly: true, masking: true, export: true, api: false }
    },
  ];

  const roles = ['Admin', 'Teacher', 'Staff', 'Student'];
  const categories = ['Core Modules', 'Financials', 'Academics', 'Logistics', 'Administration'];

  const [modulesState, setModulesState] = useState(() => {
    const saved = localStorage.getItem('edupro_permissions_matrix');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved permissions matrix", e);
      }
    }
    return modules;
  });

  const [tempConfig, setTempConfig] = useState({
    readOnly: false,
    masking: false,
    export: false,
    api: false
  });

  const activeViewingModule = viewingModule ? modulesState.find(m => m.id === viewingModule.id) : null;
  const activeConfiguringModule = configuringModule ? modulesState.find(m => m.id === configuringModule.id) : null;

  useEffect(() => {
    if (activeConfiguringModule) {
      setTempConfig(activeConfiguringModule.config || {
        readOnly: false,
        masking: false,
        export: false,
        api: false
      });
    }
  }, [activeConfiguringModule]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      localStorage.setItem('edupro_permissions_matrix', JSON.stringify(modulesState));
      triggerToast('Security architecture deployed successfully to all live services!', 'success');
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Security Matrix Logic</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Global permission mapping across all institutional modules and user roles.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', borderRadius: '16px', fontWeight: 800, minWidth: '180px', justifyContent: 'center' }}
        >
          {isSaving ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Rebuilding...
            </>
          ) : (
            <>
              <Save size={18} /> Deploy Logic
            </>
          )}
        </button>
      </div>

      {/* Premium Glassmorphic Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1300,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff', 
              padding: '18px 28px',
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)', 
              fontWeight: 800,
              fontSize: '0.95rem'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              backgroundColor: toast.type === 'success' ? 'rgba(40, 167, 69, 0.15)' : toast.type === 'info' ? 'var(--primary-light)' : 'rgba(245, 158, 11, 0.15)',
              color: toast.type === 'success' ? '#28a745' : toast.type === 'info' ? 'var(--primary)' : '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <Shield size={18} /> : toast.type === 'info' ? <Zap size={18} /> : <Settings size={18} />}
            </div>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              style={{
                background: 'none', border: 'none', color: '#cbd5e1', 
                cursor: 'pointer', padding: '4px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{ 
              padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer',
              backgroundColor: activeTab === cat ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === cat ? 'white' : 'var(--text-muted)',
              whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              transform: activeTab === cat ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== cat) e.currentTarget.style.backgroundColor = 'var(--bg-body)';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== cat) e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '24px 32px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', width: '300px' }}>MODULE IDENTIFIER</th>
              {roles.map(role => (
                <th key={role} style={{ padding: '24px 32px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center' }}>{role.toUpperCase()}</th>
              ))}
              <th style={{ padding: '24px 32px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {modulesState.filter(m => m.category === activeTab).map((module, idx) => (
              <tr key={module.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={{ padding: '24px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{module.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {module.id.toUpperCase()}_SYSTEM_v1</div>
                    </div>
                  </div>
                </td>
                {roles.map(role => {
                  const hasPermission = module.roles.includes(role);
                  return (
                    <td key={role} style={{ padding: '24px 32px', textAlign: 'center' }}>
                      <div 
                        onClick={() => {
                          const updatedRoles = hasPermission 
                            ? module.roles.filter(r => r !== role)
                            : [...module.roles, role];
                          setModulesState(prev => prev.map(m => m.id === module.id ? { ...m, roles: updatedRoles } : m));
                          triggerToast(`Toggled ${role} permission for ${module.name}`, 'info');
                        }}
                        style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', margin: '0 auto',
                          backgroundColor: hasPermission ? 'var(--success-light)' : 'var(--danger-light)',
                          color: hasPermission ? 'var(--success)' : 'var(--danger)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          transition: 'transform 0.2s, background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {hasPermission ? <Check size={20} strokeWidth={3} /> : <Lock size={18} strokeWidth={3} />}
                      </div>
                    </td>
                  );
                })}
                <td style={{ padding: '24px 32px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button 
                      className="btn" onClick={() => setViewingModule(module)}
                      style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="btn" onClick={() => setConfiguringModule(module)}
                      style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Settings size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { icon: <Server size={24} />, title: 'Infrastructure Rules', desc: 'Current security protocol: RBAC (Role Based Access Control) v2.4', color: '#6366F1' },
          { icon: <Zap size={24} />, title: 'Real-time Sync', desc: 'Changes are pushed to live sessions across all endpoints instantly.', color: '#10B981' },
          { icon: <Lock size={24} />, title: 'Encryption Logic', desc: 'Permission tokens are hashed using SHA-256 before distribution.', color: '#F59E0B' },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="card" 
            style={{ 
              padding: '32px', display: 'flex', alignItems: 'flex-start', gap: '20px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: `${item.color}15`, color: item.color }} id={`rule-card-icon-${idx}`}>{item.icon}</div>
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '4px', color: 'var(--text-main)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Insight Drawer */}
      <AnimatePresence>
        {activeViewingModule && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingModule(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '480px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '48px', position: 'relative', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ marginBottom: '40px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Eye size={28} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Module Insights</h2>
                <p style={{ color: 'var(--text-muted)' }}>Technical audit and permission inheritance for <strong>{activeViewingModule.name}</strong>.</p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Technical Metadata</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Module ID', value: `${activeViewingModule.id.toUpperCase()}_SYS_v1` },
                      { label: 'Namespace', value: `edupro.core.${activeViewingModule.category.toLowerCase().replace(' ', '_')}` },
                      { label: 'Security Schema', value: 'Level 4: Institutional' },
                      { label: 'Inheritance', value: 'Active (Global Tiers)' }
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{item.label}</span>
                        <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-main)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Access Distribution</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeViewingModule.roles.length > 0 ? (
                      activeViewingModule.roles.map(role => (
                        <div key={role} style={{ padding: '8px 16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
                          {role}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={16} /> NO ACTIVE ROLES (LOCKED)
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Active Logic Policies</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Read-Only Access', active: activeViewingModule.config?.readOnly },
                      { label: 'Sensitive Data Masking', active: activeViewingModule.config?.masking },
                      { label: 'Export Authority', active: activeViewingModule.config?.export },
                      { label: 'API Endpoint Exposure', active: activeViewingModule.config?.api }
                    ].map(policy => (
                      <div key={policy.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{policy.label}</span>
                        <span style={{ 
                          fontWeight: 800, 
                          color: policy.active ? 'var(--success)' : 'var(--text-muted)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {policy.active ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                          {policy.active ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <button className="btn btn-primary" onClick={() => setViewingModule(null)} style={{ marginTop: '40px', padding: '16px', borderRadius: '16px', fontWeight: 800 }}>
                Close Insight
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Module Configuration Drawer */}
      <AnimatePresence>
        {activeConfiguringModule && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfiguringModule(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '480px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '48px', position: 'relative', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ marginBottom: '40px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F59E0B15', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Settings size={28} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Logic Configuration</h2>
                <p style={{ color: 'var(--text-muted)' }}>Fine-tune security rules and access constraints for <strong>{activeConfiguringModule.name}</strong>.</p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { key: 'readOnly', label: 'Read-Only Access', desc: 'Prevent any data mutations within this module.' },
                  { key: 'masking', label: 'Sensitive Data Masking', desc: 'Hide PII and financial records from non-admins.' },
                  { key: 'export', label: 'Export Authority', desc: 'Allow users to generate CSV/PDF reports.' },
                  { key: 'api', label: 'API Endpoint Exposure', desc: 'Enable external integration for this logic.' }
                ].map((item, i) => {
                  const isChecked = tempConfig[item.key];
                  return (
                    <div key={item.key} style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{item.label}</span>
                        <div 
                          onClick={() => setTempConfig(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          style={{ 
                            width: '44px', height: '24px', borderRadius: '20px', 
                            backgroundColor: isChecked ? 'var(--primary)' : 'var(--border-color)', 
                            position: 'relative', cursor: 'pointer', transition: '0.3s' 
                          }}
                        >
                          <div style={{ 
                            width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', 
                            position: 'absolute', left: isChecked ? '23px' : '3px', top: '3px', transition: '0.3s' 
                          }} />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="btn" onClick={() => setConfiguringModule(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }}>Discard</button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => { 
                    setModulesState(prev => prev.map(m => m.id === activeConfiguringModule.id ? { ...m, config: tempConfig } : m));
                    triggerToast(`Configuration for ${activeConfiguringModule.name} applied successfully!`, 'success');
                    setConfiguringModule(null); 
                  }}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }}
                >
                  Apply Logic
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PermissionsLogic;
