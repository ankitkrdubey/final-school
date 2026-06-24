import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, GraduationCap, Mail, Phone, 
  ChevronRight, MoreVertical, Star, ShieldCheck,
  MapPin, Clock, BookOpen, UserPlus, Grid, List, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTeachers } from '../services/service';

const TeacherInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachersData = async () => {
      let data = [];
      try {
        data = await getTeachers();
      } catch (e) {
        console.warn("Backend API offline, utilizing fallback cache/mock data");
      }

      const storedVersion = localStorage.getItem('teachers_version');
      if (storedVersion !== '2026-v5') {
        localStorage.removeItem('teachers');
        localStorage.setItem('teachers_version', '2026-v5');
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
        localStorage.setItem('teachers', JSON.stringify(parsed));
        setTeachers(parsed);
      } else {
        const stored = localStorage.getItem('teachers');
        if (stored) {
          setTeachers(JSON.parse(stored));
        } else {
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
              bloodGroup: 'A+', height: '165', weight: '60', bankAccount: '123456789012', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52365', prevSchoolName: 'Chicago Public School', prevSchoolAddress: 'Chicago, IL', facebook: 'https://facebook.com/eleanor', linkedin: 'https://linkedin.com/in/eleanor',
              exp: '12 yrs'
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
              bloodGroup: 'B+', height: '178', weight: '75', bankAccount: '123456789013', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52366', prevSchoolName: 'Seattle Academy', prevSchoolAddress: 'Seattle, WA', facebook: 'https://facebook.com/robert', linkedin: 'https://linkedin.com/in/robert',
              exp: '8 yrs'
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
              bloodGroup: 'O+', height: '160', weight: '54', bankAccount: '123456789014', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52367', prevSchoolName: 'Boston High School', prevSchoolAddress: 'Boston, MA', facebook: 'https://facebook.com/jane', linkedin: 'https://linkedin.com/in/jane',
              exp: '15 yrs'
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
              bloodGroup: 'AB+', height: '182', weight: '80', bankAccount: '123456789015', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52368', prevSchoolName: 'Denver Science School', prevSchoolAddress: 'Denver, CO', facebook: 'https://facebook.com/wade', linkedin: 'https://linkedin.com/in/wade',
              exp: '6 yrs'
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
              bloodGroup: 'O-', height: '162', weight: '58', bankAccount: '123456789017', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52370', prevSchoolName: 'Atlanta High', prevSchoolAddress: 'Atlanta, GA', facebook: 'https://facebook.com/brooklyn', linkedin: 'https://linkedin.com/in/brooklyn',
              exp: '4 yrs'
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
              bloodGroup: 'B-', height: '180', weight: '77', bankAccount: '123456789018', bankName: 'Global Institutional Bank', ifscCode: 'GIB000123', nationalId: 'NAT-52371', prevSchoolName: 'Silicon Valley Prep', prevSchoolAddress: 'San Jose, CA', facebook: 'https://facebook.com/guy', linkedin: 'https://linkedin.com/in/guy',
              exp: '10 yrs'
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
          localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
          setTeachers(defaultTeachers);
        }
      }
    };
    fetchTeachersData();
  }, []);

  const handlePhotoUpload = (e, teacherId) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const stored = localStorage.getItem('teachers');
        if (stored) {
          let list = JSON.parse(stored);
          list = list.map(t => {
            if (t.id === teacherId) {
              return { ...t, avatar: reader.result, img: reader.result };
            }
            return t;
          });
          localStorage.setItem('teachers', JSON.stringify(list));
          setTeachers(list);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    (filterSubject === 'All' || t.dept === filterSubject || (filterSubject === 'IT' && t.dept === 'Technology & Computing')) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ paddingBottom: '40px' }}>
      <style>{`
        .avatar-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border-radius: 16px;
          border: 4px solid white;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          z-index: 10;
        }
        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }
      `}</style>

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
         <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Faculty Information Hub</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Detailed visual overview of institutional teaching staff.</p>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={() => navigate('/dashboard/teachers')} style={{ backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
               <List size={18} /> Table View
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/add-teacher')} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
               <UserPlus size={18} /> Add New Faculty
            </button>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="search-bar" style={{ width: '300px' }}>
               <Search size={18} className="text-muted" />
               <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  className="search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <select 
              className="form-input" 
              style={{ width: '180px', marginBottom: 0 }}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
               <option value="All">All Departments</option>
               <option value="Science">Science</option>
               <option value="Math">Mathematics</option>
               <option value="Arts">Arts</option>
               <option value="IT">IT</option>
            </select>
         </div>
         <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
            Showing {filteredTeachers.length} results
         </div>
      </div>

      {/* Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
         {filteredTeachers.map((t, i) => (
           <motion.div 
             key={t.id}
             whileHover={{ y: -8 }}
             className="card"
             style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
             onClick={() => navigate(`/dashboard/teacher-details/${t.id}`)}
           >
              <div style={{ height: '80px', backgroundColor: t.color || 'var(--primary-light)', position: 'relative' }}>
                 <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900,
                      backgroundColor: t.status === 'Active' ? '#10B98120' : '#F59E0B20',
                      color: t.status === 'Active' ? '#10B981' : '#F59E0B',
                      border: `1px solid ${t.status === 'Active' ? '#10B981' : '#F59E0B'}40`
                    }}>
                      {(t.status || 'Active').toUpperCase()}
                    </span>
                 </div>
              </div>
              <div style={{ padding: '0 24px 24px 24px', marginTop: '-40px', textAlign: 'center' }}>
                 <div className="avatar-container" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="file" 
                      id={`file-input-${t.id}`} 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(e, t.id)}
                    />
                    <img 
                      src={t.avatar || t.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} 
                      alt={t.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`;
                      }}
                      style={{ width: '80px', height: '80px', borderRadius: '16px', border: '4px solid white', boxShadow: 'var(--shadow-sm)', objectFit: 'cover' }} 
                    />
                    <div 
                      className="avatar-overlay" 
                      onClick={() => document.getElementById(`file-input-${t.id}`).click()}
                      title="Update Profile Picture"
                    >
                       <Camera size={18} color="white" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', right: '-4px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', zIndex: 11 }}>
                       <ShieldCheck size={14} color="var(--primary)" />
                    </div>
                 </div>
                 
                 <h3 style={{ margin: '16px 0 4px 0', fontSize: '1.1rem', fontWeight: 900 }}>{t.name}</h3>
                 <p style={{ margin: '0 0 16px 0', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800 }}>{t.subject}</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                       <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Experience</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{t.experience || t.exp || '8 yrs'}</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                       <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" /> {t.rating || 4.8}
                       </div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <Mail size={14} /> {t.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <Clock size={14} /> Available: 09:00 - 15:00
                    </div>
                 </div>

                 <button className="btn" style={{ width: '100%', marginTop: '24px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    VIEW FULL PROFILE <ChevronRight size={16} />
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
};

export default TeacherInfo;
