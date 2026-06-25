import React, { useState, useEffect } from 'react';
import { 
  Map, Search, Filter, Plus, Users, Bus, MapPin, CheckCircle2, 
  ChevronRight, UserPlus, Info, X, Save, AlertCircle, Trash2, Edit 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Seed assignment list
const SEED_ASSIGNMENTS = [
  { id: 1, student: 'Aarav Sharma', grade: '10-A', route: 'Canary Hill Express', vehicle: 'Bus JH-02-B-1101', stop: 'Korrah Chowk', status: 'Assigned' },
  { id: 2, student: 'Ananya Kumari', grade: '10-A', route: 'Canary Hill Express', vehicle: 'Bus JH-02-B-1101', stop: 'Korrah Chowk', status: 'Assigned' },
  { id: 3, student: 'Rahul Kumar', grade: '10-A', route: 'Matwari Town Shuttle', vehicle: 'Bus JH-02-B-2204', stop: 'Matwari', status: 'Pending' },
  { id: 4, student: 'Priya Mahato', grade: '10-B', route: 'Babu Gaon residency', vehicle: 'Bus JH-02-B-5509', stop: 'Babu Gaon', status: 'Assigned' },
  { id: 5, student: 'Aditya Yadav', grade: '9-C', route: 'Canary Hill Express', vehicle: 'Bus JH-02-B-1101', stop: 'Canary Hill Road', status: 'Assigned' },
];

// Seed list of available eligible students for assignment
const AVAILABLE_STUDENTS = [
  { name: 'Sneha Soren', grade: '9-A', defaultStop: 'Town Station' },
  { name: 'Rohan Oraon', grade: '9-B', defaultStop: 'Annada Chowk' },
  { name: 'Jyoti Prasad', grade: '11-A', defaultStop: 'Hurhuru' },
  { name: 'Vikram Singh', grade: '12-B', defaultStop: 'Pelawal' },
  { name: 'Neha Gupta', grade: '10-C', defaultStop: 'Indrapuri' },
  { name: 'Sandeep Pandey', grade: '10-B', defaultStop: 'Dipugarha' },
];

// Seed list of available routes & vehicles
const ROUTES_DATABASE = [
  { name: 'Canary Hill Express', vehicle: 'Bus JH-02-B-1101' },
  { name: 'Matwari Town Shuttle', vehicle: 'Bus JH-02-B-2204' },
  { name: 'Babu Gaon residency', vehicle: 'Bus JH-02-B-5509' },
  { name: 'Staff Loop (Town Station)', vehicle: 'Van JH-02-V-4402' },
];

const Transportation = () => {
  // Assignments state
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('transport_assignments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEED_ASSIGNMENTS;
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoute, setFilterRoute] = useState('All');
  const [toast, setToast] = useState(null);

  // Modals & Sheets
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailSheet, setShowDetailSheet] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [newForm, setNewForm] = useState({
    student: '',
    grade: '',
    route: '',
    stop: '',
    status: 'Assigned',
  });

  const [quickStudent, setQuickStudent] = useState('');
  const [quickRoute, setQuickRoute] = useState('');

  // Persist assignments list
  const persist = (updated) => {
    setAssignments(updated);
    localStorage.setItem('transport_assignments', JSON.stringify(updated));
  };

  // Toast handler
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Filter out students who already have assignments
  const unassignedStudents = AVAILABLE_STUDENTS.filter(
    s => !assignments.some(a => a.student.toLowerCase() === s.name.toLowerCase())
  );

  // Handle Quick Assignment submission
  const handleQuickAssign = () => {
    if (!quickStudent || !quickRoute) {
      showToast('error', 'Please select both a student and a route.');
      return;
    }

    const studentData = AVAILABLE_STUDENTS.find(s => s.name === quickStudent);
    const routeData = ROUTES_DATABASE.find(r => r.name === quickRoute);

    if (!studentData || !routeData) {
      showToast('error', 'Invalid student or route selection.');
      return;
    }

    const newAssign = {
      id: Date.now(),
      student: studentData.name,
      grade: studentData.grade,
      route: routeData.name,
      vehicle: routeData.vehicle,
      stop: studentData.defaultStop,
      status: 'Assigned',
    };

    const updated = [...assignments, newAssign];
    persist(updated);
    showToast('success', `Assigned ${studentData.name} to ${routeData.name} successfully.`);
    setQuickStudent('');
    setQuickRoute('');
  };

  // Handle New Assignment Pop-up Modal submission
  const handleNewFormSubmit = (e) => {
    e.preventDefault();
    if (!newForm.student || !newForm.grade || !newForm.route || !newForm.stop) {
      showToast('error', 'Please fill in all fields.');
      return;
    }

    const routeData = ROUTES_DATABASE.find(r => r.name === newForm.route) || { vehicle: 'TBD' };

    const newAssign = {
      id: Date.now(),
      student: newForm.student,
      grade: newForm.grade,
      route: newForm.route,
      vehicle: routeData.vehicle,
      stop: newForm.stop,
      status: newForm.status,
    };

    const updated = [...assignments, newAssign];
    persist(updated);
    showToast('success', `Created transport assignment for ${newForm.student}.`);
    setShowNewModal(false);
    setNewForm({ student: '', grade: '', route: '', stop: '', status: 'Assigned' });
  };

  // Save changes on editable drawer
  const handleUpdateAssignment = (e) => {
    e.preventDefault();
    if (!showDetailSheet.stop || !showDetailSheet.route) {
      showToast('error', 'Required fields cannot be empty.');
      return;
    }

    const routeData = ROUTES_DATABASE.find(r => r.name === showDetailSheet.route) || { vehicle: 'TBD' };

    const updated = assignments.map(a => 
      a.id === showDetailSheet.id 
        ? { ...showDetailSheet, vehicle: routeData.vehicle } 
        : a
    );

    persist(updated);
    showToast('success', `Updated assignment for ${showDetailSheet.student}.`);
    setShowDetailSheet(null);
  };

  // Delete Assignment
  const handleDeleteAssignment = (id) => {
    setDeleteConfirmId(id);
    setShowDetailSheet(null);
  };

  // Live filter & search
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = 
      a.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.stop.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoute = 
      filterRoute === 'All' || 
      a.route === filterRoute;

    return matchesSearch && matchesRoute;
  });

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast Notification */}
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

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Transportation Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Assign students to transport routes, manage pickup points, and track subscription status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setShowPolicyModal(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 800 }}>
              <Info size={20} /> Transport Policy
           </button>
           <button onClick={() => setShowNewModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}>
              <UserPlus size={20} /> New Assignment
           </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>
         {/* Left Side: Table of active assignments */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
               {/* Search & route filtering bar */}
               <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                     <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                     <input 
                       type="text" 
                       placeholder="Search student, route or stop..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                     />
                  </div>
                  <select 
                    value={filterRoute}
                    onChange={(e) => setFilterRoute(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="All">All Routes</option>
                    <option value="North Express">North Express</option>
                    <option value="Downtown Shuttle">Downtown Shuttle</option>
                    <option value="Residency Express">Residency Express</option>
                    <option value="Staff Loop">Staff Loop</option>
                  </select>
               </div>
               
               {/* Assignments Table */}
               <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead>
                        <tr style={{ backgroundColor: 'var(--bg-body)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                           <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Student / Grade</th>
                           <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Route / Vehicle</th>
                           <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Pickup Point</th>
                           <th style={{ padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Status</th>
                           <th style={{ padding: '16px 20px' }}></th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredAssignments.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                              No student transport assignments found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredAssignments.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                               <td style={{ padding: '16px 20px' }}>
                                  <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.student}</p>
                                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Class {item.grade}</p>
                               </td>
                               <td style={{ padding: '16px 20px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                     <Bus size={16} style={{ color: 'var(--primary)' }} />
                                     <div>
                                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem' }}>{item.route}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{item.vehicle}</p>
                                     </div>
                                  </div>
                               </td>
                               <td style={{ padding: '16px 20px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                     <MapPin size={14} className="text-muted" /> {item.stop}
                                  </div>
                               </td>
                               <td style={{ padding: '16px 20px' }}>
                                  <span style={{ 
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900,
                                    backgroundColor: item.status === 'Assigned' ? '#ecfdf5' : '#fffbeb',
                                    color: item.status === 'Assigned' ? '#10b981' : '#d97706',
                                    border: `1px solid ${item.status === 'Assigned' ? '#10b98125' : '#d9770625'}`
                                  }}>{item.status.toUpperCase()}</span>
                               </td>
                               <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                  <button onClick={() => setShowDetailSheet(item)} className="icon-btn" style={{ cursor: 'pointer' }}><ChevronRight size={18} /></button>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Side: Quick Assignment & Stats */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Assignment Form Block */}
            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '6px' }}>Quick Assignment</h3>
               <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Instantly assign registered students to transit routes.</p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                     <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Select Student</p>
                     {unassignedStudents.length === 0 ? (
                       <div style={{ padding: '12px', borderRadius: '12px', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
                         All registry students have transport assignments.
                       </div>
                     ) : (
                       <select 
                         value={quickStudent}
                         onChange={(e) => setQuickStudent(e.target.value)}
                         style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                       >
                          <option value="">Choose student...</option>
                          {unassignedStudents.map(s => (
                            <option key={s.name} value={s.name}>{s.name} ({s.grade})</option>
                          ))}
                       </select>
                     )}
                  </div>
                  <div>
                     <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Assign Route</p>
                     <select 
                       value={quickRoute}
                       onChange={(e) => setQuickRoute(e.target.value)}
                       style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                     >
                        <option value="">Choose route...</option>
                        {ROUTES_DATABASE.map(r => (
                          <option key={r.name} value={r.name}>{r.name} ({r.vehicle})</option>
                        ))}
                     </select>
                  </div>
                  <button 
                    onClick={handleQuickAssign}
                    className="btn btn-primary" 
                    style={{ padding: '16px', borderRadius: '16px', fontWeight: 900, marginTop: '10px', border: 'none', cursor: 'pointer' }}
                  >
                     CONFIRM ASSIGNMENT
                  </button>
               </div>
            </div>

            {/* Statistics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <Users size={24} className="text-muted" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)' }}>
                    {445 + assignments.length}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>SUBSCRIBERS</p>
               </div>
               <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <Map size={24} className="text-muted" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)' }}>
                    {new Set(assignments.filter(a => a.status === 'Assigned').map(a => a.route)).size || 3}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ACTIVE ROUTES</p>
               </div>
            </div>
         </div>
      </div>

      {/* NEW ASSIGNMENT DIALOG MODAL */}
      <AnimatePresence>
        {showNewModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Create Transport Assignment</h2>
                <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleNewFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={newForm.student} 
                    onChange={e => setNewForm({...newForm, student: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    placeholder="e.g. Neville Longbottom" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class Grade *</label>
                    <input 
                      type="text" 
                      required 
                      value={newForm.grade} 
                      onChange={e => setNewForm({...newForm, grade: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. 9-A" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initial Status</label>
                    <select 
                      value={newForm.status} 
                      onChange={e => setNewForm({...newForm, status: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assign Route *</label>
                    <select 
                      value={newForm.route} 
                      onChange={e => setNewForm({...newForm, route: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}
                      required
                    >
                      <option value="">Select Route...</option>
                      {ROUTES_DATABASE.map(r => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pickup Stop Stop *</label>
                    <input 
                      type="text" 
                      required 
                      value={newForm.stop} 
                      onChange={e => setNewForm({...newForm, stop: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. Sector 12 Gate" 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowNewModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> Confirm Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POLICY MODAL */}
      <AnimatePresence>
        {showPolicyModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '640px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}><Info size={24} /></div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Institutional Transport Policy</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operational safety guidelines, seat capacities, and telemetry guidelines.</p>
                   </div>
                </div>
                <button onClick={() => setShowPolicyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '55vh', overflowY: 'auto' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>1. Seat Capacity & Strict Load Enforcement</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    Overloading is strictly prohibited by school transport policies. No vehicles should exceed 100% seating occupancy. Students must remain seated and buckled at all times during the transit route.
                  </p>
                </div>
                
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>2. Transit Pickup & Arrival Times</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    Students are required to arrive at their designated Pickup Stop exactly 5 minutes before scheduled arrival. Bus drivers will halt for exactly 90 seconds at each stop before moving forward to maintain schedule compliance.
                  </p>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>3. General Behavioral Code of Conduct</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    Standard student disciplinary terms apply. Respecting the assigned bus drivers and supervisors is mandatory. Infractions or safety violations will lead to direct temporary suspension of driving/bus privileges.
                  </p>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>4. Hotlines & Incident Command Centre</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    • Main Transit Dispatch Hotline: +1 800 555 9800<br />
                    • Student Safety Supervisor Email: safety.transport@edupro.com
                  </p>
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPolicyModal(false)} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800, cursor: 'pointer' }}>Acknowledge & Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT / DETAILS BOTTOM SHEET MODAL DRAWER */}
      <AnimatePresence>
        {showDetailSheet && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            {/* Click backdrop to closer */}
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowDetailSheet(null)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10 }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>Modify Student Assignment</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Adjusting transport parameters for {showDetailSheet.student}</p>
                </div>
                <button onClick={() => setShowDetailSheet(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleUpdateAssignment} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student</label>
                    <input 
                      type="text" 
                      disabled 
                      value={showDetailSheet.student} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', fontWeight: 700, cursor: 'not-allowed', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grade</label>
                    <input 
                      type="text" 
                      disabled 
                      value={showDetailSheet.grade} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', fontWeight: 700, cursor: 'not-allowed', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Route Assignment *</label>
                    <select 
                      value={showDetailSheet.route} 
                      onChange={e => setShowDetailSheet({...showDetailSheet, route: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                      required
                    >
                      {ROUTES_DATABASE.map(r => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subscription Status</label>
                    <select 
                      value={showDetailSheet.status} 
                      onChange={e => setShowDetailSheet({...showDetailSheet, status: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pickup Point Stop *</label>
                  <input 
                    type="text" 
                    required 
                    value={showDetailSheet.stop} 
                    onChange={e => setShowDetailSheet({...showDetailSheet, stop: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteAssignment(showDetailSheet.id)} 
                    className="btn" 
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #ef444430', backgroundColor: '#fef2f2', color: '#ef4444', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trash2 size={16} /> Cancel Assignment
                  </button>
                  <div style={{ flex: 1 }} />
                  <button 
                    type="button" 
                    onClick={() => setShowDetailSheet(null)} 
                    className="btn" 
                    style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={16} /> Save updates
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION DIALOG */}
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
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
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Cancel Assignment</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to cancel the transport assignment for this student? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    const target = assignments.find(a => a.id === deleteConfirmId);
                    if (target) {
                      const updated = assignments.filter(a => a.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Removed transport assignment for ${target.student}.`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel Transport
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transportation;
