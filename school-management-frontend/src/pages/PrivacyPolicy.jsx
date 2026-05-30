import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft, GraduationCap } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Lock size={24} />,
      title: 'Data Collection & Encryption',
      content: 'We collect institutional data including student records, faculty information, and financial logs. All data is encrypted using AES-256 standards both at rest and in transit.'
    },
    {
      icon: <Eye size={24} />,
      title: 'Usage Transparency',
      content: 'Information is utilized strictly for institutional management, pedagogical analytics, and administrative automation. We do not sell or trade institutional data to third-party entities.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Access Control',
      content: 'Role-based access control (RBAC) ensures that sensitive records are only accessible to authorized administrative personnel. Audit logs track every access attempt.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#94a3b8', fontFamily: 'var(--font-main)' }}>
      {/* Mini Header */}
      <nav style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 8%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
          <ChevronLeft size={20} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Back to Home</span>
        </Link>
      </nav>

      <main style={{ padding: '120px 8%', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '100px' }}
        >
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: '16px', marginBottom: '24px' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'white', marginBottom: '24px', letterSpacing: '-2px' }}>Privacy Protocol.</h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            At EduPro Elite, we treat institutional data with the highest level of sovereign security. 
            Our protocols are designed to exceed global academic data protection standards.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '120px' }}>
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                padding: '48px', backgroundColor: 'rgba(255,255,255,0.02)', 
                borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ color: '#4f46e5', marginBottom: '24px' }}>{section.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '16px' }}>{section.title}</h3>
              <p style={{ lineHeight: 1.8, fontSize: '1rem' }}>{section.content}</p>
            </motion.div>
          ))}
        </div>

        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'white', marginBottom: '48px' }}>Detailed Policy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: 1.8 }}>
             <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '12px' }}>1. Data Sovereignty</h4>
                <p>EduPro Elite acknowledges that all data uploaded to the platform remains the sole property of the respective institution. We act only as a processor and custodian of this data, implementing multi-layered security to prevent unauthorized egress.</p>
             </div>
             <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '12px' }}>2. AI Ethics & Privacy</h4>
                <p>Our predictive AI models utilize anonymized data aggregates to provide pedagogical insights. Personal Identifiable Information (PII) is never exposed to the training loops or third-party inference engines.</p>
             </div>
             <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '12px' }}>3. Regulatory Compliance</h4>
                <p>We maintain full compliance with GDPR, FERPA, and other regional educational data protection acts. Our systems are audited quarterly by external security partners to ensure zero-vulnerability status.</p>
             </div>
          </div>
        </section>
      </main>

      <Footer shareTitle="EduPro Privacy Protocol" newsletterId="newsletter-email-privacy" />
    </div>
  );
};

export default PrivacyPolicy;
