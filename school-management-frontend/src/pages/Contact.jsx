import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Mail, Phone, MapPin, Send, 
  Globe, Share2, MessageCircle, CircleCheck, 
  ArrowRight, ShieldCheck, Zap, Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', overflowX: 'hidden', color: isDark ? '#cbd5e0' : '#1e293b', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Premium Navbar */}
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: '#4f46e5', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-2.2px', lineHeight: 1, transition: 'color 0.3s ease' }}>
              EduPro <small style={{ color: '#4f46e5', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '6px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4f46e5' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease' }}>Operating System</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Pricing</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Support</Link>
          
          {/* Custom Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
              color: isDark ? '#f59e0b' : '#4f46e5',
              transition: 'all 0.3s ease',
              boxShadow: isDark ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 4px 12px rgba(79, 70, 229, 0.1)',
            }}
            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <Link to="/login" style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: '#4f46e5', color: 'white', textDecoration: 'none' }}>Portal Login</Link>
        </div>
      </nav>

      {/* Hero Section with Organic Shapes */}
      <section style={{ 
        padding: '180px 8% 100px', position: 'relative', textAlign: 'center',
        background: isDark ? 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 40%)' : 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', backgroundColor: '#4f46e5', filter: 'blur(150px)', opacity: isDark ? 0.15 : 0.07, zIndex: 0, transition: 'opacity 0.3s ease' }}></div>
        
        <span style={{ backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#eef2ff', color: '#4f46e5', padding: '8px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', border: isDark ? '1px solid rgba(79, 70, 229, 0.4)' : 'none', transition: 'all 0.3s ease' }}>Available 24/7</span>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#1e293b', margin: '24px 0', lineHeight: 1.1, transition: 'color 0.3s ease' }}>
          Let's Build the <span style={{ color: '#4f46e5' }}>Future Together.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '0 auto 60px', lineHeight: 1.6, transition: 'color 0.3s ease' }}>
          Whether you're a parent, student, or institutional partner, our specialized team is ready to assist you in your digital transition.
        </p>

        {/* Contact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
          
          {/* Elite Contact Form */}
          <div style={{ 
            backgroundColor: isDark ? '#1e293b' : 'white', padding: '60px', borderRadius: '32px', 
            boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)' : '0 25px 50px -12px rgba(0, 0, 0, 0.08)', border: isDark ? '1px solid #334155' : 'none', position: 'relative', zIndex: 1,
            transition: 'all 0.3s ease'
          }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'scaleIn 0.5s ease-out' }}>
                <div style={{ width: '100px', height: '100px', backgroundColor: isDark ? '#0f172a' : '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: isDark ? '1px solid #334155' : 'none' }}>
                   <CircleCheck size={50} />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>Inquiry Received</h2>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.1rem', maxWidth: '350px', margin: '0 auto', transition: 'color 0.3s ease' }}>A specialist from our team will contact you within 2-4 business hours.</p>
                <button className="btn btn-primary" style={{ marginTop: '40px', backgroundColor: '#4f46e5', border: 'none' }} onClick={() => setStatus('idle')}>Send New Inquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#cbd5e0' : '#475569', marginBottom: '10px', display: 'block', transition: 'color 0.3s ease' }}>FULL NAME</label>
                    <input type="text" className="premium-input" placeholder="Enter name..." required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#cbd5e0' : '#475569', marginBottom: '10px', display: 'block', transition: 'color 0.3s ease' }}>EMAIL ADDRESS</label>
                    <input type="email" className="premium-input" placeholder="name@example.com" required />
                  </div>
                </div>
                
                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#cbd5e0' : '#475569', marginBottom: '10px', display: 'block', transition: 'color 0.3s ease' }}>HOW CAN WE HELP?</label>
                  <select className="premium-input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}>
                    <option>General Inquiry</option>
                    <option>Admissions Portal</option>
                    <option>Technical Partnership</option>
                    <option>Billing & Finance</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '40px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#cbd5e0' : '#475569', marginBottom: '10px', display: 'block', transition: 'color 0.3s ease' }}>YOUR MESSAGE</label>
                  <textarea className="premium-input" rows="6" placeholder="Tell us more about your needs..." required style={{ resize: 'none' }}></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.1rem', backgroundColor: '#4f46e5', border: 'none', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Encrypting & Sending...' : 'Initiate Contact'} 
                  {status !== 'loading' && <ArrowRight size={20} style={{ marginLeft: '12px' }} />}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {[
               { icon: <Mail size={22} />, title: 'Direct Email', value: 'hello@edupro.io', desc: 'Expect a response within 4 hours.' },
               { icon: <Phone size={22} />, title: 'Voice Support', value: '+1 (800) EDU-PRO', desc: 'Mon-Fri, 9am - 6pm EST' },
               { icon: <MapPin size={22} />, title: 'Global Headquarters', value: 'Innovation Drive, CA', desc: 'The heart of EdTech excellence.' }
             ].map((card, i) => (
               <div key={i} className="elite-card" style={{ 
                 backgroundColor: isDark ? '#1e293b' : 'white', padding: '32px', borderRadius: '24px', 
                 display: 'flex', gap: '24px', alignItems: 'flex-start',
                 boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: isDark ? '1px solid #334155' : 'none', transition: 'all 0.3s ease'
               }}>
                  <div style={{ padding: '16px', backgroundColor: isDark ? '#0f172a' : '#f5f3ff', color: '#4f46e5', borderRadius: '16px', transition: 'background-color 0.3s ease' }}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>{card.title}</h4>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 800, color: '#4f46e5' }}>{card.value}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', transition: 'color 0.3s ease' }}>{card.desc}</p>
                  </div>
               </div>
             ))}

             {/* Stylized Map Placeholder */}
             <div style={{ 
                flex: 1, backgroundColor: isDark ? '#0b0f19' : '#1e293b', borderRadius: '24px', overflow: 'hidden', 
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isDark ? '1px solid #334155' : 'none', transition: 'all 0.3s ease'
             }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
                <div style={{ textAlign: 'center', zIndex: 1, padding: '40px' }}>
                   <Globe size={48} color="#4f46e5" style={{ marginBottom: '16px', animation: 'spin 10s linear infinite' }} />
                   <h4 style={{ color: 'white', marginBottom: '8px' }}>Global Presence</h4>
                   <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Supporting 5,000+ institutions across 45 countries.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer shareTitle="EduPro Elite Support" newsletterId="newsletter-email-contact" />

      <style>{`
        .premium-input { width: 100%; padding: 16px 20px; border-radius: 12px; border: 2px solid ${isDark ? '#334155' : '#f1f5f9'}; background-color: ${isDark ? '#0f172a' : '#f8fafc'}; color: ${isDark ? '#ffffff' : '#1e293b'}; font-size: 1rem; transition: 0.3s ease; }
        .premium-input:focus { outline: none; border-color: #4f46e5; background-color: ${isDark ? '#1e293b' : 'white'}; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .elite-card:hover { transform: translateX(10px); box-shadow: ${isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}; }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Contact;

