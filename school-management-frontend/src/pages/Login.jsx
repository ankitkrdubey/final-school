import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, 
  Users, UserCircle, LayoutDashboard, Zap, Eye, EyeOff,
  Baby, Heart, Bell, Activity, Clock, Library, BookOpen, FileText
} from 'lucide-react';
import { login } from '../services/service';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const location = useLocation();
  const [role, setRole] = useState(location.state?.initialRole || 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    if (location.state?.showLogoutToast) {
      setToast({ show: true, message: 'Logged out successfully! Security session terminated.', type: 'success' });
      // Clear the history state so that refreshing the page doesn't show the toast again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Attempt real authentication via service
      const data = await login(email, password);
      const userRole = data.role || role;
      const targetPath = userRole === 'teacher' ? '/dashboard/teacher'
        : userRole === 'student' ? '/dashboard/student'
        : userRole === 'parent' ? '/dashboard/parent'
        : '/dashboard';

      const userName = data.name || email.split('@')[0];

      setToast({ 
        show: true, 
        message: `Welcome back, ${userName.charAt(0).toUpperCase() + userName.slice(1)}! Opening your portal...`, 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate(targetPath, { state: { showLoginToast: true } });
      }, 1500);
    } catch (err) {
      console.warn("Backend auth failed, checking for Demo Bypass...");
      
      // Smart Role Detection for Demo Accounts
      const demoEmails = ['admin@school.com', 'teacher@school.com', 'parent@school.com', 'student@school.com'];
      const isDemoEmail = demoEmails.includes(email.toLowerCase());
      const isDemoPassword = password === 'demo123';
      
      if (isDemoEmail && isDemoPassword) {
        const detectedRole = email.split('@')[0];
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('userRole', detectedRole);
        localStorage.setItem('userId', `demo-${detectedRole}-001`);
        localStorage.setItem('userName', `Demo ${detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1)}`);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        const targetPath = detectedRole === 'teacher' ? '/dashboard/teacher'
          : detectedRole === 'student' ? '/dashboard/student'
          : detectedRole === 'parent' ? '/dashboard/parent'
          : '/dashboard';

        setToast({ 
          show: true, 
          message: `Demo Access Granted! Welcome, Demo ${detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1)}.`, 
          type: 'success' 
        });
        
        setTimeout(() => {
          navigate(targetPath, { state: { showLoginToast: true } });
        }, 1500);
      } else {
        setToast({ 
          show: true, 
          message: 'Invalid email or password! Please check your credentials or click auto-fill.', 
          type: 'error' 
        });
        setLoading(false);
      }
    }
  };

  const getAccentColor = () => {
    if (role === 'parent') return '#10b981'; // Emerald for Parents
    if (role === 'teacher') return '#f59e0b'; // Amber for Teachers
    if (role === 'student') return '#3b82f6'; // Blue for Students
    return '#4f46e5'; // Indigo for Admin
  };

  const roles = [
    { id: 'admin', label: 'Administrator', icon: <ShieldCheck size={18} /> },
    { id: 'teacher', label: 'Faculty Member', icon: <GraduationCap size={18} /> },
    { id: 'parent', label: 'Parent/Guardian', icon: <Baby size={18} /> },
    { id: 'student', label: 'Student Portal', icon: <UserCircle size={18} /> }
  ];

  const roleFeatures = {
    parent: [
      { icon: <Bell size={16} />, text: 'Live Attendance Alerts' },
      { icon: <Heart size={16} />, text: 'Academic Growth Tracking' },
      { icon: <Zap size={16} />, text: 'Instant Fee Payments' }
    ],
    admin: [
      { icon: <LayoutDashboard size={16} />, text: 'Centralized Institution Control' },
      { icon: <Users size={16} />, text: 'Multi-Role User Management' },
      { icon: <Activity size={16} />, text: 'Real-time Analytical Insights' }
    ],
    teacher: [
      { icon: <Clock size={16} />, text: 'Automated Attendance Tracking' },
      { icon: <FileText size={16} />, text: 'Smart Gradebook Management' },
      { icon: <Zap size={16} />, text: 'Instant Parent Communication' }
    ],
    student: [
      { icon: <BookOpen size={16} />, text: 'Personalized Learning Path' },
      { icon: <Zap size={16} />, text: 'Interactive Exam Results' },
      { icon: <Library size={16} />, text: 'Digital Library Access' }
    ]
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc',
      fontFamily: 'var(--font-main)', overflow: 'hidden'
    }}>
      {/* Premium Glassmorphic Success/Error Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ 
              position: 'fixed', top: '40px', right: '40px', zIndex: 1300,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#1e293b', 
              padding: '18px 28px',
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)', 
              fontWeight: 800,
              fontSize: '0.95rem'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              backgroundColor: toast.type === 'success' ? `${getAccentColor()}20` : 'rgba(239, 68, 68, 0.15)',
              color: toast.type === 'success' ? getAccentColor() : '#ef4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <ShieldCheck size={18} /> : <Lock size={18} />}
            </div>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Side Pane */}
      <div style={{ 
        flex: 1.2, backgroundColor: '#1e293b', position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px',
        color: 'white', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', backgroundColor: getAccentColor(), filter: 'blur(180px)', opacity: 0.15 }}></div>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none', color: 'white', marginBottom: '60px', position: 'relative', zIndex: 1 }}>
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              width: '60px', height: '60px', borderRadius: '18px', 
              backgroundColor: `${getAccentColor()}20`, border: `1px solid ${getAccentColor()}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: getAccentColor(),
              boxShadow: `0 10px 20px ${getAccentColor()}20`
            }}
          >
            <GraduationCap size={32} />
          </motion.div>
          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-2px', color: 'white', lineHeight: 1 }}>
              EduPro <small style={{ color: getAccentColor(), fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: getAccentColor() }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Institutional Excellence</span>
            </div>
          </div>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
            The Digital Heart of <br/>Your <span style={{ color: getAccentColor() }}>Institution.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '500px', lineHeight: 1.6, marginBottom: '48px' }}>
            Join 5,000+ schools globally in delivering a world-class digital experience for students, faculty, and families.
          </p>

          <div key={role} style={{ animation: 'fadeIn 0.5s ease' }}>
            <p style={{ fontWeight: 800, color: getAccentColor(), fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>
              {role} portal benefits
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {roleFeatures[role].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#cbd5e1' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: getAccentColor() }}>{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '40px', color: '#64748b', fontSize: '0.85rem' }}>
          <span>© 2026 EduPro Global</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>

      {/* Login Form Pane */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', backgroundColor: 'white' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: '#64748b' }}>Please select your role to access your portal.</p>
          </div>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {roles.map((r) => (
              <button 
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{ 
                  padding: '16px 12px', borderRadius: '16px', border: '2px solid',
                  borderColor: role === r.id ? getAccentColor() : '#f1f5f9',
                  backgroundColor: role === r.id ? `${getAccentColor()}05` : 'white',
                  color: role === r.id ? '#1e293b' : '#64748b',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  cursor: 'pointer', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '0.8rem', fontWeight: 700
                }}
              >
                <div style={{ color: role === r.id ? getAccentColor() : '#94a3b8' }}>{r.icon}</div>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                <input 
                  type="email" required className="premium-input" placeholder="name@school.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} required className="premium-input" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingLeft: '48px' }}
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1rem', backgroundColor: getAccentColor(), border: 'none', boxShadow: `0 10px 15px -3px ${getAccentColor()}30` }} disabled={loading}>
              {loading ? 'Authenticating...' : `Enter ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`} <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </button>
          </form>

          {/* Demo Helper */}
          <div style={{ 
            marginTop: '32px', padding: '20px', backgroundColor: '#f8fafc', 
            borderRadius: '20px', border: '1px dashed #e2e8f0' 
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>DEMO CREDENTIALS ({role.toUpperCase()})</p>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b' }}>
                     {role === 'admin' && 'admin@school.com'}
                     {role === 'teacher' && 'teacher@school.com'}
                     {role === 'parent' && 'parent@school.com'}
                     {role === 'student' && 'student@school.com'}
                   </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => { 
                    setEmail(`${role}@school.com`); 
                    setPassword('demo123'); 
                  }}
                  style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  AUTO-FILL
                </button>
             </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
             Don't have an account? <Link to="/register" style={{ color: getAccentColor(), fontWeight: 800, textDecoration: 'none' }}>Join Now</Link>
          </div>
        </div>
      </div>

      <style>{`
        .premium-input { width: 100%; padding: 16px 20px; border-radius: 12px; border: 2px solid #f1f5f9; background-color: #f8fafc; font-size: 1rem; transition: 0.3s ease; }
        .premium-input:focus { outline: none; border-color: ${getAccentColor()}; background-color: white; box-shadow: 0 0 0 4px ${getAccentColor()}10; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Login;
