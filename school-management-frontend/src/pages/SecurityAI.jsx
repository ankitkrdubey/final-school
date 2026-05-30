import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Eye, AlertCircle, 
  Terminal, Database, Wifi, Fingerprint,
  Zap, Activity, ChevronRight, Bell, X,
  CheckCircle2, RefreshCw, Sparkles, Plus, Printer, Sliders, MessageSquare, Award, Shield, Search
} from 'lucide-react';

const SecurityAI = () => {
  // 1. Dynamic Local Security Incidents Database
  const [incidents, setIncidents] = useState([
    { id: 'data_access', type: 'Data Access', severity: 'High', status: 'Blocked', time: '12m ago', desc: 'Unauthorized attempted access to Student Records', ip: '192.168.4.120', node: 'Main Registry Rack A' },
    { id: 'network_sync', type: 'Network Sync', severity: 'Medium', status: 'Auditing', time: '1h ago', desc: 'Unusual egress traffic spike detected in Main Server Zone', ip: '10.0.8.54', node: 'Central Gateway Switch' },
    { id: 'physical_sec', type: 'Physical Security', severity: 'Low', status: 'Cleared', time: '3h ago', desc: 'Zone 4 Smart-Lock recalibration successful', ip: '192.168.12.15', node: 'Entrance Portal Smart-Lock' },
  ]);

  // Derived & Config States
  const [threatIndex, setThreatIndex] = useState(0.02);
  const [dataIntegrity, setDataIntegrity] = useState(100);
  const [complianceScore, setComplianceScore] = useState(98.4);
  const [activeMonitors, setActiveMonitors] = useState(1420);
  const [firewallLevel, setFirewallLevel] = useState('Active Guard'); // 'Passive' | 'Active Guard' | 'Max Isolation'
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [isDataRehashing, setIsDataRehashing] = useState(false);

  // 2. Active Recommendations
  const [recommendations, setRecommendations] = useState([
    {
      id: 'rotate_keys',
      title: 'Rotate Admin Access Keys',
      desc: 'Predictive model suggests rotating Admin access keys every 14 days based on identified regional breach patterns.',
      status: 'Pending',
      actionLabel: 'Rotate Access Keys'
    }
  ]);

  // 3. Search & Modals State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  // 'audit' | 'ssl_cert' | 'diagnostics' | 'integrity_calibration' | 'compliance_checklist' | 'incident_detail' | null
  const [selectedIncident, setSelectedIncident] = useState(null);

  // 4. Immersive Auditing Simulator State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  // 5. Toast Feedback
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const AUDIT_STEPS = [
    "Establishing secure SSH tunnels to all 24 global nodes...",
    "Scanning network monitors for anomalies...",
    "Testing smart locks encryption coefficients...",
    "Validating SSL/TLS certificates expiration profiles...",
    "Data integrity check (SHA-256 seal confirmed)...",
    "Running penetrative firewall stress simulations...",
    "System compliance scores recalibrated successfully!"
  ];

  // Audit Loop Effect
  useEffect(() => {
    if (!isAuditing) return;
    const interval = setInterval(() => {
      setAuditStep(prev => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setThreatIndex(0.01);
            setDataIntegrity(100);
            setComplianceScore(99.4);
            setIsAuditing(false);
            setActiveModal(null);
            triggerToast("Deep Core Security Audit successfully completed!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isAuditing]);

  // Handle single recommendation optimizations
  const applyKeyRotation = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      setComplianceScore(99.9);
      setRecommendations(prev => prev.map(r => r.id === 'rotate_keys' ? { ...r, status: 'Rotated & Secured' } : r));
      setIsRotatingKeys(false);
      triggerToast("Admin access keys rotated! Compliance score maximized.", "success");
    }, 1800);
  };

  // Block selected IP
  const handleBlockIncidentIP = (incident) => {
    setIncidents(prev => prev.map(inItem => {
      if (inItem.id === incident.id) {
        return { ...inItem, status: 'Blocked', severity: 'Low' };
      }
      return inItem;
    }));
    setThreatIndex(prev => Math.max(0.01, prev - 0.01));
    triggerToast(`Network Node IP ${incident.ip} has been successfully blacklisted!`, "success");
    setSelectedIncident(null);
    setActiveModal(null);
  };

  // Data Integrity Re-Hash
  const handleDataRehash = () => {
    setIsDataRehashing(true);
    setTimeout(() => {
      setDataIntegrity(100);
      setIsDataRehashing(false);
      triggerToast("Data database blocks successfully re-hashed and verified!", "success");
      setActiveModal(null);
    }, 1800);
  };

  // Filter incidents by search query
  const filteredIncidents = incidents.filter(inItem => 
    inItem.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inItem.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inItem.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative' }}>
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              right: '24px', 
              zIndex: 99999, 
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '16px 24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#ef444425',
              color: toast.type === 'success' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Telemetry Success' : 'Security Alert'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</div>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '12px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ef444415', borderRadius: '30px', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <ShieldCheck size={16} /> NEURAL SECURITY OVERWATCH
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Security <span style={{ color: '#ef4444' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Real-time threat detection and autonomous compliance auditing.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <div 
             onClick={() => setActiveModal('ssl_cert')}
             style={{ padding: '16px 24px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
           >
              <Lock size={20} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>SSL/ENC STABLE</span>
           </div>
           <button 
             onClick={() => {
               setIsAuditing(true);
               setAuditStep(0);
               setActiveModal('audit');
             }}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-md)' }}
           >
              <Fingerprint size={18} /> Deep Core Audit
           </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { key: 'threat', label: 'Threat Index', value: threatIndex, status: threatIndex < 0.05 ? 'Safe' : 'Active Breach', color: '#10b981', tag: 'THREATS' },
          { key: 'integrity', label: 'Data Integrity', value: `${dataIntegrity}%`, status: dataIntegrity === 100 ? 'Verified' : 'Re-hash Req', color: '#6366f1', tag: 'DATABASE' },
          { key: 'compliance', label: 'Compliance Score', value: `${complianceScore}%`, status: complianceScore >= 98 ? 'Compliant' : 'Warning', color: '#10b981', tag: 'FERPA' },
          { key: 'monitors', label: 'Active Monitors', value: activeMonitors.toLocaleString(), status: 'Live', color: '#f59e0b', tag: 'OVERWATCH' },
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => setActiveModal(stat.key === 'threat' ? 'diagnostics' : stat.key === 'integrity' ? 'integrity_calibration' : stat.key === 'compliance' ? 'compliance_checklist' : 'diagnostics')}
            style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
               <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '8px', backgroundColor: `${stat.color}15`, color: stat.color, fontWeight: 900 }}>{stat.tag}</span>
               <div style={{ padding: '4px 8px', borderRadius: '8px', backgroundColor: `${stat.color}15`, color: stat.color, fontSize: '0.65rem', fontWeight: 900 }}>{stat.status}</div>
             </div>
             <div style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Incident Logs Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden', gridColumn: 'span 2' }}>
           <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Neural Security Logs</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-body)', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <Search size={16} color="var(--text-muted)" />
                  <input 
                    type="text"
                    placeholder="Filter incidents..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.8rem', width: '130px' }}
                  />
                </div>
              </div>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredIncidents.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active incidents recorded.
                </div>
              ) : (
                filteredIncidents.map((incident, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedIncident(incident);
                      setActiveModal('incident_detail');
                    }}
                    style={{ 
                      padding: '24px 32px', 
                      borderBottom: i === filteredIncidents.length - 1 ? 'none' : '1px solid var(--border-color)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: incident.severity === 'High' ? '#ef444415' : incident.severity === 'Medium' ? '#f59e0b15' : '#10b98115', color: incident.severity === 'High' ? '#ef4444' : incident.severity === 'Medium' ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <AlertCircle size={20} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 850, fontSize: '0.95rem', color: 'var(--text-main)' }}>{incident.type}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{incident.desc}</div>
                        </div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>{incident.time}</div>
                        <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: incident.status === 'Blocked' ? '#ef444415' : '#10b98115', color: incident.status === 'Blocked' ? '#ef4444' : '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>{incident.status.toUpperCase()}</div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Compliance Audit & Recommendations */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', gap: '24px', justifySelf: 'stretch', boxShadow: 'var(--shadow-md)' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={20} color="#ef4444" /> Compliance Audit
           </h3>
           
           <div style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: '24px', padding: '24px', border: '1px solid #334155' }}>
              {[
                { label: 'Data Encryption', val: '100%', ok: true },
                { label: 'Role Access Guard', val: 'Verified', ok: true },
                { label: 'Threat Neutralization', val: 'Active', ok: true },
                { label: 'FERPA Alignment', val: 'Stable', ok: true },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                   <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{c.label}</div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 900, color: c.ok ? '#10b981' : '#ef4444' }}>{c.val}</div>
                </div>
              ))}
              
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #334155' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Zap size={18} color="#ef4444" />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Neural Recommendation</div>
                 </div>
                 
                 {recommendations[0].status === 'Pending' ? (
                   <div>
                     <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>{recommendations[0].desc}</p>
                     <button 
                       onClick={applyKeyRotation}
                       disabled={isRotatingKeys}
                       style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#ef4444', border: 'none', color: 'white', fontWeight: 850, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                     >
                       {isRotatingKeys ? (
                         <>
                           <RefreshCw size={12} className="spin" /> Rotating...
                         </>
                       ) : (
                         <>
                           <Sparkles size={12} /> {recommendations[0].actionLabel}
                         </>
                       )}
                     </button>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>
                     <CheckCircle2 size={14} /> Admin access keys rotated and secured.
                   </div>
                 )}
              </div>
           </div>
        </div>

      </div>

      {/* ================= MODALS & OVERLAYS ================= */}
      <AnimatePresence>
        {activeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isAuditing) {
                  setActiveModal(null);
                  setSelectedIncident(null);
                }
              }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(15,23,42,0.6)', 
                backdropFilter: 'blur(8px)',
                zIndex: -1
              }} 
            />

            {/* Deep Core Audit scanning progress overlay */}
            {activeModal === 'audit' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid #1e293b',
                  boxShadow: 'var(--shadow-xl)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: 'auto'
                }}
              >
                <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #ef444420', borderTopColor: '#ef4444' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ef4444' }}>
                    <Fingerprint size={32} />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Auditing Security Core</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Testing sovereign database and access vectors</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((auditStep + 1) / AUDIT_STEPS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#ef4444' }}
                  />
                </div>

                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#020617', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: '#10b981', 
                  textAlign: 'left',
                  height: '130px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {AUDIT_STEPS.slice(0, auditStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === auditStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Printable SSL Security Certificate Modal */}
            {activeModal === 'ssl_cert' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  color: '#0f172a',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '580px',
                  maxWidth: '100%',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="#10b981" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '1px' }}>
                      Sovereign Cryptographic SSL Audit
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Audit Certificate content */}
                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '20px', fontFamily: "'Merriweather', serif", lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '24px', backgroundColor: '#fafbfd' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Alexandria Academy</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Institutional Cybersecurity Portal</div>
                    <div style={{ height: '1px', width: '60px', backgroundColor: '#e2e8f0', margin: '12px auto' }}></div>
                  </div>

                  <p style={{ fontWeight: 800, marginBottom: '12px' }}>TO: Sovereign IT Registry</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>ENCRYPTION POLICY: AES-256 TLS v1.3 SEALS ACTIVE</p>

                  <p style={{ marginBottom: '16px' }}>
                    This document certifies that the global databases, Student Records databases, and academic ledger grids have been audited and declared in compliance with regional FERPA regulations.
                  </p>

                  <p style={{ marginBottom: '16px' }}>
                    Current active monitors total: <strong>{activeMonitors} shield nodes</strong>. The aggregate firewall level is configured at: <strong>{firewallLevel}</strong>.
                  </p>

                  <p style={{ marginBottom: '32px' }}>
                    Certified for active deployment,
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Arthur Pendelton</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Operations Registrar</div>
                    </div>
                    <div style={{ opacity: 0.1 }}>
                      <Award size={48} />
                    </div>
                  </div>
                </div>

                {/* Print controls */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Audit
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Print Audit Certificate
                  </button>
                </div>
              </motion.div>
            )}

            {/* Diagnostics - Vector Threat logs */}
            {activeModal === 'diagnostics' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Threat Diagnostics & Monitors
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Real-time active shield monitor allocation. Allocate additional nodes to raise network defense velocities.
                  </p>

                  <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACTIVE SOVEREIGN MONITOR SHIELDS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#f59e0b', marginTop: '6px' }}>{activeMonitors} Active</div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        setActiveMonitors(prev => prev + 1);
                        triggerToast("New sovereign shield monitor node successfully provisioned!", "success");
                      }}
                      style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                      Provision New Shield Node
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Database Integrity Calibration */}
            {activeModal === 'integrity_calibration' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Database Integrity Calibration
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Trigger database block re-hashing to seal tables and verify zero-vulnerabilities.
                  </p>

                  <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CURRENT DATA SHIELDS INTEGRITY</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#6366f1', marginTop: '6px' }}>{dataIntegrity}% Sealed</div>
                  </div>

                  <button 
                    onClick={handleDataRehash}
                    disabled={isDataRehashing}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {isDataRehashing ? (
                      <>
                        <RefreshCw size={16} className="spin" /> Rehashing Blocks...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Data Block Integrity Re-Hash
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Compliance regulatory alignment checklist */}
            {activeModal === 'compliance_checklist' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      FERPA Compliance Checklist
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Sovereign compliance diagnostics checklist verified by AI.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { rule: 'FERPA Student Record Egress constraints', ok: true },
                      { rule: 'AES-256 Data Ledger cryptography verification', ok: true },
                      { rule: 'Granular Role-based Access Gatekeeping', ok: true },
                      { rule: 'Regional SSH Node audit logging synchronization', ok: true }
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>{item.rule}</span>
                        <CheckCircle2 size={16} color="#10b981" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Clicked Incident Deep Dive action Drawer */}
            {activeModal === 'incident_detail' && selectedIncident && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '540px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={20} color="#ef4444" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Incident Triage: {selectedIncident.type}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedIncident(null);
                    }}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  
                  {/* Status Block */}
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SOURCE IP NODE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                        {selectedIncident.ip}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>AFFECTED GATEWAY</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#ef4444', marginTop: '4px' }}>
                        {selectedIncident.node}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <strong>Diagnostics description:</strong> "{selectedIncident.desc}"
                  </p>

                  {/* Interactive Firewall Level Slider */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      ADJUST FIREWALL GATE LEVEL
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {['Passive', 'Active Guard', 'Max Isolation'].map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            setFirewallLevel(level);
                            let newIndex = 0.02;
                            if (level === 'Passive') newIndex = 0.08;
                            if (level === 'Active Guard') newIndex = 0.02;
                            if (level === 'Max Isolation') newIndex = 0.00;
                            setThreatIndex(newIndex);
                            triggerToast(`Firewall shield calibrated to ${level}!`, "success");
                          }}
                          style={{ 
                            padding: '12px 8px', 
                            borderRadius: '12px', 
                            border: firewallLevel === level ? '2px solid #ef4444' : '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-body)', 
                            color: 'var(--text-main)', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedIncident(null);
                    }}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  {selectedIncident.status !== 'Blocked' && (
                    <button 
                      onClick={() => handleBlockIncidentIP(selectedIncident)}
                      style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ShieldCheck size={16} /> Block Node IP Address
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default SecurityAI;
