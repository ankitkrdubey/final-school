import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, FileText, CircleCheck, Clock, Award, Bell, Calendar as CalendarIcon, 
  MoreVertical, Edit, User, Activity, Megaphone, AlertCircle, Info,
  CheckCircle2, X, Sparkles, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import studentAvatar from '../assets/student_avatar.png';
import { getStudents, AttendanceApi, FeesApi } from '../services/service';

const fallbackStudent = {
  student_id: '1',
  name: 'Devon Lane',
  email: 'devon.lane@edupro.edu',
  phone: '+1 234 567 891',
  class_id: 10,
  section: 'A',
  dob: '2010-02-15',
  gender: 'Male',
  address: '789 School Rd, NY',
  blood_group: 'B+',
  admission_date: '2026-09-01',
  avatar: null
};

const notices = [
  { title: 'Annual Science Fair 2026', content: 'The Annual Science Fair is scheduled for next week. All participating students must submit their project abstracts by Friday at 5 PM.', type: 'event', created_at: new Date().toISOString() },
  { title: 'Severe Weather Warning', content: 'Due to expected heavy snowfall, all after-school activities for tomorrow have been cancelled. Please monitor this board for school closure updates.', type: 'alert', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'System Maintenance Window', content: 'The school learning management system (LMS) will undergo scheduled maintenance this Sunday from 2 AM to 4 AM. Please save your work.', type: 'info', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'Guest Lecture: AI in Healthcare', content: 'Dr. Alan Turing Jr. will be giving a guest lecture in the main auditorium this Thursday. Attendance is mandatory for computer science students.', type: 'general', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'Library Book Returns', content: 'A reminder that all books checked out before the spring break must be returned by the end of this week to avoid late fees.', type: 'info', created_at: new Date(Date.now() - 345600000).toISOString() },
];

const renderAIReport = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  
  const cleanBold = (str) => {
    return str.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  const parseInlineStyles = (str) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ fontWeight: 800, color: 'var(--primary)' }}>{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed === '') {
      return;
    }
    
    // Horizontal Rule
    if (trimmed === '---') {
      elements.push(<div key={`hr-${index}`} style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)', margin: '20px 0' }} />);
      return;
    }
    
    // Headings
    if (trimmed.startsWith('### ')) {
      const title = trimmed.replace('### ', '');
      elements.push(
        <h3 key={`h3-${index}`} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '24px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          {cleanBold(title)}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('#### ')) {
      const title = trimmed.replace('#### ', '');
      elements.push(
        <h4 key={`h4-${index}`} style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', margin: '20px 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
          {cleanBold(title)}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('##### ')) {
      const title = trimmed.replace('##### ', '');
      elements.push(
        <h5 key={`h5-${index}`} style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '16px 0 8px 0' }}>
          {cleanBold(title)}
        </h5>
      );
      return;
    }
    
    // Bullet lists starting with '* ' or '- '
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      elements.push(
        <div key={`li-${index}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '8px 0', paddingLeft: '8px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '8px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {parseInlineStyles(content)}
          </span>
        </div>
      );
      return;
    }
    
    // Numbered list items starting with '1. ', '2. ', etc.
    const numListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numListMatch) {
      const num = numListMatch[1];
      const content = numListMatch[2];
      elements.push(
        <div key={`num-${index}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: '12px 0', padding: '12px 16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px' }}>{num}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {parseInlineStyles(content)}
          </span>
        </div>
      );
      return;
    }
    
    // Regular paragraph
    elements.push(
      <p key={`p-${index}`} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '8px 0' }}>
        {parseInlineStyles(trimmed)}
      </p>
    );
  });
  
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{elements}</div>;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [examTerm, setExamTerm] = useState('Mid Term');
  const [toast, setToast] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dbAttendance, setDbAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const userName = localStorage.getItem('userName') || 'Student';

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load students, attendance, fees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentData = await getStudents();
        const loggedInRole = localStorage.getItem('userRole');
        const loggedInEmail = localStorage.getItem('userEmail');
        const loggedInName = localStorage.getItem('userName');

        if (studentData && studentData.length > 0) {
          setStudentsList(studentData);
          
          let initialStudent = null;
          if (loggedInRole === 'student') {
            if (loggedInEmail) {
              initialStudent = studentData.find(s => s.email && s.email.toLowerCase() === loggedInEmail.toLowerCase());
            }
            if (!initialStudent && loggedInName) {
              initialStudent = studentData.find(s => s.name && s.name.toLowerCase() === loggedInName.toLowerCase());
            }
          }
          
          if (!initialStudent) {
            initialStudent = studentData[0];
          }
          
          setSelectedStudent(initialStudent);
          localStorage.setItem('userStudentId', initialStudent.student_id);
        } else {
          setStudentsList([fallbackStudent]);
          setSelectedStudent(fallbackStudent);
        }

        const attData = await AttendanceApi.getRecords();
        if (attData) {
          setDbAttendance(attData);
        }
      } catch (err) {
        console.error("Error loading student portal data:", err);
        setStudentsList([fallbackStudent]);
        setSelectedStudent(fallbackStudent);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Student portal loaded successfully.`, 'success', 'Session Authenticated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);

  // Deterministic metrics generator to give rich & realistic data consistent per student ID
  const getStudentMetrics = (student) => {
    if (!student) return { attendancePct: 90, coursesCount: 10, pendingAssignments: 15, examResults: {}, attData: [], gpa: '3.80' };
    const studentId = student.student_id;
    
    // 1. Calculate Attendance from DB
    const studentAttRecords = dbAttendance.filter(a => String(a.student_id) === String(studentId));
    let attendancePct = 90;
    let presentCount = 200;
    let halfDayCount = 30;
    let lateCount = 17;
    let absentCount = 5;
    
    if (studentAttRecords.length > 0) {
      const total = studentAttRecords.length;
      const present = studentAttRecords.filter(r => r.status === 'Present').length;
      const late = studentAttRecords.filter(r => r.status === 'Late').length;
      const halfDay = studentAttRecords.filter(r => r.status === 'Leave' || r.status === 'Late').length;
      const absent = studentAttRecords.filter(r => r.status === 'Absent').length;
      
      presentCount = present;
      lateCount = late;
      halfDayCount = halfDay;
      absentCount = absent;
      
      attendancePct = Math.round(((present + late * 0.7 + halfDay * 0.5) / total) * 100);
    } else {
      const hash = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      attendancePct = 80 + (hash % 19);
      presentCount = Math.round((attendancePct / 100) * 220);
      absentCount = Math.max(2, 220 - presentCount - (hash % 10));
      halfDayCount = hash % 8;
      lateCount = hash % 12;
    }
    
    // 2. Enrolled Courses
    const hashVal = studentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const coursesCount = 7 + (hashVal % 5);
    
    // 3. Pending Assignments
    const pendingAssignments = 2 + (hashVal % 12);
    
    // 4. Exam scores (Mid Term / Final Term)
    const mathMid = 72 + (hashVal % 27);
    const physMid = 70 + ((hashVal + 5) % 29);
    const chemMid = 75 + ((hashVal + 9) % 24);
    const engMid = 80 + ((hashVal + 13) % 19);
    const histMid = 68 + ((hashVal + 19) % 31);
    
    const mathFinal = Math.min(100, mathMid + (hashVal % 4));
    const physFinal = Math.min(100, physMid + ((hashVal + 1) % 5));
    const chemFinal = Math.min(100, chemMid + ((hashVal + 3) % 4));
    const engFinal = Math.min(100, engMid + ((hashVal + 2) % 3));
    const histFinal = Math.min(100, histMid + ((hashVal + 4) % 5));
    
    const examResults = {
      'Mid Term': [
        { subject: 'Math', score: mathMid },
        { subject: 'Physics', score: physMid },
        { subject: 'Chemistry', score: chemMid },
        { subject: 'English', score: engMid },
        { subject: 'History', score: histMid },
      ],
      'Final Term': [
        { subject: 'Math', score: mathFinal },
        { subject: 'Physics', score: physFinal },
        { subject: 'Chemistry', score: chemFinal },
        { subject: 'English', score: engFinal },
        { subject: 'History', score: histFinal },
      ]
    };
    
    const attData = [
      { name: 'Present', value: presentCount, color: 'var(--success)' },
      { name: 'Half Day', value: halfDayCount, color: '#f59e0b' },
      { name: 'Late', value: lateCount, color: 'var(--warning)' },
      { name: 'Absent', value: absentCount, color: 'var(--danger)' },
    ];
    
    const finalScoresSum = mathFinal + physFinal + chemFinal + engFinal + histFinal;
    const gpa = (finalScoresSum / 5 / 25).toFixed(2);
    
    return {
      attendancePct,
      coursesCount,
      pendingAssignments,
      examResults,
      attData,
      gpa
    };
  };

  const handleDownloadReport = (student, metrics) => {
    showToast(`Compiling dynamic academic ledger for ${student.name}...`, "info", "Report Card YTD");
    
    const csvContent = [
      ['Student Report Card Ledger', ''],
      ['Student Name', student.name],
      ['Student ID', student.student_id],
      ['Class Section', `Grade ${student.class_id || 10}-${student.section || 'A'}`],
      ['Email Address', student.email || 'N/A'],
      ['Phone', student.phone || 'N/A'],
      ['Overall Attendance', `${metrics.attendancePct}%`],
      ['Enrolled Courses', metrics.coursesCount],
      ['Pending Assignments', metrics.pendingAssignments],
      ['Cumulative GPA', `${metrics.gpa} YTD`],
      ['', ''],
      ['Subject', `${examTerm} Score`],
      ...metrics.examResults[examTerm].map(e => [e.subject, `${e.score}%`]),
      ['', ''],
      ['Export Date', new Date().toLocaleString()]
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Report_Card_${student.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      showToast("Report Card downloaded successfully.", "success", "Download Complete");
    }, 1200);
  };

  const handleAIAnalysis = (student, metrics) => {
    setIsGeneratingAI(true);
    setIsAIModalOpen(true);
    setAiReport('');
    
    setTimeout(() => {
      const gradesStr = metrics.examResults['Final Term'].map(e => `- **${e.subject}**: ${e.score}% (Grade: ${e.score >= 90 ? 'A+' : e.score >= 80 ? 'A' : e.score >= 70 ? 'B' : 'C'})`).join('\n');
      const report = `### 📊 EduPro AI Academic Analysis
**Student Name**: ${student.name}
**Student ID**: ${student.student_id}
**Academic Stream**: Class ${student.class_id || 10} - Section ${student.section || 'A'}
**Date Generated**: ${new Date().toLocaleDateString()}

---

#### 📈 Current Performance & GPA
* **Cumulative GPA Projection**: **${metrics.gpa} / 4.00**
* **Class Attendance Integrity**: **${metrics.attendancePct}%** (${metrics.attendancePct >= 90 ? 'Excellent class presence.' : 'Requires structural attendance improvements.'})
* **Enrolled Course Count**: **${metrics.coursesCount} active courses**

#### 🏆 Subject Performance Metrics
${gradesStr}

---

#### 🧠 Cognitive Analysis
- **Key Strengths**: Shows remarkable capabilities in logical deduction and systemic analysis (demonstrated by high performance in mathematics and physical sciences). Homework completion rates in these divisions remain close to 100%.
- **Target Areas**: The humanities track (specifically history) shows minor deviation. Conceptual mapping of timelines and structured essay analysis could elevate final term indicators.

#### 🎯 Actionable Recommendations
1. **Analytical Spaced Review**: Dedicate 45 minutes bi-weekly to structured history reviews.
2. **Electromagnetism Practical Lab**: Complete pending assignment units to solidify lab grades.
3. **AI Study Assistant Program**: Set up a custom mock examination roadmap to target final exam targets.`;
      
      setAiReport(report);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const currentStudent = selectedStudent || fallbackStudent;
  const metrics = getStudentMetrics(currentStudent);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading Student Portals...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Student Dashboard</h2>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>Welcome back, {currentStudent.name}! Here's your academic overview.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Dropdown Selector */}
          {localStorage.getItem('userRole') !== 'student' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <User size={16} style={{ color: 'var(--text-muted)' }} />
              <select 
                value={currentStudent.student_id}
                onChange={(e) => {
                  const found = studentsList.find(s => String(s.student_id) === String(e.target.value));
                  if (found) {
                    setSelectedStudent(found);
                    showToast(`Viewing academic profile of ${found.name}`, "info", "Student Switch");
                  }
                }}
                style={{
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                {studentsList.map(stu => (
                  <option key={stu.student_id} value={stu.student_id}>{stu.name}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn" 
            onClick={() => handleAIAnalysis(currentStudent, metrics)}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Tutor
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => handleDownloadReport(currentStudent, metrics)}
          >
            <FileText size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* Master Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        
        {/* ROW 1: Profile & Stats */}
        <motion.div 
          className="card" 
          whileHover={{ y: -4 }}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
          onClick={() => showToast(`${currentStudent.name} - Student ID: #${currentStudent.student_id}. Enrolled in Grade ${currentStudent.class_id || 10}-${currentStudent.section || 'A'}.`, "info", "Student Profile Info")}
        >
          <img src={currentStudent.avatar || studentAvatar} alt={currentStudent.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{currentStudent.name}</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Class {currentStudent.class_id || 10} - Section {currentStudent.section || 'A'}</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Student Profile Editor...", "info", "Profile Access");
              setTimeout(() => navigate(`/dashboard/student-details/${currentStudent.student_id}`), 600);
            }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </motion.div>

        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { 
              title: 'Enrolled Courses', 
              value: metrics.coursesCount, 
              icon: <BookOpen size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast(`${currentStudent.name} is enrolled in Math, Physics, Chemistry, English, History, and ${metrics.coursesCount - 5} other course modules.`, "info", "Enrolled Courses")
            },
            { 
              title: 'Pending Assignments', 
              value: metrics.pendingAssignments, 
              icon: <FileText size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast(`${metrics.pendingAssignments} pending assignments found. Please ensure timelines are maintained.`, "warning", "Pending Assignments")
            },
            { 
              title: 'Overall Attendance', 
              value: `${metrics.attendancePct}%`, 
              icon: <CircleCheck size={24} />, 
              color: 'var(--success)',
              onClick: () => showToast(`Superb presence! ${metrics.attendancePct}% attendance recorded across current term modules.`, "success", "Overall Attendance")
            },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="card" 
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={stat.onClick}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROW 2: Attendance, Exam Results, Today's Classes */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Attendance Overview</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Biometric and class attendance records synchronized with parent portals.", "success", "Attendance Logs")}
            />
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={metrics.attData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {metrics.attData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => showToast(`${currentStudent.name} has ${entry.value} logged units marked as ${entry.name}.`, "info", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {metrics.attData.map((entry, i) => (
               <div 
                 key={i} 
                 onClick={() => showToast(`${currentStudent.name} has ${entry.value} logged units marked as ${entry.name}.`, "info", entry.name)}
                 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
               >
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }}></span>
                 {entry.name}
               </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Exam Results</h3>
            <select 
              value={examTerm}
              onChange={(e) => {
                const val = e.target.value;
                setExamTerm(val);
                showToast(`Switched to ${val} results.`, "info", "Exam Performance");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
            >
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.examResults[examTerm]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
                <Bar 
                  dataKey="score" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32} 
                  onClick={(data) => showToast(`${currentStudent.name} scored ${data.score}% in ${data.subject} during ${examTerm}.`, "success", data.subject)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Today's Classes</h3>
            <span 
              onClick={() => {
                showToast("Opening the full calendar timetable...", "info", "Timetable Access");
                navigate('/dashboard/timetable');
              }}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              View All
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { subject: 'English', time: '09:00 - 09:45', teacher: 'Theresa Webb', color: 'var(--primary)', topic: 'Shakespearean Sonnets & Dramatic Monologues in English Literature' },
              { subject: 'Physics', time: '10:00 - 10:45', teacher: 'Darrell Steward', color: '#f59e0b', topic: 'Thermodynamics: Heat engines, work-energy theorems, and ideal gas cycles' },
              { subject: 'Chemistry', time: '11:15 - 12:00', teacher: 'Jane Cooper', color: 'var(--success)', topic: 'Organic Chemistry nomenclature, synthesis pathways, and laboratory exercises' },
              { subject: 'Accounting', time: '01:00 - 01:45', teacher: 'Eleanor Pena', color: '#6366f1', topic: 'Double-entry ledger balances, journal reconciliations, and cash flow structures' }
            ].map((cls, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => showToast(`${cls.topic}. Room: 104-B. Instructor: ${cls.teacher}`, "info", cls.subject)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '4px', height: '40px', backgroundColor: cls.color, borderRadius: '4px' }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{cls.subject}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.teacher}</p>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{cls.time}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW 3: Notice Board, Calendar & Events, Leave Status */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ margin: 0 }}>Global Notice Board</h3>
            </div>
            <button 
              className="btn" 
              onClick={() => {
                showToast("Redirecting to the global notifications directory...", "info", "Notice Center");
                navigate('/dashboard/notices');
              }}
              style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 800 }}
            >
              View All
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
            {notices.map((notice, i) => {
              let Icon = Megaphone;
              let color = 'var(--primary)';
              if (notice.type === 'alert') { Icon = AlertCircle; color = 'var(--danger)'; }
              else if (notice.type === 'event') { Icon = CalendarIcon; color = '#f59e0b'; }
              else if (notice.type === 'info') { Icon = Info; color = 'var(--secondary)'; }

              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01, translateX: 5 }}
                  onClick={() => showToast(notice.content, notice.type === 'alert' ? 'error' : notice.type === 'event' ? 'warning' : 'info', notice.title)}
                  style={{ 
                    display: 'flex', gap: '16px', padding: '20px', backgroundColor: 'var(--bg-body)', 
                    borderRadius: '16px', borderLeft: `4px solid ${color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{notice.title}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px' }}>
                        {new Date(notice.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {notice.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Upcoming Events</h3>
              <MoreVertical 
                size={18} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                onClick={() => showToast("Daily event timeline and club sessions have been synchronized.", "success", "Timeline Active")}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 { time: '09:00', title: 'Morning Assembly', color: 'var(--primary)', details: 'School prayer, administrative address, and national anthem performance.' },
                 { time: '10:30', title: 'Math Olympiad Prep', color: '#f59e0b', details: 'Advanced coaching session on number theory and mathematical induction in Room 201.' },
                 { time: '12:00', title: 'Lunch Break', color: 'var(--success)', details: 'Cafeteria service. Lunch menu: Grilled chicken salad, cream of tomato, or vegan wraps.' },
                 { time: '13:15', title: 'Science Lab: Physics', color: '#6366f1', details: 'Hands-on practical session testing thermodynamic cycles and heat engine efficiency.' },
                 { time: '15:00', title: 'Football Practice', color: 'var(--danger)', details: 'Team tactical drills and friendly match on the main athletic field.' },
                 { time: '16:30', title: 'Debate Club Meeting', color: 'var(--secondary)', details: 'Weekly debate discussion in Auditorium B. Topic: "Ethics of General Artificial Intelligence".' },
               ].map((h, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ x: 4 }}
                   onClick={() => showToast(h.details, 'info', h.title)}
                   style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                 >
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, width: '40px' }}>{h.time}</div>
                   <div style={{ width: '4px', height: '24px', backgroundColor: h.color, borderRadius: '4px' }}></div>
                   <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700 }}>{h.title}</div>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Leave Status</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Historical leave balances and emergency logs up to date.", "success", "Leave Records")}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { type: 'Emergency', date: '12 May 2026', status: 'Approved', color: 'var(--success)', remarks: 'Urgent family emergency travel approved by Class Teacher Eleanor.' },
                { type: 'Medical', date: '04 Apr 2026', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting doctor\'s prescription or school clinic certificate verification.' },
                { type: 'Special', date: '15 Mar 2026', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Devon representing school at state-level science exhibition.' },
                { type: 'Sick', date: '28 Feb 2026', status: 'Rejected', color: 'var(--danger)', remarks: 'Rejected due to absence of valid medical notice or notification delay.' },
                { type: 'Personal', date: '10 Jan 2026', status: 'Approved', color: 'var(--success)', remarks: 'Pre-approved study leave for entrance preparation.' },
                { type: 'Study Leave', date: '05 Dec 2025', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Preparation for mathematical excellence entrance exam.' },
                { type: 'Medical', date: '18 Nov 2025', status: 'Approved', color: 'var(--success)', remarks: 'Approved: Dental surgery recovery leave.' },
                { type: 'Family Event', date: '22 Oct 2025', status: 'Rejected', color: 'var(--danger)', remarks: 'Rejected: Maximum casual leaves allowed for the quarter exceeded.' }
              ].map((leave, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast(`${leave.remarks}`, leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'error', `${leave.type} Leave`)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{leave.type}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leave.date}</p>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: `${leave.color}15`, color: leave.color }}>
                  {leave.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Tutor Analysis Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
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
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                width: '100%',
                maxWidth: '650px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>EduPro AI Analysis</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tailored feedback for {currentStudent.name}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsAIModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ minHeight: '260px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
                {isGeneratingAI ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '260px', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzing student profiles & synthesizing records...</p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {renderAIReport(aiReport)}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  className="btn" 
                  onClick={() => setIsAIModalOpen(false)}
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-main)', backgroundColor: 'transparent' }}
                >
                  Close
                </button>
                {!isGeneratingAI && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => downloadAIReport(currentStudent.name, aiReport)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={16} /> Download AI Analysis
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : toast.type === 'warning'
                  ? '#fbbf24'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentDashboard;
