import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Grid, Plus, Edit, Trash2, Search, Filter,
  FileText, Info, Save, X, CheckCircle2,
  AlertCircle, Tag, Hash, ToggleLeft, ToggleRight,
  BadgeCheck, ChevronDown, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   SEED DATA
───────────────────────────────────────── */
const SEED_HEADS = [
  { id: 1, title: 'Tuition Fees',      code: 'INC-001', description: 'Monthly student tuition collection',   status: 'Active' },
  { id: 2, title: 'Admission Fees',    code: 'INC-002', description: 'One-time admission charges',           status: 'Active' },
  { id: 3, title: 'Library Fine',      code: 'INC-003', description: 'Overdue book penalties',               status: 'Active' },
  { id: 4, title: 'Transport Charges', code: 'INC-004', description: 'Monthly school bus subscription',      status: 'Active' },
  { id: 5, title: 'Uniform Sales',     code: 'INC-005', description: 'Direct sales from school store',       status: 'Inactive' },
  { id: 6, title: 'Hostel Fee',        code: 'INC-006', description: 'Residential accommodation charges',    status: 'Active' },
  { id: 7, title: 'Examination Fee',   code: 'INC-007', description: 'Term-end examination processing fee', status: 'Active' },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const nextCode = (list) => {
  const nums = list.map(h => parseInt(h.code.replace('INC-', '')) || 0);
  const n = Math.max(0, ...nums) + 1;
  return 'INC-' + String(n).padStart(3, '0');
};
const nextId = (list) => Math.max(0, ...list.map(h => h.id)) + 1;

const STATUS_STYLE = {
  Active:   { bg: 'var(--success-light)', color: 'var(--success)', icon: <CheckCircle2 size={11}/> },
  Inactive: { bg: 'var(--danger-light)',  color: 'var(--danger)',  icon: <AlertCircle size={11}/> },
};

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
  color: 'var(--text-main)', fontWeight: 700, fontSize: '0.88rem',
  outline: 'none', boxSizing: 'border-box'
};
const labelStyle = {
  display: 'block', fontSize: '0.68rem', fontWeight: 900,
  color: 'var(--text-muted)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.5px'
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const IncomeHead = () => {

  /* ── Persistent state ── */
  const [heads, setHeads] = useState(() => {
    try {
      const s = localStorage.getItem('income_heads');
      if (s) return JSON.parse(s);
    } catch (_) {}
    localStorage.setItem('income_heads', JSON.stringify(SEED_HEADS));
    return SEED_HEADS;
  });

  const persist = (updated) => {
    setHeads(updated);
    localStorage.setItem('income_heads', JSON.stringify(updated));
  };

  /* ── UI state ── */
  const [searchQuery,       setSearchQuery]       = useState('');
  const [filterStatus,      setFilterStatus]      = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId,        setDeletingId]        = useState(null);

  /* ── Sidebar panel state ── */
  // mode: null (hidden) | 'add' | 'edit'
  const [panelMode,    setPanelMode]    = useState(null);
  const [editingHead,  setEditingHead]  = useState(null);
  const [formTitle,    setFormTitle]    = useState('');
  const [formDesc,     setFormDesc]     = useState('');
  const [formStatus,   setFormStatus]   = useState('Active');
  const [formError,    setFormError]    = useState('');

  const titleRef = useRef(null);

  /* Focus title field whenever panel opens */
  useEffect(() => {
    if (panelMode) {
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [panelMode]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => heads.filter(h => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q ||
      h.title.toLowerCase().includes(q) ||
      h.code.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q);
    const matchS = filterStatus === 'All' || h.status === filterStatus;
    return matchQ && matchS;
  }), [heads, searchQuery, filterStatus]);

  /* ── Handlers ── */
  const openAdd = () => {
    setEditingHead(null);
    setFormTitle(''); setFormDesc(''); setFormStatus('Active'); setFormError('');
    setPanelMode('add');
  };

  const openEdit = (head) => {
    setEditingHead(head);
    setFormTitle(head.title); setFormDesc(head.description); setFormStatus(head.status); setFormError('');
    setPanelMode('edit');
  };

  const closePanel = () => {
    setPanelMode(null);
    setEditingHead(null);
    setFormError('');
  };

  const validate = () => {
    if (!formTitle.trim()) return 'Income head title is required.';
    if (!formDesc.trim())  return 'Please add a short description.';
    if (heads.some(h => h.title.toLowerCase() === formTitle.trim().toLowerCase() && h.id !== editingHead?.id))
      return 'An income head with this title already exists.';
    return '';
  };

  const handleSave = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }

    if (panelMode === 'add') {
      const newHead = {
        id:          nextId(heads),
        title:       formTitle.trim(),
        code:        nextCode(heads),
        description: formDesc.trim(),
        status:      formStatus,
      };
      persist([...heads, newHead]);
    } else {
      persist(heads.map(h =>
        h.id === editingHead.id
          ? { ...h, title: formTitle.trim(), description: formDesc.trim(), status: formStatus }
          : h
      ));
    }
    closePanel();
  };

  const openDelete = (id) => { setDeletingId(id); setShowDeleteConfirm(true); };

  const handleDelete = () => {
    persist(heads.filter(h => h.id !== deletingId));
    setShowDeleteConfirm(false);
    setDeletingId(null);
    // If we were editing this head, close the panel
    if (editingHead?.id === deletingId) closePanel();
  };

  const toggleStatus = (head) => {
    persist(heads.map(h =>
      h.id === head.id
        ? { ...h, status: h.status === 'Active' ? 'Inactive' : 'Active' }
        : h
    ));
    if (editingHead?.id === head.id) {
      setFormStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
    }
  };

  const deletingHead = heads.find(h => h.id === deletingId);
  const activeCount   = heads.filter(h => h.status === 'Active').length;
  const inactiveCount = heads.filter(h => h.status === 'Inactive').length;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '6px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
              <Layers size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Financial Configuration</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Income Heads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px', fontWeight: 600 }}>
            Categorize institutional income sources for granular financial reporting.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', fontWeight: 900, cursor: 'pointer' }}
        >
          <Plus size={17} /> Create New Head
        </button>
      </div>

      {/* ── Summary Pills ── */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Heads',    value: heads.length,   color: 'var(--primary)', bg: 'var(--primary-light)' },
          { label: 'Active',         value: activeCount,    color: 'var(--success)', bg: 'var(--success-light)' },
          { label: 'Inactive',       value: inactiveCount,  color: 'var(--danger)',  bg: 'var(--danger-light)' },
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', backgroundColor: p.bg, borderRadius: '12px', border: `1px solid ${p.color}30` }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 950, color: p.color }}>{p.value}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* ── Main Layout: Table + Sidebar Panel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: panelMode ? '1fr 400px' : '1fr', gap: '24px', alignItems: 'start', transition: 'grid-template-columns 0.3s ease' }}>

        {/* ── Ledger Table ── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '320px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search income heads…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, fontSize: '0.83rem' }}
              />
            </div>

            {/* Filter Popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterPopover(p => !p)}
                className="btn"
                style={{ border: `1px solid ${filterStatus !== 'All' ? 'var(--primary)' : 'var(--border-color)'}`, backgroundColor: filterStatus !== 'All' ? 'var(--primary-light)' : 'var(--bg-card)', color: filterStatus !== 'All' ? 'var(--primary)' : 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                <Filter size={15} />
                {filterStatus === 'All' ? 'Filter' : filterStatus}
                {filterStatus !== 'All' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'inline-block' }} />}
              </button>

              <AnimatePresence>
                {showFilterPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200, width: '190px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Filter by Status</div>
                    {['All', 'Active', 'Inactive'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setFilterStatus(opt); setShowFilterPopover(false); }}
                        style={{ textAlign: 'left', padding: '9px 12px', borderRadius: '8px', border: 'none', backgroundColor: filterStatus === opt ? 'var(--primary-light)' : 'transparent', color: filterStatus === opt ? 'var(--primary)' : 'var(--text-main)', fontWeight: 800, fontSize: '0.83rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {opt !== 'All' && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: opt === 'Active' ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }} />
                        )}
                        {opt === 'All' ? 'All Statuses' : opt}
                        {filterStatus === opt && <BadgeCheck size={14} style={{ marginLeft: 'auto' }} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active-filter banner */}
          {(searchQuery || filterStatus !== 'All') && (
            <div style={{ padding: '8px 24px', backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeCheck size={13} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
              </span>
              <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}>
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)' }}>
                  {['Category Code', 'Head Title', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '13px 24px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.length > 0 ? filtered.map((head, idx) => (
                    <motion.tr
                      key={head.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: editingHead?.id === head.id ? 'var(--primary-light)' : 'transparent', transition: 'background 0.2s' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{head.code}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{head.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{head.description}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => toggleStatus(head)}
                          title="Toggle Status"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 900, backgroundColor: STATUS_STYLE[head.status]?.bg, color: STATUS_STYLE[head.status]?.color, border: 'none', cursor: 'pointer' }}
                        >
                          {STATUS_STYLE[head.status]?.icon}
                          {head.status}
                        </button>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openEdit(head)}
                            title="Edit Head"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: editingHead?.id === head.id ? 'var(--primary)' : 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: editingHead?.id === head.id ? '#fff' : 'var(--primary)', cursor: 'pointer' }}
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => openDelete(head.id)}
                            title="Delete Head"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '52px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <FileText size={34} color="var(--text-muted)" style={{ opacity: 0.35 }} />
                          <div style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No income heads found</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', opacity: 0.7 }}>Try clearing your search or filter.</div>
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
                Showing {filtered.length} of {heads.length} heads
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {activeCount} active · {inactiveCount} inactive
              </span>
            </div>
          )}
        </div>

        {/* ── Sidebar Panel (Add / Edit) ── */}
        <AnimatePresence>
          {panelMode && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="card"
              style={{ padding: '0', overflow: 'hidden', alignSelf: 'start', position: 'sticky', top: '24px' }}
            >
              {/* Panel Header */}
              <div style={{ background: panelMode === 'edit' ? 'linear-gradient(135deg, var(--primary), #7c3aed)' : 'linear-gradient(135deg, #059669, #10b981)', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    {panelMode === 'edit' ? `Editing · ${editingHead?.code}` : 'Income Configuration'}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                    {panelMode === 'edit' ? 'Edit Income Head' : 'Add New Category'}
                  </h3>
                </div>
                <button
                  onClick={closePanel}
                  title="Close Panel"
                  style={{ background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', flexShrink: 0 }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* Panel Form */}
              <form onSubmit={handleSave} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Title */}
                <div>
                  <label style={labelStyle}>Income Head Title *</label>
                  <input
                    ref={titleRef}
                    type="text"
                    placeholder="e.g. Donation Fund"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Short Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe this income source…"
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                  />
                </div>

                {/* Status toggle */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Active', 'Inactive'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormStatus(s)}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1px solid ${formStatus === s ? (s === 'Active' ? 'var(--success)' : 'var(--danger)') : 'var(--border-color)'}`, backgroundColor: formStatus === s ? (s === 'Active' ? 'var(--success-light)' : 'var(--danger-light)') : 'var(--bg-body)', color: formStatus === s ? (s === 'Active' ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: '0.2s' }}
                      >
                        {STATUS_STYLE[s]?.icon}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code preview (add mode only) */}
                {panelMode === 'add' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', border: '1px solid var(--primary)30' }}>
                    <Hash size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>
                      Auto-assigned code: <strong>{nextCode(heads)}</strong>
                    </span>
                  </div>
                )}

                {/* Info note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', backgroundColor: 'rgba(100,116,139,0.08)', borderRadius: '10px' }}>
                  <Info size={14} color="var(--text-muted)" />
                  <p style={{ margin: 0, fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Heads once created can be linked to fee structures and financial reports.
                  </p>
                </div>

                {/* Error */}
                {formError && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700 }}>
                    ⚠ {formError}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="btn"
                    style={{ flex: 1, padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <X size={15} /> Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '12px', fontWeight: 900, cursor: 'pointer', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.88rem' }}
                  >
                    <Save size={15} /> {panelMode === 'edit' ? 'Update Head' : 'Save Head'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--danger)' }}>
                <Trash2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px' }}>Delete Income Head?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.6 }}>
                You're about to remove <strong style={{ color: 'var(--text-main)' }}>{deletingHead?.title}</strong> ({deletingHead?.code}).
              </p>
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '28px' }}>
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn" style={{ flex: 1, padding: '13px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 800, cursor: 'pointer', borderRadius: '12px' }}>
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{ flex: 1, padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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

export default IncomeHead;
