import React, { useState } from 'react';
import { Shield, Check, X, Users, Briefcase, Wallet, Bus, Library, Search, Filter, Plus, ShieldCheck, Sparkles, Building, Coffee, Wrench, Truck, Heart, UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastRenderer } from '../hooks/useToast';

const StaffPermissions = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [editingRole, setEditingRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#10B981');
  const [newRoleIcon, setNewRoleIcon] = useState('Briefcase');

  const getStaffIconElement = (iconName) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase size={32} />;
      case 'Building': return <Building size={32} />;
      case 'Shield': return <Shield size={32} />;
      case 'Coffee': return <Coffee size={32} />;
      case 'Wrench': return <Wrench size={32} />;
      case 'Truck': return <Truck size={32} />;
      case 'Heart': return <Heart size={32} />;
      case 'Wallet': return <Wallet size={32} />;
      case 'Library': return <Library size={32} />;
      case 'Bus': return <Bus size={32} />;
      default: return <Briefcase size={32} />;
    }
  };

  const [staffRoles, setStaffRoles] = useState(() => {
    const stored = localStorage.getItem('staff_roles');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map(role => ({
        ...role,
        icon: getStaffIconElement(role.iconName)
      }));
    } else {
      const initial = [
        {
          id: 'finance',
          name: 'Accountant',
          iconName: 'Wallet',
          color: '#10B981',
          description: 'Manages payroll, fee collection, and institutional financial audits.',
          personnel: 4,
          permissions: [
            { label: 'Payroll Management', value: true },
            { label: 'Fee Collection', value: true },
            { label: 'Expense Tracking', value: true },
            { label: 'Financial Audit', value: true },
            { label: 'Student Data Access', value: true },
            { label: 'Inventory Access', value: false }
          ]
        },
        {
          id: 'library',
          name: 'Librarian',
          iconName: 'Library',
          color: '#F59E0B',
          description: 'Oversees digital and physical libraries, book circulation, and memberships.',
          personnel: 3,
          permissions: [
            { label: 'Book Inventory', value: true },
            { label: 'Member Management', value: true },
            { label: 'Issue / Return', value: true },
            { label: 'Late Fee Control', value: true },
            { label: 'Payroll Access', value: false },
            { label: 'Financial Audit', value: false }
          ]
        },
        {
          id: 'transport',
          name: 'Transport Head',
          iconName: 'Bus',
          color: '#3B82F6',
          description: 'Manages fleet operations, route planning, and driver scheduling.',
          personnel: 2,
          permissions: [
            { label: 'Fleet Management', value: true },
            { label: 'Route Planning', value: true },
            { label: 'Driver Dispatch', value: true },
            { label: 'Fuel Tracking', value: true },
            { label: 'Library Access', value: false },
            { label: 'Staff Management', value: false }
          ]
        }
      ];
      localStorage.setItem('staff_roles', JSON.stringify(initial));
      return initial.map(role => ({
        ...role,
        icon: getStaffIconElement(role.iconName)
      }));
    }
  });

  const handleTogglePermission = (permLabel) => {
    if (!editingRole) return;
    setEditingRole(prev => ({
      ...prev,
      permissions: prev.permissions.map(perm =>
        perm.label === permLabel ? { ...perm, value: !perm.value } : perm
      )
    }));
  };

  const handleSavePrivileges = () => {
    if (!editingRole) return;
    const updated = staffRoles.map(role => 
      role.id === editingRole.id ? { ...role, permissions: editingRole.permissions } : role
    );
    setStaffRoles(updated);
    
    const cleaned = updated.map(r => {
      const { icon, ...rest } = r;
      return rest;
    });
    localStorage.setItem('staff_roles', JSON.stringify(cleaned));
    showToast('Staff permissions updated successfully.', 'success', 'Permissions Saved');
    setEditingRole(null);
  };

  const handleDeleteRole = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the staff role "${name}"?`)) {
      const updated = staffRoles.filter(r => r.id !== id);
      setStaffRoles(updated);
      const cleaned = updated.map(r => {
        const { icon, ...rest } = r;
        return rest;
      });
      localStorage.setItem('staff_roles', JSON.stringify(cleaned));
      showToast(`Staff role "${name}" has been deleted.`, 'success', 'Role Deleted');
    }
  };

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Staff Permissions Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Define operational access levels and manage permissions for support and administrative personnel.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search staff roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600, width: '280px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreating(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 800 }}>
            <Plus size={18} /> New Staff Role
          </button>
          <button 
            className="btn" 
            onClick={() => navigate('/dashboard/staff-registration')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1px solid #6366f1', color: '#6366f1', backgroundColor: '#6366f105', fontWeight: 800 }}
          >
            <UserPlus size={18} /> Registration Portal
          </button>
        </div>
      </div>



      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {staffRoles
          .filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((role, idx) => (
            <motion.div 
              key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="card" style={{ padding: '40px', borderTop: `8px solid ${role.color}`, position: 'relative' }}
            >
              <button
                onClick={() => handleDeleteRole(role.id, role.name)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-body)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s',
                  zIndex: 10
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'var(--bg-body)'; }}
                title="Delete Staff Role"
              >
                <Trash2 size={16} />
              </button>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${role.color}15`, 
                color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
              }}>
                {role.icon}
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>{role.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px', height: '50px' }}>{role.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', padding: '12px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '14px' }}>
                <Briefcase size={18} color={role.color} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{role.personnel} Active Personnel</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {role.permissions.map((perm, pidx) => (
                  <div key={pidx} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: perm.value ? 1 : 0.4 }}>
                    {perm.value ? <Check size={18} color="var(--success)" strokeWidth={3} /> : <X size={18} color="var(--danger)" strokeWidth={3} />}
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{perm.label}</span>
                  </div>
                ))}
              </div>

              <button 
                className="btn btn-primary" onClick={() => setEditingRole(role)}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: role.color, border: 'none', fontWeight: 800 }}
              >
                Manage Access
              </button>
            </motion.div>
          ))}
      </div>

      {/* Permission Drawer */}
      <AnimatePresence>
        {editingRole && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingRole(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '500px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '48px', position: 'relative', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column' }}
            >
              <button 
                onClick={() => setEditingRole(null)}
                style={{ position: 'absolute', top: '40px', right: '40px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Drawer"
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>{editingRole.name} Permissions</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Synchronize operational access for administrative staff.</p>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {editingRole.permissions.map((perm, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 700 }}>{perm.label}</span>
                    <div 
                      onClick={() => handleTogglePermission(perm.label)}
                      style={{ width: '44px', height: '24px', borderRadius: '20px', backgroundColor: perm.value ? editingRole.color : 'var(--border-color)', position: 'relative', cursor: 'pointer' }}
                    >
                      <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', left: perm.value ? '23px' : '3px', top: '3px', transition: '0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="btn" onClick={() => setEditingRole(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }}>Discard</button>
                <button 
                  className="btn btn-primary" onClick={handleSavePrivileges}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: editingRole.color, border: 'none', fontWeight: 800 }}
                >
                  Save Logic
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreating(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: 'var(--shadow-2xl)' }}
            >
              <button 
                onClick={() => setIsCreating(false)}
                style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Modal"
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Create Staff Role</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Establish a new operational level for support staff.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Role Designation</label>
                  <input type="text" className="form-input" placeholder="e.g. Lab Technician" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} style={{ borderRadius: '12px' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Description</label>
                  <textarea className="form-input" placeholder="Operational duties..." value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} style={{ borderRadius: '12px', height: '80px', resize: 'none' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Theme</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'].map(color => (
                        <div key={color} onClick={() => setNewRoleColor(color)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: color, cursor: 'pointer', border: newRoleColor === color ? '2px solid var(--text-main)' : 'none' }} />
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Icon</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { name: 'Briefcase', icon: <Briefcase size={14} /> },
                        { name: 'Building', icon: <Building size={14} /> },
                        { name: 'Shield', icon: <Shield size={14} /> },
                        { name: 'Coffee', icon: <Coffee size={14} /> },
                        { name: 'Wrench', icon: <Wrench size={14} /> },
                        { name: 'Truck', icon: <Truck size={14} /> },
                        { name: 'Heart', icon: <Heart size={14} /> }
                      ].map(item => (
                        <div key={item.name} onClick={() => setNewRoleIcon(item.name)} style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: newRoleIcon === item.name ? `2px solid ${newRoleColor}` : '1px solid var(--border-color)', color: newRoleIcon === item.name ? newRoleColor : 'var(--text-muted)' }}>
                          {item.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800 }}>Discard</button>
                <button 
                  className="btn btn-primary" disabled={isSyncing || !newRoleName}
                  onClick={() => {
                    if (!newRoleName) return;
                    setIsSyncing(true);
                    const iconMap = { 
                      'Briefcase': <Briefcase size={32} />, 
                      'Building': <Building size={32} />, 
                      'Shield': <Shield size={32} />,
                      'Coffee': <Coffee size={32} />,
                      'Wrench': <Wrench size={32} />,
                      'Truck': <Truck size={32} />,
                      'Heart': <Heart size={32} />
                    };
                    setTimeout(() => {
                      const newRole = {
                        id: Date.now().toString(),
                        name: newRoleName,
                        iconName: newRoleIcon,
                        color: newRoleColor,
                        description: newRoleDesc || 'No description provided.',
                        personnel: 0,
                        permissions: [
                          { label: 'System Access', value: true },
                          { label: 'Basic Operations', value: true },
                          { label: 'Departmental Data', value: true },
                          { label: 'Financial Control', value: false }
                        ]
                      };
                      const updated = [...staffRoles, { ...newRole, icon: getStaffIconElement(newRoleIcon) }];
                      setStaffRoles(updated);
                      
                      const cleaned = updated.map(r => {
                        const { icon, ...rest } = r;
                        return rest;
                      });
                      localStorage.setItem('staff_roles', JSON.stringify(cleaned));

                      showToast(`New staff role "${newRoleName}" successfully created!`, 'success', 'Role Created');
                      setIsCreating(false);
                      setIsSyncing(false);
                      setNewRoleName(''); setNewRoleDesc('');
                    }, 1200);
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800, backgroundColor: newRoleColor, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isSyncing ? 'Syncing...' : 'Create Role'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default StaffPermissions;
