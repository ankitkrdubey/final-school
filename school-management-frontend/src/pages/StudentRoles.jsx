import React, { useState } from 'react';
import { Shield, Check, X, Users, Star, Trophy, Palette, Search, Filter, Plus, ShieldCheck, Sparkles, GraduationCap, Flag, Music, Camera, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const StudentRoles = () => {
  const titleInputRef = undefined; // placeholder
  const { toast, showToast: showToastFn, hideToast } = useToast();
  const [editingRole, setEditingRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#4F46E5');
  const [newRoleIcon, setNewRoleIcon] = useState('Flag');

  const getStudentIconElement = (iconName) => {
    switch (iconName) {
      case 'Flag': return <Flag size={32} />;
      case 'Trophy': return <Trophy size={32} />;
      case 'Star': return <Star size={32} />;
      case 'Music': return <Music size={32} />;
      case 'Palette': return <Palette size={32} />;
      case 'GraduationCap': return <GraduationCap size={32} />;
      case 'Camera': return <Camera size={32} />;
      case 'Shield': return <Shield size={32} />;
      default: return <Flag size={32} />;
    }
  };

  const [studentRoles, setStudentRoles] = useState(() => {
    const stored = localStorage.getItem('student_roles');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map(role => ({
        ...role,
        icon: getStudentIconElement(role.iconName)
      }));
    } else {
      const initial = [
        {
          id: 'prefect',
          name: 'School Prefect',
          iconName: 'Shield',
          color: '#4F46E5',
          description: 'Student leaders responsible for maintaining discipline and representing the student body.',
          personnel: 24,
          permissions: [
            { label: 'Event Supervision', value: true },
            { label: 'Peer Mentorship', value: true },
            { label: 'Discipline Reports', value: true },
            { label: 'Student Council Seat', value: true },
            { label: 'Academic Grading', value: false },
            { label: 'Attendance Management', value: false }
          ]
        },
        {
          id: 'sports',
          name: 'Sports Captain',
          iconName: 'Trophy',
          color: '#EF4444',
          description: 'Athletic leaders managing house teams and coordinating sporting events.',
          personnel: 8,
          permissions: [
            { label: 'Team Selection', value: true },
            { label: 'Equipment Access', value: true },
            { label: 'Practice Scheduling', value: true },
            { label: 'Tournament Rep.', value: true },
            { label: 'Prefect Authority', value: false },
            { label: 'Final Grade Access', value: false }
          ]
        },
        {
          id: 'cultural',
          name: 'Cultural Secretary',
          iconName: 'Music',
          color: '#EC4899',
          description: 'Leads the cultural department, overseeing arts, music, and dramatic society events.',
          personnel: 12,
          permissions: [
            { label: 'Stage Management', value: true },
            { label: 'Club Coordination', value: true },
            { label: 'Event Promotion', value: true },
            { label: 'Budget Requests', value: true },
            { label: 'Sports Oversight', value: false },
            { label: 'Teacher Management', value: false }
          ]
        }
      ];
      localStorage.setItem('student_roles', JSON.stringify(initial));
      return initial.map(role => ({
        ...role,
        icon: getStudentIconElement(role.iconName)
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
    const updated = studentRoles.map(role => 
      role.id === editingRole.id ? { ...role, permissions: editingRole.permissions } : role
    );
    setStudentRoles(updated);
    
    const cleaned = updated.map(r => {
      const { icon, ...rest } = r;
      return rest;
    });
    localStorage.setItem('student_roles', JSON.stringify(cleaned));
    
    showToastFn('Leadership roles synchronized successfully!', 'success', 'Privileges Saved');
    setEditingRole(null);
  };

  const handleDeleteRole = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the student leadership role "${name}"?`)) {
      const updated = studentRoles.filter(r => r.id !== id);
      setStudentRoles(updated);
      const cleaned = updated.map(r => {
        const { icon, ...rest } = r;
        return rest;
      });
      localStorage.setItem('student_roles', JSON.stringify(cleaned));
      showToastFn(`Student leadership role "${name}" has been deleted.`, 'success', 'Role Deleted');
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Student Leadership Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage student roles, define leadership privileges, and empower student-led initiatives.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search student roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600, width: '280px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreating(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 800 }}>
            <Plus size={18} /> New Role
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {studentRoles
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
                title="Delete Student Role"
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
                <Star size={18} color={role.color} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{role.personnel} Appointed Students</span>
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
                Modify Access
              </button>
            </motion.div>
          ))}
      </div>

      {/* Access Drawer */}
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
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>{editingRole.name} Privileges</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Adjust leadership authority and system permissions for student roles.</p>

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
                  Save Privileges
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
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Create Student Role</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Appoint a new leadership designation for the student body.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Role Designation</label>
                  <input type="text" className="form-input" placeholder="e.g. Media Head" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} style={{ borderRadius: '12px' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Role Description</label>
                  <textarea className="form-input" placeholder="Leadership duties..." value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} style={{ borderRadius: '12px', height: '80px', resize: 'none' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Theme Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['#4F46E5', '#EF4444', '#EC4899', '#10B981', '#F59E0B'].map(color => (
                        <div key={color} onClick={() => setNewRoleColor(color)} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: color, cursor: 'pointer', border: newRoleColor === color ? '2px solid var(--text-main)' : 'none' }} />
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Identity Icon</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { name: 'Flag', icon: <Flag size={14} /> },
                        { name: 'Trophy', icon: <Trophy size={14} /> },
                        { name: 'Star', icon: <Star size={14} /> },
                        { name: 'Music', icon: <Music size={14} /> },
                        { name: 'Palette', icon: <Palette size={14} /> },
                        { name: 'GraduationCap', icon: <GraduationCap size={14} /> },
                        { name: 'Camera', icon: <Camera size={14} /> }
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
                      'Flag': <Flag size={32} />, 
                      'Trophy': <Trophy size={32} />, 
                      'Star': <Star size={32} />,
                      'Music': <Music size={32} />,
                      'Palette': <Palette size={32} />,
                      'GraduationCap': <GraduationCap size={32} />,
                      'Camera': <Camera size={32} />
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
                          { label: 'Leadership Access', value: true },
                          { label: 'Club Management', value: true },
                          { label: 'Student Data', value: false },
                          { label: 'Teacher Authority', value: false }
                        ]
                      };
                      const updated = [...studentRoles, { ...newRole, icon: getStudentIconElement(newRoleIcon) }];
                      setStudentRoles(updated);
                      
                      const cleaned = updated.map(r => {
                        const { icon, ...rest } = r;
                        return rest;
                      });
                      localStorage.setItem('student_roles', JSON.stringify(cleaned));

                      showToastFn(`New student role "${newRoleName}" created successfully!`, 'success', 'Role Created');
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

export default StudentRoles;
