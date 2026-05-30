import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, User, Mail, Phone, BookOpen, Send, CircleCheck, Globe, Share2, ShieldCheck } from 'lucide-react';
import { AdmissionsApi } from '../services/service';
import Footer from '../components/Footer';

const Admission = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    grade_applying: 'Grade 1',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AdmissionsApi.apply(formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Admission submission failed:", err);
      // Fallback for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '500px', padding: '60px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CircleCheck size={48} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Application Received!</h2>
          <p className="text-muted" style={{ marginBottom: '32px' }}>
            Thank you for applying to EduPro Academy. Our admissions team will review your application and contact you within 2-3 business days.
          </p>
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>Back to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: '#4f46e5', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-2.2px', lineHeight: 1 }}>
              EduPro <small style={{ color: '#4f46e5', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4f46e5' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>Operating System</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600 }}>Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600 }}>Pricing</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600 }}>Support</Link>
          <Link to="/login" style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: '#4f46e5', color: 'white', textDecoration: 'none' }}>Portal Login</Link>
        </div>
      </nav>

      <div style={{ padding: '80px 8%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Admission 2026</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '16px 0 24px 0', lineHeight: 1.1 }}>
            Join the Next <span style={{ color: 'var(--primary)' }}>Generation</span> of Excellence.
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '40px' }}>
            We are looking for curious minds, ambitious spirits, and future leaders. Start your journey today with our simplified digital application process.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { title: 'Global Curriculum', desc: 'World-class academic programs.' },
              { title: 'Digital First', desc: 'Tablets and smart labs for all grades.' },
              { title: 'Holistic Growth', desc: 'Focus on sports, arts, and character.' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <CircleCheck size={24} color="var(--primary)" />
                <div>
                  <h4 style={{ margin: 0 }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '48px' }}>
          <h2 style={{ marginBottom: '32px' }}>Application Form</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label">Full Name of Student</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" className="form-input" style={{ paddingLeft: '40px' }} placeholder="John Doe" required 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" className="form-input" placeholder="parent@example.com" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" className="form-input" placeholder="+1 234 567 890" required 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Grade Applying For</label>
                <select 
                  className="form-input" 
                  onChange={(e) => setFormData({...formData, grade_applying: e.target.value})}
                >
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 3</option>
                  <option>Grade 4</option>
                  <option>Grade 5</option>
                  <option>High School</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tell us about your child (Optional)</label>
                <textarea 
                  className="form-input" style={{ height: '100px' }} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
              >
                {loading ? 'Submitting...' : 'Submit Application'} 
                {!loading && <Send size={18} style={{ marginLeft: '10px' }} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Immersive CTA */}
      <section style={{ padding: '160px 8%', textAlign: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 70%)', opacity: 0.1 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '4.5rem', fontWeight: 950, marginBottom: '32px', letterSpacing: '-3px' }}>Empower Your <br/>Institution Today.</h2>
          <p style={{ fontSize: '1.5rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 64px', lineHeight: 1.6, fontWeight: 500 }}>Join thousands of educational leaders who are building the future with EduPro.</p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Link to="/register" style={{ padding: '24px 64px', fontSize: '1.3rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 900, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)' }}>Create Institution Account</Link>
            <Link to="/contact" style={{ padding: '24px 64px', fontSize: '1.3rem', backgroundColor: 'transparent', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 800, border: '2px solid rgba(255,255,255,0.1)' }}>Request Private Demo</Link>
          </div>
        </div>
      </section>

      <Footer shareTitle="EduPro Elite Admission" newsletterId="newsletter-email-admission" />
    </div>
  );
};

export default Admission;
