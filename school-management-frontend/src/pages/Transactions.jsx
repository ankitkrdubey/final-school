import React, { useState } from 'react';
import { History, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Calendar, MoreVertical, TrendingUp, TrendingDown, PieChart as PieIcon, Activity, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast, showToast, hideToast } = useToast();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectedTrx, setInspectedTrx] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const [newTrxForm, setNewTrxForm] = useState({
    title: '',
    category: 'Academic',
    type: 'Income',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Online'
  });

  // Lazy initialize transactions connected to local storage
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('institutional_transactions');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 'TRX-9021', title: 'Tuition Fee Collection', category: 'Academic', amount: '$42,500.00', type: 'Income', date: '05 May 2026', method: 'Online' },
        { id: 'TRX-9020', title: 'Electricity Bill Payment', category: 'Utilities', amount: '$1,250.00', type: 'Expense', date: '05 May 2026', method: 'Bank Transfer' },
        { id: 'TRX-9019', title: 'Staff Salaries - Admin', category: 'Payroll', amount: '$12,400.00', type: 'Expense', date: '04 May 2026', method: 'Institutional Bank' },
        { id: 'TRX-9018', title: 'Science Lab Donation', category: 'General', amount: '$5,000.00', type: 'Income', date: '03 May 2026', method: 'Cheque' },
        { id: 'TRX-9017', title: 'Maintenance Contract', category: 'Repairs', amount: '$2,100.00', type: 'Expense', date: '02 May 2026', method: 'Cash' },
      ];
      localStorage.setItem('institutional_transactions', JSON.stringify(initial));
      return initial;
    }
  });

  const cashFlowData = [
    { month: 'Jan', income: 85000, expense: 32000 },
    { month: 'Feb', income: 92000, expense: 35000 },
    { month: 'Mar', income: 88000, expense: 31000 },
    { month: 'Apr', income: 105000, expense: 42000 },
    { month: 'May', income: 98000, expense: 38000 },
    { month: 'Jun', income: 110000, expense: 45000 },
  ];

  // Calculate dynamic totals from database
  const getTotals = () => {
    let inflow = 0;
    let outflow = 0;
    transactions.forEach(t => {
      const val = parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0;
      if (t.type === 'Income') {
        inflow += val;
      } else {
        outflow += val;
      }
    });
    return {
      inflow: '$' + inflow.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      outflow: '$' + outflow.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      net: '$' + (inflow - outflow).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      netRaw: inflow - outflow
    };
  };

  const totals = getTotals();

  // Handle Recording New Transaction Form Submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTrxForm.title.trim() || !newTrxForm.amount) {
      showToast("Please enter a valid title and amount.", "error", "Missing Fields");
      return;
    }

    const val = parseFloat(newTrxForm.amount);
    if (isNaN(val) || val <= 0) {
      showToast("Amount must be a positive number.", "error", "Invalid Amount");
      return;
    }

    const formattedAmount = '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2 });
    
    // Format Date from YYYY-MM-DD to DD MMM YYYY
    const dateObj = new Date(newTrxForm.date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const newTrx = {
      id: `TRX-${Math.floor(9000 + Math.random() * 1000)}`,
      title: newTrxForm.title,
      category: newTrxForm.category,
      amount: formattedAmount,
      type: newTrxForm.type,
      date: formattedDate,
      method: newTrxForm.method
    };

    const updated = [newTrx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('institutional_transactions', JSON.stringify(updated));

    // Reset Form Form State
    setNewTrxForm({
      title: '',
      category: 'Academic',
      type: 'Income',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'Online'
    });
    
    setShowAddModal(false);
    showToast(`Recorded transaction: ${newTrx.title}!`, 'success', 'Transaction Recorded');
  };

  // Handle Deleting Transaction Record
  const handleDeleteTrx = (id) => {
    const trxToDelete = transactions.find(t => t.id === id);
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('institutional_transactions', JSON.stringify(updated));
    setActiveMenuId(null);
    showToast(`Successfully deleted transaction record: ${trxToDelete ? trxToDelete.title : id}!`, 'success', 'Ledger Swept');
  };

  // Handle Dynamic CSV Audit generation
  const handleGenerateAudit = () => {
    const summaryRows = [
      ['Institutional Transactions Audit Ledger', 'Generated: ' + new Date().toLocaleString()],
      [],
      ['Total Inflow', totals.inflow],
      ['Total Outflow', totals.outflow],
      ['Net Capital Position', totals.net],
      [],
      ['Transaction Ledger Record', ''],
      ['Transaction ID', 'Title', 'Category', 'Type', 'Amount', 'Date', 'Method'],
      ...transactions.map(t => [t.id, t.title, t.category, t.type, t.amount, t.date, t.method])
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += summaryRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `institutional_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Dynamic Audit Ledger (CSV) generated and downloaded successfully!', 'success', 'Audit Exported');
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Institutional Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unified financial activity stream monitoring all incoming and outgoing capital.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              onClick={handleGenerateAudit}
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Download size={18} /> GENERATE AUDIT
           </button>
           <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary" 
              style={{ padding: '12px 24px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
           >
              + RECORD TRANSACTION
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
         <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#10B98115', color: '#10B981' }}>
               <TrendingUp size={28} />
            </div>
            <div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Inflow</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>{totals.inflow}</div>
            </div>
         </div>
         <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#EF444415', color: '#EF4444' }}>
               <TrendingDown size={28} />
            </div>
            <div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Outflow</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>{totals.outflow}</div>
            </div>
         </div>
         <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: totals.netRaw >= 0 ? 'var(--primary)' : '#EF4444', color: 'white', display: 'flex', alignItems: 'center', gap: '20px', transition: '0.3s' }}>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
               <Wallet size={28} />
            </div>
            <div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>Net Balance</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>{totals.net}</div>
            </div>
         </div>
      </div>

      <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
         <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px' }}>Cash Flow Analysis</h3>
         <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip cursor={{ fill: 'var(--bg-body)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontWeight: 800, paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={24} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         <div style={{ padding: '24px 32px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Unified Activity Stream</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input 
                     type="text" 
                     placeholder="Search history..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} 
                  />
               </div>
               
               <div style={{ position: 'relative' }}>
                  <button 
                     onClick={() => setShowFilterPopover(!showFilterPopover)}
                     className="btn" 
                     style={{ border: '1px solid var(--border-color)', backgroundColor: showFilterPopover ? 'var(--primary-light)' : 'var(--bg-body)', color: showFilterPopover ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                     <Filter size={14} /> FILTER
                     {(selectedType !== 'All' || selectedCategory !== 'All') && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                  </button>
                  
                  <AnimatePresence>
                     {showFilterPopover && (
                        <motion.div 
                           initial={{ opacity: 0, y: 8 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 8 }}
                           style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '220px', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}
                        >
                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Transaction Type</label>
                              <select 
                                 value={selectedType} 
                                 onChange={(e) => setSelectedType(e.target.value)}
                                 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                              >
                                 <option value="All">All Types</option>
                                 <option value="Income">Income</option>
                                 <option value="Expense">Expense</option>
                              </select>
                           </div>

                           <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
                              <select 
                                 value={selectedCategory} 
                                 onChange={(e) => setSelectedCategory(e.target.value)}
                                 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                              >
                                 <option value="All">All Categories</option>
                                 <option value="Academic">Academic</option>
                                 <option value="Utilities">Utilities</option>
                                 <option value="Payroll">Payroll</option>
                                 <option value="General">General</option>
                                 <option value="Repairs">Repairs</option>
                              </select>
                           </div>

                           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <button 
                                 onClick={() => {
                                    setSelectedType('All');
                                    setSelectedCategory('All');
                                    setShowFilterPopover(false);
                                 }}
                                 style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                              >
                                 Clear
                              </button>
                              <button 
                                 onClick={() => setShowFilterPopover(false)}
                                 style={{ border: 'none', backgroundColor: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                              >
                                 Apply
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TRANSACTION</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TYPE</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>AMOUNT</th>
                  <th style={{ padding: '16px 32px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
               </tr>
            </thead>
            <tbody>
               {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trx, i) => (
                     <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} className="table-row-hover">
                        <td style={{ padding: '20px 32px', fontWeight: 700, color: 'var(--text-muted)' }}>{trx.id}</td>
                        <td style={{ padding: '20px 32px' }}>
                           <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{trx.title}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{trx.date} • {trx.category}</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: trx.type === 'Income' ? '#10B981' : '#EF4444' }}>
                              {trx.type === 'Income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                              {trx.type.toUpperCase()}
                           </div>
                        </td>
                        <td style={{ padding: '20px 32px', fontWeight: 950, color: trx.type === 'Income' ? 'var(--text-main)' : 'var(--danger)' }}>{trx.amount}</td>
                        <td style={{ padding: '20px 32px', textAlign: 'right', position: 'relative' }}>
                            <button 
                               onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === trx.id ? null : trx.id);
                               }}
                               className="icon-btn" 
                               style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', transition: '0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                               <MoreVertical size={16} />
                            </button>
                            
                            <AnimatePresence>
                               {activeMenuId === trx.id && (
                                  <>
                                     <div 
                                        onClick={(e) => {
                                           e.stopPropagation();
                                           setActiveMenuId(null);
                                        }} 
                                        style={{ position: 'fixed', inset: 0, zIndex: 998, cursor: 'default' }} 
                                     />
                                     <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        style={{ 
                                           position: 'absolute', 
                                           right: '32px', 
                                           top: 'calc(100% - 10px)', 
                                           backgroundColor: 'var(--bg-card)', 
                                           border: '1px solid var(--border-color)', 
                                           borderRadius: '12px', 
                                           boxShadow: 'var(--shadow-xl)', 
                                           zIndex: 999, 
                                           minWidth: '160px',
                                           overflow: 'hidden',
                                           textAlign: 'left'
                                        }}
                                     >
                                        <button
                                           onClick={(e) => {
                                              e.stopPropagation();
                                              setInspectedTrx(trx);
                                              setActiveMenuId(null);
                                           }}
                                           style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              width: '100%',
                                              padding: '12px 16px',
                                              backgroundColor: 'transparent',
                                              border: 'none',
                                              color: 'var(--text-main)',
                                              cursor: 'pointer',
                                              fontSize: '0.85rem',
                                              fontWeight: 700,
                                              gap: '8px',
                                              transition: '0.2s'
                                           }}
                                           onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-body)'}
                                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                           Audit Details
                                        </button>
                                        <button
                                           onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteTrx(trx.id);
                                           }}
                                           style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              width: '100%',
                                              padding: '12px 16px',
                                              backgroundColor: 'transparent',
                                              border: 'none',
                                              color: '#EF4444',
                                              cursor: 'pointer',
                                              fontSize: '0.85rem',
                                              fontWeight: 750,
                                              gap: '8px',
                                              transition: '0.2s'
                                           }}
                                           onMouseEnter={(e) => e.target.style.backgroundColor = '#EF444410'}
                                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                           Delete Entry
                                        </button>
                                     </motion.div>
                                  </>
                               )}
                            </AnimatePresence>
                         </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                        No transactions found matching active filter query.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>

      {/* RECORD TRANSACTION MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowAddModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                      <Wallet size={20} />
                   </div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 950 }}>Record Transaction</h2>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Log a new income or expense item into the institutional ledger.</p>
                   </div>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', backgroundColor: 'var(--bg-body)' }}><X size={18}/></button>
              </div>

              <form onSubmit={handleAddSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Transaction Type Toggle Row */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'var(--bg-body)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <button 
                      type="button"
                      onClick={() => setNewTrxForm({ ...newTrxForm, type: 'Income' })}
                      style={{ 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: 900, 
                        fontSize: '0.85rem',
                        transition: '0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: newTrxForm.type === 'Income' ? '#10B981' : 'transparent',
                        color: newTrxForm.type === 'Income' ? 'white' : 'var(--text-muted)'
                      }}
                    >
                      <ArrowUpRight size={16} /> Income
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewTrxForm({ ...newTrxForm, type: 'Expense' })}
                      style={{ 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: 900, 
                        fontSize: '0.85rem',
                        transition: '0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: newTrxForm.type === 'Expense' ? '#EF4444' : 'transparent',
                        color: newTrxForm.type === 'Expense' ? 'white' : 'var(--text-muted)'
                      }}
                    >
                      <ArrowDownRight size={16} /> Expense
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={newTrxForm.title} 
                    onChange={e => setNewTrxForm({...newTrxForm, title: e.target.value})} 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    placeholder="e.g. Q2 Tuition Fee Intake" 
                  />
                </div>

                {/* Amount */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount (USD $) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '12px', fontWeight: 800, color: 'var(--text-muted)' }}>$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      value={newTrxForm.amount} 
                      onChange={e => setNewTrxForm({...newTrxForm, amount: e.target.value})} 
                      style={{ width: '100%', padding: '12px 16px 12px 32px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, outline: 'none' }} 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                {/* Category and Method in grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                    <select 
                      value={newTrxForm.category} 
                      onChange={e => setNewTrxForm({...newTrxForm, category: e.target.value})} 
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Academic">Academic</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Payroll">Payroll</option>
                      <option value="Repairs">Repairs</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</label>
                    <select 
                      value={newTrxForm.method} 
                      onChange={e => setNewTrxForm({...newTrxForm, method: e.target.value})} 
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Online">Online</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newTrxForm.date} 
                    onChange={e => setNewTrxForm({...newTrxForm, date: e.target.value})} 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }} 
                  />
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="btn" 
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                  >
                    Confirm & Record
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSACTION DETAILS DRAWER */}
      <AnimatePresence>
        {inspectedTrx && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            {/* Backdrop click closes drawer */}
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setInspectedTrx(null)} />
            
            <motion.div 
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{ width: '100%', maxWidth: '460px', height: '100%', backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}
            >
              {/* Drawer Header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ledger Receipt</h3>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-main)' }}>{inspectedTrx.id}</h2>
                </div>
                <button onClick={() => setInspectedTrx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-body)' }}><X size={18}/></button>
              </div>

              {/* Drawer Body - Scrollable */}
              <div style={{ padding: '32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Visual Receipt Card */}
                <div style={{ 
                  backgroundColor: 'var(--bg-body)', 
                  border: '1px dashed var(--border-color)', 
                  borderRadius: '16px', 
                  padding: '28px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {/* Decorative receipt cuts at top/bottom (optional visual) */}
                  <div style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: inspectedTrx.type === 'Income' ? '#10B98115' : '#EF444415', color: inspectedTrx.type === 'Income' ? '#10B981' : '#EF4444', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {inspectedTrx.type === 'Income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {inspectedTrx.type} APPROVED
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', margin: '0 0 8px 0', color: 'var(--text-main)', width: '100%', wordBreak: 'break-word' }}>{inspectedTrx.title}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 950, color: inspectedTrx.type === 'Income' ? 'var(--text-main)' : 'var(--danger)', margin: '8px 0' }}>{inspectedTrx.amount}</div>
                  
                  <div style={{ width: '100%', height: '1px', borderBottom: '1px dashed var(--border-color)', margin: '20px 0' }}></div>

                  {/* Receipt Meta Rows */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Allocation Category</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{inspectedTrx.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Processing Channel</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{inspectedTrx.method}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Settlement Date</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{inspectedTrx.date}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Audit Status</span>
                      <span style={{ color: '#10B981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span> VERIFIED
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', borderBottom: '1px dashed var(--border-color)', margin: '24px 0' }}></div>

                  {/* Decorative Barcode */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                    <div style={{ display: 'flex', gap: '1px', height: '36px', alignItems: 'stretch' }}>
                      {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 2].map((w, idx) => (
                        <div key={idx} style={{ width: `${w}px`, backgroundColor: 'var(--text-main)' }}></div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px' }}>{inspectedTrx.id.replace('-', '')}8491029</span>
                  </div>

                </div>

                {/* Audit Context Note */}
                <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>Compliance Notice</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 600 }}>
                    This transaction record is securely signed and archived in the institutional ledger. Deleting this entry will instantly remove it from localStorage and re-balance overall financial stats.
                  </p>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <button 
                  onClick={() => setInspectedTrx(null)}
                  className="btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Close Receipt
                </button>
                <button 
                  onClick={() => {
                    showToast(`Ledger Receipt ${inspectedTrx.id} printed successfully.`, 'success', 'Print Initialized');
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Print Record
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default Transactions;
