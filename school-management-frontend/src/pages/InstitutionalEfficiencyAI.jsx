import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PieChart, Zap, TrendingUp, 
  Settings, Database, Cpu, ShieldCheck,
  ChevronRight, ArrowUpRight, Activity, Globe,
  LayoutGrid, X, CheckCircle2, AlertCircle, Loader2, Sparkles, Server, Clock, RefreshCw
} from 'lucide-react';

const InstitutionalEfficiencyAI = () => {
  // 1. Core Dynamic States
  const [operationalLoad, setOperationalLoad] = useState(42);
  const [resourceUtilization, setResourceUtilization] = useState(89);
  const [auditRiskIndex, setAuditRiskIndex] = useState(0.04);
  const [liquidity, setLiquidity] = useState('Stable');
  
  // 2. Interactive Zones State
  const [zones, setZones] = useState([
    { id: 1, name: 'Zone 1', usage: 72, label: 'Zone 1: Primary Academic Block. Core HVAC & lightning schedules active.' },
    { id: 2, name: 'Zone 2', usage: 81, label: 'Zone 2: Science Laboratory Hub. High active lab density detected.' },
    { id: 3, name: 'Zone 3', usage: 94, label: 'Zone 3: Central Administrative Wing. Workload peak hours between 10AM-1PM.' },
    { id: 4, name: 'Zone 4', usage: 65, label: 'Zone 4: Gymnasium & Athletic Fields. Normal schedule distribution.' },
    { id: 5, name: 'Zone 5', usage: 60, label: 'Zone 5: Library & Quiet Study Areas. High spare capacity.' },
    { id: 6, name: 'Zone 6', usage: 78, label: 'Zone 6: E-Library & Digital Server Core. Continuous backup schedules active.' }
  ]);
  
  const [activeZoneId, setActiveZoneId] = useState(3); // Defaults to Zone 3 (over-utilized)

  // 3. Optimization Pipeline State
  const [optimizations, setOptimizations] = useState([
    { area: 'Energy Management', saving: '12%', status: 'Active', iconColor: '#6366f1', desc: 'AI-automated lighting & HVAC schedules reducing utility overhead.', logs: ['HVAC automated schedule deployed', 'Motion sensors activated in Hallway A & B', 'Standby power draw optimized'] },
    { area: 'Staff Allocation', saving: '8%', status: 'Pending', iconColor: '#f59e0b', desc: 'Neural load balancing suggested for administrative peak hours.', logs: ['Workload analysis completed for registry', 'Suggested 2hr flex schedule for Zone 3 staff', 'Pending administrative deployment'] },
    { area: 'Inventory Lifecycle', saving: '15%', status: 'Optimized', iconColor: '#10b981', desc: 'Predictive procurement reducing storage costs by 15%.', logs: ['Predictive ordering threshold calibrated', 'Supplier sync established', 'Storage overstock cleared by 20%'] }
  ]);

  // 4. Modals & Overlays
  const [activeModal, setActiveModal] = useState(null); // 'audit' | 'optimize' | null
  const [selectedOpt, setSelectedOpt] = useState(null);

  // 5. System Audit Animation Step State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  // 6. Toast Feedback State
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const AUDIT_STEPS = [
    "Pinging decentralized Zone telemetry feeds (Zones 1-6)...",
    "Measuring real-time grid energy utilization index...",
    "Analyzing ledger balances and procurement queues...",
    "Correlating class timetables against Zone utilization...",
    "Evaluating administrative compliance risk thresholds...",
    "Recalculating neural core coefficients...",
    "Syncing audit credentials with Alexandria Ledger...",
    "Autonomous system audit complete!"
  ];

  // Audit Step Loop Effect
  useEffect(() => {
    if (!isAuditing) return;
    const interval = setInterval(() => {
      setAuditStep(prev => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply Dynamic Updates post-audit
            setOperationalLoad(38);
            setResourceUtilization(81);
            setAuditRiskIndex(0.02);
            setLiquidity('Optimal');
            setZones(prev => prev.map(z => {
              if (z.id === 3) return { ...z, usage: 78 }; // zone 3 over-utilization resolved
              if (z.id === 5) return { ...z, usage: 71 }; // zone 5 usage balanced
              return z;
            }));
            setIsAuditing(false);
            setActiveModal(null);
            triggerToast("Full Institutional operational audit completed successfully!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isAuditing]);

  // Action: Apply Dynamic Re-routing/balancing
  const applyRoutingCorrection = () => {
    // Balances active Zone 3 to Zone 5
    setZones(prev => prev.map(z => {
      if (z.id === 3) return { ...z, usage: 79, label: 'Zone 3: Central Administrative Wing. Load balanced via Route Correction.' };
      if (z.id === 5) return { ...z, usage: 72, label: 'Zone 5: Library & Quiet Study Areas. Balanced load applied.' };
      return z;
    }));
    setResourceUtilization(83);
    setOperationalLoad(40);
    triggerToast("Neural routing correction applied! Zone 3 workload successfully balanced.", "success");
  };

  // Action: Approve Pipeline optimization
  const approveOptimization = (areaName) => {
    setOptimizations(prev => prev.map(opt => {
      if (opt.area === areaName) {
        return {
          ...opt,
          status: 'Active',
          saving: (parseFloat(opt.saving) + 3) + '%'
        };
      }
      return opt;
    }));
    triggerToast(`Neural optimization configuration for ${areaName} successfully deployed!`, "success");
    setActiveModal(null);
  };

  const getActiveZoneDescription = () => {
    const activeZoneObj = zones.find(z => z.id === activeZoneId);
    if (!activeZoneObj) return "";
    
    if (activeZoneObj.id === 3) {
      return "Zone 3 (Central Admin) is currently over-utilized. Suggested Action: Reroute registrars and Section B administrative files to Zone 5 to balance workload cycles.";
    } else if (activeZoneObj.usage > 80) {
      return `${activeZoneObj.name} shows elevated usage (${activeZoneObj.usage}%). Suggest deploying auxiliary load balancing queues.`;
    } else if (activeZoneObj.usage < 65) {
      return `${activeZoneObj.name} has substantial capacity. Available for auxiliary workload rerouting and standby energy conservation.`;
    } else {
      return `${activeZoneObj.name} is running within healthy operational limits (${activeZoneObj.usage}%). Continuous telemetry monitored.`;
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative' }}>
      
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
              zIndex: 9999, 
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
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#6366f125',
              color: toast.type === 'success' ? '#10b981' : '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Telemetry Success' : 'System Report'}</div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
           <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem' }}>
               <Cpu size={16} /> INSTITUTIONAL NEURAL CORE
             </div>
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#10b98115', borderRadius: '30px', color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>
               <ShieldCheck size={16} color="#10b981" /> ENTERPRISE AUDIT READY
             </div>
           </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Efficiency <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>System-wide operational auditing and autonomous resource optimization.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
            onClick={() => {
              setIsAuditing(true);
              setAuditStep(0);
              setActiveModal('audit');
            }}
            style={{ 
              padding: '16px 32px', 
              borderRadius: '18px', 
              border: 'none', 
              backgroundColor: '#6366f1', 
              color: 'white', 
              fontWeight: 900, 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
              <RefreshCw size={18} /> Initialize Full Audit
           </button>
        </div>
      </div>

      {/* Real-time Health Monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* operationalLoad Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Operational Load</div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{operationalLoad}%</div>
              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#10b98115', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>
                {operationalLoad < 40 ? 'Light' : 'Low'}
              </div>
           </div>
           <div style={{ marginTop: '20px', height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '2px' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${operationalLoad}%` }}
                style={{ height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} 
              />
           </div>
        </motion.div>

        {/* resourceUtilization Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Resource Utilization</div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{resourceUtilization}%</div>
              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#6366f115', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800 }}>
                {resourceUtilization > 85 ? 'Optimal' : 'Healthy'}
              </div>
           </div>
           <div style={{ marginTop: '20px', height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '2px' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resourceUtilization}%` }}
                style={{ height: '100%', backgroundColor: '#6366f1', borderRadius: '2px' }} 
              />
           </div>
        </motion.div>

        {/* liquidity Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Financial Liquidity</div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{liquidity}</div>
              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#10b98115', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>Healthy</div>
           </div>
           <div style={{ marginTop: '20px', height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '2px' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                style={{ height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} 
              />
           </div>
        </motion.div>

        {/* auditRiskIndex Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Audit Risk Index</div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{auditRiskIndex}</div>
              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#10b98115', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>Secure</div>
           </div>
           <div style={{ marginTop: '20px', height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '2px' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(1 - auditRiskIndex) * 100}%` }}
                style={{ height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} 
              />
           </div>
        </motion.div>
      </div>

      {/* Grid Content Column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Left Card: Resource Allocation Map */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Resource Allocation Map</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Select zones to audit active energy & staff distribution curves.</p>
              </div>
              <Globe size={20} color="#6366f1" />
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {zones.map((z) => (
                <motion.div 
                  key={z.id} 
                  onClick={() => setActiveZoneId(z.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    height: '90px', 
                    borderRadius: '20px', 
                    backgroundColor: activeZoneId === z.id ? '#6366f1' : 'var(--bg-body)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    boxShadow: activeZoneId === z.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none',
                    transition: 'background-color 0.2s, border-color 0.2s'
                  }}
                >
                   <div style={{ fontSize: '0.7rem', fontWeight: 800, color: activeZoneId === z.id ? 'white' : 'var(--text-muted)' }}>{z.name.toUpperCase()}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 900, color: activeZoneId === z.id ? 'white' : 'var(--text-main)', marginTop: '4px' }}>{z.usage}%</div>
                   
                   {/* Mini usage bar */}
                   <div style={{ width: '32px', height: '3px', backgroundColor: activeZoneId === z.id ? 'rgba(255,255,255,0.3)' : 'var(--border-color)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                     <div style={{ width: `${z.usage}%`, height: '100%', backgroundColor: activeZoneId === z.id ? 'white' : z.usage > 85 ? '#f59e0b' : '#6366f1' }} />
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Dynamic suggestion card responding to selected Zone */}
           <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#6366f108', border: '1px solid #6366f120' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                 <Zap size={20} color="#6366f1" />
                 <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>Zone AI Diagnostic</div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-sidebar)', lineHeight: 1.5, margin: '0 0 16px' }}>
                {getActiveZoneDescription()}
              </p>
              
              {activeZoneId === 3 && zones.find(z => z.id === 3).usage > 85 && (
                <button 
                  onClick={applyRoutingCorrection}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
                  }}
                >
                  <Sparkles size={12} /> Apply Recommended Routing
                </button>
              )}
           </div>
        </div>

        {/* Right Card: Operational Optimization Pipeline */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={20} color="#6366f1" /> Optimization Pipeline
           </h3>
           <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.4 }}>
             Select any autonomous pipeline process to configure manual parameters and load logs.
           </p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {optimizations.map((opt, i) => (
                <motion.div 
                  key={i} 
                  onClick={() => {
                    setSelectedOpt(opt);
                    setActiveModal('optimize');
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
                  style={{ 
                    backgroundColor: '#131e31', 
                    borderRadius: '24px', 
                    padding: '24px', 
                    border: '1px solid #1e293b',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: opt.status === 'Active' ? '#10b981' : opt.status === 'Optimized' ? '#6366f1' : '#f59e0b' }} />
                           {opt.area}
                         </div>
                         <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.3 }}>{opt.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                         <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.1rem' }}>-{opt.saving}</div>
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>COST SAVING</div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: opt.status === 'Active' ? '#10b981' : opt.status === 'Optimized' ? '#6366f1' : '#f59e0b' }}>
                        {opt.status.toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#475569', fontWeight: 700 }}>
                        Configure <ChevronRight size={14} />
                      </div>
                   </div>
                </motion.div>
              ))}
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
                if (!isAuditing) setActiveModal(null);
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

            {/* Diagnostics Audit Loading Modal */}
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
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #6366f120', borderTopColor: '#6366f1' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                    <Server size={32} className="pulse" />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Auditing Operational Telemetry</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Querying active grids & ledger indices</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((auditStep + 1) / AUDIT_STEPS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#6366f1' }}
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
                  height: '110px',
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

            {/* Optimization Pipeline Setup Drawer (Modal) */}
            {activeModal === 'optimize' && selectedOpt && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '480px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Settings size={20} color="#6366f1" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {selectedOpt.area} Optimization Setup
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  
                  {/* Status Box */}
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>CURRENT STATUS</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedOpt.status === 'Active' ? '#10b981' : '#f59e0b', marginTop: '2px' }}>
                        {selectedOpt.status.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>PROJECTED SAVING</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10b981', marginTop: '2px', textAlign: 'right' }}>
                        -{selectedOpt.saving}
                      </div>
                    </div>
                  </div>

                  {/* Form Label */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Operational Mode</label>
                    <select 
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}
                      defaultValue={selectedOpt.status === 'Active' ? "auto" : "manual"}
                    >
                      <option value="auto">Fully Autonomous (AI Recommended)</option>
                      <option value="manual">Scheduled (Manual Control)</option>
                      <option value="disabled">Disabled (Standby Mode)</option>
                    </select>
                  </div>

                  {/* Audit Logs */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> Local Neural Telemetry Logs
                    </div>
                    <div style={{ 
                      padding: '16px', 
                      borderRadius: '16px', 
                      backgroundColor: 'var(--bg-body)', 
                      border: '1px solid var(--border-color)', 
                      fontFamily: 'monospace', 
                      fontSize: '0.7rem', 
                      color: 'var(--text-sidebar)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {selectedOpt.logs.map((log, idx) => (
                        <div key={idx}>• [LOG] {log}</div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => approveOptimization(selectedOpt.area)}
                    style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Sparkles size={14} /> Deploy Configuration
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstitutionalEfficiencyAI;
