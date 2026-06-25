import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, BarChart3, PieChart, Users, Landmark, GraduationCap, Clock, Download, ExternalLink, FileSpreadsheet, FileJson, Search, Filter, ChevronRight, Activity, Calendar, Check, X, Eye, Box, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const chartData = [
  { name: 'Jan', value: 400, trend: 240 },
  { name: 'Feb', value: 300, trend: 139 },
  { name: 'Mar', value: 200, trend: 980 },
  { name: 'Apr', value: 278, trend: 390 },
  { name: 'May', value: 189, trend: 480 },
  { name: 'Jun', value: 239, trend: 380 },
  { name: 'Jul', value: 349, trend: 430 },
];

const AdvancedReports = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(null);
  
  // Dynamic Processing & Simulation parameters
  const [processingItems, setProcessingItems] = useState({});
  const [activeProcessingItem, setActiveProcessingItem] = useState(null);
  const [activeTemplateList, setActiveTemplateList] = useState(null); // { title, color, templates }
  const [previewReport, setPreviewReport] = useState(null);
  
  // Custom navigation overlays
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingOverlayText, setLoadingOverlayText] = useState('');

  // Stateful Recent Exports ledger
  const [exportsList, setExportsList] = useState([
    { name: 'Annual Academic Audit 2025', date: '2 days ago', type: 'PDF', size: '2.4 MB' },
    { name: 'Q1 Fee Reconciliation', date: '5 days ago', type: 'XLSX', size: '1.1 MB' },
    { name: 'Staff Performance Index', date: '1 week ago', type: 'PDF', size: '3.8 MB' }
  ]);

  // Stateful Custom Report Builder variables
  const [customReportName, setCustomReportName] = useState('');
  const [customModules, setCustomModules] = useState(['Academics', 'Finance']); 
  const [customFormat, setCustomFormat] = useState('PDF Document');

  const [filters, setFilters] = useState({
    dateRange: 'All Time',
    status: 'All',
    category: 'All',
    type: 'All'
  });

  const categoryTemplates = {
    'Academic Analytics': ['Semester GPA Trends', 'Course Completion Audit', 'Teacher Efficacy Index', 'Cohort Growth Analysis'],
    'Finance & Accounts': ['Fee Collection Summary', 'Payroll Disbursement Audit', 'Revenue Projection 2026', 'Vendor Expense Tracking'],
    'Attendance & HR': ['Monthly Staff Leave', 'Student Absenteeism Heatmap', 'Employee Performance Index', 'Overtime Correlation'],
    'Institutional Assets': ['Inventory Stock Levels', 'Fleet Maintenance Schedule', 'Library Resource Utilization', 'Lab Equipment Audit'],
    'Student Reporting': ['Behavioral Incident Tracking', 'Scholarship Eligibility List', 'Extracurricular Engagement', 'Health & Wellness Audit'],
    'Universal Reporting': ['Cross-Module Pivot Table', 'Custom API Payload Export', 'Scheduled Email Summary', 'Ad-hoc Filtered Set']
  };

  const showToastNotification = (message) => {
    setShowToast(message);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Helper text report download trigger
  const handleExportText = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Dynamic context-aware reports generator
  const getTemplateData = (templateName) => {
    if (templateName.includes('GPA') || templateName.includes('Academic') || templateName.includes('Efficacy') || templateName.includes('Growth')) {
      return {
        title: templateName,
        subtitle: 'Comparative analysis of academic scoring distributions across Grade 10-12 blocks',
        category: 'Academic Analytics',
        stats: [
          { s: 'Grade 10 Semester GPA Average', m: '3.42 GPA', v: '+0.12', e: 'Optimal' },
          { s: 'Grade 11 Semester GPA Average', m: '3.24 GPA', v: '-0.05', e: 'Review' },
          { s: 'Grade 12 Semester GPA Average', m: '3.58 GPA', v: '+0.18', e: 'Optimal' },
          { s: 'Cohort Standard Deviation', m: '0.24 SD', v: '-0.02', e: 'Optimal' }
        ],
        chartData: [
          { name: 'Term 1', value: 3.1, trend: 3.0 },
          { name: 'Term 2', value: 3.25, trend: 3.1 },
          { name: 'Term 3', value: 3.42, trend: 3.2 },
          { name: 'Term 4', value: 3.58, trend: 3.3 }
        ],
        chartTitle: 'COHORT GPA ACCREDITATION TIMELINE',
        domain: [0, 4.0]
      };
    }
    
    if (templateName.includes('Fee') || templateName.includes('Revenue') || templateName.includes('Payroll') || templateName.includes('Expense')) {
      return {
        title: templateName,
        subtitle: 'Quarterly financial reconciliation, fee collections audits, and payroll outflows',
        category: 'Finance & Accounts',
        stats: [
          { s: 'Tuition Fee Collection Rate', m: '₹1,42,500', v: '+8.2%', e: 'Optimal' },
          { s: 'Transport Fleet Subscriptions', m: '₹24,200', v: '-1.5%', e: 'Optimal' },
          { s: 'Outstanding Institutional Arrears', m: '₹12,400', v: '-12.4%', e: 'Review' },
          { s: 'Staff Payroll Net Outflow', m: '₹68,500', v: '+0.4%', e: 'Optimal' }
        ],
        chartData: [
          { name: 'Week 1', value: 45000, trend: 40000 },
          { name: 'Week 2', value: 52000, trend: 42000 },
          { name: 'Week 3', value: 48000, trend: 43000 },
          { name: 'Week 4', value: 67000, trend: 45000 }
        ],
        chartTitle: 'WEEKLY CASH FLOW INFLOW DIRECTIVE',
        domain: [0, 80000]
      };
    }

    if (templateName.includes('Leave') || templateName.includes('Absenteeism') || templateName.includes('Staff') || templateName.includes('Performance') || templateName.includes('Correlation')) {
      return {
        title: templateName,
        subtitle: 'Analysis of employee absence rates, medical leave registries, and staff performance indexes',
        category: 'Attendance & HR',
        stats: [
          { s: 'Faculty Personal Leave Tally', m: '14 Days', v: '-2.4%', e: 'Optimal' },
          { s: 'Staff Medical Leave Tally', m: '22 Days', v: '+5.2%', e: 'Review' },
          { s: 'Average Employee Retention Rate', m: '98.2%', v: '+0.2%', e: 'Optimal' },
          { s: 'Chronic Student Absentee Rate', m: '4.8%', v: '-1.2%', e: 'Optimal' }
        ],
        chartData: [
          { name: 'Mon', value: 2, trend: 4 },
          { name: 'Tue', value: 4, trend: 3 },
          { name: 'Wed', value: 3, trend: 3 },
          { name: 'Thu', value: 5, trend: 4 },
          { name: 'Fri', value: 2, trend: 5 }
        ],
        chartTitle: 'WEEKLY ABSENCE METRICS RECORD',
        domain: [0, 8]
      };
    }

    return {
      title: templateName,
      subtitle: 'Official confidential audit report generated by secure institutional servers',
      category: 'Institutional Auditing',
      stats: [
        { s: 'Operational Efficiency Index', m: '94.2%', v: '+1.4%', e: 'Optimal' },
        { s: 'System Resource Utilization', m: '82.1%', v: '-2.4%', e: 'Review' },
        { s: 'Cohort Student Progression', m: '88.5%', v: '+5.2%', e: 'Optimal' },
        { s: 'Faculty Engagement metrics', m: '91.8%', v: '+0.2%', e: 'Optimal' }
      ],
      chartData: chartData,
      chartTitle: 'ANALYTICAL TRENDSET COEFFICIENTS',
      domain: [0, 500]
    };
  };

  const handleAction = (type, name) => {
    const itemId = `${type}-${name}`;
    setProcessingItems(prev => ({ ...prev, [itemId]: true }));
    setActiveProcessingItem({ name, type });
    setActiveTemplateList(null); 
    
    setTimeout(() => {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
      
      if (type === 'open') {
        setPreviewReport(name);
      } else if (type === 'download') {
        handleDownloadReportFile(name);
      }

      setActiveProcessingItem(null);
      showToastNotification(`${name} Processed Successfully!`);
    }, 2000);
  };

  // Compile and download specific report values to raw text file
  const handleDownloadReportFile = (reportName) => {
    const data = getTemplateData(reportName);
    let content = `========================================================\n`;
    content += `          EDUPRO ELITE HIGH ACADEMIC ACCREDITATION\n`;
    content += `             OFFICIAL CONFIDENTIAL AUDIT REPORT\n`;
    content += `             DOCUMENT: ${data.title.toUpperCase()}\n`;
    content += `             Generated on: ${new Date().toLocaleString()}\n`;
    content += `========================================================\n\n`;
    
    content += `1. REPORT CLASSIFICATION & METRICS SUMMARY:\n`;
    content += `   - Department: ${data.category}\n`;
    content += `   - Description: ${data.subtitle}\n`;
    content += `   - Compliance Status: Tier 1 Accredited Ledger\n\n`;
    
    content += `2. COMPILED STATISTICAL LEDGER VALUES:\n`;
    content += `   ------------------------------------------------------------------------\n`;
    content += `   Metric Title                   | Value    | Variance | Status\n`;
    content += `   ------------------------------------------------------------------------\n`;
    data.stats.forEach(r => {
      const title = r.s.padEnd(30, ' ');
      const val = r.m.padEnd(8, ' ');
      const varPct = r.v.padEnd(8, ' ');
      content += `   ${title} | ${val} | ${varPct} | ${r.e}\n`;
    });
    content += `   ------------------------------------------------------------------------\n\n`;

    content += `3. TIMELINE VECTORS ANALYSIS:\n`;
    data.chartData.forEach(item => {
      content += `   - Interval: ${item.name} | Active Metric: ${item.value} | Previous Benchmark: ${item.trend}\n`;
    });
    
    content += `\n4. SECURE VERIFICATION FOOTER:\n`;
    content += `   Confidential audit completed under cryptographical stamp.\n`;
    content += `   SHA-256 Stamp Code: SHA-256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}\n`;
    content += `   End of report file. Secured by EduPro AI.\n`;
    
    handleExportText(content, `edupro-report-${reportName.toLowerCase().replace(/ /g, "-")}.txt`);
  };

  // Custom report builder checklist toggles
  const handleToggleModule = (modName) => {
    if (customModules.includes(modName)) {
      setCustomModules(prev => prev.filter(m => m !== modName));
    } else {
      setCustomModules(prev => [...prev, modName]);
    }
  };

  // Custom report builder compiler action
  const handleGenerateCustomReport = (e) => {
    e.preventDefault();
    if (!customReportName.trim()) {
      showToastNotification('Please provide a valid report name first!');
      return;
    }
    
    setIsCustomModalOpen(false);
    setActiveProcessingItem({ name: customReportName, type: 'build' });
    
    setTimeout(() => {
      const formatExt = customFormat.includes('Excel') ? 'XLSX' : customFormat.includes('JSON') ? 'JSON' : 'PDF';
      const newExport = {
        name: customReportName,
        date: 'Just now',
        type: formatExt,
        size: '1.4 MB'
      };
      
      setExportsList(prev => [newExport, ...prev]);
      setActiveProcessingItem(null);
      showToastNotification(` Besoke Audit "${customReportName}" Compiled successfully!`);
      
      setCustomReportName('');
      setCustomModules(['Academics', 'Finance']);
      setCustomFormat('PDF Document');
    }, 2500);
  };

  // High-fidelity page transitions loaders
  const triggerReportsNavigation = (path, label) => {
    setLoadingOverlayText(label);
    setShowLoadingOverlay(true);
    setTimeout(() => {
      setShowLoadingOverlay(false);
      navigate(path);
    }, 900);
  };

  const reportCategories = [
    { 
      title: 'Academic Analytics', 
      desc: 'Deep-dive into student performance, exam trends, and curriculum efficacy.',
      icon: GraduationCap,
      color: '#6366f1',
      path: '/dashboard/reports/academic',
      count: 14,
      tag: 'Academic',
      type: 'Analytical'
    },
    { 
      title: 'Finance & Accounts', 
      desc: 'Revenue forecasting, fee collection audits, and payroll disbursement summaries.',
      icon: Landmark,
      color: '#10b981',
      path: '/dashboard/reports/financial',
      count: 8,
      tag: 'Finance',
      type: 'Financial'
    },
    { 
      title: 'Attendance & HR', 
      desc: 'Monthly absenteeism trends, staff leave reports, and engagement metrics.',
      icon: Clock,
      color: '#f59e0b',
      path: '/dashboard/reports/attendance',
      count: 12,
      tag: 'HR',
      type: 'Statistical'
    },
    { 
      title: 'Institutional Assets', 
      desc: 'Inventory lifecycle, library utilization, and transport fleet performance.',
      icon: Activity,
      color: '#ec4899',
      path: '/dashboard/reports/inventory',
      count: 6,
      tag: 'Admin',
      type: 'Audit'
    },
    { 
      title: 'Student Reporting', 
      desc: 'Real-time behavioral, academic, and progression monitoring across multiple cohorts.',
      icon: Users,
      color: '#8b5cf6',
      path: '/dashboard/student-analytics',
      count: 10,
      tag: 'Academic',
      type: 'Analytical'
    },
    { 
      title: 'Universal Reporting', 
      desc: 'Customizable report builder for cross-module data extraction and automated delivery.',
      icon: FileJson,
      color: '#f43f5e',
      path: '/dashboard/reports',
      count: 4,
      tag: 'Admin',
      type: 'System'
    }
  ];

  const filteredCategories = reportCategories.filter(cat => {
    const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cat.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'All' || cat.tag === filters.category;
    const matchesType = filters.type === 'All' || cat.type === filters.type;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', position: 'relative' }}>
      
      {/* Custom Report Builder Modal */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
               style={{ backgroundColor: 'var(--bg-card)', padding: '48px', borderRadius: '48px', width: '650px', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                   <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-1.5px' }}>Custom <span style={{ color: '#6366f1' }}>Report Builder</span></h2>
                      <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>Architect a bespoke institutional data perspective.</p>
                   </div>
                   <button onClick={() => setIsCustomModalOpen(false)} style={{ width: '48px', height: '48px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleGenerateCustomReport} style={{ display: 'flex', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Report Architecture Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g., Q3 Cross-Departmental Efficacy Audit" 
                        value={customReportName}
                        onChange={(e) => setCustomReportName(e.target.value)}
                        style={{ width: '100%', padding: '20px', borderRadius: '18px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }} 
                      />
                   </div>

                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Data Modules to Synchronize</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                         {['Academics', 'Finance', 'HR', 'Inventory', 'Library', 'Transport'].map((m) => {
                           const isSelected = customModules.includes(m);
                           return (
                             <div 
                               key={m} 
                               onClick={() => handleToggleModule(m)}
                               style={{ 
                                 padding: '16px', borderRadius: '16px', 
                                 backgroundColor: isSelected ? '#6366f110' : 'var(--bg-body)', 
                                 border: '1px solid', borderColor: isSelected ? '#6366f1' : 'var(--border-color)', 
                                 display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' 
                               }}
                             >
                                <div style={{ 
                                  width: '18px', height: '18px', borderRadius: '4px', border: '2px solid', 
                                  borderColor: isSelected ? '#6366f1' : 'var(--border-color)', 
                                  backgroundColor: isSelected ? '#6366f1' : 'var(--bg-card)', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                   {isSelected && <Check size={12} color="white" strokeWidth={4} />}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>{m}</span>
                             </div>
                           );
                         })}
                      </div>
                   </div>

                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Export format Extension</label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                         {['PDF Document', 'Dynamic Excel', 'Raw JSON Payload'].map((f) => {
                           const isSelected = customFormat === f;
                           return (
                             <div 
                               key={f} 
                               onClick={() => setCustomFormat(f)}
                               style={{ 
                                 flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid', 
                                 borderColor: isSelected ? '#6366f1' : 'var(--border-color)', 
                                 backgroundColor: isSelected ? 'var(--bg-card)' : 'var(--bg-body)', 
                                 textAlign: 'center', cursor: 'pointer' 
                               }}
                             >
                                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: isSelected ? '#6366f1' : 'var(--text-muted)' }}>{f}</div>
                             </div>
                           );
                         })}
                      </div>
                   </div>

                   <div style={{ marginTop: '16px' }}>
                      <button 
                        type="submit"
                        style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                      >
                         Generate Custom Audit
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Explorer Modal */}
      <AnimatePresence>
        {activeTemplateList && (
          <div 
            onClick={() => setActiveTemplateList(null)}
            style={{ 
              position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', 
              backdropFilter: 'blur(12px)', zIndex: 1400, display: 'flex', 
              alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '40px', 
                width: '550px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)'
              }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{activeTemplateList.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select a template to initiate institutional export.</p>
                  </div>
                  <div 
                    onClick={() => setActiveTemplateList(null)}
                    style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={20} />
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeTemplateList.templates.map((template, i) => (
                    <div 
                      key={i}
                      style={{ 
                        padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', 
                        border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}
                    >
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: activeTemplateList.color }} />
                          <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{template}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '8px' }}>
                          <div 
                            onClick={() => handleAction('download', template)}
                            style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#6366f1' }}
                          >
                            <Download size={14} /> PDF
                          </div>
                          <div 
                            onClick={() => handleAction('open', template)}
                            style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}
                          >
                            <Eye size={14} /> VIEW REPORT
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Custom template builder available in <span style={{ color: '#6366f1' }}>Enterprise Edition</span>.</p>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preparation Modal (Action In Progress) */}
      <AnimatePresence>
        {activeProcessingItem && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '32px', width: '400px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
            >
               <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                  <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--border-color)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    {activeProcessingItem.type === 'download' ? <Download size={32} /> : activeProcessingItem.type === 'build' ? <Box size={32} /> : <Eye size={32} />}
                  </div>
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {activeProcessingItem.type === 'download' ? 'Downloading Document' : activeProcessingItem.type === 'build' ? 'Compiling Bespoke Audit' : 'Preparing Document'}
               </h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '24px' }}>
                  Processing <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeProcessingItem.name}</span> with secure databases...
               </p>
               <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.0 }} style={{ height: '100%', backgroundColor: '#6366f1' }} />
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ 
              position: 'fixed', bottom: '40px', left: '50%', zIndex: 1300,
              backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', padding: '16px 32px',
              borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontWeight: 800,
              fontSize: '0.95rem', letterSpacing: '0.5px', border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            {showToast.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <FileText size={16} /> ENTERPRISE REPORTING ENGINE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>Advanced <span style={{ color: '#6366f1' }}>Reports</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>High-fidelity data exports and cross-module analytical auditing.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <button 
              onClick={() => setIsCustomModalOpen(true)}
              style={{ 
                padding: '14px 24px', borderRadius: '20px', border: 'none', 
                backgroundColor: '#6366f1', color: 'white', fontWeight: 900, 
                fontSize: '0.9rem', cursor: 'pointer', display: 'flex', 
                alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                transition: '0.3s'
              }}
           >
              <Box size={18} /> Create Custom
           </button>
           
           <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '18px', zIndex: 10, color: searchQuery ? '#6366f1' : '#94a3b8', display: 'flex' }}>
                 <Search size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                placeholder="Search report templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  padding: '14px 20px 14px 52px', borderRadius: '20px', 
                  border: '2px solid var(--border-color)', outline: 'none', width: '340px', 
                  fontWeight: 700, fontSize: '0.95rem', backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)', transition: '0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }} 
              />
           </div>
           
           <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                padding: '14px 24px', borderRadius: '20px', border: 'none', 
                backgroundColor: isFilterOpen ? '#6366f1' : 'var(--text-main)', 
                color: isFilterOpen ? 'white' : 'var(--bg-body)', fontWeight: 900, fontSize: '0.9rem', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                transition: '0.3s',
                boxShadow: isFilterOpen ? '0 10px 25px rgba(99, 102, 241, 0.4)' : '0 10px 20px rgba(0,0,0,0.05)'
              }}
            >
                {isFilterOpen ? <X size={20} strokeWidth={3} /> : <Filter size={20} strokeWidth={2.5} />} 
                {isFilterOpen ? 'Close' : 'Filter'}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{ 
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px', 
                    backgroundColor: 'var(--bg-card)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border-color)', padding: '24px', zIndex: 100
                  }}
                >
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Range</label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['All Time', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map(d => (
                        <button 
                          key={d}
                          onClick={() => { setFilters({...filters, dateRange: d}); showToastNotification(`Timeframe updated: ${d}`); }}
                          style={{ 
                            padding: '10px 8px', borderRadius: '12px', border: '1px solid',
                            borderColor: filters.dateRange === d ? '#6366f1' : 'var(--border-color)',
                            backgroundColor: filters.dateRange === d ? '#6366f1' : 'transparent',
                            color: filters.dateRange === d ? 'white' : 'var(--text-muted)',
                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '1px' }}>TYPE</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['All', 'Analytical', 'Financial', 'Statistical', 'Audit', 'System'].map(t => (
                        <div 
                          key={t}
                          onClick={() => { setFilters({...filters, type: t}); showToastNotification(`Classification synced: ${t}`); }}
                          style={{ 
                            padding: '10px', borderRadius: '12px', cursor: 'pointer',
                            border: '1px solid', borderColor: filters.type === t ? '#6366f1' : 'var(--border-color)',
                            backgroundColor: filters.type === t ? '#6366f110' : 'transparent',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: filters.type === t ? '#6366f1' : 'var(--text-muted)' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '1px' }}>DEPARTMENT</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['All', 'Academic', 'Finance', 'HR', 'Admin'].map(c => (
                        <div 
                          key={c}
                          onClick={() => { setFilters({...filters, category: c}); showToastNotification(`Department synced: ${c}`); }}
                          style={{ 
                            padding: '12px', borderRadius: '12px', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: filters.category === c ? 'var(--bg-body)' : 'transparent'
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: filters.category === c ? 'var(--text-main)' : 'var(--text-muted)' }}>{c}</span>
                          {filters.category === c && <Check size={16} color="#6366f1" strokeWidth={3} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setFilters({ dateRange: 'All Time', status: 'All', category: 'All', type: 'All' });
                      setSearchQuery('');
                      showToastNotification('Filters reset successfully.');
                    }}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                      backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', fontWeight: 800,
                      fontSize: '0.85rem', cursor: 'pointer', marginTop: '8px'
                    }}
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px' }}>
        
        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
           {filteredCategories.map((cat, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
               onClick={() => triggerReportsNavigation(cat.path, `Establishing secure tunnel to ${cat.title} registers...`)}
               style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.3s' }}
             >
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                   <cat.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '12px' }}>{cat.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.6, marginBottom: '24px' }}>{cat.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTemplateList({ title: cat.title, color: cat.color, templates: categoryTemplates[cat.title] || [] });
                    }}
                    style={{ 
                      fontSize: '0.85rem', fontWeight: 800, color: cat.color, 
                      backgroundColor: `${cat.color}10`, padding: '8px 16px', borderRadius: '12px',
                      cursor: 'pointer', transition: '0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = `${cat.color}20`}
                    onMouseLeave={(e) => e.target.style.backgroundColor = `${cat.color}10`}
                   >
                    {cat.count} Templates Available
                   </div>
                   <motion.div 
                    whileHover={{ scale: 1.2, x: 5 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTemplateList({ title: cat.title, color: cat.color, templates: categoryTemplates[cat.title] || [] });
                    }}
                    style={{ 
                      width: '36px', height: '36px', borderRadius: '12px', 
                      backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', color: '#6366f1', cursor: 'pointer'
                    }}
                   >
                      <ChevronRight size={20} />
                   </motion.div>
                </div>
             </motion.div>
           ))}
           {filteredCategories.length === 0 && (
             <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '80px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                <Search size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--text-muted)', fontWeight: 800 }}>No reports matching your filters.</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search or category selection.</p>
             </div>
           )}
        </div>

        {/* Right Column: Recent Exports & Export Formats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           
           {/* Recent Exports */}
           <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Calendar size={20} color="#6366f1" /> Recent Exports
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {exportsList.map((report, i) => (
                    <div key={i} style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ flex: 1, marginRight: '12px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem', wordBreak: 'break-word' }}>{report.name}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>{report.date} • {report.size}</div>
                       </div>
                       <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <motion.div 
                             whileHover={!processingItems[`download-${report.name}`] ? { scale: 1.1 } : {}}
                             whileTap={!processingItems[`download-${report.name}`] ? { scale: 0.9 } : {}}
                             onClick={() => !processingItems[`download-${report.name}`] && handleAction('download', report.name)}
                             style={{ 
                               width: '36px', height: '36px', borderRadius: '10px', 
                               backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', 
                               justifyContent: 'center', color: '#6366f1', 
                               cursor: processingItems[`download-${report.name}`] ? 'default' : 'pointer', 
                               border: '1px solid var(--border-color)' 
                             }}
                          >
                             {processingItems[`download-${report.name}`] ? (
                               <div style={{ display: 'flex', animation: 'spin 1.2s linear infinite' }}>
                                 <Clock size={16} />
                               </div>
                             ) : <Download size={18} />}
                          </motion.div>
                          <motion.div 
                             whileHover={!processingItems[`open-${report.name}`] ? { scale: 1.1 } : {}}
                             whileTap={!processingItems[`open-${report.name}`] ? { scale: 0.9 } : {}}
                             onClick={() => !processingItems[`open-${report.name}`] && handleAction('open', report.name)}
                             style={{ 
                               width: '36px', height: '36px', borderRadius: '10px', 
                               backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', 
                               justifyContent: 'center', color: 'var(--text-muted)', 
                               cursor: processingItems[`open-${report.name}`] ? 'default' : 'pointer', 
                               border: '1px solid var(--border-color)' 
                             }}
                          >
                             {processingItems[`open-${report.name}`] ? (
                               <div style={{ display: 'flex', animation: 'spin 1.2s linear infinite' }}>
                                 <Clock size={16} />
                               </div>
                             ) : <ExternalLink size={18} />}
                          </motion.div>
                       </div>
                    </div>
                  ))}
              </div>
           </div>

           {/* Export Capabilities */}
           <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Supported Engines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <FileSpreadsheet size={24} color="#10b981" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>EXCEL / CSV</div>
                 </div>
                 <div style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <FileText size={24} color="#ef4444" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>ADOBE PDF</div>
                 </div>
                 <div style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <BarChart3 size={24} color="#6366f1" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>LIVE CHARTS</div>
                 </div>
                 <div style={{ backgroundColor: 'var(--bg-body)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <FileJson size={24} color="#f59e0b" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>REST JSON</div>
                 </div>
              </div>
              <p style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>Enterprise-grade encryption applied to all exported data.</p>
           </div>

        </div>
      </div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {previewReport && (() => {
          const reportData = getTemplateData(previewReport);
          return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
                 style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '1200px', height: '90vh', borderRadius: '48px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}
               >
                  <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
                     <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                           <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} /></div>
                           <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-1px' }}>{reportData.title}</h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{reportData.subtitle}</p>
                     </div>
                     <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                          onClick={() => window.print()}
                          style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Printer size={18} /> Print report
                        </button>
                        <button 
                          onClick={() => handleDownloadReportFile(previewReport)}
                          style={{ padding: '12px 24px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Download size={18} /> Export Plain Text
                        </button>
                        <button onClick={() => setPreviewReport(null)} style={{ width: '56px', height: '56px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}><X size={24} /></button>
                     </div>
                  </div>
                  
                  <div style={{ flex: 1, padding: '48px', overflowY: 'auto', backgroundColor: 'var(--bg-body)' }}>
                     <div id="printable-advanced-report" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-card)', padding: '60px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid var(--border-color)' }}>
                        <div style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                           <div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)' }}>EDUPRO ELITE ACADEMY</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Institutional Excellence Since 2024</div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>REPORT CLASSIFICATION</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</div>
                           </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                           <div style={{ backgroundColor: 'var(--bg-body)', padding: '24px', borderRadius: '20px' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Report Category</div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main)' }}>{reportData.category}</div>
                           </div>
                           <div style={{ backgroundColor: 'var(--bg-body)', padding: '24px', borderRadius: '20px' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Compliance Level</div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#10b981' }}>Tier 1 - Certified</div>
                           </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '48px' }}>
                           <thead>
                              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>METRIC</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>VALUE</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>VARIANCE</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>STATUS</th>
                              </tr>
                           </thead>
                           <tbody>
                              {reportData.stats.map((row, i) => (
                                 <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px 0', fontWeight: 800, color: 'var(--text-main)' }}>{row.s}</td>
                                    <td style={{ padding: '20px 0', fontWeight: 700, color: 'var(--text-muted)' }}>{row.m}</td>
                                    <td style={{ padding: '20px 0', fontWeight: 700, color: row.v.startsWith('+') ? '#10b981' : '#ef4444' }}>{row.v}</td>
                                    <td style={{ padding: '20px 0' }}>
                                       <span style={{ padding: '4px 12px', borderRadius: '10px', backgroundColor: row.e === 'Optimal' ? '#10b98115' : '#ef444415', color: row.e === 'Optimal' ? '#10b981' : '#ef4444', fontSize: '0.7rem', fontWeight: 900 }}>{row.e.toUpperCase()}</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        <div style={{ marginBottom: '48px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                              <Activity size={20} color="#6366f1" />
                              <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>{reportData.chartTitle}</span>
                           </div>
                           <div style={{ width: '100%', height: '350px', backgroundColor: 'var(--bg-body)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)', position: 'relative' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={reportData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }} domain={reportData.domain} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-body)', padding: '32px', borderRadius: '24px', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                              <Check size={20} color="#10b981" />
                              <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>INSTITUTIONAL SIGN-OFF</span>
                           </div>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                              This document serves as an official audit of the selected institutional metrics. All data points have been synchronized with the EduPro Core database and verified for compliance.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div style={{ padding: '24px 48px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                     <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONFIDENTIAL SYSTEM GENERATED REPORT • EDUPRO ELITE INSTITUTIONAL ENGINE v3.0</p>
                  </div>
               </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Fullscreen secure loading overlay */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
                <FileText size={32} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Secure Reports Gate</h4>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>{loadingOverlayText}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        /* Print media report sheets isolated styling rules */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-advanced-report, #printable-advanced-report * {
            visibility: visible !important;
          }
          #printable-advanced-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            color: black !important;
            padding: 20px !important;
            background: white !important;
            box-shadow: none !important;
          }
        }
      ` }} />

    </div>
  );
};

export default AdvancedReports;
