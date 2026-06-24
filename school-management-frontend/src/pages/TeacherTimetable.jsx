import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Printer, Download, Clock, MapPin, Users, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeachers } from '../services/service';

const TeacherTimetable = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [teacherName, setTeacherName] = useState('Dr. Eleanor Pena');
  const [teacherRole, setTeacherRole] = useState('Senior Physics Instructor');
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4000);
  };

  useEffect(() => {
    const loadTimetableData = async () => {
      let data = [];
      try {
        data = await getTeachers();
      } catch (e) {
        console.warn("Backend API offline, utilizing fallback cache/mock data");
      }
      
      let list = [];
      if (data && data.length > 0) {
        list = data.map(t => ({
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
        localStorage.setItem('teachers', JSON.stringify(list));
      } else {
        const stored = localStorage.getItem('teachers');
        if (stored) {
          list = JSON.parse(stored);
        }
      }
      
      const record = list.find(t => t.id === id);
      if (record) {
        if (typeof record.documents === 'string') {
          try {
            record.documents = JSON.parse(record.documents);
          } catch (e) {
            record.documents = [];
          }
        } else if (!record.documents) {
          record.documents = [];
        }
        setTeacherName(record.fullName || record.name);
        setTeacherRole(record.designation || `${record.subject || 'Faculty'} Instructor`);
      }
    };
    
    loadTimetableData();
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastViewedTeacherId', id);
    }
  }, [id]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00 AM - 08:45 AM',
    '09:00 AM - 09:45 AM',
    '10:00 AM - 10:45 AM',
    '11:00 AM - 11:45 AM',
    '12:00 PM - 12:45 PM',
    '01:45 PM - 02:30 PM',
    '02:45 PM - 03:30 PM',
  ];

  // Mock schedule data
  const schedule = {
    'Monday': { '09:00 AM - 09:45 AM': { sub: 'Physics', class: '10A', room: 'Lab 3' }, '11:00 AM - 11:45 AM': { sub: 'Physics', class: '11B', room: 'Room 204' } },
    'Tuesday': { '08:00 AM - 08:45 AM': { sub: 'Adv. Physics', class: '12A', room: 'Lab 1' }, '10:00 AM - 10:45 AM': { sub: 'Physics', class: '10A', room: 'Lab 3' } },
    'Wednesday': { '09:00 AM - 09:45 AM': { sub: 'Physics', class: '11B', room: 'Room 204' }, '12:00 PM - 12:45 PM': { sub: 'Adv. Physics', class: '12A', room: 'Lab 1' } },
    'Thursday': { '08:00 AM - 08:45 AM': { sub: 'Physics', class: '10A', room: 'Lab 3' }, '11:00 AM - 11:45 AM': { sub: 'Physics', class: '11B', room: 'Room 204' } },
    'Friday': { '10:00 AM - 10:45 AM': { sub: 'Adv. Physics', class: '12A', room: 'Lab 1' }, '02:45 PM - 03:30 PM': { sub: 'Practical', class: '11A', room: 'Lab 2' } },
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header row
    const headers = ["Time Slot", ...days];
    csvContent += headers.map(h => `"${h}"`).join(",") + "\n";
    
    // Body rows
    timeSlots.forEach(slot => {
      const row = [slot];
      days.forEach(day => {
        const entry = schedule[day]?.[slot];
        if (entry) {
          row.push(`${entry.sub} (Class ${entry.class}, ${entry.room})`);
        } else {
          row.push("FREE SLOT");
        }
      });
      csvContent += row.map(r => `"${r}"`).join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `${teacherName.replace(/\s+/g, '_')}_Timetable.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Spreadsheet timetable successfully exported!");
  };

  const exportToPDF = () => {
    showToast("Preparing PDF layout... Choose 'Save as PDF' as destination.");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div id="printable-timetable-layout">
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="btn no-print" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 700, padding: 0, background: 'none', marginBottom: '12px', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} /> Back to Faculty Profile
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>Faculty Academic Timetable</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>Weekly schedule for <strong>{teacherName}</strong> ({teacherRole})</p>
        </div>
        
        {/* Actions bar */}
        <div className="no-print" style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={exportToCSV}
            className="btn" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px',
              color: 'var(--text-main)', 
              fontWeight: 900, 
              padding: '10px 20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Export to Spreadsheet (CSV)"
          >
             <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={exportToPDF}
            className="btn" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px',
              color: 'var(--text-main)', 
              fontWeight: 900, 
              padding: '10px 20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Save as PDF via Print"
          >
             <FileText size={18} /> Export PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Printer size={18} /> Print Schedule
          </button>
        </div>
      </div>

      {/* Timetable Grid Card */}
      <div className="card" style={{ padding: '0', overflowX: 'auto', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--bg-card)' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
               <tr style={{ backgroundColor: 'var(--bg-body)' }}>
                  <th style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', width: '180px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 900, textAlign: 'left' }}>TIME SLOT</th>
                  {days.map(day => (
                    <th key={day} style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 900, textAlign: 'center' }}>{day.toUpperCase()}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {timeSlots.map((slot, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                     <td style={{ padding: '20px', backgroundColor: 'var(--bg-body)', fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> {slot}</div>
                     </td>
                     {days.map(day => {
                       const entry = schedule[day]?.[slot];
                       return (
                         <td key={day} style={{ padding: '12px', minWidth: '150px' }}>
                            {entry ? (
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                style={{ 
                                  padding: '16px', borderRadius: '16px', backgroundColor: 'var(--primary-light)', 
                                  borderLeft: '4px solid var(--primary)', cursor: 'pointer'
                                }}
                              >
                                 <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>{entry.sub}</div>
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)' }}>
                                       <Users size={12} /> Class {entry.class}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                                       <MapPin size={12} /> {entry.room}
                                    </div>
                                 </div>
                              </motion.div>
                            ) : (
                              <div style={{ height: '80px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                                 FREE SLOT
                              </div>
                            )}
                         </td>
                       );
                     })}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 1100,
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)', borderRadius: '16px', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '5px solid var(--success)'
            }}
          >
            <CheckCircle2 size={20} color="var(--success)" />
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Printing & CSS isolation styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-timetable-layout, #printable-timetable-layout * {
            visibility: visible !important;
          }
          #printable-timetable-layout {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 24px !important;
            margin: 0 !important;
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: avoid !important;
          }
          th, td {
            border: 1px solid #CBD5E1 !important;
            padding: 8px !important;
            font-size: 0.75rem !important;
            color: black !important;
            background-color: white !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherTimetable;
