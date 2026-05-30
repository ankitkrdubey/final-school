import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, Moon, Sun, 
  Lock, Mail, Globe, Database, Save, Key, 
  Fingerprint, Monitor, LogOut, ShieldCheck, AlertTriangle,
  MessageSquare, Smartphone, HardDrive, Cloud, History,
  RefreshCw, Server, Download, FileText, X, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'general');
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState(localStorage.getItem('notificationsMuted') !== 'true');
  const [saving, setSaving] = useState(false);
  const [twoFactor, setTwoFactor] = useState(localStorage.getItem('2faEnabled') === 'true');
  const [isMaintenance, setIsMaintenance] = useState(localStorage.getItem('maintenanceMode') === 'true');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState(localStorage.getItem('backupFrequency') || 'Daily');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [schoolName, setSchoolName] = useState(localStorage.getItem('schoolName') || 'EduPro Global Academy');
  const [supportEmail, setSupportEmail] = useState(localStorage.getItem('supportEmail') || 'support@edupro.io');
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows PC • Chrome', location: 'New York, USA', status: 'Current Session', ip: '192.168.1.1' },
    { id: 2, device: 'MacBook Pro • Safari', location: 'London, UK', status: 'Last active: 2 hours ago', ip: '104.22.45.1' }
  ]);
  
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem('systemRules');
    return savedRules ? JSON.parse(savedRules) : {
      examResults: true,
      feeReminders: true,
      attendanceAlerts: false,
      eventNotices: true,
      smsGateway: false
    };
  });

  React.useEffect(() => {
    const syncState = () => {
      setNotifications(localStorage.getItem('notificationsMuted') !== 'true');
      const storedTheme = localStorage.getItem('theme');
      setIsDark(storedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', storedTheme || 'light');
    };
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
    triggerToast(`Interface theme switched to ${newTheme.toUpperCase()} mode.`, "success", "System Theme");
  };

  const handleSave = () => {
    setSaving(true);
    // Persist all settings
    localStorage.setItem('systemRules', JSON.stringify(rules));
    localStorage.setItem('notificationsMuted', (!notifications).toString());
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('schoolName', schoolName);
    localStorage.setItem('supportEmail', supportEmail);
    
    setTimeout(() => {
      setSaving(false);
      triggerToast("Institutional preferences successfully synchronized.", "success", "Settings Saved");
    }, 1200);
  };

  const handleDownload = () => {
    const mockSql = "-- EduPro School Management System Backup\n-- Date: " + new Date().toISOString() + "\n\nCREATE TABLE students ...";
    const blob = new Blob([mockSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().getTime()}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("System SQL database snapshot compiled & exported.", "success", "Database Backup");
  };

  const tabs = [
    { id: 'general', icon: <SettingsIcon size={18} />, label: 'General Configuration' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security & Auth' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notification Rules' },
    { id: 'data', icon: <Database size={18} />, label: 'Data & Backup' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '4px', margin: 0 }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Configure your institutional portal, security protocols, and global preferences.</p>
      </div>

      {/* Success Toast */}
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
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : toast.type === 'warning'
                  ? '#fbbf24'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <ShieldCheck size={20} />
              ) : toast.type === 'error' ? (
                <AlertTriangle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Save size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map((tab) => (
            <motion.button 
              key={tab.id} 
              whileHover={{ x: 6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className="btn" 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', 
                borderRadius: '16px', border: 'none', textAlign: 'left',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                fontWeight: 700, transition: '0.3s', cursor: 'pointer'
              }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card" style={{ padding: '40px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '32px' }}>General Preferences</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Theme Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                          {isDark ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--warning)" />}
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>Interface Theme</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch between light and dark portal modes.</p>
                        </div>
                     </div>
                     <div 
                        onClick={toggleTheme}
                        style={{ 
                          width: '56px', height: '30px', borderRadius: '20px', padding: '4px', cursor: 'pointer',
                          backgroundColor: isDark ? 'var(--primary)' : 'var(--border-color)',
                          transition: '0.3s', position: 'relative', border: '1px solid var(--border-color)'
                        }}
                     >
                        <div style={{ 
                           width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', 
                           position: 'absolute', left: isDark ? '30px' : '4px', transition: '0.3s',
                           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                     </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

                  {/* Notification Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                           <Bell size={20} color="var(--secondary)" />
                        </div>
                        <div>
                           <h4 style={{ margin: 0 }}>Global Notifications</h4>
                           <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable system-wide alerts for important notices.</p>
                        </div>
                     </div>
                     <div 
                        onClick={() => {
                           const newEnabledState = !notifications;
                           setNotifications(newEnabledState);
                           localStorage.setItem('notificationsMuted', (!newEnabledState).toString());
                           window.dispatchEvent(new Event('storage'));
                           triggerToast(
                             newEnabledState ? "Global notifications enabled successfully." : "Global notifications muted.",
                             newEnabledState ? "success" : "warning",
                             "System Alerts"
                           );
                        }}
                        style={{ 
                          width: '56px', height: '30px', borderRadius: '20px', padding: '4px', cursor: 'pointer',
                          backgroundColor: notifications ? 'var(--primary)' : 'var(--border-color)',
                          transition: '0.3s', position: 'relative', border: '1px solid var(--border-color)'
                        }}
                     >
                        <div style={{ 
                           width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', 
                           position: 'absolute', left: notifications ? '30px' : '4px', transition: '0.3s',
                           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                     </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                       <label className="form-label" style={{ fontWeight: 800 }}>Institutional Name</label>
                       <input 
                         type="text" 
                         className="form-input" 
                         value={schoolName} 
                         onChange={(e) => setSchoolName(e.target.value)}
                         style={{ borderRadius: '12px' }} 
                       />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                       <label className="form-label" style={{ fontWeight: 800 }}>Support Email</label>
                       <input 
                         type="email" 
                         className="form-input" 
                         value={supportEmail} 
                         onChange={(e) => setSupportEmail(e.target.value)}
                         style={{ borderRadius: '12px' }} 
                       />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                       <label className="form-label" style={{ fontWeight: 800 }}>Institutional Website</label>
                       <div style={{ display: 'flex', gap: '10px' }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            value="https://edupro-elite.school.edu"
                            readOnly
                            style={{ borderRadius: '12px', flex: 1, backgroundColor: 'var(--bg-body)', cursor: 'not-allowed' }} 
                          />
                          <button 
                            onClick={() => window.open('/', '_blank')}
                            className="btn btn-secondary"
                            style={{ borderRadius: '12px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                          >
                             <Globe size={16} /> View Website
                          </button>
                       </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    onClick={handleSave}
                    disabled={saving}
                    style={{ width: '100%', padding: '16px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '14px' }}
                  >
                    {saving ? 'Synchronizing...' : <><Save size={18} /> Save All Changes</>}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '32px' }}>Security & Authentication</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Password Management */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <Lock size={18} color="var(--primary)" /> Change Root Password
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                       <input 
                         type="password" 
                         placeholder="Current Password" 
                         className="form-input" 
                         value={passwords.current}
                         onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                         style={{ borderRadius: '10px' }} 
                       />
                       <input 
                         type="password" 
                         placeholder="New Password" 
                         className="form-input" 
                         value={passwords.new}
                         onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                         style={{ borderRadius: '10px' }} 
                       />
                       <button 
                         className="btn btn-primary" 
                         style={{ borderRadius: '10px' }}
                         onClick={() => {
                           if (!passwords.current || !passwords.new) {
                             triggerToast('Please fill in both password fields.', 'error', 'Security Alert');
                             return;
                           }
                           triggerToast('Root administrative access password updated successfully.', 'success', 'Password Updated');
                           setPasswords({ current: '', new: '' });
                         }}
                       >
                         Update Key
                       </button>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

                  {/* Two Factor Auth */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                          <Fingerprint size={20} color="var(--primary)" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>Two-Factor Authentication (2FA)</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add an extra layer of security to administrator accounts.</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => {
                         const newState = !twoFactor;
                         setTwoFactor(newState);
                         localStorage.setItem('2faEnabled', newState.toString());
                         triggerToast(newState ? "Two-Factor authentication activated." : "Two-Factor authentication deactivated.", newState ? "success" : "warning", "Security Auth");
                       }} 
                       className="btn" 
                       style={{ 
                         backgroundColor: twoFactor ? 'var(--success-light)' : 'var(--bg-body)',
                         color: twoFactor ? 'var(--success)' : 'var(--text-muted)',
                         padding: '10px 20px', fontWeight: 800, borderRadius: '10px', border: '1px solid var(--border-color)'
                       }}
                     >
                        {twoFactor ? 'ACTIVE' : 'INACTIVE'}
                     </button>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

                  {/* Active Sessions */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Monitor size={18} color="var(--primary)" /> Active Management Sessions
                    </h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {sessions.map((session, i) => (
                          <motion.div 
                            key={session.id} 
                            layout
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}
                          >
                             <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <Monitor size={20} color="var(--text-muted)" />
                                <div>
                                   <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{session.device}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{session.location} • {session.ip}</div>
                                </div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: session.id === 1 ? 'var(--success)' : 'var(--text-muted)', marginBottom: '4px' }}>{session.status}</div>
                                {session.id !== 1 && (
                                  <button 
                                    onClick={() => {
                                      setSessions(sessions.filter(s => s.id !== session.id));
                                      triggerToast(`Revoked remote session for ${session.device} successfully.`, "success", "Session Terminated");
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}
                                  >
                                    LOGOUT
                                  </button>
                                )}
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '32px' }}>Notification Rules</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   {[
                     { id: 'examResults', label: 'Exam Result Alerts', desc: 'Notify parents when term results are published.', icon: <FileText size={20} /> },
                     { id: 'feeReminders', label: 'Fee Payment Reminders', desc: 'Automatic reminders for upcoming fee deadlines.', icon: <Smartphone size={20} /> },
                     { id: 'attendanceAlerts', label: 'Attendance Exceptions', desc: 'Instant alerts for student absence without leave.', icon: <AlertTriangle size={20} /> },
                     { id: 'eventNotices', label: 'Institutional Events', desc: 'Broadcast new events to the parent and student mobile apps.', icon: <MessageSquare size={20} /> }
                   ].map((rule) => (
                     <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', color: 'var(--primary)' }}>{rule.icon}</div>
                           <div>
                              <div style={{ fontWeight: 800 }}>{rule.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{rule.desc}</div>
                           </div>
                        </div>
                        <div 
                          onClick={() => {
                            const newRules = { ...rules, [rule.id]: !rules[rule.id] };
                            setRules(newRules);
                            localStorage.setItem('systemRules', JSON.stringify(newRules));
                            triggerToast(
                              !rules[rule.id] ? `${rule.label} is now active.` : `${rule.label} has been muted.`,
                              !rules[rule.id] ? "success" : "warning",
                              "Notification Rules"
                            );
                          }}
                          style={{ 
                            width: '48px', height: '26px', borderRadius: '20px', padding: '3px', cursor: 'pointer',
                            backgroundColor: rules[rule.id] ? 'var(--primary)' : 'var(--border-color)',
                            transition: '0.3s', position: 'relative'
                          }}
                        >
                           <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', left: rules[rule.id] ? '25px' : '3px', transition: '0.3s' }} />
                        </div>
                     </div>
                   ))}

                   <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0' }}></div>

                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px dashed var(--primary)' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={18} color="var(--primary)" /> SMS Gateway Status</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connected via: <strong>Twilio Enterprise API</strong></p>
                         <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--success)', padding: '4px 10px', backgroundColor: 'var(--success-light)', borderRadius: '8px' }}>ONLINE</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div key="data" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '32px' }}>Data Management & Backup</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {/* Backup Action */}
                   <div style={{ padding: '32px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
                      <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                         <HardDrive size={32} />
                      </div>
                      <h3 style={{ margin: '0 0 8px 0' }}>Instant System Backup</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Generate a complete archive of the school database including students, staff, and finance records.</p>
                      
                      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '16px', border: '1px solid var(--primary)', display: 'inline-block' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                          Next Scheduled Backup: {
                            backupFrequency === 'Daily' ? 'Tomorrow, 04:00 AM' : 
                            backupFrequency === 'Weekly' ? 'Sunday, 04:00 AM' : 
                            '1st of next month, 04:00 AM'
                          }
                        </p>
                      </div>

                      <button 
                        className="btn btn-primary" 
                        onClick={handleDownload}
                        style={{ padding: '14px 40px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}
                      >
                         <Download size={18} /> Download Backup (.SQL)
                      </button>
                   </div>

                   {/* Backup History */}
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                         <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><History size={18} color="var(--primary)" /> Automated Backup History</h4>
                         <button 
                           className="btn" 
                           onClick={() => setIsScheduleModalOpen(true)}
                           style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: 'none' }}
                         >
                           CONFIGURE SCHEDULE
                         </button>
                      </div>

                      {/* Schedule Modal */}
                      <AnimatePresence>
                        {isScheduleModalOpen && (
                          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', width: '400px', boxShadow: 'var(--shadow-2xl)' }}
                            >
                              <h3 style={{ margin: '0 0 8px 0' }}>Backup Schedule</h3>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Select the frequency for automated system backups.</p>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                {['Daily', 'Weekly', 'Monthly'].map(freq => (
                                  <div 
                                    key={freq}
                                    onClick={() => setBackupFrequency(freq)}
                                    style={{ 
                                      padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', 
                                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      backgroundColor: backupFrequency === freq ? 'var(--primary-light)' : 'transparent',
                                      borderColor: backupFrequency === freq ? 'var(--primary)' : 'var(--border-color)'
                                    }}
                                  >
                                    <span style={{ fontWeight: 700 }}>{freq} Backup</span>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: backupFrequency === freq ? 'var(--primary)' : 'transparent' }} />
                                  </div>
                                ))}
                              </div>

                              <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn" onClick={() => setIsScheduleModalOpen(false)} style={{ flex: 1, backgroundColor: 'var(--bg-body)' }}>Cancel</button>
                                <button className="btn btn-primary" onClick={() => {
                                  localStorage.setItem('backupFrequency', backupFrequency);
                                  setIsScheduleModalOpen(false);
                                  handleSave();
                                }} style={{ flex: 1 }}>Save Schedule</button>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         {[
                           { date: 'Today, 04:00 AM', size: '245 MB', type: 'Daily Auto', status: 'Success' },
                           { date: 'Yesterday, 04:00 AM', size: '242 MB', type: 'Daily Auto', status: 'Success' },
                           { date: '06 May 2026', size: '1.2 GB', type: 'Manual Global', status: 'Success' }
                         ].map((bk, i) => (
                           <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                 <Cloud size={18} color="var(--text-muted)" />
                                 <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{bk.date}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{bk.type} • {bk.size}</div>
                                 </div>
                              </div>
                              <button 
                                onClick={handleDownload}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                              >
                                <Download size={16} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

                   {/* Maintenance */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                         <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                           <RefreshCw size={20} color="var(--primary)" />
                         </div>
                         <div>
                           <h4 style={{ margin: 0 }}>Maintenance Mode</h4>
                           <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Disable public access while performing system updates.</p>
                         </div>
                      </div>
                       <button 
                          onClick={() => {
                            const newState = !isMaintenance;
                            setIsMaintenance(newState);
                            localStorage.setItem('maintenanceMode', newState.toString());
                            window.dispatchEvent(new Event('storage'));
                            triggerToast(newState ? "Maintenance mode activated. Public access disabled." : "Maintenance mode deactivated. Portal online.", newState ? "warning" : "success", "System Status");
                          }}
                          className="btn" 
                          style={{ 
                            backgroundColor: isMaintenance ? 'var(--danger-light)' : 'var(--bg-body)', 
                            color: isMaintenance ? 'var(--danger)' : 'var(--text-muted)', 
                            padding: '10px 20px', fontWeight: 800, borderRadius: '10px', border: '1px solid var(--border-color)' 
                          }}
                        >
                           {isMaintenance ? 'DEACTIVATE' : 'ACTIVATE'}
                        </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
