import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, Download, UserX, AlertTriangle, 
  MoreHorizontal, Mail, Phone, Calendar, CircleCheck, Loader2
} from 'lucide-react';
import Table from '../components/Table';
import { motion, AnimatePresence } from 'framer-motion';

const SuspendedStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [suspendedStudents, setSuspendedStudents] = useState([]);

  const [recentlyReinstated, setRecentlyReinstated] = useState(5);

  // Reinstatement States
  const [studentToReinstate, setStudentToReinstate] = useState(null);
  const [reinstateReason, setReinstateReason] = useState('Term Completed');
  const [reinstateStep, setReinstateStep] = useState('confirm'); // 'confirm', 'processing', 'success'
  const [reinstateMsg, setReinstateMsg] = useState('Re-establishing school registry access...');

  React.useEffect(() => {
    fetchSuspended();
  }, []);

  const fetchSuspended = () => {
    const storedVersion = localStorage.getItem('students_version');
    if (storedVersion !== '2026-v9') {
      localStorage.removeItem('students');
      localStorage.setItem('students_version', '2026-v9');
    }

    const stored = localStorage.getItem('students');
    let list = [];
    if (stored) {
      list = JSON.parse(stored);
    } else {
      const defaultList = [
        { student_id: 'STU101', name: 'Liam Fox', email: 'liam.fox@edupro.edu', phone: '+1 234 567 890', class_id: '10', section: 'A', rollNo: '24', admission_date: '2026-01-12', gender: 'Male', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', dob: '2010-05-12', bloodGroup: 'O+', religion: 'Christianity', parentName: 'Fox Sr.', parentOccupation: 'Engineer', parentPhone: '+1 987 654 321', parentEmail: 'fox.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU102', name: 'Jane Cooper', email: 'jane.cooper@edupro.edu', phone: '+1 234 567 891', class_id: '11', section: 'A', rollNo: '12', admission_date: '2026-01-15', gender: 'Female', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop', dob: '2009-08-18', bloodGroup: 'A-', religion: 'Christianity', parentName: 'Cooper Sr.', parentOccupation: 'Executive', parentPhone: '+1 987 654 322', parentEmail: 'cooper.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU103', name: 'Wade Warren', email: 'wade.warren@edupro.edu', phone: '+1 234 567 892', class_id: '10', section: 'A', rollNo: '08', admission_date: '2026-02-02', gender: 'Male', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=200&h=200&fit=crop', dob: '2010-03-05', bloodGroup: 'B+', religion: 'Christianity', parentName: 'Warren Sr.', parentOccupation: 'Manager', parentPhone: '+1 987 654 323', parentEmail: 'warren.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU104', name: 'Cody Fisher', email: 'cody.fisher@school.edu', phone: '+1 234 567 893', class_id: '12', section: 'B', rollNo: '14', admission_date: '2026-02-10', gender: 'Male', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop', dob: '2008-04-12', bloodGroup: 'AB+', religion: 'Christianity', parentName: 'Fisher Sr.', parentOccupation: 'Business', parentPhone: '+1 987 654 324', parentEmail: 'fisher.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU105', name: 'Esther Howard', email: 'esther.howard@school.edu', phone: '+1 234 567 894', class_id: '10', section: 'A', rollNo: '15', admission_date: '2026-03-05', gender: 'Female', status: 'Active', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', dob: '2010-09-23', bloodGroup: 'O+', religion: 'Christianity', parentName: 'Howard Sr.', parentOccupation: 'Lawyer', parentPhone: '+1 987 654 325', parentEmail: 'howard.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU106', name: 'Brooklyn Simmons', email: 'brooklyn.simmons@school.edu', phone: '+1 234 567 895', class_id: '09', section: 'C', rollNo: '02', admission_date: '2026-03-12', gender: 'Female', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', dob: '2011-03-12', bloodGroup: 'A+', religion: 'Christianity', parentName: 'Simmons Sr.', parentOccupation: 'Doctor', parentPhone: '+1 987 654 326', parentEmail: 'simmons.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU107', name: 'Guy Hawkins', email: 'guy.hawkins@school.edu', phone: '+1 234 567 896', class_id: '11', section: 'B', rollNo: '05', admission_date: '2026-04-01', gender: 'Male', status: 'Active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', dob: '2009-04-01', bloodGroup: 'B-', religion: 'Christianity', parentName: 'Hawkins Sr.', parentOccupation: 'Accountant', parentPhone: '+1 987 654 327', parentEmail: 'hawkins.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU108', name: 'Leslie Alexander', email: 'leslie.alexander@school.edu', phone: '+1 234 567 897', class_id: '12', section: 'A', rollNo: '07', admission_date: '2026-04-15', gender: 'Female', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', dob: '2008-04-15', bloodGroup: 'AB-', religion: 'Christianity', parentName: 'Alexander Sr.', parentOccupation: 'Architect', parentPhone: '+1 987 654 328', parentEmail: 'alexander.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU109', name: 'Jenny Wilson', email: 'jenny.wilson@school.edu', phone: '+1 234 567 898', class_id: '10', section: 'D', rollNo: '11', admission_date: '2026-05-01', gender: 'Female', status: 'Active', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop', dob: '2010-05-01', bloodGroup: 'O-', religion: 'Christianity', parentName: 'Wilson Sr.', parentOccupation: 'Teacher', parentPhone: '+1 987 654 329', parentEmail: 'wilson.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU110', name: 'Cameron Williamson', email: 'cameron.williamson@school.edu', phone: '+1 234 567 899', class_id: '11', section: 'A', rollNo: '18', admission_date: '2026-05-05', gender: 'Male', status: 'Active', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop', dob: '2009-05-05', bloodGroup: 'A+', religion: 'Christianity', parentName: 'Williamson Sr.', parentOccupation: 'Dentist', parentPhone: '+1 987 654 330', parentEmail: 'williamson.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU212', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+1 234 567 891', class_id: '11', section: 'A', rollNo: '03', admission_date: '2026-11-14', gender: 'Female', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop', dob: '2009-11-14', bloodGroup: 'A+', religion: 'Christianity', parentName: 'Williams Sr.', parentOccupation: 'Doctor', parentPhone: '+1 987 654 326', parentEmail: 'williams.sr@example.com', presentAddress: '123 School Lane, Education City, NY 10001', permanentAddress: '456 West Avenue, Hometown, CA 90210' },
        { student_id: 'STU213', name: 'Alex Johnson', email: 'alex.johnson@example.com', phone: '+1 234 567 900', class_id: '10', section: 'B', rollNo: '22', admission_date: '2026-09-01', gender: 'Male', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop', dob: '2010-02-15', bloodGroup: 'B+', religion: 'Christianity', parentName: 'Johnson Sr.', parentOccupation: 'Teacher', parentPhone: '+1 987 654 331', parentEmail: 'johnson.sr@example.com', presentAddress: '789 School Rd, City, NY 10002', permanentAddress: '1011 West Ave, Hometown, CA 90211' },
        { student_id: 'STU214', name: 'Maria Garcia', email: 'maria.garcia@example.com', phone: '+1 234 567 901', class_id: '12', section: 'C', rollNo: '05', admission_date: '2026-10-12', gender: 'Female', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop', dob: '2009-07-20', bloodGroup: 'AB+', religion: 'Christianity', parentName: 'Garcia Sr.', parentOccupation: 'Engineer', parentPhone: '+1 987 654 332', parentEmail: 'garcia.sr@example.com', presentAddress: '321 Elm St, Town, NY 10003', permanentAddress: '654 Oak Ave, Hometown, CA 90212' },
        { student_id: 'STU215', name: 'Nina Patel', email: 'nina.patel@example.com', phone: '+1 234 567 902', class_id: '9', section: 'A', rollNo: '10', admission_date: '2026-08-20', gender: 'Female', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', dob: '2009-12-05', bloodGroup: 'O-', religion: 'Christianity', parentName: 'Patel Sr.', parentOccupation: 'Nurse', parentPhone: '+1 987 654 333', parentEmail: 'patel.sr@example.com', presentAddress: '555 Maple St, Town, NY 10004', permanentAddress: '777 Oak Ave, Hometown, CA 90213' },
        { student_id: 'STU216', name: 'Omar Khan', email: 'omar.khan@example.com', phone: '+1 234 567 903', class_id: '10', section: 'C', rollNo: '07', admission_date: '2026-09-15', gender: 'Male', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop', dob: '2008-11-22', bloodGroup: 'B-', religion: 'Christianity', parentName: 'Khan Sr.', parentOccupation: 'Business Owner', parentPhone: '+1 987 654 334', parentEmail: 'khan.sr@example.com', presentAddress: '888 Pine St, City, NY 10005', permanentAddress: '999 Cedar Ave, Hometown, CA 90214' }
      ];
      localStorage.setItem('students', JSON.stringify(defaultList));
      list = defaultList;
    }

    const suspended = list.filter(s => s.status === 'Suspended').map((s, idx) => ({
      id: idx + 1,
      student_id: s.student_id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      class_id: s.class_id,
      avatar: s.avatar || '',
      gender: s.gender || 'Male',
      reason: s.reason || (s.student_id === 'STU212' ? 'Low Attendance' : 'Disciplinary Action'),
      suspended_since: s.suspended_since || 'May 01, 2026',
      duration: s.duration || 'Indefinite'
    }));

    setSuspendedStudents(suspended);
  };

  const handleConfirmReinstate = () => {
    setReinstateStep('processing');
    setReinstateMsg('Re-establishing school registry access and database hooks...');
    
    setTimeout(() => {
      setReinstateMsg('Revoking disciplinary blocks from institutional firewalls...');
    }, 600);

    setTimeout(() => {
      setReinstateMsg('Re-synchronizing student cards and attendance registry indices...');
    }, 1200);

    setTimeout(() => {
      // Update in localStorage
      const stored = localStorage.getItem('students');
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map(s => s.student_id === studentToReinstate.student_id ? { ...s, status: 'Active' } : s);
        localStorage.setItem('students', JSON.stringify(updated));
      }

      setSuspendedStudents(prev => prev.filter(s => s.student_id !== studentToReinstate.student_id));
      setRecentlyReinstated(prev => prev + 1);
      setReinstateStep('success');
    }, 1800);
  };

  const columns = [
    { 
      header: 'Student', 
      key: 'name',
      render: (row) => (
        <div 
          onClick={() => navigate(`/dashboard/student-details/${row.student_id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          className="hover-primary"
        >
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            backgroundColor: row.gender?.toLowerCase() === 'female' ? 'var(--success-light)' : 'var(--primary-light)', 
            color: row.gender?.toLowerCase() === 'female' ? 'var(--success)' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden'
          }}>
            {row.avatar ? (
              <img 
                src={row.avatar} 
                alt={row.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`;
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : row.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{row.student_id}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Reason for Suspension', 
      key: 'reason',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} color="var(--warning)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{row.reason}</span>
        </div>
      )
    },
    { 
      header: 'Suspended Since', 
      key: 'suspended_since',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Calendar size={12} /> {row.suspended_since}
        </div>
      )
    },
    { 
      header: 'Duration', 
      key: 'duration',
      render: (row) => (
        <span style={{ 
          padding: '6px 12px', backgroundColor: 'var(--bg-body)', 
          borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--danger)' 
        }}>
          {row.duration}
        </span>
      )
    }
  ];

  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredStudents = suspendedStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || s.reason === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Class', 'Reason', 'Suspended Since', 'Duration'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => [
        s.student_id,
        `"${s.name}"`,
        s.email,
        s.phone,
        s.class_id,
        `"${s.reason}"`,
        s.suspended_since,
        s.duration
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `suspended_students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Suspended Students</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>View and manage students currently under suspension or disciplinary probation.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={exportToCSV}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Suspended', value: suspendedStudents.length, color: 'var(--danger)', icon: <UserX size={24} /> },
          { label: 'Pending Reviews', value: '3', color: 'var(--warning)', icon: <AlertTriangle size={24} /> },
          { label: 'Recently Reinstated', value: recentlyReinstated, color: 'var(--success)', icon: <Users size={24} /> }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search suspended students..." 
              style={{ paddingLeft: '48px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                backgroundColor: activeFilter !== 'All' ? 'var(--primary-light)' : 'var(--bg-body)', 
                border: '1px solid var(--border-color)',
                color: activeFilter !== 'All' ? 'var(--primary)' : 'inherit',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 700
              }}
            >
              <Filter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                    padding: '8px', zIndex: 100, width: '220px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '8px', textTransform: 'uppercase' }}>Reason</div>
                  {['All', 'Disciplinary Action', 'Low Attendance', 'Academic Probation'].map(f => (
                    <div 
                      key={f}
                      onClick={() => { setActiveFilter(f); setIsFilterOpen(false); }}
                      style={{ 
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        backgroundColor: activeFilter === f ? 'var(--primary-light)' : 'transparent',
                        color: activeFilter === f ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={filteredStudents} 
        loading={loading}
        onView={(row) => navigate(`/dashboard/student-details/${row.student_id}`)}
        onEdit={(row) => navigate(`/dashboard/edit-student/${row.student_id}`)}
        onDelete={(row) => {
          setStudentToReinstate(row);
          setReinstateStep('confirm');
          setReinstateReason('Term Completed');
        }}
      />

      {/* Reinstate Student & Lift Suspension Modal */}
      <AnimatePresence>
        {studentToReinstate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (reinstateStep !== 'processing') setStudentToReinstate(null);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {reinstateStep === 'confirm' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserX size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Lift Suspension</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reinstate student active privileges</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setStudentToReinstate(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Warning Info */}
                  <div style={{ 
                    padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '16px', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '24px', display: 'flex', gap: '12px'
                  }}>
                    <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Authorize Restoration</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        You are about to lift the suspension for <strong>{studentToReinstate.name}</strong> (ID: #{studentToReinstate.student_id}). This will reinstate full access to classrooms, learning modules, and active academic registers.
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>REINSTATEMENT GROUNDS</label>
                      <select 
                        className="form-input" 
                        value={reinstateReason} 
                        onChange={(e) => setReinstateReason(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      >
                        <option value="Term Completed">Suspension Term Completed</option>
                        <option value="Good Behavior">Exemplary Behavioral Review</option>
                        <option value="Administrative Pardon">Administrative Pardon / Appeal Approved</option>
                        <option value="Inaccurate Charge">Correction of Registry Record</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setStudentToReinstate(null)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleConfirmReinstate}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--success)', 
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <CircleCheck size={16} /> Authorize Restoration
                    </button>
                  </div>
                </div>
              )}

              {reinstateStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--success)', borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--success)' }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Restoring Registry Status</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{reinstateMsg}</p>
                </div>
              )}

              {reinstateStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Suspension Lifted</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{studentToReinstate.name}</strong> has been successfully reinstated. All institutional accesses are fully active.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setStudentToReinstate(null);
                      // Reset state
                      setTimeout(() => {
                        setReinstateStep('confirm');
                        setReinstateReason('Term Completed');
                      }, 300);
                    }}
                    style={{ width: '100%', backgroundColor: 'var(--success)', border: 'none', color: 'white' }}
                  >
                    Return to List
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuspendedStudents;
