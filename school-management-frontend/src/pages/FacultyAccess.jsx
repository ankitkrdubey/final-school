import React, { useState } from 'react';
import { Shield, Check, X, Users, GraduationCap, BookOpen, Clock, FileText, Sparkles, Filter, Search, Award, ShieldCheck, UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FacultyAccess = () => {
  const navigate = useNavigate();
  const [editingRole, setEditingRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Roles');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#6366F1');
  const [newRoleIcon, setNewRoleIcon] = useState('Sparkles');

  const [facultyRoles, setFacultyRoles] = useState(() => {
    try {
      const stored = localStorage.getItem('faculty_roles');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      {
        id: 'prof',
        name: 'Senior Professor',
        iconName: 'GraduationCap',
        color: '#6366F1',
        description: 'Highest academic authority with curriculum design and final grading permissions.',
        personnel: 15,
        permissions: [
          { label: 'Curriculum Design', value: true },
          { label: 'Final Grade Approval', value: true },
          { label: 'Exam Creation', value: true },
          { label: 'Student Mentorship', value: true },
          { label: 'Dept. Budget Access', value: true },
          { label: 'Faculty Management', value: true }
        ]
      },
      {
        id: 'lecturer',
        name: 'Lecturer',
        iconName: 'BookOpen',
        color: '#F59E0B',
        description: 'Standard teaching role focused on course delivery and student engagement.',
        personnel: 42,
        permissions: [
          { label: 'Course Delivery', value: true },
          { label: 'Assignment Grading', value: true },
          { label: 'Attendance Tracking', value: true },
          { label: 'Internal Assessment', value: true },
          { label: 'Curriculum Editing', value: false },
          { label: 'Final Grade Approval', value: false }
        ]
      },
      {
        id: 'assistant',
        name: 'Lab Assistant',
        iconName: 'Sparkles',
        color: '#10B981',
        description: 'Support role for practical sessions and technical lab maintenance.',
        personnel: 24,
        permissions: [
          { label: 'Lab Access Control', value: true },
          { label: 'Equipment Tracking', value: true },
          { label: 'Practical Attendance', value: true },
          { label: 'Safety Compliance', value: true },
          { label: 'Academic Grading', value: false },
          { label: 'Exam Creation', value: false }
        ]
      }
    ];
  });

  const getFacultyIconElement = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={32} />;
      case 'BookOpen': return <BookOpen size={32} />;
      case 'Sparkles': return <Sparkles size={32} />;
      case 'Award': return <Award size={32} />;
      case 'Shield': return <Shield size={32} />;
      default: return <GraduationCap size={32} />;
    }
  };

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
    const updated = facultyRoles.map(role => 
      role.id === editingRole.id ? { ...role, permissions: editingRole.permissions } : role
    );
    setFacultyRoles(updated);
    localStorage.setItem('faculty_roles', JSON.stringify(updated));
    setShowToast(true);
    setEditingRole(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteRole = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the faculty role "${name}"?`)) {
      const updated = facultyRoles.filter(r => r.id !== id);
      setFacultyRoles(updated);
      localStorage.setItem('faculty_roles', JSON.stringify(updated));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Faculty Access Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage academic roles, define instructional permissions, and monitor faculty distributions.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search faculty roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600, width: '280px' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800 }}
            >
              <Filter size={18} /> {activeFilter}
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '105%', left: 0, width: '200px', backgroundColor: 'var(--bg-card)', 
                    borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', 
                    padding: '8px', zIndex: 100 
                  }}
                >
                  {['All Roles', 'High Personnel', 'Admin Rights', 'Academic Only'].map(filter => (
                    <div 
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                      style={{ 
                        padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        backgroundColor: activeFilter === filter ? 'var(--primary-light)' : 'transparent',
                        color: activeFilter === filter ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      {filter}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreating(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 800 }}
          >
            <Award size={18} /> New Access Level
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

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1300,
              backgroundColor: 'var(--success)', color: 'white', padding: '16px 24px',
              borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', fontWeight: 700
            }}
          >
            <ShieldCheck size={20} />
            Faculty permissions synchronized successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {facultyRoles
          .filter(role => {
            const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase());
            if (activeFilter === 'All Roles') return matchesSearch;
            if (activeFilter === 'High Personnel') return matchesSearch && role.personnel > 20;
            if (activeFilter === 'Admin Rights') return matchesSearch && role.permissions.some(p => p.label === 'Faculty Management' && p.value);
            if (activeFilter === 'Academic Only') return matchesSearch && !role.permissions.some(p => p.label === 'Dept. Budget Access' && p.value);
            return matchesSearch;
          }).length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
              <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>No roles match your criteria</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or switching the category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveFilter('All Roles'); }}
                style={{ marginTop: '24px', padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent', fontWeight: 800, cursor: 'pointer' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            facultyRoles
              .filter(role => {
                const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase());
                if (activeFilter === 'All Roles') return matchesSearch;
                if (activeFilter === 'High Personnel') return matchesSearch && role.personnel > 20;
                if (activeFilter === 'Admin Rights') return matchesSearch && role.permissions.some(p => p.label === 'Faculty Management' && p.value);
                if (activeFilter === 'Academic Only') return matchesSearch && !role.permissions.some(p => p.label === 'Dept. Budget Access' && p.value);
                return matchesSearch;
              })
              .map((role, idx) => (
                <motion.div 
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card"
                  style={{ padding: '40px', borderTop: `8px solid ${role.color}`, position: 'relative' }}
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
                    title="Delete Faculty Role"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${role.color}15`, 
                    color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
                  }}>
                    {getFacultyIconElement(role.iconName)}
                  </div>

                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>{role.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px', height: '50px' }}>{role.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', padding: '12px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '14px' }}>
                    <Users size={18} color={role.color} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{role.personnel} Active Faculty</span>
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
                    className="btn btn-primary" 
                    onClick={() => setEditingRole(role)}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: role.color, border: 'none', fontWeight: 800 }}
                  >
                    Adjust Access
                  </button>
                </motion.div>
              ))
          )}
      </div>

      {/* Access Drawer */}
      <AnimatePresence>
        {editingRole && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingRole(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '500px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '48px', position: 'relative', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Adjust {editingRole.name} Access</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Modify academic privileges and system access levels for this faculty role.</p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {editingRole.permissions.map((perm, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px' }}>
                      <span style={{ fontWeight: 700 }}>{perm.label}</span>
                      <div 
                        onClick={() => handleTogglePermission(perm.label)}
                        style={{ 
                          width: '44px', height: '24px', borderRadius: '20px', padding: '3px', cursor: 'pointer',
                          backgroundColor: perm.value ? editingRole.color : 'var(--border-color)',
                          transition: '0.3s', position: 'relative'
                        }}
                      >
                        <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', left: perm.value ? '23px' : '3px', transition: '0.3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn" onClick={() => setEditingRole(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }}>Discard</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSavePrivileges}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: editingRole.color, border: 'none', fontWeight: 800 }}
                >
                  Save Access
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: 'var(--shadow-2xl)' }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Create Access Level</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Define a new institutional academic role and its base permissions.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Role Designation</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Visiting Professor" 
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    style={{ borderRadius: '12px' }} 
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>Institutional Description</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Briefly describe the responsibilities..." 
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    style={{ borderRadius: '12px', height: '100px', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Theme Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'].map(color => (
                        <motion.div 
                          key={color}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewRoleColor(color)}
                          style={{ 
                            width: '32px', height: '32px', borderRadius: '8px', backgroundColor: color, 
                            cursor: 'pointer', border: newRoleColor === color ? '3px solid var(--text-main)' : 'none',
                            transition: 'border 0.2s ease'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800 }}>Role Icon</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { name: 'Sparkles', icon: <Sparkles size={16} /> },
                        { name: 'Award', icon: <Award size={16} /> },
                        { name: 'Shield', icon: <Shield size={16} /> },
                        { name: 'BookOpen', icon: <BookOpen size={16} /> },
                        { name: 'GraduationCap', icon: <GraduationCap size={16} /> }
                      ].map(item => (
                        <motion.div 
                          key={item.name}
                          whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-light)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setNewRoleIcon(item.name)}
                          style={{ 
                            width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            border: newRoleIcon === item.name ? `2px solid ${newRoleColor}` : '1px solid var(--border-color)',
                            color: newRoleIcon === item.name ? newRoleColor : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {item.icon}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800 }}>Discard</button>
                <button 
                  className="btn btn-primary" 
                  disabled={isCreatingLevel || !newRoleName}
                  onClick={() => {
                    if (!newRoleName) return;
                    setIsCreatingLevel(true);
                    
                    // Simulate institutional sync
                    setTimeout(() => {
                      const newRole = {
                        id: Date.now().toString(),
                        name: newRoleName,
                        iconName: newRoleIcon,
                        color: newRoleColor,
                        description: newRoleDesc || 'No description provided.',
                        personnel: 0,
                        permissions: [
                          { label: 'Academic Access', value: true },
                          { label: 'Basic Grading', value: true },
                          { label: 'Attendance Tracking', value: true },
                          { label: 'Advanced Management', value: false }
                        ]
                      };
                      const updated = [...facultyRoles, newRole];
                      setFacultyRoles(updated);
                      localStorage.setItem('faculty_roles', JSON.stringify(updated));
                      
                      setShowToast(true);
                      setIsCreating(false);
                      setIsCreatingLevel(false);
                      setNewRoleName('');
                      setNewRoleDesc('');
                      setNewRoleColor('#6366F1');
                      setNewRoleIcon('Sparkles');
                      setTimeout(() => setShowToast(false), 3000);
                    }, 1500);
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: newRoleColor, border: 'none' }}
                >
                  {isCreatingLevel ? (
                    <>
                      <div className="spinner-small" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Synchronizing...
                    </>
                  ) : 'Create Level'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FacultyAccess;
