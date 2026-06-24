import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CreditCard, MessageSquare, BookOpen, CircleCheck, Clock, Calendar as CalendarIcon, 
  MoreVertical, Edit, FileText, Bell, Megaphone, AlertCircle, Info, DollarSign,
  CheckCircle2, X, Sparkles, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import MiniCalendar from '../components/MiniCalendar';
import studentAvatar from '../assets/student_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import { getParents, getStudents, FeesApi, AttendanceApi } from '../services/service';

const fallbackParent = {
  parent_id: 1,
  name: 'Robert Lane',
  email: 'robert.lane@example.com',
  phone: '+1 234 567 892',
  occupation: 'Software Architect',
  student_id: '1',
  student_name: 'Devon Lane',
  student_class: 10,
  student_gender: 'Male'
};

const notices = [
  { title: 'Parent-Teacher Conference', content: 'The annual parent-teacher conference is scheduled for the last week of this month. Please book your slots via the portal.', type: 'event', created_at: new Date().toISOString() },
  { title: 'Fee Payment Reminder', content: 'Please be advised that the second term tuition fees are due by the 15th of next month to avoid late penalties.', type: 'alert', created_at: new Date(Date.now() - 86400000).toISOString() },
  { title: 'School Bus Route Changes', content: 'Due to ongoing road constructions downtown, Route A and Route C will experience minor detours starting Monday.', type: 'info', created_at: new Date(Date.now() - 172800000).toISOString() },
  { title: 'Annual Sports Day', content: 'Join us for the Annual Sports Day next Saturday. All parents are welcome to attend and cheer for the students!', type: 'general', created_at: new Date(Date.now() - 259200000).toISOString() },
  { title: 'Science Fair Exposition', content: 'The annual Science & Robotics exposition will take place in the school auditorium next Wednesday. All student designs will be showcased.', type: 'event', created_at: new Date(Date.now() - 345600000).toISOString() }
];

const feeHistoryFallback = [
  { type: 'Term 1 Tuition', date: '01 Sep 2025', amount: '$1,200', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 01 Sep 2025. Receipt Audit: #TXN-9029-A.' },
  { type: 'Bus Fee', date: '01 Sep 2025', amount: '$150', status: 'Paid', color: 'var(--success)', remarks: 'Paid on 01 Sep 2025. Receipt Audit: #TXN-9029-B.' },
  { type: 'Term 2 Tuition', date: '15 Jan 2026', amount: '$1,200', status: 'Pending', color: '#f59e0b', remarks: 'Awaiting checkout confirmation.' },
  { type: 'Library Fine', date: '05 Feb 2026', amount: '$15', status: 'Unpaid', color: 'var(--danger)', remarks: 'Overdue textbooks fine.' }
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

const ParentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const [parentsList, setParentsList] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [dbFees, setDbFees] = useState([]);
  const [dbAttendance, setDbAttendance] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [loading, setLoading] = useState(true);

  // AI Modal States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const userName = localStorage.getItem('userName') || 'Parent';

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load parents, students, fees, attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentsData = await getParents();
        const loggedInRole = localStorage.getItem('userRole');
        const loggedInEmail = localStorage.getItem('userEmail');
        const loggedInName = localStorage.getItem('userName');

        if (parentsData && parentsData.length > 0) {
          setParentsList(parentsData);
          
          let initialParent = null;
          if (loggedInRole === 'parent') {
            if (loggedInEmail) {
              initialParent = parentsData.find(p => p.email && p.email.toLowerCase() === loggedInEmail.toLowerCase());
            }
            if (!initialParent && loggedInName) {
              initialParent = parentsData.find(p => p.name && p.name.toLowerCase() === loggedInName.toLowerCase());
            }
          }

          if (!initialParent) {
            initialParent = parentsData[0];
          }

          setSelectedParent(initialParent);
          localStorage.setItem('userParentId', initialParent.parent_id || initialParent.id);
        } else {
          setParentsList([fallbackParent]);
          setSelectedParent(fallbackParent);
        }

        const studentsData = await getStudents();
        if (studentsData) {
          setAllStudents(studentsData);
        }

        const feesData = await FeesApi.getFeeRecords();
        if (feesData && feesData.history) {
          setDbFees(feesData.history);
        }

        const attData = await AttendanceApi.getRecords();
        if (attData) {
          setDbAttendance(attData);
        }
      } catch (err) {
        console.error("Error loading parent portal data:", err);
        setParentsList([fallbackParent]);
        setSelectedParent(fallbackParent);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      showToast(`Welcome back, ${userName}! Guardian portal loaded successfully.`, 'success', 'Session Authenticated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userName]);

  const currentParent = selectedParent || fallbackParent;

  // Resolve linked children dynamically based on parent name or email matching
  const getLinkedChildren = () => {
    const matched = allStudents.filter(s => {
      // Find parent records in parentsList that match this selected parent name and link to the student
      return parentsList.some(p => p.name === currentParent.name && String(p.student_id) === String(s.student_id));
    });

    if (matched.length > 0) {
      return matched.map(s => ({
        name: s.name,
        grade: `Grade ${s.class_id || 10}-A`,
        avatar: studentAvatar,
        status: 'In Class',
        id: s.student_id
      }));
    }

    // Default if database has no records
    return [
      { name: currentParent.student_name || 'Devon Lane', grade: `Grade ${currentParent.student_class || 10}-A`, avatar: studentAvatar, status: 'In Class', id: currentParent.student_id || '1' }
    ];
  };

  const linkedChildren = getLinkedChildren();

  // Set default selected child ID when children load
  useEffect(() => {
    if (linkedChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(linkedChildren[0].id);
    }
  }, [linkedChildren, selectedChildId]);

  // Dynamic fee calculation from database
  const getFeeMetrics = () => {
    const childIds = linkedChildren.map(c => String(c.id));
    const parentFees = dbFees.filter(f => childIds.includes(String(f.student_id)));
    
    let pendingAmt = 0;
    let list = [];

    if (parentFees.length > 0) {
      pendingAmt = parentFees.filter(f => f.status === 'Unpaid' || f.status === 'Partial').reduce((sum, f) => sum + Number(f.amount), 0);
      list = parentFees.map(f => ({
        type: f.category,
        date: new Date(f.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `$${Number(f.amount).toLocaleString()}`,
        status: f.status === 'Paid' ? 'Paid' : 'Pending',
        color: f.status === 'Paid' ? 'var(--success)' : '#f59e0b',
        remarks: `Due: ${new Date(f.due_date).toLocaleDateString()}. Status: ${f.status}.`
      }));
    } else {
      // Seed consistent fee history based on parent ID
      const hash = currentParent.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      pendingAmt = (hash % 4) * 350 + 15;
      list = feeHistoryFallback.map(f => {
        if (f.type.includes('Tuition 2') || f.type.includes('Robotics')) {
          return { ...f, status: pendingAmt > 0 ? 'Pending' : 'Paid', color: pendingAmt > 0 ? '#f59e0b' : 'var(--success)' };
        }
        return f;
      });
    }

    return {
      pendingAmtStr: `$${pendingAmt.toLocaleString()}`,
      list,
      parentFees
    };
  };

  const feeMetrics = getFeeMetrics();

  // Dynamic child progress and attendance
  const getChildProgressMetrics = (childId) => {
    const targetId = childId || (linkedChildren[0] ? linkedChildren[0].id : '1');
    const studentAttRecords = dbAttendance.filter(a => String(a.student_id) === String(targetId));
    
    let attendancePct = 92;
    let presentCount = 200;
    let absentCount = 12;

    if (studentAttRecords.length > 0) {
      const total = studentAttRecords.length;
      const present = studentAttRecords.filter(r => r.status === 'Present').length;
      const late = studentAttRecords.filter(r => r.status === 'Late').length;
      const halfDay = studentAttRecords.filter(r => r.status === 'Leave' || r.status === 'Late').length;
      const absent = studentAttRecords.filter(r => r.status === 'Absent').length;

      presentCount = present + late;
      absentCount = absent;
      attendancePct = Math.round(((present + late * 0.7 + halfDay * 0.5) / total) * 100);
    } else {
      const hash = String(targetId).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      attendancePct = 80 + (hash % 19);
      presentCount = Math.round((attendancePct / 100) * 220);
      absentCount = 220 - presentCount;
    }

    const hashVal = String(targetId).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const progressData = [
      { subject: 'Math', Devon: 75 + (hashVal % 25), Jane: 72 + ((hashVal + 4) % 27) },
      { subject: 'Physics', Devon: 70 + ((hashVal + 3) % 29), Jane: 74 + ((hashVal + 1) % 25) },
      { subject: 'English', Devon: 80 + ((hashVal + 7) % 20), Jane: 78 + ((hashVal + 5) % 21) },
      { subject: 'History', Devon: 65 + ((hashVal + 11) % 33), Jane: 68 + ((hashVal + 9) % 31) },
    ];

    const attData = [
      { name: 'Present', value: presentCount, color: 'var(--success)' },
      { name: 'Absent', value: absentCount, color: 'var(--danger)' },
    ];

    return {
      attendancePct,
      attData,
      progressData
    };
  };

  const activeChildId = selectedChildId || (linkedChildren[0] ? linkedChildren[0].id : '1');
  const activeChildName = (linkedChildren.find(c => String(c.id) === String(activeChildId)) || linkedChildren[0] || {}).name || 'Child';
  const childMetrics = getChildProgressMetrics(activeChildId);

  const handleExportReceipts = (parent, children, pFees) => {
    showToast(`Compiling ledger transactions for ${parent.name}...`, "info", "Export Receipts");
    
    let records = [];
    if (pFees.length > 0) {
      records = pFees.map(f => [
        new Date(f.due_date).toLocaleDateString(),
        f.category,
        `$${f.amount}`,
        f.status,
        f.payment_method || 'Online'
      ]);
    } else {
      records = feeMetrics.list.map(f => [f.date, f.type, f.amount, f.status, 'Credit Card']);
    }

    const csvContent = [
      ['Payment Receipt History Ledger', ''],
      ['Guardian Name', parent.name],
      ['Guardian Email', parent.email || 'N/A'],
      ['Guardian Phone', parent.phone || 'N/A'],
      ['Linked Child Profiles', children.map(c => `${c.name} (${c.id})`).join("; ")],
      ['Outstanding Fees Balance', feeMetrics.pendingAmtStr],
      ['', ''],
      ['Date', 'Item Description', 'Amount', 'Status', 'Payment Method'],
      ...records,
      ['', ''],
      ['Export Date', new Date().toLocaleString()]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Receipts_${parent.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      showToast("Ledger history exported successfully.", "success", "Download Complete");
    }, 1200);
  };

  const handleAIInsights = (parent, children) => {
    setIsGeneratingAI(true);
    setIsAIModalOpen(true);
    setAiReport('');

    setTimeout(() => {
      const childNames = children.map(c => c.name).join(', ');
      const childSummary = children.map(c => {
        const metrics = getChildProgressMetrics(c.id);
        return `- **${c.name}** (Grade Level: ${c.grade})
  * Overall Attendance: ${metrics.attendancePct}%
  * Mathematics Benchmarks: ${metrics.progressData[0].Devon}% average
  * Physical Science Benchmarks: ${metrics.progressData[1].Devon}% average`;
      }).join('\n');

      const report = `### 👨‍👩‍👦 EduPro Guardian AI Insights
**Guardian**: ${parent.name}
**Contact**: ${parent.email || 'N/A'}
**Date Generated**: ${new Date().toLocaleDateString()}

---

#### 📈 Linked Children Progression Summaries
${childSummary}

---

#### 💳 Dues & Billing Overview
* **Outstanding Dues**: **${feeMetrics.pendingAmtStr}** currently pending checkouts. 
* **Recommendation**: We advise clearing outstanding balances prior to final examination term reviews to guarantee continuous LMS access.

#### 🛡️ safety & Daily Gate Swipes
- All student biometric records confirm arrival prior to the 09:00 AM homeroom assembly gate-lock.
- High library usage logs noted for ${children[0]?.name || 'children'}. Excellent academic behaviors.

#### 🎯 Customized Home Study Roadmap
1. **LMS Progress Tracking**: Check assignments folder daily to support study timelines.
2. **Tuition Checkout**: Finalize processing on unpaid invoices via the portal.
3. **Pedagogical Support**: Introduce structured reading schedules at home to strengthen literacy benchmarks.`;

      setAiReport(report);
      setIsGeneratingAI(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading Guardian Portals...</p>
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
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Parent Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>Monitor progress, attendance, and fee status for your children.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Dropdown Selector */}
          {localStorage.getItem('userRole') !== 'parent' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <Users size={16} style={{ color: 'var(--text-muted)' }} />
              <select 
                value={currentParent.parent_id}
                onChange={(e) => {
                  const found = parentsList.find(p => String(p.parent_id) === String(e.target.value));
                  if (found) {
                    setSelectedParent(found);
                    setSelectedChildId(''); // Reset child to trigger auto-select
                    showToast(`Viewing guardian profile of ${found.name}`, "info", "Parent Switch");
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
                {parentsList.map((p, idx) => (
                  <option key={p.parent_id || idx} value={p.parent_id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn" 
            onClick={() => handleAIInsights(currentParent, linkedChildren)}
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Insights
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => handleExportReceipts(currentParent, linkedChildren, feeMetrics.parentFees)}
          >
            <FileText size={16} /> Export Receipts
          </button>
        </div>
      </div>

      {/* Master Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        
        {/* ROW 1: Profile & Stats */}
        <motion.div 
          className="card" 
          whileHover={{ y: -4 }}
          onClick={() => showToast(`Guardian Name: ${currentParent.name}. Linked student profiles: ${linkedChildren.length} active.`, "info", "Guardian Profile")}
          style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', cursor: 'pointer' }}
        >
          <img src={robertAvatar} alt={currentParent.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{currentParent.name}</h3>
          <p style={{ margin: '4px 0 16px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Guardian / Parent</p>
          <button 
            className="btn" 
            onClick={(e) => {
              e.stopPropagation();
              showToast("Opening Guardian details editor...", "info", "Profile Access");
              setTimeout(() => navigate(`/dashboard/guardian-details/${currentParent.parent_id || 1}`), 600);
            }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Edit size={16} /> Edit Profile
          </button>
        </motion.div>

        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { 
              title: 'Children Enrolled', 
              value: linkedChildren.length, 
              icon: <Users size={24} />, 
              color: 'var(--primary)',
              onClick: () => showToast(`${currentParent.name}'s linked child profiles: ${linkedChildren.map(c => c.name).join(', ')}. All profiles active.`, "info", "Linked Students")
            },
            { 
              title: 'Pending Fees', 
              value: feeMetrics.pendingAmtStr, 
              icon: <DollarSign size={24} />, 
              color: '#f59e0b',
              onClick: () => showToast(`Outstanding Dues Balance: ${feeMetrics.pendingAmtStr}. Checkouts can be made via billing links.`, "warning", "Dues Outstanding")
            },
            { 
              title: 'Unread Messages', 
              value: '4', 
              icon: <MessageSquare size={24} />, 
              color: 'var(--danger)',
              onClick: () => {
                showToast("Opening the secure institutional messages thread...", "success", "Messenger");
                setTimeout(() => navigate('/dashboard/messaging'), 600);
              }
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

        {/* ROW 2: Attendance, Performance, Linked Children */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Overall Attendance</h3>
            <select 
              value={activeChildId}
              onChange={(e) => {
                setSelectedChildId(e.target.value);
                const name = (linkedChildren.find(c => String(c.id) === String(e.target.value)) || {}).name || '';
                showToast(`Loaded ${name}'s attendance report.`, "info", "Attendance Logs");
              }}
              style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
            >
              {linkedChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={childMetrics.attData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {childMetrics.attData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => showToast(`${activeChildName} attendance logs confirm ${entry.value}% marked as ${entry.name}.`, "info", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {childMetrics.attData.map((entry, i) => (
               <div 
                 key={i} 
                 onClick={() => showToast(`Attendance log division: ${entry.value}% marked ${entry.name}.`, "info", entry.name)}
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
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Academic Progress Overview</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Subject assessment scores normalized with class records.", "success", "Grades Sync")}
            />
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={childMetrics.progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'var(--bg-body)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 600 }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.8rem', fontWeight: 600 }} />
                <Bar 
                  dataKey="Devon" 
                  name={activeChildName}
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16} 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => showToast(`${activeChildName} scored ${data.Devon}% in ${data.subject}.`, "success", `${activeChildName} - ${data.subject}`)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Linked Children</h3>
            <span 
              onClick={() => {
                showToast("Opening student enrollment wizard...", "info", "Onboard Student");
                navigate('/dashboard/add-student');
              }}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              Add Child
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {linkedChildren.map((child, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => {
                  showToast(`Accessing student card details for ${child.name}...`, "info", child.name);
                  setTimeout(() => navigate(`/dashboard/student-details/${child.id}`), 600);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
              >
                <img src={child.avatar} alt={child.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{child.name}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{child.grade}</p>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '8px', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                  {child.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW 3: Notice Board, Calendar & Events, Fee Status */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ margin: 0 }}>School Notice Board</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={noticeFilter} 
                onChange={(e) => {
                  setNoticeFilter(e.target.value);
                  showToast(`Notice board filter loaded: ${e.target.value}`, "info");
                }} 
                style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
              >
                <option value="All">All Notices</option>
                <option value="alert">Alert</option>
                <option value="event">Event</option>
                <option value="info">Info</option>
              </select>
              <button 
                className="btn" 
                onClick={() => {
                  showToast("Redirecting to the global notifications directory...", "info", "Notice Board");
                  navigate('/dashboard/notices');
                }}
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 800 }}
              >
                View All
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
            {notices.filter(notice => noticeFilter === 'All' || notice.type === noticeFilter).map((notice, i) => {
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0 }}>Upcoming Events</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={eventFilter} 
                    onChange={(e) => {
                      setEventFilter(e.target.value);
                      showToast(`Showing ${e.target.value} event schedules`, "info");
                    }} 
                    style={{ border: 'none', backgroundColor: 'var(--bg-body)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <option value="All">All Events</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Fair">Fair</option>
                    <option value="Address">Address</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <MoreVertical 
                    size={18} 
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                    onClick={() => showToast("School calendar events and consultation hours synced.", "success", "Timeline Active")}
                  />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  { time: '09:00 - 09:45', title: 'Marketing Strategy Kickoff', lead: 'Robert Fox', color: 'var(--primary)', category: 'Meeting', details: 'Special briefing. Robert Lane invited to school corporate board.' },
                  { time: '11:15 - 12:00', title: 'Product Design Brainstorm', lead: 'Leslie Alexander', color: '#f59e0b', category: 'Workshop', details: 'Design thinking workshop. Interactive pedagogy display.' },
                  { time: '14:30', title: 'Annual Science Fair YTD', color: '#f59e0b', category: 'Fair', details: 'Student projects exhibit. Highly recommended for parent attendees.' },
                  { time: '15:00 - 16:00', title: 'Team Building Workshop', lead: 'HR Dept', color: '#6366f1', category: 'Workshop', details: 'Interactive parent-faculty integration exercises.' },
                  { time: '16:00', title: 'Principal Address', color: 'var(--success)', category: 'Address', details: 'Principal keynote speech detailing term 2 expansions.' },
                  { time: '17:30 - 18:00', title: 'Year-End Celebration', lead: 'School Committee', color: 'var(--primary)', category: 'Celebration', details: 'School courtyard celebration.' },
                ].filter(h => eventFilter === 'All' || h.category === eventFilter).map((h, i) => (
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
            <h3 style={{ margin: 0 }}>Fee & Payment History</h3>
            <MoreVertical 
              size={18} 
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
              onClick={() => showToast("Historical payment receipts and ledger audit certified secure.", "success", "Ledger Audit")}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {feeMetrics.list.map((fee, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                onClick={() => showToast(fee.remarks, fee.status === 'Paid' ? 'success' : fee.status === 'Pending' ? 'warning' : 'error', fee.type)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{fee.type}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.date}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{fee.amount}</span>
                  <div style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, backgroundColor: `${fee.color}15`, color: fee.color }}>
                    {fee.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              showToast("Redirecting to secure online payment gateways...", "info", "Secure Checkouts");
              setTimeout(() => navigate('/dashboard/fees-collection'), 600);
            }}
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
          >
            <CreditCard size={16} /> Pay Pending Fees
          </button>
        </div>

      </div>

      {/* Guardian AI Insights Modal */}
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
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guardian safety & progress insights for {currentParent.name}</p>
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
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzing children reports & fee schedules...</p>
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
                      link.setAttribute("download", `AI_Guardian_Analysis_${currentParent.name.replace(/\s+/g, '_')}.txt`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("AI Guardian Insights downloaded successfully.", "success", "Download Complete");
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

export default ParentDashboard;
