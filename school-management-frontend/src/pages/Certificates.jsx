import React, { useState } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { Award, FileText, Download, Printer, Search, Filter, CheckCircle2, User, Calendar, X, Plus, Sparkles, Check, ChevronLeft, ChevronRight, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Certificates = () => {
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'ledger', 'calendar'
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  
  const [certifications, setCertifications] = useState([
    { id: 1, name: 'Harry Potter', date: '2026-05-08', type: 'Academic Excellence', category: 'Achievement', recipientType: 'Student', recipientId: 'STD-101', code: 'CRT-7718' },
    { id: 2, name: 'Hermione Granger', date: '2026-05-05', type: 'Course Completion', category: 'Academics', recipientType: 'Student', recipientId: 'STD-102', code: 'CRT-9812' },
    { id: 3, name: 'Ron Weasley', date: '2026-05-02', type: 'Sports Distinction', category: 'Athletics', recipientType: 'Student', recipientId: 'STD-103', code: 'CRT-4051' },
  ]);

  const templates = [
    { id: 1, name: 'Academic Excellence', category: 'Achievement', color: '#4880FF' },
    { id: 2, name: 'Sports Distinction', category: 'Athletics', color: '#10b981' },
    { id: 3, name: 'Conduct Certificate', category: 'Behavioral', color: '#f59e0b' },
    { id: 4, name: 'Course Completion', category: 'Academics', color: '#ec4899' },
  ];

  const recipientsList = [
    { id: 'STD-101', name: 'Harry Potter', type: 'Student' },
    { id: 'STD-102', name: 'Hermione Granger', type: 'Student' },
    { id: 'STD-103', name: 'Ron Weasley', type: 'Student' },
    { id: 'STD-104', name: 'Draco Malfoy', type: 'Student' },
    { id: 'STD-105', name: 'Luna Lovegood', type: 'Student' },
    { id: 'STF-501', name: 'Prof. Severus Snape', type: 'Staff' },
    { id: 'STF-502', name: 'Minerva McGonagall', type: 'Staff' },
    { id: 'ALM-901', name: 'Albus Dumbledore', type: 'Alumni' },
    { id: 'ALM-902', name: 'Newt Scamander', type: 'Alumni' }
  ];

  // Form States
  const [recipientType, setRecipientType] = useState('Student');
  const [recipientIdInput, setRecipientIdInput] = useState('STD-101');
  const [recipientName, setRecipientName] = useState('Harry Potter');
  const [issuanceDate, setIssuanceDate] = useState('2026-05-24');
  const [principalName, setPrincipalName] = useState('Minerva McGonagall');
  
  // Search dropdown suggestion toggle
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Printing & Export Progress States
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState({});
  const [printProgress, setPrintProgress] = useState(null); // 'printing', 'complete'
  
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Ledger Filter States
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState('All');

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(4); // 0-indexed, 4 = May
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-05-24');

  // Suggestions filtered by selected type and input match
  const filteredSuggestions = recipientsList.filter(rec => 
    rec.type === recipientType && 
    (rec.id.toLowerCase().includes(recipientIdInput.toLowerCase()) || 
     rec.name.toLowerCase().includes(recipientIdInput.toLowerCase()))
  );

  // Actions
  const handleSelectSuggestion = (rec) => {
    setRecipientIdInput(rec.id);
    setRecipientName(rec.name);
    setShowSuggestions(false);
  };

  const handleInitializeGeneration = (e) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      showToast('Please provide a recipient name.', 'warning', 'Missing Field');
      return;
    }

    const matchedTemplate = templates.find(t => t.id === selectedTemplate);
    const newCert = {
      id: Date.now(),
      name: recipientName,
      date: issuanceDate,
      type: matchedTemplate.name,
      category: matchedTemplate.category,
      recipientType: recipientType,
      recipientId: recipientIdInput,
      code: `CRT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setCertifications([newCert, ...certifications]);
    showToast(`Successfully generated certificate ${newCert.code} for ${newCert.name}!`, 'success', 'Certificate Generated');
    
    // Reset Form
    setRecipientIdInput('');
    setRecipientName('');
  };

  const handleExportRegistry = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual mock CSV download
            const headers = "Recipient Name,Recipient ID,Type,Category,Recipient Type,Issuance Date,Verification Code\n";
            const rows = certifications.map(c => 
              `"${c.name}","${c.recipientId}","${c.type}","${c.category}","${c.recipientType}","${c.date}","${c.code}"`
            ).join("\n");
            
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `EduPro_Certification_Registry_${Date.now()}.csv`);
            a.click();

            setIsExporting(false);
            setExportProgress(0);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const triggerBatchPrint = () => {
    const defaultSelection = {};
    certifications.forEach(c => {
      defaultSelection[c.id] = true;
    });
    setSelectedForPrint(defaultSelection);
    setIsPrintOpen(true);
    setPrintProgress(null);
  };

  const handlePrintSubmit = () => {
    const itemsToPrint = Object.keys(selectedForPrint).filter(id => selectedForPrint[id]);
    if (itemsToPrint.length === 0) {
      showToast('Please select at least one certificate to print.', 'warning', 'No Selection');
      return;
    }

    setPrintProgress('printing');
    setTimeout(() => {
      setPrintProgress('complete');
      setTimeout(() => {
        setIsPrintOpen(false);
        setPrintProgress(null);
        showToast(`Successfully queued & printed ${itemsToPrint.length} certifications.`, 'success', 'Print Complete');
      }, 1000);
    }, 2000);
  };

  const togglePrintItem = (id) => {
    setSelectedForPrint(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllPrint = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    certifications.forEach(c => {
      newSelection[c.id] = checked;
    });
    setSelectedForPrint(newSelection);
  };

  // Calendar Helpers (May 2026)
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays = [];
  // Empty paddings
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Filtered certifications in Ledger
  const filteredLedger = certifications.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      c.recipientId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(ledgerSearch.toLowerCase());
      
    const matchesType = ledgerTypeFilter === 'All' || c.recipientType === ledgerTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '20px' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Certification Engine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Generate, manage, and verify official institutional certificates and credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={triggerBatchPrint}
             className="btn" 
             style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800 }}
           >
              <Printer size={20} /> Batch Print
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleExportRegistry}
             className="btn btn-primary" 
             disabled={isExporting}
             style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', opacity: isExporting ? 0.6 : 1 }}
           >
              <Download size={20} /> {isExporting ? `Exporting (${exportProgress}%)` : 'Export Registry'}
           </motion.button>
        </div>
      </div>

      {/* CORE NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('generate')}
          style={{ 
            padding: '10px 20px', border: 'none', background: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'generate' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'generate' ? '3px solid var(--primary)' : '3px solid transparent'
          }}
        >
          Generate Certificate
        </button>
        <button 
          onClick={() => setActiveTab('ledger')}
          style={{ 
            padding: '10px 20px', border: 'none', background: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'ledger' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'ledger' ? '3px solid var(--primary)' : '3px solid transparent'
          }}
        >
          Registry Ledger ({certifications.length})
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          style={{ 
            padding: '10px 20px', border: 'none', background: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'calendar' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'calendar' ? '3px solid var(--primary)' : '3px solid transparent'
          }}
        >
          Issuance Calendar
        </button>
      </div>

      {/* TAB CONTENT: GENERATE CERTIFICATE */}
      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          {/* Left: Designer / Generator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-main)' }}>Certificate Designer</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
                   {templates.map((template) => (
                     <motion.div 
                       key={template.id}
                       onClick={() => setSelectedTemplate(template.id)}
                       whileHover={{ scale: 1.02 }}
                       style={{ 
                         padding: '20px', borderRadius: '20px', border: '2px solid', 
                         borderColor: selectedTemplate === template.id ? template.color : 'var(--border-color)',
                         backgroundColor: selectedTemplate === template.id ? `${template.color}10` : 'var(--bg-body)',
                         cursor: 'pointer', transition: '0.3s'
                       }}
                     >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                           <Award color={template.color} size={24} />
                           {selectedTemplate === template.id && <CheckCircle2 size={18} color={template.color} />}
                        </div>
                        <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)' }}>{template.name}</h5>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{template.category}</p>
                     </motion.div>
                   ))}
                </div>

                <form onSubmit={handleInitializeGeneration} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {/* Blank Spaces configuration at the top */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                         <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Issuance Date</p>
                         <input 
                           type="date" 
                           value={issuanceDate}
                           onChange={(e) => setIssuanceDate(e.target.value)}
                           style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }} 
                         />
                      </div>
                      <div>
                         <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Principal / HOD Name</p>
                         <input 
                           type="text" 
                           placeholder="Type principal's name..." 
                           value={principalName}
                           onChange={(e) => setPrincipalName(e.target.value)}
                           required
                           style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                         />
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                         <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Recipient Type</p>
                         <select 
                           value={recipientType}
                           onChange={(e) => {
                             setRecipientType(e.target.value);
                             setRecipientIdInput('');
                             setRecipientName('');
                           }}
                           style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', cursor: 'pointer', outline: 'none' }}
                         >
                            <option>Student</option>
                            <option>Staff</option>
                            <option>Alumni</option>
                         </select>
                      </div>
                      <div style={{ position: 'relative' }}>
                         <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Recipient Search (ID or Name)</p>
                         <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                            <input 
                              type="text" 
                              placeholder="Type to search..." 
                              value={recipientIdInput}
                              onChange={(e) => {
                                setRecipientIdInput(e.target.value);
                                setRecipientName('');
                                setShowSuggestions(true);
                              }}
                              onFocus={() => setShowSuggestions(true)}
                              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                            />
                         </div>

                         {/* Floating Suggestions List */}
                         <AnimatePresence>
                           {showSuggestions && recipientIdInput && (
                             <motion.div 
                               initial={{ opacity: 0, y: 5 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0, y: 5 }}
                               style={{ 
                                 position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 100, 
                                 maxHeight: '180px', overflowY: 'auto', backgroundColor: 'var(--bg-card)', 
                                 border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', padding: '6px'
                               }}
                             >
                               {filteredSuggestions.length > 0 ? (
                                 filteredSuggestions.map((rec, i) => (
                                   <div 
                                     key={i} 
                                     onClick={() => handleSelectSuggestion(rec)}
                                     style={{ 
                                       padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)',
                                       display: 'flex', justifyContent: 'space-between', transition: '0.2s'
                                     }}
                                     onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                                     onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                   >
                                     <span style={{ fontWeight: 800 }}>{rec.name}</span>
                                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{rec.id}</span>
                                   </div>
                                 ))
                               ) : (
                                 <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No matching {recipientType} found.</div>
                               )}
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Recipient Name</p>
                      <input 
                        type="text" 
                        placeholder="Type recipient's name..." 
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      />
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     className="btn btn-primary" 
                     style={{ padding: '16px', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                   >
                      <Sparkles size={18} /> INITIALIZE GENERATION
                   </motion.button>
                </form>
             </div>
          </div>

          {/* Right: Live Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', opacity: 0.5, zIndex: 0 }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                   <h4 style={{ fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Live Preview</h4>
                    <div style={{ 
                      width: '100%', aspectRatio: '1.414/1', backgroundColor: '#FAF9F6', borderRadius: '8px', border: '12px double #8B7355', 
                      padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', color: '#1a1a1a',
                      boxShadow: 'inset 0 0 40px rgba(139,115,85,0.1)'
                    }}>
                       {/* Top Metadata Header: Date, Seal, Principal */}
                       <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderBottom: '1px solid #e5d8c0', paddingBottom: '14px' }}>
                           <div style={{ width: '95px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.6rem', color: '#333', fontWeight: 700, minHeight: '14px', display: 'block', paddingBottom: '2px' }}>
                                 {issuanceDate || ' '}
                              </span>
                              <div style={{ width: '100%', borderTop: '1px solid #8B7355', opacity: 0.8 }}></div>
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.5rem', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Issued</p>
                           </div>
                           
                           {/* Beautiful Official EduPro Stamp Seal */}
                           <div style={{ 
                              width: '52px', 
                              height: '52px', 
                              border: '2px solid #8B7355', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center', 
                              justifyContent: 'center',
                              position: 'relative',
                              padding: '2px',
                              boxSizing: 'border-box',
                              transform: 'rotate(-6deg)',
                              boxShadow: '0 2px 5px rgba(139,115,85,0.25)',
                              backgroundColor: '#FAF9F6',
                              userSelect: 'none'
                           }}>
                              <div style={{
                                 width: '100%',
                                 height: '100%',
                                 border: '1px dashed #8B7355',
                                 borderRadius: '50%',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 boxSizing: 'border-box'
                              }}>
                                 <span style={{ fontSize: '0.22rem', fontWeight: 900, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.6px', lineHeight: 1 }}>OFFICIAL</span>
                                 <span style={{ fontSize: '0.45rem', fontWeight: 900, fontFamily: 'Cinzel, Georgia, serif', color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '1px 0' }}>EDUPRO</span>
                                 <span style={{ fontSize: '0.22rem', fontWeight: 900, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.6px', lineHeight: 1 }}>SEAL</span>
                              </div>
                           </div>
                           
                           <div style={{ width: '95px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.6rem', color: '#444', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, minHeight: '14px', display: 'block', paddingBottom: '2px' }}>
                                 {principalName || ' '}
                              </span>
                              <div style={{ width: '100%', borderTop: '1px solid #8B7355', opacity: 0.8 }}></div>
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.5rem', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Principal</p>
                           </div>
                        </div>

                       {/* Main Content Body */}
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                          <Award size={36} color={templates.find(t => t.id === selectedTemplate)?.color} style={{ marginBottom: '8px' }} />
                          <h2 style={{ fontSize: '1.15rem', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 900, marginBottom: '6px', color: '#1a1a1a', letterSpacing: '1px' }}>CERTIFICATE OF EXCELLENCE</h2>
                          <p style={{ fontSize: '0.6rem', color: '#777', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>This official credential certifies that</p>
                          <h3 style={{ fontSize: '1.35rem', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 900, margin: '2px 0 8px 0', borderBottom: '2px solid #8B7355', paddingBottom: '4px', minWidth: '180px', color: '#2b2b2b' }}>
                            {recipientName || '[Recipient Name]'}
                          </h3>
                          <p style={{ fontSize: '0.6rem', color: '#555', lineHeight: 1.4, maxWidth: '280px', margin: '0 auto' }}>
                            Has successfully demonstrated outstanding performance and institutional commitment in the category of <span style={{ fontWeight: 800, color: templates.find(t => t.id === selectedTemplate)?.color }}>{templates.find(t => t.id === selectedTemplate)?.name}</span>.
                          </p>
                       </div>
                    </div>
                </div>
             </div>

             <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>Recent Certifications</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   {certifications.slice(0, 3).map((cert, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex' }}>
                             <User size={14} />
                           </div>
                           <div>
                             <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>{cert.name}</span>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cert.type}</span>
                           </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{cert.date}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REGISTRY LEDGER */}
      {activeTab === 'ledger' && (
        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {/* SEARCH & FILTERS HEADER */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search ledger by name, ID or verification code..." 
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
                />
             </div>
             <div>
                <select 
                  value={ledgerTypeFilter} 
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                   <option value="All">All Recipient Types</option>
                   <option value="Student">Students Only</option>
                   <option value="Staff">Staff Only</option>
                   <option value="Alumni">Alumni Only</option>
                </select>
             </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient ID</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient Type</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Credential / Subject</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification Code</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issuance Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLedger.length > 0 ? (
                    filteredLedger.map((cert) => (
                      <motion.tr 
                        layout
                        key={cert.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                      >
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex' }}>
                              <User size={16} />
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{cert.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>{cert.recipientId}</td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: cert.recipientType === 'Student' ? '#eef2ff' : (cert.recipientType === 'Staff' ? '#ecfdf5' : '#fffbeb'),
                            color: cert.recipientType === 'Student' ? '#4f46e5' : (cert.recipientType === 'Staff' ? '#10b981' : '#d97706')
                          }}>
                            {cert.recipientType}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', color: 'var(--text-main)', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={16} color="var(--primary)" />
                            {cert.type}
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{cert.code}</td>
                        <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>{cert.date}</td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <FileText size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                        <p style={{ margin: 0, fontWeight: 800 }}>No registry entries found.</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ISSUANCE CALENDAR */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          {/* Left: Monthly Calendar grid */}
          <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
                  style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
                  style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '12px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Calendar Grid Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} style={{ aspectRatio: '1/1' }}></div>;
                }

                const dayString = `2026-05-${day < 10 ? '0' + day : day}`;
                const dailyCerts = certifications.filter(c => c.date === dayString);
                const isSelected = selectedCalendarDate === dayString;

                return (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={idx}
                    onClick={() => setSelectedCalendarDate(dayString)}
                    style={{ 
                      aspectRatio: '1/1', borderRadius: '16px', border: '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-body)',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{day}</span>
                    {/* Glowing dots for issuances */}
                    {dailyCerts.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        {dailyCerts.slice(0, 3).map((c, cidx) => {
                          let dotColor = '#4880FF';
                          if (c.category === 'Athletics') dotColor = '#10b981';
                          if (c.category === 'Behavioral') dotColor = '#f59e0b';
                          if (c.category === 'Academics') dotColor = '#ec4899';
                          
                          return (
                            <span 
                              key={cidx} 
                              style={{ 
                                width: '6px', height: '6px', borderRadius: '50%', 
                                backgroundColor: isSelected ? 'white' : dotColor
                              }} 
                            />
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Daily Issuances list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Calendar size={18} color="var(--primary)" />
                <h4 style={{ fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Daily Issuance Logs</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Selected Date: <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{selectedCalendarDate}</span></p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certifications.filter(c => c.date === selectedCalendarDate).length > 0 ? (
                  certifications.filter(c => c.date === selectedCalendarDate).map((cert, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', display: 'block' }}>{cert.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cert.type}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>{cert.code}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 16px', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                    <File size={32} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)', fontSize: '0.85rem' }}>No Issuances Scheduled</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>No credentials configured to be generated on this calendar day.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH PRINT MODAL */}
      <AnimatePresence>
        {isPrintOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '600px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => setIsPrintOpen(false)}
                disabled={printProgress === 'printing'}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
                Batch Print Credentials
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Select certificates to dispatch to the local network printer system.</p>

              {printProgress === 'printing' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', marginBottom: '20px' }}
                  />
                  <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>Simulating Print Queue...</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Formatting certificate documents into vector print sheets.</p>
                </div>
              ) : (
                <>
                  {/* Select All Checkbox */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px' }}>
                    <input 
                      type="checkbox" 
                      onChange={toggleAllPrint} 
                      defaultChecked 
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                    />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Select All Certificates ({certifications.length})</span>
                  </div>

                  {/* List of items */}
                  <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px', marginBottom: '24px' }}>
                    {certifications.map((cert) => (
                      <label 
                        key={cert.id}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', 
                          border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-body)', cursor: 'pointer' 
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={!!selectedForPrint[cert.id]} 
                            onChange={() => togglePrintItem(cert.id)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                          />
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{cert.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cert.type}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{cert.code}</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsPrintOpen(false)}
                      className="btn" 
                      style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handlePrintSubmit}
                      className="btn btn-primary" 
                    >
                      Print Selected
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default Certificates;
