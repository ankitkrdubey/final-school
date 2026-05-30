import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, Database, HardDrive, Settings, 
  Wrench, Shield, Battery, Zap,
  Activity, ArrowUpRight, ChevronRight, Clock, X,
  CheckCircle2, AlertCircle, RefreshCw, Sparkles, Filter, Plus, Printer, Sliders, MessageSquare, Award, Search
} from 'lucide-react';

const AssetAI = () => {
  // 1. Dynamic Local Asset Database
  const [assets, setAssets] = useState([
    { id: 'bus', name: 'School Bus Fleet (12 Vehicles)', health: 92, maintenance: 'Optimal', nextService: '14 Days', icon: Bus, category: 'Transport', cost: 125000, color: '#10b981' },
    { id: 'science', name: 'Central Science Lab Equipment', health: 85, maintenance: 'Required', nextService: '2 Days', icon: Wrench, category: 'Scientific', cost: 85000, color: '#f59e0b' },
    { id: 'library', name: 'Main Library Archives & HVAC', health: 98, maintenance: 'Stable', nextService: '45 Days', icon: Database, category: 'Facility', cost: 240000, color: '#10b981' },
    { id: 'servers', name: 'IT Infrastructure Rack (Servers)', health: 78, maintenance: 'Warning', nextService: 'Immediate', icon: HardDrive, category: 'Digital', cost: 95000, color: '#ef4444' },
  ]);

  // Derived Aggregate Metrics
  const overallHealth = Math.round(assets.reduce((acc, a) => acc + a.health, 0) / assets.length);
  const activeWarningCount = assets.filter(a => a.health < 80).length;
  const [backlogCount, setBacklogCount] = useState(4);
  const [smartSavings, setSmartSavings] = useState(1400);
  const [amortizationYears, setAmortizationYears] = useState(6.2);

  // 2. Predictive Thermal/Mechanical Anomaly State
  const [anomalies, setAnomalies] = useState([
    { 
      id: 'server_thermal', 
      title: 'Server Cluster Anomaly', 
      desc: 'Thermal sensors in Zone 1 are reporting 15% higher temperatures. Predictive model suggests imminent fan failure. Dispatching technician.', 
      status: 'Pending', 
      actionLabel: 'Replace Server Fan', 
      color: '#ef4444' 
    },
    { 
      id: 'bus_pressure', 
      title: 'Transport Optimization', 
      desc: 'Bus #09 fuel efficiency improved by 8% after AI-suggested tire pressure adjustment and route re-optimization.', 
      status: 'Pending', 
      actionLabel: 'Deploy Smart-Pressure', 
      color: '#10b981' 
    }
  ]);

  // 3. Search & Modals State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); 
  // 'scan' | 'report' | 'add_asset' | 'diagnostics' | 'backlog_calibration' | 'savings_utility' | 'asset_detail' | null
  const [selectedAsset, setSelectedAsset] = useState(null);

  // 4. Immersive Scanning Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // 5. Smart HVAC Energy Toggles
  const [isEcoCooling, setIsEcoCooling] = useState(true);
  const [coolingTemperature, setCoolingTemperature] = useState(72);

  // 6. Quick Asset Registration
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Digital');
  const [newAssetCost, setNewAssetCost] = useState(15000);
  const [newAssetHealth, setNewAssetHealth] = useState(90);

  // 7. Toast Alerts
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const SCAN_STEPS = [
    "Establishing encrypted SSH diagnostic tunnels...",
    "Querying thermal sensors on server cluster modules...",
    "Reading real-time OBD2 telemetry from school buses...",
    "Scanning science lab air compression pressure index...",
    "Analyzing library humidity and ambient temperature logs...",
    "Running neural lifecycle and depreciation algorithms...",
    "Predictive health diagnostics successfully generated!"
  ];

  // Scan Loop Effect
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply slight optimizations post-scan
            setAssets(prev => prev.map(a => ({
              ...a,
              health: Math.min(99, a.health + 3)
            })));
            setBacklogCount(prev => Math.max(0, prev - 1));
            setSmartSavings(prev => prev + 150);
            setIsScanning(false);
            setActiveModal(null);
            triggerToast("Autonomous neural infrastructure scan completed!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isScanning]);

  // Handle single anomaly resolutions
  const applySingleMaintenance = (anomalyId) => {
    if (anomalyId === 'server_thermal') {
      setAssets(prev => prev.map(a => {
        if (a.id === 'servers') {
          return { ...a, health: 95, maintenance: 'Optimal', color: '#10b981' };
        }
        return a;
      }));
      setAnomalies(prev => prev.map(an => an.id === 'server_thermal' ? { ...an, status: 'Resolved' } : an));
      setBacklogCount(prev => Math.max(0, prev - 1));
      triggerToast("Server Cluster Fan replacement scheduled! Health restored.", "success");
    } else if (anomalyId === 'bus_pressure') {
      setAssets(prev => prev.map(a => {
        if (a.id === 'bus') {
          return { ...a, health: 96, maintenance: 'Optimal' };
        }
        return a;
      }));
      setAnomalies(prev => prev.map(an => an.id === 'bus_pressure' ? { ...an, status: 'Resolved' } : an));
      setSmartSavings(prev => prev + 220);
      triggerToast("Smart Tire Pressure calibration deployed across fleet!", "success");
    }
  };

  // Handle Apply All Maintenance
  const applyAllMaintenance = () => {
    setAssets(prev => prev.map(a => {
      if (a.id === 'servers') {
        return { ...a, health: 95, maintenance: 'Optimal', color: '#10b981' };
      }
      if (a.id === 'bus') {
        return { ...a, health: 96, maintenance: 'Optimal' };
      }
      return {
        ...a,
        health: Math.min(99, a.health + 2)
      };
    }));
    setAnomalies(prev => prev.map(an => ({ ...an, status: 'Resolved' })));
    setBacklogCount(0);
    setSmartSavings(prev => prev + 350);
    triggerToast("All active infrastructure anomalies refactored successfully!", "success");
  };

  // Register a new asset
  const handleRegisterAsset = (e) => {
    e.preventDefault();
    if (!newAssetName.trim()) {
      triggerToast("Please enter a valid asset name.", "error");
      return;
    }
    const catIcons = { Transport: Bus, Scientific: Wrench, Facility: Database, Digital: HardDrive };
    const newAsset = {
      id: 'new_' + Math.random().toString(36).substring(2, 9),
      name: newAssetName,
      health: parseInt(newAssetHealth),
      maintenance: parseInt(newAssetHealth) >= 90 ? 'Optimal' : parseInt(newAssetHealth) >= 75 ? 'Stable' : 'Warning',
      nextService: '30 Days',
      icon: catIcons[newAssetCategory] || Wrench,
      category: newAssetCategory,
      cost: parseInt(newAssetCost),
      color: parseInt(newAssetHealth) >= 90 ? '#10b981' : parseInt(newAssetHealth) >= 75 ? '#f59e0b' : '#ef4444'
    };

    setAssets(prev => [...prev, newAsset]);
    triggerToast(`Asset "${newAssetName}" successfully registered!`, "success");
    setNewAssetName('');
    setActiveModal(null);
  };

  // Filter assets by search query
  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Telemetry Success' : 'Asset Error'}</div>
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
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f59e0b15', borderRadius: '30px', color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Settings size={16} /> INFRASTRUCTURE NEURAL AUDITOR
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Asset <span style={{ color: '#f59e0b' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Predictive maintenance and lifecycle auditing for institutional assets.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
             onClick={() => setActiveModal('report')}
             style={{ padding: '16px 28px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
             <Printer size={16} color="var(--text-muted)" /> Inventory Report
           </button>
           <button 
             onClick={() => setActiveModal('add_asset')}
             style={{ padding: '16px 28px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
             <Plus size={16} /> Register Asset
           </button>
           <button 
             onClick={() => {
               setIsScanning(true);
               setScanStep(0);
               setActiveModal('scan');
             }}
             style={{ padding: '16px 28px', borderRadius: '18px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)' }}
           >
             <Zap size={18} /> Run Health Scan
           </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { key: 'health', label: 'Overall Asset Health', value: `${overallHealth}%`, icon: Activity, color: '#10b981', tag: 'DIAGNOSTICS', trend: '+2%' },
            { key: 'backlog', label: 'Maintenance Backlog', value: `0${backlogCount}`, icon: Wrench, color: '#f59e0b', tag: 'CALIBRATE', trend: '-1' },
            { key: 'lifecycle', label: 'Resource Lifecycle', value: `${amortizationYears}y`, icon: Clock, color: '#6366f1', tag: 'DEPRECIATION', trend: 'Stable' },
            { key: 'savings', label: 'Smart Grid Savings', value: `$${smartSavings.toLocaleString()}`, icon: Zap, color: '#10b981', tag: 'ECONOMY', trend: '+12%' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              onClick={() => setActiveModal(stat.key === 'health' ? 'diagnostics' : stat.key === 'backlog' ? 'backlog_calibration' : stat.key === 'savings' ? 'savings_utility' : 'diagnostics')}
              style={{ backgroundColor: 'var(--bg-card)', padding: '28px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <stat.icon size={20} />
                 </div>
                 <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '10px', backgroundColor: `${stat.color}15`, color: stat.color, fontWeight: 800 }}>{stat.tag}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: stat.color }}>{stat.trend}</div>
               </div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
            </motion.div>
          ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Asset Table Matrix */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden', gridColumn: 'span 2' }}>
           <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Predictive Health Matrix</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-body)', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <Search size={16} color="var(--text-muted)" />
                <input 
                  type="text"
                  placeholder="Filter assets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.8rem', width: '130px' }}
                />
              </div>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredAssets.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active assets match your search filter.
                </div>
              ) : (
                filteredAssets.map((asset, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedAsset(asset);
                      setActiveModal('asset_detail');
                    }}
                    style={{ 
                      padding: '24px 32px', 
                      borderBottom: i === filteredAssets.length - 1 ? 'none' : '1px solid var(--border-color)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1.2 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', border: '1px solid var(--border-color)' }}>
                           <asset.icon size={22} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 850, color: 'var(--text-main)' }}>{asset.name}</div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>Next Service: {asset.nextService} • Valuation: ${asset.cost.toLocaleString()}</div>
                        </div>
                     </div>
                     <div style={{ flex: 1, padding: '0 32px' }}>
                        <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                           <div style={{ height: '100%', width: `${asset.health}%`, backgroundColor: asset.health > 90 ? '#10b981' : asset.health > 80 ? '#f59e0b' : '#ef4444', borderRadius: '4px' }}></div>
                        </div>
                     </div>
                     <div style={{ textAlign: 'right', minWidth: '100px' }}>
                        <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem' }}>{asset.health}% Health</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: asset.health > 90 ? '#10b981' : asset.health > 80 ? '#f59e0b' : '#ef4444', marginTop: '2px' }}>{asset.maintenance.toUpperCase()}</div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* AI Maintenance Insights */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', justifySelf: 'stretch', boxShadow: 'var(--shadow-md)' }}>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={24} color="#f59e0b" /> Neural Maintenance
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {anomalies.map((an, idx) => (
                <div key={idx} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', border: '1px solid #334155', position: 'relative' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                     <div style={{ fontSize: '0.9rem', fontWeight: 800, color: an.status === 'Resolved' ? '#10b981' : an.color }}>{an.title}</div>
                     {an.status === 'Resolved' && (
                       <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px', backgroundColor: '#10b98125', color: '#10b981', fontWeight: 800 }}>RESOLVED</span>
                     )}
                   </div>
                   <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>{an.desc}</p>
                   
                   {an.status !== 'Resolved' ? (
                     <button 
                       onClick={() => applySingleMaintenance(an.id)}
                       style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#f59e0b', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                     >
                       <Sparkles size={12} /> {an.actionLabel}
                     </button>
                   ) : (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>
                       <CheckCircle2 size={14} /> Optimization Active
                     </div>
                   )}
                </div>
              ))}
           </div>
           
           {anomalies.some(an => an.status === 'Pending') ? (
             <button 
               onClick={applyAllMaintenance}
               style={{ marginTop: '24px', width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#f59e0b', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)' }}
             >
               Apply All Optimizations
             </button>
           ) : (
             <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', backgroundColor: '#10b98115', border: '1px solid #10b98130', color: '#10b981', fontWeight: 900, fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               <CheckCircle2 size={16} /> All Facilities Peak Performance
             </div>
           )}
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
                if (!isScanning) {
                  setActiveModal(null);
                  setSelectedAsset(null);
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

            {/* Neural Diagnostic scan overlay */}
            {activeModal === 'scan' && (
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
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #f59e0b20', borderTopColor: '#f59e0b' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#f59e0b' }}>
                    <Zap size={32} />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Scanning Infrastructure</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Vector scanning active telemetry channels</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#f59e0b' }}
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
                  {SCAN_STEPS.slice(0, scanStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === scanStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Register Asset Modal */}
            {activeModal === 'add_asset' && (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} color="#f59e0b" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Register Institutional Fleet Asset
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleRegisterAsset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      ASSET PROFILE TITLE
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Science Lab Freezer"
                      value={newAssetName}
                      onChange={e => setNewAssetName(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        ASSET CATEGORY
                      </label>
                      <select 
                        value={newAssetCategory}
                        onChange={e => setNewAssetCategory(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      >
                        <option value="Transport">Transport / Bus</option>
                        <option value="Scientific">Scientific Lab</option>
                        <option value="Facility">Facility Database</option>
                        <option value="Digital">Digital / Server</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        VALUATION / COST ($)
                      </label>
                      <input 
                        type="number"
                        required
                        value={newAssetCost}
                        onChange={e => setNewAssetCost(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      ASSET DIAGNOSTIC HEALTH (INITIAL %)
                    </label>
                    <input 
                      type="number"
                      min="10"
                      max="100"
                      value={newAssetHealth}
                      onChange={e => setNewAssetHealth(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
                  >
                    Register Asset
                  </button>
                </form>
              </motion.div>
            )}

            {/* Inventory Ledger Report letter */}
            {activeModal === 'report' && (
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
                  width: '600px',
                  maxWidth: '100%',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="#f59e0b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '1px' }}>
                      Executive Fleet & Capital Ledger
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Audit Letter content */}
                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '20px', fontFamily: "'Merriweather', serif", lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '24px', backgroundColor: '#fafbfd', maxHeight: '350px', overflowY: 'auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Alexandria Academy</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Campus Logistics & Capital Assets</div>
                    <div style={{ height: '1px', width: '60px', backgroundColor: '#e2e8f0', margin: '12px auto' }}></div>
                  </div>

                  <p style={{ fontWeight: 800, marginBottom: '12px' }}>TO: The Logistics and Audit Registry</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>DATE: {new Date().toLocaleDateString()}</p>

                  <p style={{ marginBottom: '16px' }}>
                    This ledger certifies physical and digital assets currently maintained at Alexandria Academy. Diagnostic scanners compile continuous mechanical and HVAC wear indexes to prevent scheduling backlogs.
                  </p>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', margin: '20px 0 10px' }}>Asset Inventory Valuation</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {assets.map((a, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                        <span>{a.name}</span>
                        <strong>Valuation: ${a.cost.toLocaleString()} ({a.health}% Health)</strong>
                      </div>
                    ))}
                  </div>

                  <p style={{ marginBottom: '16px' }}>
                    Total capital asset diagnostics show an aggregate health index of <strong>{overallHealth}%</strong>. Smart grid integrations report monthly utility offsets of <strong>${smartSavings}</strong>.
                  </p>

                  <p style={{ marginBottom: '32px' }}>
                    Certified for facility deployment,
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
                    Close Ledger
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Print Inventory Ledger
                  </button>
                </div>
              </motion.div>
            )}

            {/* Overall Asset Health Diagnostics */}
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
                      Overall Health Diagnostics
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
                    Distribution of active facility asset health ratings. Warning states (health &lt; 80%) require immediate neural maintenance fan calibrations.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {assets.map((a, i) => (
                      <div key={i} style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{a.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Asset Cost: ${a.cost.toLocaleString()}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: a.color }}>{a.maintenance.toUpperCase()} ({a.health}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Maintenance Backlog calibration */}
            {activeModal === 'backlog_calibration' && (
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
                    <Wrench size={20} color="#f59e0b" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Calibration & Backlog Manager
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
                    Clear maintenance backlogs by authorizing direct spare parts replenishment. 
                  </p>

                  <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CURRENT BACKLOG DEPOT ITEMS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#f59e0b', marginTop: '6px' }}>{backlogCount} Pending</div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        setBacklogCount(prev => Math.max(0, prev - 1));
                        triggerToast("Pre-authorized spare parts order dispatched! Backlog item cleared.", "success");
                      }}
                      style={{ flex: 1.2, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: '#f59e0b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Pre-Authorize 1 Item
                    </button>
                    <button 
                      onClick={() => {
                        setBacklogCount(0);
                        triggerToast("All warehouse backlog tickets fully resolved!", "success");
                      }}
                      style={{ flex: 1.5, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Authorize Depot Restock
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Smart Grid Utilities Saving Settings */}
            {activeModal === 'savings_utility' && (
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
                    <Zap size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Smart Grid Saving Engine
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
                    Adjust institutional HVAC eco-cooling settings. Enabling Eco-Cooling optimizes utility consumption rates, increasing Smart Grid savings in real time.
                  </p>

                  {/* Calibration slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      <span>Target Facility Temperature</span>
                      <span style={{ color: '#10b981' }}>{coolingTemperature}°F</span>
                    </div>
                    <input 
                      type="range"
                      min="65"
                      max="78"
                      step="1"
                      value={coolingTemperature}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setCoolingTemperature(val);
                        // Recalculate smart savings based on temperature (higher temperature = more savings)
                        const offset = (val - 72) * 50;
                        setSmartSavings(Math.round(1400 + offset + (isEcoCooling ? 250 : 0)));
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>ENABLE HVAC ECO-COOLING</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Reduces vector peak grid consumption by 15%</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsEcoCooling(!isEcoCooling);
                        setSmartSavings(prev => prev + (!isEcoCooling ? 250 : -250));
                        triggerToast(`Eco-Cooling Mode ${!isEcoCooling ? 'Enabled' : 'Disabled'}!`, "success");
                      }}
                      style={{ 
                        padding: '10px 20px', 
                        borderRadius: '12px', 
                        border: 'none', 
                        backgroundColor: isEcoCooling ? '#10b981' : 'var(--border-color)', 
                        color: 'white', 
                        fontWeight: 900, 
                        fontSize: '0.75rem', 
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {isEcoCooling ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Clicked Asset Deep Dive analysis Drawer */}
            {activeModal === 'asset_detail' && selectedAsset && (
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
                    <Sliders size={20} color="#f59e0b" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Asset Diagnostics: {selectedAsset.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedAsset(null);
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
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SERVICE CATEGORY</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                        {selectedAsset.category}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>NEXT MECHANICAL CHECK</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 950, color: '#f59e0b', marginTop: '4px' }}>
                        {selectedAsset.nextService}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Critical Wear Slider */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      ADJUST CRITICAL WEAR COEFFICIENT
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {['Low', 'Medium', 'High'].map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            // Adjust level
                            setAssets(prev => prev.map(a => {
                              if (a.name === selectedAsset.name) {
                                let newHealth = a.health;
                                let newColor = a.color;
                                if (level === 'Low') { newHealth = Math.min(99, a.health + 8); newColor = '#10b981'; }
                                if (level === 'Medium') { newHealth = Math.max(50, a.health - 2); newColor = '#f59e0b'; }
                                if (level === 'High') { newHealth = Math.max(30, a.health - 12); newColor = '#ef4444'; }
                                return { ...a, health: newHealth, color: newColor, maintenance: newHealth >= 90 ? 'Optimal' : newHealth >= 75 ? 'Required' : 'Warning' };
                              }
                              return a;
                            }));
                            setSelectedAsset(prev => {
                              const calculatedHealth = level === 'Low' ? Math.min(99, prev.health + 8) : level === 'Medium' ? Math.max(50, prev.health - 2) : Math.max(30, prev.health - 12);
                              return { 
                                ...prev, 
                                health: calculatedHealth,
                                maintenance: calculatedHealth >= 90 ? 'Optimal' : calculatedHealth >= 75 ? 'Required' : 'Warning'
                              };
                            });
                            triggerToast(`Asset critical wear coefficient set to ${level}!`, "success");
                          }}
                          style={{ 
                            padding: '12px 8px', 
                            borderRadius: '12px', 
                            border: selectedAsset.health >= 90 && level === 'Low' ? '2px solid #10b981' : selectedAsset.health >= 75 && selectedAsset.health < 90 && level === 'Medium' ? '2px solid #f59e0b' : selectedAsset.health < 75 && level === 'High' ? '2px solid #ef4444' : '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-body)', 
                            color: 'var(--text-main)', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {level} Wear
                        </button>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Adjusting the wear index model updates mechanical lifespan predictions. High wear indices trigger immediate fleet audit recommendations.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedAsset(null);
                    }}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Asset Drawer
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
};

export default AssetAI;
