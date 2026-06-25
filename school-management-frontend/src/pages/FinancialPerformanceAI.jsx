import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, TrendingUp, TrendingDown, Landmark, BarChart, PieChart, ShieldCheck, Zap, FileText, ArrowUpRight, Activity, Calendar, X, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Download, Printer, Users, CreditCard, ChevronRight, HelpCircle } from 'lucide-react';

const FinancialPerformanceAI = () => {
  // 1. Dynamic Fiscal State
  const [feeForecast, setFeeForecast] = useState(420500);
  const [burnRate, setBurnRate] = useState(62000);
  const [annualSurplus, setAnnualSurplus] = useState(1.2);
  const [burnTrend, setBurnTrend] = useState(-4);
  const [surplusTrend, setSurplusTrend] = useState(8);

  // 2. Interactive Modals State
  const [activeModal, setActiveModal] = useState(null); // 'report' | 'sync' | 'recovery' | 'vendor' | 'insight_detail' | null
  const [selectedInsight, setSelectedInsight] = useState(null); // 0: Fee Forecast, 1: Burn Rate, 2: Surplus

  // 3. Dynamic Telemetry Syncing Animation
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  // 4. Toast System Feedback
  const [toast, setToast] = useState(null);

  // 5. Interactive Recovery Accounts
  const [accounts, setAccounts] = useState([
    { parent: 'Robert Davidson', student: 'Leo Davidson', amount: 450, prob: '96%', phone: '+1 (555) 902-1203', checked: true },
    { parent: 'Emily Clarkson', student: 'Mia Clarkson', amount: 800, prob: '91%', phone: '+1 (555) 304-4902', checked: true },
    { parent: 'Arthur Pendelton', student: 'Gary Pendelton', amount: 350, prob: '88%', phone: '+1 (555) 492-9012', checked: true },
    { parent: 'Clara Oswald', student: 'Danny Oswald', amount: 620, prob: '85%', phone: '+1 (555) 203-4901', checked: false }
  ]);

  // 6. Interactive Vendor Contracts
  const [activeVendor, setActiveVendor] = useState('Apex Scientific Inc.');
  const [vendorList, setVendorList] = useState([
    { name: 'Apex Scientific Inc.', cost: '₹18,500', rating: '4.8/5', speed: '2 days', status: 'current' },
    { name: 'OmniLab Supply Systems', cost: '₹16,280', rating: '4.6/5', speed: '3 days', status: 'alternate' },
    { name: 'Global Academics Procure', cost: '₹15,950', rating: '4.4/5', speed: '5 days', status: 'alternate' }
  ]);

  // 7. Interactive Slider Simulation States
  const [thermostatSavings, setThermostatSavings] = useState(15); // % HVAC scheduling
  const [paperlessSavings, setPaperlessSavings] = useState(20); // % Paperless migration

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const SYNC_STEPS = [
    "Pinging core billing database registries...",
    "Querying bank ledger transaction records (1,420 lines)...",
    "Verifying fee receivables against payment gateway receipts...",
    "Auditing payroll disbursements and operational burn arrays...",
    "Calculating predictive fiscal models and year-end surplus...",
    "Running compliance security compliance check...",
    "Re-calculation complete!"
  ];

  // Syncing Ledgers Effect
  useEffect(() => {
    if (!isSyncing) return;
    const interval = setInterval(() => {
      setSyncStep(prev => {
        if (prev < SYNC_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply slight optimizations after sync
            setFeeForecast(423850);
            setAnnualSurplus(1.24);
            setSurplusTrend(11);
            setIsSyncing(false);
            setActiveModal(null);
            triggerToast("Dynamic ledgers successfully synchronized & audited!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isSyncing]);

  // Handle Account Recovery Action
  const handleRecover = () => {
    const selectedAmount = accounts
      .filter(acc => acc.checked)
      .reduce((sum, acc) => sum + acc.amount, 0);

    setFeeForecast(prev => prev + selectedAmount);
    triggerToast(`AI fee reminders dispatched successfully! Predicted recovery rate: ₹${selectedAmount}`, "success");
    setActiveModal(null);
  };

  // Switch Vendor Contract Action
  const switchContract = (vendorName) => {
    setActiveVendor(vendorName);
    const targetCost = vendorName === 'OmniLab Supply Systems' ? 16280 : 15950;
    const currentCost = 18500;
    const monthlySaving = Math.round((currentCost - targetCost) / 12);
    
    setBurnRate(prev => prev - monthlySaving);
    setBurnTrend(prev => prev - 1);
    triggerToast(`Contract switched to ${vendorName}! Saved ₹${monthlySaving}/mo in operational overhead.`, "success");
    setActiveModal(null);
  };

  const toggleAccountCheck = (idx) => {
    setAccounts(prev => prev.map((acc, i) => i === idx ? { ...acc, checked: !acc.checked } : acc));
  };

  // Interactive Chart data
  const monthlyData = [
    { month: 'JAN', rev: 92, exp: 62, text: 'JAN: Revenue ₹92k / Expense ₹62k' },
    { month: 'FEB', rev: 110, exp: 65, text: 'FEB: Revenue ₹110k / Expense ₹65k' },
    { month: 'MAR', rev: 98, exp: 58, text: 'MAR: Revenue ₹98k / Expense ₹58k' },
    { month: 'APR', rev: 125, exp: 60, text: 'APR: Revenue ₹125k / Expense ₹60k' },
    { month: 'MAY', rev: 130, exp: 62, text: 'MAY: Revenue ₹130k / Expense ₹62k' },
    { month: 'JUN', rev: 145, exp: 64, text: 'JUN: Revenue ₹145k / Expense ₹64k' }
  ];

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
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Fiscal Audit Success' : 'Ledger System'}</div>
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#10b98115', borderRadius: '30px', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Landmark size={16} /> FINANCIAL NEURAL AUDITOR
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Financial <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Predictive fiscal modeling and automated revenue optimization.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
            onClick={() => setActiveModal('report')}
            style={{ 
              padding: '16px 32px', 
              borderRadius: '18px', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-main)', 
              fontWeight: 800, 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
          >
            <FileText size={18} color="var(--text-muted)" /> Financial Report
          </button>
           <button 
            onClick={() => {
              setIsSyncing(true);
              setSyncStep(0);
              setActiveModal('sync');
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
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
              <Activity size={18} /> Sync Ledgers
           </button>
        </div>
      </div>

      {/* Top 3 Interactive Insight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        
        {/* Fee Forecast Card */}
        <motion.div 
          onClick={() => {
            setSelectedInsight(0);
            setActiveModal('insight_detail');
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', position: 'relative' }}
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>Fee Collection Forecast</div>
              <div style={{ padding: '4px 8px', borderRadius: '8px', backgroundColor: '#6366f110', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800 }}>94% CONFIDENCE</div>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>
             ₹{feeForecast.toLocaleString()}
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
             Predicted collection based on historical payment patterns and current arrears. Click for detailed collection rates.
           </p>
        </motion.div>

        {/* Operational Burn Rate Card */}
        <motion.div 
          onClick={() => {
            setSelectedInsight(1);
            setActiveModal('insight_detail');
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', position: 'relative' }}
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>Operational Burn Rate</div>
              <div style={{ padding: '4px 8px', borderRadius: '8px', backgroundColor: '#10b98110', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>
                {burnTrend}% OPTIMIZED
              </div>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>
             ₹{burnRate.toLocaleString()}/mo
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
             System-wide utility and staffing costs are currently below projected budget. Click for dynamic burn rate simulator.
           </p>
        </motion.div>

        {/* Projected Annual Surplus Card */}
        <motion.div 
          onClick={() => {
            setSelectedInsight(2);
            setActiveModal('insight_detail');
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', position: 'relative' }}
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>Projected Annual Surplus</div>
              <div style={{ padding: '4px 8px', borderRadius: '8px', backgroundColor: '#6366f110', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800 }}>
                +{surplusTrend}% GROWTH
              </div>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>
             ₹{annualSurplus}M
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
             AI forecasts year-end liquidity growth due to optimized procurement and collections. Click for revenue vectors.
           </p>
        </motion.div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
         {/* Revenue Projection Chart Mockup */}
         <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
               <div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Fiscal Projection Matrix</h3>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Hover or click bars to inspect monthly revenue telemetry.</p>
               </div>
               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#6366f1' }}></div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>REVENUE</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--border-color)', marginLeft: '12px' }}></div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>EXPENSE</span>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', height: '320px', alignItems: 'stretch' }}>
              
              {/* Y-Axis Labels */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 0', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right', width: '40px', userSelect: 'none' }}>
                <span>₹150k</span>
                <span>₹100k</span>
                <span>₹50k</span>
                <span>₹0</span>
              </div>

              {/* Chart Body */}
              <div style={{ flex: 1, height: '300px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '24px', justifyContent: 'space-around', position: 'relative', border: '1px solid var(--border-color)' }}>
                 
                 {/* Grid Lines */}
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                   <div style={{ width: '100%', borderTop: '1px dashed var(--border-color)', opacity: 0.1 }}></div>
                   <div style={{ width: '100%', borderTop: '1px dashed var(--border-color)', opacity: 0.1 }}></div>
                   <div style={{ width: '100%', borderTop: '1px dashed var(--border-color)', opacity: 0.1 }}></div>
                   <div style={{ width: '100%' }}></div> {/* Bottom baseline */}
                 </div>
                 
                 {/* Columns */}
                 {monthlyData.map((d, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100%', width: '100%', maxWidth: '50px', position: 'relative', zIndex: 1 }}>
                      
                      {/* Revenue Bar */}
                      <motion.div 
                        whileHover={{ scaleY: 1.03 }}
                        title={d.text}
                        onClick={() => triggerToast(`Monthly Analysis: ${d.text}`, "info")}
                        style={{ 
                          height: `${(d.rev / 150) * 100}%`, 
                          width: '18px', 
                          backgroundColor: '#6366f1', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          opacity: 0.8 + (d.rev/500),
                          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
                          transformOrigin: 'bottom'
                        }} 
                      />
                      
                      {/* Expense Bar */}
                      <motion.div 
                        whileHover={{ scaleY: 1.03 }}
                        title={d.text}
                        onClick={() => triggerToast(`Monthly Analysis: ${d.text}`, "info")}
                        style={{ 
                          height: `${(d.exp / 150) * 100}%`, 
                          width: '18px', 
                          backgroundColor: 'var(--border-color)', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          transformOrigin: 'bottom'
                        }} 
                      />

                   </div>
                 ))}
              </div>

            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', paddingLeft: '56px' }}>
               {monthlyData.map(d => <span key={d.month} style={{ width: '100%', maxWidth: '50px', textAlign: 'center' }}>{d.month}</span>)}
            </div>
         </div>

        {/* AI Financial Interventions */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Zap size={24} color="#6366f1" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Neural Fiscal Actions</h3>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Recovery card */}
              <div style={{ padding: '24px', backgroundColor: '#131e31', borderRadius: '24px', border: '1px solid #1e293b' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Fee Recovery Pipeline</div>
                    <ArrowUpRight size={18} color="#10b981" />
                 </div>
                 <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                   AI identified 24 accounts with high recovery probability. Ready to initiate automated gentle payment reminders.
                 </p>
                 <button 
                  onClick={() => setActiveModal('recovery')}
                  style={{ 
                    marginTop: '16px', 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    backgroundColor: '#6366f1', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: 800, 
                    fontSize: '0.8rem', 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                 >
                   Initiate Recovery Reminders
                 </button>
              </div>

              {/* Vendor card */}
              <div style={{ padding: '24px', backgroundColor: '#131e31', borderRadius: '24px', border: '1px solid #1e293b' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Vendor Optimization</div>
                    <ShieldCheck size={18} color="#6366f1" />
                 </div>
                 <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                   Found alternative supply contract vendors for Lab equipment with up to 12% lower cost basis. Current: {activeVendor}.
                 </p>
                 <button 
                  onClick={() => setActiveModal('vendor')}
                  style={{ 
                    marginTop: '16px', 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    border: '1px solid #334155', 
                    backgroundColor: 'transparent', 
                    color: 'white', 
                    fontWeight: 800, 
                    fontSize: '0.8rem', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#334155';
                  }}
                 >
                   Review Vendor Contracts
                 </button>
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
                if (!isSyncing) setActiveModal(null);
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

            {/* Syncing Ledgers Progress Overlay */}
            {activeModal === 'sync' && (
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
                    <Landmark size={32} className="pulse" />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Auditing Ledger Entries</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Syncing billing pipelines with bank gateways</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((syncStep + 1) / SYNC_STEPS.length) * 100}%` }}
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
                  {SYNC_STEPS.slice(0, syncStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === syncStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Fee Recovery Pipeline Modal */}
            {activeModal === 'recovery' && (
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
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Users size={20} color="#6366f1" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      Fee Recovery Pipeline
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ backgroundColor: '#6366f108', padding: '16px', borderRadius: '16px', border: '1px solid #6366f120', fontSize: '0.75rem', color: '#4f46e5', lineHeight: 1.4 }}>
                    <strong>Direct Recipient Selection:</strong> Select high-probability accounts below to dispatch gentle AI reminders via SMS & parent portals.
                  </div>

                  {/* Accounts List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    {accounts.map((acc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleAccountCheck(idx)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-body)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox" 
                            checked={acc.checked} 
                            onChange={() => {}} // handled by div click
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{acc.parent}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Student: {acc.student}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>₹{acc.amount}</div>
                          <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 800 }}>Prob: {acc.prob}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Template Editor */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>AI Message Template</label>
                    <textarea 
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: 'var(--bg-body)', 
                        color: 'var(--text-main)', 
                        fontSize: '0.75rem', 
                        lineHeight: 1.4, 
                        height: '70px', 
                        outline: 'none', 
                        resize: 'none',
                        fontFamily: 'inherit'
                      }}
                      defaultValue="Dear Guardian, Alexandria Academy is automatedly auditing outstanding balances. A pending amount remains. Please review your portal billing profile."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRecover}
                    style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Sparkles size={14} /> Send Reminders
                  </button>
                </div>
              </motion.div>
            )}

            {/* Vendor Optimization Contract Comparison Modal */}
            {activeModal === 'vendor' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '520px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      Vendor Contract Evaluation
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ backgroundColor: '#10b98108', padding: '16px', borderRadius: '16px', border: '1px solid #10b98120', fontSize: '0.75rem', color: '#047857', lineHeight: 1.4 }}>
                    <strong>Optimized Tenders Identified:</strong> Alternative procurement offers verified by AI for chemistry lab packages.
                  </div>

                  {/* Vendor Table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {vendorList.map((vendor, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          backgroundColor: activeVendor === vendor.name ? '#10b98108' : 'var(--bg-body)',
                          border: `1px solid ${activeVendor === vendor.name ? '#10b98130' : 'var(--border-color)'}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {vendor.name}
                            {activeVendor === vendor.name && (
                              <span style={{ fontSize: '0.6rem', padding: '2px 6px', backgroundColor: '#10b98120', color: '#10b981', borderRadius: '10px', fontWeight: 800 }}>ACTIVE</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <span>Rating: <strong>{vendor.rating}</strong></span>
                            <span>Delivery: <strong>{vendor.speed}</strong></span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{vendor.cost}</div>
                          {activeVendor !== vendor.name ? (
                            <button 
                              onClick={() => switchContract(vendor.name)}
                              style={{ 
                                marginTop: '4px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              Switch Contract
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>Verified Plan</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Close Portal
                  </button>
                </div>
              </motion.div>
            )}

            {/* Executive Fiscal Report Modal */}
            {activeModal === 'report' && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  display: 'flex',
                  gap: '32px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  overflow: 'hidden',
                  width: '1000px',
                  maxWidth: '100%',
                  height: '80vh',
                  maxHeight: '800px',
                  margin: 'auto'
                }}
              >
                {/* Print Layout Sheet */}
                <div style={{ flex: 2, border: '1px solid var(--border-color)', borderRadius: '24px', backgroundColor: '#f8fafc', padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                  
                  {/* Watermark Logo */}
                  <div style={{ position: 'absolute', top: '40%', left: '30%', opacity: 0.03, transform: 'rotate(-30deg)', pointerEvents: 'none' }}>
                    <Landmark size={400} color="#0f172a" />
                  </div>
                  
                  {/* Sheet Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.25rem', letterSpacing: '-1px' }}>ALEXANDRIA INTERNATIONAL ACADEMY</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>FACULTY AI EVALUATION SUITE • FISCAL AUDIT STATEMENT</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>REPORT NO: AIA-FIS-2026</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>DATE: May 25, 2026</div>
                    </div>
                  </div>

                  {/* Balance details */}
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>I. LIQUIDITY STATEMENT</h5>
                    <p style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
                      This audit evaluates core predictive fiscal vectors, active ledgers, and operational costs across the institution. The core year-end surplus forecast stands at <strong>₹{annualSurplus}M</strong> with an operational fee collection forecast of <strong>₹{feeForecast.toLocaleString()}</strong>. Real-time cost-saving pipelines have lowered utility burn rates to <strong>₹{burnRate.toLocaleString()}/mo</strong>.
                    </p>
                  </div>

                  {/* Table details */}
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>II. LEDGER TELEMETRY DETAILS</h5>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: '#334155' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0f172a', color: 'white', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Telemetry Parameter</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Current Benchmark</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Status Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ backgroundColor: 'white' }}>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Fee Recovery Forecast</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>₹{feeForecast.toLocaleString()}</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', color: '#10b981', fontWeight: 800 }}>94% Target Confidence</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f1f5f9' }}>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Operational Burn Rate</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>₹{burnRate.toLocaleString()}/mo</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', color: '#10b981', fontWeight: 800 }}>{burnTrend}% Optimized</td>
                        </tr>
                        <tr style={{ backgroundColor: 'white' }}>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Annual Surplus Target</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>₹{annualSurplus}M</td>
                          <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', color: '#6366f1', fontWeight: 800 }}>+{surplusTrend}% Growth</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures */}
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>AI Fiscal Core Auditor</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>Cryptographically signed via AI-Core</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Alexandria Finance Registry</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>Verified Institutional Audit Seal</div>
                    </div>
                  </div>

                </div>

                {/* Print Controls Panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)' }}>Fiscal Audit Suite</h4>
                    <button 
                      onClick={() => setActiveModal(null)}
                      style={{ background: 'var(--border-color)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Deploy cryptographic ledger summaries detailing outstanding bills and procurement cost-saving models.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>Cryptographic signatures attached</div>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>alexandria billing feeds verified</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        triggerToast("PDF generated and successfully downloaded!", "success");
                        setActiveModal(null);
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Download size={18} /> Download official PDF
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Printer size={18} /> Print physical copy
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Click-to-open Metric Detail Dialogs (Interactive Simulator) */}
            {activeModal === 'insight_detail' && selectedInsight !== null && (
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
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <BarChart size={20} color="#6366f1" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {selectedInsight === 0 ? "Fee Receivables Analysis" : selectedInsight === 1 ? "Cost Optimization Simulator" : "Annual Surplus Projections"}
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
                  
                  {selectedInsight === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        AI tracks historical school collection timelines. Current data points predict high likelihood of full fee collection by early June.
                      </p>
                      
                      <div style={{ backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>COLLECTION DISTRIBUTION RATE</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                          <span>Direct Bank Transfers</span>
                          <span>76%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                          <span>Online Card Gateways</span>
                          <span>18%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', marginBottom: '4px' }}>
                          <span>Outstanding Arrears</span>
                          <span>6%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedInsight === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <strong>Burn Rate Simulator:</strong> Tweak variables below to test how automated lighting and paperless school campaigns impact the monthly burn overhead.
                      </p>

                      {/* Slider 1 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                          <span>HVAC Smart Thermostat scheduling</span>
                          <span style={{ color: '#6366f1' }}>{thermostatSavings}% Saving</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="30" 
                          value={thermostatSavings}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            setThermostatSavings(val);
                            setBurnRate(62000 - (val * 150) - (paperlessSavings * 80));
                          }}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                      </div>

                      {/* Slider 2 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                          <span>Paperless Operations migration</span>
                          <span style={{ color: '#10b981' }}>{paperlessSavings}% Saving</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="40" 
                          value={paperlessSavings}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            setPaperlessSavings(val);
                            setBurnRate(62000 - (thermostatSavings * 150) - (val * 80));
                          }}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                      </div>

                      <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>SIMULATED OPERATIONAL BURN RATE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                          ₹{burnRate.toLocaleString()}/mo
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedInsight === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        Year-end liquidity trends show strong upwards velocity. Alexandria AI core predicts high capital availability for capital expansion (such as new laboratory tools in Q3).
                      </p>

                      <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>ALLOCATION STRATEGY STAGINGS</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-sidebar)' }}>
                          <span>Reserve Reserves (Standby)</span>
                          <strong>60%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-sidebar)' }}>
                          <span>Academic Tech Acquisitions</span>
                          <strong>25%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-sidebar)' }}>
                          <span>Campus Security Enhancements</span>
                          <strong>15%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Close Simulation
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

export default FinancialPerformanceAI;
