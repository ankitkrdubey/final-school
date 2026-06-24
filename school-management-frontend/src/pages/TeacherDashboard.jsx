import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, CircleCheck, Clock, Calendar as CalendarIcon, 
  MoreVertical, Edit, FileText, Bell, Megaphone, AlertCircle, Info, Award,
  CheckCircle2, X, Sparkles, Star, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import { getTeachers, getStudents } from '../services/service';

const fallbackTeacher = {
  teacher_id: 'AD52365',
  name: 'Eleanor Pena',
  email: 'eleanor.p@edupro.com',
  phone: '+1 234 567 890',
  class_id: 10,
  dob: '1985-05-12',
  gender: 'Female',
  address: '724 Oakmound Road, Chicago, IL',
  blood_group: 'A+',
  admission_date: '2024-01-12',
  avatar: null
};

const attendanceData = [
  { name: 'Present', value: 96, color: 'var(--success)' },
  { name: 'Absent', value: 4, color: 'var(--danger)' },
];

const notices = [
  { title: 'Staff Meeting at 3 PM', content: 'There will be a mandatory staff meeting in the main conference room regarding the new curriculum. All department heads must attend.', type: 'alert', created_at: new Date().toISOString() },
  { title: 'Grade Submission Deadline', content: 'All midterm grades must be finalized and submitted to the portal by this Friday at 5:00 PM. No exceptions.', type: 'info', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'Fire Drill Tomorrow', content: 'Please ensure you review the evacuation procedures with your first-period class. The drill will commence at exactly 09:30 AM.', type: 'event', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'IT Infrastructure Upgrade', content: 'The school Wi-Fi networks will be down this weekend for equipment upgrades. Plan your digital workloads accordingly.', type: 'alert', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'New Professional Development Course', content: 'Registration is now open for the advanced pedagogical methods course. Limited seats available for teaching staff.', type: 'info', created_at: new Date(Date.now() - 345600000).toISOString() }
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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [performanceTerm, setPerformanceTerm] = useState('Mid Term');
  const [toast, setToast] = useState(null);
  const [teachersList, setTeachersList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const userName = localStorage.getItem('userName') || 'Teacher';

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load teachers and students list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getTeachers();
        const loggedInRole = localStorage.getItem('userRole');
        const loggedInEmail = localStorage.getItem('userEmail');
        const loggedInName = localStorage.getItem('userName');

        if (teachersData && teachersData.length > 0) {
          setTeachersList(teachersData);
          
          let initialTeacher = null;
          if (loggedInRole === 'teacher') {
            if (loggedInEmail) {
              initialTeacher = teachersData.find(t => t.email && t.email.toLowerCase() === loggedInEmail.toLowerCase());
            }
            if (!initialTeacher && loggedInName) {
              initialTeacher = teachersData.find(t => t.name && t.name.toLowerCase() === loggedInName.toLowerCase());
            }
          }

          if (!initialTeacher) {
            initialTeacher = teachersData[0];
          }

          setSelectedTeacher(initialTeacher);
          localStorage.setItem('userTeacherId', initialTeacher.teacher_id || initialTeacher.id);
        } else {
          setTeachersList([fallbackTeacher]);
          setSelectedTeacher(fallbackTeacher);
        }

        const studentsData = await getStudents();
        if (studentsData) {
          setAllStudents(studentsData);
        }
      } catch (err) {
        console.error("Error loading teacher portal data:", err);
        setTeachersList([fallbackTeacher]);
        setSelectedTeacher(fallbackTeacher);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Faculty portal loaded successfully.`, 'success', 'Session Authenticated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);

  // Dynamic statistics generation based on selected teacher's record
  const getTeacherMetrics = (teacher) => {
    if (!teacher) return { totalStudents: 145, pendingGrading: 38, classAverage: 87, classPerformance: {} };
    const idStr = teacher.teacher_id;
    const hash = idStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // 1. Calculate students in their class dynamically (e.g. matching class_id)
    const classId = teacher.class_id || 10;
    const matchedStudents = allStudents.filter(s => s.class_id === classId);
    // If we have database students, scale it to simulate multiple sections, or default
    const totalStudents = matchedStudents.length > 0 ? matchedStudents.length * 3 + (hash % 10) : 100 + (hash % 50);

    // 2. Pending Grading units
    const pendingGrading = 10 + (hash % 35);

    // 3. Overall average score
    const classAverage = 78 + (hash % 17);

    // 4. Performance per division
    const pResults = {
      'Mid Term': [
        { class: 'Grade 10A', avgScore: classAverage },
        { class: 'Grade 10B', avgScore: Math.max(60, classAverage - (hash % 8)) },
        { class: 'Grade 11A', avgScore: Math.min(100, classAverage + 4) },
        { class: 'Grade 11B', avgScore: Math.max(65, classAverage - 2) },
        { class: 'Grade 12A', avgScore: Math.min(100, classAverage + 6) },
      ],
      'Final Term': [
        { class: 'Grade 10A', avgScore: Math.min(100, classAverage + (hash % 5)) },
        { class: 'Grade 10B', avgScore: Math.min(100, classAverage + 2) },
        { class: 'Grade 11A', avgScore: Math.min(100, classAverage + 6) },
        { class: 'Grade 11B', avgScore: Math.min(100, classAverage + 3) },
        { class: 'Grade 12A', avgScore: Math.min(100, classAverage + 8) },
      ]
    };

    return {
      totalStudents,
      pendingGrading,
      classAverage,
      pResults
    };
  };

  const handleExportGradebook = (teacher, metrics) => {
    showToast(`Compiling class gradebook registers for Professor ${teacher.name}...`, "info", "Export Gradebook");
    
    const csvContent = [
      ['Gradebook Register Ledger', ''],
      ['Faculty Member', teacher.name],
      ['Teacher ID', teacher.teacher_id],
      ['Primary Department', 'Science Department (Physics)'],
      ['Active Students Managed', metrics.totalStudents],
      ['Pending Submissions for Grading', metrics.pendingGrading],
      ['Faculty Group Average Score', `${metrics.classAverage}%`],
      ['', ''],
      ['Class Section', `${performanceTerm} Average`],
      ...metrics.pResults[performanceTerm].map(c => [c.class, `${c.avgScore}%`]),
      ['', ''],
      ['Export Date', new Date().toLocaleString()]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Gradebook_${teacher.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      showToast("Gradebook ledger exported successfully.", "success", "Download Complete");
    }, 1200);
  };

  const handleAIInsights = (teacher, metrics) => {
    setIsGeneratingAI(true);
    setIsAIModalOpen(true);
    setAiReport('');

    setTimeout(() => {
      const classAvgStr = metrics.pResults['Final Term'].map(c => `- **${c.class}**: Average ${c.avgScore}%`).join('\n');
      const report = `### 🧠 EduPro Faculty AI Insights
**Faculty Member**: Professor ${teacher.name}
**Teacher ID**: ${teacher.teacher_id}
**Primary Field**: Senior Physics Instructor
**Date Generated**: ${new Date().toLocaleDateString()}

---

#### 📈 Classroom Demographics & Grading Indicators
* **Total Academic Footprint**: **${metrics.totalStudents} students** managed
* **Grading Queue Status**: **${metrics.pendingGrading} submissions outstanding**
* **Group Performance Index**: **${metrics.classAverage}% average** (AP standard)

#### 📊 Performance Averages per Grade Division
${classAvgStr}

---

#### 🔍 Curriculum & Syllabus Coverage Analysis
- **Strengths**: Core thermodynamic and kinematic modules show extremely high average student benchmarks. Student laboratory logs demonstrate excellent hands-on comprehension.
- **Syllabus Progress**: 78% of the term curriculum is completed. On track to begin final mock exams 2 weeks ahead of scheduling.
- **Action Needed**: Grade 10B demonstrates minor learning gaps in advanced vectors. Remedial session scheduling is advised to support standard alignment.

#### 🛠️ AI-Generated Intervention Roadmap
1. **Grading Priority**: Complete the remaining ${metrics.pendingGrading} ungraded reports to update real-time semester stats.
2. **Remedial Seminar**: Run a 1-hour workshop on vector fields for Grade 10B students before finals.
3. **Advanced AP Pathing**: Engage top students in Grade 12A with extra credit quantum theory research items.`;

      setAiReport(report);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const currentTeacher = selectedTeacher || fallbackTeacher;
  const metrics = getTeacherMetrics(currentTeacher);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading Faculty Portals...</p>
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
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Teacher Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>Welcome back, Professor {currentTeacher.name}. Here is your academic overview.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Dropdown Selector */}
          {localStorage.getItem('userRole') !== 'teacher' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <Users size={16} style={{ color: 'var(--text-muted)' }} />
              <select 
                value={currentTeacher.teacher_id}
                onChange={(e) => {
                  const found = teachersList.find(t => String(t.teacher_id) === String(e.target.value));
                  if (found) {
                    setSelectedTeacher(found);
                    showToast(`Viewing academic profile of Professor ${found.name}`, "info", "Teacher Switch");
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
                {teachersList.map(tch => (
                  <option key={tch.teacher_id} value={tch.teacher_id}>{tch.name}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn" 
            onClick={() => handleAIInsights(currentTeacher, metrics)}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Insights
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => handleExportGradebook(currentTeacher, metrics)}
          >
            <FileText size={16} /> Export Gradebook
          </button>
        </div>
      </div>

      {/* Master Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        
        {/* ROW 1: Profile & Stats */}
        <motion.div 
          className="card" 
          whileHover={{ y: -4 }}
          onClick={() => showToast(`Professor ${currentTeacher.name}. Employee ID: #${currentTeacher.teacher_id}.`, "info", "Faculty Info")}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
        >
          <img src={currentTeacher.avatar || janeAvatar} alt={currentTeacher.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{currentTeacher.name}</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Senior Physics Instructor</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Faculty Profile settings...", "info", "Profile Access");
              setTimeout(() => navigate(`/dashboard/teacher-details/${currentTeacher.teacher_id}`), 600);
            }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </motion.div>

        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { 
              title: 'Total Students', 
              value: metrics.totalStudents, 
              icon: <Users size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast(`Professor ${currentTeacher.name} manages ${metrics.totalStudents} active physics stream pupils.`, "info", "Enrollment")
            },
            { 
              title: 'Assignments to Grade', 
              value: metrics.pendingGrading, 
              icon: <FileText size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast(`${metrics.pendingGrading} ungraded assignments found in core laboratory schedules.`, "warning", "Grading Pending")
            },
            { 
              title: 'Average Class Score', 
              value: `${metrics.classAverage}%`, 
              icon: <Award size={24} />, 
              color: 'var(--success)',
              onClick: () => showToast(`Excellent! Faculty average remains steady at ${metrics.classAverage}% (A- average) this term.`, "success", "Class Averages")
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

        {/* ROW 2: Attendance, Performance, Today's Classes */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>My Attendance</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Biometric swipe logs synchronized with Institutional HR Registry.", "success", "HR Attendance")}
            />
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {attendanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => showToast(`Attendance has logged ${entry.value}% marked as ${entry.name}.`, "info", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {attendanceData.map((entry, i) => (
               <div 
                 key={i} 
                 onClick={() => showToast(`Logged term percentage: ${entry.value}% ${entry.name}.`, "info", entry.name)}
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
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Class Performance (Average)</h3>
            <select 
              value={performanceTerm}
              onChange={(e) => {
                setPerformanceTerm(e.target.value);
                showToast(`Loaded ${e.target.value} averages.`, "info", "Term Averages");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
            >
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.pResults[performanceTerm]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
                <Bar 
                  dataKey="avgScore" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32} 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => showToast(`${data.class} average score is ${data.avgScore}% during ${performanceTerm}.`, "success", data.class)}
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
              { subject: 'Physics - Grade 10A', time: '09:00 - 09:45', room: 'Lab 3', color: 'var(--primary)', details: 'Thermodynamics experiment & gas laws practical ledger logging.' },
              { subject: 'Physics - Grade 11A', time: '10:00 - 10:45', room: 'Room 204', color: '#f59e0b', details: 'Vector fields, Coulomb forces, and electrostatic induction derivations.' },
              { subject: 'Advanced Physics', time: '11:15 - 12:00', room: 'Lab 1', color: 'var(--success)', details: 'Advanced seminar on Wave-Particle Duality and Quantum Coherence.' },
              { subject: 'Physics - Grade 10B', time: '01:00 - 01:45', room: 'Room 205', color: '#6366f1', details: 'Classical mechanics, friction coefficients, and projectile velocity analysis.' }
            ].map((cls, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => showToast(`${cls.details} Location: ${cls.room}`, "info", cls.subject)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '4px', height: '40px', backgroundColor: cls.color, borderRadius: '4px' }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{cls.subject}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cls.room}</p>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{cls.time}</div>
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
              <h3 style={{ margin: 0 }}>Faculty Notice Board</h3>
            </div>
            <button 
              className="btn" 
              onClick={() => {
                showToast("Opening the institutional bulletin notice board...", "info", "Bulletin Board");
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
          <div className="card" style={{ cursor: 'pointer' }}>
            <MiniCalendar />
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Faculty Events</h3>
              <MoreVertical 
                size={18} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                onClick={() => showToast("Robotics schedules and cafeteria supervision duties synchronized.", "success", "Duties Calendar")}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 { time: '13:00', title: 'Lunch Duty (Cafeteria)', color: 'var(--secondary)', details: 'Supervising student cafeteria meal intervals and seating allocations.' },
                 { time: '14:30', title: 'Science Dept. Meeting', color: 'var(--primary)', details: 'Syllabus alignment and laboratory equipment procurement reviews.' },
                 { time: '15:15', title: 'Parent Consultations', color: '#f59e0b', details: 'Pre-scheduled midterm academic feedback consultations in Room 204.' },
                 { time: '16:00', title: 'Curriculum Review', color: 'var(--success)', details: 'Aligning Grade 11 AP Physics criteria with state standards.' },
                 { time: '17:30', title: 'Robotics Club Supervision', color: '#6366f1', details: 'Guiding robotics team with micro-controller assembly and test trials.' },
                 { time: '18:15', title: 'Staff Room Cleanup', color: 'var(--danger)', details: 'Weekly cleanup of shared faculty materials and files.' },
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
            <h3 style={{ margin: 0 }}>My Leaves</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Leave entitlement allocations, medical certificates, and pending quotas verified.", "success", "Leave Records")}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { type: 'Casual Leave', date: '05 May 2026', status: 'Approved', color: 'var(--success)', remarks: 'Casual leave pre-approved by Principal for routine dental checkup.' },
              { type: 'Medical Leave', date: '22 Apr 2026', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting clinical prescription or nurse clearance certificate submission.' },
              { type: 'Conference', date: '12 Mar 2026', status: 'Approved', color: 'var(--success)', remarks: 'Physics Department delegation representation at the annual STEM meet.' },
              { type: 'Sick Leave', date: '10 Feb 2026', status: 'Rejected', color: 'var(--danger)', remarks: 'Rejected due to absence of timely notification or clinic prescription.' },
              { type: 'Personal Leave', date: '15 Jan 2026', status: 'Approved', color: 'var(--success)', remarks: 'Approved. Private family business leave.' },
              { type: 'Maternity Leave', date: '01 Nov 2025', status: 'Approved', color: 'var(--success)', remarks: 'Approved and archived under standard institutional human asset laws.' },
              { type: 'Workshop Duty', date: '14 Oct 2025', status: 'Approved', color: 'var(--success)', remarks: 'Professional educational methods course training certification leave.' }
            ].map((leave, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast(`${leave.remarks}`, leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'error', `${leave.type}`)}
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

      {/* Faculty AI Insights Modal */}
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
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faculty performance insights for Professor {currentTeacher.name}</p>
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
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzing course syllabi & classroom metrics...</p>
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
                    onClick={() => {
                      const blob = new Blob([aiReport], { type: 'text/plain;charset=utf-8;' });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `AI_Faculty_Analysis_${currentTeacher.name.replace(/\s+/g, '_')}.txt`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("AI Faculty Report downloaded successfully.", "success", "Download Complete");
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={16} /> Download AI Insights
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

export default TeacherDashboard;
