import React, { useState, useRef } from 'react';
import { Award, Plus, Edit, Trash2, Search, Filter, Info, Save, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const Designation = () => {
  const titleInputRef = useRef(null);
  const { toast, showToast, hideToast } = useToast();
  // Lazy initialize state connected to localStorage
  const [designations, setDesignations] = useState(() => {
    const stored = localStorage.getItem('staff_designations');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 1, title: 'Senior Professor', department: 'Academic', status: 'Active' },
        { id: 2, title: 'Department Head', department: 'Academic', status: 'Active' },
        { id: 3, title: 'Admin Coordinator', department: 'Administration', status: 'Active' },
        { id: 4, title: 'Lab Assistant', department: 'Technical', status: 'Active' },
        { id: 5, title: 'System Architect', department: 'Technical', status: 'Active' },
      ];
      localStorage.setItem('staff_designations', JSON.stringify(initial));
      return initial;
    }
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Form states for Quick Add / Edit Profile
  const [editingRole, setEditingRole] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState('Academic');

  // Dynamic workforce audit scanner
  const getEmployeeCount = (roleTitle) => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const emps = JSON.parse(storedEmployees);
      // Match case-insensitively or loosely
      return emps.filter(e => e.role?.toLowerCase() === roleTitle.toLowerCase() || roleTitle.toLowerCase().includes(e.role?.toLowerCase())).length;
    }
    // Fallback default counts
    if (roleTitle === 'Senior Professor') return 12;
    if (roleTitle === 'Department Head') return 5;
    if (roleTitle === 'Admin Coordinator') return 3;
    if (roleTitle === 'Lab Assistant') return 8;
    if (roleTitle === 'System Architect') return 2;
    return 0;
  };

  // Filter Engine
  const filteredDesignations = designations.filter(des => {
    const matchesSearch = 
      des.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      des.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || des.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Reset form
  const handleResetForm = () => {
    setEditingRole(null);
    setFormTitle('');
    setFormDept('Academic');
  };

  // Load details into editor profile and focus input
  const handleEditClick = (des) => {
    setEditingRole(des);
    setFormTitle(des.title);
    setFormDept(des.department);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Action hook to reset form and focus for a new designation profile
  const handleCreateNewRole = () => {
    handleResetForm();
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Save / Update profile details
  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please provide a designation title.', 'warning', 'Validation Error');
      return;
    }

    let updated = [];
    if (editingRole) {
      // Edit mode
      updated = designations.map(d => d.id === editingRole.id ? { ...d, title: formTitle.trim(), department: formDept } : d);
      showToast(`Designation profile "${formTitle}" successfully updated.`, 'success', 'Profile Updated');
    } else {
      // Create mode
      const newId = designations.length > 0 ? Math.max(...designations.map(d => d.id)) + 1 : 1;
      const newRole = {
        id: newId,
        title: formTitle.trim(),
        department: formDept,
        status: 'Active'
      };
      updated = [...designations, newRole];
      showToast(`New professional role "${formTitle}" successfully declared.`, 'success', 'Role Created');
    }

    setDesignations(updated);
    localStorage.setItem('staff_designations', JSON.stringify(updated));
    handleResetForm();
  };

  // Stateful delete role
  const handleDeleteRole = (id, title) => {
    const employeeCount = getEmployeeCount(title);
    if (employeeCount > 0) {
      showToast(`Cannot delete "${title}" — it is assigned to ${employeeCount} active staff member(s). Reassign them first.`, 'error', 'Cannot Delete');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete the professional designation "${title}"?`)) {
      const updated = designations.filter(d => d.id !== id);
      setDesignations(updated);
      localStorage.setItem('staff_designations', JSON.stringify(updated));
      if (editingRole && editingRole.id === id) {
        handleResetForm();
      }
      showToast(`Designation "${title}" successfully removed.`, 'success', 'Deleted');
    }
  };

  return (
    <>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Staff Designations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define professional roles and institutional hierarchy for precise workforce management.</p>
        </div>
        <button 
           onClick={handleCreateNewRole}
           className="btn btn-primary" 
           style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 900 }}
        >
           <Plus size={20} /> Create New Role
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
         {/* Ledger Table */}
         <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                     type="text" 
                     placeholder="Search roles..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} 
                  />
               </div>
               
               <div style={{ position: 'relative' }}>
                  <button 
                     onClick={() => setShowFilterPopover(!showFilterPopover)}
                     className="btn" 
                     style={{ border: '1px solid var(--border-color)', backgroundColor: showFilterPopover ? 'var(--primary-light)' : 'var(--bg-card)', color: showFilterPopover ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                     <Filter size={16} /> Filter
                     {selectedDept !== 'All' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                  </button>
                  
                  <AnimatePresence>
                     {showFilterPopover && (
                        <motion.div 
                           initial={{ opacity: 0, y: 8 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 8 }}
                           style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '200px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}
                        >
                           <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Department</label>
                           <select 
                              value={selectedDept} 
                              onChange={(e) => setSelectedDept(e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                           >
                              <option value="All">All Departments</option>
                              <option value="Academic">Academic</option>
                              <option value="Administration">Administration</option>
                              <option value="Technical">Technical</option>
                           </select>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <button 
                                 onClick={() => {
                                    setSelectedDept('All');
                                    setShowFilterPopover(false);
                                 }}
                                 style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                              >
                                 Clear
                              </button>
                              <button 
                                 onClick={() => setShowFilterPopover(false)}
                                 style={{ border: 'none', backgroundColor: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 850, cursor: 'pointer' }}
                              >
                                 Apply
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                     <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ROLE TITLE</th>
                     <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DEPARTMENT</th>
                     <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STAFF COUNT</th>
                     <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredDesignations.length > 0 ? (
                     filteredDesignations.map((des, idx) => {
                        const count = getEmployeeCount(des.title);
                        return (
                           <tr key={des.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s', backgroundColor: editingRole?.id === des.id ? 'var(--primary-light)' : 'transparent' }} onMouseOver={(e) => { if(editingRole?.id !== des.id) e.currentTarget.style.backgroundColor = 'var(--bg-body)' }} onMouseOut={(e) => { if(editingRole?.id !== des.id) e.currentTarget.style.backgroundColor = 'transparent' }}>
                              <td style={{ padding: '20px 24px' }}>
                                 <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{des.title}</div>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{des.department}</span>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                                    <div style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: count > 0 ? 'var(--primary-light)' : 'var(--bg-body)', color: count > 0 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem' }}>{count}</div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Members</span>
                                 </div>
                              </td>
                              <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button 
                                       onClick={() => handleEditClick(des)}
                                       className="icon-btn" 
                                       style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                                       title="Edit Profile"
                                    >
                                       <Edit size={16} />
                                    </button>
                                    <button 
                                       onClick={() => handleDeleteRole(des.id, des.title)}
                                       className="icon-btn" 
                                       style={{ backgroundColor: 'var(--bg-body)', color: 'var(--danger)', cursor: 'pointer' }}
                                       title="Remove Designation"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })
                  ) : (
                     <tr>
                        <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                           No professional designations found matching query.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Quick Add / Edit Form */}
         <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Briefcase size={20} className="text-muted" /> 
               {editingRole ? 'Edit Designation Profile' : 'Add New Designation'}
            </h3>
            
            <form onSubmit={handleSaveRole} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Designation Title</label>
                  <input 
                     type="text" 
                     placeholder="e.g. Lead Developer" 
                     required
                     ref={titleInputRef}
                     value={formTitle}
                     onChange={(e) => setFormTitle(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                  />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Department</label>
                  <select 
                     value={formDept}
                     onChange={(e) => setFormDept(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                     <option value="Academic">Academic</option>
                     <option value="Administration">Administration</option>
                     <option value="Technical">Technical</option>
                  </select>
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Info size={16} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700 }}>Designations are used for role-based permission control.</p>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                     type="submit"
                     className="btn btn-primary" 
                     style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
                  >
                     <Save size={18} /> SAVE ROLE
                  </button>
                  <button 
                     type="button"
                     onClick={handleResetForm}
                     className="btn" 
                     style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                     title="Reset Form"
                  >
                     <X size={18} />
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default Designation;
