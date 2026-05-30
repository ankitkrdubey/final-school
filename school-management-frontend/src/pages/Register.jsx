import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, 
  ShieldCheck, CircleCheck, Sparkles, PartyPopper, UserCircle, Baby,
  LayoutDashboard, Zap, Activity, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../services/service';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    try {
        await register(formData);
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
        setError(err.message || 'Registration failed.');
    } finally {
        setLoading(false);
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: <UserCircle size={20} />, desc: 'Access your learning dashboard and grades.' },
    { id: 'teacher', label: 'Faculty', icon: <GraduationCap size={20} />, desc: 'Manage your classes and student performance.' },
    { id: 'parent', label: 'Parent', icon: <Baby size={20} />, desc: 'Monitor your child academic progress.' }
  ];

  if (isSuccess) {
    return (
      <div style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        backgroundColor: '#022c22', textAlign: 'center', padding: '20px', overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ maxWidth: '500px', zIndex: 1 }}
        >
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            style={{ 
              width: '120px', height: '120px', backgroundColor: '#10b981', borderRadius: '40px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', 
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)', color: 'white' 
            }}
          >
            <PartyPopper size={60} />
          </motion.div>
          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-2px' }}>Welcome!</h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '40px', fontWeight: 500 }}>
            Your account has been successfully created. You're now part of the <span style={{ color: '#10b981', fontWeight: 950 }}>EduPro</span> <small style={{ color: 'white', fontWeight: 900, fontSize: '0.75rem' }}>ELITE</small> family.
          </p>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 4, ease: "linear" }}
               style={{ height: '100%', backgroundColor: '#10b981' }}
             ></motion.div>
          </div>
          <p style={{ marginTop: '20px', color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>REDIRECTING TO LOGIN...</p>
        </motion.div>
        
        {/* Background Decorative Blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', backgroundColor: '#10b981', filter: 'blur(150px)', opacity: 0.1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', backgroundColor: '#059669', filter: 'blur(150px)', opacity: 0.1 }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', backgroundColor: 'white', 
      fontFamily: 'var(--font-main)', overflow: 'hidden'
    }}>
      {/* Left Panel: High-Impact Visuals */}
      <div style={{ 
        flex: 1.2, backgroundColor: '#022c22', padding: '80px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', color: 'white'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', backgroundColor: '#10b981', filter: 'blur(180px)', opacity: 0.15 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                width: '64px', height: '64px', borderRadius: '20px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)'
              }}
            >
              <GraduationCap size={36} />
            </motion.div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 950, letterSpacing: '-2.5px', color: '#1e293b', lineHeight: 1 }}>
                  EduPro <small style={{ color: '#10b981', fontSize: '0.9rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>Institutional Excellence</span>
              </div>
            </div>
          </motion.div>

          <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '32px', letterSpacing: '-2px' }}>
            Transforming <br/><span style={{ color: '#10b981' }}>Education</span> <br/>Together.
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#a7f3d0', maxWidth: '500px', lineHeight: 1.6, marginBottom: '60px' }}>
            Join a global network of excellence. Manage your academic journey with the world's most intelligent platform.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
            {[
              { icon: <Sparkles size={20} />, title: 'Intelligent Insights', text: 'AI-driven growth tracking' },
              { icon: <ShieldCheck size={20} />, title: 'Enterprise Security', text: 'Military-grade encryption' },
              { icon: <Zap size={20} />, title: 'Instant Sync', text: 'Real-time notifications' },
              { icon: <Activity size={20} />, title: 'Rich Analytics', text: 'Visual progress reports' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: '#10b981' }}>{item.icon}</div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', display: 'flex', gap: '30px', color: '#064e3b', fontSize: '0.85rem', fontWeight: 700 }}>
          <span>PRIVACY</span>
          <span>COMPLIANCE</span>
          <span>SUPPORT</span>
        </div>
      </div>

      {/* Right Panel: Multi-Step Registration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', backgroundColor: 'white' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ flex: 1, height: '6px', backgroundColor: step >= s ? '#10b981' : '#f1f5f9', borderRadius: '10px', transition: '0.3s' }}></div>
              ))}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px', marginBottom: '8px' }}>
              {step === 1 ? 'Start Journey' : 'Secure Access'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{step === 1 ? 'Select your role and enter details.' : 'Create your secure login credentials.'}</p>
          </div>

          <form onSubmit={handleRegister}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '12px', display: 'block', letterSpacing: '1px' }}>CHOOSE YOUR ROLE</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                    {roles.map((r) => (
                      <button 
                        key={r.id} type="button" onClick={() => setFormData({...formData, role: r.id})}
                        style={{ 
                          padding: '20px 10px', borderRadius: '20px', border: '2px solid',
                          borderColor: formData.role === r.id ? '#10b981' : '#f1f5f9',
                          backgroundColor: formData.role === r.id ? '#10b98105' : 'white',
                          color: formData.role === r.id ? '#1e293b' : '#64748b',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                          cursor: 'pointer', transition: '0.3s', fontSize: '0.85rem', fontWeight: 800
                        }}
                      >
                        <div style={{ color: formData.role === r.id ? '#10b981' : '#94a3b8' }}>{r.icon}</div>
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                      <input 
                        type="text" required className="premium-input" placeholder="e.g. John Wilson"
                        style={{ paddingLeft: '48px' }} value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '40px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>CONTACT NUMBER</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                      <input 
                        type="tel" required className="premium-input" placeholder="+1 (555) 000-0000"
                        style={{ paddingLeft: '48px' }} value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>INSTITUTIONAL EMAIL</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                      <input 
                        type="email" required className="premium-input" placeholder="yourname@school.com"
                        style={{ paddingLeft: '48px' }} value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '40px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>ACCOUNT PASSWORD</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                      <input 
                        type="password" required className="premium-input" placeholder="••••••••"
                        style={{ paddingLeft: '48px' }} value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: '16px' }}>
              {step === 2 && (
                <button 
                  type="button" onClick={() => setStep(1)}
                  style={{ 
                    flex: 0.3, padding: '18px', borderRadius: '16px', border: '2px solid #f1f5f9', 
                    backgroundColor: 'white', color: '#64748b', cursor: 'pointer', transition: '0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  flex: 1, padding: '18px', fontSize: '1rem', fontWeight: 800,
                  backgroundColor: '#10b981', border: 'none', borderRadius: '16px',
                  boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }} 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : step === 1 ? 'Continue' : 'Finalize Registration'} 
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
            Already registered? <Link to="/login" style={{ color: '#10b981', fontWeight: 800, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>

      <style>{`
        .premium-input { width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid #f1f5f9; background-color: #f8fafc; font-size: 1rem; transition: 0.3s ease; font-weight: 500; }
        .premium-input:focus { outline: none; border-color: #10b981; background-color: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
      `}</style>
    </div>
  );
};

export default Register;
