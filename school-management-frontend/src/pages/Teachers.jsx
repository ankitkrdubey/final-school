import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Mail, Phone, 
  Edit, Trash2, MoreVertical, Star,
  Download, ChevronLeft, ChevronRight, CircleCheck, CircleX,
  Eye, GraduationCap, Calendar, ListFilter, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTeachers, deleteTeacher } from '../services/service';

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // High Fidelity Mock Data Registry
  const defaultTeachers = [
    { 
      id: 'AD52365', 
      teacherId: 'AD52365',
      name: 'Eleanor Pena', 
      fullName: 'Eleanor Pena', 
      subject: 'Mathematics', 
      class: '1(A), 2(A), 3(A)', 
      email: 'eleanor.p@edupro.com', 
      phone: '+1 234 567 890', 
      joinDate: '2024-01-12', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 
      color: '#4880FF',
      designation: 'Senior Mathematics Instructor',
      dept: 'Science & Research',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1985-05-12',
      maritalStatus: 'Married',
      fatherName: 'Robert Pena',
      motherName: 'Sarah Pena',
      experience: '12 Years',
      qualification: 'Ph.D. in Mathematics',
      currentAddress: '724 Oakmound Road, Chicago, IL',
      permanentAddress: '724 Oakmound Road, Chicago, IL',
      details: 'Dedicated mathematics educator with over a decade of experience in teaching theoretical and applied mathematical concepts.',
      bloodGroup: 'A+', height: '165', weight: '60', bankAccount: '123456789012', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52365', prevSchoolName: 'Chicago Public School', prevSchoolAddress: 'Chicago, IL', facebook: 'https://facebook.com/eleanor', linkedin: 'https://linkedin.com/in/eleanor'
    },
    { 
      id: 'AD52366', 
      teacherId: 'AD52366',
      name: 'Robert Fox', 
      fullName: 'Robert Fox', 
      subject: 'Physics', 
      class: '4(B), 5(A)', 
      email: 'robert.f@edupro.com', 
      phone: '+1 234 567 891', 
      joinDate: '2024-02-15', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 
      color: '#10B981',
      designation: 'Physics Lecturer',
      dept: 'Science & Research',
      rating: 4.8,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1988-08-20',
      maritalStatus: 'Married',
      fatherName: 'John Fox',
      motherName: 'Emma Fox',
      experience: '8 Years',
      qualification: 'M.Sc. in Physics',
      currentAddress: '831 Maple Avenue, Seattle, WA',
      permanentAddress: '831 Maple Avenue, Seattle, WA',
      details: 'Enthusiastic physics teacher specializing in thermodynamics and electromagnetism experiments.',
      bloodGroup: 'B+', height: '178', weight: '75', bankAccount: '123456789013', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52366', prevSchoolName: 'Seattle Academy', prevSchoolAddress: 'Seattle, WA', facebook: 'https://facebook.com/robert', linkedin: 'https://linkedin.com/in/robert'
    },
    { 
      id: 'AD52367', 
      teacherId: 'AD52367',
      name: 'Jane Cooper', 
      fullName: 'Jane Cooper', 
      subject: 'English', 
      class: '10(A), 11(A)', 
      email: 'jane.c@edupro.com', 
      phone: '+1 234 567 892', 
      joinDate: '2024-03-20', 
      status: 'Inactive', 
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop', 
      color: '#F59E0B',
      designation: 'Head of English Dept.',
      dept: 'Humanities & Languages',
      rating: 4.7,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1982-11-04',
      maritalStatus: 'Married',
      fatherName: 'Arthur Cooper',
      motherName: 'Grace Cooper',
      experience: '15 Years',
      qualification: 'Ph.D. in English Literature',
      currentAddress: '241 Pine Drive, Boston, MA',
      permanentAddress: '241 Pine Drive, Boston, MA',
      details: 'Expert in classical literature and academic writing instruction.',
      bloodGroup: 'O+', height: '160', weight: '54', bankAccount: '123456789014', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52367', prevSchoolName: 'Boston High School', prevSchoolAddress: 'Boston, MA', facebook: 'https://facebook.com/jane', linkedin: 'https://linkedin.com/in/jane'
    },
    { 
      id: 'AD52368', 
      teacherId: 'AD52368',
      name: 'Wade Warren', 
      fullName: 'Wade Warren', 
      subject: 'Chemistry', 
      class: '9(C), 12(A)', 
      email: 'wade.w@edupro.com', 
      phone: '+1 234 567 893', 
      joinDate: '2024-04-05', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', 
      color: '#8B5CF6',
      designation: 'Chemistry Instructor',
      dept: 'Science & Research',
      rating: 4.6,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1990-03-15',
      maritalStatus: 'Unmarried',
      fatherName: 'David Warren',
      motherName: 'Lucy Warren',
      experience: '6 Years',
      qualification: 'M.Sc. in Organic Chemistry',
      currentAddress: '902 Elm Street, Denver, CO',
      permanentAddress: '902 Elm Street, Denver, CO',
      details: 'Passionate about chemical reactions, safety in labs, and organic science modules.',
      bloodGroup: 'AB+', height: '182', weight: '80', bankAccount: '123456789015', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52368', prevSchoolName: 'Denver Science School', prevSchoolAddress: 'Denver, CO', facebook: 'https://facebook.com/wade', linkedin: 'https://linkedin.com/in/wade'
    },
    { 
      id: 'AD52369', 
      teacherId: 'AD52369',
      name: 'Cameron Williamson', 
      fullName: 'Cameron Williamson', 
      subject: 'History', 
      class: '6(A), 7(B)', 
      email: 'cameron.w@edupro.com', 
      phone: '+1 234 567 894', 
      joinDate: '2024-05-10', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop', 
      color: '#EF4444',
      designation: 'Associate Professor',
      dept: 'Humanities & Languages',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1979-09-25',
      maritalStatus: 'Married',
      fatherName: 'Richard Williamson',
      motherName: 'Nora Williamson',
      experience: '20 Years',
      qualification: 'Ph.D. in World History',
      currentAddress: '556 Cedar Road, Austin, TX',
      permanentAddress: '556 Cedar Road, Austin, TX',
      details: 'Specializes in World War histories, ancient civilizations, and modern political history.',
      bloodGroup: 'A-', height: '175', weight: '70', bankAccount: '123456789016', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52369', prevSchoolName: 'Texas Prep', prevSchoolAddress: 'Austin, TX', facebook: 'https://facebook.com/cameron', linkedin: 'https://linkedin.com/in/cameron'
    },
    { 
      id: 'AD52370', 
      teacherId: 'AD52370',
      name: 'Brooklyn Simmons', 
      fullName: 'Brooklyn Simmons', 
      subject: 'Biology', 
      class: '8(A), 9(B)', 
      email: 'brooklyn.s@edupro.com', 
      phone: '+1 234 567 895', 
      joinDate: '2024-06-22', 
      status: 'Inactive', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', 
      color: '#4880FF',
      designation: 'Biology Instructor',
      dept: 'Science & Research',
      rating: 4.5,
      contractType: 'Contractual',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1992-12-12',
      maritalStatus: 'Unmarried',
      fatherName: 'Michael Simmons',
      motherName: 'Chloe Simmons',
      experience: '4 Years',
      qualification: 'M.Sc. in Botany',
      currentAddress: '312 Birch Way, Atlanta, GA',
      permanentAddress: '312 Birch Way, Atlanta, GA',
      details: 'Enjoys teaching plant biology, environmental science, and ecological conservations.',
      bloodGroup: 'O-', height: '162', weight: '58', bankAccount: '123456789017', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52370', prevSchoolName: 'Atlanta High', prevSchoolAddress: 'Atlanta, GA', facebook: 'https://facebook.com/brooklyn', linkedin: 'https://linkedin.com/in/brooklyn'
    },
    { 
      id: 'AD52371', 
      teacherId: 'AD52371',
      name: 'Guy Hawkins', 
      fullName: 'Guy Hawkins', 
      subject: 'Computer Science', 
      class: '11(B), 12(B)', 
      email: 'guy.h@edupro.com', 
      phone: '+1 234 567 896', 
      joinDate: '2024-07-15', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', 
      color: '#10B981',
      designation: 'IT & CS Lead Instructor',
      dept: 'Technology & Computing',
      rating: 4.9,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Male',
      dob: '1986-06-30',
      maritalStatus: 'Married',
      fatherName: 'William Hawkins',
      motherName: 'Sophia Hawkins',
      experience: '10 Years',
      qualification: 'Ph.D. in Computer Science',
      currentAddress: '404 Syntax Drive, San Jose, CA',
      permanentAddress: '404 Syntax Drive, San Jose, CA',
      details: 'Passionate about coding, algorithms, full-stack web development, and artificial intelligence.',
      bloodGroup: 'B-', height: '180', weight: '77', bankAccount: '123456789018', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52371', prevSchoolName: 'Silicon Valley Prep', prevSchoolAddress: 'San Jose, CA', facebook: 'https://facebook.com/guy', linkedin: 'https://linkedin.com/in/guy'
    },
    { 
      id: 'AD52372', 
      teacherId: 'AD52372',
      name: 'Theresa Webb', 
      fullName: 'Theresa Webb', 
      subject: 'Geography', 
      class: '5(B), 6(C)', 
      email: 'theresa.w@edupro.com', 
      phone: '+1 234 567 897', 
      joinDate: '2024-08-30', 
      status: 'Active', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', 
      color: '#F59E0B',
      designation: 'Geography Instructor',
      dept: 'Humanities & Languages',
      rating: 4.7,
      contractType: 'Permanent',
      shift: 'Day Shift',
      gender: 'Female',
      dob: '1984-04-18',
      maritalStatus: 'Married',
      fatherName: 'Donald Webb',
      motherName: 'Lisa Webb',
      experience: '11 Years',
      qualification: 'M.A. in Geography',
      currentAddress: '778 Horizon Boulevard, Phoenix, AZ',
      permanentAddress: '778 Horizon Boulevard, Phoenix, AZ',
      details: 'Engages students with geographic information systems (GIS) and map reading modules.',
      bloodGroup: 'O+', height: '168', weight: '62', bankAccount: '123456789019', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52372', prevSchoolName: 'Arizona Academy', prevSchoolAddress: 'Phoenix, AZ', facebook: 'https://facebook.com/theresa', linkedin: 'https://linkedin.com/in/theresa'
    }
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        let data = [];
        try {
          data = await getTeachers();
        } catch (e) {
          console.warn("Backend API offline, utilizing fallback cache/mock data");
        }
        
        if (data && data.length > 0) {
          const parsed = data.map(t => ({
            ...t,
            id: t.teacher_id || `AD${t.id}`,
            teacherId: t.teacher_id || `AD${t.id}`,
            name: t.name,
            fullName: t.name || t.fullName,
            subject: t.subject || 'Faculty',
            class: t.class || 'N/A',
            email: t.email,
            phone: t.phone || 'N/A',
            joinDate: t.joinDate || t.admission_date || t.created_at || new Date().toISOString(),
            status: t.status || 'Active',
            avatar: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`,
            color: t.color || '#4880FF',
            dob: t.dob || '',
            gender: t.gender || '',
            currentAddress: t.address || t.currentAddress || '',
            permanentAddress: t.permanentAddress || t.address || '',
            bloodGroup: t.blood_group || t.bloodGroup || '',
            qualification: t.qualification || '',
            experience: t.experience || '',
            details: t.details || '',
            documents: (() => {
              if (!t.documents) return [];
              if (typeof t.documents === 'string') {
                try {
                  return JSON.parse(t.documents);
                } catch (e) {
                  return [];
                }
              }
              return Array.isArray(t.documents) ? t.documents : [];
            })()
          }));
          setTeachers(parsed);
          localStorage.setItem('teachers', JSON.stringify(parsed));
        } else {
          const stored = localStorage.getItem('teachers');
          if (stored) {
            setTeachers(JSON.parse(stored));
          } else {
            localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
            setTeachers(defaultTeachers);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const saveToStorage = (updatedList) => {
    localStorage.setItem('teachers', JSON.stringify(updatedList));
    setTeachers(updatedList);
  };

  const toggleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(t => t.id));
    }
  };

  const toggleSelectTeacher = (id) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter(tid => tid !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  // Deletion logic
  const confirmDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    try {
      await deleteTeacher(teacherToDelete.id);
    } catch (e) {
      console.warn("Backend API delete failed/offline, using local fallback deletion");
    }
    const updated = teachers.filter(t => t.id !== teacherToDelete.id);
    saveToStorage(updated);
    setSelectedTeachers(selectedTeachers.filter(id => id !== teacherToDelete.id));
    setTeacherToDelete(null);
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedTeachers.length} selected teachers?`)) {
      for (const tid of selectedTeachers) {
        try {
          await deleteTeacher(tid);
        } catch (e) {
          console.warn(`Backend API delete failed/offline for ${tid}`);
        }
      }
      const updated = teachers.filter(t => !selectedTeachers.includes(t.id));
      saveToStorage(updated);
      setSelectedTeachers([]);
    }
  };

  const handleBulkStatusChange = (status) => {
    const updated = teachers.map(t => {
      if (selectedTeachers.includes(t.id)) {
        return { ...t, status };
      }
      return t;
    });
    saveToStorage(updated);
    setSelectedTeachers([]);
  };

  // Filters & Search
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || t.subject === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // True Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTeachers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const exportToCSV = () => {
    const headers = ['Teacher ID', 'Name', 'Subject', 'Class', 'Email', 'Phone', 'Join Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTeachers.map(t => [
        t.id,
        `"${t.name}"`,
        t.subject,
        `"${t.class}"`,
        t.email,
        t.phone,
        t.joinDate,
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `teachers_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}
    >
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Teacher List</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
             Dashboard / Teacher / <span style={{ color: 'var(--primary)' }}>Teacher List</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/add-teacher')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: 800 }}>
          <UserPlus size={18} /> Add New Teacher
        </button>
      </div>

      {/* Table Container Card */}
      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Table Top Actions */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-body)', width: '300px', fontSize: '0.9rem', fontWeight: 600, outline: 'none'
                  }} 
                />
             </div>
             <div style={{ position: 'relative' }}>
                <button 
                  className="btn" 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: activeFilter !== 'All' ? 'var(--primary-light)' : 'var(--bg-body)', 
                    border: '1px solid var(--border-color)', 
                    color: activeFilter !== 'All' ? 'var(--primary)' : 'inherit',
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    fontWeight: 700 
                  }}
                >
                   <ListFilter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ 
                        position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                        backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                        padding: '8px', zIndex: 100, width: '200px'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '8px', textTransform: 'uppercase' }}>Subject</div>
                      {['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Geography', 'Computer Science'].map(f => (
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <button 
               className="btn" 
               onClick={exportToCSV}
               style={{ padding: '12px 20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
             >
                <Download size={18} /> Export CSV
             </button>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Show:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 700, outline: 'none' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
             </div>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px' }}>
                   <input 
                     type="checkbox" 
                     checked={selectedTeachers.length === filteredTeachers.length && filteredTeachers.length > 0} 
                     onChange={toggleSelectAll} 
                     style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                   />
                </th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Class</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Number</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Join Date</th>
                <th style={{ padding: '16px 12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td colSpan="10" style={{ padding: '24px', textAlign: 'center' }}>
                         <div style={{ height: '40px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
                      </td>
                    </tr>
                  ))
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                      No faculty records found.
                    </td>
                  </tr>
                ) : currentRows.map((teacher, idx) => (
                  <motion.tr 
                    key={teacher.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s', backgroundColor: selectedTeachers.includes(teacher.id) ? 'var(--primary-light)' : 'transparent' }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                       <input type="checkbox" checked={selectedTeachers.includes(teacher.id)} onChange={() => toggleSelectTeacher(teacher.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '16px 12px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{teacher.id}</td>
                    <td style={{ padding: '16px 12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${teacher.color}15`, 
                            color: teacher.color, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '0.9rem', fontWeight: 900, overflow: 'hidden'
                          }}>
                            <img 
                              src={teacher.avatar && (teacher.avatar.startsWith('data:') || teacher.avatar.startsWith('http') || teacher.avatar.startsWith('/') || teacher.avatar.startsWith('.')) ? teacher.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} 
                              alt={teacher.name} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`;
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{teacher.name}</span>
                       </div>
                    </td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem' }}>{teacher.subject}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{teacher.class}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem' }}>{teacher.email}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem' }}>{teacher.phone}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                       <span style={{ 
                         padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                         backgroundColor: teacher.status === 'Active' ? 'var(--success-light)' : 'var(--danger-light)',
                         color: teacher.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                       }}>
                         {teacher.status}
                       </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => navigate(`/dashboard/teacher-details/${teacher.id}`)} className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', color: 'var(--primary)' }} title="View Profile">
                             <Eye size={16} />
                          </button>
                          <button onClick={() => navigate(`/dashboard/edit-teacher/${teacher.id}`)} className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', color: 'var(--success)' }} title="Edit">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => confirmDeleteTeacher(teacher)} className="btn-icon" style={{ backgroundColor: 'var(--bg-body)', color: 'var(--danger)' }} title="Delete">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Bottom / Pagination */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredTeachers.length > 0 ? indexOfFirstRow + 1 : 0} to {Math.min(indexOfLastRow, filteredTeachers.length)} of {filteredTeachers.length} entries
           </div>
           <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="btn-icon" 
                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className="btn" 
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: currentPage === idx + 1 ? 'var(--primary)' : 'var(--bg-body)', 
                    color: currentPage === idx + 1 ? 'white' : 'var(--text-muted)', 
                    border: currentPage === idx + 1 ? 'none' : '1px solid var(--border-color)', 
                    fontWeight: 800 
                  }}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn-icon" 
                style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedTeachers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99,
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '16px 32px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              color: '#1f2937'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{selectedTeachers.length} Faculty Selected</span>
            </div>
            
            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleBulkStatusChange('Active')}
                className="btn" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 800 }}
              >
                Mark Active
              </button>
              <button 
                onClick={() => handleBulkStatusChange('Inactive')}
                className="btn" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)', fontWeight: 800 }}
              >
                Mark Inactive
              </button>
              <button 
                onClick={handleBulkDelete}
                className="btn" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 800 }}
              >
                Bulk Delete
              </button>
              <button 
                onClick={() => setSelectedTeachers([])}
                className="btn" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', fontWeight: 700 }}
              >
                Deselect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Delete Confirmation Modal */}
      <AnimatePresence>
        {teacherToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '32px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                padding: '32px',
                textAlign: 'center',
                color: '#1f2937'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '24px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                margin: '0 auto 24px'
              }}>
                <AlertTriangle size={32} />
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 8px 0', color: '#1f2937' }}>Delete Faculty Record?</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 32px 0' }}>
                You are about to permanently delete the profile of <strong style={{ color: '#111827' }}>{teacherToDelete.name}</strong> (ID: {teacherToDelete.id}). This action is irreversible and clears all institutional ledger associations.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setTeacherToDelete(null)}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    color: '#4b5563',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '16px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    fontWeight: 900,
                    boxShadow: '0 10px 20px rgba(239, 68, 68, 0.25)',
                    cursor: 'pointer'
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Teachers;
