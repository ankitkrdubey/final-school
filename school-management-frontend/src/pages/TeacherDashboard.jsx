import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, CircleCheck, Clock, Calendar as CalendarIcon, 
  MoreVertical, Edit, FileText, Bell, Megaphone, AlertCircle, Info, Award,
  CheckCircle2, X, Sparkles, Star
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';

const performanceResultsData = {
  'Mid Term': [
    { class: 'Grade 10A', avgScore: 88 },
    { class: 'Grade 10B', avgScore: 76 },
    { class: 'Grade 11A', avgScore: 92 },
    { class: 'Grade 11B', avgScore: 85 },
    { class: 'Grade 12A', avgScore: 95 },
  ],
  'Final Term': [
    { class: 'Grade 10A', avgScore: 92 },
    { class: 'Grade 10B', avgScore: 82 },
    { class: 'Grade 11A', avgScore: 95 },
    { class: 'Grade 11B', avgScore: 88 },
    { class: 'Grade 12A', avgScore: 98 },
  ]
};

const attendanceData = [
  { name: 'Present', value: 95, color: 'var(--success)' },
  { name: 'Absent', value: 5, color: 'var(--danger)' },
];

const notices = [
  { title: 'Staff Meeting at 3 PM', content: 'There will be a mandatory staff meeting in the main conference room regarding the new curriculum. All department heads must attend.', type: 'alert', created_at: new Date().toISOString() },
  { title: 'Grade Submission Deadline', content: 'All midterm grades must be finalized and submitted to the portal by this Friday at 5:00 PM. No exceptions.', type: 'info', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'Fire Drill Tomorrow', content: 'Please ensure you review the evacuation procedures with your first-period class. The drill will commence at exactly 09:30 AM.', type: 'event', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'IT Infrastructure Upgrade', content: 'The school Wi-Fi networks will be down this weekend for equipment upgrades. Plan your digital workloads accordingly.', type: 'alert', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'New Professional Development Course', content: 'Registration is now open for the advanced pedagogical methods course. Limited seats available for teaching staff.', type: 'info', created_at: new Date(Date.now() - 345600000).toISOString() }
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [performanceTerm, setPerformanceTerm] = useState('Mid Term');
  const [toast, setToast] = useState(null);
  const userName = localStorage.getItem('userName') || 'Teacher';

  const getTeacherProfilePic = () => {
    try {
      const stored = localStorage.getItem('teachers');
      if (stored) {
        const list = JSON.parse(stored);
        const record = list.find(t => t.id === 'TCH-001' || t.teacherId === 'TCH-001');
        if (record && record.avatar) return record.avatar;
      }
    } catch (e) {}
    return janeAvatar;
  };

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Faculty portal loaded successfully.`, 'success', 'Session Authenticated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Teacher Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>Welcome back, Professor. Here is your academic overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={() => {
              showToast("Opening Faculty AI student analytics hub...", "success", "Faculty AI");
              setTimeout(() => navigate('/dashboard/faculty-ai'), 600);
            }}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Insights
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              showToast("Compiling master gradebook ledger spreadsheets...", "info", "Export Gradebook");
              const csvContent = [
                ['Class', 'Subject', 'Term', 'Class Average', 'Submissions graded'],
                ['Grade 10A', 'Physics', 'Mid Term', '88%', '32/32'],
                ['Grade 10B', 'Physics', 'Mid Term', '76%', '30/30'],
                ['Grade 11A', 'Physics', 'Mid Term', '92%', '28/28'],
                ['Grade 11B', 'Physics', 'Mid Term', '85%', '27/27'],
                ['Grade 12A', 'Advanced Physics', 'Mid Term', '95%', '28/28'],
                ['Instructor', 'Eleanor Pena'],
                ['Date Generated', new Date().toLocaleDateString()]
              ].map(e => e.join(",")).join("\n");
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `Gradebook_Professor_Eleanor.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => {
                showToast("Gradebook ledger exported successfully.", "success", "Download Complete");
              }, 1200);
            }}
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
          onClick={() => showToast(`Professor ${userName}. Department Head. Employee ID: #FAC-Physics-492.`, "info", "Faculty Info")}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
        >
          <img src={getTeacherProfilePic()} alt={userName} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{userName}</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Senior Physics Instructor</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Faculty Profile settings...", "info", "Profile Access");
              setTimeout(() => navigate('/dashboard/teacher-details/TCH-001'), 600);
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
              value: '145', 
              icon: <Users size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast("Professor Eleanor instructs 145 active students across four physics divisions.", "info", "Enrollment")
            },
            { 
              title: 'Assignments to Grade', 
              value: '38', 
              icon: <FileText size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast("38 ungraded submissions found. 18 in 'Electromagnetism Lab' & 20 in 'Quantum Theory Homework'.", "warning", "Grading Pending")
            },
            { 
              title: 'Average Class Score', 
              value: '87%', 
              icon: <Award size={24} />, 
              color: 'var(--success)',
              onClick: () => showToast("Excellent! Faculty group average score remains at 87% (A- standard) this semester.", "success", "Class Averages")
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
                      onClick={() => showToast(`Eleanor Pena has logged ${entry.value}% marked as ${entry.name}.`, "info", entry.name)}
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
                const val = e.target.value;
                setPerformanceTerm(val);
                const cumulative = val === 'Mid Term' ? '87.2%' : '91.0%';
                showToast(`Loaded ${val} averages. Cumulative teaching group average: ${cumulative}.`, "info", "Term Averages");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceResultsData[performanceTerm]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
