import React, { useState } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Plus, Search, Filter, Download, MoreVertical, 
  X, Check, Calendar, ChevronRight, Settings, 
  Lock, Eye, Edit3, Trash2
} from 'lucide-react';

const AssignRole = () => {
  const { toast, showToast, hideToast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem('assigned_roles');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 1, date: '05 Jan 2018', name: 'Administrator', features: 'User Management, System Settings, Academic Modules', color: '#4f46e5' },
        { id: 2, date: '12 Feb 2018', name: 'Accountant', features: 'Finance Hub, Fee Collection, Expenses', color: '#10b981' },
        { id: 3, date: '20 Mar 2018', name: 'Teacher', features: 'Attendance, Examination, Assignments', color: '#f59e0b' },
        { id: 4, date: '15 Apr 2018', name: 'Librarian', features: 'Library Management, E-Library', color: '#3b82f6' },
        { id: 5, date: '02 May 2018', name: 'Receptionist', features: 'Admission, ID Cards, Messaging', color: '#ec4899' },
      ];
      localStorage.setItem('assigned_roles', JSON.stringify(initial));
      return initial;
    }
  });

  const [newRole, setNewRole] = useState({ name: '', features: [] });

  const featureOptions = [
    'User Management', 'System Settings', 'Guardian Management', 
    'Student Management', 'Faculty Management', 'Attendance', 
    'LMS Portal', 'Examination', 'Finance Hub', 'Library', 
    'Transport', 'Hostel', 'Assignments', 'ID Cards', 
    'Messaging', 'Events', 'Notices'
  ];

  const handleToggleFeature = (feature) => {
    if (newRole.features.includes(feature)) {
      setNewRole({ ...newRole, features: newRole.features.filter(f => f !== feature) });
    } else {
      setNewRole({ ...newRole, features: [...newRole.features, feature] });
    }
  };

  const handleCreateClick = () => {
    setEditingRole(null);
    setNewRole({ name: '', features: [] });
    setIsDrawerOpen(true);
  };

  const handleEditClick = (role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      features: role.features ? role.features.split(', ') : []
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteRole = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the role assignment for "${name}"?`)) {
      const updated = roles.filter(r => r.id !== id);
      setRoles(updated);
      localStorage.setItem('assigned_roles', JSON.stringify(updated));
      showToast(`Role assignment for "${name}" successfully deleted.`, 'success', 'Role Deleted');
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setNewRole({ name: '', features: [] });
    setEditingRole(null);
  };

  const handleSave = () => {
    if (editingRole) {
      const updated = roles.map(r => r.id === editingRole.id ? {
        ...r,
        name: newRole.name.trim(),
        features: newRole.features.join(', ')
      } : r);
      setRoles(updated);
      localStorage.setItem('assigned_roles', JSON.stringify(updated));
      showToast(`Role assignment for "${newRole.name}" updated successfully.`, 'success', 'Role Updated');
    } else {
      const roleToAdd = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        name: newRole.name.trim(),
        features: newRole.features.join(', '),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      const updated = [roleToAdd, ...roles];
      setRoles(updated);
      localStorage.setItem('assigned_roles', JSON.stringify(updated));
      showToast(`Role assignment for "${newRole.name}" created successfully.`, 'success', 'Role Created');
    }
    handleCloseDrawer();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}
    >
      {/* Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>
            <span>Dashboard</span> <ChevronRight size={14} /> <span>HRM</span> <ChevronRight size={14} /> <span style={{ color: 'var(--primary)' }}>Assign Role</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-1px' }}>Assign Role Permissions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 500 }}>
            Define module access and functional permissions for institutional staff roles.
          </p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '14px', boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)' }}
        >
          <Plus size={18} /> <span style={{ fontWeight: 700 }}>Add Assign Role</span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="card" style={{ padding: '20px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Show</span>
            <select style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>entries</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                placeholder="Search roles..." 
                style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn" style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '12px' }}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '18px 24px', textAlign: 'left', width: '50px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', borderRadius: '4px' }} />
              </th>
              <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>S.L</th>
              <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role Name</th>
              <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Features</th>
              <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((role, idx) => (
              <tr key={role.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} className="table-row-hover">
                <td style={{ padding: '18px 24px' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1}</td>
                <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} /> {role.date}
                  </div>
                </td>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `${role.color}15`, color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={16} />
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{role.name}</span>
                  </div>
                </td>
                <td style={{ padding: '18px 24px', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {role.features.split(', ').map((f, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>{f}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditClick(role)}
                      className="btn-icon" 
                      style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', cursor: 'pointer' }}
                      title="Edit Assignment"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      className="btn-icon" 
                      style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)', cursor: 'pointer' }}
                      title="Remove Assignment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Drawer Form */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', 
                backgroundColor: 'var(--bg-card)', zIndex: 1001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>{editingRole ? 'Edit Assign Role' : 'Add Assign Role'}</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{editingRole ? 'Modify assigned modules for this role.' : 'Create a new role and assign its features.'}</p>
                </div>
                <button 
                  onClick={handleCloseDrawer}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-body)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Role Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Enter Role Name" 
                      style={{ borderRadius: '12px', padding: '14px' }}
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Select Features / Modules</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                      {featureOptions.map(feature => (
                        <div 
                          key={feature}
                          onClick={() => handleToggleFeature(feature)}
                          style={{ 
                            padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)',
                            backgroundColor: newRole.features.includes(feature) ? 'var(--primary-light)' : 'var(--bg-body)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                            transition: '0.2s'
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: newRole.features.includes(feature) ? 'var(--primary)' : 'var(--text-main)' }}>{feature}</span>
                          {newRole.features.includes(feature) && <Check size={16} color="var(--primary)" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '32px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
                <button 
                  onClick={handleCloseDrawer}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!newRole.name || newRole.features.length === 0}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800, opacity: (!newRole.name || newRole.features.length === 0) ? 0.6 : 1 }}
                >
                  {editingRole ? 'Save Changes' : 'Save Assignment'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default AssignRole;
