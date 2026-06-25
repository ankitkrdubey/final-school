import React, { useState, useMemo } from 'react';
import { IndianRupee, TrendingDown, Search, Filter, Plus, FileText, ArrowUpRight, ArrowDownRight, Building, Wallet, Download, Edit, Trash2, X, Save, Tag, Calendar, User, CheckCircle2, Clock, AlertCircle, BadgeCheck, Hash, ChevronDown, Package } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   SEED DATA
───────────────────────────────────────── */
const SEED_EXPENSES = [
  { id: 'EXP-1021', title: 'Monthly Electricity Bill', category: 'Utilities',   amount: 1250.00, date: '05 May 2026', status: 'Paid',    vendor: 'City Power Co.' },
  { id: 'EXP-1020', title: 'Lab Equipment Upgrade',    category: 'Academics',   amount: 4500.00, date: '04 May 2026', status: 'Pending', vendor: 'SciTech Solutions' },
  { id: 'EXP-1019', title: 'Garden Maintenance',       category: 'Maintenance', amount: 350.00,  date: '03 May 2026', status: 'Paid',    vendor: 'GreenThumb Ltd.' },
  { id: 'EXP-1018', title: 'Faculty Salaries',         category: 'Payroll',     amount: 28400.00,date: '01 May 2026', status: 'Paid',    vendor: 'Institutional Bank' },
  { id: 'EXP-1017', title: 'New Textbooks',            category: 'Academics',   amount: 1800.00, date: '28 Apr 2026', status: 'Paid',    vendor: 'EduPublishers' },
  { id: 'EXP-1016', title: 'Water Supply Bill',        category: 'Utilities',   amount: 450.00,  date: '25 Apr 2026', status: 'Paid',    vendor: 'Metro Water' },
  { id: 'EXP-1015', title: 'Classroom Furniture',      category: 'Maintenance', amount: 6200.00, date: '22 Apr 2026', status: 'Pending', vendor: 'FurnishPro Ltd.' },
  { id: 'EXP-1014', title: 'Internet & Broadband',     category: 'Utilities',   amount: 320.00,  date: '20 Apr 2026', status: 'Paid',    vendor: 'NetConnect ISP' },
];

const DEFAULT_CATEGORIES = ['Utilities', 'Academics', 'Maintenance', 'Payroll'];

const loadExpenseCategories = () => {
  try {
    const s = localStorage.getItem('expense_heads');
    if (s) {
      const parsed = JSON.parse(s);
      const active = parsed.filter(h => h.status === 'Active').map(h => h.title);
      return active.length > 0 ? active : DEFAULT_CATEGORIES;
    }
  } catch (_) {}
  return DEFAULT_CATEGORIES;
};

const CAT_COLORS = {
  Payroll:     'var(--primary)',
  Maintenance: '#F59E0B',
  Utilities:   '#10B981',
  Academics:   '#8B5CF6',
  Other:       '#64748b',
};

const STATUS_STYLE = {
  Paid:    { bg: 'var(--success-light)', color: 'var(--success)',  icon: <CheckCircle2 size={12}/> },
  Pending: { bg: '#EF444415',            color: '#EF4444',         icon: <Clock size={12}/> },
};

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

const nextId = (list) => {
  const nums = list.map(e => parseInt(e.id.replace('EXP-', '')) || 0);
  return 'EXP-' + (Math.max(0, ...nums) + 1);
};

const todayStr = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const SchoolExpenses = () => {

  /* ── Persistent state ── */
  const [expenses, setExpenses] = useState(() => {
    try {
      const s = localStorage.getItem('school_expenses');
      if (s) return JSON.parse(s);
    } catch (_) {}
    localStorage.setItem('school_expenses', JSON.stringify(SEED_EXPENSES));
    return SEED_EXPENSES;
  });

  const persist = (updated) => {
    setExpenses(updated);
    localStorage.setItem('school_expenses', JSON.stringify(updated));
  };

  /* ── Dynamic categories from expense_heads ── */
  const expenseCategories = useMemo(() => loadExpenseCategories(), []);
  const allCategories = ['All', ...expenseCategories];

  /* ── UI state ── */
  const [searchQuery,       setSearchQuery]       = useState('');
  const [selectedCategory,  setSelectedCategory]  = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showEditModal,     setShowEditModal]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingExpense,    setEditingExpense]    = useState(null);
  const [deletingId,        setDeletingId]        = useState(null);
  const [toast,             setToast]             = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Form state ── */
  const emptyForm = { title: '', category: expenseCategories[0] || 'Utilities', amount: '', vendor: '', status: 'Pending' };
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  /* ── Chart data (static trends) ── */
  const expenseTrends = [
    { month: 'Jan', amount: 32000 },
    { month: 'Feb', amount: 35000 },
    { month: 'Mar', amount: 31000 },
    { month: 'Apr', amount: 42000 },
    { month: 'May', amount: 38000 },
    { month: 'Jun', amount: 45000 },
  ];

  /* ── Derived: pie chart data from live expenses ── */
  const distributionData = useMemo(() => {
    const totals = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    const grand = Object.values(totals).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(totals).map(([name, val]) => ({
      name,
      value: Math.round((val / grand) * 100),
      color: CAT_COLORS[name] || CAT_COLORS.Other,
    }));
  }, [expenses]);

  /* ── Derived: reactive stats ── */
  const stats = useMemo(() => {
    const total   = expenses.reduce((s, e) => s + e.amount, 0);
    const paid    = expenses.filter(e => e.status === 'Paid').reduce((s, e) => s + e.amount, 0);
    const pending = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0);
    const vendors = new Set(expenses.map(e => e.vendor)).size;
    const pct     = total > 0 ? Math.round((paid / total) * 100) : 0;
    return [
      { label: 'Total Spend',    value: fmt(total),   change: `${expenses.length} entries`,  isPositive: false, color: '#EF4444' },
      { label: 'Budget Paid',    value: `${pct}%`,    change: fmt(paid) + ' paid',            isPositive: true,  color: '#10B981' },
      { label: 'Active Vendors', value: String(vendors), change: `${vendors} vendors`,        isPositive: true,  color: 'var(--primary)' },
      { label: 'Pending Amount', value: fmt(pending), change: `${expenses.filter(e=>e.status==='Pending').length} unpaid`, isPositive: false, color: '#F59E0B' },
    ];
  }, [expenses]);

  /* ── Derived: filtered table ── */
  const filtered = useMemo(() =>
    expenses.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q);
      const matchC = selectedCategory === 'All' || e.category === selectedCategory;
      return matchQ && matchC;
    }),
    [expenses, searchQuery, selectedCategory]
  );

  const activeFilters = selectedCategory !== 'All' ? 1 : 0;

  /* ── Handlers ── */
  const handleExport = () => {
    const rows = [
      ['School Expenses Ledger Export', `Generated: ${new Date().toLocaleString()}`],
      [],
      ['Expense ID', 'Description', 'Category', 'Amount', 'Vendor', 'Date', 'Status'],
      ...filtered.map(e => [e.id, e.title, e.category, fmt(e.amount), e.vendor, e.date, e.status]),
      [],
      ['Total', '', '', fmt(filtered.reduce((s,e) => s+e.amount, 0)), '', '', ''],
    ];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: encodeURI(csv), download: 'school_expenses_ledger.csv' });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('success', 'Ledger exported successfully.');
  };

  const openAdd = () => {
    setForm({ title: '', category: expenseCategories[0] || 'Utilities', amount: '', vendor: '', status: 'Pending' });
    setFormError('');
    setShowAddModal(true);
  };

  const openEdit = (exp) => {
    setEditingExpense(exp);
    setForm({ title: exp.title, category: exp.category, amount: String(exp.amount), vendor: exp.vendor, status: exp.status });
    setFormError('');
    setShowEditModal(true);
  };

  const openDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const validateForm = () => {
    if (!form.title.trim())        return 'Description is required.';
    if (!form.vendor.trim())       return 'Vendor name is required.';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) return 'Please enter a valid positive amount.';
    return '';
  };

  const handleAddSave = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    const newExp = {
      id:       nextId(expenses),
      title:    form.title.trim(),
      category: form.category,
      amount:   parseFloat(form.amount),
      vendor:   form.vendor.trim(),
      date:     todayStr(),
      status:   form.status,
    };
    persist([newExp, ...expenses]);
    setShowAddModal(false);
    showToast('success', 'New expense logged successfully.');
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    const updated = expenses.map(ex =>
      ex.id === editingExpense.id
        ? { ...ex, title: form.title.trim(), category: form.category, amount: parseFloat(form.amount), vendor: form.vendor.trim(), status: form.status }
        : ex
    );
    persist(updated);
    setShowEditModal(false);
    showToast('success', 'Expense updated successfully.');
  };

  const handleDelete = () => {
    persist(expenses.filter(e => e.id !== deletingId));
    setShowDeleteConfirm(false);
    setDeletingId(null);
    showToast('success', 'Expense deleted successfully.');
  };

  /* ── Shared styles for modals ── */
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* ── Toast popup ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#4880FF', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: '#EF444415', borderRadius: '10px' }}>
              <TrendingDown size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Expenditure Tracking</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>School Expenses</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', fontWeight: 600 }}>
            Manage institutional spending, monitor budgets, and audit expenditures.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            className="btn"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Download size={16} /> Export Ledger
          </button>
          <button
            onClick={openAdd}
            className="btn btn-primary"
            style={{ padding: '11px 24px', backgroundColor: '#EF4444', border: 'none', fontWeight: 900, boxShadow: '0 4px 14px rgba(239,68,68,0.28)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Log New Expense
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
            style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{stat.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: stat.isPositive ? '#10B981' : '#EF4444' }}>{stat.change}</div>
            </div>
            <div style={{ height: '3px', borderRadius: '99px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '60%', backgroundColor: stat.color, borderRadius: '99px', opacity: 0.6 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Analytics Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
        <div className="card" style={{ padding: '28px', borderRadius: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 950, marginBottom: '28px', margin: '0 0 28px 0' }}>Spending Trends</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenseTrends}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip formatter={v => [fmt(v), 'Spending']} />
                <Area type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '28px', borderRadius: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 950, margin: '0 0 24px 0' }}>Expense Allocation</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {distributionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, name) => [`${v}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {distributionData.map((cat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 900 }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expense Ledger Table ── */}
      <div className="card" style={{ padding: 0, borderRadius: '28px', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', backgroundColor: 'var(--bg-body)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Recent Expenditures</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search expenses…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.83rem', fontWeight: 600, width: '220px' }}
              />
            </div>

            {/* Filter popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterPopover(p => !p)}
                className="btn"
                style={{ border: `1px solid ${activeFilters > 0 ? '#EF4444' : 'var(--border-color)'}`, backgroundColor: activeFilters > 0 ? '#EF444412' : 'var(--bg-card)', color: activeFilters > 0 ? '#EF4444' : 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                <Filter size={14} />
                {selectedCategory === 'All' ? 'Filter' : selectedCategory}
                {activeFilters > 0 && (
                  <span style={{ backgroundColor: '#EF4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 900 }}>
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
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 300, width: '200px', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</span>
                      <button onClick={() => setShowFilterPopover(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={13} /></button>
                    </div>
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setShowFilterPopover(false); }}
                        style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: selectedCategory === cat ? '#EF444412' : 'transparent', color: selectedCategory === cat ? '#EF4444' : 'var(--text-main)', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {cat !== 'All' && (
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: CAT_COLORS[cat] || CAT_COLORS.Other, flexShrink: 0 }} />
                        )}
                        {cat === 'All' ? 'All Categories' : cat}
                        {selectedCategory === cat && <BadgeCheck size={13} style={{ marginLeft: 'auto' }} />}
                      </button>
                    ))}
                    {selectedCategory !== 'All' && (
                      <button
                        onClick={() => { setSelectedCategory('All'); setShowFilterPopover(false); }}
                        style={{ marginTop: '4px', padding: '6px', border: 'none', background: 'none', color: '#EF4444', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', textAlign: 'center' }}
                      >
                        Clear filter
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Result badge */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div style={{ padding: '8px 28px', backgroundColor: '#EF444410', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={13} color="#EF4444" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} — total {fmt(filtered.reduce((s,e)=>s+e.amount,0))}
            </span>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}>
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                {['Expense ID', 'Description', 'Category', 'Amount', 'Status', 'Date', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 24px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: i === 6 ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? filtered.map((exp, i) => (
                  <motion.tr
                    key={exp.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#EF4444', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{exp.id}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.88rem' }}>{exp.title}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vendor: {exp.vendor}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: `${CAT_COLORS[exp.category] || CAT_COLORS.Other}18`, color: CAT_COLORS[exp.category] || CAT_COLORS.Other }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 950, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>{fmt(exp.amount)}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: STATUS_STYLE[exp.status]?.bg, color: STATUS_STYLE[exp.status]?.color }}>
                        {STATUS_STYLE[exp.status]?.icon}
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{exp.date}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEdit(exp)}
                          title="Edit Expense"
                          style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => openDelete(exp.id)}
                          title="Delete Expense"
                          style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '56px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Package size={36} color="var(--text-muted)" style={{ opacity: 0.35 }} />
                        <div style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No expenses found</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', opacity: 0.7 }}>Try clearing your search or filter.</div>
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
          <div style={{ padding: '12px 28px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {filtered.length} of {expenses.length} records
            </span>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              Total: <strong style={{ color: '#EF4444' }}>{fmt(filtered.reduce((s,e)=>s+e.amount,0))}</strong>
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          ADD EXPENSE MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(7px)' }}
            />
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.25)' }}
            >
              {/* Modal header */}
              <div style={{ background: 'linear-gradient(135deg, #EF4444, #b91c1c)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Expenditure Tracking</div>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Log New Expense</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', backdropFilter: 'blur(4px)' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSave} style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Description</label>
                  <input type="text" placeholder="e.g. Monthly Electricity Bill" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                      {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Amount (₹)</label>
                    <input type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Vendor / Payee</label>
                    <input type="text" placeholder="e.g. City Power Co." value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                {formError && <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#EF444418', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.8rem', fontWeight: 700 }}>⚠ {formError}</div>}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: '#EF4444', color: '#fff', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={16} /> Save Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          EDIT EXPENSE MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showEditModal && editingExpense && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(7px)' }}
            />
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.25)' }}
            >
              <div style={{ background: 'linear-gradient(135deg, var(--primary), #7c3aed)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Editing · {editingExpense.id}
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Edit Expenditure</h2>
                </div>
                <button onClick={() => setShowEditModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', backdropFilter: 'blur(4px)' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSave} style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Description</label>
                  <input type="text" placeholder="e.g. Monthly Electricity Bill" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                      {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Amount (₹)</label>
                    <input type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Vendor / Payee</label>
                    <input type="text" placeholder="e.g. City Power Co." value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                {formError && <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#EF444418', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.8rem', fontWeight: 700 }}>⚠ {formError}</div>}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '13px', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={16} /> Update Ledger
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          DELETE CONFIRM MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '36px', boxShadow: '0 40px 80px rgba(0,0,0,0.28)', textAlign: 'center' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EF444415', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}>
                <Trash2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px' }}>Delete Expense?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '28px', lineHeight: 1.6 }}>
                This will permanently remove <strong style={{ color: 'var(--text-main)' }}>{deletingId}</strong> from the institutional ledger. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}>
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{ flex: 1, padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: '#EF4444', color: '#fff', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SchoolExpenses;
