/* EduPro Elite - Ultra-Premium Attendance Reports Portal v3.0 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, Users,
  Calendar, FileText, UserCheck, AlertCircle,
  X, Scan, ShieldAlert, CheckCircle2, MessageSquare
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const AttendanceReports = () => {
  const navigate = useNavigate();
  // --- STATE SYSTEM ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [showToast, setShowToast] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    avgAttendance: 92.4,
    absenteeism: 14,
    leavesPending: 8
  });

  // Triage items for critical absenteeism alerts
  const [triageStudents, setTriageStudents] = useState([
    { id: 1, name: 'Liam Watson', grade: 'Grade 12 Physics', rate: '82%', status: 'Critical', parentAlerted: false },
    { id: 2, name: 'Sofia Martinez', grade: 'Grade 10 Calculus', rate: '79%', status: 'Critical', parentAlerted: false },
    { id: 3, name: 'Jackson Miller', grade: 'Grade 11 Chemistry', rate: '84%', status: 'Warning', parentAlerted: false },
    { id: 4, name: 'Emma Davis', grade: 'Grade 9 Biology', rate: '75%', status: 'Critical', parentAlerted: false },
    { id: 5, name: 'Noah Wilson', grade: 'Grade 12 Geometry', rate: '81%', status: 'Warning', parentAlerted: false }
  ]);

  const [triageOpen, setTriageOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [thresholdSlider, setThresholdSlider] = useState(85);
  const [scannerProgress, setScannerProgress] = useState(null);
  const [showScanCert, setShowScanCert] = useState(false);

  // Batch compilation telemetry states
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLogs, setBatchLogs] = useState([]);
  const [batchStatus, setBatchStatus] = useState('idle');

  // Click outside to dismiss category dropdown
  useEffect(() => {
     const dismissFilters = () => setCategoryFilterOpen(false);
     window.addEventListener('click', dismissFilters);
     return () => window.removeEventListener('click', dismissFilters);
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // --- INTERACTION LOGIC ---

  // Category filter select handler
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    triggerToast(`Filter Configured: ${cat.toUpperCase()}`);
  };

  // 1. Batch telemetry generator
  const runBatchTelemetry = () => {
    setBatchOpen(true);
    setBatchStatus('running');
    setBatchProgress(0);
    setBatchLogs([]);

    const steps = [
      { p: 15, m: '[TELEMETRY] Querying classroom attendance logs...' },
      { p: 35, m: '[MATH] Computing class-wise absenteeism matrices and averages... OK' },
      { p: 60, m: '[HR] Scanning faculty leave patterns and pending approvals...' },
      { p: 80, m: '[INTELLIGENCE] Compilating early departure & late entry index vectors... VERIFIED' },
      { p: 100, m: '[SYSTEM] Batch compilation complete. Cohort logs synchronised.' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setBatchProgress(step.p);
        setBatchLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${step.m}`]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setBatchStatus('completed');
        triggerToast('Batch Report Compiled');
      }
    }, 450);
  };

  // 2. Export full summary database to CSV
  const handleExportCSV = () => {
    const header = "REPORT ID,REPORT TEMPLATE,AUDIT CATEGORY,LAST GEN,COHORT AVG,VERIFICATION\n";
    const rows = attendanceTemplates.map((t, idx) => {
       return `REP-2026-0${idx+1},"${t.title}",${t.type},${t.lastGen},${stats.avgAttendance}%,COMPLIANT`;
    }).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", "institutional-attendance-audit-ledger.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Audit CSV Exported');
  };

  // 3. Issue Parent SMS alerts for low attendance
  const issueParentSMS = (id, name) => {
    setTriageStudents(prev => prev.map(student => {
      if (student.id === id) {
         return { ...student, parentAlerted: true };
      }
      return student;
    }));

    setTimeout(() => {
      // Remove notified student, decrement absenteeism counts
      setTriageStudents(prev => prev.filter(s => s.id !== id));
      setStats(prev => ({
         ...prev,
         absenteeism: Math.max(0, prev.absenteeism - 1)
      }));
      triggerToast(`SMS Alert Dispatched to ${name}'s Parent`);
    }, 1200);
  };

  // 4. Download individual template logs as CSV
  const handleDownloadCSV = (template, e) => {
    if (e) e.stopPropagation();
    
    // Create structured mock serial data based on template type
    const header = "COHORT ID,STUDENT NAME,PRESENT DAYS,ABSENT DAYS,LEAVE PERCENTAGE,VERIFICATION\n";
    const rows = [
      `STD-042,Liam Watson,120 Days,24 Days,83%,CRITICAL`,
      `STD-109,Sofia Martinez,115 Days,29 Days,79%,CRITICAL`,
      `STD-311,Jackson Miller,134 Days,10 Days,93%,OPTIMAL`,
      `STD-842,Emma Davis,110 Days,34 Days,76%,CRITICAL`
    ].join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `${template.title.toLowerCase().replace(/\s+/g, '-')}-log.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast(`${template.type} Logs CSV Downloaded`);
  };

  // 5. Template drawer preview details
  const openTemplateDrawer = (template) => {
     setSelectedTemplate(template);
     setThresholdSlider(85);
     setScannerProgress(null);
     setShowScanCert(false);
  };

  // Run custom drawer diagnostics
  const runTemplateDiagnostics = () => {
    setScannerProgress(0);
    const interval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
             setScannerProgress(null);
             setShowScanCert(true);
             triggerToast('HR Compliance Scan Complete');
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Download custom asset certificate
  const downloadAssetCertificate = (template) => {
    const certText = `==================================================
EDUPRO ELITE INSTITUTIONAL ATTENDANCE INTEGRITY CERTIFICATE
==================================================
Report: ${template.title}
HR Category: ${template.type}
Average Attendance: ${stats.avgAttendance}%
Alert Threshold: ${thresholdSlider}%
Audit Signature HASH: 0xFD49EA3C872D1E04B76C12A09B

Status Statement: This attendance summary compiles with national educational parameters and has been calibrated at ${thresholdSlider}% alert threshold outcomes.
Generated on: ${new Date().toLocaleString()}
==================================================`;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(certText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${template.title.toLowerCase().replace(/\s+/g, '-')}-compliance-cert.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- Mock Templates & Filtering Data ---
  const attendanceTemplates = [
    { title: 'Monthly Student Attendance Summary', type: 'Academic', lastGen: '1 day ago', totalUnits: '1,450 Students', active: '1,200', condition: 'Optimal', manager: 'Admin Services' },
    { title: 'Staff Leave Utilization Report', type: 'HR', lastGen: '3 days ago', totalUnits: '82 Faculty', active: '74', condition: 'Stable', manager: 'HR Lead' },
    { title: 'Class-wise Absenteeism Trends', type: 'Analytical', lastGen: '5 days ago', totalUnits: '18 Cohorts', active: '12', condition: 'Stable', manager: 'Principal Office' },
    { title: 'Departmental Attendance Audit', type: 'Operational', lastGen: '1 week ago', totalUnits: '6 Branches', active: '6', condition: 'Optimal', manager: 'IT Director' },
    { title: 'Early Departure & Late Entry Logs', type: 'Security', lastGen: '10 days ago', totalUnits: '8 Gates', active: '8', condition: 'Optimal', manager: 'Chief Security Officer' },
    { title: 'Annual Attendance Percentage', type: 'Archive', lastGen: '1 month ago', totalUnits: '12 Terms', active: '12', condition: 'Good', manager: 'Registry Office' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? attendanceTemplates 
    : attendanceTemplates.filter(t => t.type.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-main)', position: 'relative' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ position: 'fixed', bottom: '40px', left: '50%', zIndex: 2500, backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', padding: '16px 32px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xl)', fontWeight: 800, fontSize: '0.9rem', border: '1px solid var(--border-color)' }}
          >
            <CheckCircle2 size={18} color="#f59e0b" />
            {showToast.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f59e0b15', borderRadius: '30px', color: '#f59e0b', fontWeight: 950, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '24px' }}>
             <Clock size={14} /> ATTENDANCE & HR AUDIT v3.0
          </div>
          <h1 style={{ fontSize: '4.2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-4px', lineHeight: 0.9, marginBottom: '16px' }}>
             Attendance <span style={{ color: '#f59e0b' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px' }}>Comprehensive absenteeism analysis and staff leave auditing.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
             onClick={runBatchTelemetry}
             style={{ padding: '16px 32px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
           >
              <Calendar size={18} /> Generate Batch
           </button>
           <button 
             onClick={handleExportCSV}
             style={{ padding: '16px 32px', borderRadius: '20px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)', transition: '0.3s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
           >
              <Download size={18} /> Export CSV
           </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
         {[
           { label: 'Avg. Attendance Rate', value: `${stats.avgAttendance}%`, trend: '+0.8%', icon: UserCheck, color: '#10b981', clickable: false },
           { label: 'Critical Absenteeism', value: stats.absenteeism < 10 ? `0${stats.absenteeism}` : stats.absenteeism, trend: 'Triage Required', icon: AlertCircle, color: '#ef4444', clickable: true },
           { label: 'Total Leaves Pending', value: stats.leavesPending < 10 ? `0${stats.leavesPending}` : stats.leavesPending, trend: 'Stable', icon: Calendar, color: '#6366f1', clickable: true },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             whileHover={{ y: -6, boxShadow: 'var(--shadow-md)' }} 
             onClick={() => {
               if (stat.clickable) {
                 if (stat.label === 'Critical Absenteeism') {
                   setTriageOpen(true);
                 } else if (stat.label === 'Total Leaves Pending') {
                   triggerToast('Navigating to Pending Leaves Registry...');
                   setTimeout(() => navigate('/dashboard/leave-request'), 1000);
                 }
               }
             }}
             style={{ 
               backgroundColor: 'var(--bg-card)', 
               padding: '32px', 
               borderRadius: '32px', 
               border: stat.clickable ? `1px solid ${stat.color}40` : '1px solid var(--border-color)', 
               position: 'relative',
               cursor: stat.clickable ? 'pointer' : 'default',
               boxShadow: stat.clickable ? `0 10px 25px ${stat.color}10` : 'none'
             }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div animate={stat.clickable ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                       <stat.icon size={22} />
                    </motion.div>
                 </div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: stat.clickable ? '#ef444415' : '#10b98115', color: stat.clickable ? '#ef4444' : '#10b981', padding: '4px 10px', borderRadius: '10px' }}>
                    {stat.trend}
                 </span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
           </motion.div>
         ))}
      </div>

      {/* Templates Section Table Wrapper */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         
         {/* Table Header Filter controls */}
         <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>HR Template Repository</h3>
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
               
               {/* Categories filter button trigger */}
               <div 
                 onClick={(e) => { e.stopPropagation(); setCategoryFilterOpen(!categoryFilterOpen); }}
                 style={{ padding: '10px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                  <Filter size={14} /> View: <strong style={{ color: 'var(--text-main)' }}>{selectedCategory.toUpperCase()}</strong>
               </div>
               
               {/* Dropdown overlay */}
               <AnimatePresence>
                 {categoryFilterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', right: 0, top: '48px', zIndex: 120, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '8px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '4px', width: '180px' }}
                    >
                       {['all', 'Academic', 'HR', 'Analytical', 'Operational', 'Security', 'Archive'].map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => handleCategorySelect(cat.toLowerCase())}
                            style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} 
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                             {cat === 'all' ? 'Show All' : cat}
                          </button>
                       ))}
                    </motion.div>
                 )}
               </AnimatePresence>

                <div 
                  onClick={() => {
                    triggerToast('Navigating to Audited HR Registry...');
                    setTimeout(() => navigate('/dashboard/employees'), 1000);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: 'var(--text-main)', borderRadius: '12px', color: 'var(--bg-card)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                   <Users size={14} /> Staff Portal
                </div>
            </div>
         </div>

         {/* Templates Grid List */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '0' }}>
            {filteredTemplates.map((template, i) => (
              <div 
                key={i} 
                onClick={() => openTemplateDrawer(template)}
                style={{ 
                  padding: '32px 40px', 
                  borderBottom: '1px solid var(--border-color)', 
                  borderRight: i % 2 === 0 ? '1px solid var(--border-color)' : 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  transition: '0.3s', 
                  cursor: 'pointer' 
                }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#f59e0b12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                       <BarChart3 size={22} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.05rem', letterSpacing: '-0.3px', marginBottom: '4px' }}>{template.title}</div>
                       <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{template.type} • Updated: {template.lastGen}</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => openTemplateDrawer(template)}
                      style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: '0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    >
                       Preview
                    </button>
                    <button 
                      onClick={(e) => handleDownloadCSV(template, e)}
                      style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                    >
                       <Download size={15} />
                    </button>
                 </div>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
               <div style={{ padding: '60px', gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                  No templates found matching your query filter.
               </div>
            )}
         </div>
      </div>

      {/* --- OVERLAY MODALS --- */}

      {/* 1. Attendance Preview Drawer overlay */}
      <AnimatePresence>
        {selectedTemplate && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1800, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedTemplate(null)}
          >
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={(e) => e.stopPropagation()}
               style={{ backgroundColor: 'var(--bg-card)', width: '500px', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '40px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f59e0b12', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} /></div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedTemplate.title}</h3>
                   </div>
                   <button onClick={() => setSelectedTemplate(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '8px' }}>
                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>COHORT SCOPE</div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-main)' }}>{selectedTemplate.totalUnits}</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>REGISTRY AUDIT</div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#10b981' }}>{selectedTemplate.condition}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>AUTHORIZED INVENTORY MANAGER</div>
                         <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedTemplate.manager}</div>
                      </div>
                   </div>

                   {/* Absenteeism Alert threshold slider */}
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Absenteeism Alert Threshold</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 950, color: '#f59e0b' }}>{thresholdSlider}%</span>
                      </div>
                      <input 
                         type="range" min="50" max="95" value={thresholdSlider} 
                         onChange={(e) => setThresholdSlider(parseInt(e.target.value))}
                         style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '6px' }}>
                         <span>Standard Warning</span>
                         <span>Severe Boundary</span>
                      </div>
                   </div>

                   {/* Real-time slider feedback projections */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>ESTIMATED ALERTS</div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {Math.round((95 - thresholdSlider) * 0.4)} Alerts
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 800, marginTop: '4px' }}>Projected anomalies</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>CRITICAL INDEX</div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {thresholdSlider > 85 ? 'HIGH' : thresholdSlider > 70 ? 'MED' : 'LOW'}
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 800, marginTop: '4px' }}>Audit threshold priority</div>
                      </div>
                   </div>

                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>HR TELEMETRY SCOPES</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                         <span>Active Tracking: <strong>{selectedTemplate.active}</strong></span>
                         <span>Registry Condition: <strong>{selectedTemplate.condition}</strong></span>
                      </div>
                   </div>

                   <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      {scannerProgress === null ? (
                         <button 
                            onClick={runTemplateDiagnostics}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                         >
                            <Scan size={18} /> Trigger Compliance Integrity Audit
                         </button>
                      ) : (
                         <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid #f59e0b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
                               <span>SWEEPING ATTENDANCE COMPLIANCE VAULTS...</span>
                               <span>{scannerProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                               <div style={{ width: `${scannerProgress}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                            </div>
                         </div>
                      )}

                      {showScanCert && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', padding: '16px', backgroundColor: '#10b98115', border: '1px solid #10b981', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>COHORT ATTENDANCE AUDITED</div>
                               <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Secured against EDUPRO HR hooks</div>
                            </div>
                            <button 
                               onClick={() => downloadAssetCertificate(selectedTemplate)}
                               style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                               Export Cert
                            </button>
                         </motion.div>
                      )}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Absenteeism Triage Drawer overlay */}
      <AnimatePresence>
        {triageOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1800, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setTriageOpen(false)}
          >
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={(e) => e.stopPropagation()}
               style={{ backgroundColor: 'var(--bg-card)', width: '550px', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '40px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ef444415', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={20} /></div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Absenteeism Triage Control</h3>
                   </div>
                   <button onClick={() => setTriageOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                   <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>
                      The following student records have fallen below the baseline daily check-in margin. Click <strong>Issue SMS Outreach Alert</strong> to dynamically disburse notifications to parents.
                   </p>
                   {triageStudents.map((student) => (
                      <div key={student.id} style={{ padding: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                               <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{student.name}</div>
                               <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 650, marginTop: '2px' }}>Cohort: {student.grade}</div>
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, backgroundColor: '#ef444415', color: '#ef4444', padding: '4px 8px', borderRadius: '8px' }}>
                               {student.status.toUpperCase()}
                            </span>
                         </div>
                         <div style={{ borderTop: '1px dotted var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                               Attendance Rate: <strong style={{ color: '#ef4444' }}>{student.rate}</strong> | Parent Alert: <strong>{student.parentAlerted ? 'Dispatched' : 'Pending'}</strong>
                            </div>
                            <button 
                               onClick={() => issueParentSMS(student.id, student.name)}
                               disabled={student.parentAlerted}
                               style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: student.parentAlerted ? 'var(--border-color)' : '#f59e0b', color: student.parentAlerted ? 'var(--text-muted)' : 'white', fontWeight: 850, fontSize: '0.7rem', cursor: student.parentAlerted ? 'not-allowed' : 'pointer' }}
                            >
                               {student.parentAlerted ? 'Alerting...' : 'Issue SMS Outreach'}
                            </button>
                         </div>
                      </div>
                   ))}

                   {triageStudents.length === 0 && (
                      <div style={{ padding: '40px', backgroundColor: '#10b98115', border: '1px solid #10b981', borderRadius: '24px', textAlign: 'center', color: '#10b981', fontWeight: 800 }}>
                         All critical absenteeism records are successfully Triaged! No further anomalies found.
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Batch Telemetry Compilation logs console modal */}
      <AnimatePresence>
        {batchOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 1900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               style={{ backgroundColor: '#090d16', border: '2px solid #f59e0b', borderRadius: '32px', width: '600px', maxWidth: '100%', padding: '40px', color: '#f59e0b', fontFamily: 'monospace', boxShadow: '0 20px 50px rgba(245, 158, 11, 0.2)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', paddingBottom: '20px', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Calendar size={24} />
                      <span style={{ fontSize: '1.2rem', fontWeight: 950, letterSpacing: '1px' }}>BATCH RUN COMPILATION</span>
                   </div>
                   <button 
                      onClick={() => setBatchOpen(false)} 
                      disabled={batchStatus === 'running'}
                      style={{ background: 'none', border: '1px solid rgba(245, 158, 11, 0.5)', color: '#f59e0b', width: '36px', height: '36px', borderRadius: '8px', cursor: batchStatus === 'running' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   >
                      X
                   </button>
                </div>

                <div style={{ backgroundColor: '#020408', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', height: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '0.8rem', color: '#f59e0b' }}>
                   {batchLogs.length === 0 && <div>[READY] Awaiting purge signal for metadata database files...</div>}
                   {batchLogs.map((log, idx) => (
                      <div key={idx} style={{ lineBreak: 'anywhere' }}>{log}</div>
                   ))}
                   {batchStatus === 'running' && <div className="animate-pulse">_</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ width: '60%' }}>
                      {batchStatus === 'running' && (
                         <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                               <span>SYNCHRONISING CLASS LEDGERS...</span>
                               <span>{batchProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                               <div style={{ width: `${batchProgress}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                            </div>
                         </div>
                      )}
                      {batchStatus === 'completed' && <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>BATCH COMPILATION SUCCESSFUL [OPTIMAL INTEGRITY]</span>}
                   </div>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                         onClick={runBatchTelemetry}
                         disabled={batchStatus === 'running'}
                         style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 900, cursor: batchStatus === 'running' ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}
                      >
                         {batchStatus === 'completed' ? 'Re-Run Batch' : batchStatus === 'running' ? 'Compiling...' : 'Run Batch'}
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceReports;
