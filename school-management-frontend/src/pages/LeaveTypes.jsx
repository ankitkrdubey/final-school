import React, { useState, useEffect } from 'react';
import { 
  Tags, Plus, Search, Edit2, Trash, Info, X, Save, 
  CheckCircle2, AlertCircle, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Seed leave types database
const SEED_LEAVE_TYPES = [
  { id: 1, name: 'Sick Leave', days: 12, description: 'For medical reasons and health-related emergencies.', paid: true },
  { id: 2, name: 'Casual Leave', days: 10, description: 'For personal matters and short-term unplanned needs.', paid: true },
  { id: 3, name: 'Maternity Leave', days: 90, description: 'For female employees during pregnancy and childbirth.', paid: true },
  { id: 4, name: 'Paternity Leave', days: 15, description: 'For male employees during the birth of their child.', paid: true },
  { id: 5, name: 'Unpaid Leave', days: 0, description: 'Any leave taken beyond the allocated paid leaves.', paid: false },
];

const LeaveTypes = () => {
  // State variables
  const [leaveTypes, setLeaveTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('leave_classifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEED_LEAVE_TYPES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaid, setFilterPaid] = useState('All');
  const [toast, setToast] = useState(null);

  // Modal overlays
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    days: 10,
    description: '',
    paid: true
  });

  // Local persistence helper
  const persist = (updated) => {
    setLeaveTypes(updated);
    localStorage.setItem('leave_classifications', JSON.stringify(updated));
  };

  // Toast notifier
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Form submit handler (Create / Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    // Prevent duplicate naming conflicts
    const nameExists = leaveTypes.some(
      l => l.name.toLowerCase() === form.name.trim().toLowerCase() && 
      (!editingLeave || l.id !== editingLeave.id)
    );

    if (nameExists) {
      showToast('error', `A leave classification named "${form.name}" already exists.`);
      return;
    }

    let updatedList;
    if (editingLeave) {
      updatedList = leaveTypes.map(l => 
        l.id === editingLeave.id 
          ? { ...l, name: form.name.trim(), days: parseInt(form.days) || 0, description: form.description.trim(), paid: form.paid } 
          : l
      );
      showToast('success', `Leave classification "${form.name}" updated successfully.`);
    } else {
      const newLeave = {
        id: Date.now(),
        name: form.name.trim(),
        days: parseInt(form.days) || 0,
        description: form.description.trim(),
        paid: form.paid
      };
      updatedList = [...leaveTypes, newLeave];
      showToast('success', `Created new leave classification "${form.name}".`);
    }

    persist(updatedList);
    setShowFormModal(false);
  };

  // Open modal forms
  const handleOpenForm = (leave = null) => {
    if (leave) {
      setEditingLeave(leave);
      setForm({
        name: leave.name,
        days: leave.days,
        description: leave.description,
        paid: leave.paid
      });
    } else {
      setEditingLeave(null);
      setForm({
        name: '',
        days: 10,
        description: '',
        paid: true
      });
    }
    setShowFormModal(true);
  };

  // Delete leave classification
  const handleDeleteLeave = (id) => {
    setDeleteConfirmId(id);
  };

  // Live searches and filters
  const filteredLeaveTypes = leaveTypes.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterPaid === 'All' || 
      (filterPaid === 'Paid' && l.paid) ||
      (filterPaid === 'Unpaid' && !l.paid);

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
              padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Leave Classifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define and manage different types of leave policies and their allocations.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}
        >
          <Plus size={20} /> Define Leave Type
        </button>
      </div>

      {/* Search & Filter Component */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search leaves by name or policy description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
        <select 
          value={filterPaid}
          onChange={(e) => setFilterPaid(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          <option value="All">All Types</option>
          <option value="Paid">Paid Leaves</option>
          <option value="Unpaid">Unpaid / Custom</option>
        </select>
      </div>

      {/* Classifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredLeaveTypes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '24px', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}>
            <Tags size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <h3 style={{ margin: 0, fontWeight: 800 }}>No leave classifications found</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Create a new leave classification or modify your search terms.</p>
          </div>
        ) : (
          filteredLeaveTypes.map((leave, idx) => (
            <motion.div 
              key={leave.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card"
              style={{ padding: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--primary)' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Tags size={24} />
                  </div>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 800,
                    backgroundColor: leave.paid ? '#ecfdf5' : '#fef2f2',
                    color: leave.paid ? '#10b981' : '#ef4444',
                    border: `1px solid ${leave.paid ? '#10b98120' : '#ef444420'}`
                  }}>
                    {leave.paid ? 'PAID LEAVE' : 'UNPAID'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>{leave.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px', minHeight: '48px' }}>{leave.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Allocation</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                    {leave.days > 0 ? `${leave.days} Days / Year` : 'Unlimited'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleOpenForm(leave)}
                    style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', cursor: 'pointer', transition: '0.2s' }}
                    className="hover-primary"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteLeave(leave.id)}
                    style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', cursor: 'pointer', transition: '0.2s' }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* DUAL ADD / EDIT MODAL POPUP */}
      <AnimatePresence>
        {showFormModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>
                  {editingLeave ? 'Edit Leave Type' : 'Define New Leave Type'}
                </h2>
                <button onClick={() => setShowFormModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leave Type Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    placeholder="e.g. Study Leave, Sabbatical" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Days Allocation / Year</label>
                    <input 
                      type="number" 
                      min="0" 
                      required 
                      value={form.days} 
                      onChange={e => setForm({...form, days: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. 10 (0 for Unlimited)" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leave Class Status</label>
                    <select 
                      value={form.paid ? 'Paid' : 'Unpaid'} 
                      onChange={e => setForm({...form, paid: e.target.value === 'Paid'})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Paid">Paid Leave</option>
                      <option value="Unpaid">Unpaid Leave</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Policy Description *</label>
                  <textarea 
                    required 
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                    rows="3"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.4 }} 
                    placeholder="Provide a detailed description of eligibility rules and approval workflows..." 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowFormModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> {editingLeave ? 'Save Changes' : 'Define Leave'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION DIALOG */}
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setDeleteConfirmId(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid var(--border-color)', zIndex: 10 }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Confirm Deletion</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to delete this leave classification? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const target = leaveTypes.find(l => l.id === deleteConfirmId);
                    if (target) {
                      const updated = leaveTypes.filter(l => l.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Successfully deleted leave type "${target.name}".`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveTypes;
