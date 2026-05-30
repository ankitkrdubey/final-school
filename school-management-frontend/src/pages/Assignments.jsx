import React, { useState, useEffect } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { 
  BookOpen, Calendar, Download, Plus, CheckCircle2, Clock, 
  Search, Filter, MoreVertical, FileText, ChevronRight,
  AlertCircle, Tags, X, Check, Edit3, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Assignments = () => {
  const { toast, showToast, hideToast } = useToast();
  // Core Assignments State
  const [assignments, setAssignments] = useState([
    { id: 'ASN-001', title: 'Calculus III Problem Set', class: '10A', dueDate: '2026-05-15', status: 'Pending', type: 'Homework', priority: 'High', color: '#EF4444' },
    { id: 'ASN-002', title: 'World War II Research Paper', class: '10B', dueDate: '2026-05-18', status: 'In Review', type: 'Project', priority: 'Medium', color: '#F59E0B' },
    { id: 'ASN-003', title: 'Quantum Physics Lab Report', class: '10A', dueDate: '2026-05-12', status: 'Completed', type: 'Lab', priority: 'High', color: '#10B981' },
    { id: 'ASN-004', title: 'Business Ethics Case Study', class: '12C', dueDate: '2026-05-20', status: 'Pending', type: 'Assignment', priority: 'Low', color: 'var(--primary)' },
    { id: 'ASN-005', title: 'Organic Chemistry Synthesis', class: '11A', dueDate: '2026-05-22', status: 'Pending', type: 'Lab', priority: 'High', color: '#EF4444' },
    { id: 'ASN-006', title: 'Shakespearean Sonnet Analysis', class: '09C', dueDate: '2026-05-14', status: 'Completed', type: 'Essay', priority: 'Medium', color: '#10B981' },
    { id: 'ASN-007', title: 'Digital Marketing Campaign', class: '12B', dueDate: '2026-05-25', status: 'Pending', type: 'Project', priority: 'High', color: 'var(--primary)' },
    { id: 'ASN-008', title: 'Macroeconomics Theory', class: '11B', dueDate: '2026-05-19', status: 'In Review', type: 'Homework', priority: 'Low', color: '#F59E0B' },
  ]);

  // Mock Student Submissions for Submission Log
  const [submissions, setSubmissions] = useState([
    { id: 'SUB-001', student: 'Alex Johnson', assignmentId: 'ASN-001', title: 'Calculus III Problem Set', class: '10A', submittedAt: 'Today, 10:24 AM', grade: 'Pending', file: 'calculus_set3_alex.pdf', score: '' },
    { id: 'SUB-002', student: 'Maria Garcia', assignmentId: 'ASN-001', title: 'Calculus III Problem Set', class: '10A', submittedAt: 'Today, 09:15 AM', grade: 'A', file: 'calculus_iii_garcia.pdf', score: '95' },
    { id: 'SUB-003', student: 'Kevin Lee', assignmentId: 'ASN-002', title: 'World War II Research Paper', class: '10B', submittedAt: 'Yesterday, 04:30 PM', grade: 'B+', file: 'ww2_paper_kevin.pdf', score: '88' },
    { id: 'SUB-004', student: 'Sophia Chen', assignmentId: 'ASN-003', title: 'Quantum Physics Lab Report', class: '10A', submittedAt: 'May 12, 11:20 AM', grade: 'A+', file: 'quantum_lab_sophia.pdf', score: '100' },
    { id: 'SUB-005', student: 'Daniel Ray', assignmentId: 'ASN-002', title: 'World War II Research Paper', class: '10B', submittedAt: 'May 17, 02:45 PM', grade: 'Pending', file: 'wwii_daniel_ray.pdf', score: '' },
  ]);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedType, setSelectedType] = useState('All Types');

  // Modals & Details State
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSubmissionLog, setShowSubmissionLog] = useState(false);
  const [activeAssignmentDetails, setActiveAssignmentDetails] = useState(null);

  // Grade Form State
  const [gradingScoreMap, setGradingScoreMap] = useState({});

  // Dropdown, Edit & Drawer filter states
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [submissionFilterId, setSubmissionFilterId] = useState(null);

  // Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    class: '10A',
    dueDate: '',
    type: 'Homework',
    priority: 'High',
    description: ''
  });

  // Unique lists for filters
  const classesList = ['All Classes', ...new Set(assignments.map(a => a.class))];
  const typesList = ['All Types', 'Homework', 'Project', 'Lab', 'Assignment', 'Essay'];

  // List of submissions
  const displayedSubmissions = submissionFilterId 
    ? submissions.filter(sub => sub.assignmentId === submissionFilterId)
    : submissions;

  // Dynamic Statistics Calculations
  const getStats = () => {
    const activeTasks = assignments.filter(a => a.status === 'Pending' || a.status === 'In Review').length;
    const inReview = assignments.filter(a => a.status === 'In Review').length;
    const completed = assignments.filter(a => a.status === 'Completed').length;
    
    // Auto-calculate overdue tasks based on dummy dates
    const overdue = assignments.filter(a => {
      const isPast = new Date(a.dueDate) < new Date();
      return isPast && a.status !== 'Completed';
    }).length;

    return {
      activeTasks: String(activeTasks).padStart(2, '0'),
      inReview: String(inReview).padStart(2, '0'),
      completedToday: String(128 + completed).padStart(2, '0'), // base count + newly completed
      overdue: String(overdue).padStart(2, '0')
    };
  };

  const stats = getStats();

  // Dynamic Filter logic
  const filteredAssignments = assignments.filter(asn => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      asn.title.toLowerCase().includes(query) || 
      asn.id.toLowerCase().includes(query) ||
      asn.class.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // 2. Class Dropdown Filter
    if (selectedClass !== 'All Classes' && asn.class !== selectedClass) {
      return false;
    }

    // 3. Type Dropdown Filter
    if (selectedType !== 'All Types' && asn.type !== selectedType) {
      return false;
    }

    return true;
  });

  // Handle status update inside inspector drawer
  const handleUpdateStatus = (asnId, nextStatus) => {
    let nextColor = 'var(--primary)';
    if (nextStatus === 'Completed') nextColor = '#10B981';
    else if (nextStatus === 'In Review') nextColor = '#F59E0B';
    else if (nextStatus === 'Pending') nextColor = '#EF4444';

    setAssignments(prev => prev.map(asn => {
      if (asn.id === asnId) {
        const updated = { ...asn, status: nextStatus, color: nextColor };
        // Sync active details drawer
        if (activeAssignmentDetails && activeAssignmentDetails.id === asnId) {
          setActiveAssignmentDetails(updated);
        }
        return updated;
      }
      return asn;
    }));
  };

  // Handle Grade Submission
  const [gradingScoreMapDummy, setGradingScoreMapDummy] = useState({}); // Keep layout unchanged if referenced elsewhere
  const handleGradeSubmission = (subId, score) => {
    if (!score || isNaN(score) || score < 0 || score > 100) {
      showToast('Please enter a valid score between 0 and 100.', 'error', 'Invalid Score');
      return;
    }

    let nextGrade = 'F';
    const num = Number(score);
    if (num >= 95) nextGrade = 'A+';
    else if (num >= 90) nextGrade = 'A';
    else if (num >= 85) nextGrade = 'B+';
    else if (num >= 80) nextGrade = 'B';
    else if (num >= 70) nextGrade = 'C';
    else if (num >= 50) nextGrade = 'D';

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === subId) {
        showToast(`Score of ${score} (${nextGrade}) recorded for ${sub.student}.`, 'success', 'Grade Recorded');
        return { ...sub, grade: nextGrade, score: score };
      }
      return sub;
    }));
  };

  // Handle Post Assignment Submit
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.dueDate) {
      showToast('Please enter a Title and Due Date.', 'warning', 'Missing Fields');
      return;
    }

    let priorityColor = 'var(--primary)';
    if (postForm.priority === 'High') priorityColor = '#EF4444';
    else if (postForm.priority === 'Medium') priorityColor = '#F59E0B';

    if (editAssignmentId) {
      // Editing Mode
      setAssignments(prev => prev.map(asn => {
        if (asn.id === editAssignmentId) {
          return {
            ...asn,
            title: postForm.title,
            class: postForm.class,
            dueDate: postForm.dueDate,
            type: postForm.type,
            priority: postForm.priority,
            color: priorityColor,
            description: postForm.description
          };
        }
        return asn;
      }));
      showToast(`Assignment '${postForm.title}' updated successfully.`, 'success', 'Assignment Saved');
      setEditAssignmentId(null);
    } else {
      // Creation Mode
      const nextIdNumber = assignments.length + 1;
      const newAsn = {
        id: `ASN-${String(nextIdNumber).padStart(3, '0')}`,
        title: postForm.title,
        class: postForm.class,
        dueDate: postForm.dueDate,
        status: 'Pending',
        type: postForm.type,
        priority: postForm.priority,
        color: priorityColor,
        description: postForm.description
      };

      setAssignments(prev => [newAsn, ...prev]);
      showToast(`New assignment '${postForm.title}' posted successfully.`, 'success', 'Assignment Created');
    }

    setShowPostModal(false);

    // Reset Form
    setPostForm({
      title: '',
      class: '10A',
      dueDate: '',
      type: 'Homework',
      priority: 'High',
      description: ''
    });
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setEditAssignmentId(null);
    setPostForm({
      title: '',
      class: '10A',
      dueDate: '',
      type: 'Homework',
      priority: 'High',
      description: ''
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', position: 'relative' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <FileText size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Workload</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Homework & Assignments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Track student submissions, manage deadlines, and distribute study materials.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              className="btn" 
              onClick={() => { setSubmissionFilterId(null); setShowSubmissionLog(true); }}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Download size={18} /> SUBMISSION LOG
           </button>
           <button 
              className="btn btn-primary" 
              onClick={() => { setEditAssignmentId(null); setShowPostModal(true); }}
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer' }}
           >
              <Plus size={18} /> POST ASSIGNMENT
           </button>
        </div>
      </div>

      {/* Analytics Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
         {[
           { label: 'Active Tasks', value: stats.activeTasks, icon: <Clock size={20} />, color: 'var(--primary)' },
           { label: 'In Review', value: stats.inReview, icon: <Search size={20} />, color: '#F59E0B' },
           { label: 'Completed Today', value: stats.completedToday, icon: <CheckCircle2 size={20} />, color: '#10B981' },
           { label: 'Overdue', value: stats.overdue, icon: <AlertCircle size={20} />, color: '#EF4444' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.value}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-input" 
              style={{ width: '160px', borderRadius: '12px', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              {classesList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-input" 
              style={{ width: '160px', borderRadius: '12px', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              {typesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {(selectedClass !== 'All Classes' || selectedType !== 'All Types' || searchQuery !== '') && (
              <button 
                onClick={() => { setSelectedClass('All Classes'); setSelectedType('All Types'); setSearchQuery(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Reset Filters
              </button>
            )}
         </div>
         <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search assignment..." 
               style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '13px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      {/* Assignment Table */}
      <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                     <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Task Information</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type / Priority</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Due Date</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <AlertCircle size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
                        No assignments match the filtered criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((asn) => (
                       <tr key={asn.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-row">
                          <td style={{ padding: '20px 24px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                   <FileText size={20} />
                                </div>
                                <div>
                                   <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{asn.title}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Class: {asn.class} • {asn.id}</div>
                                </div>
                             </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{asn.type}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 900, color: asn.color }}>
                                   <Tags size={10} /> {asn.priority.toUpperCase()}
                                </div>
                             </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                <Calendar size={14} color="var(--primary)" /> {new Date(asn.dueDate).toLocaleDateString()}
                             </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                             <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, backgroundColor: `${asn.color}15`, color: asn.color, textTransform: 'uppercase' }}>
                                {asn.status}
                             </span>
                          </td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                             <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button 
                                  className="btn" 
                                  onClick={() => setActiveAssignmentDetails(asn)}
                                  style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}
                                >
                                  VIEW
                                </button>
                                <div style={{ position: 'relative' }}>
                                   <button 
                                     className="btn-icon" 
                                     onClick={() => setActiveDropdownId(activeDropdownId === asn.id ? null : asn.id)}
                                     style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                                   >
                                     <MoreVertical size={18} />
                                   </button>
                                   <AnimatePresence>
                                     {activeDropdownId === asn.id && (
                                       <>
                                         <div 
                                           onClick={() => setActiveDropdownId(null)} 
                                           style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                                         />
                                         <motion.div
                                           initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                           animate={{ opacity: 1, scale: 1, y: 0 }}
                                           exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                           style={{
                                             position: 'absolute',
                                             right: 0,
                                             top: '100%',
                                             marginTop: '8px',
                                             backgroundColor: 'var(--bg-card)',
                                             border: '1px solid var(--border-color)',
                                             borderRadius: '12px',
                                             boxShadow: 'var(--shadow-lg)',
                                             zIndex: 95,
                                             width: '180px',
                                             padding: '6px',
                                             textAlign: 'left',
                                             display: 'flex',
                                             flexDirection: 'column',
                                             gap: '2px'
                                           }}
                                         >
                                           <button
                                             onClick={() => {
                                               setPostForm({
                                                 title: asn.title,
                                                 class: asn.class,
                                                 dueDate: asn.dueDate,
                                                 type: asn.type,
                                                 priority: asn.priority,
                                                 description: asn.description || ''
                                               });
                                               setEditAssignmentId(asn.id);
                                               setShowPostModal(true);
                                               setActiveDropdownId(null);
                                             }}
                                             style={{
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: '8px',
                                               width: '100%',
                                               padding: '10px 12px',
                                               border: 'none',
                                               backgroundColor: 'transparent',
                                               color: 'var(--text-main)',
                                               borderRadius: '8px',
                                               cursor: 'pointer',
                                               fontSize: '0.8rem',
                                               fontWeight: 700,
                                               transition: 'background 0.2s'
                                             }}
                                             className="dropdown-item"
                                           >
                                             <Edit3 size={14} /> Edit Assignment
                                           </button>
                                           <button
                                             onClick={() => {
                                               setSubmissionFilterId(asn.id);
                                               setShowSubmissionLog(true);
                                               setActiveDropdownId(null);
                                             }}
                                             style={{
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: '8px',
                                               width: '100%',
                                               padding: '10px 12px',
                                               border: 'none',
                                               backgroundColor: 'transparent',
                                               color: 'var(--text-main)',
                                               borderRadius: '8px',
                                               cursor: 'pointer',
                                               fontSize: '0.8rem',
                                               fontWeight: 700,
                                               transition: 'background 0.2s'
                                             }}
                                             className="dropdown-item"
                                           >
                                             <Award size={14} /> Submissions
                                           </button>
                                           <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                                           <button
                                             onClick={() => {
                                               const nextStatus = asn.status === 'Completed' ? 'Pending' : 'Completed';
                                               handleUpdateStatus(asn.id, nextStatus);
                                               showToast(`Status toggled to ${nextStatus}.`, 'success', 'Status Changed');
                                               setActiveDropdownId(null);
                                             }}
                                             style={{
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: '8px',
                                               width: '100%',
                                               padding: '10px 12px',
                                               border: 'none',
                                               backgroundColor: 'transparent',
                                               color: 'var(--text-main)',
                                               borderRadius: '8px',
                                               cursor: 'pointer',
                                               fontSize: '0.8rem',
                                               fontWeight: 700,
                                               transition: 'background 0.2s'
                                             }}
                                             className="dropdown-item"
                                           >
                                             <Check size={14} /> Mark {asn.status === 'Completed' ? 'Pending' : 'Completed'}
                                           </button>
                                           <button
                                             onClick={() => {
                                               setAssignments(prev => prev.filter(item => item.id !== asn.id));
                                               showToast(`Assignment ${asn.title} deleted successfully.`, 'success', 'Assignment Removed');
                                               setActiveDropdownId(null);
                                             }}
                                             style={{
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: '8px',
                                               width: '100%',
                                               padding: '10px 12px',
                                               border: 'none',
                                               backgroundColor: 'transparent',
                                               color: '#EF4444',
                                               borderRadius: '8px',
                                               cursor: 'pointer',
                                               fontSize: '0.8rem',
                                               fontWeight: 700,
                                               transition: 'background 0.2s'
                                             }}
                                             className="dropdown-item-danger"
                                           >
                                             <X size={14} /> Delete
                                           </button>
                                         </motion.div>
                                       </>
                                     )}
                                   </AnimatePresence>
                                </div>
                             </div>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Slide-out Drawer Overlay for Assignment Details */}
      <AnimatePresence>
        {activeAssignmentDetails && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAssignmentDetails(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: activeAssignmentDetails.color, backgroundColor: `${activeAssignmentDetails.color}15`, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    {activeAssignmentDetails.type}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', margin: '12px 0 4px' }}>{activeAssignmentDetails.title}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{activeAssignmentDetails.id} • Class {activeAssignmentDetails.class}</span>
                </div>
                <button 
                  onClick={() => setActiveAssignmentDetails(null)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>UPDATE STATUS</label>
                <select
                  value={activeAssignmentDetails.status}
                  onChange={(e) => handleUpdateStatus(activeAssignmentDetails.id, e.target.value)}
                  style={{ 
                    padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', color: activeAssignmentDetails.color, 
                    fontWeight: 900, outline: 'none', cursor: 'pointer', fontSize: '0.9rem' 
                  }}
                >
                  <option value="Pending">Pending (Red)</option>
                  <option value="In Review">In Review (Orange)</option>
                  <option value="Completed">Completed (Green)</option>
                </select>
              </div>

              {/* Assignment Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Task Description</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Provide comprehensive step-by-step solutions for Chapter 4 & 5 practice questions. Submissions must be compiled as a single PDF. Please cross-reference all formulas used. Late submissions will result in a 10% penalty per calendar day.
                  </p>
                </div>

                {/* Deadlines & Priorities */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DUE DATE</span>
                    <h4 style={{ margin: '6px 0 0', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--primary)" /> {new Date(activeAssignmentDetails.dueDate).toLocaleDateString()}
                    </h4>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PRIORITY</span>
                    <h4 style={{ margin: '6px 0 0', fontSize: '0.9rem', fontWeight: 900, color: activeAssignmentDetails.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tags size={14} /> {activeAssignmentDetails.priority.toUpperCase()}
                    </h4>
                  </div>
                </div>

                {/* Submissions Completion summary */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>Submission Overview</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      <span>Class Completion Rate</span>
                      <span style={{ color: 'var(--text-main)' }}>78% (22/28 Students)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#10B981', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>

                {/* Student Submission check-list */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>Recent Class Activity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { name: 'Alex Johnson', status: 'Graded (95)', scoreColor: '#10B981' },
                      { name: 'Maria Garcia', status: 'Submitted (Reviewing)', scoreColor: '#F59E0B' },
                      { name: 'Kevin Lee', status: 'Pending Review', scoreColor: '#EF4444' }
                    ].map((std, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{std.name}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: std.scoreColor }}>{std.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Drawer for Submission Log */}
      <AnimatePresence>
        {showSubmissionLog && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmissionLog(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '550px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>Student Submissions Log</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Grade recent works, examine uploads, and update student scores.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => {
                      const csvContent = [
                        ['Submission ID', 'Student Name', 'Assignment ID', 'Assignment Title', 'Class', 'Submitted At', 'Score', 'Grade'],
                        ...displayedSubmissions.map(sub => [sub.id, sub.student, sub.assignmentId, sub.title, sub.class, sub.submittedAt, sub.score || 'N/A', sub.grade])
                      ].map(e => e.join(",")).join("\n");
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `Student_Submissions_${submissionFilterId || 'All'}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Submissions CSV downloaded successfully.', 'success', 'Export Complete');
                    }}
                    style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <Download size={14} /> EXPORT
                  </button>
                  <button 
                    onClick={() => { setShowSubmissionLog(false); setSubmissionFilterId(null); }}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filter active state banner */}
              {submissionFilterId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-light)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <span>Filtered for Assignment: {submissionFilterId}</span>
                  <button 
                    onClick={() => setSubmissionFilterId(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Show All
                  </button>
                </div>
              )}

              {/* List of submissions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {displayedSubmissions.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                     No submissions found for this assignment.
                  </div>
                ) : (
                  displayedSubmissions.map((sub) => (
                    <div key={sub.id} style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{sub.student}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Class: {sub.class} • {sub.title}</span>
                        </div>
                        <span style={{ 
                          fontSize: '0.7rem', fontWeight: 900, padding: '4px 10px', borderRadius: '8px', 
                          backgroundColor: sub.grade === 'Pending' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                          color: sub.grade === 'Pending' ? '#EF4444' : '#10B981', textTransform: 'uppercase' 
                        }}>
                          {sub.grade === 'Pending' ? 'Pending Review' : `Graded: ${sub.grade}`}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                          <FileText size={14} color="var(--primary)" /> {sub.file}
                        </div>
                        <span style={{ fontWeight: 600 }}>Submitted: {sub.submittedAt}</span>
                      </div>

                      {/* Grading Form */}
                      <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                          <Award size={16} color="#F59E0B" />
                          <input 
                            type="number"
                            value={gradingScoreMap[sub.id] !== undefined ? gradingScoreMap[sub.id] : (sub.score || '')}
                            onChange={(e) => setGradingScoreMap(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            placeholder={sub.score ? `Score: ${sub.score}` : "Enter Score (0-100)"}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                          />
                        </div>
                        <button 
                          onClick={() => handleGradeSubmission(sub.id, gradingScoreMap[sub.id])}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 10px rgba(72,128,255,0.2)' }}
                        >
                          {sub.grade === 'Pending' ? 'SUBMIT GRADE' : 'UPDATE'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Post New Assignment Modal */}
      <AnimatePresence>
        {showPostModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: '500px', maxWidth: '95%', backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', borderRadius: '28px', 
                  boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', 
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 955, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editAssignmentId ? (
                      <>
                        <Edit3 size={20} color="var(--primary)" /> Edit Assignment
                      </>
                    ) : (
                      <>
                        <Plus size={20} color="var(--primary)" /> Post New Assignment
                      </>
                    )}
                  </h2>
                  <button 
                    onClick={handleClosePostModal}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handlePostSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>ASSIGNMENT TITLE *</label>
                    <input 
                      type="text" 
                      value={postForm.title}
                      onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Molecular Biology Term Paper"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>TARGET CLASS</label>
                      <select 
                        value={postForm.class}
                        onChange={(e) => setPostForm(prev => ({ ...prev, class: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['10A', '10B', '11A', '11B', '12B', '12C', '09C'].map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>TYPE</label>
                      <select 
                        value={postForm.type}
                        onChange={(e) => setPostForm(prev => ({ ...prev, type: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['Homework', 'Project', 'Lab', 'Assignment', 'Essay'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>PRIORITY LEVEL</label>
                      <select 
                        value={postForm.priority}
                        onChange={(e) => setPostForm(prev => ({ ...prev, priority: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['High', 'Medium', 'Low'].map(p => (
                          <option key={p} value={p}>{p} Priority</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DUE DATE *</label>
                      <input 
                        type="date" 
                        value={postForm.dueDate}
                        onChange={(e) => setPostForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>TASK DESCRIPTION</label>
                    <textarea 
                      value={postForm.description}
                      onChange={(e) => setPostForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Read chapters 3 and 4 of textbooks, summarize case study in 500 words..."
                      rows="3"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button 
                      type="button"
                      onClick={handleClosePostModal}
                      style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                    >
                      {editAssignmentId ? 'Save Changes' : 'Post Assignment'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default Assignments;
