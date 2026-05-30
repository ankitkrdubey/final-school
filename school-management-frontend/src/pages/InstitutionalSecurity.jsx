import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Lock, Key, Globe, Eye, 
  Activity, Clock, Users, Server, Smartphone, 
  AlertTriangle, CheckCircle, Search, Filter, MoreVertical, LogOut, Sparkles, X, User
} from 'lucide-react';

import devonAvatar from '../assets/devon_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';

const InstitutionalSecurity = () => {
  const navigate = useNavigate();

  const getUserAvatar = (username) => {
    if (username.includes('SuperAdmin')) return eleanorAvatar;
    if (username.includes('Sarah')) return janeAvatar;
    if (username.includes('Rajesh')) return devonAvatar;
    if (username.includes('System')) return robertAvatar;
    return null;
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [is2FAAdmin, setIs2FAAdmin] = useState(true);
  const [is2FAFaculty, setIs2FAFaculty] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState('All');
  const [isLogFilterOpen, setIsLogFilterOpen] = useState(false);

  // System Security Diagnostics States
  const [showAuditConsole, setShowAuditConsole] = useState(false);
  const [isAuditingSystem, setIsAuditingSystem] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  const runSystemAuditSimulation = () => {
    setShowAuditConsole(true);
    setIsAuditingSystem(true);
    setAuditProgress(0);
    setTelemetryLogs([]);

    const steps = [
      "Initializing security telemetry probes across all active nodes...",
      "Verifying firewall integrity against known DDoS attack signatures...",
      "Scanning active database clusters for SQL injection vectors...",
      "Checking 2FA enforcement policies for administrative personnel...",
      "Analyzing geographical access vectors and IP blacklist databases...",
      "Validating SSL/TLS certificates and endpoint security tokens...",
      "Scanning cross-branch routers and physical gate access nodes...",
      "System integrity sweep completed. Status: 100% SECURE."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTelemetryLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`]);
        setAuditProgress(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsAuditingSystem(false);
        setShowToast("Global security sweep finalized successfully!");
        setTimeout(() => setShowToast(null), 3000);
      }
    }, 600);
  };

  const securityStats = [
    { label: 'Security Score', value: '98%', icon: <ShieldCheck size={20} />, color: '#10B981', trend: '+2% from last month' },
    { label: 'Active Threats', value: '0', icon: <ShieldAlert size={20} />, color: '#EF4444', trend: 'Clean for 12 days' },
    { label: 'Login Attempts', value: '1,240', icon: <Activity size={20} />, color: '#4880FF', trend: 'Last 24 hours' },
    { label: 'SSL Status', value: 'Active', icon: <Globe size={20} />, color: '#8B5CF6', trend: 'Expires in 320 days' }
  ];

  const auditLogs = [
    { id: 1, action: 'Role Updated', user: 'Admin_Sarah', target: 'Teacher Portal', ip: '192.168.1.45', time: '5 mins ago', status: 'Success' },
    { id: 2, action: 'Failed Login', user: 'Unknown', target: 'SuperAdmin', ip: '103.25.44.12', time: '12 mins ago', status: 'Blocked' },
    { id: 3, action: 'Bulk Delete', user: 'SuperAdmin_X', target: 'Notice Archive', ip: '192.168.1.10', time: '45 mins ago', status: 'Success' },
    { id: 4, action: 'Config Changed', user: 'Admin_Sarah', target: 'API Gateway', ip: '192.168.1.45', time: '2 hours ago', status: 'Pending' },
    { id: 5, action: 'MFA Verified', user: 'SuperAdmin_X', target: 'Financial Core', ip: '192.168.1.10', time: '3 hours ago', status: 'Success' },
    { id: 6, action: 'Backup Hashed', user: 'System_Daemon', target: 'AWS S3 Glacier', ip: '10.0.4.88', time: '5 hours ago', status: 'Success' },
    { id: 7, action: 'Brute Force', user: 'Botnet_Node', target: 'SSH Terminal', ip: '82.165.97.23', time: '8 hours ago', status: 'Blocked' },
    { id: 8, action: 'Password Reset', user: 'Admin_Rajesh', target: 'Payroll Module', ip: '192.168.2.31', time: '10 hours ago', status: 'Success' },
    { id: 9, action: 'API Token Expired', user: 'System_Daemon', target: 'OAuth2 Gateway', ip: '10.0.1.22', time: '14 hours ago', status: 'Pending' },
    { id: 10, action: 'Privilege Escalation', user: 'Hacker_Bot42', target: 'Root Shell', ip: '45.76.23.189', time: '22 hours ago', status: 'Blocked' }
  ];

  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome / Windows', location: 'Institutional Office', status: 'Current', time: 'Active' },
    { id: 2, device: 'Mobile App / iOS', location: 'San Francisco, CA', status: 'Mobile', time: '12 mins ago' }
  ]);

  const downloadSecurityReport = () => {
    const headers = ['ID', 'User', 'Action', 'Target', 'IP Address', 'Time', 'Status'];
    const csvContent = [
      headers.join(','),
      ...auditLogs.map(log => [log.id, log.user, log.action, log.target, log.ip, log.time, log.status].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `security_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ marginBottom: '32px' }}>
         <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Institutional Security</h1>
         <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Manage institutional protection, audit logs, and access control.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
         {securityStats.map((stat, i) => (
           <div key={i} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '14px', 
                backgroundColor: `${stat.color}15`, color: stat.color, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' 
              }}>
                 {stat.icon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: stat.color, fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <CheckCircle size={10} /> {stat.trend}
              </div>
           </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
         
         {/* Left Column - Audit Logs */}
         <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={20} color="var(--primary)" /> Security Audit Logs
               </h3>
               <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  <div className="search-bar" style={{ width: '200px', padding: '6px 12px' }}>
                     <Search size={14} className="text-muted" />
                     <input 
                       type="text" 
                       placeholder="Search logs..." 
                       className="search-input" 
                       style={{ fontSize: '0.8rem' }} 
                       value={logSearchTerm}
                       onChange={(e) => setLogSearchTerm(e.target.value)}
                     />
                  </div>
                  <button 
                    className="btn" 
                    onClick={() => setIsLogFilterOpen(!isLogFilterOpen)}
                    style={{ padding: '8px 12px', backgroundColor: logFilter !== 'All' ? 'var(--primary-light)' : 'var(--bg-body)', color: logFilter !== 'All' ? 'var(--primary)' : 'var(--text-muted)' }}
                  >
                    <Filter size={16} />
                  </button>

                  <AnimatePresence>
                    {isLogFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        style={{ position: 'absolute', top: '110%', right: 0, width: '160px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', padding: '6px', zIndex: 100 }}
                      >
                        {['All', 'Success', 'Blocked', 'Pending'].map(f => (
                          <div 
                            key={f}
                            onClick={() => { setLogFilter(f); setIsLogFilterOpen(false); }}
                            style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', backgroundColor: logFilter === f ? 'var(--primary-light)' : 'transparent', color: logFilter === f ? 'var(--primary)' : 'var(--text-main)' }}
                          >
                            {f} Status
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>User</th>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>Action</th>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>Target</th>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>IP Address</th>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>Time</th>
                     <th style={{ textAlign: 'left', padding: '12px 0' }}>Status</th>
                  </tr>
               </thead>
               <tbody>
                  {auditLogs.filter(log => {
                    const matchesSearch = log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) || 
                                         log.user.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                                         log.target.toLowerCase().includes(logSearchTerm.toLowerCase());
                    const matchesFilter = logFilter === 'All' || log.status === logFilter;
                    return matchesSearch && matchesFilter;
                  }).map((log) => (
                    <tr key={log.id}>
                       <td style={{ padding: '16px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={{ 
                               width: '32px', 
                               height: '32px', 
                               borderRadius: '50%', 
                               overflow: 'hidden', 
                               backgroundColor: 'var(--primary-light)', 
                               color: 'var(--primary)', 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center', 
                               fontSize: '0.75rem', 
                               fontWeight: 800,
                               border: '1px solid var(--border-color)'
                             }}>
                               {getUserAvatar(log.user) ? (
                                 <img 
                                   src={getUserAvatar(log.user)} 
                                   alt={log.user} 
                                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                 />
                               ) : (
                                 log.user.charAt(0)
                               )}
                             </div>
                             <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.user}</span>
                          </div>
                       </td>
                       <td style={{ fontSize: '0.9rem', fontWeight: 600 }}>{log.action}</td>
                       <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{log.target}</td>
                       <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.ip}</td>
                       <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.time}</td>
                       <td>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: log.status === 'Success' ? '#10B98115' : (log.status === 'Blocked' ? '#EF444415' : '#F59E0B15'),
                            color: log.status === 'Success' ? '#10B981' : (log.status === 'Blocked' ? '#EF4444' : '#F59E0B')
                          }}>
                             {log.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button 
                 className="btn" 
                 onClick={downloadSecurityReport}
                 style={{ flex: 1, backgroundColor: 'var(--bg-body)', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px', fontWeight: 800, justifyContent: 'center', cursor: 'pointer' }}
              >
                 DOWNLOAD REPORT
              </button>
              
              <motion.button 
                whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 12px 20px -8px rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="btn" 
                onClick={runSystemAuditSimulation}
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '14px', 
                  padding: '14px', 
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={16} />
                <span>RE-RUN SECURITY AUDIT</span>
              </motion.button>
            </div>
         </div>

         {/* Right Column - Controls */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* 2FA Enforcement */}
            <div className="card" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Smartphone size={18} color="#F59E0B" /> 2FA Enforcement
               </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Mandatory for Admins</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required to access sensitive modules.</div>
                  </div>
                  <div 
                    onClick={() => {
                      setIs2FAAdmin(!is2FAAdmin);
                      setShowToast(`Admin 2FA ${!is2FAAdmin ? 'Enforced' : 'Disabled'}`);
                      setTimeout(() => setShowToast(null), 3000);
                    }}
                    style={{ 
                      width: '40px', height: '22px', borderRadius: '20px', position: 'relative', cursor: 'pointer',
                      backgroundColor: is2FAAdmin ? 'var(--primary)' : 'var(--border-color)',
                      transition: '0.3s ease'
                    }}
                  >
                     <div style={{ 
                       width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', 
                       position: 'absolute', top: '2px', transition: '0.3s ease',
                       left: is2FAAdmin ? '20px' : '2px'
                     }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Mandatory for Faculty</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encouraged for grade security.</div>
                  </div>
                  <div 
                    onClick={() => {
                      setIs2FAFaculty(!is2FAFaculty);
                      setShowToast(`Faculty 2FA ${!is2FAFaculty ? 'Enforced' : 'Disabled'}`);
                      setTimeout(() => setShowToast(null), 3000);
                    }}
                    style={{ 
                      width: '40px', height: '22px', borderRadius: '20px', position: 'relative', cursor: 'pointer',
                      backgroundColor: is2FAFaculty ? 'var(--primary)' : 'var(--border-color)',
                      transition: '0.3s ease'
                    }}
                  >
                     <div style={{ 
                       width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', 
                       position: 'absolute', top: '2px', transition: '0.3s ease',
                       left: is2FAFaculty ? '20px' : '2px'
                     }}></div>
                  </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Server size={18} color="var(--primary)" /> Active Sessions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {activeSessions.map((session) => (
                     <motion.div 
                       key={session.id}
                       layout
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 10 }}
                       style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}
                     >
                        <div>
                           <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{session.device}</div>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{session.location}</div>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveSessions(activeSessions.filter(s => s.id !== session.id));
                            setShowToast(`Session Revoked: ${session.device}`);
                            setTimeout(() => setShowToast(null), 3000);
                          }}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem', fontWeight: 800, color: 'var(--danger)', cursor: 'pointer', backgroundColor: 'white' }}
                        >
                          REVOKE
                        </button>
                     </motion.div>
                   ))}
                   {activeSessions.length === 0 && (
                     <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                        No other active sessions detected.
                     </div>
                   )}
                </div>
            </div>

            {/* Firewall Info */}
            <div className="card" style={{ padding: '24px', backgroundColor: '#1E293B', color: 'white', border: 'none' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} /> Global Firewall
               </h3>
               <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '20px' }}>
                  Protecting institutional data from SQL injection, XSS, and unauthorized API requests.
               </p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>DDoS Protection Active</span>
               </div>
            </div>

            {/* Global Logout Action */}
            <div className="card" style={{ padding: '24px', border: '2px solid rgba(239, 68, 68, 0.1)', backgroundColor: 'rgba(239, 68, 68, 0.02)', marginTop: '32px' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)' }}>
                  <LogOut size={18} /> Emergency Terminal
               </h3>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Terminate all active institutional sessions and securely logout from the administrative portal.
               </p>
               <button 
                 onClick={() => {
                   import('../services/service').then(m => {
                     m.logout();
                     navigate('/login', { state: { showLogoutToast: true } });
                   });
                 }}
                 style={{ 
                   width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                   backgroundColor: 'var(--danger)', color: 'white', fontWeight: 800,
                   cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                   boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.4)'
                 }}
               >
                  <LogOut size={18} /> LOGOUT SESSION
               </button>
            </div>
         </div>

      </div>

      {/* System Security Diagnostics Modal */}
      <AnimatePresence>
        {showAuditConsole && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => !isAuditingSystem && setShowAuditConsole(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)' }}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ 
                position: 'relative', width: '100%', maxWidth: '640px', 
                backgroundColor: '#0a0e17', borderRadius: '32px', padding: '40px', 
                boxShadow: '0 30px 100px rgba(139, 92, 246, 0.25)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#f8fafc',
                overflow: 'hidden',
                zIndex: 10
              }}
            >
              {/* Glow Accent */}
              <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 950, letterSpacing: '-0.5px' }}>Global Security Sweep</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active telemetry scan & threat vectors sweep</p>
                  </div>
                </div>
                <button 
                  disabled={isAuditingSystem}
                  onClick={() => setShowAuditConsole(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAuditingSystem ? 'not-allowed' : 'pointer', color: '#cbd5e1' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Info Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>Security Level</span>
                  <strong style={{ fontSize: '1rem', color: '#8B5CF6', fontWeight: 900 }}>ALPHA GATEWAY</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>Threat Index</span>
                  <strong style={{ fontSize: '1rem', color: '#10b981', fontWeight: 900 }}>0 ACTIVE VECTORS</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>MFA Policy</span>
                  <strong style={{ fontSize: '1rem', color: '#10b981', fontWeight: 950 }}>ENFORCED</strong>
                </div>
              </div>

              {/* Progress Sweep Bar */}
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', color: '#cbd5e1' }}>
                  <span>System Nodes Sweep</span>
                  <span style={{ color: '#8B5CF6' }}>{auditProgress}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${auditProgress}%` }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #45b3e0 0%, #8B5CF6 100%)', borderRadius: '100px', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}
                  />
                </div>
              </div>

              {/* Monospace Console Screen */}
              <div style={{ 
                height: '180px', backgroundColor: '#05070c', borderRadius: '20px', 
                padding: '20px', border: '1px solid rgba(255,255,255,0.08)', 
                overflowY: 'auto', display: 'flex', flexDirection: 'column', 
                gap: '8px', fontFamily: '"Fira Code", monospace, "Courier New"', fontSize: '0.8rem', 
                lineHeight: 1.5, color: '#a7f3d0', marginBottom: '28px'
              }}>
                {telemetryLogs.map((log, idx) => (
                  <div key={idx} style={{ 
                    color: log.includes('sweep completed') ? '#34d399' : log.includes('Initializing') ? '#45b3e0' : log.includes('Checking') ? '#fbbf24' : '#cbd5e1'
                  }}>
                    {log}
                  </div>
                ))}
                
                {isAuditingSystem && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#8B5CF6', fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#8B5CF6', borderRadius: '50%' }}></span>
                    SCANNING CLUSTERS...
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                <button 
                  disabled={isAuditingSystem}
                  onClick={() => setShowAuditConsole(false)}
                  style={{ padding: '14px 28px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#cbd5e1', fontWeight: 800, fontSize: '0.85rem', cursor: isAuditingSystem ? 'not-allowed' : 'pointer', transition: '0.2s' }}
                >
                  Close Console
                </button>
                <motion.button 
                  whileHover={isAuditingSystem ? {} : { scale: 1.05, translateY: -2, boxShadow: '0 12px 24px rgba(139, 92, 246, 0.4)' }}
                  whileTap={isAuditingSystem ? {} : { scale: 0.95 }}
                  disabled={isAuditingSystem}
                  onClick={runSystemAuditSimulation}
                  style={{ 
                    padding: '14px 24px', borderRadius: '14px', border: 'none', 
                    background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)', 
                    color: '#ffffff', 
                    fontWeight: 900, fontSize: '0.85rem', cursor: isAuditingSystem ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.35)',
                    transition: 'box-shadow 0.2s ease, opacity 0.2s ease',
                    opacity: isAuditingSystem ? 0.6 : 1
                  }}
                >
                  <Sparkles size={16} style={{ animation: isAuditingSystem ? 'spin 1.5s linear infinite' : 'none' }} /> 
                  <span>{isAuditingSystem ? 'Analyzing node packets...' : 'Re-run Security Audit'}</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* Security Toast */}
       <AnimatePresence>
         {showToast && (
           <motion.div 
             initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
             style={{ 
               position: 'fixed', bottom: '40px', left: '50%', zIndex: 1300,
               backgroundColor: 'var(--primary)', color: 'white', padding: '16px 32px',
               borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px',
               boxShadow: '0 10px 30px -5px rgba(79, 70, 229, 0.4)', fontWeight: 800,
               fontSize: '1rem', letterSpacing: '0.5px'
             }}
           >
             <ShieldCheck size={20} strokeWidth={3} /> {showToast.toUpperCase()}
           </motion.div>
         )}
       </AnimatePresence>
    </motion.div>
  );
};

export default InstitutionalSecurity;
