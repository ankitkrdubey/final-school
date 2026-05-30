import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Clock, DollarSign, Calendar, MapPin, 
  Languages, Ruler, Save, RefreshCw, Info,
  CheckCircle2, ChevronDown, Flag, AlertCircle, X
} from 'lucide-react';

const RegionalSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('school_regional_settings');
    return saved ? JSON.parse(saved) : {
      language: 'English (US)',
      timezone: '(GMT+05:30) India Standard Time',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24-hour',
      currency: 'INR (₹)',
      currencySymbolPosition: 'Before Amount',
      unitSystem: 'Metric',
      firstDayOfWeek: 'Monday'
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync settings to local storage on save
  const handleSave = () => {
    setIsSaving(true);
    showToast('Syncing regional parameters across school directories...', 'info');
    
    setTimeout(() => {
      localStorage.setItem('school_regional_settings', JSON.stringify(settings));
      setIsSaving(false);
      showToast('Regional settings saved and deployed successfully!', 'success');
    }, 1500);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFieldChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const sections = [
    {
      title: 'Language & Locale',
      icon: <Languages size={24} color="var(--primary)" />,
      desc: 'Set the primary language for the institutional interface.',
      fields: [
        { key: 'language', label: 'System Language', value: settings.language, type: 'select', options: ['English (US)', 'English (UK)', 'Spanish', 'French', 'Hindi', 'Arabic'] }
      ]
    },
    {
      title: 'Time & Date',
      icon: <Clock size={24} color="#f59e0b" />,
      desc: 'Configure how time and dates are displayed across all modules.',
      fields: [
        { key: 'timezone', label: 'Timezone', value: settings.timezone, type: 'select', options: ['(GMT-05:00) Eastern Time', '(GMT+00:00) UTC', '(GMT+05:30) India Standard Time', '(GMT+08:00) Singapore Time'] },
        { key: 'dateFormat', label: 'Date Format', value: settings.dateFormat, type: 'select', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
        { key: 'timeFormat', label: 'Time Format', value: settings.timeFormat, type: 'select', options: ['12-hour', '24-hour'] },
        { key: 'firstDayOfWeek', label: 'First Day of Week', value: settings.firstDayOfWeek, type: 'select', options: ['Monday', 'Sunday', 'Saturday'] }
      ]
    },
    {
      title: 'Currency & Units',
      icon: <DollarSign size={24} color="#10b981" />,
      desc: 'Financial and physical measurement standards.',
      fields: [
        { key: 'currency', label: 'Primary Currency', value: settings.currency, type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'AED (د.إ)'] },
        { key: 'currencySymbolPosition', label: 'Symbol Position', value: settings.currencySymbolPosition, type: 'select', options: ['Before Amount', 'After Amount'] },
        { key: 'unitSystem', label: 'Unit System', value: settings.unitSystem, type: 'select', options: ['Metric', 'Imperial'] }
      ]
    }
  ];

  // Dynamic formatting previews based on state selection
  const getFormattedTime = () => {
    if (settings.timeFormat === '12-hour') {
      if (settings.timezone.includes('-05:00')) return '04:15 AM';
      if (settings.timezone.includes('+00:00')) return '09:15 AM';
      if (settings.timezone.includes('+08:00')) return '05:15 PM';
      return '02:45 PM'; // Default India Standard Time
    } else {
      if (settings.timezone.includes('-05:00')) return '04:15';
      if (settings.timezone.includes('+00:00')) return '09:15';
      if (settings.timezone.includes('+08:00')) return '17:15';
      return '14:45';
    }
  };

  const getFormattedDate = () => {
    if (settings.dateFormat === 'MM/DD/YYYY') return '05/11/2026';
    if (settings.dateFormat === 'YYYY-MM-DD') return '2026-05-11';
    return '11/05/2026';
  };

  const getFormattedCurrency = () => {
    const symbol = settings.currency.includes('USD') ? '$' : 
                   settings.currency.includes('EUR') ? '€' : 
                   settings.currency.includes('GBP') ? '£' : 
                   settings.currency.includes('AED') ? 'د.إ' : '₹';
    
    const amountStr = symbol === '₹' ? '1,25,000.00' : '1,250.00';
    
    if (settings.currencySymbolPosition === 'Before Amount') {
      return `${symbol} ${amountStr}`;
    } else {
      return `${amountStr} ${symbol}`;
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '8px' }}>
            Regional <span style={{ color: 'var(--primary)' }}>Settings</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Globalize your institution by configuring locale-specific parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            padding: '14px 32px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', 
            border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', 
            cursor: 'pointer', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)', transition: '0.3s'
          }}
        >
          {isSaving ? <RefreshCw size={20} className="spin" /> : <Save size={20} />}
          {isSaving ? 'Updating...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        {/* Left: Configuration Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', 
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  {section.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{section.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{section.desc}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx} className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{field.label.toUpperCase()}</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        style={{ 
                          width: '100%', padding: '16px 20px', borderRadius: '14px', border: '2px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-body)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)',
                          appearance: 'none', cursor: 'pointer'
                        }}
                      >
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Quick Insights & Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Current Selection Preview */}
          <div style={{ padding: '40px', borderRadius: '40px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <Globe size={120} style={{ position: 'absolute', bottom: '-30px', right: '-30px', opacity: 0.1 }} />
            
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Flag size={20} /> Regional Preview
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div>
                 <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Time</p>
                 <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900 }}>
                   {getFormattedTime()} 
                   <small style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', opacity: 0.8, marginTop: '4px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                     {settings.timezone.split(' ')[0]}
                   </small>
                 </p>
               </div>
               <div>
                 <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Formatted Date</p>
                 <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{getFormattedDate()}</p>
               </div>
               <div>
                 <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Currency Sample</p>
                 <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{getFormattedCurrency()}</p>
               </div>
            </div>
          </div>

          {/* Localization Help */}
          <div style={{ padding: '32px', borderRadius: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
             <h5 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Info size={20} color="var(--primary)" /> Configuration Tips
             </h5>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 'Timezone affects all automated scheduling and notices.',
                 'Currency changes will reflect in fee receipts and ledger.',
                 'Date formats are applied to student IDs and transcripts.',
                 'Language settings may require 2-3 minutes to sync.'
               ].map((tip, i) => (
                 <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                   <div style={{ marginTop: '4px' }}><CheckCircle2 size={14} color="#10b981" /></div>
                   {tip}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      ` }} />
    </div>
  );
};

export default RegionalSettings;
