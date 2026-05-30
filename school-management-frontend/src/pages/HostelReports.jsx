import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, Utensils,
  Coffee, Users, ShieldCheck, FileText,
  Activity, PieChart, X, AlertCircle, Sparkles, Clock, Check, Eye, Calendar, HardDrive, CheckCircle2
} from 'lucide-react';

const HostelReports = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  // Dining Audit Terminal Simulation State
  const [showDiningAuditTerminal, setShowDiningAuditTerminal] = useState(false);
  const [diningLogs, setDiningLogs] = useState([]);
  const [isSimulatingDining, setIsSimulatingDining] = useState(false);
  const [diningProgress, setDiningProgress] = useState(0);
  const [wasteCoefficient, setWasteCoefficient] = useState(12.4); // kg
  const [mealTimetable, setMealTimetable] = useState("Standard Shift");

  const startDiningAuditSimulation = () => {
    setIsSimulatingDining(true);
    setDiningProgress(0);
    setDiningLogs([]);
    
    const logs = [
      "Initializing institutional dining & waste diagnostic query...",
      "Establishing WebSocket links to NFC entry gateways...",
      "NFC reader sync: 410 breakfast, 380 lunch session logs parsed.",
      "Analyzing plate waste sensors at tray return belts...",
      "Analyzing kitchen stock depletion (Grain & Flours)...",
      "Calibrating waste coefficients against standard metrics...",
      "Calculating carbon offset and organic compost diversion ratios...",
      "Compiling final meal-efficiency ledger..."
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setDiningLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[currentStep]}`]);
        setDiningProgress(Math.round(((currentStep + 1) / logs.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSimulatingDining(false);
        showToast("Dining hall waste audit and NFC ledger synchronisation complete.", "success", "Audit Finalized");
      }
    }, 600);
  };

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hostelTemplates = [
    { 
      title: 'Room Occupancy & Utilization Heatmap', 
      type: 'Operational', 
      lastGen: '2 days ago',
      size: '124 KB',
      hash: 'SHA-256-48EF92BC1A832A',
      rows: [
        { block: 'Block A (Boys)', occupancy: '92% Occupied', filled: '108/118 Rooms', standard: 'Double Occupancy', status: 'Optimal' },
        { block: 'Block B (Girls)', occupancy: '85% Occupied', filled: '94/110 Rooms', standard: 'Double Occupancy', status: 'Optimal' },
        { block: 'Block C (Premium)', occupancy: '75% Occupied', filled: '15/20 Rooms', standard: 'Single Elite Suite', status: 'Cleared' },
        { block: 'Block D (Guest)', occupancy: '30% Occupied', filled: '6/20 Rooms', standard: 'Flex Suite', status: 'Underutilized' }
      ]
    },
    { 
      title: 'Dining Hall Attendance & Waste Audit', 
      type: 'Dining', 
      lastGen: '4 days ago',
      size: '95 KB',
      hash: 'SHA-256-0F928A941BC83B',
      rows: [
        { interval: 'Breakfast Session', attendance: '94.2% Attendance', itemsServed: '410 Meals', waste: '12.4 kg (Low)', efficiency: 'Cleared' },
        { interval: 'Lunch Session', attendance: '88.5% Attendance', itemsServed: '380 Meals', waste: '22.8 kg (Moderate)', efficiency: 'Review Suggested' },
        { interval: 'Dinner Session', attendance: '96.8% Attendance', itemsServed: '425 Meals', waste: '15.2 kg (Low)', efficiency: 'Cleared' }
      ]
    },
    { 
      title: 'Mess Subscription & Revenue Report', 
      type: 'Financial', 
      lastGen: '1 week ago',
      size: '156 KB',
      hash: 'SHA-256-77DA102BB9E094',
      rows: [
        { plan: 'Plan Premium Gold', activeSubs: '142 Active', duration: 'Term Lump', billing: 'Monthly Recur', revenue: '$28,400' },
        { plan: 'Plan Standard Silver', activeSubs: '250 Active', duration: 'Term Lump', billing: 'Monthly Recur', revenue: '$37,500' },
        { plan: 'Plan Faculty Dining', activeSubs: '35 Active', duration: 'Monthly Recur', billing: 'Monthly Recur', revenue: '$8,750' }
      ]
    },
    { 
      title: 'Inventory & Stock Consumption (Kitchen)', 
      type: 'Logistics', 
      lastGen: '10 days ago',
      size: '280 KB',
      hash: 'SHA-256-32A44B9E09529F',
      rows: [
        { itemClass: 'Grain & Flours', stockLevel: '84% Stocked', quantity: '4.2 Tons', reorder: 'Scheduled', status: 'Cleared' },
        { itemClass: 'Dairy & Eggs', stockLevel: '92% Stocked', quantity: '0.8 Tons', reorder: 'Cleared', status: 'Cleared' },
        { itemClass: 'Canned Goods & Oil', stockLevel: '64% Stocked', quantity: '1.2 Tons', reorder: 'Immediate Reorder', status: 'Review Needed' }
      ]
    },
    { 
      title: 'Hostel Incident & Security Log', 
      type: 'Security', 
      lastGen: '12 days ago',
      size: '64 KB',
      hash: 'SHA-256-99A102CC54EE9B',
      rows: [
        { date: 'May 20, 2026', room: 'Room A-304', detail: 'Lockout key override request', driver: 'Admin Patrol', status: 'Resolved' },
        { date: 'May 18, 2026', room: 'Room B-112', detail: 'Visitor curfew extension check', driver: 'Guardian Sync', status: 'Resolved' }
      ]
    },
    { 
      title: 'Utility Consumption per Block', 
      type: 'Infrastructure', 
      lastGen: '2 weeks ago',
      size: '142 KB',
      hash: 'SHA-256-11FFCC33BBDD04',
      rows: [
        { asset: 'Block A HVAC/Power', usage: '4,200 kWh', costIndex: 'Normal', charge: '$520', status: 'Optimal' },
        { asset: 'Block B HVAC/Power', usage: '3,900 kWh', costIndex: 'Normal', charge: '$480', status: 'Optimal' },
        { asset: 'Dining Hall Kitchen', usage: '8,400 kWh', costIndex: 'High Load', charge: '$1,050', status: 'Cleared' }
      ]
    },
  ];

  const handleExportAuditLog = () => {
    showToast("Compiling master residential audit ledger...", "info", "Residential Audit");
    const csvContent = [
      ['Block ID', 'Standard Occupancy', 'Meal Participation', 'Mess Revenue YTD', 'Security Rating'],
      ['Block A (Boys)', '92%', '94.2%', '$58,400', '98/100'],
      ['Block B (Girls)', '85%', '93.5%', '$54,200', '99/100'],
      ['Block C (Premium)', '75%', '91.0%', '$12,400', '99/100'],
      ['Block D (Guest)', '30%', '82.0%', '$3,600', '95/100'],
      ['Audit Gen Timestamp', new Date().toISOString()],
      ['Authority Signature', 'EduPro Residential Board']
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Master_Residential_Audit_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("Residential audit ledger compiled and exported.", "success", "Export Complete");
    }, 1200);
  };

  const handleDownloadTemplate = (template) => {
    showToast(`Compiling spreadsheet report for "${template.title}"...`, "info", "Export CSV");
    
    let csvContent = [
      ['Residential Category', 'Audited Logistics Log'],
      ['Report Title', template.title],
      ['Classification Type', template.type],
      ['Last Generated Sync', template.lastGen],
      ['Audit Integrity Hash', template.hash],
      ['Security Code', 'EP-RSH-9293-SEC'],
      ['Export Date', new Date().toLocaleDateString()],
      [],
      template.rows && template.rows.length > 0 ? Object.keys(template.rows[0]).map(k => k.toUpperCase()) : ['No specific row headers']
    ];

    if (template.rows) {
      template.rows.forEach(row => {
        csvContent.push(Object.values(row));
      });
    }
    
    const finalCsvString = csvContent.map(e => e.join(",")).join("\n");
    const blob = new Blob([finalCsvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${template.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("Residential report downloaded successfully.", "success", "Download Complete");
    }, 1200);
  };

  const filteredTemplates = filterType === 'All' 
    ? hostelTemplates 
    : hostelTemplates.filter(t => t.type === filterType);

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(236, 72, 153, 0.1)', borderRadius: '30px', color: '#ec4899', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Bed size={16} /> RESIDENTIAL & DINING AUDIT
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, margin: '0 0 8px 0' }}>
            Hostel <span style={{ color: '#ec4899' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Comprehensive residential auditing and mess utilization reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => {
               showToast("Navigating to Residential Block layout...", "info", "Residential Directory");
               setTimeout(() => navigate('/dashboard/hostel-rooms'), 600);
             }}
             style={{ padding: '16px 32px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
           >
             Block Layout
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02, translateY: -2 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleExportAuditLog}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)' }}
           >
              <Download size={18} /> Export Audit
           </motion.button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
         {[
           { label: 'Avg. Occupancy Rate', value: '88.5%', trend: '+2.4%', icon: Bed, color: 'var(--primary)' },
           { label: 'Meal Participation', value: '94.2%', trend: '+1.1%', icon: Utensils, color: 'var(--success)' },
           { label: 'Revenue YTD (Mess)', value: '$124k', trend: '+8%', icon: PieChart, color: 'var(--warning)' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             whileHover={{ y: -6 }}
             onClick={() => showToast(`Residential metrics analysis: ${stat.label} verified at ${stat.value}.`, "info", "Residential Metrics")}
             style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={24} />
                 </div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: stat.color }}>{stat.trend}</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
           </motion.div>
         ))}
      </div>

      {/* Templates Section */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Residential Template Hub</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div 
                 onClick={() => {
                   showToast("Residential filter set to dining and kitchen categories.", "info", "Filters Sync");
                   setFilterType(filterType === 'All' ? 'Dining' : 'All');
                 }}
                 style={{ padding: '8px 16px', backgroundColor: filterType !== 'All' ? 'rgba(236, 72, 153, 0.1)' : 'var(--bg-body)', border: `1px solid ${filterType !== 'All' ? '#ec4899' : 'var(--border-color)'}`, borderRadius: '12px', color: filterType !== 'All' ? '#ec4899' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
               >
                 Filter By Dining
               </div>
               <div 
                 onClick={() => {
                   setShowDiningAuditTerminal(true);
                   startDiningAuditSimulation();
                 }}
                 style={{ padding: '8px 16px', backgroundColor: 'var(--text-main)', borderRadius: '12px', color: 'var(--bg-card)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
               >
                 Dining Audit
               </div>
            </div>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '0' }}>
            {filteredTemplates.map((template, i) => (
              <div 
                key={i} 
                style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s', cursor: 'pointer' }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                       <Activity size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{template.title}</div>
                       <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{template.type} • Updated: {template.lastGen}</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedReport(template);
                        showToast(`Displaying preview for "${template.title}".`, "success", "Report Preview");
                      }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> Preview
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadTemplate(template)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      <Download size={14} />
                    </motion.button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Interactive Structured Report Preview Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '36px', borderRadius: '28px', width: '100%', maxWidth: '800px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {selectedReport.type}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{selectedReport.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Meta information row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={16} color="#ec4899" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Last Generated</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedReport.lastGen}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HardDrive size={16} color="var(--success)" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>File Size</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedReport.size}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={16} color="var(--warning)" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Security Hash</span>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>{selectedReport.hash.slice(0, 15)}...</strong>
                  </div>
                </div>
              </div>

              {/* Live Telemetry Data Table Preview */}
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Residential & Dining Audit Logs</h4>
              <div style={{ overflowX: 'auto', maxHeight: '280px', marginBottom: '28px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                      {selectedReport.rows && selectedReport.rows.length > 0 && Object.keys(selectedReport.rows[0]).map((key, idx) => (
                        <th key={idx} style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.rows && selectedReport.rows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: idx !== selectedReport.rows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {typeof val === 'string' && val.includes('Optimal') || val.includes('Cleared') || val.includes('Resolved') || val.includes('Active') ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontWeight: 800, fontSize: '0.75rem' }}>
                                <Check size={10} /> {val}
                              </span>
                            ) : typeof val === 'string' && val.includes('Delayed') || val.includes('Review') || val.includes('Underutilized') ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', fontWeight: 800, fontSize: '0.75rem' }}>
                                <AlertCircle size={10} /> {val}
                              </span>
                            ) : (
                              val
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => {
                    handleDownloadTemplate(selectedReport);
                    setSelectedReport(null);
                  }}
                  style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)' }}
                >
                  <Download size={16} /> Download Full CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Toast Notification Drawer */}
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
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Sparkles size={20} />
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

      {/* Dynamic Dining Audit Terminal Modal */}
      <AnimatePresence>
        {showDiningAuditTerminal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowDiningAuditTerminal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)' }}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ 
                position: 'relative', width: '100%', maxWidth: '680px', 
                backgroundColor: '#0a0e17', borderRadius: '32px', padding: '40px', 
                boxShadow: '0 30px 100px rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                color: '#f8fafc',
                overflow: 'hidden',
                zIndex: 10
              }}
            >
              {/* Glow Accent */}
              <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)' }}>
                    <Utensils size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, letterSpacing: '-0.5px' }}>Dining Audit & Waste Analyzer</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>NFC tracking, kitchen stocks & food waste diagnostics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDiningAuditTerminal(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#cbd5e1' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Live Telemetry Status Dashboard */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Kitchen Waste</span>
                  <strong style={{ fontSize: '1.35rem', color: '#ec4899', fontWeight: 950 }}>{wasteCoefficient} kg</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Meal Timetable Shift</span>
                  <strong style={{ fontSize: '0.95rem', color: '#3b82f6', fontWeight: 900, display: 'block', marginTop: '6px' }}>{mealTimetable}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audit Rating YTD</span>
                  <strong style={{ fontSize: '1.35rem', color: '#10b981', fontWeight: 950 }}>96.4 / 100</strong>
                </div>
              </div>

              {/* Progress Sweep Indicator */}
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', color: '#cbd5e1' }}>
                  <span>Query Sweep & Diagnostics</span>
                  <span style={{ color: '#ec4899' }}>{diningProgress}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${diningProgress}%` }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)', borderRadius: '100px', boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)' }}
                  />
                </div>
              </div>

              {/* Monospace System Terminal Console Log Screen */}
              <div style={{ 
                height: '180px', backgroundColor: '#05070c', borderRadius: '20px', 
                padding: '20px', border: '1px solid rgba(255,255,255,0.08)', 
                overflowY: 'auto', display: 'flex', flexDirection: 'column', 
                gap: '8px', fontFamily: '"Fira Code", monospace, "Courier New"', fontSize: '0.8rem', 
                lineHeight: 1.5, color: '#a7f3d0', marginBottom: '28px',
                position: 'relative'
              }}>
                {diningLogs.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    Click "Scan & Run Audit Logs" to launch live telemetry diagnostics...
                  </div>
                ) : (
                  diningLogs.map((log, idx) => (
                    <div key={idx} style={{ 
                      color: log.includes('complete') ? '#34d399' : log.includes('NFC') ? '#3b82f6' : log.includes('waste') ? '#fbbf24' : '#a7f3d0',
                      textShadow: log.includes('complete') ? '0 0 4px rgba(52, 211, 153, 0.4)' : 'none'
                    }}>
                      {log}
                    </div>
                  ))
                )}
                
                {isSimulatingDining && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#ec4899', fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#ec4899', borderRadius: '50%' }}></span>
                    SYSTEM COMPUTING DATA STREAM...
                  </div>
                )}
              </div>

              {/* Quick Optimization Tool Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operational Optimizations</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    disabled={isSimulatingDining}
                    onClick={() => {
                      setMealTimetable("Eco-Overlapping 20m");
                      showToast("NFC Peak timeline re-calibrated. Shift overlap optimized.", "success", "Timetable Calibrated");
                      setDiningLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Timetable optimized: Overlapping 20m segments enabled.`]);
                    }}
                    style={{ 
                      padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', fontWeight: 800, fontSize: '0.8rem', 
                      cursor: isSimulatingDining ? 'not-allowed' : 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                    onMouseOver={(e) => { if(!isSimulatingDining) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)' }}
                    onMouseOut={(e) => { if(!isSimulatingDining) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)' }}
                  >
                    <Clock size={14} /> Recalibrate Timelines
                  </button>
                  <button 
                    disabled={isSimulatingDining}
                    onClick={() => {
                      setWasteCoefficient(9.1);
                      showToast("Portions calibrated. Automated prep margins reduced.", "success", "Kitchen Portions");
                      setDiningLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Portions calibrated. Projected daily food waste drops by 26%.`]);
                    }}
                    style={{ 
                      padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', fontWeight: 800, fontSize: '0.8rem', 
                      cursor: isSimulatingDining ? 'not-allowed' : 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                    onMouseOver={(e) => { if(!isSimulatingDining) e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)' }}
                    onMouseOut={(e) => { if(!isSimulatingDining) e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)' }}
                  >
                    <Activity size={14} /> Optimize Portion Prep
                  </button>
                </div>
              </div>

              {/* Console Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                <button 
                  onClick={() => setShowDiningAuditTerminal(false)}
                  style={{ padding: '14px 28px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#cbd5e1', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                >
                  Dismiss Console
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    disabled={isSimulatingDining}
                    onClick={startDiningAuditSimulation}
                    style={{ 
                      padding: '14px 24px', borderRadius: '14px', border: 'none', 
                      backgroundColor: isSimulatingDining ? 'rgba(255,255,255,0.05)' : '#ec4899', 
                      color: isSimulatingDining ? '#64748b' : '#ffffff', 
                      fontWeight: 900, fontSize: '0.85rem', cursor: isSimulatingDining ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      boxShadow: isSimulatingDining ? 'none' : '0 6px 15px rgba(236, 72, 153, 0.3)',
                      transition: '0.2s'
                    }}
                  >
                    <Sparkles size={16} /> Scan & Run Audit Logs
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

export default HostelReports;
