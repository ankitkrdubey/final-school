import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Brain, Activity, Target, 
  BarChart, Zap, Clock, Star,
  ChevronRight, ArrowUpRight, Search, Layout, X,
  CheckCircle2, AlertCircle, RefreshCw, Sparkles, Filter, Plus, Printer, Sliders, MessageSquare, Award
} from 'lucide-react';

const CurriculumAI = () => {
  // 1. Dynamic Local Curriculum Database
  const [courses, setCourses] = useState([
    { name: 'Quantum Physics 101', difficulty: 'High', engagement: 88, health: 'Optimal', color: '#6366f1', recallRate: 74, rating: 4.6 },
    { name: 'Intro to Philosophy', difficulty: 'Low', engagement: 62, health: 'At-Risk', color: '#ef4444', recallRate: 58, rating: 3.9 },
    { name: 'Linear Algebra', difficulty: 'Medium', engagement: 94, health: 'Exceeding', color: '#10b981', recallRate: 88, rating: 4.8 },
    { name: 'Modern World History', difficulty: 'Medium', engagement: 79, health: 'Optimal', color: '#f59e0b', recallRate: 71, rating: 4.4 },
  ]);

  // Derived Aggregate Metrics
  const avgHealth = Math.round(courses.reduce((acc, c) => acc + c.engagement, 0) / courses.length);
  const avgRecall = Math.round(courses.reduce((acc, c) => acc + c.recallRate, 0) / courses.length);
  const avgRating = (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1);
  const engagementVelocity = (avgHealth / 60).toFixed(1) + 'x';

  // 2. Syllabus Optimization Recommendation State
  const [recommendations, setRecommendations] = useState([
    { 
      id: 'philosophy', 
      title: 'Philosophy Engagement Anomaly', 
      desc: 'Intro to Philosophy shows a 25% drop in engagement at the 40-minute mark. AI suggests breaking content into smaller 15-minute micro-modules.', 
      status: 'Pending', 
      actionLabel: 'Syllabus Refactor', 
      color: '#ef4444' 
    },
    { 
      id: 'linear', 
      title: 'Linear Algebra Optimization', 
      desc: 'Course effectiveness index is at 94%. Predictive modeling suggests releasing Advanced Module 4 earlier to capture student momentum.', 
      status: 'Pending', 
      actionLabel: 'Enable Fast-Track AP', 
      color: '#10b981' 
    }
  ]);

  // 3. Search & Modals State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); 
  // 'audit' | 'report' | 'add_course' | 'diagnostics' | 'recall_calibration' | 'rating_reviews' | 'course_detail' | null
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 4. Immersive Auditing Simulator State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  // 5. Spaced Repetition Calibration
  const [spacingInterval, setSpacingInterval] = useState(7); // days
  const [retentionMethod, setRetentionMethod] = useState('Active Recall'); // 'Active Recall' | 'Spaced Repetition' | 'Summarization'

  // 6. Quick Course Creation
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState('Medium');
  const [newCourseEngagement, setNewCourseEngagement] = useState(80);

  // 7. Toast Alerts
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const AUDIT_STEPS = [
    "Establishing connection with class lecture vector database...",
    "Indexing 4 major curriculum syllabi and learning modules...",
    "Telemetry scanning Quantum Physics transcript nodes...",
    "Cross-referencing textbook nodes with linear algebra metrics...",
    "NLP analysis on philosophy course feedback comments...",
    "Synthesizing recall indices and pacing diagnostics...",
    "Recalibrating course effectiveness model...",
    "Syllabus efficacy optimization registry updated!"
  ];

  // Audit Loop Effect
  useEffect(() => {
    if (!isAuditing) return;
    const interval = setInterval(() => {
      setAuditStep(prev => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply slight aggregate metrics optimization post-audit
            setCourses(prev => prev.map(c => ({
              ...c,
              engagement: Math.min(99, c.engagement + 4),
              recallRate: Math.min(99, c.recallRate + 3)
            })));
            setIsAuditing(false);
            setActiveModal(null);
            triggerToast("Autonomous neural syllabus audit concluded successfully!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isAuditing]);

  // Handle single course optimizations
  const applySingleOptimization = (recId) => {
    if (recId === 'philosophy') {
      setCourses(prev => prev.map(c => {
        if (c.name === 'Intro to Philosophy') {
          return { ...c, engagement: 78, recallRate: 72, health: 'Optimal', color: '#6366f1', rating: 4.2 };
        }
        return c;
      }));
      setRecommendations(prev => prev.map(r => r.id === 'philosophy' ? { ...r, status: 'Applied' } : r));
      triggerToast("Philosophy Syllabus Refactor applied! Pacing optimized.", "success");
    } else if (recId === 'linear') {
      setCourses(prev => prev.map(c => {
        if (c.name === 'Linear Algebra') {
          return { ...c, engagement: 98, recallRate: 96, health: 'Exceeding', rating: 4.9 };
        }
        return c;
      }));
      setRecommendations(prev => prev.map(r => r.id === 'linear' ? { ...r, status: 'Applied' } : r));
      triggerToast("Linear Algebra Fast-Track AP enabled! Content unlocked.", "success");
    }
  };

  // Handle Apply All Optimizations
  const applyAllOptimizations = () => {
    setCourses(prev => prev.map(c => {
      if (c.name === 'Intro to Philosophy') {
        return { ...c, engagement: 78, recallRate: 72, health: 'Optimal', color: '#6366f1', rating: 4.2 };
      }
      if (c.name === 'Linear Algebra') {
        return { ...c, engagement: 98, recallRate: 96, health: 'Exceeding', rating: 4.9 };
      }
      return {
        ...c,
        engagement: Math.min(99, c.engagement + 2),
        recallRate: Math.min(99, c.recallRate + 2)
      };
    }));
    setRecommendations(prev => prev.map(r => ({ ...r, status: 'Applied' })));
    triggerToast("All Curriculum Optimizations deployed successfully!", "success");
  };

  // Add a new course
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      triggerToast("Please enter a valid course title.", "error");
      return;
    }
    const newCourse = {
      name: newCourseName,
      difficulty: newCourseDifficulty,
      engagement: parseInt(newCourseEngagement),
      health: parseInt(newCourseEngagement) >= 90 ? 'Exceeding' : parseInt(newCourseEngagement) >= 75 ? 'Optimal' : 'At-Risk',
      color: parseInt(newCourseEngagement) >= 90 ? '#10b981' : parseInt(newCourseEngagement) >= 75 ? '#6366f1' : '#ef4444',
      recallRate: Math.floor(Math.random() * 20) + 65,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1))
    };

    setCourses(prev => [...prev, newCourse]);
    triggerToast(`Course "${newCourseName}" registered successfully!`, "success");
    setNewCourseName('');
    setActiveModal(null);
  };

  // Filter courses by search
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative' }}>
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              right: '24px', 
              zIndex: 99999, 
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '16px 24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#ef444425',
              color: toast.type === 'success' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Telemetry Success' : 'Curriculum Error'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</div>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '12px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <BookOpen size={16} /> CURRICULUM INTELLIGENCE CORE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Curriculum <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Predictive course efficacy auditing and student engagement analysis.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
             onClick={() => setActiveModal('report')}
             style={{ padding: '16px 28px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
             <Printer size={16} color="var(--text-muted)" /> Efficacy Report
           </button>
           <button 
             onClick={() => setActiveModal('add_course')}
             style={{ padding: '16px 28px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
             <Plus size={16} /> Register Course
           </button>
           <button 
             onClick={() => {
               setIsAuditing(true);
               setAuditStep(0);
               setActiveModal('audit');
             }}
             style={{ padding: '16px 28px', borderRadius: '18px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}
           >
             <Brain size={18} /> Neural Syllabus Audit
           </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { key: 'health', label: 'Avg. Course Health', value: `${avgHealth}%`, icon: Activity, color: '#6366f1', tag: 'DIAGNOSTICS' },
            { key: 'recall', label: 'Content Recall Rate', value: `${avgRecall}%`, icon: Brain, color: '#10b981', tag: 'CALIBRATE' },
            { key: 'velocity', label: 'Engagement Velocity', value: engagementVelocity, icon: Zap, color: '#f59e0b', tag: 'VELOCITY' },
            { key: 'rating', label: 'Student Rating Index', value: `${avgRating}/5`, icon: Star, color: '#ec4899', tag: 'FEEDBACK' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              onClick={() => setActiveModal(stat.key === 'health' ? 'diagnostics' : stat.key === 'recall' ? 'recall_calibration' : 'rating_reviews')}
              style={{ backgroundColor: 'var(--bg-card)', padding: '28px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <stat.icon size={20} />
                 </div>
                 <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '10px', backgroundColor: `${stat.color}15`, color: stat.color, fontWeight: 800 }}>{stat.tag}</span>
               </div>
               <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
            </motion.div>
          ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Course Effectiveness Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden', gridColumn: 'span 2' }}>
           <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Course Efficacy Matrix</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-body)', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <Search size={16} color="var(--text-muted)" />
                <input 
                  type="text"
                  placeholder="Filter courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.8rem', width: '130px' }}
                />
              </div>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredCourses.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No courses match your search filter.
                </div>
              ) : (
                filteredCourses.map((course, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveModal('course_detail');
                    }}
                    style={{ 
                      padding: '24px 32px', 
                      borderBottom: i === filteredCourses.length - 1 ? 'none' : '1px solid var(--border-color)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1.2 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', border: '1px solid var(--border-color)' }}>
                           <Layout size={20} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 850, color: 'var(--text-main)' }}>{course.name}</div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>Difficulty: {course.difficulty} • Rating: {course.rating}/5</div>
                        </div>
                     </div>
                     <div style={{ flex: 1, padding: '0 32px' }}>
                        <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                           <div style={{ height: '100%', width: `${course.engagement}%`, backgroundColor: course.color, borderRadius: '4px' }}></div>
                        </div>
                     </div>
                     <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem' }}>{course.engagement}% Engagement</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: course.color, marginTop: '2px' }}>{course.health.toUpperCase()}</div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* AI Recommendations */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', justifySelf: 'stretch', boxShadow: 'var(--shadow-md)' }}>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Brain size={24} color="#6366f1" /> Syllabus Optimization
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {recommendations.map((rec, idx) => (
                <div key={idx} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', border: '1px solid #334155', position: 'relative' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                     <div style={{ fontSize: '0.9rem', fontWeight: 800, color: rec.status === 'Applied' ? '#10b981' : rec.color }}>{rec.title}</div>
                     {rec.status === 'Applied' && (
                       <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px', backgroundColor: '#10b98125', color: '#10b981', fontWeight: 800 }}>ACTIVE</span>
                     )}
                   </div>
                   <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>{rec.desc}</p>
                   
                   {rec.status !== 'Applied' ? (
                     <button 
                       onClick={() => applySingleOptimization(rec.id)}
                       style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#6366f1', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                     >
                       <Sparkles size={12} /> {rec.actionLabel}
                     </button>
                   ) : (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>
                       <CheckCircle2 size={14} /> Optimization Refactored
                     </div>
                   )}
                </div>
              ))}
           </div>
           
           {recommendations.some(r => r.status === 'Pending') ? (
             <button 
               onClick={applyAllOptimizations}
               style={{ marginTop: '24px', width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}
             >
               Apply All Optimizations
             </button>
           ) : (
             <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', backgroundColor: '#10b98115', border: '1px solid #10b98130', color: '#10b981', fontWeight: 900, fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               <CheckCircle2 size={16} /> All Syllabi Fully Optimized
             </div>
           )}
        </div>
      </div>

      {/* ================= MODALS & OVERLAYS ================= */}
      <AnimatePresence>
        {activeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isAuditing) {
                  setActiveModal(null);
                  setSelectedCourse(null);
                }
              }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(15,23,42,0.6)', 
                backdropFilter: 'blur(8px)',
                zIndex: -1
              }} 
            />

            {/* Neural Syllabus Auditing Progress overlay */}
            {activeModal === 'audit' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid #1e293b',
                  boxShadow: 'var(--shadow-xl)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: 'auto'
                }}
              >
                <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #6366f120', borderTopColor: '#6366f1' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                    <Brain size={32} />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Auditing Curriculum Map</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Analyzing organic pacing and retention indexes</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((auditStep + 1) / AUDIT_STEPS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#6366f1' }}
                  />
                </div>

                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#020617', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: '#10b981', 
                  textAlign: 'left',
                  height: '130px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {AUDIT_STEPS.slice(0, auditStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === auditStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Register Course Modal */}
            {activeModal === 'add_course' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '480px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Register New Curriculum Course
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      COURSE TITLE
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Advanced Biology"
                      value={newCourseName}
                      onChange={e => setNewCourseName(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        SYLLABUS DIFFICULTY
                      </label>
                      <select 
                        value={newCourseDifficulty}
                        onChange={e => setNewCourseDifficulty(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        INITIAL ENGAGEMENT (%)
                      </label>
                      <input 
                        type="number"
                        min="30"
                        max="100"
                        value={newCourseEngagement}
                        onChange={e => setNewCourseEngagement(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
                  >
                    Register Course
                  </button>
                </form>
              </motion.div>
            )}

            {/* Efficacy Report Letter Modal */}
            {activeModal === 'report' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  color: '#0f172a',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '600px',
                  maxWidth: '100%',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="#6366f1" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '1px' }}>
                      Executive Syllabus Audit Report
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Audit Letter content */}
                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '20px', fontFamily: "'Merriweather', serif", lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '24px', backgroundColor: '#fafbfd', maxHeight: '350px', overflowY: 'auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Alexandria Academy</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Global Curriculum Efficacy Board</div>
                    <div style={{ height: '1px', width: '60px', backgroundColor: '#e2e8f0', margin: '12px auto' }}></div>
                  </div>

                  <p style={{ fontWeight: 800, marginBottom: '12px' }}>TO: The Executive Board of Trustees</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>DATE: {new Date().toLocaleDateString()}</p>

                  <p style={{ marginBottom: '16px' }}>
                    This document serves as an official AI Efficacy Certificate for registered institutional courses at Alexandria Academy. Cognitive retention neural models have scanned learning maps to verify lesson delivery pacing.
                  </p>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', margin: '20px 0 10px' }}>Active Syllabus Efficacy Ratings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {courses.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                        <span>{c.name}</span>
                        <strong>{c.engagement}% Engagement ({c.health})</strong>
                      </div>
                    ))}
                  </div>

                  <p style={{ marginBottom: '16px' }}>
                    Average curriculum metrics are evaluated at <strong>{avgHealth}% Course Health</strong> with a student content recall factor of <strong>{avgRecall}%</strong>.
                  </p>

                  <p style={{ marginBottom: '32px' }}>
                    Signed for registry validation,
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Dr. Clara Vance</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Dean of Academics</div>
                    </div>
                    <div style={{ opacity: 0.1 }}>
                      <Award size={48} />
                    </div>
                  </div>
                </div>

                {/* Print controls */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Report
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Print Executive Report
                  </button>
                </div>
              </motion.div>
            )}

            {/* Average Course Health Diagnostics */}
            {activeModal === 'diagnostics' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Course Health Diagnostics
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Distribution of active student syllabus progression indicators. Optimal parameters maintain course heath scores above 75%.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {courses.map((c, i) => (
                      <div key={i} style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Syllabus Coverage: {Math.min(99, c.recallRate + 8)}%</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: c.color }}>{c.health.toUpperCase()} ({c.engagement}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Spaced Repetition / Content Recall Calibration */}
            {activeModal === 'recall_calibration' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Brain size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Cognitive Recall Calibrator
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Adjust spaced repetition thresholds to observe simulated cognitive retention shifts. Shorter spacing reviews yield higher immediate content recall indexes.
                  </p>

                  {/* Calibration slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      <span>Review Spacing Interval</span>
                      <span style={{ color: '#10b981' }}>Every {spacingInterval} Days</span>
                    </div>
                    <input 
                      type="range"
                      min="2"
                      max="14"
                      step="1"
                      value={spacingInterval}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setSpacingInterval(val);
                        // Scale courses recall Rate based on spacing delay
                        const offset = (7 - val) * 2.5; // positive if short, negative if long
                        setCourses(prev => prev.map(c => ({
                          ...c,
                          recallRate: Math.min(99, Math.max(40, Math.round(c.recallRate + offset * 0.2)))
                        })));
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      RETENTION STRATEGY POLICY
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {['Active Recall', 'Spaced Repetition', 'Summarization'].map(method => (
                        <button
                          key={method}
                          onClick={() => {
                            setRetentionMethod(method);
                            const boost = method === 'Active Recall' ? 6 : method === 'Spaced Repetition' ? 4 : -5;
                            setCourses(prev => prev.map(c => ({
                              ...c,
                              recallRate: Math.min(99, Math.max(40, c.recallRate + boost))
                            })));
                            triggerToast(`Retention policy switched to ${method}!`, "success");
                          }}
                          style={{ 
                            padding: '12px 8px', 
                            borderRadius: '12px', 
                            border: retentionMethod === method ? '2px solid #10b981' : '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-body)', 
                            color: 'var(--text-main)', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Student Ratings & Feedback Reviews list */}
            {activeModal === 'rating_reviews' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '520px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="#ec4899" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Student Rating Metrics
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Sentiment analysis feedback feeds compiled from student quarterly syllabus reviews.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                    {[
                      { student: 'Alex Mercer', course: 'Quantum Physics', review: 'Robotics AP lab is incredible. The pacing can be tough but highly engaging!', rating: 5, sentiment: 'Positive' },
                      { student: 'Clara Oswald', course: 'Intro to Philosophy', review: 'Too much heavy reading at the end, hard to keep up.', rating: 3.5, sentiment: 'Mixed' },
                      { student: 'James Holden', course: 'Linear Algebra', review: 'Best math curriculum I have ever done. Highly logical pacing.', rating: 5, sentiment: 'Positive' },
                      { student: 'Naomi Nagata', course: 'Modern World History', review: 'Well structured but could use more video lectures.', rating: 4, sentiment: 'Positive' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          <span>{item.student} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({item.course})</span></span>
                          <span style={{ color: '#ec4899' }}>{item.rating} ★</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>"{item.review}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Clicked Course Deep Dive analysis Drawer */}
            {activeModal === 'course_detail' && selectedCourse && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '540px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Syllabus Diagnostics: {selectedCourse.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedCourse(null);
                    }}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  
                  {/* Status Block */}
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>RETENTION RATING</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                        {selectedCourse.recallRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DIFFICULTY INDEX</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 950, color: selectedCourse.color, marginTop: '4px' }}>
                        {selectedCourse.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Difficulty Calibration Slider */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      ADJUST SYLLABUS DIFFICULTY MODEL
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {['Low', 'Medium', 'High'].map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            // Adjust level
                            setCourses(prev => prev.map(c => {
                              if (c.name === selectedCourse.name) {
                                let newEngagement = c.engagement;
                                let newColor = c.color;
                                if (level === 'Low') { newEngagement = Math.min(99, c.engagement + 12); newColor = '#6366f1'; }
                                if (level === 'Medium') { newEngagement = Math.max(50, c.engagement + 2); newColor = '#10b981'; }
                                if (level === 'High') { newEngagement = Math.max(40, c.engagement - 10); newColor = '#ef4444'; }
                                return { ...c, difficulty: level, engagement: newEngagement, color: newColor };
                              }
                              return c;
                            }));
                            setSelectedCourse(prev => ({ ...prev, difficulty: level }));
                            triggerToast(`Course difficulty level calibrated to ${level}!`, "success");
                          }}
                          style={{ 
                            padding: '12px 8px', 
                            borderRadius: '12px', 
                            border: selectedCourse.difficulty === level ? `2px solid ${selectedCourse.color}` : '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-body)', 
                            color: 'var(--text-main)', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Adjusting difficulty dynamically updates predicted student engagement profiles. Highly rigorous syllabus content can trigger low engagement warnings on initial modules.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedCourse(null);
                    }}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Course Drawer
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
};

export default CurriculumAI;
