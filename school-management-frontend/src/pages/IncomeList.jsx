import React, { useState, useMemo } from 'react';
import { TrendingUp, Plus, Search, Filter, Download, FileText, Wallet, ArrowUpRight, BarChart3, CreditCard, Clock, X, Save, CheckCircle2, AlertCircle, BadgeCheck, Hash, Calendar, Banknote, Tag, Building2, PieChart as PieIcon, ChevronRight, Layers, Eye } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   SEED DATA
───────────────────────────────────────── */
const SEED_INCOMES = [
  { id: 'INC-1021', source: 'Tuition Fee Collection',   head: 'Academic',    amount: 42500, date: '05 May 2026', method: 'Online Transfer', status: 'Completed' },
  { id: 'INC-1020', source: 'Cafeteria Revenue',         head: 'Ancillary',   amount: 1250,  date: '04 May 2026', method: 'Cash',            status: 'Completed' },
  { id: 'INC-1019', source: 'Annual Sports Sponsorship', head: 'Donation',    amount: 5000,  date: '03 May 2026', method: 'Cheque',          status: 'Pending'   },
  { id: 'INC-1018', source: 'Bus Subscription Q2',       head: 'Transport',   amount: 8400,  date: '01 May 2026', method: 'Online Transfer', status: 'Completed' },
  { id: 'INC-1017', source: 'Hostel Accommodation Fees', head: 'Hostel',      amount: 18000, date: '28 Apr 2026', method: 'Bank Transfer',   status: 'Completed' },
  { id: 'INC-1016', source: 'Lab Equipment Grant',       head: 'Donation',    amount: 7500,  date: '25 Apr 2026', method: 'Cheque',          status: 'Completed' },
  { id: 'INC-1015', source: 'Examination Fee Q2',        head: 'Academic',    amount: 12200, date: '22 Apr 2026', method: 'Online Transfer', status: 'Completed' },
  { id: 'INC-1014', source: 'Uniform Sales Apr',         head: 'Ancillary',   amount: 3400,  date: '20 Apr 2026', method: 'Cash',            status: 'Pending'   },
];

const TREND_DATA = [
  { month: 'Jan', amount: 85000 },
  { month: 'Feb', amount: 92000 },
  { month: 'Mar', amount: 88000 },
  { month: 'Apr', amount: 105000 },
  { month: 'May', amount: 98000 },
  { month: 'Jun', amount: 110000 },
];

const METHODS   = ['All', 'Online Transfer', 'Cash', 'Cheque', 'Bank Transfer'];
const STATUSES  = ['All', 'Completed', 'Pending'];
const HEAD_COLORS = {
  Academic:  'var(--primary)',
  Ancillary: '#F59E0B',
  Donation:  '#8B5CF6',
  Transport: '#10B981',
  Hostel:    '#06B6D4',
  Payroll:   '#EF4444',
  Other:     '#64748b',
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const nextId  = (list) => {
  const nums = list.map(i => parseInt(i.id.replace('INC-', '')) || 0);
  return 'INC-' + (Math.max(0, ...nums) + 1);
};
const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const STATUS_STYLE = {
  Completed: { bg: 'var(--success-light)', color: 'var(--success)', icon: <CheckCircle2 size={11}/> },
  Pending:   { bg: 'var(--warning-light)', color: 'var(--warning)', icon: <Clock size={11}/> },
};

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
  color: 'var(--text-main)', fontWeight: 700, fontSize: '0.88rem',
  outline: 'none', boxSizing: 'border-box',
};
const labelStyle = {
  display: 'block', fontSize: '0.68rem', fontWeight: 900,
  color: 'var(--text-muted)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const IncomeList = () => {

  /* ── Persistent income ledger ── */
  const [incomes, setIncomes] = useState(() => {
    try {
      const s = localStorage.getItem('income_ledger');
      if (s) return JSON.parse(s);
    } catch (_) {}
    localStorage.setItem('income_ledger', JSON.stringify(SEED_INCOMES));
    return SEED_INCOMES;
  });

  const persist = (updated) => {
    setIncomes(updated);
    localStorage.setItem('income_ledger', JSON.stringify(updated));
  };

  /* ── Income heads from localStorage (synced with IncomeHead page) ── */
  const headOptions = useMemo(() => {
    try {
      const s = localStorage.getItem('income_heads');
      if (s) {
        const parsed = JSON.parse(s);
        return parsed.filter(h => h.status === 'Active').map(h => h.title);
      }
    } catch (_) {}
    return ['Academic', 'Ancillary', 'Donation', 'Transport', 'Hostel'];
  }, []);

  /* ── UI state ── */
  const [searchQuery,       setSearchQuery]       = useState('');
  const [filterHead,        setFilterHead]        = useState('All');
  const [filterStatus,      setFilterStatus]      = useState('All');
  const [filterMethod,      setFilterMethod]      = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showReportModal,   setShowReportModal]   = useState(false);

  /* ── Add form state ── */
  const emptyForm = { source: '', head: headOptions[0] || 'Academic', amount: '', method: 'Online Transfer', status: 'Completed', date: '' };
  const [form,      setForm]      = useState(emptyForm);
  const [formError, setFormError] = useState('');

  /* ── Derived: filtered table ── */
  const filtered = useMemo(() => incomes.filter(inc => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q ||
      inc.source.toLowerCase().includes(q) ||
      inc.id.toLowerCase().includes(q) ||
      inc.head.toLowerCase().includes(q) ||
      inc.method.toLowerCase().includes(q);
    const matchH = filterHead   === 'All' || inc.head   === filterHead;
    const matchS = filterStatus === 'All' || inc.status === filterStatus;
    const matchM = filterMethod === 'All' || inc.method === filterMethod;
    return matchQ && matchH && matchS && matchM;
  }), [incomes, searchQuery, filterHead, filterStatus, filterMethod]);

  const activeFilters = [filterHead, filterStatus, filterMethod].filter(f => f !== 'All').length;

  /* ── Derived: reactive stats ── */
  const stats = useMemo(() => {
    const total     = incomes.reduce((s, i) => s + i.amount, 0);
    const academic  = incomes.filter(i => i.head === 'Academic').reduce((s, i) => s + i.amount, 0);
    const misc      = incomes.filter(i => !['Academic','Transport','Hostel'].includes(i.head)).reduce((s, i) => s + i.amount, 0);
    const pending   = incomes.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
    const pendingCt = incomes.filter(i => i.status === 'Pending').length;
    return [
      { label: 'Total Revenue',     value: fmt(total),    change: `${incomes.length} entries`,  color: 'var(--primary)',  icon: <TrendingUp size={20}/> },
      { label: 'Academic Income',   value: fmt(academic), change: `${Math.round(academic/total*100)||0}% of total`, color: '#10B981', icon: <CreditCard size={20}/> },
      { label: 'Miscellaneous',     value: fmt(misc),     change: 'Other heads',                  color: '#F59E0B',         icon: <Wallet size={20}/> },
      { label: 'Pending Deposits',  value: fmt(pending),  change: `${pendingCt} item${pendingCt!==1?'s':''}`,  color: '#EF4444',         icon: <Clock size={20}/> },
    ];
  }, [incomes]);

  /* ── Derived: report breakdown ── */
  const reportData = useMemo(() => {
    const headTotals = {};
    incomes.forEach(i => {
      headTotals[i.head] = (headTotals[i.head] || 0) + i.amount;
    });
    const grand = Object.values(headTotals).reduce((s,v) => s+v, 0) || 1;
    return Object.entries(headTotals)
      .sort((a,b) => b[1]-a[1])
      .map(([name, val]) => ({
        name,
        amount: val,
        pct: Math.round((val/grand)*100),
        color: HEAD_COLORS[name] || HEAD_COLORS.Other,
      }));
  }, [incomes]);

  /* ── Handlers ── */
  const handleExport = () => {
    const rows = [
      ['Income Ledger Export', `Generated: ${new Date().toLocaleString()}`],
      [],
      ['Transaction ID', 'Source / Description', 'Head', 'Amount', 'Method', 'Date', 'Status'],
      ...filtered.map(i => [i.id, i.source, i.head, fmt(i.amount), i.method, i.date, i.status]),
      [],
      ['Total', '', '', fmt(filtered.reduce((s,i) => s+i.amount, 0)), '', '', ''],
    ];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: encodeURI(csv), download: 'income_ledger.csv' });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, head: headOptions[0] || 'Academic' });
    setFormError('');
    setShowAddModal(true);
  };

  const validateForm = () => {
    if (!form.source.trim()) return 'Source / description is required.';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) return 'Please enter a valid positive amount.';
    return '';
  };

  const handleAddSave = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    const newInc = {
      id:     nextId(incomes),
      source: form.source.trim(),
      head:   form.head,
      amount: parseFloat(form.amount),
      date:   form.date || today(),
      method: form.method,
      status: form.status,
    };
    persist([newInc, ...incomes]);
    // Also sync to institutional_transactions
    try {
      const stored = localStorage.getItem('institutional_transactions');
      const master = stored ? JSON.parse(stored) : [];
      const updated = [{
        id:       newInc.id,
        title:    newInc.source,
        category: newInc.head,
        amount:   fmt(newInc.amount),
        type:     'Income',
        date:     newInc.date,
        method:   newInc.method,
      }, ...master];
      localStorage.setItem('institutional_transactions', JSON.stringify(updated));
    } catch (_) {}
    setShowAddModal(false);
  };

  const clearFilters = () => {
    setSearchQuery(''); setFilterHead('All'); setFilterStatus('All'); setFilterMethod('All');
  };

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '48px' }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', marginBottom: '6px' }}>
            <div style={{ padding: '8px', backgroundColor: '#10B98115', borderRadius: '10px' }}>
              <TrendingUp size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue Management</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Income Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px', fontWeight: 600 }}>
            Comprehensive record of all incoming institutional funds and revenue streams.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            className="btn"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Download size={16}/> Export Ledger
          </button>
          <button
            onClick={openAdd}
            className="btn btn-primary"
            style={{ padding: '11px 22px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, cursor: 'pointer' }}
          >
            <Plus size={16}/> Add Income
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ padding: '22px', border: '1px solid var(--border-color)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#10B981', backgroundColor: '#10B98115', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
                {stat.change}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 950 }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Analytics Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Trend chart */}
        <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: '0 0 24px 0' }}>Revenue Growth Trends</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.22}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={v => `₹${v/1000}k`}/>
                <Tooltip formatter={v => [fmt(v), 'Revenue']}/>
                <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecasting card */}
        <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: '0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
            <BarChart3 size={30}/>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 950, margin: '0 0 12px' }}>Smart Financial Forecasting</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: '1.7', margin: '0 0 24px', fontWeight: 600 }}>
            Based on Q2 collection patterns, a <strong style={{ color: 'var(--primary)' }}>14% increase</strong> in ancillary revenue is projected due to upcoming summer programmes.
          </p>
          <button
            onClick={() => setShowReportModal(true)}
            className="btn btn-primary"
            style={{ alignSelf: 'center', padding: '11px 24px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={15}/> View Detailed Report
          </button>
        </div>
      </div>

      {/* ── Income Table ── */}
      <div className="card" style={{ padding: 0, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '18px 24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 950, margin: 0 }}>Recent Collections</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}/>
              <input
                type="text"
                placeholder="Search transactions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.82rem', fontWeight: 600, width: '220px' }}
              />
            </div>

            {/* Filter popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterPopover(p => !p)}
                className="btn"
                style={{ border: `1px solid ${activeFilters > 0 ? 'var(--primary)' : 'var(--border-color)'}`, backgroundColor: activeFilters > 0 ? 'var(--primary-light)' : 'var(--bg-body)', color: activeFilters > 0 ? 'var(--primary)' : 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                <Filter size={14}/>
                Filter
                {activeFilters > 0 && (
                  <span style={{ backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 900 }}>
                    {activeFilters}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showFilterPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 300, width: '240px', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Advanced Filter</span>
                      <button onClick={() => setShowFilterPopover(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14}/></button>
                    </div>

                    {/* Head filter */}
                    <div>
                      <label style={labelStyle}>Income Head</label>
                      <select value={filterHead} onChange={e => setFilterHead(e.target.value)} style={inputStyle}>
                        <option value="All">All Heads</option>
                        {[...new Set(incomes.map(i => i.head))].map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>

                    {/* Status filter */}
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
                        {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                      </select>
                    </div>

                    {/* Method filter */}
                    <div>
                      <label style={labelStyle}>Payment Method</label>
                      <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} style={inputStyle}>
                        {METHODS.map(m => <option key={m} value={m}>{m === 'All' ? 'All Methods' : m}</option>)}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--border-color)' }}>
                      <button onClick={() => { setFilterHead('All'); setFilterStatus('All'); setFilterMethod('All'); }} style={{ flex: 1, background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                        Clear All
                      </button>
                      <button onClick={() => setShowFilterPopover(false)} style={{ flex: 2, backgroundColor: 'var(--primary)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active-filter banner */}
        {(searchQuery || activeFilters > 0) && (
          <div style={{ padding: '8px 24px', backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={13} color="var(--primary)"/>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} — total {fmt(filtered.reduce((s,i)=>s+i.amount,0))}
            </span>
            <button onClick={clearFilters} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}>
              Clear all
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                {['Transaction ID', 'Source / Description', 'Head', 'Amount', 'Method', 'Status'].map((h, i) => (
                  <th key={h} style={{ padding: '13px 24px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? filtered.map((inc, idx) => (
                  <motion.tr
                    key={inc.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{inc.id}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{inc.source}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{inc.date}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 900, backgroundColor: `${HEAD_COLORS[inc.head] || HEAD_COLORS.Other}18`, color: HEAD_COLORS[inc.head] || HEAD_COLORS.Other }}>
                        {inc.head}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 950, color: '#10B981', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>{fmt(inc.amount)}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{inc.method}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 900, backgroundColor: STATUS_STYLE[inc.status]?.bg, color: STATUS_STYLE[inc.status]?.color }}>
                        {STATUS_STYLE[inc.status]?.icon}
                        {inc.status}
                      </span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '56px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <FileText size={36} color="var(--text-muted)" style={{ opacity: 0.35 }}/>
                        <div style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No income records found</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', opacity: 0.7 }}>Try adjusting your search or filters.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div style={{ padding: '11px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {filtered.length} of {incomes.length} records
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              Total shown: <strong style={{ color: '#10B981' }}>{fmt(filtered.reduce((s,i)=>s+i.amount,0))}</strong>
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          ADD INCOME MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(7px)' }}
            />
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '540px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.25)' }}
            >
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Income Ledger</div>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Record New Income</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', backdropFilter: 'blur(4px)' }}>
                  <X size={18}/>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddSave} style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Source / Description *</label>
                  <input type="text" placeholder="e.g. Tuition Fee Collection" value={form.source} onChange={e => setForm(p=>({...p,source:e.target.value}))} style={inputStyle}/>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Income Head *</label>
                    <select value={form.head} onChange={e => setForm(p=>({...p,head:e.target.value}))} style={inputStyle}>
                      {headOptions.length > 0
                        ? headOptions.map(h => <option key={h} value={h}>{h}</option>)
                        : ['Academic','Ancillary','Donation','Transport','Hostel'].map(h => <option key={h} value={h}>{h}</option>)
                      }
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Amount (₹) *</label>
                    <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(p=>({...p,amount:e.target.value}))} style={inputStyle}/>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Payment Method</label>
                    <select value={form.method} onChange={e => setForm(p=>({...p,method:e.target.value}))} style={inputStyle}>
                      {METHODS.filter(m=>m!=='All').map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} style={inputStyle}>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Date (optional — defaults to today)</label>
                  <input type="date" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} style={inputStyle}/>
                </div>

                {formError && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700 }}>
                    ⚠ {formError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={16}/> Save Income Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          DETAILED REPORT MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showReportModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '620px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.28)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, var(--primary), #7c3aed)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, zIndex: 10 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Financial Intelligence</div>
                  <h2 style={{ color: '#fff', fontSize: '1.55rem', fontWeight: 900, margin: 0 }}>Detailed Income Report</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: '6px 0 0', fontWeight: 600 }}>
                    Live breakdown across {incomes.length} transactions · {fmt(incomes.reduce((s,i)=>s+i.amount,0))} total
                  </p>
                </div>
                <button onClick={() => setShowReportModal(false)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', backdropFilter: 'blur(4px)', flexShrink: 0 }}>
                  <X size={18}/>
                </button>
              </div>

              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Summary KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  {[
                    { label: 'Gross Revenue',    val: fmt(incomes.reduce((s,i)=>s+i.amount,0)),              color: 'var(--primary)' },
                    { label: 'Completed',         val: fmt(incomes.filter(i=>i.status==='Completed').reduce((s,i)=>s+i.amount,0)), color: 'var(--success)' },
                    { label: 'Pending',           val: fmt(incomes.filter(i=>i.status==='Pending').reduce((s,i)=>s+i.amount,0)),   color: 'var(--warning)' },
                  ].map(kpi => (
                    <div key={kpi.label} style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{kpi.label}</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 950, color: kpi.color }}>{kpi.val}</div>
                    </div>
                  ))}
                </div>

                {/* Category breakdown with animated bars */}
                <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                    Revenue by Head Category
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {reportData.map(cat => (
                      <div key={cat.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}/>
                            <span style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                          </div>
                          <span style={{ fontWeight: 900, color: cat.color }}>
                            {fmt(cat.amount)} <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>({cat.pct}%)</span>
                          </span>
                        </div>
                        <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.pct}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            style={{ height: '100%', backgroundColor: cat.color, borderRadius: '99px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 3 sources */}
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '12px' }}>Top Revenue Sources</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[...incomes].sort((a,b)=>b.amount-a.amount).slice(0,4).map((inc, i) => (
                      <div key={inc.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: `${HEAD_COLORS[inc.head]||HEAD_COLORS.Other}18`, color: HEAD_COLORS[inc.head]||HEAD_COLORS.Other, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>
                          {i+1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.source}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{inc.head} · {inc.date}</div>
                        </div>
                        <div style={{ fontWeight: 950, color: '#10B981', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>{fmt(inc.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Forecast callout */}
                <div style={{ padding: '18px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-light), rgba(124,58,237,0.08))', border: '1px solid var(--primary)40', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <BarChart3 size={18}/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px' }}>AI Revenue Forecast</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6 }}>
                      Based on Q2 trends, total income is projected to reach <strong style={{ color: 'var(--primary)' }}>{fmt(incomes.reduce((s,i)=>s+i.amount,0)*1.14)}</strong> next quarter — a 14% growth driven by summer programme enrolments and transport subscriptions.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleExport} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Download size={15}/> Export CSV
                  </button>
                  <button onClick={() => setShowReportModal(false)} className="btn btn-primary" style={{ flex: 1, padding: '13px', fontWeight: 900, cursor: 'pointer', borderRadius: '12px' }}>
                    Close Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IncomeList;
